import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { filtersOf, listCategory, resolveFilter, tabsOf, type Tab } from '@/features/store/catalog'
import { getStoreCategory } from '@/features/store/categories'
import { CategoryNav } from '@/features/store/components/category-nav'
import { ProductGrid, ProductGridSkeleton } from '@/features/store/components/product-grid'
import { categoryHref } from '@/features/store/links'

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ tab?: string; filter?: string; page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getStoreCategory((await params).category)
  if (!category) return {}
  return {
    title: `${category.title} | Store`,
    description: category.description ?? `Shop ${category.title} from VTEGI.`,
  }
}

export default async function StoreCategoryPage({ params, searchParams }: Props) {
  const [{ category: slug }, query] = await Promise.all([params, searchParams])
  const category = await getStoreCategory(slug)
  if (!category) notFound()

  const tabs = tabsOf(category)
  const tab: Tab | undefined = tabs.find((t) => t === query.tab) ?? tabs[0]
  const filter = tab ? resolveFilter(category, tab, query.filter) : null
  // Ingram returns at most 10,000 results, i.e. 200 pages of 50.
  const page = Math.min(Math.max(1, Number.parseInt(query.page ?? '', 10) || 1), 200)

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Link href="/store" className="hover:underline">
              Store
            </Link>
            &nbsp;/&nbsp;{category.title}
          </>
        }
        title={category.title}
        intro={category.description}
      />

      <Section id="products" className="scroll-mt-16 py-16 md:py-20">
        {tab ? (
          <>
            <CategoryNav
              slug={category.slug}
              tabs={tabs}
              tab={tab}
              filters={filtersOf(category, tab)}
              filter={filter}
              allowAll={tab === 'software'}
            />
            <div className="mt-10">
              {/* Keyed so the skeleton shows again when the tab, filter or page changes. */}
              <Suspense key={`${tab}:${filter}:${page}`} fallback={<ProductGridSkeleton />}>
                <ProductGrid
                  listing={listCategory(category, tab, filter, page)}
                  page={page}
                  // Back to the top of the product list (this section has id="products").
                  pageHref={(target) =>
                    `${categoryHref(category.slug, { tab, filter, page: target })}#products`
                  }
                />
              </Suspense>
            </div>
          </>
        ) : (
          <p className="text-ink-600 on-dark:text-ink-400">
            Products for this category are coming soon.
          </p>
        )}
      </Section>
    </>
  )
}
