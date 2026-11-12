import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

/** Home page copy. Section order is fixed in code: the page is a guided flow. */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  admin: { group: 'Website', description: 'Text for each section of the home page.' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        {
          name: 'headline',
          type: 'textarea',
          required: true,
          admin: { description: 'One line per row. The last line is highlighted in red.' },
        },
        { name: 'intro', type: 'textarea', required: true },
      ],
    },
    {
      name: 'solutions',
      label: 'Step 1: Solutions',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'intro', type: 'textarea', required: true },
      ],
    },
    {
      name: 'process',
      label: 'Steps 2–3: Request',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'intro', type: 'textarea', required: true },
        {
          name: 'steps',
          type: 'array',
          required: true,
          minRows: 3,
          maxRows: 3,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'expert',
      label: 'Talk to an expert',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
    {
      name: 'capabilities',
      type: 'group',
      fields: [{ name: 'heading', type: 'text', required: true }],
    },
    {
      name: 'why',
      label: 'Why VTEGI',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
        {
          name: 'stats',
          type: 'array',
          maxRows: 4,
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'value', type: 'number', required: true },
                { name: 'suffix', type: 'text', admin: { description: 'e.g. +' } },
                { name: 'label', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'partners',
      label: 'Vendor logos',
      type: 'group',
      fields: [{ name: 'heading', type: 'text', required: true }],
    },
  ],
}
