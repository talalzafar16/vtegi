import type { MetadataRoute } from 'next'

import { getStoreCategories } from '@/features/store/categories'
import { listDocs } from '@/lib/cms'
import { SITE_URL } from '@/lib/site'

// Regenerated at most hourly, so new CMS content and categories appear without a redeploy.
export const revalidate = 3600

const PAGES = [
  '',
  '/solutions',
  '/capabilities',
  '/company/about',
  '/company/news',
  '/company/events',
  '/company/careers',
  '/partners',
  '/contracting',
  '/contact',
  '/request',
  '/store',
]

type Doc = { slug: string; updatedAt: string }

const entries = (base: string, docs: Doc[]) =>
  docs.map((doc) => ({ url: `${SITE_URL}${base}/${doc.slug}`, lastModified: doc.updatedAt }))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [solutions, capabilities, news, events, jobs, pages, categories] = await Promise.all([
    listDocs('solutions', '_order'),
    listDocs('capabilities', '_order'),
    listDocs('news', 'slug'),
    listDocs('events', 'slug'),
    listDocs('jobs', 'slug'),
    listDocs('pages', 'slug'),
    getStoreCategories(),
  ])

  return [
    ...PAGES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...entries('/solutions', solutions),
    ...entries('/capabilities', capabilities),
    ...entries('/company/news', news),
    ...entries('/company/events', events),
    ...entries('/company/careers', jobs),
    ...entries('', pages),
    ...categories.map((category) => ({ url: `${SITE_URL}/store/${category.slug}` })),
  ]
}
