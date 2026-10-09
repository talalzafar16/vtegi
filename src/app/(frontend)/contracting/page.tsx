import { Download, Mail } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

import { AgenciesSection } from '@/components/home/agencies-section'
import { ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { getSiteSettings } from '@/lib/cms'
import { asMedia } from '@/lib/media'

export const metadata: Metadata = {
  title: 'Contracting Information',
  description:
    'VTEGI CAGE code, UEI, NAICS codes, socioeconomic status and certifications for contracting officers and prime partners.',
}

export default async function ContractingPage() {
  const settings = await getSiteSettings()
  const primaryNaics = settings.naics?.find((n) => n.primary) ?? settings.naics?.[0]
  const capabilityStatement = asMedia(settings.capabilityStatement)

  const glance = [
    { label: 'CAGE code', value: settings.cage },
    { label: 'UEI', value: settings.uei },
    { label: 'Primary NAICS', value: primaryNaics?.code },
    { label: 'Headquarters', value: settings.offices?.[0]?.address.split('\n').pop() },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value))

  return (
    <>
      <PageHero
        eyebrow="Contracting"
        title="Contracting with VTEGI."
        intro="Company identifiers, classifications and certifications for contracting officers, small business specialists and prime partners."
      >
        <div className="flex flex-wrap gap-3">
          {capabilityStatement?.url ? (
            <ButtonLink href={capabilityStatement.url} size="lg" target="_blank">
              <Download aria-hidden className="size-4" /> Capability statement (PDF)
            </ButtonLink>
          ) : (
            <ButtonLink href="/request?inquiry=general" size="lg">
              Request our capability statement
            </ButtonLink>
          )}
          <ButtonLink href={`mailto:${settings.email}`} variant="outline" size="lg">
            <Mail aria-hidden className="size-4" /> {settings.email}
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <Eyebrow>At a glance</Eyebrow>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {glance.map((item) => (
            <Card key={item.label}>
              <dt className="font-mono text-xs tracking-wider text-zinc-500 uppercase">
                {item.label}
              </dt>
              <dd className="mt-3 font-mono text-2xl font-semibold tracking-tight select-all">
                {item.value}
              </dd>
            </Card>
          ))}
        </dl>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          {settings.naics && settings.naics.length > 0 && (
            <div>
              <Heading size="lg">NAICS codes</Heading>
              <table className="mt-6 w-full text-left text-sm">
                <thead className="border-b border-zinc-300 font-mono text-xs tracking-wider text-zinc-500 uppercase">
                  <tr>
                    <th scope="col" className="py-3 pr-6 font-medium">
                      Code
                    </th>
                    <th scope="col" className="py-3 font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {settings.naics.map((naics) => (
                    <tr key={naics.id}>
                      <td className="py-3 pr-6 font-mono font-semibold">{naics.code}</td>
                      <td className="py-3 text-zinc-700">
                        {naics.title}
                        {naics.primary && (
                          <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                            Primary
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="space-y-12">
            {settings.socioeconomic && settings.socioeconomic.length > 0 && (
              <div>
                <Heading size="lg">Socioeconomic status</Heading>
                <ul className="mt-6 space-y-3">
                  {settings.socioeconomic.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg border border-zinc-200 px-4 py-3 font-medium"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {settings.contractVehicles && settings.contractVehicles.length > 0 && (
              <div>
                <Heading size="lg">Contract vehicles</Heading>
                <ul className="mt-6 space-y-3">
                  {settings.contractVehicles.map((vehicle) => (
                    <li key={vehicle.id} className="rounded-lg border border-zinc-200 px-4 py-3">
                      <span className="font-medium">{vehicle.name}</span>
                      {vehicle.contractNumber && (
                        <span className="mt-1 block font-mono text-sm text-zinc-500">
                          {vehicle.contractNumber}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {settings.certifications && settings.certifications.length > 0 && (
              <div>
                <Heading size="lg">Certifications</Heading>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {settings.certifications.map((cert) => {
                    const logo = asMedia(cert.logo)
                    return (
                      <li
                        key={cert.id}
                        className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium"
                      >
                        {logo?.url && (
                          <Image
                            src={logo.url}
                            alt=""
                            width={logo.width ?? 80}
                            height={logo.height ?? 80}
                            className="size-8 rounded bg-zinc-900 object-contain p-0.5"
                          />
                        )}
                        {cert.name}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Section>

      {settings.showAgencies && settings.agencies?.length ? (
        <AgenciesSection agencies={settings.agencies} />
      ) : null}
    </>
  )
}
