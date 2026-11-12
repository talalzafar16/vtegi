// Dependency-free: shared by the admin, the quote form and the server, and bundled into the browser.

// Phase 1 distributors. Arrow, TD SYNNEX and Carahsoft come later.
export const vendors = [
  { label: 'Ingram Micro', value: 'ingram' },
  { label: 'Pax8', value: 'pax8' },
] as const

/** How a Pax8 product is billed; hardware has no term. */
export const billingTerms = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'annual' },
  { label: 'One-time', value: 'one-time' },
] as const

export const quoteStatuses = [
  { label: 'Quote sent', value: 'sent' },
  { label: 'Needs manual quote', value: 'manual' },
  { label: 'Quoted manually', value: 'quoted' },
] as const

export const manualReasons = [
  { label: 'No price available', value: 'no-price' },
  { label: 'Custom volume pricing', value: 'volume' },
  { label: 'Distributor unavailable', value: 'unavailable' },
  { label: 'Quote email failed', value: 'email-failed' },
] as const
