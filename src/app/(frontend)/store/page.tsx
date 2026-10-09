import {
  ArrowRight,
  Cpu,
  HardDrive,
  KeyRound,
  Laptop,
  Monitor,
  Network,
  PhoneCall,
  Printer,
  Shield,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'

import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHero } from '@/components/ui/page-hero'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography'

export const metadata: Metadata = {
  title: 'Store',
  description:
    'Hardware, software and licensing from leading brands. Request a quote while our online store is being built.',
}

// Categories from Terry's storefront brief. The live catalog arrives in the e-commerce phase.
const categories = [
  { icon: Laptop, title: 'Laptops & workstations', text: 'Equip your teams for everyday work.' },
  { icon: Network, title: 'Network infrastructure', text: 'Connect offices, campuses and teams.' },
  { icon: HardDrive, title: 'Servers & storage', text: 'The foundation for your workloads.' },
  { icon: Cpu, title: 'Productivity software', text: 'Collaboration and business operations.' },
  { icon: Shield, title: 'Security software', text: 'Protection for identities and devices.' },
  {
    icon: KeyRound,
    title: 'Subscriptions & licensing',
    text: 'Licensing planned around your organization.',
  },
  { icon: PhoneCall, title: 'Communication', text: 'Voice, conferencing and collaboration gear.' },
  { icon: Monitor, title: 'Monitors', text: 'Displays for desks and collaboration spaces.' },
  { icon: Printer, title: 'Printers', text: 'Printing and multifunction equipment.' },
  {
    icon: Zap,
    title: 'Power, inverters & PDUs',
    text: 'Power conversion and distribution for IT.',
  },
  {
    icon: ShieldCheck,
    title: 'Network security & firewalls',
    text: 'Protection appliances and firewalls.',
  },
]

export default function StorePage() {
  return (
    <>
      <PageHero
        eyebrow="VTEGI Store"
        title="Your one-stop destination for IT solutions."
        intro="From computer hardware and networking to business software and complete IT infrastructure, from leading brands including Dell, Cisco, IBM, Microsoft and Lenovo."
      >
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="/request?inquiry=quote" size="lg">
            Request a quote <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
          <Badge>Online store coming soon</Badge>
        </div>
      </PageHero>

      <Section>
        <Eyebrow>Browse categories</Eyebrow>
        <Heading className="mt-5">Find the technology you need.</Heading>
        <Lead className="mt-5 max-w-2xl">
          Our online catalog is on its way. Until then, tell us what you need and we’ll send you a
          quote.
        </Lead>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ icon: CategoryIcon, title, text }) => (
            <li key={title}>
              <Card className="flex h-full gap-4">
                <CategoryIcon
                  aria-hidden
                  className="size-6 shrink-0 text-brand-700 on-dark:text-brand-400"
                />
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="mt-1 block text-sm text-ink-600 on-dark:text-ink-400">
                    {text}
                  </span>
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <Eyebrow>Built around your work</Eyebrow>
            <Heading className="mt-5">A computer configured around your needs.</Heading>
            <Lead className="mt-5">
              Tell us how you plan to use your computer, the applications you run, your performance
              requirements and budget. We’ll help you choose a configuration that fits.
            </Lead>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink href="/request?inquiry=custom-build" size="lg">
              Discuss your custom build
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  )
}
