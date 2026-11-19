import { labelOf } from '@/lib/utils'
import { emailButton, emailLayout, emailRows, emailText, escapeHtml } from '@/lib/email'
import { formatDate, formatPrice } from '@/lib/format'
import type { QuoteRequest } from '@/payload-types'

import { organizationTypes } from '@/features/request-form/options'

import { manualReasons, vendors } from '../options'
import type { QuoteDocument } from './document'

const money = (amount: number | null | undefined) =>
  typeof amount === 'number' ? formatPrice(amount) : undefined

const productRows = (quote: QuoteRequest): [string, string | null | undefined][] => [
  ['Product', quote.product.name],
  ['Brand', quote.product.brand],
  ['Part number', quote.product.partNumber],
  ['Term', quote.termLabel],
  ['Quantity', String(quote.quantity)],
]

/** Internal only: stock when the customer asked. */
const stockRows = (quote: QuoteRequest): [string, string | null | undefined][] => [
  ['Stock at request', quote.stockAtRequest],
  ['Expected restock', quote.restockExpected ? formatDate(quote.restockExpected) : undefined],
]

const customerRows = (quote: QuoteRequest): [string, string | null | undefined][] => [
  ['Name', quote.name],
  ['Email', quote.email],
  ['Phone', quote.phone],
  ['Organization', quote.organization],
  ['Organization type', labelOf(organizationTypes, quote.organizationType)],
  ['Delivery ZIP', quote.zip],
  ['Address', quote.address],
  ['Notes', quote.notes],
]

export function quoteEmail(quote: QuoteRequest, doc: QuoteDocument) {
  return {
    subject: `Your VTEGI quote ${doc.number}`,
    html: emailLayout(
      `Your quote ${escapeHtml(doc.number)} is ready`,
      emailText(
        `Hi ${escapeHtml(quote.name)}, thank you for your request. Your quote is attached as a PDF. Here is a summary:`,
      ) +
        emailRows([
          ...productRows(quote),
          ['Unit price', money(doc.line.unitPrice)],
          [
            'Volume discount',
            doc.discount ? `${doc.discountPercent}% (-${money(doc.discount)})` : undefined,
          ],
          ['Total', `${money(doc.total)} (sales tax and shipping not included)`],
        ]) +
        emailText(
          `<br>To place your order or ask a question, simply reply to this email or call ${escapeHtml(doc.company.phone)}.`,
        ),
    ),
  }
}

/** To the customer when the request needs a manual quote. */
export function pendingEmail(quote: QuoteRequest) {
  if (quote.manualReason === 'out-of-stock') return outOfStockEmail(quote)
  const volume = quote.manualReason === 'volume'
  return {
    subject: `We're preparing your quote ${quote.quoteNumber} | VTEGI`,
    html: emailLayout(
      `Thanks, ${escapeHtml(quote.name)}. We're preparing your quote.`,
      emailText(
        volume
          ? 'For larger orders we prepare custom volume pricing. A VTEGI specialist will email your quote within one business day.'
          : 'A VTEGI specialist will confirm current pricing and email your quote within one business day.',
      ) + emailRows([['Reference', quote.quoteNumber], ...productRows(quote)]),
    ),
  }
}

function outOfStockEmail(quote: QuoteRequest) {
  return {
    subject: `We've saved your request ${quote.quoteNumber} | VTEGI`,
    html: emailLayout(
      `Thanks, ${escapeHtml(quote.name)}. This product isn't available right now.`,
      emailText(
        "Our distributor doesn't have enough stock for your order at the moment. We've saved your request, and a VTEGI specialist will contact you as soon as it's available.",
      ) + emailRows([['Reference', quote.quoteNumber], ...productRows(quote)]),
    ),
  }
}

/** What the customer was told, for VTEGI's alert. */
const toldCustomer = (quote: QuoteRequest) =>
  quote.manualReason === 'out-of-stock'
    ? "The customer was told it isn't available right now and that we'll contact them when it is."
    : 'On the website the customer was told a specialist will email the quote within one business day.'

/** To VTEGI: a copy of a quote that was sent automatically (internal, includes cost and markup). */
export function quoteCopyEmail(quote: QuoteRequest, adminUrl: string) {
  const price = quote.price
  return {
    subject: `Quote ${quote.quoteNumber} sent to ${quote.name} (${quote.organization})`,
    html: emailLayout(
      `Quote ${escapeHtml(quote.quoteNumber ?? '')} was sent automatically`,
      emailRows([
        ...productRows(quote),
        ['Distributor', labelOf(vendors, quote.product.vendor)],
        ['Distributor cost', money(price?.cost)],
        ['Markup', price?.markupPercent != null ? `${price.markupPercent}%` : undefined],
        ['Discount', price?.discountPercent ? `${price.discountPercent}%` : undefined],
        ['Final unit price', money(price?.unitPrice)],
        ['Total', money(price?.total)],
        ...stockRows(quote),
        ...customerRows(quote),
      ]) + emailButton(adminUrl, 'Open in admin'),
    ),
  }
}

export function manualQuoteEmail(quote: QuoteRequest, adminUrl: string) {
  const reason = labelOf(manualReasons, quote.manualReason) ?? 'Needs a manual quote'
  return {
    subject: `Needs manual quote: ${quote.quoteNumber} (${reason})`,
    html: emailLayout(
      `Quote ${escapeHtml(quote.quoteNumber ?? '')} needs a manual quote`,
      emailText(
        `Reason: <strong>${escapeHtml(reason)}</strong>. ${
          quote.manualReason === 'email-failed'
            ? 'The quote could not be emailed to the customer, so please send it yourself.'
            : ''
        } ${toldCustomer(quote)}`,
      ) +
        emailRows([
          ...productRows(quote),
          ['Distributor', labelOf(vendors, quote.product.vendor)],
          ['Distributor ID', quote.product.vendorProductId],
          ...stockRows(quote),
          ['Email problem', quote.emailError],
          ...customerRows(quote),
        ]) +
        emailButton(adminUrl, 'Open in admin'),
    ),
  }
}
