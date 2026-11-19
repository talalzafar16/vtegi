import { cn } from '@/lib/utils'

import { stockLabel } from '../stock'
import type { Stock } from '../vendors'

const dot = {
  in: 'bg-emerald-500',
  low: 'bg-amber-500',
  out: 'bg-ink-300 on-dark:bg-ink-600',
}

/** "● In stock", with "· 100+ available" when `detailed`. */
export function StockStatus({
  stock,
  detailed = false,
  className,
}: {
  stock: Stock
  detailed?: boolean
  className?: string
}) {
  const { tone, label, detail } = stockLabel(stock)
  return (
    <p
      className={cn('flex items-center gap-2 text-sm text-ink-700 on-dark:text-ink-300', className)}
    >
      <span aria-hidden className={cn('size-2 shrink-0 rounded-full', dot[tone])} />
      {label}
      {detailed && detail && <span className="text-ink-500">· {detail}</span>}
    </p>
  )
}
