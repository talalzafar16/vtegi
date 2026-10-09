import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

import { Marquee } from '@/components/motion/marquee'
import { Reveal } from '@/components/motion/reveal'
import { ButtonLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { asMedia } from '@/lib/media'
import type { Partner } from '@/payload-types'

type PartnersSectionProps = { heading: string; partners: Partner[] }

/** Scrolling vendor logos (Terry's brief). Grayscale until hovered, to calm mixed logo styles. */
export function PartnersSection({ heading, partners }: PartnersSectionProps) {
  const logos = partners.flatMap((partner) => {
    const logo = asMedia(partner.logo)
    return logo?.url
      ? [{ name: partner.name, url: logo.url, width: logo.width, height: logo.height }]
      : []
  })

  return (
    <Section className="overflow-hidden">
      <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>Technology partners</Eyebrow>
          <Heading size="lg" className="mt-5">
            {heading}
          </Heading>
        </div>
        <ButtonLink href="/partners" variant="link">
          View all partners <ArrowRight aria-hidden className="size-4" />
        </ButtonLink>
      </Reveal>
      <Marquee className="mt-14" duration={60}>
        {logos.map((logo) => (
          <Image
            key={logo.name}
            src={logo.url}
            alt={logo.name}
            width={logo.width ?? 240}
            height={logo.height ?? 120}
            className="h-14 w-36 object-contain opacity-60 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0 dark:invert dark:hover:grayscale"
          />
        ))}
      </Marquee>
    </Section>
  )
}
