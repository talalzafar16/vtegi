import { slugField, type CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: { drafts: true },
  admin: {
    group: 'Website',
    description: 'Plain text pages such as the privacy policy and accessibility statement.',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'intro', type: 'textarea' },
    { name: 'content', type: 'richText', required: true },
  ],
}
