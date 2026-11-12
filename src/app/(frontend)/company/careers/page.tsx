import { ArrowRight, Briefcase, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { employmentTypes, workplaceOptions } from '@/collections/Jobs'
import { listDocs } from '@/lib/cms'
import { labelOf } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Technical, engineering and enterprise IT careers at VTEGI.',
}

const careerInquiry = '/request?inquiry=career'

const process = [
  {
    title: 'Understanding our core values',
    text: 'Joining us means holding true to the values that guide everything we do, with real enthusiasm for each mission’s goals.',
  },
  {
    title: 'Interviews',
    text: 'Our clients vary greatly, and we take care to represent our organization well. We’ll walk you through what to expect.',
  },
  {
    title: 'Onboarding',
    text: 'Once you accept an offer, onboarding welcomes you and gives you the information and support to start your VTEGI career.',
  },
]

export default async function CareersPage() {
  const jobs = await listDocs('jobs', 'title')

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Bring your expertise. Build with purpose."
        intro="Achieve your career goals in a dynamic workplace, across technical, engineering and enterprise IT work for government and commercial clients."
      >
        <ButtonLink href="#positions" size="lg">
          View open positions
        </ButtonLink>
      </PageHero>

      <Section id="positions">
        <Eyebrow>Open positions</Eyebrow>
        <Heading className="mt-5">Find your next role.</Heading>
        <div className="mt-10">
          {jobs.length ? (
            <ul className="divide-y divide-ink-200 border-y border-ink-200 on-dark:divide-white/10 on-dark:border-white/10">
              {jobs.map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/company/careers/${job.slug}`}
                    className="group grid gap-3 py-6 md:grid-cols-[1fr_auto] md:items-center"
                  >
                    <span>
                      <span className="text-lg font-semibold group-hover:text-brand-700 on-dark:group-hover:text-brand-400">
                        {job.title}
                      </span>
                      <span className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-600 on-dark:text-ink-400">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin aria-hidden className="size-4" /> {job.location} ·{' '}
                          {labelOf(workplaceOptions, job.workplace)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase aria-hidden className="size-4" />
                          {labelOf(employmentTypes, job.employmentType)}
                        </span>
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="size-5 text-ink-400 transition group-hover:translate-x-1 group-hover:text-ink-900 on-dark:group-hover:text-white"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Briefcase}
              title="No open positions right now"
              text="We’re always interested in talented people. Send us a career inquiry and we’ll reach out when a role fits."
              action={<ButtonLink href={careerInquiry}>Send a career inquiry</ButtonLink>}
            />
          )}
        </div>
      </Section>

      <Section tone="muted">
        <Eyebrow>How we hire</Eyebrow>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {process.map((step, i) => (
            <li key={step.title}>
              <Card className="h-full">
                <span className="font-mono text-xs text-brand-700 on-dark:text-brand-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Heading as="h3" size="md" className="mt-4">
                  {step.title}
                </Heading>
                <p className="mt-3 text-ink-600 on-dark:text-ink-400">{step.text}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
