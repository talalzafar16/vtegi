import type { Stock } from './vendors/types'

// Stock wording for hardware (software has no stock). Dependency-free, so pages, emails and the
// quote action share it.

const LOW_STOCK = 10
/** Customers see "100+ available" above this; Terry always sees the exact count. */
const SHOW_UP_TO = 100

/** Whether the distributor can supply `quantity` now. Unknown stock doesn't block a quote. */
export function hasEnough(stock: Stock | null | undefined, quantity: number) {
  if (!stock || stock.status === 'direct' || stock.status === 'digital') return true
  return stock.quantity >= quantity
}

/** The label customers see, plus a detail line for the product page. */
export function stockLabel(stock: Stock) {
  switch (stock.status) {
    case 'direct':
      return { tone: 'in', label: 'Ships from manufacturer', detail: null } as const
    case 'digital':
      return { tone: 'in', label: 'Digital delivery', detail: null } as const
    case 'out-of-stock':
      return { tone: 'out', label: 'Out of stock', detail: null } as const
    case 'in-stock': {
      const count = stock.quantity > SHOW_UP_TO ? `${SHOW_UP_TO}+` : String(stock.quantity)
      return stock.quantity < LOW_STOCK
        ? ({ tone: 'low', label: 'Low stock', detail: `${count} available` } as const)
        : ({ tone: 'in', label: 'In stock', detail: `${count} available` } as const)
    }
  }
}

/** Exact wording for VTEGI's admin and emails, e.g. "1,044 in stock". */
export function stockSummary(stock: Stock) {
  switch (stock.status) {
    case 'direct':
      return 'Ships from manufacturer'
    case 'digital':
      return 'Digital delivery'
    case 'out-of-stock':
      return 'Out of stock (0 units)'
    case 'in-stock':
      return `${stock.quantity.toLocaleString('en-US')} in stock`
  }
}
