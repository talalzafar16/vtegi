import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig, type CollectionConfig, type GlobalConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Capabilities } from './collections/Capabilities'
import { DistributorLists } from './collections/DistributorLists'
import { Events } from './collections/Events'
import { Jobs } from './collections/Jobs'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { QuoteRequests } from './collections/QuoteRequests'
import { Solutions } from './collections/Solutions'
import { StoreCategories } from './collections/StoreCategories'
import { StoreSyncs } from './collections/StoreSyncs'
import { Users } from './collections/Users'
import { AboutPage } from './globals/AboutPage'
import { HomePage } from './globals/HomePage'
import { SiteSettings } from './globals/SiteSettings'
import { StoreSettings } from './globals/StoreSettings'
import { s3Bucket, s3ClientConfig } from './lib/s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** Hides Payload's developer "API" tab (raw JSON view) on every edit screen. */
const hideApiTab = <T extends CollectionConfig | GlobalConfig>(config: T): T => ({
  ...config,
  admin: { ...config.admin, hideAPIURL: true },
})

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | VTEGI Admin',
      icons: [{ rel: 'icon', type: 'image/png', url: '/brand/vtegi-mark.png' }],
    },
    // VTEGI branding (paths are relative to src/; styles live in app/(payload)/custom.scss).
    components: {
      graphics: {
        Logo: '/components/admin/brand#Logo',
        Icon: '/components/admin/brand#Icon',
      },
      providers: ['/components/admin/admin-fonts#AdminFonts'],
      beforeDashboard: ['/components/admin/dashboard-welcome#DashboardWelcome'],
      beforeNavLinks: ['/components/admin/site-links#NavSiteLink'],
      logout: { Button: '/components/admin/logout-button#LogoutButton' },
      afterLogin: ['/components/admin/site-links#LoginSiteLink'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Solutions,
    Capabilities,
    Partners,
    Pages,
    News,
    Events,
    Jobs,
    Leads,
    StoreCategories,
    QuoteRequests,
    DistributorLists,
    StoreSyncs,
    Media,
    Users,
  ].map(hideApiTab),
  globals: [HomePage, AboutPage, SiteSettings, StoreSettings].map(hideApiTab),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  // Sent through SMTP_HOST (without it, emails print to the console). Port 465 = SSL, 587 = TLS.
  // EMAIL_FROM must be the SMTP mailbox; `pool` reuses the logged-in connection (logins are slow).
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM || process.env.SMTP_USER || '',
        defaultFromName: 'VTEGI Website',
        transportOptions: {
          pool: true,
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
        },
      })
    : undefined,
  plugins: [
    // Uploads go to S3-compatible storage (Supabase Storage) when configured; otherwise to /media.
    // Files are still served through Payload at /api/media/file/..., so the bucket can stay private.
    s3Storage({
      enabled: Boolean(s3Bucket),
      collections: { media: true },
      bucket: s3Bucket,
      config: s3ClientConfig,
    }),
    seoPlugin({
      collections: ['solutions', 'capabilities', 'pages', 'news', 'events', 'jobs'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => `${doc.title} | VTEGI`,
      generateDescription: ({ doc }) =>
        doc.shortDescription ?? doc.summary ?? doc.excerpt ?? doc.intro ?? '',
    }),
  ],
})
