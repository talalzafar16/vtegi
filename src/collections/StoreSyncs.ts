import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'

// Sync History, plus the Sync now button's endpoint: POST /api/store-syncs/start.
export const StoreSyncs: CollectionConfig = {
  slug: 'store-syncs',
  labels: { singular: 'Sync', plural: 'Sync History' },
  defaultSort: '-createdAt',
  admin: {
    group: 'Store',
    useAsTitle: 'summary',
    defaultColumns: ['createdAt', 'status', 'startedBy', 'summary'],
    description:
      'Each refresh of the distributor category and brand names behind the Store Categories dropdowns. Run "Sync now" when a distributor adds or renames brands.',
    components: { beforeList: ['/components/admin/sync-panel#SyncPanel'] },
  },
  access: { read: isAdmin, create: () => false, update: () => false, delete: isAdmin },
  endpoints: [
    {
      path: '/start',
      method: 'post',
      handler: async (req) => {
        if (req.user?.role !== 'admin') {
          return Response.json({ error: 'Only admins can run a sync.' }, { status: 403 })
        }
        // Loaded here, not at the top, so the Payload config stays light for scripts.
        const [{ after }, { runSync, startSync }] = await Promise.all([
          import('next/server'),
          import('@/features/store/sync'),
        ])
        const run = await startSync(req.payload, req.user.id)
        if (!run) return Response.json({ error: 'A sync is already running.' }, { status: 409 })

        // The sync takes a few minutes: answer now, keep working after the response is sent.
        after(() => runSync(req.payload, run.id))
        return Response.json({ run }, { status: 202 })
      },
    },
  ],
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'running',
      options: [
        { label: 'Running', value: 'running' },
        { label: 'Succeeded', value: 'success' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'startedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Empty when run from the command line (pnpm store:sync).' },
    },
    { name: 'finishedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'summary', type: 'text' },
    { name: 'progress', type: 'text' },
    { name: 'error', type: 'textarea' },
  ],
}
