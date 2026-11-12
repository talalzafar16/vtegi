import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { iconField } from '@/fields/icon'
import { revalidateHooks } from '@/hooks/revalidate'

const listOf = (distributor: 'ingram' | 'pax8', kind: 'category' | 'brand') => ({
  type: 'relationship' as const,
  relationTo: 'distributor-lists' as const,
  filterOptions: { distributor: { equals: distributor }, kind: { equals: kind } },
})

export const StoreCategories: CollectionConfig = {
  slug: 'store-categories',
  labels: { singular: 'Store Category', plural: 'Store Categories' },
  orderable: true,
  admin: {
    group: 'Store',
    useAsTitle: 'title',
    defaultColumns: ['title', 'visible'],
    description:
      'Categories in the online store. Drag to reorder, switch off to hide, and choose which distributor products each one shows.',
  },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'One or two sentences shown on the store home page and the category page.',
      },
    },
    iconField,
    {
      name: 'visible',
      label: 'Show in the store',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hardware (Ingram Micro)',
          fields: [
            {
              name: 'ingramGroups',
              label: 'Product groups',
              labels: { singular: 'Product group', plural: 'Product groups' },
              type: 'array',
              admin: {
                description:
                  'Each group is a filter on the Hardware tab, e.g. "Laptops" = Computer Systems + keyword "laptop". Ingram also lists many discontinued products, so always add a keyword or a brand.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '34%' } },
                    {
                      ...listOf('ingram', 'category'),
                      name: 'category',
                      label: 'Ingram category',
                      required: true,
                      admin: { width: '66%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'keyword', type: 'text', admin: { width: '34%' } },
                    { ...listOf('ingram', 'brand'), name: 'brand', admin: { width: '66%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Software & Cloud (Pax8)',
          fields: [
            {
              name: 'pax8Rules',
              label: 'Brand rules',
              labels: { singular: 'Brand rule', plural: 'Brand rules' },
              type: 'array',
              admin: {
                description:
                  'Pax8 has no categories, so products are chosen by brand. "Include words" narrows a brand down (a product matches if its name has any of them); "Exclude words" removes products.',
              },
              fields: [
                { ...listOf('pax8', 'brand'), name: 'brand', label: 'Pax8 brand', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'includeWords', type: 'text', hasMany: true, admin: { width: '50%' } },
                    { name: 'excludeWords', type: 'text', hasMany: true, admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
