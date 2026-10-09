import { ArrowRight, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

import { Reveal } from '@/components/motion/reveal'
import { SpotlightCard } from '@/components/motion/spotlight-card'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography'
import type { HomePage, Solution } from '@/payload-types'

import { RequestLink } from '@/features/request-form/request-link'

type SolutionsSectionProps = HomePage['solutions'] & { solutions: Solution[] }

/** Step 1 of the home page flow: pick a solution. "Request" pre-selects it in the form below. */
export function SolutionsSection({ heading, intro, solutions }: SolutionsSectionProps) {
  return (
    <Section id="solutions">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
        <div>
          <Eyebrow>Step 01 / Find your solution</Eyebrow>
          <Heading className="mt-5">{heading}</Heading>
        </div>
        <Lead className="lg:max-w-md lg:justify-self-end">{intro}</Lead>
      </div>

      <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution, i) => (
          <li key={solution.id}>
            <Reveal delay={i * 0.06} className="h-full">
              <SolutionCard solution={solution} index={i + 1} />
            </Reveal>
          </li>
        ))}
        <li>
          <Reveal delay={solutions.length * 0.06} className="h-full">
            <StoreCard />
          </Reveal>
        </li>
      </ul>
    </Section>
  )
}

function SolutionCard({ solution, index }: { solution: Solution; index: number }) {
  const audiences = solution.audiences?.map((a) => a.label).join(' · ')

  return (
    <SpotlightCard className="h-full">
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
          <Icon name={solution.icon} className="size-6" />
        </span>
        <span className="font-mono text-xs text-zinc-400">{String(index).padStart(2, '0')}</span>
      </div>
      <Heading as="h3" size="md" className="mt-8">
        {solution.title}
      </Heading>
      <p className="mt-3 text-zinc-600">{solution.shortDescription}</p>
      {audiences && (
        <p className="mt-4 font-mono text-[11px] tracking-wider text-zinc-500 uppercase">
          {audiences}
        </p>
      )}
      <div className="mt-auto pt-8">
        <ButtonLink href={`/solutions/${solution.slug}`} variant="link">
          Learn more <ArrowRight aria-hidden className="size-4" />
        </ButtonLink>
        <RequestLink
          solution={solution.slug}
          className="group/request mt-5 flex items-center justify-between border-t border-zinc-100 pt-5 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          {solution.ctaLabel}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover/request:translate-x-1"
          />
        </RequestLink>
      </div>
    </SpotlightCard>
  )
}

/** The store is not a CMS solution yet (e-commerce is a later phase). */
function StoreCard() {
  return (
    <div
      data-tone="dark"
      className="relative flex h-full flex-col overflow-hidden rounded-xl bg-zinc-950 p-6 text-white md:p-8"
    >
      <div
        aria-hidden
        className="absolute -top-24 -right-24 size-64 rounded-full bg-brand-700/30 blur-3xl"
      />
      <div className="relative flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-lg bg-brand-700">
          <ShoppingCart aria-hidden className="size-6" />
        </span>
        <Badge>Coming soon</Badge>
      </div>
      <Heading as="h3" size="md" className="relative mt-8">
        VTEGI e-Commerce Store
      </Heading>
      <p className="relative mt-3 text-zinc-400">
        Browse and purchase hardware, software, and licensing directly.
      </p>
      <p className="relative mt-4 font-mono text-[11px] tracking-wider text-zinc-500 uppercase">
        Hardware · Software · Licensing
      </p>
      <div className="relative mt-auto pt-8">
        <Link
          href="/store"
          className="group/store flex items-center justify-between border-t border-white/10 pt-5 text-sm font-semibold"
        >
          Shop Now
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover/store:translate-x-1"
          />
        </Link>
      </div>
    </div>
  )
}
