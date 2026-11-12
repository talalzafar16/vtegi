// Store pricing: distributor cost → customer price. Dependency-free, so product pages, the quote
// form and quote emails all share exactly the same math.

export type DiscountLevel = { minQuantity: number; discountPercent: number }

export type PricingRules = {
  markupPercent: number
  quantityDiscounts: DiscountLevel[]
  /** From this quantity VTEGI prices the order itself (custom volume pricing). */
  customPricingFrom?: number | null
}

export type PriceBreakdown = {
  /** Distributor cost per unit. */
  cost: number
  markupPercent: number
  /** Per unit after markup, before any quantity discount. */
  listPrice: number
  discountPercent: number
  /** Per unit after the quantity discount. */
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

/** Large orders VTEGI prices itself (Store Settings → "Custom pricing from quantity"). */
export const needsCustomPricing = (quantity: number, rules: PricingRules | null) =>
  Boolean(rules?.customPricingFrom && quantity >= rules.customPricingFrom)

/**
 * How many times a price is billed over the quoted term: 12 for a 1-year term billed monthly,
 * 1 for a year billed annually, a month-to-month subscription or a one-time purchase.
 */
export function billingPeriods(
  billingTerm: 'monthly' | 'annual' | 'one-time' | null | undefined,
  months: number | null | undefined,
) {
  if (billingTerm === 'monthly') return months ?? 1
  if (billingTerm === 'annual') return Math.max(1, Math.round((months ?? 12) / 12))
  return 1
}

/**
 * Customer price for `quantity` units: markup on the distributor cost, then the quantity discount.
 * `periods` multiplies the total for subscriptions quoted over a term.
 * Null when there is nothing reliable to show (no cost, no markup set yet, or a quantity that
 * gets custom pricing): the request then goes to VTEGI to price manually.
 */
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

/**
 * The price table a product page shows: one row per discount level up to custom pricing, e.g.
 * 1–4 $110 · 5–9 $107.80 · 10–24 · 25–49. `costAt` gives the distributor cost for a quantity.
 */
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
