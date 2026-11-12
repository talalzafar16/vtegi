import type { Capability, Solution } from '@/payload-types'

// Fixed site routes live here. Solution and capability links come from the CMS,
// so new entries appear in the header and footer automatically.

export type NavLink = {
  label: string
  href: string
  description?: string
  icon?: Solution['icon']
}

export const companyLinks: NavLink[] = [
  { label: 'About VTEGI', href: '/company/about', description: 'Our mission, values and team.' },
  { label: 'Partners', href: '/partners', description: 'Hardware, software and cloud vendors.' },
  { label: 'Careers', href: '/company/careers', description: 'Open positions and how we work.' },
  { label: 'News & Press', href: '/company/news', description: 'Announcements and updates.' },
  { label: 'Events', href: '/company/events', description: 'Briefings and industry events.' },
]

export const primaryLinks: NavLink[] = [
  { label: 'Store', href: '/store' },
  { label: 'Contracting', href: '/contracting' },
  { label: 'Contact', href: '/contact' },
]

export const legalLinks: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Accessibility', href: '/accessibility' },
]

export const solutionLinks = (solutions: Solution[]): NavLink[] =>
  solutions.map((s) => ({
    label: s.title,
    href: `/solutions/${s.slug}`,
    description: s.shortDescription,
    icon: s.icon,
  }))

export const capabilityLinks = (capabilities: Capability[]): NavLink[] =>
  capabilities.map((c) => ({
    label: c.title,
    href: `/capabilities/${c.slug}`,
    description: c.summary,
    icon: c.icon,
  }))

export const requestHref = (solutionSlug?: string) =>
  solutionSlug ? `/request?solution=${solutionSlug}` : '/request'

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`
