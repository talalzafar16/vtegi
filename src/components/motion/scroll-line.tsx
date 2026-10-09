'use client'

import { motion, useReducedMotion, useScroll } from 'motion/react'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

/** Vertical line that fills in red as its container scrolls through the viewport. */
export function ScrollLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 50%'] })

  return (
    <div ref={ref} aria-hidden className={cn('w-px bg-ink-200 on-dark:bg-white/10', className)}>
      <motion.div
        className="h-full w-full origin-top bg-brand-700"
        style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
      />
    </div>
  )
}
