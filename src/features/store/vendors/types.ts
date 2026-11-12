export type VendorId = 'ingram' | 'pax8'

/** A product as the store lists it. Holds no cost, so it is safe to send to the browser. */
export type ProductSummary = {
  vendor: VendorId
  /** Ingram part number / Pax8 product id: how the distributor identifies it. */
  id: string
  /** Manufacturer part number or SKU, shown to customers. */
  partNumber: string
  name: string
  brand: string
  /** Ingram only: the distributor's own category, e.g. "Computer Systems". */
  vendorCategory?: string
  vendorSubCategory?: string
}

/** Everything a product page shows. Browser-safe, like ProductSummary. */
export type ProductDetail = ProductSummary & {
  description: string | null
  facts: { label: string; value: string }[]
}

/** One way to buy a product, with VTEGI's distributor cost (server only, never sent to the browser). */
export type PriceOption = {
  label: string
  billingTerm: 'monthly' | 'annual' | 'one-time'
  commitmentMonths: number | null
  /** "user", "seat", "license", "device" or "each". */
  unit: string
  /** Cost by quantity, lowest first; the first tier applies from 1 unit. */
  tiers: { minQuantity: number; cost: number }[]
}

export type ProductPage = { total: number; products: ProductSummary[] }
