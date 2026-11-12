'use client'

import type { ComponentProps, PointerEvent } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function SpotlightCard({ className, children, ...props }: ComponentProps<'div'>) {
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <Card
      onPointerMove={onPointerMove}
      className={cn(
        'group relative overflow-hidden transition-[border-color,box-shadow,translate] duration-500 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-2xl hover:shadow-ink-950/[0.07] motion-reduce:hover:translate-y-0',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--x) var(--y), rgb(204 5 5 / 0.12), transparent 45%)',
        }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </Card>
  )
}
