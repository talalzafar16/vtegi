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
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>Enterprise IT expertise</Eyebrow>
          <Heading className="mt-5">{heading}</Heading>
        </div>
        <ButtonLink href="/capabilities" variant="link">
          All capabilities <ArrowRight aria-hidden className="size-4" />
        </ButtonLink>
      </div>

      <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability, i) => (
          <li key={capability.id}>
            <Reveal delay={i * 0.05} className="h-full">
              <Link
                href={`/capabilities/${capability.slug}`}
                className="group flex h-full gap-5 rounded-xl border border-zinc-200 p-6 transition hover:border-zinc-900 hover:shadow-lg hover:shadow-zinc-950/5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-zinc-100 text-brand-700 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                  <Icon name={capability.icon} className="size-5" />
                </span>
                <span className="flex-1">
                  <span className="flex items-start justify-between gap-3 font-semibold">
                    {capability.title}
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-900"
                    />
                  </span>
                  <span className="mt-2 block text-sm text-zinc-600">{capability.summary}</span>
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
