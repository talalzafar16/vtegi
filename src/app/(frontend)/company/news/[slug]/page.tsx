import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageHero } from '@/components/ui/page-hero'
import { RichText } from '@/components/ui/rich-text'
import { Section } from '@/components/ui/section'
import { getBySlug, getSlugs } from '@/lib/cms'
import { formatDate } from '@/lib/format'
import { asMedia } from '@/lib/media'
import { docMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => getSlugs('news')

export async function generateMetadata({ params }: Props) {
  const post = await getBySlug('news', (await params).slug)
  return post ? docMetadata(post, post.excerpt) : {}
}

export default async function NewsPostPage({ params }: Props) {
  const post = await getBySlug('news', (await params).slug)
  if (!post) notFound()
  const cover = asMedia(post.coverImage)

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Link href="/company/news" className="hover:underline">
              News
            </Link>
            &nbsp;/&nbsp;<time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </>
        }
        title={post.title}
        intro={post.excerpt}
      />
      <Section>
        <article className="mx-auto max-w-3xl">
          {cover?.url && (
            <Image
              src={cover.url}
              alt={cover.alt}
              width={cover.width ?? 1200}
              height={cover.height ?? 750}
              className="mb-12 w-full rounded-xl"
              priority
            />
          )}
          <RichText data={post.content} />
        </article>
      </Section>
    </>
  )
}
