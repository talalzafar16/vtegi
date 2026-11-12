import type { Payload } from 'payload'

import { ingram, pax8 } from './vendors'

// Refreshes the distributor names behind the Store Categories dropdowns. Ingram has no categories
// endpoint, so its names come from sampling searches; Pax8 brands come from its full catalog.

const KEYWORDS = [
  'laptop',
  'notebook',
  'desktop',
  'workstation',
  'chromebook',
  'tablet',
  'monitor',
  'display',
  'server',
  'storage',
  'nas',
  'ssd',
  'hard drive',
  'memory',
  'processor',
  'graphics card',
  'switch',
  'router',
  'access point',
  'wireless',
  'firewall',
  'network',
  'transceiver',
  'ups',
  'pdu',
  'power',
  'rack',
  'cable',
  'hdmi',
  'ethernet',
  'fiber',
  'usb',
  'adapter',
  'docking station',
  'keyboard',
  'mouse',
  'headset',
  'webcam',
  'speaker',
  'printer',
  'toner',
  'scanner',
  'projector',
  'phone',
  'conference',
  'camera',
  'surveillance',
  'software',
  'antivirus',
  'backup',
  'license',
  'warranty',
  'service',
  'microsoft',
  'cisco',
  'fortinet',
  'vmware',
  'adobe',
]

/** A run still "running" after this long was interrupted (e.g. the server restarted). */
const STALE_MS = 30 * 60 * 1000

type Names = Map<string, number>

export type SyncReport = {
  ingramCategories: Names
  ingramBrands: Names
  pax8Brands: Names
  subCategories: Map<string, Names>
  added: number
}

type Progress = (message: string, force?: boolean) => Promise<void>

const tally = (map: Names, name: string | undefined) => {
  const clean = name?.trim()
  if (clean) map.set(clean, (map.get(clean) ?? 0) + 1)
}

async function collectNames(progress: Progress) {
  const ingramCategories: Names = new Map()
  const ingramBrands: Names = new Map()
  const subCategories = new Map<string, Names>()

  // Ingram: 2 pages of 100 per keyword, 4 searches at a time. A few failed searches are fine.
  const searches = KEYWORDS.flatMap((keyword) => [1, 2].map((page) => ({ keyword, page })))
  let succeeded = 0
  for (let i = 0; i < searches.length; i += 4) {
    const results = await Promise.allSettled(
      searches.slice(i, i + 4).map((s) => ingram.catalogPage({ ...s, pageSize: 100 })),
    )
    for (const result of results) {
      if (result.status !== 'fulfilled') continue
      succeeded++
      for (const p of result.value.products) {
        tally(ingramCategories, p.vendorCategory)
        tally(ingramBrands, p.brand)
        if (p.vendorCategory) {
          const subs = subCategories.get(p.vendorCategory) ?? new Map()
          tally(subs, p.vendorSubCategory)
          subCategories.set(p.vendorCategory, subs)
        }
      }
    }
    await progress(`Ingram Micro: ${i + results.length} of ${searches.length} searches`)
  }
  if (succeeded === 0) throw new Error('Ingram Micro could not be reached. Nothing was changed.')

  await progress('Pax8: reading the catalog', true)
  const pax8Brands: Names = new Map()
  for (const p of await pax8.allProducts()) tally(pax8Brands, p.brand)

  return { ingramCategories, ingramBrands, pax8Brands, subCategories }
}

/** Adds new names and updates counts. Never deletes, so Store Categories keep their links. */
async function saveNames(
  payload: Payload,
  distributor: 'ingram' | 'pax8',
  kind: 'category' | 'brand',
  names: Names,
) {
  const { docs } = await payload.find({
    collection: 'distributor-lists',
    where: { distributor: { equals: distributor }, kind: { equals: kind } },
    limit: 0,
    pagination: false,
  })
  const existing = new Map(docs.map((doc) => [doc.name, doc]))
  const changes = [...names].filter(([name, count]) => existing.get(name)?.productCount !== count)

  // Saved 8 at a time: one by one is slow against a remote database.
  for (let i = 0; i < changes.length; i += 8) {
    await Promise.all(
      changes.slice(i, i + 8).map(([name, count]) => {
        const doc = existing.get(name)
        return doc
          ? payload.update({
              collection: 'distributor-lists',
              id: doc.id,
              data: { productCount: count },
            })
          : payload.create({
              collection: 'distributor-lists',
              data: { distributor, kind, name, productCount: count },
            })
      }),
    )
  }
  return changes.filter(([name]) => !existing.has(name)).length
}

/** The sync in progress, if any. Runs that were interrupted are marked as failed. */
export async function currentSync(payload: Payload) {
  const { docs } = await payload.find({
    collection: 'store-syncs',
    where: { status: { equals: 'running' } },
    depth: 0,
  })
  let active = null
  for (const run of docs) {
    if (Date.now() - new Date(run.createdAt).getTime() < STALE_MS) {
      active = run
      continue
    }
    await payload.update({
      collection: 'store-syncs',
      id: run.id,
      data: {
        status: 'failed',
        finishedAt: new Date().toISOString(),
        error: 'Interrupted: the server stopped before the sync finished.',
      },
    })
  }
  return active
}

/** Records a new run in Sync History, or returns null when one is already running. */
export async function startSync(payload: Payload, userId?: number) {
  if (await currentSync(payload)) return null
  return payload.create({
    collection: 'store-syncs',
    data: { status: 'running', startedBy: userId, progress: 'Starting…' },
  })
}

export async function runSync(payload: Payload, runId: number, log?: (message: string) => void) {
  let lastSaved = 0
  const progress: Progress = async (message, force = false) => {
    log?.(message)
    // Saved at most every 5 seconds, so the admin can show it without slowing the sync down.
    if (!force && Date.now() - lastSaved < 5000) return
    lastSaved = Date.now()
    await payload
      .update({ collection: 'store-syncs', id: runId, data: { progress: message } })
      .catch(() => undefined)
  }

  try {
    const names = await collectNames(progress)
    await progress('Saving names', true)
    const added =
      (await saveNames(payload, 'ingram', 'category', names.ingramCategories)) +
      (await saveNames(payload, 'ingram', 'brand', names.ingramBrands)) +
      (await saveNames(payload, 'pax8', 'brand', names.pax8Brands))

    const summary =
      `Ingram Micro: ${names.ingramCategories.size} categories, ${names.ingramBrands.size} brands · ` +
      `Pax8: ${names.pax8Brands.size} brands · ${added} new`
    await payload.update({
      collection: 'store-syncs',
      id: runId,
      data: { status: 'success', finishedAt: new Date().toISOString(), progress: null, summary },
    })
    return { ...names, added } satisfies SyncReport
  } catch (error) {
    payload.logger.error({ err: error }, 'Distributor sync failed')
    await payload.update({
      collection: 'store-syncs',
      id: runId,
      data: {
        status: 'failed',
        finishedAt: new Date().toISOString(),
        progress: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
    return null
  }
}
