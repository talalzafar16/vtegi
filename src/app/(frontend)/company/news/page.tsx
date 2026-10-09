import { Newspaper } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Reveal } from '@/components/motion/reveal'
import { ButtonLink } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { listDocs } from '@/lib/cms'
import { formatDate } from '@/lib/format'
import { asMedia } from '@/lib/media'

export const metadata: Metadata = {
  title: 'News & Press',
  description: 'Company news, announcements and press releases from VTEGI.',
}

export default async function NewsPage() {
  const posts = await listDocs('news', '-publishedAt')

  return (
    <>
      <PageHero
        eyebrow="News & Press"
        title="The latest from VTEGI."
        intro="Company news, partnerships, certifications and announcements."
      />
      <Section>
        {posts.length ? (
          <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => {
              const cover = asMedia(post.coverImage)
              return (
                <li key={post.id}>
                  <Reveal delay={i * 0.05}>
                    <Link href={`/company/news/${post.slug}`} className="group block">
                      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-ink-100 on-dark:bg-white/5">
                        {cover?.url && (
                          <Image
                            src={cover.url}
                            alt={cover.alt}
                            width={cover.width ?? 800}
                            height={cover.height ?? 500}
                            className="size-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <time
                        dateTime={post.publishedAt}
                        className="mt-5 block font-mono text-xs tracking-wider text-ink-500 uppercase"
                      >
                        {formatDate(post.publishedAt)}
                      </time>
                      <h2 className="mt-2 text-xl font-semibold group-hover:text-brand-700 on-dark:group-hover:text-brand-400">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-ink-600 on-dark:text-ink-400">
                        {post.excerpt}
                      </p>
                    </Link>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState
            icon={Newspaper}
            title="No announcements yet"
            text="Company news and press releases will appear here. For media inquiries, get in touch."
            action={<ButtonLink href="/request?inquiry=media">Media inquiry</ButtonLink>}
          />
        )}
      </Section>
    </>
  )
}
