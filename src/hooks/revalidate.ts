import { revalidatePath } from 'next/cache'
import type { CollectionConfig, GlobalAfterChangeHook, RequestContext } from 'payload'

/**
 * Content changed → refresh every page. The site is small and most content
 * (settings, solutions, partners) appears in the shared header/footer, so a
 * full refresh is the simplest correct choice.
 * Scripts outside Next.js (e.g. the seed) pass `context: { disableRevalidate: true }`.
 */
function revalidateSite(context: RequestContext) {
  if (!context.disableRevalidate) revalidatePath('/', 'layout')
}

/** Use in a collection config: `hooks: revalidateHooks`. */
export const revalidateHooks: CollectionConfig['hooks'] = {
  afterChange: [
    ({ doc, req }) => {
      revalidateSite(req.context)
      return doc
    },
  ],
  afterDelete: [
    ({ doc, req }) => {
      revalidateSite(req.context)
      return doc
    },
  ],
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  revalidateSite(req.context)
  return doc
}
