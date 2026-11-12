import { Cloud, HardDrive } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import type { Filter, Tab } from '../catalog'
import { categoryHref } from '../links'

export const tabLabels: Record<Tab, { label: string; icon: typeof Cloud }> = {
  hardware: { label: 'Hardware', icon: HardDrive },
  software: { label: 'Software & Cloud', icon: Cloud },
}

/** Hardware / Software & Cloud switch. Plain links, no JavaScript. */
export function StoreTabs({
  tabs,
  tab,
  hrefFor,
  counts,
}: {
  tabs: Tab[]
  tab: Tab
  hrefFor: (tab: Tab) => string
  /** Optional result count per tab, e.g. "12" or "24+". */
  counts?: Partial<Record<Tab, string>>
}) {
  return (
    <nav
      aria-label="Product type"
      className="inline-flex rounded-lg border border-ink-200 bg-ink-50 p-1 on-dark:border-white/10 on-dark:bg-white/[0.03]"
    >
      {tabs.map((value) => {
        const { label, icon: TabIcon } = tabLabels[value]
        const active = value === tab
        return (
          <Link
            key={value}
            href={hrefFor(value)}
            scroll={false}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-ink-600 hover:text-ink-900 on-dark:text-ink-400 on-dark:hover:text-white',
              active && 'bg-white text-ink-900 shadow-sm on-dark:bg-white/10 on-dark:text-white',
            )}
          >
            <TabIcon aria-hidden className="size-4" />
            {label}
            {counts?.[value] && (
              <span className="rounded-full bg-ink-200/70 px-2 py-0.5 text-xs font-medium tabular-nums on-dark:bg-white/10">
                {counts[value]}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

type CategoryNavProps = {
  slug: string
  tabs: Tab[]
  tab: Tab
  filters: Filter[]
  filter: string | null
  /** Software lists every brand together by default; hardware always has one group selected. */
  allowAll: boolean
}

/** A category's tabs and the filter chips under them. */
export function CategoryNav({ slug, tabs, tab, filters, filter, allowAll }: CategoryNavProps) {
  return (
    <div className="space-y-6">
      {tabs.length > 1 && (
        <StoreTabs tabs={tabs} tab={tab} hrefFor={(value) => categoryHref(slug, { tab: value })} />
      )}

      {(filters.length > 1 || (allowAll && filters.length > 0)) && (
        <nav aria-label="Filter products" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <ul className="flex gap-2 pb-1 sm:flex-wrap">
            {allowAll && (
              <li>
                <Chip href={categoryHref(slug, { tab })} active={filter === null}>
                  All
                </Chip>
              </li>
            )}
            {filters.map(({ key, label }) => (
              <li key={key}>
                <Chip href={categoryHref(slug, { tab, filter: key })} active={filter === key}>
                  {label}
                </Chip>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

function Chip({ href, active, children }: { href: string; active: boolean; children: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex h-9 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap',
        active
          ? 'border-ink-900 bg-ink-900 text-white on-dark:border-white on-dark:bg-white on-dark:text-ink-900'
          : 'border-ink-200 text-ink-700 hover:border-ink-400 on-dark:border-white/15 on-dark:text-ink-300 on-dark:hover:border-white/40',
      )}
    >
      {children}
    </Link>
  )
}
