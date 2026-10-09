import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function Badge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-ink-200 bg-ink-50 px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-wider text-ink-700 uppercase on-dark:border-white/15 on-dark:bg-white/5 on-dark:text-ink-300',
        className,
      )}
      {...props}
    />
  )
}
