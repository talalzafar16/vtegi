'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { z } from 'zod'

import { verifyTurnstile } from '@/lib/turnstile'

import { confirmationEmail, newLeadEmail } from './emails'
import { HELP_ME_CHOOSE } from './options'
import { requestSchema, type RequestInput } from './schema'

export type SubmitResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Partial<Record<keyof RequestInput, string[]>> }

const MIN_FILL_MS = 3000 // people take longer than this; many bots don't
const MAX_PER_HOUR = 3

/**
 * Handles a website request. Server actions are public endpoints, so everything is
 * re-validated here; the browser's validation is only for a nicer experience.
 */
export async function submitRequest(
  input: RequestInput,
  meta: { startedAt: number; turnstileToken?: string },
): Promise<SubmitResult> {
  const parsed = requestSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please check the highlighted fields.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    }
  }
  const data = parsed.data

  // Likely bot: answer "ok" so it learns nothing, but store nothing.
  if (data.website || Date.now() - meta.startedAt < MIN_FILL_MS) return { ok: true }

  if (!(await verifyTurnstile(meta.turnstileToken))) {
    return { ok: false, message: 'We could not verify you are human. Please try again.' }
  }

  const payload = await getPayload({ config })

  const { totalDocs: recent } = await payload.count({
    collection: 'leads',
    where: {
      email: { equals: data.email },
      createdAt: { greater_than: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
    },
  })
  if (recent >= MAX_PER_HOUR) {
    return {
      ok: false,
      message:
        'We already received several requests from this email. Our team will be in touch soon.',
    }
  }

  const solution =
    data.solution && data.solution !== HELP_ME_CHOOSE
      ? (
          await payload.find({
            collection: 'solutions',
            where: { slug: { equals: data.solution } },
            limit: 1,
            depth: 0,
          })
        ).docs[0]
      : undefined

  const requestHeaders = await headers()
  const lead = await payload.create({
    collection: 'leads',
    data: {
      status: 'new',
      inquiryType: data.inquiryType,
      solution: solution?.id,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      organization: data.organization || undefined,
      organizationType: data.organizationType || undefined,
      timeline: data.timeline || undefined,
      message: data.message,
      details: {
        helpChoosingSolution: data.solution === HELP_ME_CHOOSE || undefined,
        contactMethod: data.contactMethod || undefined,
        computerType: data.computerType || undefined,
        budget: data.budget || undefined,
        applications: data.applications || undefined,
      },
      sourceUrl: requestHeaders.get('referer') ?? undefined,
    },
  })

  // Emails must never lose a lead: it is already saved, so failures are only logged.
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const adminUrl = `${requestHeaders.get('origin') ?? ''}/admin/collections/leads/${lead.id}`
  const internal = newLeadEmail(data, solution?.title, adminUrl)
  const confirmation = confirmationEmail(data, solution?.title)
  const results = await Promise.allSettled([
    payload.sendEmail({
      to: settings.leadEmail || settings.email,
      replyTo: data.email,
      ...internal,
    }),
    payload.sendEmail({ to: data.email, replyTo: settings.email, ...confirmation }),
  ])
  for (const result of results) {
    if (result.status === 'rejected')
      payload.logger.error({ err: result.reason }, 'Lead email failed')
  }

  return { ok: true }
}
