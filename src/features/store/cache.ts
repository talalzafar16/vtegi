import Redis from 'ioredis'

// Cache for distributor data (tokens, product info, prices). Redis when REDIS_URL is set (a container
// on the VPS, or Upstash), otherwise memory. If Redis is down, data is simply loaded fresh.
// Refresh times live in `refreshAt` below.

type Entry = { json: string; expires: number }
const shared = globalThis as { __storeRedis?: Redis; __storeMemory?: Map<string, Entry> }

function connect(url: string) {
  const client = new Redis(url, { maxRetriesPerRequest: 1, commandTimeout: 1000 })
  let down = false // log once per outage, not on every reconnect attempt
  client.on('error', (error) => {
    if (!down) console.error('[store-cache] Redis unavailable, loading fresh:', error.message)
    down = true
  })
  client.on('ready', () => (down = false))
  return client
}

// Kept on globalThis so hot reloads in development reuse them.
const redis = process.env.REDIS_URL
  ? (shared.__storeRedis ??= connect(process.env.REDIS_URL))
  : null
const memory = (shared.__storeMemory ??= new Map())
const inFlight = new Map<string, Promise<unknown>>()

async function read(keys: string[]): Promise<(string | null)[]> {
  if (keys.length === 0) return []
  if (redis) return redis.mget(...keys).catch(() => keys.map(() => null))
  const now = Date.now()
  return keys.map((key) => {
    const entry = memory.get(key)
    return entry && entry.expires > now ? entry.json : null
  })
}

async function write(entries: [key: string, value: unknown, ttl: number][]) {
  const live = entries.filter(([, , ttl]) => ttl > 0)
  if (live.length === 0) return
  if (redis) {
    const pipeline = redis.pipeline()
    for (const [key, value, ttl] of live) {
      pipeline.set(key, JSON.stringify(value), 'EX', Math.ceil(ttl))
    }
    await pipeline.exec().catch(() => undefined)
    return
  }
  for (const [key, value, ttl] of live) {
    if (memory.size >= 500) memory.delete(memory.keys().next().value!)
    memory.set(key, { json: JSON.stringify(value), expires: Date.now() + ttl * 1000 })
  }
}

/** Runs `load` once, even when several requests ask for the same key at the same time. */
function once<T>(key: string, load: () => Promise<T>) {
  const running = inFlight.get(key)
  if (running) return running as Promise<T>
  const promise = load().finally(() => inFlight.delete(key))
  inFlight.set(key, promise)
  return promise
}

/** The cached value, or `load` it and keep it for `ttl` seconds (login tokens). */
export async function cached<T>(
  key: string,
  ttl: number | ((value: T) => number),
  load: () => Promise<T>,
): Promise<T> {
  const [json] = await read([key])
  if (json !== null) return JSON.parse(json) as T
  return once(key, async () => {
    const value = await load()
    await write([[key, value, typeof ttl === 'function' ? ttl(value) : ttl]])
    return value
  })
}

const HOUR = 3600
type Stamped<T> = { value: T; refreshAt: number }

/** Next 6 AM or 6 PM US Eastern (VTEGI's time zone). */
function nextTwiceDaily(now = Date.now()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hourCycle: 'h23',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(now)
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0)
  const elapsed = part('hour') * HOUR + part('minute') * 60 + part('second')
  const next = [6 * HOUR, 18 * HOUR, 30 * HOUR].find((time) => time > elapsed)!
  return now + (next - elapsed) * 1000
}

/** When cached data is refreshed. Change the store's refresh times here. */
export const refreshAt = {
  /** Product lists, details and the Pax8 catalog: twice a day, 6 AM and 6 PM Eastern. */
  productInfo: () => nextTwiceDaily(),
  /** Distributor prices: every 2 hours. */
  prices: () => Date.now() + 2 * HOUR * 1000,
  /** Nothing found, or a lookup failed: try again soon. */
  retry: () => Date.now() + 10 * 60 * 1000,
}

/** How long a copy that is due for a refresh may still be shown while it refreshes. */
const SHOW_OLD = { productInfo: 2 * 24 * HOUR, prices: 2 * HOUR }

const keepSeconds = (at: number, showOld: number) => (at - Date.now()) / 1000 + showOld

/**
 * The cached value. Once `when(value)` has passed, the old value is still returned straight away
 * while a fresh one loads in the background, so visitors don't wait (only an empty cache does).
 */
export async function cachedStale<T>(
  key: string,
  when: (value: T) => number,
  load: () => Promise<T>,
  kind: keyof typeof SHOW_OLD = 'productInfo',
): Promise<T> {
  const refresh = () =>
    once(key, async () => {
      const value = await load()
      const at = when(value)
      const keep = keepSeconds(at, SHOW_OLD[kind])
      await write([[key, { value, refreshAt: at } satisfies Stamped<T>, keep]])
      return value
    })

  const [json] = await read([key])
  if (json === null) return refresh()
  const hit = JSON.parse(json) as Stamped<T>
  if (Date.now() > hit.refreshAt) {
    refresh().catch((error) => console.error('[store-cache] refresh failed', error))
  }
  return hit.value
}

const refreshing = new Set<string>()

/** `cachedStale` for prices of many products at once: one cache read, one load for all missing. */
export async function cachedPrices<T>(
  ids: string[],
  keyOf: (id: string) => string,
  load: (ids: string[]) => Promise<Map<string, T>>,
): Promise<Map<string, T>> {
  const save = async (toLoad: string[]) => {
    const values = await load(toLoad)
    const at = refreshAt.prices()
    const keep = keepSeconds(at, SHOW_OLD.prices)
    await write([...values].map(([id, value]) => [keyOf(id), { value, refreshAt: at }, keep]))
    return values
  }

  const found = await read(ids.map(keyOf))
  const result = new Map<string, T>()
  const missing: string[] = []
  const due: string[] = []
  ids.forEach((id, i) => {
    const json = found[i]
    if (json === null) return void missing.push(id)
    const hit = JSON.parse(json) as Stamped<T>
    result.set(id, hit.value)
    if (Date.now() > hit.refreshAt && !refreshing.has(keyOf(id))) due.push(id)
  })

  if (due.length > 0) {
    due.forEach((id) => refreshing.add(keyOf(id)))
    save(due)
      .catch((error) => console.error('[store-cache] price refresh failed', error))
      .finally(() => due.forEach((id) => refreshing.delete(keyOf(id))))
  }
  if (missing.length > 0) for (const [id, value] of await save(missing)) result.set(id, value)
  return result
}

export async function remove(key: string) {
  memory.delete(key)
  await redis?.del(key).catch(() => undefined)
}
