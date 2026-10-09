import { ArrowRight, Check } from 'lucide-react'

import { Counter } from '@/components/motion/counter'
import { ButtonLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography'
import type { HomePage } from '@/payload-types'

type WhySectionProps = HomePage['why'] & { credentials: string[] }

export function WhySection({ heading, text, stats, credentials }: WhySectionProps) {
  return (
    <Section tone="dark">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <Eyebrow>Why VTEGI</Eyebrow>
          <Heading className="mt-5">{heading}</Heading>
          <Lead className="mt-6">{text}</Lead>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {credentials.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-ink-300">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-500" />
                {item}
              </li>
            ))}
          </ul>
          <ButtonLink href="/contracting" variant="link" className="mt-10">
            Contracting information <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>

        {stats && stats.length > 0 && (
          <dl className="grid grid-cols-2 gap-x-8 gap-y-12 self-center">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col-reverse border-t border-white/15 pt-6">
                <dt className="mt-3 text-sm text-ink-400">{stat.label}</dt>
                <dd className="text-5xl font-bold font-stretch-semi-expanded md:text-6xl">
                  <Counter to={stat.value} suffix={stat.suffix ?? ''} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Section>
  )
}
