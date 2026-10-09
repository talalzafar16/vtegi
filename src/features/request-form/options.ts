// Shared by the Leads collection (admin), the form UI and server validation.
// Keep this file dependency-free: it is bundled into the browser.

export const inquiryTypes = [
  { label: 'Technology service request', value: 'service' },
  { label: 'Quote / purchasing assistance', value: 'quote' },
  { label: 'Custom computer build', value: 'custom-build' },
  { label: 'General company inquiry', value: 'general' },
  { label: 'Career inquiry', value: 'career' },
  { label: 'Event inquiry', value: 'event' },
  { label: 'Media / press inquiry', value: 'media' },
] as const

export const organizationTypes = [
  { label: 'Government', value: 'government' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Education', value: 'education' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Other', value: 'other' },
  { label: 'Individual', value: 'individual' },
] as const

export const timelines = [
  { label: 'As soon as possible', value: 'asap' },
  { label: 'Within 30 days', value: '30-days' },
  { label: 'Within 1–3 months', value: '1-3-months' },
  { label: 'Within 3–6 months', value: '3-6-months' },
  { label: 'Exploring options', value: 'exploring' },
] as const

export const computerTypes = [
  { label: 'Laptop', value: 'laptop' },
  { label: 'Desktop', value: 'desktop' },
  { label: 'Workstation', value: 'workstation' },
  { label: 'Server', value: 'server' },
  { label: 'Not sure yet', value: 'not-sure' },
] as const

export const contactMethods = [
  { label: 'No preference', value: 'any' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
] as const

/** Value used when the visitor wants help choosing a solution. */
export const HELP_ME_CHOOSE = 'help'

export type InquiryType = (typeof inquiryTypes)[number]['value']

/** Inquiry types that are about a project or purchase (vs. company questions). */
export const isBusinessInquiry = (type: InquiryType) =>
  type === 'service' || type === 'quote' || type === 'custom-build'

/** Option values as a tuple, the shape `z.enum()` needs. */
export const optionValues = <T extends readonly { value: string }[]>(options: T) =>
  options.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]]
