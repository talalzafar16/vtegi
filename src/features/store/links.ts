import type { Tab } from './catalog'
import type { VendorId } from './vendors'

type CategoryQuery = { tab?: Tab; filter?: string | null; page?: number }

/** "/store/security?tab=software&filter=microsoft&page=2". */
export function categoryHref(slug: string, { tab, filter, page }: CategoryQuery = {}) {
  const params = new URLSearchParams()
  if (tab) params.set('tab', tab)
  if (filter) params.set('filter', filter)
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString()
  return `/store/${slug}${query ? `?${query}` : ''}`
}

/** "/store/product/ingram/S84820". */
export const productHref = (product: { vendor: VendorId; id: string }) =>
  `/store/product/${product.vendor}/${encodeURIComponent(product.id)}`

/** "/store/search?q=laptop&tab=software&page=2". */
export function searchHref(query: string, { tab, page }: { tab?: Tab; page?: number } = {}) {
  const params = new URLSearchParams({ q: query })
  if (tab) params.set('tab', tab)
  if (page && page > 1) params.set('page', String(page))
  return `/store/search?${params}`
}
