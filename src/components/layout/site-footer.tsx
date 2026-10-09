import { ArrowRight, ArrowUpRight, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { ButtonLink, buttonStyles } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Logo } from '@/components/ui/logo'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { getCapabilities, getSiteSettings, getSolutions } from '@/lib/cms'
import { asMedia } from '@/lib/media'
import {
  capabilityLinks,
  companyLinks,
  legalLinks,
  primaryLinks,
  requestHref,
  solutionLinks,
  telHref,
  type NavLink,
} from '@/lib/navigation'

export async function SiteFooter() {
  const [settings, solutions, capabilities] = await Promise.all([
    getSiteSettings(),
    getSolutions(),
    getCapabilities(),
  ])
  const primaryNaics = settings.naics?.find((n) => n.primary) ?? settings.naics?.[0]
  const badges = (settings.certifications ?? []).flatMap(({ name, logo }) => {
    const media = asMedia(logo)
    return media?.url
      ? [{ name, url: media.url, width: media.width ?? 120, height: media.height ?? 120 }]
      : []
  })

  return (
    <footer data-tone="dark" className="bg-zinc-950 text-zinc-400">
      <Container>
        {/* Closing call to action, using VTEGI's own tagline. */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <Eyebrow>Let&apos;s talk</Eyebrow>
            <Heading size="xl" className="mt-4 max-w-2xl text-white">
              Give us your challenges. We&apos;ll give you solutions.
            </Heading>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={requestHref()} size="lg">
              Start a Request
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </ButtonLink>
            <a
              href={telHref(settings.phone)}
              className={buttonStyles({ variant: 'outline', size: 'lg' })}
            >
              <Phone aria-hidden className="size-4" /> {settings.phone}
            </a>
          </div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-6 text-sm">
            <Logo tone="light" />
            {settings.tagline && <p className="text-zinc-300">{settings.tagline}</p>}
            {settings.offices?.map((office) => (
              <address key={office.id} className="not-italic">
                <span className="block font-medium text-white">{office.label}</span>
                <span className="whitespace-pre-line">{office.address}</span>
              </address>
            ))}
            <p className="space-y-1">
              <a href={telHref(settings.phone)} className="block hover:text-white">
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="block hover:text-white">
                {settings.email}
              </a>
            </p>
          </div>
          <FooterColumn title="Solutions" links={solutionLinks(solutions)} />
          <FooterColumn title="Capabilities" links={capabilityLinks(capabilities)} />
          <FooterColumn title="Company" links={[...companyLinks, ...primaryLinks]} />
        </div>

        {/* Credentials government buyers look for. */}
        <div className="flex flex-col gap-8 border-t border-white/10 py-10 lg:flex-row lg:items-center lg:justify-between">
          <dl className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs tracking-wider uppercase">
            {settings.cage && <Credential label="CAGE" value={settings.cage} />}
            {settings.uei && <Credential label="UEI" value={settings.uei} />}
            {primaryNaics && <Credential label="Primary NAICS" value={primaryNaics.code} />}
          </dl>
          {badges.length > 0 && (
            <ul className="flex flex-wrap items-center gap-6">
              {badges.map((badge) => (
                <li key={badge.name}>
                  <Image
                    src={badge.url}
                    alt={badge.name}
                    width={badge.width}
                    height={badge.height}
                    className="h-12 w-auto opacity-70 transition-opacity hover:opacity-100"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.companyName}
          </p>
          <ul className="flex flex-wrap gap-6">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            {settings.linkedinUrl && (
              <li>
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  LinkedIn <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              </li>
            )}
          </ul>
        </div>
      </Container>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <nav aria-label={title}>
      <p className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase">{title}</p>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Credential({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt>{label}</dt>
      <dd className="text-white">{value}</dd>
    </div>
  )
}
