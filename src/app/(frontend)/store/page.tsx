import { ArrowRight, Cloud, HardDrive, Store } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Icon } from '@/components/ui/icon'
import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography'
import { tabsOf } from '@/features/store/catalog'
import { getStoreCategories } from '@/features/store/categories'
import { SearchBox } from '@/features/store/components/search-box'

export const metadata: Metadata = {
  title: 'Store',
  description:
    'Hardware, software and cloud subscriptions from leading brands, with prices online and quotes by email.',
}

export default async function StorePage() {
  const categories = await getStoreCategories()

  return (
    <>
      <PageHero
        eyebrow="VTEGI Store"
        title="Your one-stop destination for IT solutions."
        intro="From computer hardware and networking to business software and complete IT infrastructure, from leading brands including Dell, Cisco, IBM, Microsoft and Lenovo."
      >
        <SearchBox />
        <p className="mt-4 text-sm text-ink-400">
          Can’t find it?{' '}
          <Link href="/request?inquiry=quote" className="font-semibold text-white hover:underline">
            Tell us what you need
          </Link>{' '}
          and we’ll source it.
        </p>
      </PageHero>

      <Section>
        <Eyebrow>Browse categories</Eyebrow>
        <Heading className="mt-5">Find the technology you need.</Heading>
        <Lead className="mt-5 max-w-2xl">
          Browse live products and prices from our distribution partners, then request a quote for
          the items and quantities you need.
        </Lead>
        {categories.length > 0 ? (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const tabs = tabsOf(category)
              return (
                <li key={category.slug}>
                  <Link href={`/store/${category.slug}`} className="group block h-full">
                    <Card className="flex h-full flex-col transition-[border-color,box-shadow,translate] duration-500 group-hover:-translate-y-1 group-hover:border-brand-700/30 group-hover:shadow-2xl group-hover:shadow-ink-950/[0.07] motion-reduce:group-hover:translate-y-0">
                      <Icon
                        name={category.icon}
                        className="size-7 text-brand-700 on-dark:text-brand-400"
                      />
                      <span className="mt-6 block text-lg font-semibold">{category.title}</span>
                      {category.description && (
                        <span className="mt-2 block text-sm text-ink-600 on-dark:text-ink-400">
                          {category.description}
                        </span>
                      )}
                      <span className="mt-auto flex items-center justify-between gap-4 pt-6">
                        <span className="flex gap-3 text-xs text-ink-500">
                          {tabs.includes('hardware') && (
                            <span className="flex items-center gap-1.5">
                              <HardDrive aria-hidden className="size-3.5" /> Hardware
                            </span>
                          )}
                          {tabs.includes('software') && (
                            <span className="flex items-center gap-1.5">
                              <Cloud aria-hidden className="size-3.5" /> Software & Cloud
                            </span>
                          )}
                        </span>
                        <ArrowRight
                          aria-hidden
                          className="size-4 text-brand-700 transition-transform group-hover:translate-x-1 on-dark:text-brand-400"
                        />
                      </span>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="mt-12">
            <EmptyState
              icon={Store}
              title="Our online catalog is on its way"
              text="Until then, tell us what you need and we'll send you a quote."
              action={<ButtonLink href="/request?inquiry=quote">Request a quote</ButtonLink>}
            />
          </div>
        )}
      </Section>

      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <Eyebrow>Built around your work</Eyebrow>
            <Heading className="mt-5">A computer configured around your needs.</Heading>
            <Lead className="mt-5">
              Tell us how you plan to use your computer, the applications you run, your performance
              requirements and budget. We’ll help you choose a configuration that fits.
            </Lead>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink href="/request?inquiry=custom-build" size="lg">
              Discuss your custom build
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  )
}
