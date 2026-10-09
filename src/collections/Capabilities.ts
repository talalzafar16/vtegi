import { slugField, type CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { iconField } from '@/fields/icon'
import { revalidateHooks } from '@/hooks/revalidate'

/** Technical service areas (Virtualization, Network & Security, ...). Powers /capabilities. */
export const Capabilities: CollectionConfig = {
  slug: 'capabilities',
  orderable: true,
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'summary'],
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    iconField,
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: { description: 'Shown on cards.' },
    },
    { name: 'description', type: 'richText' },
    {
      name: 'offerings',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'startingContext',
      type: 'textarea',
      admin: { description: 'What a client should share to get started.' },
    },
  ],
}
