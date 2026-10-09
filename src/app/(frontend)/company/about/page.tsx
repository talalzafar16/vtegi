import { BadgeCheck, Check } from 'lucide-react'
import type { Metadata } from 'next'

import { WhySection } from '@/components/home/why-section'
import { Reveal } from '@/components/motion/reveal'
import { Card } from '@/components/ui/card'
import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { getAboutPage, getHomePage, getSiteSettings } from '@/lib/cms'
import { credentialLabels } from '@/lib/credentials'

export const metadata: Metadata = {
  title: 'About VTEGI',
  description:
    'Virtual Technology Enterprise Group Inc. is a HUBZone-certified, veteran-owned IT company serving DoD and civilian markets.',
}

export default async function AboutPage() {
  const [about, home, settings] = await Promise.all([
    getAboutPage(),
    getHomePage(),
    getSiteSettings(),
  ])

  return (
    <>
      <PageHero eyebrow="About VTEGI" title={about.hero.headline} intro={about.hero.intro} />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { label: 'Our mission', text: about.mission },
            { label: 'Our vision', text: about.vision },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08} className="h-full">
              <Card className="h-full lg:p-10">
                <Eyebrow>{item.label}</Eyebrow>
                <p className="mt-5 text-xl leading-relaxed text-pretty text-ink-800 on-dark:text-ink-200">
                  {item.text}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {about.values && about.values.length > 0 && (
        <Section tone="muted">
          <Eyebrow>Core values</Eyebrow>
          <Heading className="mt-5">From idea to realization.</Heading>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((value, i) => (
              <li key={value.id}>
                <Reveal delay={i * 0.06} className="h-full">
                  <Card className="h-full">
                    <span className="font-mono text-xs text-brand-700 on-dark:text-brand-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Heading as="h3" size="md" className="mt-4">
                      {value.title}
                    </Heading>
                    <p className="mt-3 text-sm text-ink-600 on-dark:text-ink-400">{value.text}</p>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <WhySection {...home.why} credentials={credentialLabels(settings).all} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <LabelList title="Company highlights" items={about.highlights} icon="check" />
          <LabelList title="Team certifications" items={about.teamCertifications} icon="badge" />
        </div>
      </Section>
    </>
  )
}

type LabelListProps = {
  title: string
  items?: { id?: string | null; label: string }[] | null
  icon: 'check' | 'badge'
}

function LabelList({ title, items, icon }: LabelListProps) {
  if (!items?.length) return null
  const ItemIcon = icon === 'check' ? Check : BadgeCheck
  return (
    <div>
      <Eyebrow>{title}</Eyebrow>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id ?? item.label} className="flex gap-3 text-ink-700 on-dark:text-ink-300">
            <ItemIcon
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-brand-700 on-dark:text-brand-400"
            />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
