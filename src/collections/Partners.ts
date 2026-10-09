import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const partnerCategories = [
  { label: 'Distributor', value: 'distributor' },
  { label: 'Hardware', value: 'hardware' },
  { label: 'Software', value: 'software' },
  { label: 'Security', value: 'security' },
  { label: 'Cloud', value: 'cloud' },
] as const

export const Partners: CollectionConfig = {
  slug: 'partners',
  orderable: true,
  admin: {
    group: 'Website',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'featured'],
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [...partnerCategories],
    },
    { name: 'website', type: 'text' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show in the home page logo scroller.' },
    },
  ],
}
