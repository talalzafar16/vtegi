/**
 * Seeds the CMS with real VTEGI content. Safe to re-run: it only creates what is
 * missing and never overwrites edits made in the admin panel.
 *
 * Run: yarn seed
 */
import config from '@payload-config'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import path from 'path'
import { getPayload } from 'payload'
import { fileURLToPath } from 'url'

import { aboutPage } from './data/about-page'
import { capabilities } from './data/capabilities'
import { homePage } from './data/home-page'
import { pages } from './data/pages'
import { partners } from './data/partners'
import { siteSettings } from './data/site-settings'
import { solutions } from './data/solutions'

const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const payload = await getPayload({ config })
const editorConfig = await editorConfigFactory.default({ config: payload.config })
const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)
// Runs outside Next.js, so there are no cached pages to refresh.
const context = { disableRevalidate: true }

/** Uploads an asset once and reuses it on later runs (matched by filename). */
async function upload(folder: string, file: string, alt: string) {
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: file } },
    limit: 1,
  })
  if (docs[0]) return docs[0].id
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(assetsDir, folder, file),
  })
  return doc.id
}

async function exists(
  collection: 'solutions' | 'capabilities' | 'partners' | 'pages',
  field: string,
  value: string,
) {
  const { totalDocs } = await payload.count({ collection, where: { [field]: { equals: value } } })
  return totalDocs > 0
}

// Site settings: only when empty, so admin edits are never replaced.
const settings = await payload.findGlobal({ slug: 'site-settings' })
if (!settings.companyName) {
  const { certifications, agencies, ...rest } = siteSettings
  await payload.updateGlobal({
    slug: 'site-settings',
    context,
    data: {
      ...rest,
      certifications: await Promise.all(
        certifications.map(async ({ name, logo }) => ({
          name,
          logo: logo ? await upload('certifications', logo, `${name} badge`) : undefined,
        })),
      ),
      agencies: await Promise.all(
        agencies.map(async ({ name, logo }) => ({
          name,
          logo: await upload('agencies', logo, `${name} seal`),
        })),
      ),
    },
  })
  log('site settings')
}

const home = await payload.findGlobal({ slug: 'home-page' })
if (!home.hero?.headline) {
  await payload.updateGlobal({ slug: 'home-page', context, data: homePage })
  log('home page')
}

const about = await payload.findGlobal({ slug: 'about-page' })
if (!about.hero?.headline) {
  await payload.updateGlobal({ slug: 'about-page', context, data: aboutPage })
  log('about page')
}

for (const { content, ...page } of pages) {
  if (await exists('pages', 'slug', page.slug)) continue
  await payload.create({
    collection: 'pages',
    context,
    data: {
      ...page,
      _status: 'published',
      content: convertMarkdownToLexical({ editorConfig, markdown: content }),
    },
  })
  log(`page: ${page.title}`)
}

for (const solution of solutions) {
  if (await exists('solutions', 'slug', solution.slug)) continue
  await payload.create({ collection: 'solutions', data: solution, context })
  log(`solution: ${solution.title}`)
}

for (const { description, ...capability } of capabilities) {
  if (await exists('capabilities', 'slug', capability.slug)) continue
  await payload.create({
    collection: 'capabilities',
    context,
    data: {
      ...capability,
      description: convertMarkdownToLexical({ editorConfig, markdown: description }),
    },
  })
  log(`capability: ${capability.title}`)
}

for (const { logo, ...partner } of partners) {
  if (await exists('partners', 'name', partner.name)) continue
  await payload.create({
    collection: 'partners',
    context,
    data: { ...partner, logo: await upload('partners', logo, `${partner.name} logo`) },
  })
  log(`partner: ${partner.name}`)
}

log('done')
process.exit(0)
