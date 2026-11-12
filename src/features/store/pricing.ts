// Distributor cost to customer price. Dependency-free, so pages, the quote form and emails share it.

export type DiscountLevel = { minQuantity: number; discountPercent: number }

export type PricingRules = {
  markupPercent: number
  quantityDiscounts: DiscountLevel[]
  /** From this quantity VTEGI prices the order itself (custom volume pricing). */
  customPricingFrom?: number | null
}

export type PriceBreakdown = {
  cost: number
  markupPercent: number
  /** Per unit after markup, before any quantity discount. */
  listPrice: number
  discountPercent: number
  unitPrice: number
  quantity: number
  /** Times the price is billed over the quoted term (see billingPeriods). */
  periods: number
  /** unitPrice × quantity × periods. */
  total: number
}

/** Rounds to whole cents, avoiding floating-point artifacts like 11.399999. */
export const toCents = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100

/** Discount of the highest level the quantity reaches (e.g. 150 units reach "100+"), or 0. */
export function discountFor(quantity: number, levels: DiscountLevel[]) {
  const reached = levels.filter((level) => quantity >= level.minQuantity)
  if (reached.length === 0) return 0
  return reached.reduce((top, level) => (level.minQuantity > top.minQuantity ? level : top))
    .discountPercent
}

export const needsCustomPricing = (quantity: number, rules: PricingRules | null) =>
  Boolean(rules?.customPricingFrom && quantity >= rules.customPricingFrom)

/** Times a price is billed over the quoted term: 12 for a year billed monthly; 1 for annual
 * billing, month-to-month or one-time. */
export function billingPeriods(
  billingTerm: 'monthly' | 'annual' | 'one-time' | null | undefined,
  months: number | null | undefined,
) {
  if (billingTerm === 'monthly') return months ?? 1
  if (billingTerm === 'annual') return Math.max(1, Math.round((months ?? 12) / 12))
  return 1
}

/** Price for `quantity` units: markup, then the volume discount (times `periods` for terms).
 * Null when it can't be priced (no cost or markup, or custom pricing): a manual quote. */
export function calculatePrice(
  cost: number | null | undefined,
  quantity: number,
  rules: PricingRules | null,
  periods = 1,
): PriceBreakdown | null {
  if (!rules || !cost || !Number.isFinite(cost) || cost <= 0) return null
  if (!Number.isInteger(quantity) || quantity < 1 || needsCustomPricing(quantity, rules))
    return null

  const listPrice = toCents(cost * (1 + rules.markupPercent / 100))
  const discountPercent = discountFor(quantity, rules.quantityDiscounts)
  const unitPrice = toCents(listPrice * (1 - discountPercent / 100))

  return {
    cost,
    markupPercent: rules.markupPercent,
    listPrice,
    discountPercent,
    unitPrice,
    quantity,
    periods,
    total: toCents(unitPrice * quantity * periods),
  }
}

export type PriceLevel = {
  from: number
  /** Last quantity of the level; null for the open-ended last level. */
  to: number | null
  discountPercent: number
  unitPrice: number
}

/** The product page's price table: one row per discount level up to custom pricing.
 * `costAt` gives the distributor cost for a quantity. */
export function priceLevels(costAt: (quantity: number) => number | null, rules: PricingRules) {
  const starts = [...new Set([1, ...rules.quantityDiscounts.map((level) => level.minQuantity)])]
    .filter((start) => !needsCustomPricing(start, rules))
    .sort((a, b) => a - b)

  return starts.flatMap((from, i): PriceLevel[] => {
    const next = starts[i + 1] ?? rules.customPricingFrom
    const price = calculatePrice(costAt(from), from, rules)
    if (!price) return []
    return [
      {
        from,
        to: next ? next - 1 : null,
        discountPercent: price.discountPercent,
        unitPrice: price.unitPrice,
      },
    ]
  })
}
