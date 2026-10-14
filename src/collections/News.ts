import { slugField, type CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News Post', plural: 'News' },
  versions: { drafts: true },
  defaultSort: '-publishedAt',
  admin: {
    group: 'Company',
    description: 'News and press posts, shown under Company → News.',
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
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
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: { description: 'Short summary for lists and search results.' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', required: true },
  ],
}
