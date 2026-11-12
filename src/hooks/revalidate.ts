import { revalidatePath } from 'next/cache'
import type { CollectionConfig, GlobalAfterChangeHook, RequestContext } from 'payload'

/** Any change refreshes every page: most content shows in the shared header and footer.
 * Scripts outside Next.js pass `context: { disableRevalidate: true }`. */
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
