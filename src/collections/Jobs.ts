import { slugField, type CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

/** Open positions. Unpublish a job to close it. */
export const workplaceOptions = [
  { label: 'On-site', value: 'on-site' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'Remote', value: 'remote' },
] as const

export const employmentTypes = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
] as const

export const clearanceLevels = [
  { label: 'None', value: 'none' },
  { label: 'Public Trust', value: 'public-trust' },
  { label: 'Secret', value: 'secret' },
  { label: 'Top Secret', value: 'top-secret' },
  { label: 'TS/SCI', value: 'ts-sci' },
] as const

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  versions: { drafts: true },
  admin: {
    group: 'Company',
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'employmentType', '_status'],
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
        { name: 'location', type: 'text', required: true },
        {
          name: 'workplace',
          type: 'select',
          required: true,
          defaultValue: 'on-site',
          options: [...workplaceOptions],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'employmentType',
          type: 'select',
          required: true,
          defaultValue: 'full-time',
          options: [...employmentTypes],
        },
        {
          name: 'clearance',
          type: 'select',
          defaultValue: 'none',
          options: [...clearanceLevels],
        },
      ],
    },
    { name: 'summary', type: 'textarea', required: true, maxLength: 300 },
    { name: 'description', type: 'richText', required: true },
    {
      name: 'applyUrl',
      type: 'text',
      admin: {
        description: 'Optional external application link. Otherwise the careers form is used.',
      },
    },
  ],
}
