import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'

// Shown in the store when a product has no photo. Brands found in Icecat get their logo automatically;
// a logo uploaded here always wins.
export const BrandLogos: CollectionConfig = {
  slug: 'brand-logos',
  defaultSort: 'brand',
  admin: {
    group: 'Store',
    useAsTitle: 'brand',
    defaultColumns: ['brand', 'logo', 'updatedAt'],
    description:
      'Logos for store products without a photo. Spelling and capitals don\'t matter: "HP" also covers "HP INC".',
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'brand', type: 'text', required: true, unique: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
  ],
}
