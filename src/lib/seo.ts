import type { Metadata } from 'next'

type SeoDoc = {
  title: string
  meta?: { title?: string | null; description?: string | null } | null
}

/** Page metadata from a CMS document: SEO fields first, then sensible fallbacks. */
export function docMetadata(doc: SeoDoc, fallbackDescription?: string | null): Metadata {
  return {
    // SEO titles already include "| VTEGI", so skip the layout's title template.
    title: doc.meta?.title ? { absolute: doc.meta.title } : doc.title,
    description: doc.meta?.description || fallbackDescription || undefined,
  }
}
