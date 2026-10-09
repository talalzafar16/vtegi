import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 bg-white p-6 md:p-8 on-dark:border-white/10 on-dark:bg-white/[0.03]',
        className,
      )}
      {...props}
    />
  )
}
