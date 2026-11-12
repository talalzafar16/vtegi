import { z } from 'zod'

import { optionValues, organizationTypes } from '@/features/request-form/options'

import { vendors } from '../options'

/** Shared by the quote form (browser) and the server action, so the rules can't drift apart. */
export const quoteSchema = z.object({
  vendor: z.enum(optionValues(vendors)),
  productId: z.string().min(1).max(100),
  /** Which way to buy (Pax8 term); "unit" for hardware. */
  offer: z.string().max(100),
  quantity: z
    .number({ error: 'Enter a quantity.' })
    .int('Enter whole units.')
    .min(1, 'Enter at least 1.')
    .max(100_000, 'For very large orders, please contact us.'),
  name: z.string().trim().min(2, 'Please enter your name.').max(100),
  email: z.email('Enter a valid email address.'),
  organization: z.string().trim().min(2, 'Please enter your organization.').max(150),
  organizationType: z.enum(optionValues(organizationTypes), {
    error: 'Choose your organization type.',
  }),
  phone: z.string().trim().max(30),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, 'Enter a 5-digit ZIP code.'),
  address: z.string().trim().max(300),
  notes: z.string().trim().max(1000),
  /** Honeypot: hidden from people, bots tend to fill it in. */
  website: z.string().max(200),
})

export type QuoteInput = z.infer<typeof quoteSchema>
