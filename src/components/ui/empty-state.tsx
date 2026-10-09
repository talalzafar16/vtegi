import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  text: string
  /** Usually a ButtonLink. */
  action?: ReactNode
}

/** Friendly placeholder for lists with nothing published yet. */
export function EmptyState({ icon: IconComponent, title, text, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-14 text-center">
      <IconComponent aria-hidden className="mx-auto size-10 text-brand-700" />
      <p className="mt-5 text-xl font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-zinc-600">{text}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  )
}
