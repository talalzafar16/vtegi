'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { MouseEvent } from 'react'
import { flushSync } from 'react-dom'

import { cn } from '@/lib/utils'

const REVEAL_DURATION = 1000
const REVEAL_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)'

/** Light/dark switch revealed as a circle growing from the button (View Transitions); other
 * browsers switch instantly. Both icons render and CSS picks one, so server and client match. */
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
