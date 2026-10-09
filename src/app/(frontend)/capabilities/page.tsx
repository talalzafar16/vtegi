import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/motion/reveal'
import { Icon } from '@/components/ui/icon'
import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { Heading } from '@/components/ui/typography'
import { getCapabilities } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Capabilities',
  description:
    'Virtualization, data center, network infrastructure and security, unified communications, GIS and enterprise IT support.',
}

export default async function CapabilitiesPage() {
  const capabilities = await getCapabilities()

  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="From requirements to reliable operations."
        intro="Start with the technology challenge, then connect the expertise needed to plan, implement and support the solution."
      />
      <Section>
        <ul className="divide-y divide-ink-200 border-y border-ink-200 on-dark:divide-white/10 on-dark:border-white/10">
          {capabilities.map((capability, i) => (
            <li key={capability.id}>
              <Reveal delay={i * 0.04}>
                <Link
                  href={`/capabilities/${capability.slug}`}
                  className="group grid gap-6 py-10 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-10"
                >
                  <span className="grid size-14 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white on-dark:bg-brand-700/15 on-dark:text-brand-400">
                    <Icon name={capability.icon} className="size-7" />
                  </span>
                  <span>
                    <Heading
                      as="h2"
                      size="lg"
                      className="transition-colors group-hover:text-brand-700 on-dark:group-hover:text-brand-400"
                    >
                      {capability.title}
                    </Heading>
                    <span className="mt-3 block max-w-2xl text-ink-600 on-dark:text-ink-400">
                      {capability.summary}
                    </span>
                    {capability.offerings && capability.offerings.length > 0 && (
                      <span className="mt-5 flex flex-wrap gap-2">
                        {capability.offerings.slice(0, 4).map((offering) => (
                          <span
                            key={offering.id}
                            className="rounded-full bg-ink-100 px-3 py-1 text-sm text-ink-700 on-dark:bg-white/5 on-dark:text-ink-300"
                          >
                            {offering.label}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="hidden size-6 text-ink-400 transition group-hover:translate-x-1 group-hover:text-ink-900 md:block on-dark:group-hover:text-white"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
