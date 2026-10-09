import { z } from 'zod'

import {
  computerTypes,
  contactMethods,
  inquiryTypes,
  isBusinessInquiry,
  optionValues,
  organizationTypes,
  timelines,
} from './options'

/** Optional <select>: empty string means "not chosen". */
const optionalSelect = <T extends readonly { value: string }[]>(options: T) =>
  z.enum(optionValues(options)).or(z.literal(''))

const optionalText = (max: number) => z.string().trim().max(max)

/** Shared by the form (browser) and the server action, so the rules can't drift apart. */
export const requestSchema = z
  .object({
    inquiryType: z.enum(optionValues(inquiryTypes)),
    solution: z.string().max(100),
    name: z.string().trim().min(2, 'Please enter your name.').max(100),
    email: z.email('Enter a valid email address.'),
    phone: optionalText(30),
    organization: optionalText(150),
    organizationType: optionalSelect(organizationTypes),
    timeline: optionalSelect(timelines),
    contactMethod: optionalSelect(contactMethods),
    computerType: optionalSelect(computerTypes),
    budget: optionalText(100),
    applications: optionalText(500),
    message: z
      .string()
      .trim()
      .min(10, 'Please add a few more details (at least 10 characters).')
      .max(2000, 'Please keep it under 2,000 characters.'),
    /** Honeypot: hidden from people, bots tend to fill it in. */
    website: z.string().max(200),
  })
  .superRefine((data, ctx) => {
    const requireField = (path: keyof typeof data, message: string) =>
      ctx.addIssue({ code: 'custom', path: [path], message })

    if (data.inquiryType === 'service' && !data.solution) {
      requireField('solution', 'Choose a solution, or pick "Help me choose".')
    }
    if (isBusinessInquiry(data.inquiryType)) {
      if (!data.organization) requireField('organization', 'Please enter your organization.')
      if (!data.organizationType) requireField('organizationType', 'Choose your organization type.')
    }
    if (data.inquiryType === 'custom-build' && !data.computerType) {
      requireField('computerType', 'Choose a computer type, or "Not sure yet".')
    }
  })

export type RequestInput = z.infer<typeof requestSchema>

export const emptyRequest: RequestInput = {
  inquiryType: 'service',
  solution: '',
  name: '',
  email: '',
  phone: '',
  organization: '',
  organizationType: '',
  timeline: '',
  contactMethod: '',
  computerType: '',
  budget: '',
  applications: '',
  message: '',
  website: '',
}
