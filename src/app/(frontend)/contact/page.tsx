import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Card } from '@/components/ui/card'
import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { Heading } from '@/components/ui/typography'
import { RequestSection } from '@/features/request-form/request-section'
import { getHomePage, getSiteSettings, getSolutions } from '@/lib/cms'
import { telHref } from '@/lib/navigation'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Call, email or visit VTEGI in Stafford, VA, or send us a request online.',
}

const mapsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\n/g, ', '))}`

export default async function ContactPage() {
  const [settings, home, solutions] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getSolutions(),
  ])

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s start a conversation."
        intro="Call, email or send a request below. A VTEGI specialist will follow up within one business day."
      />

      <Section className="py-16 md:py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <ContactCard icon={<Phone aria-hidden className="size-5" />} title="Call us">
            <a
              href={telHref(settings.phone)}
              className="text-lg font-semibold hover:text-brand-700"
            >
              {settings.phone}
            </a>
          </ContactCard>
          <ContactCard icon={<Mail aria-hidden className="size-5" />} title="Email us">
            <a
              href={`mailto:${settings.email}`}
              className="text-lg font-semibold hover:text-brand-700"
            >
              {settings.email}
            </a>
          </ContactCard>
          {settings.offices?.map((office) => (
            <ContactCard
              key={office.id}
              icon={<MapPin aria-hidden className="size-5" />}
              title={office.label}
            >
              <address className="whitespace-pre-line text-zinc-700 not-italic">
                {office.address}
              </address>
              <a
                href={mapsHref(office.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                Map & directions <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </ContactCard>
          ))}
        </div>
      </Section>

      <RequestSection
        {...home.process}
        heading="Send us a message."
        solutions={solutions}
        defaultInquiry="general"
      />
    </>
  )
}

function ContactCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <Card className="h-full">
      <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
        {icon}
      </span>
      <Heading as="h2" size="md" className="mt-5">
        {title}
      </Heading>
      <div className="mt-2">{children}</div>
    </Card>
  )
}
