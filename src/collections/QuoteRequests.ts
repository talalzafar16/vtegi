import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'
import { organizationTypes } from '@/features/request-form/options'
import { billingTerms, manualReasons, quoteStatuses, vendors } from '@/features/store/options'

const money = { type: 'number', admin: { step: 0.01 } } as const

/**
 * Every "Request a Quote" from the online store, with the exact price that was quoted:
 * distributor prices change and their APIs keep no history. Admin-only, like Leads; the store
 * creates these on the server.
 */
export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  defaultSort: '-createdAt',
  admin: {
    group: 'Store',
    useAsTitle: 'quoteNumber',
    defaultColumns: ['quoteNumber', 'name', 'organization', 'status', 'createdAt'],
    listSearchableFields: ['quoteNumber', 'name', 'email', 'organization'],
    description: 'Quote requests from the online store and the price each customer was sent.',
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: {
    beforeChange: [
      // QUO-<yy><number>, e.g. QUO-26014: numbered within the year, starting from the number set in
      // Store Settings so website quotes continue after VTEGI's manual ones.
      async ({ data, operation, req }) => {
        if (operation !== 'create' || data.quoteNumber) return data
        const year = new Date().getFullYear()
        const [settings, { totalDocs }] = await Promise.all([
          req.payload.findGlobal({ slug: 'store-settings', req }),
          req.payload.count({
            collection: 'quote-requests',
            where: { createdAt: { greater_than_equal: new Date(year, 0, 1).toISOString() } },
            req,
          }),
        ])
        const number = (settings.firstQuoteNumber ?? 1) + totalDocs
        return {
          ...data,
          quoteNumber: `QUO-${String(year).slice(2)}${String(number).padStart(3, '0')}`,
        }
      },
    ],
  },
  fields: [
    {
      name: 'product',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true },
            {
              name: 'vendor',
              label: 'Distributor',
              type: 'select',
              required: true,
              options: [...vendors],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'vendorProductId',
              label: 'Distributor product ID',
              type: 'text',
              required: true,
            },
            { name: 'partNumber', type: 'text' },
            { name: 'brand', type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'quantity', type: 'number', required: true, min: 1 },
        {
          name: 'billingTerm',
          type: 'select',
          options: [...billingTerms],
          admin: { condition: (data) => data?.product?.vendor === 'pax8' },
        },
        {
          name: 'termMonths',
          label: 'No. months',
          type: 'number',
          admin: { condition: (data) => data?.product?.vendor === 'pax8' },
        },
      ],
    },
    {
      name: 'termLabel',
      label: 'Subscription term',
      type: 'text',
      admin: { condition: (data) => data?.product?.vendor === 'pax8' },
    },
    {
      name: 'price',
      label: 'Price quoted',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Empty when no price was available. The request then needs a manual quote.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { ...money, name: 'cost', label: 'Distributor cost (per unit)' },
            { name: 'markupPercent', label: 'Markup (%)', type: 'number' },
            { ...money, name: 'listPrice', label: 'Price after markup (per unit)' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'discountPercent', label: 'Quantity discount (%)', type: 'number' },
            { ...money, name: 'unitPrice', label: 'Final price (per unit)' },
            { ...money, name: 'total', label: 'Total (all units, whole term)' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'organization', type: 'text', required: true },
        { name: 'organizationType', type: 'select', options: [...organizationTypes] },
        { name: 'zip', label: 'Delivery ZIP code', type: 'text' },
      ],
    },
    { name: 'address', label: 'Company address', type: 'textarea' },
    { name: 'notes', label: 'Customer notes', type: 'textarea' },
    {
      name: 'quoteNumber',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'manual',
      options: [...quoteStatuses],
      admin: { position: 'sidebar' },
    },
    {
      name: 'manualReason',
      label: 'Why it needs a manual quote',
      type: 'select',
      options: [...manualReasons],
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => data?.status === 'manual' || Boolean(data?.manualReason),
      },
    },
    {
      name: 'customerEmailedAt',
      label: 'Customer emailed',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        description: 'When the customer was sent their quote, or the "preparing your quote" note.',
      },
    },
    {
      name: 'emailError',
      label: 'Email problem',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => Boolean(data?.emailError),
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Internal only.' },
    },
    { name: 'sourceUrl', type: 'text', admin: { position: 'sidebar', readOnly: true } },
  ],
}
