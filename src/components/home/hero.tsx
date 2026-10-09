import { ArrowRight, Check } from 'lucide-react'

import { LineReveal } from '@/components/motion/line-reveal'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { HeroBackdrop } from '@/components/ui/hero-backdrop'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography'
import type { HomePage } from '@/payload-types'

import { Globe } from './globe'

type HeroProps = { content: HomePage['hero']; trust: string[] }

export function Hero({ content, trust }: HeroProps) {
  const lines = content.headline.split('\n').filter(Boolean)

  return (
    <section
      data-tone="dark"
      className="relative overflow-hidden bg-ink-950 text-white dark:bg-ink-1000"
    >
      <HeroBackdrop />

      <Container className="relative grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <Eyebrow className="animate-fade-in motion-reduce:animate-none">
            {content.eyebrow}
          </Eyebrow>
          <Heading as="h1" size="display" className="mt-6">
            <LineReveal
              lines={lines.map((line, i) =>
                i === lines.length - 1 ? (
                  <span key={line} className="text-brand-500">
                    {line}
                  </span>
                ) : (
                  line
                ),
              )}
            />
          </Heading>
          <div className="animate-fade-in [animation-delay:500ms] motion-reduce:animate-none">
            <Lead className="mt-6 max-w-xl">{content.intro}</Lead>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="#request" size="lg">
                Start a Request
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </ButtonLink>
              <ButtonLink href="#solutions" variant="outline" size="lg">
                Explore solutions
              </ButtonLink>
            </div>
            <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-400">
              {trust.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check aria-hidden className="size-4 text-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Globe className="relative mx-auto hidden w-full max-w-[560px] md:block" />
      </Container>
    </section>
  )
}
