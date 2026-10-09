import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ButtonLink } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { Heading } from '@/components/ui/typography'
import { eventFormats } from '@/collections/Events'
import { listDocs } from '@/lib/cms'
import { formatDateTime } from '@/lib/format'
import type { Event } from '@/payload-types'
import { labelOf } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Briefings, industry events and conversations with VTEGI.',
}

export default async function EventsPage() {
  const events = await listDocs('events', 'startDate')
  const now = new Date().toISOString()
  const upcoming = events.filter((e) => (e.endDate ?? e.startDate) >= now)
  const past = events.filter((e) => (e.endDate ?? e.startDate) < now).reverse()

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Ideas worth sharing. Conversations that matter."
        intro="Briefings, industry events and opportunities to meet the VTEGI team."
      />
      <Section>
        <Heading size="lg">Upcoming events</Heading>
        <div className="mt-8">
          {upcoming.length ? (
            <EventList events={upcoming} />
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming events"
              text="New events will be announced here. Have a question about an event or want to invite us to speak?"
              action={<ButtonLink href="/request?inquiry=event">Event inquiry</ButtonLink>}
            />
          )}
        </div>
        {past.length > 0 && (
          <>
            <Heading size="lg" className="mt-20">
              Past events
            </Heading>
            <div className="mt-8">
              <EventList events={past} />
            </div>
          </>
        )}
      </Section>
    </>
  )
}

function EventList({ events }: { events: Event[] }) {
  return (
    <ul className="divide-y divide-ink-200 border-y border-ink-200 on-dark:divide-white/10 on-dark:border-white/10">
      {events.map((event) => (
        <li key={event.id}>
          <Link
            href={`/company/events/${event.slug}`}
            className="group grid gap-3 py-6 md:grid-cols-[14rem_1fr_auto] md:items-center"
          >
            <time
              dateTime={event.startDate}
              className="font-mono text-sm text-brand-700 on-dark:text-brand-400"
            >
              {formatDateTime(event.startDate)}
            </time>
            <span>
              <span className="text-lg font-semibold group-hover:text-brand-700 on-dark:group-hover:text-brand-400">
                {event.title}
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-sm text-ink-600 on-dark:text-ink-400">
                <MapPin aria-hidden className="size-4" />
                {labelOf(eventFormats, event.format)}
                {event.location && ` · ${event.location}`}
              </span>
            </span>
            <ArrowRight
              aria-hidden
              className="size-5 text-ink-400 transition group-hover:translate-x-1 group-hover:text-ink-900 on-dark:group-hover:text-white"
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
