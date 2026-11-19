'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { after } from 'next/server'
import { getPayload, type Payload } from 'payload'
import { z } from 'zod'

import { verifyTurnstile } from '@/lib/turnstile'
import type { QuoteRequest } from '@/payload-types'

import { getProduct, quotePricing } from '../catalog'
import { stockSummary } from '../stock'
import { deliverQuote } from './deliver'
import { quoteSchema, type QuoteInput } from './schema'

export type QuoteResult =
  | { ok: true; status: 'sent' | 'manual' | 'out-of-stock'; quoteNumber: string }
  | { ok: false; message: string; fieldErrors?: Partial<Record<keyof QuoteInput, string[]>> }

const MIN_FILL_MS = 3000 // people take longer than this; many bots don't
const MAX_PER_HOUR = 5

/** Request a Quote: live price, save, email. Server actions are public endpoints, so everything
 * is re-validated here. */
export async function submitQuote(
  input: QuoteInput,
  meta: { startedAt: number; turnstileToken?: string },
): Promise<QuoteResult> {
  const parsed = quoteSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please check the highlighted fields.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    }
  }
  const data = parsed.data

  // Likely bot: answer "ok" so it learns nothing, but store nothing.
  if (data.website || Date.now() - meta.startedAt < MIN_FILL_MS) {
    return { ok: true, status: 'manual', quoteNumber: '' }
  }
  if (!(await verifyTurnstile(meta.turnstileToken))) {
    return { ok: false, message: 'We could not verify you are human. Please try again.' }
  }

  const payload = await getPayload({ config })
  const { totalDocs: recent } = await payload.count({
    collection: 'quote-requests',
    where: {
      email: { equals: data.email },
      createdAt: { greater_than: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
    },
  })
  if (recent >= MAX_PER_HOUR) {
    return {
      ok: false,
      message:
        'We already received several quote requests from this email. Please try again later or call us.',
    }
  }

  let found
  try {
    found = await getProduct(data.vendor, data.productId)
  } catch {
    return {
      ok: false,
      message: "We couldn't reach our distributor just now. Please try again in a few minutes.",
    }
  }
  if (!found) return { ok: false, message: 'This product is no longer available in our store.' }
  const { product } = found

  const pricing = await quotePricing(product, data.offer, data.quantity)
  const requestHeaders = await headers()

  const quote = await createQuote(payload, {
    product: {
      name: product.name,
      vendor: product.vendor,
      vendorProductId: product.id,
      partNumber: product.partNumber || undefined,
      brand: product.brand || undefined,
    },
    quantity: data.quantity,
    stockAtRequest: pricing.stock ? stockSummary(pricing.stock) : undefined,
    // Noon UTC keeps the same calendar day in every US time zone.
    restockExpected: pricing.stock?.expected
      ? `${pricing.stock.expected}T12:00:00.000Z`
      : undefined,
    billingTerm: pricing.term?.billingTerm,
    termMonths: pricing.term?.months ?? undefined,
    termLabel: pricing.term?.label,
    price: pricing.price
      ? {
          cost: pricing.price.cost,
          markupPercent: pricing.price.markupPercent,
          listPrice: pricing.price.listPrice,
          discountPercent: pricing.price.discountPercent,
          unitPrice: pricing.price.unitPrice,
          total: pricing.price.total,
        }
      : undefined,
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    organization: data.organization,
    organizationType: data.organizationType,
    zip: data.zip,
    address: data.address || undefined,
    notes: data.notes || undefined,
    status: pricing.price ? 'sent' : 'manual',
    manualReason: pricing.manualReason ?? undefined,
    sourceUrl: requestHeaders.get('referer') ?? undefined,
  })

  // Emails go out after the response, so the customer doesn't wait; failures still mark the quote manual.
  const adminUrl = `${requestHeaders.get('origin') ?? ''}/admin/collections/quote-requests/${quote.id}`
  after(() =>
    deliverQuote(payload, quote, adminUrl).catch((error) =>
      payload.logger.error({ err: error }, `Quote delivery failed for ${quote.quoteNumber}`),
    ),
  )

  return {
    ok: true,
    status:
      quote.status === 'sent'
        ? 'sent'
        : quote.manualReason === 'out-of-stock'
          ? 'out-of-stock'
          : 'manual',
    quoteNumber: quote.quoteNumber ?? '',
  }
}

type QuoteData = Omit<QuoteRequest, 'id' | 'createdAt' | 'updatedAt' | 'quoteNumber'>

/** Saves the request. Two requests in the same instant can draw the same number: retry once. */
async function createQuote(payload: Payload, data: QuoteData) {
  try {
    return await payload.create({ collection: 'quote-requests', data })
  } catch {
    return payload.create({ collection: 'quote-requests', data })
  }
}
