import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const headingSizes = {
  display: 'text-display font-semibold font-stretch-semi-expanded',
  xl: 'text-title font-semibold font-stretch-semi-expanded',
  lg: 'text-2xl font-semibold tracking-tight md:text-3xl',
  md: 'text-xl font-semibold tracking-tight',
}

type HeadingProps = ComponentProps<'h2'> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  size?: keyof typeof headingSizes
}

export function Heading({ as: Tag = 'h2', size = 'xl', className, ...props }: HeadingProps) {
  return <Tag className={cn('text-balance', headingSizes[size], className)} {...props} />
}

/** Small mono label above a heading, e.g. "STEP 01 / FIND YOUR SOLUTION". */
export function Eyebrow({ className, children, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-mono text-xs font-medium tracking-[0.2em] text-brand-700 uppercase on-dark:text-brand-400',
        className,
      )}
      {...props}
    >
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  )
}

/** Larger intro paragraph under a heading. */
export function Lead({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-lg text-pretty text-ink-600 md:text-xl on-dark:text-ink-400', className)}
      {...props}
    />
  )
}
