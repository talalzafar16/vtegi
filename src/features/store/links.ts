import type { Tab } from './catalog'
import type { VendorId } from './vendors'

type CategoryQuery = { tab?: Tab; filter?: string | null; page?: number }

export function categoryHref(slug: string, { tab, filter, page }: CategoryQuery = {}) {
  const params = new URLSearchParams()
  if (tab) params.set('tab', tab)
  if (filter) params.set('filter', filter)
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString()
  return `/store/${slug}${query ? `?${query}` : ''}`
}

export const productHref = (product: { vendor: VendorId; id: string }) =>
  `/store/product/${product.vendor}/${encodeURIComponent(product.id)}`

type ImageProduct = {
  vendor: VendorId
  id: string
  brand: string
  partNumber: string
  upc?: string
}

/** The product's photo, else its brand logo (served by store/images). `index` picks a gallery photo. */
export function imageHref(product: ImageProduct, index = 0) {
  const params = new URLSearchParams({ b: product.brand })
  if (product.vendor === 'ingram') {
    if (product.partNumber) params.set('m', product.partNumber)
    if (product.upc) params.set('u', product.upc)
  }
  if (index > 0) params.set('n', String(index))
  return `/store/images/${product.vendor}/${encodeURIComponent(product.id)}?${params}`
}

export function searchHref(query: string, { tab, page }: { tab?: Tab; page?: number } = {}) {
  const params = new URLSearchParams({ q: query })
  if (tab) params.set('tab', tab)
  if (page && page > 1) params.set('page', String(page))
  return `/store/search?${params}`
}
