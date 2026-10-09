'use client'

import { ArrowRight, ChevronDown, Phone } from 'lucide-react'
import Link from 'next/link'
import { NavigationMenu } from 'radix-ui'
import type { ReactNode } from 'react'

import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Icon } from '@/components/ui/icon'
import { companyLinks, primaryLinks, requestHref, telHref, type NavLink } from '@/lib/navigation'

type DesktopNavProps = {
  solutions: NavLink[]
  capabilities: NavLink[]
  phone: string
}

const triggerStyles =
  'group inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 data-[state=open]:text-zinc-950'

export function DesktopNav({ solutions, capabilities, phone }: DesktopNavProps) {
  return (
    <NavigationMenu.Root delayDuration={80} className="hidden lg:block" aria-label="Main">
      <NavigationMenu.List className="flex items-center gap-1">
        <MegaMenu
          label="Solutions"
          links={solutions}
          aside={
            <div className="w-72 shrink-0 rounded-xl bg-zinc-950 p-6 text-white">
              <p className="font-semibold">Not sure which solution is right for you?</p>
              <p className="mt-2 text-sm text-zinc-400">
                Tell us what you need. A VTEGI specialist will follow up within one business day.
              </p>
              <NavigationMenu.Link asChild>
                <ButtonLink href={requestHref()} className="mt-5 w-full">
                  Talk to an Expert
                </ButtonLink>
              </NavigationMenu.Link>
              <a
                href={telHref(phone)}
                className="mt-3 flex items-center justify-center gap-2 text-sm text-zinc-300 hover:text-white"
              >
                <Phone aria-hidden className="size-4" /> {phone}
              </a>
            </div>
          }
          footer={{ label: 'Shop the VTEGI Store: hardware, software & licensing', href: '/store' }}
        />
        <MegaMenu
          label="Capabilities"
          links={capabilities}
          footer={{ label: 'View all capabilities', href: '/capabilities' }}
        />
        <MegaMenu label="Company" links={companyLinks} />
        {primaryLinks.map((link) => (
          <NavigationMenu.Item key={link.href}>
            <NavigationMenu.Link asChild>
              <Link href={link.href} className={triggerStyles}>
                {link.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
      {/* Panels render here. Positioned against the sticky header so they span its full width;
          the height animates when moving between menus. */}
      <NavigationMenu.Viewport className="absolute inset-x-0 top-full h-(--radix-navigation-menu-viewport-height) animate-dropdown overflow-hidden border-b border-zinc-200 bg-white shadow-xl shadow-zinc-950/5 transition-[height] duration-200 motion-reduce:animate-none motion-reduce:transition-none" />
    </NavigationMenu.Root>
  )
}

type MegaMenuProps = {
  label: string
  links: NavLink[]
  aside?: ReactNode
  footer?: NavLink
}

function MegaMenu({ label, links, aside, footer }: MegaMenuProps) {
  return (
    <NavigationMenu.Item>
      <NavigationMenu.Trigger className={triggerStyles}>
        {label}
        <ChevronDown
          aria-hidden
          className="size-4 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none"
        />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content className="w-full">
        <Container className="flex gap-10 py-8">
          <ul className="grid flex-1 content-start gap-1 md:grid-cols-2 xl:grid-cols-3">
            {links.map((link) => (
              <li key={link.href}>
                <MenuLink link={link} />
              </li>
            ))}
          </ul>
          {aside}
        </Container>
        {footer && (
          <div className="border-t border-zinc-100 bg-zinc-50">
            <Container className="py-4">
              <NavigationMenu.Link asChild>
                <Link
                  href={footer.href}
                  className="group/footer inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  {footer.label}
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover/footer:translate-x-0.5"
                  />
                </Link>
              </NavigationMenu.Link>
            </Container>
          </div>
        )}
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  )
}

function MenuLink({ link }: { link: NavLink }) {
  return (
    <NavigationMenu.Link asChild>
      <Link
        href={link.href}
        className="group/link flex gap-4 rounded-lg p-3 transition-colors hover:bg-zinc-50 focus-visible:bg-zinc-50"
      >
        {link.icon && (
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover/link:bg-brand-700 group-hover/link:text-white">
            <Icon name={link.icon} className="size-5" />
          </span>
        )}
        <span>
          <span className="block text-sm font-semibold text-zinc-900">{link.label}</span>
          {link.description && (
            <span className="mt-1 line-clamp-2 block text-sm text-zinc-600">
              {link.description}
            </span>
          )}
        </span>
      </Link>
    </NavigationMenu.Link>
  )
}
