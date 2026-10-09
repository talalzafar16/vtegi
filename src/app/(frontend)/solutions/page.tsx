import type { Metadata } from 'next'

import { SolutionsSection } from '@/components/home/solutions-section'
import { PageHero } from '@/components/ui/page-hero'
import { RequestSection } from '@/features/request-form/request-section'
import { getHomePage, getSolutions } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'IT solutions for government, commercial, education and healthcare organizations, plus managed IT services.',
}

export default async function SolutionsPage() {
  const [home, solutions] = await Promise.all([getHomePage(), getSolutions()])

  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Technology solutions for every mission."
        intro="Whether you serve the public, run a business, educate students or care for patients, start with the solution built for your organization."
      />
      <SolutionsSection {...home.solutions} solutions={solutions} />
      <RequestSection {...home.process} solutions={solutions} />
    </>
  )
}
