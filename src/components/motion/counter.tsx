'use client'

import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

type CounterProps = {
  to: number
  suffix?: string
  duration?: number
  className?: string
}

/** Counts up from 0 when scrolled into view. Server HTML shows the final value (SEO, no-JS). */
export function Counter({ to, suffix = '', duration = 1.6, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduceMotion) return
    if (!inView) {
      el.textContent = `0${suffix}`
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (value) => (el.textContent = `${Math.round(value)}${suffix}`),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, to, suffix, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {`${to}${suffix}`}
    </span>
  )
}
