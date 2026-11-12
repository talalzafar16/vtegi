import { Suspense } from 'react'

import { Reveal } from '@/components/motion/reveal'
import { ScrollLine } from '@/components/motion/scroll-line'
import { Card } from '@/components/ui/card'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography'
import type { HomePage, Solution } from '@/payload-types'

import { RequestForm, type RequestFormProps } from './request-form'

type RequestSectionProps = HomePage['process'] &
  Pick<RequestFormProps, 'defaultSolution' | 'defaultInquiry'> & {
    solutions: Pick<Solution, 'slug' | 'title'>[]
    /** Use "h1" when this section is the main content of the page (e.g. /request). */
    headingAs?: 'h1' | 'h2'
  }

export function RequestSection({
  heading,
  intro,
  steps,
  solutions,
  headingAs,
  defaultSolution,
  defaultInquiry,
}: RequestSectionProps) {
  return (
    <Section id="request" tone="muted">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Steps 02 – 03 / Let&apos;s get started</Eyebrow>
            <Heading as={headingAs} className="mt-5">
              {heading}
            </Heading>
            <Lead className="mt-5">{intro}</Lead>
          </Reveal>

          <div className="relative mt-12">
            <ScrollLine className="absolute top-5 bottom-5 left-5" />
            <ol className="space-y-10">
              {steps.map((step, i) => (
                <li key={step.id} className="relative flex gap-6">
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-ink-300 bg-white font-mono text-sm font-semibold on-dark:border-white/15 on-dark:bg-ink-900">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="pt-1.5">
                    <Heading as="h3" size="md">
                      {step.title}
                    </Heading>
                    <p className="mt-2 text-ink-600 on-dark:text-ink-400">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <Card className="shadow-xl shadow-ink-950/5 lg:p-10">
          <Heading as="h3" size="lg">
            Start a Request
          </Heading>
          <p className="mt-2 mb-8 text-ink-600 on-dark:text-ink-400">
            Fields marked <span className="text-brand-700 on-dark:text-brand-400">*</span> are
            required.
          </p>
          {/* The form reads ?solution= from the URL, so it renders on the client. */}
          <Suspense fallback={<FormSkeleton />}>
            <RequestForm
              solutions={solutions.map(({ slug, title }) => ({ slug, title }))}
              defaultSolution={defaultSolution}
              defaultInquiry={defaultInquiry}
            />
          </Suspense>
        </Card>
      </div>
    </Section>
  )
}

function FormSkeleton() {
  return (
    <div aria-hidden className="space-y-5">
      {['h-11', 'h-11', 'h-11', 'h-32', 'h-13'].map((height, i) => (
        <div
          key={i}
          className={`${height} animate-pulse rounded-md bg-ink-100 on-dark:bg-white/5`}
        />
      ))}
    </div>
  )
}
