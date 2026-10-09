import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { Heading } from '@/components/ui/typography'
import { partnerCategories } from '@/collections/Partners'
import { getPartners } from '@/lib/cms'
import { asMedia } from '@/lib/media'

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'VTEGI works with leading distributors and hardware, software, security and cloud vendors.',
}

const categoryTitles: Record<(typeof partnerCategories)[number]['value'], string> = {
  distributor: 'Distributors',
  hardware: 'Hardware vendors',
  software: 'Software vendors',
  security: 'Security vendors',
  cloud: 'Cloud vendors',
}

export default async function PartnersPage() {
  const partners = await getPartners()
  const groups = partnerCategories
    .map(({ value }) => ({
      value,
      title: categoryTitles[value],
      partners: partners.filter((p) => p.category === value),
    }))
    .filter((group) => group.partners.length > 0)

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Technology from vendors you already trust."
        intro="We keep adding hardware, software, security and cloud vendors so we can deliver the right solution for every client."
      >
        <nav aria-label="Partner categories" className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <a
              key={group.value}
              href={`#${group.value}`}
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white"
            >
              {group.title} <span className="text-zinc-500">{group.partners.length}</span>
            </a>
          ))}
        </nav>
      </PageHero>

      {groups.map((group, i) => (
        <Section key={group.value} id={group.value} tone={i % 2 ? 'muted' : 'light'}>
          <Heading size="lg">{group.title}</Heading>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {group.partners.map((partner) => {
              const logo = asMedia(partner.logo)
              return (
                <li key={partner.id}>
                  <a
                    href={partner.website ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-32 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-900 hover:shadow-lg"
                  >
                    {logo?.url && (
                      <Image
                        src={logo.url}
                        alt=""
                        width={logo.width ?? 240}
                        height={logo.height ?? 120}
                        className="h-12 w-full object-contain"
                      />
                    )}
                    <span className="text-xs font-medium text-zinc-600">{partner.name}</span>
                    <ArrowUpRight
                      aria-hidden
                      className="absolute top-3 right-3 size-4 text-zinc-300 transition group-hover:text-zinc-900"
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </Section>
      ))}
    </>
  )
}
