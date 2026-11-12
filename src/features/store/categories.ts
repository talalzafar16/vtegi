import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { DistributorList, StoreCategory } from '@/payload-types'

export type IngramGroup = {
  /** URL value for the filter chip, e.g. "laptops". */
  key: string
  label: string
  category: string
  keyword?: string
  brand?: string
}

export type Pax8Rule = { brand: string; includeWords: string[]; excludeWords: string[] }

export type Category = {
  slug: string
  title: string
  description: string | null
  icon: StoreCategory['icon']
  ingramGroups: IngramGroup[]
  pax8Rules: Pax8Rule[]
}

const nameOf = (value: number | DistributorList | null | undefined) =>
  value && typeof value === 'object' ? value.name : undefined

/** URL-friendly key, e.g. "Wire & Cables" → "wire-cables". */
export const toKey = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const words = (values: string[] | null | undefined) =>
  (values ?? []).map((word) => word.trim().toLowerCase()).filter(Boolean)

function toCategory(doc: StoreCategory): Category {
  const ingramGroups = (doc.ingramGroups ?? []).flatMap((group, index): IngramGroup[] => {
    const category = nameOf(group.category)
    if (!category) return []
    return [
      {
        key: toKey(group.label) || String(index + 1),
        label: group.label,
        category,
        keyword: group.keyword?.trim() || undefined,
        brand: nameOf(group.brand),
      },
    ]
  })

  const pax8Rules = (doc.pax8Rules ?? []).flatMap((rule): Pax8Rule[] => {
    const brand = nameOf(rule.brand)
    if (!brand) return []
    return [
      { brand, includeWords: words(rule.includeWords), excludeWords: words(rule.excludeWords) },
    ]
  })

  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description ?? null,
    icon: doc.icon,
    ingramGroups,
    pax8Rules,
  }
}

/** Visible store categories in Terry's order. Read from the database on every request. */
export const getStoreCategories = cache(async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'store-categories',
    where: { visible: { equals: true } },
    sort: '_order',
    depth: 1,
    limit: 100,
  })
  return docs.map(toCategory)
})

export const getStoreCategory = async (slug: string) =>
  (await getStoreCategories()).find((category) => category.slug === slug) ?? null

/** Does a Pax8 product belong to a rule? Brand must match; then include/exclude words on the name. */
export function matchesRule(product: { name: string; brand: string }, rule: Pax8Rule) {
  if (product.brand.toLowerCase() !== rule.brand.toLowerCase()) return false
  const name = product.name.toLowerCase()
  if (rule.excludeWords.some((word) => name.includes(word))) return false
  return rule.includeWords.length === 0 || rule.includeWords.some((word) => name.includes(word))
}
