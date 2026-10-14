import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'
import { inquiryTypes, organizationTypes, timelines } from '@/features/request-form/options'

/**
 * Website request-form submissions. Admin-only: the public form creates leads
 * through a server action (Local API), never through the open REST API.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  defaultSort: '-createdAt',
  admin: {
    group: 'Sales',
    description: 'Requests sent through the website form. Visible to admins only.',
    useAsTitle: 'name',
    defaultColumns: ['name', 'organization', 'inquiryType', 'status', 'createdAt'],
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'inquiryType', type: 'select', required: true, options: [...inquiryTypes] },
        { name: 'solution', type: 'relationship', relationTo: 'solutions' },
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
        { name: 'organization', type: 'text' },
        { name: 'organizationType', type: 'select', options: [...organizationTypes] },
        { name: 'timeline', type: 'select', options: [...timelines] },
      ],
    },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'details',
      type: 'json',
      admin: { description: 'Extra answers for specific inquiry types (e.g. custom build specs).' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Internal only.' },
    },
    { name: 'sourceUrl', type: 'text', admin: { position: 'sidebar', readOnly: true } },
  ],
}
