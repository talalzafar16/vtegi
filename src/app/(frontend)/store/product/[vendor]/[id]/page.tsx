import { Check, FileText, Mail, PlugZap, ShoppingBag } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ButtonLink } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Icon } from '@/components/ui/icon'
import { Section } from '@/components/ui/section'
import { Heading } from '@/components/ui/typography'
import { getProduct, productOffers, splitName } from '@/features/store/catalog'
import { tabLabels } from '@/features/store/components/category-nav'
import { StockStatus } from '@/features/store/components/stock-status'
import { categoryHref } from '@/features/store/links'
import { QuoteForm } from '@/features/store/quote/quote-form'
import type { VendorId } from '@/features/store/vendors'

type Props = { params: Promise<{ vendor: string; id: string }> }

const isVendor = (value: string): value is VendorId => value === 'ingram' || value === 'pax8'
// Ingram part numbers and Pax8 ids are letters, digits and dashes.
const isProductId = (value: string) => /^[A-Za-z0-9-]{1,64}$/.test(value)

/** The product, null when the store doesn't sell it, or "failed" when the distributor is down. */
async function load(params: Props['params']) {
  const { vendor, id } = await params
  if (!isVendor(vendor) || !isProductId(id)) return null
  try {
    return await getProduct(vendor, id)
  } catch (error) {
    console.error('[store] Product page failed:', vendor, id, error)
    return 'failed' as const
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(params)
  if (!found || found === 'failed') return { title: 'Store' }
  const { title } = splitName(found.product)
  return {
    title: `${title} | Store`,
    description: `${found.product.name}. Request a quote from VTEGI.`.slice(0, 300),
  }
}

const steps = [
  { icon: FileText, title: 'Request a quote', text: 'Choose a quantity and tell us who you are.' },
  {
    icon: Mail,
    title: 'Get it by email',
    text: 'Your quote arrives as a PDF, usually right away.',
  },
  {
    icon: ShoppingBag,
    title: 'Order with VTEGI',
    text: 'Reply to order. We confirm shipping, tax and payment.',
  },
]

export default async function ProductPage({ params }: Props) {
  const found = await load(params)
  if (!found) notFound()

  if (found === 'failed') {
    return (
      <Section>
        <EmptyState
          icon={PlugZap}
          title="This product is temporarily unavailable"
          text="We couldn't reach our distributor right now. Please try again shortly, or tell us what you need and we'll send you a quote."
          action={<ButtonLink href="/request?inquiry=quote">Request a quote</ButtonLink>}
        />
      </Section>
    )
  }

  const { product, category } = found
  const { offers, customFrom, stock } = await productOffers(product)
  const { title, highlights } = splitName(product)
  const tab = product.vendor === 'ingram' ? 'hardware' : 'software'

  return (
    <Section className="py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-600 on-dark:text-ink-400">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/store" className="hover:text-ink-900 on-dark:hover:text-white">
              Store
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={categoryHref(category.slug)}
              className="hover:text-ink-900 on-dark:hover:text-white"
            >
              {category.title}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={categoryHref(category.slug, { tab })}
              className="hover:text-ink-900 on-dark:hover:text-white"
            >
              {tabLabels[tab].label}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-12">
        <header className="lg:col-start-1">
          <p className="flex items-center gap-2 font-mono text-xs font-medium tracking-wider text-brand-700 uppercase on-dark:text-brand-400">
            <Icon name={category.icon} className="size-4" />
            {product.brand}
          </p>
          <Heading as="h1" size="lg" className="mt-4">
            {title}
          </Heading>
          {product.partNumber && (
            <p className="mt-4 font-mono text-sm text-ink-500">Part # {product.partNumber}</p>
          )}
          {stock && <StockStatus stock={stock} detailed className="mt-3" />}
        </header>

        <aside
          id="quote"
          className="scroll-mt-24 lg:col-start-2 lg:row-span-2 lg:row-start-1"
          aria-labelledby="quote-heading"
        >
          <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-xl shadow-ink-950/[0.04] md:p-7 on-dark:border-white/10 on-dark:bg-white/[0.03]">
            <Heading as="h2" size="md" id="quote-heading">
              Request a quote
            </Heading>
            <p className="mt-1 mb-6 text-sm text-ink-600 on-dark:text-ink-400">
              {stock?.status === 'out-of-stock'
                ? "This product is out of stock right now. Send your request and we'll contact you when it's available."
                : 'Prices include volume discounts and can change; your quote uses the latest price.'}
            </p>
            <QuoteForm
              vendor={product.vendor}
              productId={product.id}
              offers={offers}
              customFrom={customFrom}
            />
          </div>
        </aside>

        <div className="space-y-12 lg:col-start-1">
          {highlights.length > 0 && (
            <section>
              <Heading as="h2" size="md">
                Highlights
              </Heading>
              <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-ink-700 on-dark:text-ink-300">
                    <Check
                      aria-hidden
                      className="mt-1 size-4 shrink-0 text-brand-700 on-dark:text-brand-400"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {product.description && (
            <section>
              <Heading as="h2" size="md">
                Overview
              </Heading>
              <p className="mt-4 max-w-2xl text-ink-700 on-dark:text-ink-300">
                {product.description}
              </p>
            </section>
          )}

          {product.facts.length > 0 && (
            <section>
              <Heading as="h2" size="md">
                Details
              </Heading>
              <dl className="mt-5 divide-y divide-ink-100 border-y border-ink-100 text-sm on-dark:divide-white/10 on-dark:border-white/10">
                {product.facts.map((fact) => (
                  <div key={fact.label} className="grid gap-1 py-3 sm:grid-cols-[14rem_1fr]">
                    <dt className="text-ink-500">{fact.label}</dt>
                    <dd className="text-ink-900 on-dark:text-ink-100">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section>
            <Heading as="h2" size="md">
              How ordering works
            </Heading>
            <ol className="mt-5 grid gap-4 sm:grid-cols-3">
              {steps.map(({ icon: StepIcon, title: stepTitle, text }, index) => (
                <li
                  key={stepTitle}
                  className="rounded-xl border border-ink-200 p-5 on-dark:border-white/10"
                >
                  <StepIcon aria-hidden className="size-5 text-brand-700 on-dark:text-brand-400" />
                  <p className="mt-4 font-mono text-xs text-ink-500">0{index + 1}</p>
                  <p className="mt-1 font-semibold">{stepTitle}</p>
                  <p className="mt-1 text-sm text-ink-600 on-dark:text-ink-400">{text}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </Section>
  )
}
