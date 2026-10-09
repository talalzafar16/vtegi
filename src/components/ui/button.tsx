import Link from 'next/link'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-brand-700 text-white shadow-sm hover:bg-brand-800',
  secondary:
    'bg-zinc-900 text-white hover:bg-zinc-800 on-dark:bg-white on-dark:text-zinc-900 on-dark:hover:bg-zinc-200',
  outline:
    'border border-zinc-300 text-zinc-900 hover:border-zinc-900 on-dark:border-white/20 on-dark:text-white on-dark:hover:border-white',
  link: 'h-auto px-0 text-brand-700 hover:text-brand-800 on-dark:text-brand-400 on-dark:hover:text-brand-300',
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
    'group inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
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
