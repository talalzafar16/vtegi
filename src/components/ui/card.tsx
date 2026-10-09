import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

// On dark surfaces, cards carry a short red "signal line" on the top edge, the same hairline
// motif as the Eyebrow labels and the hero's bottom edge.
const signalLine =
  'on-dark:before:absolute on-dark:before:-top-px on-dark:before:left-6 on-dark:before:h-px on-dark:before:w-10 on-dark:before:bg-brand-500 md:on-dark:before:left-8'

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative rounded-xl border border-ink-200 bg-white p-6 md:p-8 on-dark:border-white/10 on-dark:bg-white/[0.03]',
        signalLine,
        className,
      )}
      {...props}
    />
  )
}
