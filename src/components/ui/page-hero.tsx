import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Container } from './container'
import { HeroBackdrop } from './hero-backdrop'
import { Eyebrow, Heading, Lead } from './typography'

type PageHeroProps = {
  eyebrow: ReactNode
  title: string
  intro?: string | null
  children?: ReactNode
}

// Each line rises in a beat after the one above it.
const rise = 'animate-rise motion-reduce:animate-none'

export function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section
      data-tone="dark"
      className="relative overflow-hidden bg-ink-950 text-white dark:bg-ink-1000"
    >
      <HeroBackdrop />
      <Container className="relative py-20 md:py-28">
        <Eyebrow className={rise}>{eyebrow}</Eyebrow>
        <Heading as="h1" size="xl" className={cn(rise, 'mt-5 max-w-4xl [animation-delay:100ms]')}>
          {title}
        </Heading>
        {intro && (
          <Lead className={cn(rise, 'mt-6 max-w-2xl [animation-delay:200ms]')}>{intro}</Lead>
        )}
        {children && <div className={cn(rise, 'mt-10 [animation-delay:300ms]')}>{children}</div>}
      </Container>
    </section>
  )
}
