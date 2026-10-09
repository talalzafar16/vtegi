import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { PageHero } from '@/components/ui/page-hero'
import { RichText } from '@/components/ui/rich-text'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { getBySlug, getCapabilities, getSlugs } from '@/lib/cms'
import { requestHref } from '@/lib/navigation'
import { docMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => getSlugs('capabilities')

export async function generateMetadata({ params }: Props) {
  const capability = await getBySlug('capabilities', (await params).slug)
  return capability ? docMetadata(capability, capability.summary) : {}
}

export default async function CapabilityPage({ params }: Props) {
  const { slug } = await params
  const [capability, capabilities] = await Promise.all([
    getBySlug('capabilities', slug),
    getCapabilities(),
  ])
  if (!capability) notFound()

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Link href="/capabilities" className="hover:underline">
              Capabilities
            </Link>
            &nbsp;/&nbsp;{capability.title}
          </>
        }
        title={capability.title}
        intro={capability.summary}
      >
        <ButtonLink href={requestHref()} size="lg">
          Discuss this capability <ArrowRight aria-hidden className="size-4" />
        </ButtonLink>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <RichText data={capability.description} className="max-w-2xl" />
          <aside className="space-y-6">
            {capability.offerings && capability.offerings.length > 0 && (
              <Card>
                <Heading as="h2" size="md">
                  What we offer
                </Heading>
                <ul className="mt-5 space-y-3">
                  {capability.offerings.map((offering) => (
                    <li key={offering.id} className="flex gap-3 text-zinc-700">
                      <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-700" />
                      {offering.label}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            {capability.startingContext && (
              <Card className="bg-zinc-50">
                <Heading as="h2" size="md">
                  Useful to share when you reach out
                </Heading>
                <p className="mt-3 text-zinc-600">{capability.startingContext}</p>
              </Card>
            )}
          </aside>
        </div>
      </Section>

      <Section tone="muted" className="py-16 md:py-20">
        <Eyebrow>More capabilities</Eyebrow>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities
            .filter((c) => c.id !== capability.id)
            .map((c) => (
              <li key={c.id}>
                <Link
                  href={`/capabilities/${c.slug}`}
                  className="group flex h-full items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-900"
                >
                  <Icon name={c.icon} className="size-6 text-brand-700" />
                  <span className="flex-1 font-semibold">{c.title}</span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-900"
                  />
                </Link>
              </li>
            ))}
        </ul>
      </Section>
    </>
  )
}
