import { cached, cachedStale, refreshAt, remove } from '../cache'
import { VendorError, vendorFetch } from './http'
import type { PriceOption, ProductDetail, ProductSummary } from './types'

// Pax8 API (software and cloud subscriptions). Read-only: product catalog and pricing.

const BASE = 'https://api.pax8.com/v1'
const key = (name: string) => `store:pax8:${name}`

export const pax8Configured = () =>
  Boolean(process.env.PAX8_CLIENT_ID && process.env.PAX8_CLIENT_SECRET)

type Token = { value: string; expires: number }
let memoryToken: Token | null = null

/** Login token: memory → cache → Pax8 (about once a day). */
async function getToken(): Promise<string> {
  if (memoryToken && memoryToken.expires > Date.now()) return memoryToken.value
  const token = await cached<Token>(
    key('token'),
    (t) => (t.expires - Date.now()) / 1000,
    async () => {
      const response = await vendorFetch('Pax8', `${BASE}/token`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.PAX8_CLIENT_ID,
          client_secret: process.env.PAX8_CLIENT_SECRET,
          audience: 'https://api.pax8.com',
          grant_type: 'client_credentials',
        }),
      })
      const body = (await response.json().catch(() => ({}))) as {
        access_token?: string
        expires_in?: number
      }
      if (!response.ok || !body.access_token) {
        throw new VendorError('Pax8', response.status, 'login failed')
      }
      // Renew 10 minutes before it expires.
      return {
        value: body.access_token,
        expires: Date.now() + ((body.expires_in ?? 3600) - 600) * 1000,
      }
    },
  )
  memoryToken = token
  return token.value
}

/** Calls the API; on 401 gets a new token and retries once. */
async function pax8<T>(path: string, retried = false): Promise<T> {
  if (!pax8Configured()) throw new VendorError('Pax8', 0, 'not configured')
  const response = await vendorFetch('Pax8', `${BASE}${path}`, {
    headers: { authorization: `Bearer ${await getToken()}`, accept: 'application/json' },
  })
  if (response.status === 401 && !retried) {
    memoryToken = null
    await remove(key('token'))
    return pax8<T>(path, true)
  }
  if (!response.ok) throw new VendorError('Pax8', response.status, `request failed: ${path}`)
  return (await response.json()) as T
}

type RawProduct = {
  id: string
  name: string
  vendorName?: string
  sku?: string
  vendorSku?: string
}
type ProductList = { content?: RawProduct[]; page?: { totalPages?: number } }

const toProduct = (p: RawProduct): ProductSummary => ({
  vendor: 'pax8',
  id: p.id,
  partNumber: p.sku || p.vendorSku || '',
  // Microsoft's licences all end in "[New Commerce Experience]", which means nothing to customers.
  name: p.name.replace(/\s*\[New Commerce Experience\]/i, '').trim(),
  brand: (p.vendorName ?? '').trim(),
})

/** The whole Pax8 catalog (about 2,900 products, ~30 calls), refreshed in the background.
 * Pax8 has no categories, so the store sorts these itself (categories.ts). */
export function allProducts() {
  return cachedStale<ProductSummary[]>(key('products'), refreshAt.productInfo, async () => {
    const size = 100 // Pax8's maximum page size
    const first = await pax8<ProductList>(`/products?page=0&size=${size}`)
    const pages = first.page?.totalPages ?? 1
    const rest: ProductList[] = []
    for (let page = 1; page < pages; page += 10) {
      const batch = Array.from({ length: Math.min(10, pages - page) }, (_, i) =>
        pax8<ProductList>(`/products?page=${page + i}&size=${size}`),
      )
      rest.push(...(await Promise.all(batch)))
    }
    return [first, ...rest].flatMap((list) => list.content ?? []).map(toProduct)
  })
}

type RawDetail = RawProduct & { shortDescription?: string; description?: string }

const plainText = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

/** One product for its page. Null when Pax8 doesn't have it. */
export function product(productId: string) {
  return cachedStale<ProductDetail | null>(
    key(`product:${productId}`),
    (value) => (value ? refreshAt.productInfo() : refreshAt.retry()),
    async () => {
      let raw: RawDetail
      try {
        raw = await pax8<RawDetail>(`/products/${encodeURIComponent(productId)}`)
      } catch (error) {
        if (error instanceof VendorError && (error.status === 404 || error.status === 400))
          return null
        throw error
      }
      const summary = toProduct(raw)
      const description = plainText(raw.description || raw.shortDescription || '')
      return {
        ...summary,
        // Many products repeat their name as the description; that adds nothing.
        description: description && description !== summary.name ? description : null,
        facts: [],
      }
    },
  )
}

type RawPricing = {
  content?: {
    billingTerm?: string
    commitmentTerm?: string
    commitmentTermInMonths?: number
    unitOfMeasurement?: string
    rates?: { partnerBuyRate?: number; startQuantityRange?: number }[]
  }[]
}

/** Units priced per person, licence or device. Usage-based units (GB, workloads) need a manual quote. */
const UNITS: Record<string, string> = {
  user: 'user',
  users: 'user',
  seat: 'seat',
  seats: 'seat',
  license: 'license',
  licence: 'license',
  licenses: 'license',
  device: 'device',
  devices: 'device',
  'managed device': 'device',
  'managed devices': 'device',
  each: 'each',
}

const TERMS: Record<string, PriceOption['billingTerm']> = {
  Monthly: 'monthly',
  Annual: 'annual',
  'One-Time': 'one-time',
}

function optionLabel(billingTerm: PriceOption['billingTerm'], months: number | null) {
  if (billingTerm === 'one-time') return 'One-time purchase'
  const billed = billingTerm === 'annual' ? 'billed annually' : 'billed monthly'
  if (!months) return billingTerm === 'annual' ? 'Billed annually' : 'Billed monthly'
  if (months === 1) return 'Monthly, no commitment'
  return `${months / 12}-year commitment, ${billed}`
}

/** Ways to buy a product (monthly, annual or one-time) with VTEGI's cost per quantity tier.
 * Products that can't be priced simply get none (a manual quote). `fresh` skips the cache. */
export async function priceOptions(productId: string, { fresh = false } = {}) {
  if (fresh) return loadPriceOptions(productId)
  // A failed lookup (e.g. a huge price list timing out) is remembered briefly, so pages don't wait
  // on it; the product shows "Price on request" meanwhile.
  const result = await cachedStale<{ options: PriceOption[]; failed?: true }>(
    key(`pricing:${productId}`),
    (value) => (value.failed ? refreshAt.retry() : refreshAt.prices()),
    async () => {
      try {
        return { options: await loadPriceOptions(productId) }
      } catch (error) {
        if (!(error instanceof VendorError)) throw error
        return { options: [], failed: true }
      }
    },
    'prices',
  )
  return result.options
}

async function loadPriceOptions(productId: string): Promise<PriceOption[]> {
  const body = await pax8<RawPricing>(`/products/${encodeURIComponent(productId)}/pricing`)
  const options = (body.content ?? []).flatMap((entry): PriceOption[] => {
    const billingTerm = TERMS[entry.billingTerm ?? '']
    const unit = UNITS[(entry.unitOfMeasurement ?? '').toLowerCase()]
    if (!billingTerm || !unit) return []
    const tiers = (entry.rates ?? [])
      .filter((rate) => typeof rate.partnerBuyRate === 'number' && rate.partnerBuyRate > 0)
      .map((rate) => ({
        minQuantity: Math.max(1, rate.startQuantityRange ?? 1),
        cost: rate.partnerBuyRate!,
      }))
      .sort((a, b) => a.minQuantity - b.minQuantity)
    if (tiers.length === 0) return []
    const months = billingTerm === 'one-time' ? null : (entry.commitmentTermInMonths ?? null)
    return [
      {
        label: optionLabel(billingTerm, months),
        billingTerm,
        commitmentMonths: months,
        unit,
        tiers,
      },
    ]
  })

  const subscriptions = options.filter((option) => option.billingTerm !== 'one-time')
  const withTerm = subscriptions.filter((option) => option.commitmentMonths !== null)
  const oneTime = options.filter((option) => option.billingTerm === 'one-time')
  const result = [
    ...(withTerm.length > 0 ? withTerm : subscriptions),
    ...(oneTime.length === 1 ? oneTime : []),
  ]
  // Several prices for the same term (e.g. Acronis modules) can't be quoted automatically.
  const terms = new Set(result.map((o) => `${o.billingTerm}-${o.commitmentMonths}-${o.unit}`))
  return terms.size === result.length ? result : []
}

/** VTEGI's lowest cost per unit per month across a product's subscriptions (annual ÷ 12), or null. */
export function lowestMonthlyCost(options: PriceOption[]) {
  let lowest: { cost: number; unit: string } | null = null
  for (const option of options) {
    if (option.billingTerm === 'one-time') continue
    const cost = option.tiers[0].cost / (option.billingTerm === 'annual' ? 12 : 1)
    if (!lowest || cost < lowest.cost) lowest = { cost, unit: option.unit }
  }
  return lowest
}
