import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { Reveal } from '@/components/motion/reveal'
import { ButtonLink } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading } from '@/components/ui/typography'
import type { Capability } from '@/payload-types'

type CapabilitiesSectionProps = { heading: string; capabilities: Capability[] }

export function CapabilitiesSection({ heading, capabilities }: CapabilitiesSectionProps) {
  return (
    <Section>
      <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>Enterprise IT expertise</Eyebrow>
          <Heading className="mt-5">{heading}</Heading>
        </div>
        <ButtonLink href="/capabilities" variant="link">
          All capabilities <ArrowRight aria-hidden className="size-4" />
        </ButtonLink>
      </Reveal>

      <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability, i) => (
          <li key={capability.id}>
            <Reveal delay={i * 0.05} className="h-full">
              <Link
                href={`/capabilities/${capability.slug}`}
                className="group flex h-full gap-5 rounded-xl border border-ink-200 p-6 transition duration-500 hover:-translate-y-0.5 hover:border-ink-900 hover:shadow-xl hover:shadow-ink-950/[0.06] motion-reduce:hover:translate-y-0 on-dark:border-white/10 on-dark:hover:border-white/40"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-ink-100 text-brand-700 transition-colors group-hover:bg-ink-900 group-hover:text-white on-dark:bg-white/5 on-dark:text-brand-400 on-dark:group-hover:bg-brand-700">
                  <Icon name={capability.icon} className="size-5" />
                </span>
                <span className="flex-1">
                  <span className="flex items-start justify-between gap-3 font-semibold">
                    {capability.title}
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 shrink-0 text-ink-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-900 on-dark:group-hover:text-white"
                    />
                  </span>
                  <span className="mt-2 block text-sm text-ink-600 on-dark:text-ink-400">
                    {capability.summary}
                  </span>
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
