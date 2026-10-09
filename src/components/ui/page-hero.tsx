import type { ReactNode } from 'react'

import { Container } from './container'
import { HeroBackdrop } from './hero-backdrop'
import { Eyebrow, Heading, Lead } from './typography'

type PageHeroProps = {
  eyebrow: ReactNode
  title: string
  intro?: string | null
  /** Buttons or meta info under the intro. */
  children?: ReactNode
}

/** Dark header for inner pages: eyebrow, h1, intro and optional actions. */
export function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section
      data-tone="dark"
      className="relative overflow-hidden bg-ink-950 text-white dark:bg-ink-1000"
    >
      <HeroBackdrop />
      <Container className="relative py-20 md:py-28">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading as="h1" size="xl" className="mt-5 max-w-4xl">
          {title}
        </Heading>
        {intro && <Lead className="mt-6 max-w-2xl">{intro}</Lead>}
        {children && <div className="mt-10">{children}</div>}
      </Container>
    </section>
  )
}
