import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

/**
 * Pricing rules for the online store, set by VTEGI in the admin. Admin-only because the markup
 * is private: the website and quotes read it on the server (features/store/settings.ts).
 */
export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  admin: {
    group: 'Store',
    description:
      'Pricing rules for the online store. Changes apply to prices and quotes right away.',
  },
  access: { read: isAdmin, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'showPrices',
      label: 'Show prices on the website',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'When off, products show only "Request a Quote". Quotes still include prices.',
      },
    },
    {
      name: 'markupPercent',
      label: 'Markup (%)',
      type: 'number',
      required: true,
      min: 0,
      max: 500,
      admin: {
        description:
          'Added to the distributor cost of every product. Example: 20 means cost + 20%. Prices stay hidden until this is set.',
      },
    },
    {
      name: 'quantityDiscounts',
      type: 'array',
      labels: { singular: 'Discount level', plural: 'Discount levels' },
      admin: {
        description:
          'Taken off the price after markup, based on the quantity requested. The highest level reached applies.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'minQuantity',
              label: 'From quantity',
              type: 'number',
              required: true,
              min: 1,
              admin: { width: '50%' },
            },
            {
              name: 'discountPercent',
              label: 'Discount (%)',
              type: 'number',
              required: true,
              min: 0,
              max: 100,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'customPricingFrom',
      label: 'Custom pricing from quantity',
      type: 'number',
      min: 2,
      admin: {
        description:
          'From this quantity, no automatic price is shown or quoted: the request comes to you to price manually. Leave empty to always price automatically.',
      },
    },
    {
      name: 'notificationEmail',
      label: 'Quote notifications',
      type: 'email',
      admin: {
        description:
          'Receives "needs manual quote" alerts and a copy of every quote. Defaults to the website request recipient in Site Settings.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'salesperson',
          type: 'text',
          admin: { width: '50%', description: 'Printed on every quote.' },
        },
        {
          name: 'firstQuoteNumber',
          label: 'First quote number this year',
          type: 'number',
          defaultValue: 1,
          min: 1,
          admin: {
            width: '50%',
            description:
              'Website quotes are numbered QUO-26001, QUO-26002… from this number. If your last manual quote was QUO-26014, enter 15. Set it back to 1 each January.',
          },
        },
      ],
    },
    {
      name: 'hiddenBrands',
      label: 'Hidden brands',
      type: 'relationship',
      relationTo: 'distributor-lists',
      hasMany: true,
      filterOptions: { kind: { equals: 'brand' } },
      admin: { description: 'Products from these brands never appear in the store.' },
    },
  ],
}
