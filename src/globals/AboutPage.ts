import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

const labelList = (name: string, description: string) => ({
  name,
  type: 'array' as const,
  admin: { description },
  fields: [{ name: 'label', type: 'text' as const, required: true }],
})

/** Editable copy for /company/about. */
export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  admin: { group: 'Website' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', required: true },
        { name: 'intro', type: 'textarea', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'mission', type: 'textarea', required: true },
        { name: 'vision', type: 'textarea', required: true },
      ],
    },
    {
      name: 'values',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
    labelList('highlights', 'Short company facts, e.g. "Top Secret cleared personnel".'),
    labelList('teamCertifications', 'Technical certifications held by the team.'),
  ],
}
