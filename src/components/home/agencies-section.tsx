import Image from 'next/image'

import { Section } from '@/components/ui/section'
import { Eyebrow } from '@/components/ui/typography'
import { asMedia } from '@/lib/media'
import type { SiteSetting } from '@/payload-types'

/** Agency seals. Only rendered when "Show agencies" is enabled in Site Settings. */
export function AgenciesSection({ agencies }: { agencies: NonNullable<SiteSetting['agencies']> }) {
  return (
    <Section tone="muted" className="py-16 md:py-20">
      <Eyebrow className="justify-center">Trusted by public-sector teams</Eyebrow>
      <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
        {agencies.map((agency) => {
          const logo = asMedia(agency.logo)
          return (
            <li key={agency.id} title={agency.name}>
              {logo?.url ? (
                <Image
                  src={logo.url}
                  alt={agency.name}
                  width={logo.width ?? 120}
                  height={logo.height ?? 120}
                  className="h-16 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              ) : (
                <span className="text-sm font-medium text-zinc-600">{agency.name}</span>
              )}
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
