import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { Container } from './container'

const tones = {
  light: 'bg-white text-zinc-900',
  muted: 'bg-zinc-50 text-zinc-900',
  dark: 'bg-zinc-950 text-white',
}

type SectionProps = ComponentProps<'section'> & {
  tone?: keyof typeof tones
  /** Extra classes for the inner container. */
  containerClassName?: string
}

/** Page section with vertical rhythm, a background tone and a centered container. */
export function Section({
  tone = 'light',
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section data-tone={tone} className={cn('py-20 md:py-28', tones[tone], className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}
