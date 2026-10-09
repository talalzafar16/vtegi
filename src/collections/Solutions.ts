import { slugField, type CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { iconField } from '@/fields/icon'
import { revalidateHooks } from '@/hooks/revalidate'

/** Audience solutions (Government, Commercial, ...). Each one powers /solutions/[slug]. */
export const Solutions: CollectionConfig = {
  slug: 'solutions',
  orderable: true,
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'shortDescription'],
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidateHooks,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Government Solutions' },
    },
    slugField(),
    iconField,
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: { description: 'One or two sentences, shown on the home page card.' },
    },
    {
      name: 'ctaLabel',
      label: 'Request button text',
      type: 'text',
      required: true,
      admin: { description: 'Request button text, e.g. "Request Government Support".' },
    },
    {
      name: 'audiences',
      type: 'array',
      admin: { description: 'Who this is for, e.g. Federal agencies, State government.' },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', required: true },
        { name: 'intro', type: 'textarea', required: true },
      ],
    },
    {
      name: 'capabilities',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'scenarios',
      type: 'array',
      admin: { description: 'Example situations that bring clients here.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'related',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
}
