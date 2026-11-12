import { ChevronLeft, ChevronRight, PackageSearch, PlugZap } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { ButtonLink, buttonStyles } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'

import { PAGE_SIZE, type Listing } from '../catalog'

import { cardStyles, ProductCard } from './product-card'

type ProductGridProps = {
  /** Started by the page, awaited here inside the Suspense boundary. */
  listing: Promise<Listing>
  page: number
  pageHref: (page: number) => string
}

const gridStyles = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

/** A page of live products. Streams in after the page shell (see the skeleton below). */
export async function ProductGrid({ listing: pending, page, pageHref }: ProductGridProps) {
  const listing = await pending

  if (listing.failed) {
    return (
      <EmptyState
        icon={PlugZap}
        title="Products are temporarily unavailable"
        text="We couldn't load this catalog right now. Please try again shortly, or tell us what you need and we'll send you a quote."
        action={<ButtonLink href="/request?inquiry=quote">Request a quote</ButtonLink>}
      />
    )
  }

  if (listing.products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={page > 1 ? 'No more products here' : 'No products found'}
        text="Tell us what you're looking for and we'll source it for you."
        action={<ButtonLink href="/request?inquiry=quote">Request a quote</ButtonLink>}
      />
    )
  }

  return (
    <>
      {listing.total !== undefined && (
        <p className="mb-6 text-sm text-ink-600 on-dark:text-ink-400">
          {listing.total} {listing.total === 1 ? 'product' : 'products'}
        </p>
      )}
      <ul className={gridStyles}>
        {listing.products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      {(page > 1 || listing.hasNext) && (
        <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-3">
          <PageLink href={pageHref(page - 1)} disabled={page <= 1} label="Previous page">
            <ChevronLeft aria-hidden className="size-4" /> Previous
          </PageLink>
          <span className="min-w-20 text-center font-mono text-sm text-ink-600 on-dark:text-ink-400">
            Page {page}
          </span>
          <PageLink href={pageHref(page + 1)} disabled={!listing.hasNext} label="Next page">
            Next <ChevronRight aria-hidden className="size-4" />
          </PageLink>
        </nav>
      )}
    </>
  )
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string
  disabled: boolean
  label: string
  children: ReactNode
}) {
  const className = cn(buttonStyles({ variant: 'outline' }), 'min-w-32')
  if (disabled) {
    return (
      <span aria-disabled className={cn(className, 'pointer-events-none opacity-40')}>
        {children}
      </span>
    )
  }
  return (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  )
}

/** Placeholder cards while a distributor responds (first visit can take a few seconds). */
export function ProductGridSkeleton() {
  return (
    <div role="status" aria-label="Loading products">
      <div className="mb-6 h-5 w-28 animate-pulse rounded bg-ink-100 on-dark:bg-white/5" />
      <ul className={gridStyles}>
        {Array.from({ length: Math.min(PAGE_SIZE, 8) }, (_, i) => (
          <li key={i} className={cn(cardStyles, 'min-h-64 animate-pulse')}>
            <div className="h-3 w-20 rounded bg-ink-100 on-dark:bg-white/5" />
            <div className="mt-4 h-4 w-full rounded bg-ink-100 on-dark:bg-white/5" />
            <div className="mt-2 h-4 w-3/4 rounded bg-ink-100 on-dark:bg-white/5" />
            <div className="mt-3 h-3 w-24 rounded bg-ink-100 on-dark:bg-white/5" />
            <div className="mt-auto h-6 w-28 rounded bg-ink-100 on-dark:bg-white/5" />
            <div className="mt-4 h-11 w-full rounded-md bg-ink-100 on-dark:bg-white/5" />
          </li>
        ))}
      </ul>
    </div>
  )
}
