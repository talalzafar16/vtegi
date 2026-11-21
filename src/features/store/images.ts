import config from '@payload-config'
import { getPayload } from 'payload'

import { cached, recall, remember } from './cache'
import type { ProductSummary } from './vendors'

// Product photos (Icecat) and brand logos for the store. Free Open Icecat by default; Full Icecat
// (all brands) once ICECAT_APP_KEY is set. Files are downloaded and served by store/images.

const DAY = 24 * 3600
const MAX_PHOTOS = 5

/** "HP INC" → "HP", "Dell - Sourcing" → "Dell". */
export function cleanBrand(name: string) {
  return name
    .replace(/\s+-\s+sourcing$/i, '')
    .replace(/\b(inc|corp|corporation|systems|llc|ltd|bto smart ?choice)\b\.?/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Key for comparing brand names: "HP INC" and "hp" both give "hp". */
export const brandKey = (name: string) =>
  cleanBrand(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

type IcecatData = {
  GeneralInfo?: { BrandLogo?: string }
  Image?: { Pic500x500?: string }
  Gallery?: { Pic500x500?: string }[]
}

/** One Icecat lookup: null when Icecat has no (free) content. Outages throw, so they aren't cached. */
async function icecat(params: Record<string, string>): Promise<IcecatData | null> {
  const query = new URLSearchParams({
    lang: 'EN',
    shopname: process.env.ICECAT_USERNAME || 'openicecat-live',
    ...params,
  })
  if (process.env.ICECAT_APP_KEY) query.set('app_key', process.env.ICECAT_APP_KEY)
  const response = await fetch(`https://live.icecat.biz/api?${query}`, {
    signal: AbortSignal.timeout(10_000),
  })
  // 404: not in Icecat, 403: paid content only, 400: unknown barcode.
  if (response.status >= 400 && response.status < 500) return null
  if (!response.ok) throw new Error(`Icecat responded ${response.status}`)
  return ((await response.json()) as { data?: IcecatData }).data ?? null
}

const brandLogoKey = (key: string) => `store:icecat:brand:${key}`

type PhotoQuery = Pick<ProductSummary, 'vendor' | 'id' | 'brand' | 'partNumber' | 'upc'>

/** Up to 5 Icecat photo URLs for a hardware product, remembered for 30 days (7 when none). The key
 * includes the plan, so upgrading to Full Icecat looks everything up again. */
export function productPhotos(product: PhotoQuery): Promise<string[]> {
  if (product.vendor !== 'ingram') return Promise.resolve([])
  const plan = process.env.ICECAT_APP_KEY ? 'full' : 'open'
  return cached<string[]>(
    `store:icecat:${plan}:${product.id}`,
    (photos) => (photos.length > 0 ? 30 : 7) * DAY,
    async () => {
      const brand = cleanBrand(product.brand)
      const data =
        (brand && product.partNumber
          ? await icecat({ Brand: brand, ProductCode: product.partNumber })
          : null) ?? (product.upc ? await icecat({ GTIN: product.upc }) : null)
      if (!data) return []
      const logo = data.GeneralInfo?.BrandLogo
      if (logo) await remember(brandLogoKey(brandKey(product.brand)), logo, 30 * DAY)
      const urls = [data.Image?.Pic500x500, ...(data.Gallery ?? []).map((g) => g.Pic500x500)]
      return [...new Set(urls.filter((url): url is string => Boolean(url)))].slice(0, MAX_PHOTOS)
    },
  )
}

let uploaded: { at: number; logos: Map<string, string> } | null = null

/** Logos uploaded in Brand Logos (file name in /media by brand key), re-read every minute. */
async function uploadedLogos() {
  if (uploaded && Date.now() - uploaded.at < 60_000) return uploaded.logos
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'brand-logos', limit: 1000, depth: 1 })
  const logos = new Map<string, string>()
  for (const doc of docs) {
    if (typeof doc.logo === 'object' && doc.logo.filename) {
      logos.set(brandKey(doc.brand), doc.logo.filename)
    }
  }
  uploaded = { at: Date.now(), logos }
  return logos
}

export type BrandLogo = { key: string } & ({ file: string } | { url: string })

/** An uploaded logo wins, then one Icecat showed with any product of the brand. Also tries the
 * first word ("Microsoft Surface" → "Microsoft"). */
export async function brandLogo(brand: string): Promise<BrandLogo | null> {
  const first = brandKey(cleanBrand(brand).split(' ')[0] ?? '')
  const keys = [...new Set([brandKey(brand), ...(first.length >= 4 ? [first] : [])])].filter(
    Boolean,
  )
  const logos = await uploadedLogos()
  for (const key of keys) {
    const file = logos.get(key)
    if (file) return { key, file }
  }
  for (const key of keys) {
    const url = await recall<string>(brandLogoKey(key))
    if (url) return { key, url }
  }
  return null
}
