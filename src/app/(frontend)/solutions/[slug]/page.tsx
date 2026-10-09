import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Reveal } from '@/components/motion/reveal'
import { ButtonLink, buttonStyles } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Faq } from '@/components/ui/faq'
import { Icon } from '@/components/ui/icon'
import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { RequestLink } from '@/features/request-form/request-link'
import { RequestSection } from '@/features/request-form/request-section'
import { getBySlug, getHomePage, getSlugs, getSolutions } from '@/lib/cms'
import { docMetadata } from '@/lib/seo'
import type { Solution } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => getSlugs('solutions')

export async function generateMetadata({ params }: Props) {
  const solution = await getBySlug('solutions', (await params).slug)
  return solution ? docMetadata(solution, solution.shortDescription) : {}
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params
  const [solution, solutions, home] = await Promise.all([
    getBySlug('solutions', slug),
    getSolutions(),
    getHomePage(),
  ])
  if (!solution) notFound()

  const chosenRelated = (solution.related ?? []).filter(
    (item): item is Solution => typeof item === 'object',
  )
  const related = chosenRelated.length
    ? chosenRelated
    : solutions.filter((s) => s.id !== solution.id).slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Link href="/solutions" className="hover:underline">
              Solutions
            </Link>
            &nbsp;/&nbsp;{solution.title}
          </>
        }
        title={solution.hero.headline}
        intro={solution.hero.intro}
      >
        <div className="flex flex-wrap gap-3">
          <RequestLink solution={solution.slug} className={buttonStyles({ size: 'lg' })}>
            {solution.ctaLabel} <ArrowRight aria-hidden className="size-4" />
          </RequestLink>
          <ButtonLink href="/solutions" variant="outline" size="lg">
            All solutions
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <Eyebrow>Who this is for</Eyebrow>
            <Heading className="mt-5" size="lg">
              {solution.shortDescription}
            </Heading>
            <ul className="mt-8 space-y-3">
              {solution.audiences?.map((audience) => (
                <li key={audience.id} className="flex items-center gap-3 font-medium">
                  <Check aria-hidden className="size-5 text-brand-700 on-dark:text-brand-400" />
                  {audience.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>What we deliver</Eyebrow>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {solution.capabilities?.map((capability, i) => (
                <li key={capability.id}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <Card className="h-full">
                      <span className="font-mono text-xs text-ink-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <Heading as="h3" size="md" className="mt-3">
                        {capability.title}
                      </Heading>
                      <p className="mt-2 text-ink-600 on-dark:text-ink-400">
                        {capability.description}
                      </p>
                    </Card>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {solution.scenarios && solution.scenarios.length > 0 && (
        <Section tone="dark">
          <Eyebrow>Example scenarios</Eyebrow>
          <Heading className="mt-5">What could bring you here?</Heading>
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {solution.scenarios.map((scenario, i) => (
              <li key={scenario.id}>
                <Card className="h-full">
                  <span className="font-mono text-xs tracking-wider text-brand-400 uppercase">
                    Scenario {String(i + 1).padStart(2, '0')}
                  </span>
                  <Heading as="h3" size="md" className="mt-3">
                    {scenario.title}
                  </Heading>
                  <p className="mt-2 text-ink-400">{scenario.description}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {solution.faqs && solution.faqs.length > 0 && (
        <Section>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <div>
              <Eyebrow>Before you begin</Eyebrow>
              <Heading className="mt-5">Questions, answered.</Heading>
            </div>
            <Faq items={solution.faqs} />
          </div>
        </Section>
      )}

      <RequestSection {...home.process} solutions={solutions} defaultSolution={solution.slug} />

      <Section className="py-16 md:py-20">
        <Eyebrow>Related solutions</Eyebrow>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {related.map((item) => (
            <li key={item.id}>
              <Link
                href={`/solutions/${item.slug}`}
                className="group flex h-full items-center gap-4 rounded-xl border border-ink-200 p-5 transition hover:border-ink-900 on-dark:border-white/10 on-dark:hover:border-white/40"
              >
                <Icon name={item.icon} className="size-6 text-brand-700 on-dark:text-brand-400" />
                <span className="flex-1 font-semibold">{item.title}</span>
                <ArrowRight
                  aria-hidden
                  className="size-4 text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-ink-900 on-dark:group-hover:text-white"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
