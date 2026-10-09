import { ArrowRight, Mail, Phone } from 'lucide-react'

import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Logo } from '@/components/ui/logo'
import { getCapabilities, getSiteSettings, getSolutions } from '@/lib/cms'
import { capabilityLinks, requestHref, solutionLinks, telHref } from '@/lib/navigation'

import { DesktopNav } from './desktop-nav'
import { MobileNav } from './mobile-nav'
import { ThemeToggle } from './theme-toggle'

export async function SiteHeader() {
  const [settings, solutions, capabilities] = await Promise.all([
    getSiteSettings(),
    getSolutions(),
    getCapabilities(),
  ])
  const nav = {
    solutions: solutionLinks(solutions),
    capabilities: capabilityLinks(capabilities),
    phone: settings.phone,
  }

  return (
    <>
      {/* Utility bar: contracting IDs and direct contact (desktop only, scrolls away). */}
      <div className="hidden bg-ink-950 text-ink-400 lg:block dark:bg-ink-1000">
        <Container className="flex h-9 items-center justify-between font-mono text-[11px] tracking-wider uppercase">
          <p>
            {settings.cage && <>CAGE {settings.cage}</>}
            {settings.uei && <> &nbsp;·&nbsp; UEI {settings.uei}</>}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={telHref(settings.phone)}
              className="inline-flex items-center gap-2 hover:text-white"
            >
              <Phone aria-hidden className="size-3.5" /> {settings.phone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="inline-flex items-center gap-2 normal-case hover:text-white"
            >
              <Mail aria-hidden className="size-3.5" /> {settings.email}
            </a>
          </div>
        </Container>
      </div>

      <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/95 backdrop-blur-xl backdrop-saturate-150 on-dark:border-white/10 on-dark:bg-ink-950/85">
        <Container className="flex h-18 items-center justify-between gap-6">
          <Logo />
          <DesktopNav {...nav} />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ButtonLink href={requestHref()} className="hidden sm:inline-flex">
              Start a Request
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </ButtonLink>
            <MobileNav {...nav} />
          </div>
        </Container>
      </header>
    </>
  )
}
