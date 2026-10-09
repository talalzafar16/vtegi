import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ButtonLink } from '@/components/ui/button'
import { PageHero } from '@/components/ui/page-hero'
import { RichText } from '@/components/ui/rich-text'
import { Section } from '@/components/ui/section'
import { eventFormats } from '@/collections/Events'
import { getBySlug, getSlugs } from '@/lib/cms'
import { formatDateTime } from '@/lib/format'
import { asMedia } from '@/lib/media'
import { docMetadata } from '@/lib/seo'
import { labelOf } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => getSlugs('events')

export async function generateMetadata({ params }: Props) {
  const event = await getBySlug('events', (await params).slug)
  return event ? docMetadata(event, event.summary) : {}
}

export default async function EventPage({ params }: Props) {
  const event = await getBySlug('events', (await params).slug)
  if (!event) notFound()
  const cover = asMedia(event.coverImage)
  const isUpcoming = (event.endDate ?? event.startDate) >= new Date().toISOString()

  return (
    <>
      <PageHero
        eyebrow={
          <Link href="/company/events" className="hover:underline">
            Events
          </Link>
        }
        title={event.title}
        intro={event.summary}
      >
        <ul className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-300">
          <li className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden className="size-4" />
            <time dateTime={event.startDate}>{formatDateTime(event.startDate)}</time>
          </li>
          <li className="inline-flex items-center gap-2">
            <MapPin aria-hidden className="size-4" />
            {labelOf(eventFormats, event.format)}
            {event.location && ` · ${event.location}`}
          </li>
        </ul>
        {isUpcoming && event.registrationUrl && (
          <ButtonLink
            href={event.registrationUrl}
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Register <ArrowUpRight aria-hidden className="size-4" />
          </ButtonLink>
        )}
      </PageHero>
      <Section>
        <article className="mx-auto max-w-3xl">
          {cover?.url && (
            <Image
              src={cover.url}
              alt={cover.alt}
              width={cover.width ?? 1200}
              height={cover.height ?? 750}
              className="mb-12 w-full rounded-xl"
            />
          )}
          <RichText data={event.content} />
        </article>
      </Section>
    </>
  )
}
