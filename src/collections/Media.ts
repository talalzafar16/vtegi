import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Website', description: 'Images and PDFs used across the website.' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  upload: { mimeTypes: ['image/*', 'application/pdf'] },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for screen readers and search engines.' },
    },
  ],
}
