'use client'

import { ArrowRight, ChevronDown, Menu, Phone, X } from 'lucide-react'
import Link from 'next/link'
import { Dialog } from 'radix-ui'
import { useState } from 'react'

import { buttonStyles } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { companyLinks, primaryLinks, requestHref, telHref, type NavLink } from '@/lib/navigation'
import { cn } from '@/lib/utils'

type MobileNavProps = {
  solutions: NavLink[]
  capabilities: NavLink[]
  phone: string
}

/** Slide-in drawer for small screens. Radix Dialog handles focus trap, Escape and scroll lock. */
export function MobileNav({ solutions, capabilities, phone }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open menu"
        className="grid size-11 place-items-center rounded-md text-ink-900 hover:bg-ink-100 lg:hidden on-dark:text-ink-100 on-dark:hover:bg-white/10"
      >
        <Menu aria-hidden className="size-6" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-950/40 backdrop-blur-sm lg:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm animate-slide-in flex-col bg-white shadow-2xl motion-reduce:animate-none lg:hidden on-dark:bg-ink-900"
        >
          <div className="flex h-18 shrink-0 items-center justify-between border-b border-ink-200 px-5 on-dark:border-white/10">
            <Dialog.Title className="font-mono text-xs tracking-[0.2em] text-ink-500 uppercase">
              Menu
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-md hover:bg-ink-100 on-dark:hover:bg-white/10"
            >
              <X aria-hidden className="size-6" />
            </Dialog.Close>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto px-5 py-2">
            <MobileGroup label="Solutions" links={solutions} onNavigate={close} />
            <MobileGroup label="Capabilities" links={capabilities} onNavigate={close} />
            <MobileGroup label="Company" links={companyLinks} onNavigate={close} />
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="flex border-b border-ink-100 py-4 text-lg font-semibold on-dark:border-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-3 border-t border-ink-200 p-5 on-dark:border-white/10">
            <Link
              href={requestHref()}
              onClick={close}
              className={cn(buttonStyles({ size: 'lg' }), 'w-full')}
            >
              Start a Request <ArrowRight aria-hidden className="size-4" />
            </Link>
            <a
              href={telHref(phone)}
              className={cn(buttonStyles({ variant: 'outline', size: 'lg' }), 'w-full')}
            >
              <Phone aria-hidden className="size-4" /> {phone}
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

type MobileGroupProps = { label: string; links: NavLink[]; onNavigate: () => void }

/** Native <details> accordion: accessible and needs no JavaScript. */
function MobileGroup({ label, links, onNavigate }: MobileGroupProps) {
  return (
    <details className="group border-b border-ink-100 on-dark:border-white/10">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown aria-hidden className="size-5 transition-transform group-open:rotate-180" />
      </summary>
      <ul className="space-y-1 pb-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-md px-2 py-2.5 text-ink-700 hover:bg-ink-50 hover:text-ink-950 on-dark:text-ink-300 on-dark:hover:bg-white/5 on-dark:hover:text-white"
            >
              {link.icon && (
                <Icon name={link.icon} className="size-5 text-brand-700 on-dark:text-brand-400" />
              )}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  )
}
