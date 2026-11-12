'use client'

import { Pause, Play } from 'lucide-react'
import { useState, type CSSProperties, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type MarqueeProps = {
  children: ReactNode
  /** Seconds for one full loop. */
  duration?: number
  className?: string
}

/** Infinite logo scroller: pauses on hover, has a pause button (WCAG 2.2.2), still for reduced motion. */
export function Marquee({ children, duration = 40, className }: MarqueeProps) {
  const [paused, setPaused] = useState(false)
  const track = cn(
    'flex shrink-0 animate-marquee items-center gap-16 pr-16 group-hover:[animation-play-state:paused] motion-reduce:animate-none',
    paused && '[animation-play-state:paused]',
  )

  return (
    <div className={cn('relative', className)}>
      <div
        className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        <div className={track}>{children}</div>
        <div className={cn(track, 'motion-reduce:hidden')} aria-hidden>
          {children}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused(!paused)}
        aria-label={paused ? 'Play scrolling logos' : 'Pause scrolling logos'}
        className="absolute right-0 -bottom-8 rounded p-1 text-ink-400 hover:text-ink-900 motion-reduce:hidden on-dark:text-ink-500 on-dark:hover:text-white"
      >
        {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
      </button>
    </div>
  )
}
