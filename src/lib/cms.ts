import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

// Server-only CMS queries. `cache()` dedupes calls within a render; `overrideAccess: false`
// applies public access rules, so drafts and admin-only data never leak.

type PageCollection =
  'solutions' | 'capabilities' | 'partners' | 'news' | 'events' | 'jobs' | 'pages'

const payload = () => getPayload({ config })

export const listDocs = cache(async <T extends PageCollection>(collection: T, sort: string) => {
  const cms = await payload()
  const { docs } = await cms.find({
    collection,
    sort,
    limit: 100,
    overrideAccess: false,
  })
  return docs
})

export const getBySlug = cache(
  async <T extends Exclude<PageCollection, 'partners'>>(collection: T, slug: string) => {
    const cms = await payload()
    const { docs } = await cms.find({
      collection,
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: false,
    })
    return docs[0] ?? null
  },
)

/** Slugs for generateStaticParams. */
export async function getSlugs(collection: Exclude<PageCollection, 'partners'>) {
  const docs = await listDocs(collection, 'slug')
  return docs.map((doc) => ({ slug: doc.slug }))
}

export const getSolutions = () => listDocs('solutions', '_order')
export const getCapabilities = () => listDocs('capabilities', '_order')
export const getPartners = () => listDocs('partners', '_order')

export const getFeaturedPartners = cache(async () =>
  (await getPartners()).filter((partner) => partner.featured),
)

export const getSiteSettings = cache(async () =>
  (await payload()).findGlobal({ slug: 'site-settings', overrideAccess: false }),
)

export const getHomePage = cache(async () =>
  (await payload()).findGlobal({ slug: 'home-page', overrideAccess: false }),
)

export const getAboutPage = cache(async () =>
  (await payload()).findGlobal({ slug: 'about-page', overrideAccess: false }),
)
