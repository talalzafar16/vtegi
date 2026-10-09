import Link from 'next/link'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

// Solid buttons get a faint top highlight (inset shadow) so they read as pressed metal, not flat fills.
const variants = {
  primary:
    'bg-brand-700 text-white shadow-sm inset-shadow-2xs inset-shadow-white/20 hover:bg-brand-800 hover:shadow-lg hover:shadow-brand-700/25',
  secondary:
    'bg-ink-900 text-white inset-shadow-2xs inset-shadow-white/10 hover:bg-ink-800 hover:shadow-lg hover:shadow-ink-950/20 on-dark:bg-white on-dark:text-ink-900 on-dark:hover:bg-ink-100',
  outline:
    'border border-ink-300 text-ink-900 hover:border-ink-900 hover:bg-ink-50 on-dark:border-white/20 on-dark:text-white on-dark:hover:border-white/60 on-dark:hover:bg-white/5',
  link: 'h-auto px-0 text-brand-700 hover:text-brand-800 active:scale-100 on-dark:text-brand-400 on-dark:hover:text-brand-300 [&_svg]:transition-transform hover:[&_svg]:translate-x-1',
}

const sizes = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

type ButtonStyleProps = {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

/** Shared button classes, so links and buttons look identical. */
export function buttonStyles({ variant = 'primary', size = 'md' }: ButtonStyleProps = {}) {
  return cn(
    'group inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-[color,background-color,border-color,box-shadow,scale] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    sizes[size],
    variants[variant],
  )
}

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & ButtonStyleProps) {
  return (
    <button type={type} className={cn(buttonStyles({ variant, size }), className)} {...props} />
  )
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link className={cn(buttonStyles({ variant, size }), className)} {...props} />
}
