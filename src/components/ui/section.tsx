import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { Container } from './container'

// In dark mode, light/muted sections turn dark and dark sections go to black, keeping the rhythm.
const tones = {
  light: 'bg-white text-ink-900 dark:bg-ink-950 dark:text-ink-100',
  muted: 'bg-ink-50 text-ink-900 dark:bg-ink-900 dark:text-ink-100',
  dark: 'bg-ink-950 text-white dark:bg-ink-1000',
}

type SectionProps = ComponentProps<'section'> & {
  tone?: keyof typeof tones
  containerClassName?: string
}

export function Section({
  tone = 'light',
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-tone={tone}
      // Dark mode: hairline section edges give structure instead of relying on flat color blocks.
      className={cn(
        'py-24 md:py-32 dark:border-t dark:border-white/[0.06]',
        tones[tone],
        className,
      )}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}
