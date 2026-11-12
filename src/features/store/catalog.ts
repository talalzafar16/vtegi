import { cache } from 'react'

import { getStoreCategories, matchesRule, toKey, type Category } from './categories'
import {
  billingPeriods,
  calculatePrice,
  needsCustomPricing,
  priceLevels,
  type PriceBreakdown,
  type PriceLevel,
} from './pricing'
import { getStoreSettings } from './settings'
import {
  ingram,
  pax8,
  type PriceOption,
  type ProductDetail,
  type ProductSummary,
  type VendorId,
} from './vendors'

// Listings, search, product pages and quote prices. Only browser-safe data leaves this file:
// customer prices after markup, never distributor costs or the markup itself.

export type Tab = 'hardware' | 'software'

export type StoreProduct = ProductSummary & {
  /** Customer price for one unit, or null ("Request a Quote" only). */
  price: number | null
  priceSuffix?: string
  priceFrom?: boolean
  icon: Category['icon']
}

export type Filter = { key: string; label: string }

export type Listing = {
  products: StoreProduct[]
  hasNext: boolean
  /** Exact product count when known (software). */
  total?: number
  failed?: boolean
}

type Settings = Awaited<ReturnType<typeof getStoreSettings>>

export const PAGE_SIZE = 24
/** Ingram lists many discontinued parts; asking for 50 leaves about 25 current ones. */
const INGRAM_PAGE_SIZE = 50

const unavailable: Listing = { products: [], hasNext: false, failed: true }

export const tabsOf = (category: Category): Tab[] => [
  ...(category.ingramGroups.length > 0 ? (['hardware'] as const) : []),
  ...(category.pax8Rules.length > 0 ? (['software'] as const) : []),
]

/** Filter chips: product groups on the hardware tab, brands on the software tab. */
export function filtersOf(category: Category, tab: Tab): Filter[] {
  if (tab === 'hardware') return category.ingramGroups.map(({ key, label }) => ({ key, label }))
  const brands = [...new Set(category.pax8Rules.map((rule) => rule.brand))]
  return brands.map((brand) => ({ key: toKey(brand), label: brand }))
}

/** Hardware always lists one group (the first by default), since each is a separate search;
 * software shows all brands unless one is chosen. */
export function resolveFilter(category: Category, tab: Tab, requested?: string) {
  const keys = filtersOf(category, tab).map((f) => f.key)
  if (requested && keys.includes(requested)) return requested
  return tab === 'hardware' ? (keys[0] ?? null) : null
}

/** The visible category a product belongs to (none = not sold). Hardware prefers a group whose
 * keyword is in the name, so a server lands in Infrastructure, not another Computer Systems one. */
export function categoryOf(product: ProductSummary, categories: Category[]) {
  if (product.vendor === 'pax8') {
    return categories.find((c) => c.pax8Rules.some((rule) => matchesRule(product, rule)))
  }
  const name = product.name.toLowerCase()
  const inGroup = (c: Category, byKeyword: boolean) =>
    c.ingramGroups.some(
      (g) =>
        g.category === product.vendorCategory &&
        (!g.brand || g.brand === product.brand) &&
        (!byKeyword || (g.keyword && name.includes(g.keyword.toLowerCase()))),
    )
  return categories.find((c) => inGroup(c, true)) ?? categories.find((c) => inGroup(c, false))
}

/** Runs `task` over `items`, at most `limit` at a time. */
async function mapLimit<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await task(items[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

type IconOf = (product: ProductSummary) => Category['icon']

// Prices are a bonus on listings: if they fail, products still show with "Request a Quote".
async function withHardwarePrices(items: ProductSummary[], settings: Settings, iconOf: IconOf) {
  let costs = new Map<string, number | null>()
  if (settings.showPrices && items.length > 0) {
    try {
      costs = await ingram.costs(items.map((p) => p.id))
    } catch (error) {
      console.error('[store] Ingram prices failed:', error)
    }
  }
  return items.map((product): StoreProduct => ({
    ...product,
    icon: iconOf(product),
    price: settings.showPrices
      ? (calculatePrice(costs.get(product.id), 1, settings.rules)?.unitPrice ?? null)
      : null,
    priceSuffix: 'per unit',
  }))
}

function withSoftwarePrices(items: ProductSummary[], settings: Settings, iconOf: IconOf) {
  return mapLimit(items, 6, async (product): Promise<StoreProduct> => {
    const base = { ...product, icon: iconOf(product), price: null }
    if (!settings.showPrices) return base
    try {
      const shown = cardPrice(await pax8.priceOptions(product.id))
      const price = calculatePrice(shown?.cost, 1, settings.rules)?.unitPrice ?? null
      return { ...base, price, priceSuffix: shown?.suffix, priceFrom: shown?.from }
    } catch (error) {
      console.error('[store] Pax8 price failed:', product.id, error)
      return base
    }
  })
}

/** Software card price: the cheapest monthly cost across terms, or the one-time price for
 * products bought outright. */
function cardPrice(options: PriceOption[]) {
  const monthly = pax8.lowestMonthlyCost(options)
  if (monthly) {
    const per = monthly.unit === 'each' ? '' : `/${monthly.unit}`
    return { cost: monthly.cost, suffix: `${per}/month`, from: true }
  }
  const oneTime = options.find((option) => option.billingTerm === 'one-time')
  return oneTime ? { cost: oneTime.tiers[0].cost, suffix: 'one-time', from: false } : null
}

/** Pax8 products matching any rule, A–Z, without hidden brands. */
async function pax8Products(settings: Settings, keep: (product: ProductSummary) => boolean) {
  const catalog = await pax8.allProducts()
  return catalog
    .filter((p) => !settings.hiddenBrands.has(p.brand.toLowerCase()) && keep(p))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/** One page of a category tab, with customer prices. `filter` comes from resolveFilter. */
export async function listCategory(
  category: Category,
  tab: Tab,
  filter: string | null,
  page: number,
): Promise<Listing> {
  const settings = await getStoreSettings()
  const iconOf = () => category.icon

  if (tab === 'hardware') {
    const group = category.ingramGroups.find((g) => g.key === filter)
    if (!group) return { products: [], hasNext: false }
    let result
    try {
      result = await ingram.catalogPage({
        category: group.category,
        brand: group.brand,
        keyword: group.keyword,
        page,
        pageSize: INGRAM_PAGE_SIZE,
      })
    } catch (error) {
      console.error('[store] Ingram listing failed:', error)
      return unavailable
    }
    const items = result.products.filter((p) => !settings.hiddenBrands.has(p.brand.toLowerCase()))
    return {
      products: await withHardwarePrices(items, settings, iconOf),
      hasNext: page * INGRAM_PAGE_SIZE < result.total,
    }
  }

  const rules = filter
    ? category.pax8Rules.filter((rule) => toKey(rule.brand) === filter)
    : category.pax8Rules
  let matched
  try {
    matched = await pax8Products(settings, (p) => rules.some((rule) => matchesRule(p, rule)))
  } catch (error) {
    console.error('[store] Pax8 listing failed:', error)
    return unavailable
  }
  const items = matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  return {
    products: await withSoftwarePrices(items, settings, iconOf),
    hasNext: page * PAGE_SIZE < matched.length,
    total: matched.length,
  }
}

type SearchContext = {
  settings: Settings
  categories: Category[]
}

const searchContext = async (): Promise<SearchContext> => {
  const [settings, categories] = await Promise.all([getStoreSettings(), getStoreCategories()])
  return { settings, categories }
}

/** Ingram's keyword search, one page, limited to visible categories and brands. */
async function searchIngram(query: string, page: number, { settings, categories }: SearchContext) {
  const result = await ingram.catalogPage({ keyword: query, page, pageSize: INGRAM_PAGE_SIZE })
  const items = result.products.filter(
    (p) => !settings.hiddenBrands.has(p.brand.toLowerCase()) && categoryOf(p, categories),
  )
  return { items, hasNext: page * INGRAM_PAGE_SIZE < result.total }
}

/** Pax8 products containing every search word (name, brand or SKU) in visible categories;
 * names starting with the search first, then names containing it, then A to Z. */
async function searchPax8(query: string, { settings, categories }: SearchContext) {
  const phrase = query.toLowerCase()
  const words = phrase.split(/\s+/).filter(Boolean)
  const matched = await pax8Products(settings, (p) => {
    const text = `${p.name} ${p.brand} ${p.partNumber}`.toLowerCase()
    return words.every((word) => text.includes(word)) && Boolean(categoryOf(p, categories))
  })
  const rank = (name: string) => {
    const lower = name.toLowerCase()
    return lower.startsWith(phrase) ? 0 : lower.includes(phrase) ? 1 : 2
  }
  return matched.sort((a, b) => rank(a.name) - rank(b.name))
}

export async function searchStore(query: string, tab: Tab, page: number): Promise<Listing> {
  const context = await searchContext()
  const iconOf: IconOf = (p) => categoryOf(p, context.categories)?.icon ?? 'cart'

  if (tab === 'hardware') {
    try {
      const { items, hasNext } = await searchIngram(query, page, context)
      return { products: await withHardwarePrices(items, context.settings, iconOf), hasNext }
    } catch (error) {
      console.error('[store] Ingram search failed:', error)
      return unavailable
    }
  }

  let matched
  try {
    matched = await searchPax8(query, context)
  } catch (error) {
    console.error('[store] Pax8 search failed:', error)
    return unavailable
  }
  const items = matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  return {
    products: await withSoftwarePrices(items, context.settings, iconOf),
    hasNext: page * PAGE_SIZE < matched.length,
    total: matched.length,
  }
}

/** Result counts for the search tabs. Hardware counts its first page only (24+), because
 * Ingram's total includes products we filter out. Null when a distributor is down. */
export async function searchCounts(query: string) {
  const context = await searchContext()
  const [hardware, software] = await Promise.all([
    searchIngram(query, 1, context).then(
      ({ items, hasNext }) => ({ count: items.length, more: hasNext && items.length > 0 }),
      () => null,
    ),
    searchPax8(query, context).then(
      (matched) => ({ count: matched.length, more: false }),
      () => null,
    ),
  ])
  return { hardware, software } satisfies Record<Tab, { count: number; more: boolean } | null>
}

/** A product and its visible category, or null when the store doesn't sell it.
 * Throws if the distributor is down. */
export const getProduct = cache(async (vendor: VendorId, id: string) => {
  const [settings, categories] = await Promise.all([getStoreSettings(), getStoreCategories()])
  const product: ProductDetail | null =
    vendor === 'ingram' ? await ingram.product(id) : await pax8.product(id)
  if (!product || settings.hiddenBrands.has(product.brand.toLowerCase())) return null
  const category = categoryOf(product, categories)
  return category ? { product, category } : null
})

/** Ingram's long names read "Title - spec - spec…": the title for headings, the rest as highlights. */
export function splitName(product: ProductSummary) {
  if (product.vendor !== 'ingram') return { title: product.name, highlights: [] }
  const [title, ...highlights] = product.name.split(' - ').map((part) => part.trim())
  return { title, highlights: highlights.filter(Boolean) }
}

/** One way to buy a product, as its page shows it (no costs). */
export type Offer = {
  key: string
  label: string | null
  billingTerm: PriceOption['billingTerm'] | null
  /** "No. Months" on the quote; null for hardware and one-time purchases. */
  months: number | null
  /** Times the price is billed over the term (see billingPeriods). */
  periods: number
  unit: string
  /** Price per unit at each discount level; empty when prices are hidden or unknown. */
  levels: PriceLevel[]
}

const HARDWARE_OFFER = 'unit'

const offerKey = (option: PriceOption) =>
  `${option.billingTerm}-${option.commitmentMonths ?? 0}-${option.unit}`

const termMonths = (option: PriceOption) =>
  option.billingTerm === 'one-time'
    ? null
    : (option.commitmentMonths ?? (option.billingTerm === 'monthly' ? 1 : 12))

/** Distributor cost for a quantity: the highest tier the quantity reaches. */
const tierCost = (option: PriceOption, quantity: number) =>
  option.tiers.filter((tier) => quantity >= tier.minQuantity).at(-1)?.cost ?? option.tiers[0].cost

/** Shortest term first, monthly billing before annual, one-time purchases last. */
const byTerm = (a: PriceOption, b: PriceOption) =>
  Number(a.billingTerm === 'one-time') - Number(b.billingTerm === 'one-time') ||
  (termMonths(a) ?? 0) - (termMonths(b) ?? 0) ||
  Number(a.billingTerm === 'annual') - Number(b.billingTerm === 'annual')

/** The ways to buy a product with their price tables (cached distributor prices). */
export async function productOffers(product: ProductSummary) {
  const settings = await getStoreSettings()
  const rules = settings.showPrices ? settings.rules : null
  const customFrom = settings.rules?.customPricingFrom ?? null
  const levelsFor = (costAt: (quantity: number) => number | null) =>
    rules ? priceLevels(costAt, rules) : []

  if (product.vendor === 'ingram') {
    let cost: number | null = null
    if (rules) {
      try {
        cost = (await ingram.costs([product.id])).get(product.id) ?? null
      } catch (error) {
        console.error('[store] Ingram price failed:', product.id, error)
      }
    }
    const offer: Offer = {
      key: HARDWARE_OFFER,
      label: null,
      billingTerm: null,
      months: null,
      periods: 1,
      unit: 'unit',
      levels: levelsFor(() => cost),
    }
    return { offers: [offer], customFrom }
  }

  let options: PriceOption[] = []
  try {
    options = await pax8.priceOptions(product.id)
  } catch (error) {
    console.error('[store] Pax8 price failed:', product.id, error)
  }
  const offers = [...options].sort(byTerm).map((option): Offer => ({
    key: offerKey(option),
    label: option.label,
    billingTerm: option.billingTerm,
    months: termMonths(option),
    periods: billingPeriods(option.billingTerm, option.commitmentMonths),
    unit: option.unit,
    levels: levelsFor((quantity) => tierCost(option, quantity)),
  }))
  return { offers, customFrom }
}

export type QuotePricing = {
  term: { billingTerm: PriceOption['billingTerm']; label: string; months: number | null } | null
  price: PriceBreakdown | null
  manualReason: 'no-price' | 'volume' | 'unavailable' | null
}

/** The price for a quote, always fresh from the distributor (never the display cache). */
export async function quotePricing(
  product: ProductSummary,
  offer: string,
  quantity: number,
): Promise<QuotePricing> {
  const { rules } = await getStoreSettings()

  const priced = (option: PriceOption | null, cost: number | null): QuotePricing => {
    const term = option
      ? { billingTerm: option.billingTerm, label: option.label, months: termMonths(option) }
      : null
    if (needsCustomPricing(quantity, rules)) return { term, price: null, manualReason: 'volume' }
    const periods = option ? billingPeriods(option.billingTerm, option.commitmentMonths) : 1
    const price = calculatePrice(cost, quantity, rules, periods)
    return { term, price, manualReason: price ? null : 'no-price' }
  }

  try {
    if (product.vendor === 'ingram') {
      const costs = await ingram.costs([product.id], { fresh: true })
      return priced(null, costs.get(product.id) ?? null)
    }
    const options = await pax8.priceOptions(product.id, { fresh: true })
    const option =
      options.find((o) => offerKey(o) === offer) ?? (options.length === 1 ? options[0] : null)
    return priced(option, option ? tierCost(option, quantity) : null)
  } catch (error) {
    console.error('[store] Quote price failed:', product.vendor, product.id, error)
    return { term: null, price: null, manualReason: 'unavailable' }
  }
}
