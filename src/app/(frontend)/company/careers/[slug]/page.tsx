import { ArrowUpRight, Briefcase, MapPin, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHero } from '@/components/ui/page-hero'
import { RichText } from '@/components/ui/rich-text'
import { Section } from '@/components/ui/section'
import { Heading } from '@/components/ui/typography'
import { clearanceLevels, employmentTypes, workplaceOptions } from '@/collections/Jobs'
import { getBySlug, getSlugs } from '@/lib/cms'
import { docMetadata } from '@/lib/seo'
import { labelOf } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => getSlugs('jobs')

export async function generateMetadata({ params }: Props) {
  const job = await getBySlug('jobs', (await params).slug)
  return job ? docMetadata(job, job.summary) : {}
}

export default async function JobPage({ params }: Props) {
  const job = await getBySlug('jobs', (await params).slug)
  if (!job) notFound()

  const clearance =
    job.clearance && job.clearance !== 'none' ? labelOf(clearanceLevels, job.clearance) : null
  const apply = job.applyUrl ? (
    <ButtonLink href={job.applyUrl} size="lg" target="_blank" rel="noopener noreferrer">
      Apply now <ArrowUpRight aria-hidden className="size-4" />
    </ButtonLink>
  ) : (
    <ButtonLink href="/request?inquiry=career" size="lg">
      Apply for this role
    </ButtonLink>
  )

  return (
    <>
      <PageHero
        eyebrow={
          <Link href="/company/careers" className="hover:underline">
            Careers
          </Link>
        }
        title={job.title}
        intro={job.summary}
      >
        <ul className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-300">
          <li className="inline-flex items-center gap-2">
            <MapPin aria-hidden className="size-4" /> {job.location} ·{' '}
            {labelOf(workplaceOptions, job.workplace)}
          </li>
          <li className="inline-flex items-center gap-2">
            <Briefcase aria-hidden className="size-4" />{' '}
            {labelOf(employmentTypes, job.employmentType)}
          </li>
          {clearance && (
            <li className="inline-flex items-center gap-2">
              <ShieldCheck aria-hidden className="size-4" /> {clearance} clearance
            </li>
          )}
        </ul>
        {apply}
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <RichText data={job.description} className="max-w-2xl" />
          <aside>
            <Card className="lg:sticky lg:top-28">
              <Heading as="h2" size="md">
                Interested?
              </Heading>
              <p className="mt-3 text-ink-600 on-dark:text-ink-400">
                {job.applyUrl
                  ? 'Apply through our application page.'
                  : 'Send a career inquiry with a link to your résumé or LinkedIn profile.'}
              </p>
              <div className="mt-6">{apply}</div>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  )
}
