import type { Metadata } from 'next'

import { RequestSection } from '@/features/request-form/request-section'
import { getHomePage, getSolutions } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Start a Request',
  description:
    'Tell us about your project. A VTEGI specialist will follow up within one business day.',
}

export default async function RequestPage() {
  const [home, solutions] = await Promise.all([getHomePage(), getSolutions()])
  return <RequestSection {...home.process} solutions={solutions} headingAs="h1" />
}
