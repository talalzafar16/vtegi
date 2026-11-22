import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { PricingRules } from './pricing'

/** Store settings for server code, read with server access (the markup is admin-only in the API).
 * Prices stay off until a markup is set. */
export const getStoreSettings = cache(async () => {
  const payload = await getPayload({ config })
  const [store, site] = await Promise.all([
    payload.findGlobal({ slug: 'store-settings', depth: 1 }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  const rules: PricingRules | null =
    typeof store.markupPercent === 'number'
      ? {
          markupPercent: store.markupPercent,
          quantityDiscounts: store.quantityDiscounts ?? [],
          customPricingFrom: store.customPricingFrom,
        }
      : null

  const hiddenBrands = new Set(
    (store.hiddenBrands ?? []).flatMap((brand) =>
      typeof brand === 'object' ? [brand.name.toLowerCase()] : [],
    ),
  )

  return {
    rules,
    showPrices: Boolean(store.showPrices) && rules !== null,
    showDiscounts: store.showDiscounts !== false,
    notificationEmail: store.notificationEmail || site.leadEmail || site.email,
    salesperson: store.salesperson || null,
    hiddenBrands,
  }
})
