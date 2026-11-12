import { formatDate } from '@/lib/format'
import type { QuoteRequest, SiteSetting } from '@/payload-types'

import { billingPeriods, toCents } from '../pricing'

/** What a quote prints, laid out like VTEGI's Word template. Built from the saved Quote Request,
 * so the PDF and emails show exactly what was recorded. */
export type QuoteDocument = ReturnType<typeof quoteDocument>

export function quoteDocument(quote: QuoteRequest, site: SiteSetting, salesperson: string | null) {
  const price = quote.price
  if (!price?.listPrice || !price.unitPrice || !price.total) {
    throw new Error(`Quote ${quote.quoteNumber} has no price to print`)
  }

  const periods = billingPeriods(quote.billingTerm, quote.termMonths)
  // Unit price before the volume discount; the discount is shown as its own line.
  const extended = toCents(price.listPrice * quote.quantity * periods)
  const hardware = quote.product.vendor === 'ingram'

  return {
    number: quote.quoteNumber ?? '',
    date: formatDate(quote.createdAt),
    salesperson: salesperson ?? 'VTEGI Sales',
    company: {
      name: site.companyName,
      duns: site.duns,
      taxId: site.taxId,
      address: site.offices?.[0]?.address ?? '',
      phone: site.phone,
      email: site.email,
    },
    billTo: {
      attn: quote.name,
      company: quote.organization,
      address: quote.address || null,
      email: quote.email,
      phone: quote.phone || null,
    },
    line: {
      partNumber: quote.product.partNumber || quote.product.vendorProductId,
      description: quote.product.name,
      brand: quote.product.brand || null,
      term: quote.termLabel || null,
      site: quote.zip || null,
      months: quote.termMonths ?? null,
      quantity: quote.quantity,
      unitPrice: price.listPrice,
      extended,
    },
    subtotal: extended,
    discountPercent: price.discountPercent ?? 0,
    discount: toCents(extended - price.total),
    total: price.total,
    notes: {
      delivery: hardware
        ? 'Shipped to the delivery location below'
        : 'Electronic (subscription / license)',
      endUser: `${quote.name}, ${quote.organization}`,
      endUserEmail: quote.email,
      location: [quote.address, quote.zip].filter(Boolean).join(', ') || null,
      customer: quote.notes || null,
    },
  }
}
