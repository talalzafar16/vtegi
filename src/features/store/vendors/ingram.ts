import { randomUUID } from 'node:crypto'

import { cached, cachedPrices, cachedStale, refreshAt, remove } from '../cache'
import { VendorError, vendorFetch } from './http'
import type { ProductDetail, ProductPage, ProductSummary, Stock } from './types'

// Ingram Micro Reseller API v6 (hardware). Read-only: catalog search and price & availability.

const HOST = 'https://api.ingrammicro.com:443'
const sandbox = () => process.env.INGRAM_SANDBOX === 'true'
const base = () => `${HOST}${sandbox() ? '/sandbox' : ''}/resellers/v6`
/** Cache keys include the environment, so sandbox and production data never mix. */
const key = (name: string) => `store:ingram:${sandbox() ? 'sandbox' : 'prod'}:${name}`

export const ingramConfigured = () =>
  Boolean(
    process.env.INGRAM_CLIENT_ID &&
    process.env.INGRAM_CLIENT_SECRET &&
    process.env.INGRAM_CUSTOMER_NUMBER,
  )

type Token = { value: string; expires: number }
let memoryToken: Token | null = null

/** Login token: memory → cache → Ingram (about once a day). */
async function getToken(): Promise<string> {
  if (memoryToken && memoryToken.expires > Date.now()) return memoryToken.value
  const token = await cached<Token>(
    key('token'),
    (t) => (t.expires - Date.now()) / 1000,
    async () => {
      const response = await vendorFetch('Ingram Micro', `${HOST}/oauth/oauth30/token`, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.INGRAM_CLIENT_ID ?? '',
          client_secret: process.env.INGRAM_CLIENT_SECRET ?? '',
        }),
      })
      const body = (await response.json().catch(() => ({}))) as {
        access_token?: string
        expires_in?: number
      }
      if (!response.ok || !body.access_token) {
        throw new VendorError('Ingram Micro', response.status, 'login failed')
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

/** Calls the API; on 401 gets a new token and retries once. "Record not found" means no results. */
async function ingram<T>(path: string, init: RequestInit = {}, retried = false): Promise<T | null> {
  if (!ingramConfigured()) throw new VendorError('Ingram Micro', 0, 'not configured')
  const response = await vendorFetch('Ingram Micro', `${base()}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${await getToken()}`,
      accept: 'application/json',
      'content-type': 'application/json',
      'IM-CustomerNumber': process.env.INGRAM_CUSTOMER_NUMBER ?? '',
      'IM-CountryCode': process.env.INGRAM_COUNTRY_CODE || 'US',
      'IM-CorrelationID': randomUUID().replace(/-/g, ''),
      'IM-SenderID': 'VTEGI-Website',
    },
  })
  if (response.status === 401 && !retried) {
    memoryToken = null
    await remove(key('token'))
    return ingram<T>(path, init, true)
  }
  if (response.status === 404) return null
  if (!response.ok)
    throw new VendorError('Ingram Micro', response.status, `request failed: ${path}`)
  return (await response.json()) as T
}

type CatalogItem = {
  ingramPartNumber: string
  vendorPartNumber?: string
  vendorName?: string
  description?: string
  extraDescription?: string
  category?: string
  subCategory?: string
  discontinued?: boolean | string
  authorizedToPurchase?: boolean | string
}

// Ingram sends these flags as "True"/"False" strings.
const isTrue = (value: unknown) => String(value).toLowerCase() === 'true'

/** Skips products that can't be bought: discontinued (Ingram keeps years of old parts and its
 * search can't exclude them) or not authorized for VTEGI. */
function toProduct(item: CatalogItem): ProductSummary | null {
  if (isTrue(item.discontinued)) return null
  if (item.authorizedToPurchase !== undefined && !isTrue(item.authorizedToPurchase)) return null
  return {
    vendor: 'ingram',
    id: item.ingramPartNumber,
    partNumber: item.vendorPartNumber || item.ingramPartNumber,
    name: (item.extraDescription || item.description || item.ingramPartNumber).trim(),
    brand: (item.vendorName ?? '').trim(),
    vendorCategory: item.category,
    vendorSubCategory: item.subCategory,
  }
}

type CatalogQuery = {
  category?: string
  brand?: string
  keyword?: string
  page?: number
  pageSize?: number
}

/** One catalog page, current products only. Category-only searches are mostly discontinued
 * parts, so the store adds a keyword or brand; asks for 50 so about 25 remain. */
export function catalogPage({ category, brand, keyword, page = 1, pageSize = 50 }: CatalogQuery) {
  const params = new URLSearchParams({ pageNumber: String(page), pageSize: String(pageSize) })
  if (category) params.set('category', category)
  if (brand) params.set('vendor', brand)
  if (keyword) params.set('keyword', keyword)

  return cachedStale<ProductPage>(
    key(`catalog:${params.toString()}`),
    (result) => (result.total === 0 ? refreshAt.retry() : refreshAt.productInfo()),
    async () => {
      const body = await ingram<{ recordsFound?: number; catalog?: CatalogItem[] }>(
        `/catalog?${params}`,
      )
      const products = (body?.catalog ?? [])
        .map(toProduct)
        .filter((p): p is ProductSummary => p !== null)
      return { total: body?.recordsFound ?? 0, products }
    },
  )
}

type DetailsResponse = {
  ingramPartNumber: string
  vendorPartNumber?: string
  upc?: string
  productCategory?: string
  productSubCategory?: string
  productAuthorized?: boolean | string
  indicators?: { isDiscontinuedProduct?: boolean }
  additionalInformation?: { length?: string; width?: string; height?: string }
}

/** "17.75 × 12.09 × 2.95 in" when Ingram gives all three sizes in inches. */
function dimensions(info: DetailsResponse['additionalInformation']) {
  const sizes = [info?.length, info?.width, info?.height].map(
    (size) => size?.match(/^([\d.]+) inches$/)?.[1],
  )
  return sizes.every(Boolean) ? `${sizes.join(' × ')} in` : null
}

/** One product for its page: details plus the readable name (only the catalog search has it).
 * Null when Ingram doesn't have it or it can't be bought. */
export function product(partNumber: string) {
  return cachedStale<ProductDetail | null>(
    key(`product:${partNumber}`),
    (value) => (value ? refreshAt.productInfo() : refreshAt.retry()),
    async () => {
      const search = new URLSearchParams({ keyword: partNumber, pageNumber: '1', pageSize: '10' })
      const [details, listing] = await Promise.all([
        ingram<DetailsResponse>(`/catalog/details/${encodeURIComponent(partNumber)}`),
        ingram<{ catalog?: CatalogItem[] }>(`/catalog?${search}`),
      ])
      if (!details || details.indicators?.isDiscontinuedProduct) return null
      if (details.productAuthorized !== undefined && !isTrue(details.productAuthorized)) return null

      const item = listing?.catalog?.find((c) => c.ingramPartNumber === details.ingramPartNumber)
      const summary = item ? toProduct(item) : null
      if (!summary) return null

      const category = [details.productCategory, details.productSubCategory]
        .filter(Boolean)
        .join(' › ')
      const facts = [
        { label: 'Manufacturer part number', value: summary.partNumber },
        { label: 'UPC', value: details.upc },
        { label: 'Category', value: category },
        { label: 'Package size (L × W × H)', value: dimensions(details.additionalInformation) },
      ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value))

      return { ...summary, description: null, facts }
    },
  )
}

type PriceRow = {
  ingramPartNumber?: string
  productClass?: string
  pricing?: { customerPrice?: number }
  availability?: {
    totalAvailability?: number
    availabilityByWarehouse?: {
      quantityBackorderedEta?: string
      backOrderInfo?: { etaDate?: string }[]
    }[]
    preOrderETAOnOrderQty?: { eta?: string }[]
  }
}

/** VTEGI's cost (server only) and Ingram's stock for one part; null when Ingram has none. */
export type PriceAndStock = { cost: number | null; stock: Stock | null }

/** Ingram reports digital products (licenses, warranties) as 9,999,999 units. */
const UNLIMITED = 9_999_999

/** Earliest restock date still ahead; Ingram keeps some dates that have passed. */
function nextRestock(availability: NonNullable<PriceRow['availability']>) {
  const today = new Date().toISOString().slice(0, 10)
  const dates = [
    ...(availability.availabilityByWarehouse ?? []).flatMap((warehouse) => [
      warehouse.quantityBackorderedEta,
      ...(warehouse.backOrderInfo ?? []).map((info) => info.etaDate),
    ]),
    ...(availability.preOrderETAOnOrderQty ?? []).map((order) => order.eta),
  ]
    .map((date) => date?.slice(0, 10) ?? '')
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date > today)
  return dates.sort()[0] ?? null
}

function stockOf(row: PriceRow): Stock | null {
  const total = row.availability?.totalAvailability
  if (!row.availability || typeof total !== 'number') return null
  if (total >= UNLIMITED) return { status: 'digital', quantity: 0, expected: null }
  const expected = nextRestock(row.availability)
  if (total > 0) return { status: 'in-stock', quantity: total, expected }
  // Class X ships from the manufacturer, so Ingram never holds it in stock.
  if (row.productClass === 'X') return { status: 'direct', quantity: 0, expected: null }
  return { status: 'out-of-stock', quantity: 0, expected }
}

/** Ingram's price and availability call, up to 50 parts at a time. */
async function loadPriceAndStock(partNumbers: string[]) {
  const result = new Map<string, PriceAndStock>()
  for (let i = 0; i < partNumbers.length; i += 50) {
    const chunk = partNumbers.slice(i, i + 50)
    const rows = await ingram<PriceRow[]>(
      '/catalog/priceandavailability?includeAvailability=true&includePricing=true',
      {
        method: 'POST',
        body: JSON.stringify({ products: chunk.map((ingramPartNumber) => ({ ingramPartNumber })) }),
      },
    )
    const found = new Map((rows ?? []).map((row) => [row.ingramPartNumber, row]))
    for (const pn of chunk) {
      const row = found.get(pn)
      const cost = row?.pricing?.customerPrice
      result.set(pn, {
        cost: typeof cost === 'number' && cost > 0 ? cost : null,
        stock: row ? stockOf(row) : null,
      })
    }
  }
  return result
}

/** Cost and stock per part number, refreshed every 2 hours; `fresh` asks Ingram now (quotes). */
export function priceAndStock(partNumbers: string[], { fresh = false } = {}) {
  const unique = [...new Set(partNumbers)]
  if (fresh) return loadPriceAndStock(unique)
  return cachedPrices(unique, (pn) => key(`price:${pn}`), loadPriceAndStock)
}
