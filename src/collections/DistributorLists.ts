import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'
import { vendors } from '@/features/store/options'

export const DistributorLists: CollectionConfig = {
  slug: 'distributor-lists',
  labels: { singular: 'Distributor list entry', plural: 'Distributor Lists' },
  defaultSort: 'name',
  admin: {
    group: 'Store',
    useAsTitle: 'name',
    defaultColumns: ['name', 'distributor', 'kind', 'productCount'],
    listSearchableFields: ['name'],
    description:
      'Category and brand names found at each distributor, used by the Store Categories dropdowns. Products and prices are always live; only these names need a sync now and then.',
    components: { beforeList: ['/components/admin/sync-panel#SyncPanel'] },
  },
  access: { read: authenticated, create: () => false, update: () => false, delete: () => false },
  indexes: [{ fields: ['distributor', 'kind', 'name'], unique: true }],
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'distributor', type: 'select', required: true, options: [...vendors] },
        {
          name: 'kind',
          type: 'select',
          required: true,
          options: [
            { label: 'Category', value: 'category' },
            { label: 'Brand', value: 'brand' },
          ],
        },
        {
          name: 'productCount',
          label: 'Products seen',
          type: 'number',
          admin: { description: 'Current products found while syncing (a sample for Ingram).' },
        },
      ],
    },
  ],
}
