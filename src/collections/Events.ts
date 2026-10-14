import { slugField, type CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const eventFormats = [
  { label: 'In person', value: 'in-person' },
  { label: 'Virtual', value: 'virtual' },
  { label: 'Hybrid', value: 'hybrid' },
] as const

export const Events: CollectionConfig = {
  slug: 'events',
  versions: { drafts: true },
  defaultSort: '-startDate',
  admin: {
    group: 'Company',
    description: 'Upcoming and past events, shown under Company → Events.',
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'format', '_status'],
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
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        { name: 'endDate', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'format',
          type: 'select',
          required: true,
          defaultValue: 'in-person',
          options: [...eventFormats],
        },
        { name: 'location', type: 'text' },
      ],
    },
    { name: 'registrationUrl', type: 'text' },
    { name: 'summary', type: 'textarea', required: true, maxLength: 300 },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText' },
  ],
}
