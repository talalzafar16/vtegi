'use client'

import { motion, useScroll } from 'motion/react'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

/**
 * Vertical line that fills in red as its container scrolls through the viewport. Reduced motion
 * shows it full, via CSS, so server and client render the same markup.
 */
export function ScrollLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 50%'] })

  return (
    <div ref={ref} aria-hidden className={cn('w-px bg-ink-200 on-dark:bg-white/10', className)}>
      <motion.div
        className="h-full w-full origin-top bg-brand-700 motion-reduce:transform-none!"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  )
}
