import { notFound } from 'next/navigation'

import { PageHero } from '@/components/ui/page-hero'
import { RichText } from '@/components/ui/rich-text'
import { Section } from '@/components/ui/section'
import { getBySlug, getSlugs } from '@/lib/cms'
import { formatDate } from '@/lib/format'
import { docMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => getSlugs('pages')

export async function generateMetadata({ params }: Props) {
  const page = await getBySlug('pages', (await params).slug)
  return page ? docMetadata(page, page.intro) : {}
}

export default async function CmsPage({ params }: Props) {
  const page = await getBySlug('pages', (await params).slug)
  if (!page) notFound()

  return (
    <>
      <PageHero eyebrow="VTEGI" title={page.title} intro={page.intro} />
      <Section>
        <article className="mx-auto max-w-3xl">
          <RichText data={page.content} />
          <p className="mt-16 border-t border-ink-200 pt-6 text-sm text-ink-500 on-dark:border-white/10">
            Last updated {formatDate(page.updatedAt)}
          </p>
        </article>
      </Section>
    </>
  )
}
