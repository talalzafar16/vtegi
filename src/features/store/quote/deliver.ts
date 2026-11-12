import type { Payload } from 'payload'

import type { QuoteRequest } from '@/payload-types'

import { getStoreSettings } from '../settings'
import { quoteDocument } from './document'
import { manualQuoteEmail, pendingEmail, quoteCopyEmail, quoteEmail } from './emails'
import { renderQuotePdf } from './pdf'

const errorText = (error: unknown) => (error instanceof Error ? error.message : String(error))

/**
 * Emails the quote and records the outcome on the Quote Request (when the customer was emailed, or
 * what failed). If the customer's quote email or its PDF fails, the request becomes "Needs manual
 * quote" and VTEGI gets an alert instead of a copy. The request itself is already saved.
 */
export async function deliverQuote(payload: Payload, quote: QuoteRequest, adminUrl: string) {
  const [site, store] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    getStoreSettings(),
  ])
  const team = store.notificationEmail
  const errors: string[] = []

  const send = async (label: string, message: Parameters<Payload['sendEmail']>[0]) => {
    try {
      await payload.sendEmail(message)
      return true
    } catch (error) {
      errors.push(`${label}: ${errorText(error)}`)
      payload.logger.error({ err: error }, `${label} failed for ${quote.quoteNumber}`)
      return false
    }
  }

  let outcome = quote
  let customerEmailed = false

  if (quote.status === 'sent') {
    const doc = quoteDocument(quote, site, store.salesperson)
    let pdf: Buffer | undefined
    try {
      pdf = await renderQuotePdf(doc)
    } catch (error) {
      errors.push(`Quote PDF: ${errorText(error)}`)
    }
    const attachments = pdf ? [{ filename: `${doc.number}.pdf`, content: pdf }] : undefined
    customerEmailed =
      Boolean(pdf) &&
      (await send('Quote email', {
        to: quote.email,
        replyTo: team,
        ...quoteEmail(quote, doc),
        attachments,
      }))

    if (customerEmailed) {
      await send('Copy to VTEGI', {
        to: team,
        replyTo: quote.email,
        ...quoteCopyEmail(quote, adminUrl),
        attachments,
      })
    } else {
      outcome = {
        ...quote,
        status: 'manual',
        manualReason: 'email-failed',
        emailError: errors.join('\n'),
      }
      await send('Alert to VTEGI', {
        to: team,
        replyTo: quote.email,
        ...manualQuoteEmail(outcome, adminUrl),
      })
    }
  } else {
    ;[customerEmailed] = await Promise.all([
      send('Customer email', { to: quote.email, replyTo: team, ...pendingEmail(quote) }),
      send('Alert to VTEGI', {
        to: team,
        replyTo: quote.email,
        ...manualQuoteEmail(quote, adminUrl),
      }),
    ])
  }

  try {
    await payload.update({
      collection: 'quote-requests',
      id: quote.id,
      data: {
        status: outcome.status,
        manualReason: outcome.manualReason,
        customerEmailedAt: customerEmailed ? new Date().toISOString() : undefined,
        emailError: errors.join('\n') || undefined,
      },
    })
  } catch (error) {
    payload.logger.error({ err: error }, `Could not record email result for ${quote.quoteNumber}`)
  }
  return outcome.status === 'sent' ? ('sent' as const) : ('manual' as const)
}
