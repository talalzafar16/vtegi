import type { GlobalConfig } from 'payload'

import { anyone, isAdmin, isAdminField } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

/** Company facts used across the site (header, footer, contact, contracting page). */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Admin',
    description:
      'Company details used across the website: contact, offices, credentials, agencies.',
  },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            { name: 'companyName', type: 'text', required: true },
            { name: 'tagline', type: 'text' },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', required: true },
                { name: 'email', type: 'email', required: true },
              ],
            },
            {
              name: 'leadEmail',
              label: 'Website request recipient',
              type: 'email',
              // Internal inbox: kept out of the public API. The request form reads it server-side.
              access: { read: isAdminField },
              admin: {
                description: 'Where new website requests are sent. Defaults to the email above.',
              },
            },
            { name: 'linkedinUrl', type: 'text' },
            {
              name: 'offices',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g. Headquarters' },
                },
                { name: 'address', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Credentials',
          description: 'Shown on the Contracting page and in the footer.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'cage', label: 'CAGE code', type: 'text' },
                { name: 'uei', label: 'UEI', type: 'text' },
              ],
            },
            {
              name: 'naics',
              label: 'NAICS codes',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'code', type: 'text', required: true },
                    { name: 'title', type: 'text', required: true },
                    { name: 'primary', type: 'checkbox' },
                  ],
                },
              ],
            },
            {
              name: 'socioeconomic',
              label: 'Socioeconomic status',
              type: 'array',
              fields: [{ name: 'label', type: 'text', required: true }],
            },
            {
              name: 'certifications',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'logo', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'contractVehicles',
              type: 'array',
              admin: { description: 'e.g. GSA MAS, NASA SEWP. Hidden on the site while empty.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'contractNumber', type: 'text' },
                  ],
                },
              ],
            },
            {
              name: 'capabilityStatement',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'PDF offered as a download on the Contracting page.' },
            },
          ],
        },
        {
          label: 'Agencies',
          description: 'Organizations VTEGI has served.',
          fields: [
            {
              name: 'showAgencies',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Only enable once logo/seal usage is approved.' },
            },
            {
              name: 'agencies',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'logo', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
