import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Test deployments (NOINDEX=true) stay out of search engines entirely.
  if (process.env.NOINDEX === 'true') return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
