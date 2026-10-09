'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { MouseEvent } from 'react'
import { flushSync } from 'react-dom'

import { cn } from '@/lib/utils'

/** Theme reveal animation: length in ms, and an ease-in-out curve so the circle grows evenly. */
const REVEAL_DURATION = 1000
const REVEAL_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)'

/**
 * Switches between light and dark mode. The new theme is revealed as a circle growing from the
 * button (View Transitions API); browsers without it, and reduced-motion users, switch instantly.
 * Both icons are rendered and CSS shows the right one, so server and client markup always match.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.classList.toggle('dark', next === 'dark')
      flushSync(() => setTheme(next))
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduceMotion) return apply()

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    document.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: REVEAL_DURATION,
          easing: REVEAL_EASING,
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={toggle}
      className={cn(
        'group grid size-11 place-items-center rounded-md text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-950 on-dark:text-ink-300 on-dark:hover:bg-white/10 on-dark:hover:text-white',
        className,
      )}
    >
      <Moon
        aria-hidden
        className="size-5 transition-transform duration-300 group-hover:-rotate-12 dark:hidden"
      />
      <Sun
        aria-hidden
        className="hidden size-5 transition-transform duration-500 group-hover:rotate-90 dark:block"
      />
    </button>
  )
}
