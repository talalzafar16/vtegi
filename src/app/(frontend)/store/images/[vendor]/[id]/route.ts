import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { brandLogo, productPhotos } from '@/features/store/images'

// /store/images/<vendor>/<id>?b=brand&m=part&u=upc&n=index: the product's Icecat photo, else its
// brand logo, else 404 (the page then shows the category icon). Downloads are saved in /media/store
// and served from there afterwards.

const MEDIA_DIR = path.resolve('media')
const STORE_DIR = path.join(MEDIA_DIR, 'store')

const contentTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

/** Query hints come from our own pages; anything unusual is ignored. */
const hint = (value: string | null) =>
  value && value.length <= 80 && /^[\w .&+\-/#()]+$/.test(value) ? value : ''

async function serve(file: string, maxAge: number) {
  try {
    return new Response(await readFile(file), {
      headers: {
        'Content-Type':
          contentTypes[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
        'Cache-Control': `public, max-age=${maxAge}`,
      },
    })
  } catch {
    return null
  }
}

async function download(url: string, file: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
    throw new Error(`Image download failed (${response.status}): ${url}`)
  }
  await mkdir(path.dirname(file), { recursive: true })
  const temporary = `${file}.${process.pid}.tmp`
  await writeFile(temporary, Buffer.from(await response.arrayBuffer()))
  await rename(temporary, file)
}

const notFound = () =>
  new Response(null, { status: 404, headers: { 'Cache-Control': 'public, max-age=3600' } })

export async function GET(
  request: Request,
  { params }: { params: Promise<{ vendor: string; id: string }> },
) {
  const { vendor, id } = await params
  if ((vendor !== 'ingram' && vendor !== 'pax8') || !/^[A-Za-z0-9-]{1,64}$/.test(id)) {
    return notFound()
  }
  const query = new URL(request.url).searchParams
  const index = Math.min(Math.max(Number(query.get('n')) || 0, 0), 4)
  const brand = hint(query.get('b'))
  const photo = path.join(STORE_DIR, vendor, `${id}-${index}.jpg`)
  const saved = await serve(photo, 7 * 86400)
  if (saved) return saved

  try {
    const photos = await productPhotos({
      vendor,
      id,
      brand,
      partNumber: hint(query.get('m')),
      upc: hint(query.get('u')),
    })
    if (photos[index]) {
      await download(photos[index], photo)
      return (await serve(photo, 7 * 86400)) ?? notFound()
    }
    if (index > 0 || !brand) return notFound()

    const logo = await brandLogo(brand)
    if (!logo) return notFound()
    if ('file' in logo) {
      return (await serve(path.join(MEDIA_DIR, path.basename(logo.file)), 86400)) ?? notFound()
    }
    const extension = path.extname(new URL(logo.url).pathname) || '.jpg'
    const file = path.join(STORE_DIR, 'brands', `${logo.key}${extension}`)
    const existing = await serve(file, 86400)
    if (existing) return existing
    await download(logo.url, file)
    return (await serve(file, 86400)) ?? notFound()
  } catch (error) {
    console.error('[store] Image failed:', vendor, id, error)
    return notFound()
  }
}
