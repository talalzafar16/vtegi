import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { Section } from '@/components/ui/section'
import { Heading } from '@/components/ui/typography'
import { PAGE_SIZE, searchCounts, searchStore, type Tab } from '@/features/store/catalog'
import { StoreTabs } from '@/features/store/components/category-nav'
import { ProductGrid, ProductGridSkeleton } from '@/features/store/components/product-grid'
import { SearchBox } from '@/features/store/components/search-box'
import { searchHref } from '@/features/store/links'

export const metadata: Metadata = {
  title: 'Search | Store',
  // Search result pages are endless variations; keep them out of search engines.
  robots: { index: false, follow: true },
}

type Props = { searchParams: Promise<{ q?: string; tab?: string; page?: string }> }

const tabs: Tab[] = ['hardware', 'software']

export default async function StoreSearchPage({ searchParams }: Props) {
  const params = await searchParams
  const query = (params.q ?? '').trim().slice(0, 100)
  const page = Math.min(Math.max(1, Number.parseInt(params.page ?? '', 10) || 1), 200)

  return (
    <Section id="products" className="scroll-mt-16 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-600 on-dark:text-ink-400">
        <Link href="/store" className="hover:text-ink-900 on-dark:hover:text-white">
          Store
        </Link>
        &nbsp;/&nbsp;Search
      </nav>
      <Heading as="h1" size="lg" className="mt-6">
        {query ? `Results for “${query}”` : 'Search the store'}
      </Heading>
      <SearchBox defaultValue={query} className="mt-6" />

      {query.length >= 2 ? (
        <Suspense key={`${query}:${params.tab}:${page}`} fallback={<ResultsSkeleton />}>
          <SearchResults query={query} requestedTab={params.tab} page={page} />
        </Suspense>
      ) : (
        <p className="mt-6 text-ink-600 on-dark:text-ink-400">
          Type at least two characters, e.g. “ThinkPad”, “Microsoft 365” or a part number.
        </p>
      )}
    </Section>
  )
}

const isTab = (value?: string): value is Tab => value === 'hardware' || value === 'software'

/** Tabs with result counts, and the results of the chosen (or best) tab. */
async function SearchResults({
  query,
  requestedTab,
  page,
}: {
  query: string
  requestedTab?: string
  page: number
}) {
  const counts = await searchCounts(query)
  // Without a chosen tab, open the one whose first page shows more products (hardware on a tie).
  const firstPage = (tab: Tab) => Math.min(counts[tab]?.count ?? 0, PAGE_SIZE)
  const tab: Tab = isTab(requestedTab)
    ? requestedTab
    : firstPage('software') > firstPage('hardware')
      ? 'software'
      : 'hardware'
  const labels = Object.fromEntries(
    Object.entries(counts).flatMap(([key, value]) =>
      value ? [[key, `${value.count}${value.more ? '+' : ''}`]] : [],
    ),
  )

  return (
    <>
      <div className="mt-10">
        <StoreTabs
          tabs={tabs}
          tab={tab}
          counts={labels}
          hrefFor={(value) => searchHref(query, { tab: value })}
        />
      </div>
      <div className="mt-8">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid
            listing={searchStore(query, tab, page)}
            page={page}
            pageHref={(target) => `${searchHref(query, { tab, page: target })}#products`}
          />
        </Suspense>
      </div>
    </>
  )
}

function ResultsSkeleton() {
  return (
    <>
      <div className="mt-10 h-11 w-80 animate-pulse rounded-lg bg-ink-100 on-dark:bg-white/5" />
      <div className="mt-8">
        <ProductGridSkeleton />
      </div>
    </>
  )
}
