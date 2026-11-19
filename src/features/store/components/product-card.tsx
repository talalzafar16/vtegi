import Link from 'next/link'

import { ButtonLink } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { formatPrice } from '@/lib/format'

import type { StoreProduct } from '../catalog'
import { productHref } from '../links'
import { StockStatus } from './stock-status'

export const cardStyles =
  'flex h-full flex-col rounded-xl border border-ink-200 bg-white p-5 on-dark:border-white/10 on-dark:bg-white/[0.03]'

/** The whole card opens the product page; the button jumps straight to its quote form. */
export function ProductCard({ product }: { product: StoreProduct }) {
  const href = productHref(product)
  return (
    <article
      className={`${cardStyles} relative transition-[border-color,box-shadow] duration-300 hover:border-ink-300 hover:shadow-xl hover:shadow-ink-950/[0.05] on-dark:hover:border-white/20`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="truncate font-mono text-[11px] font-medium tracking-wider text-brand-700 uppercase on-dark:text-brand-400">
          {product.brand || 'Other'}
        </p>
        <Icon name={product.icon} className="size-5 shrink-0 text-ink-300 on-dark:text-ink-600" />
      </div>
      <h3 className="mt-3 line-clamp-3 leading-snug font-semibold" title={product.name}>
        <Link href={href} className="after:absolute after:inset-0 after:rounded-xl">
          {product.name}
        </Link>
      </h3>
      {product.partNumber && (
        <p className="mt-2 truncate font-mono text-xs text-ink-500">Part # {product.partNumber}</p>
      )}

      <div className="mt-auto pt-6">
        <Price product={product} />
        {product.stock && <StockStatus stock={product.stock} className="mt-2" />}
        <ButtonLink href={`${href}#quote`} variant="outline" className="relative z-10 mt-4 w-full">
          Request a Quote
        </ButtonLink>
      </div>
    </article>
  )
}

function Price({ product }: { product: StoreProduct }) {
  if (product.price === null) {
    return <p className="text-sm text-ink-600 on-dark:text-ink-400">Price on request</p>
  }
  const muted = 'text-sm text-ink-600 on-dark:text-ink-400'
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5">
      {product.priceFrom && <span className={muted}>From</span>}
      <span className="text-xl font-semibold tracking-tight tabular-nums">
        {formatPrice(product.price)}
      </span>
      {product.priceSuffix && <span className={muted}>{product.priceSuffix}</span>}
    </p>
  )
}
