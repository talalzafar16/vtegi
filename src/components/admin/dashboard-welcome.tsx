import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ServerProps } from 'payload'

/**
 * Top of the admin dashboard: a branded welcome, request counts from the website form
 * (admins only, like the Leads collection) and shortcuts to the most common tasks.
 */
export async function DashboardWelcome({ payload, user }: ServerProps) {
  const admin = payload.config.routes.admin
  const isAdmin = user?.role === 'admin'
  const firstName = user?.name?.split(' ')[0]

  const [newRequests, allRequests] = isAdmin
    ? await Promise.all([
        payload.count({ collection: 'leads', where: { status: { equals: 'new' } } }),
        payload.count({ collection: 'leads' }),
      ])
    : []

  const shortcuts = [
    { label: 'Edit home page', href: `${admin}/globals/home-page` },
    { label: 'Add a news post', href: `${admin}/collections/news/create` },
    { label: 'Post a job', href: `${admin}/collections/jobs/create` },
    ...(isAdmin ? [{ label: 'Site settings', href: `${admin}/globals/site-settings` }] : []),
  ]

  return (
    <section className="vtegi-welcome">
      <div className="vtegi-welcome__intro">
        <p className="vtegi-welcome__eyebrow">VTEGI · Website admin</p>
        <h1 className="vtegi-welcome__title">
          {firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}
        </h1>
        <p className="vtegi-welcome__text">
          Update website content, follow up on requests from the site, and keep company details
          current.
        </p>
        <a href="/" target="_blank" rel="noopener noreferrer" className="vtegi-welcome__site">
          View website <ArrowUpRight aria-hidden size={15} />
        </a>
      </div>

      <div className="vtegi-welcome__panel">
        {newRequests && allRequests && (
          <div className="vtegi-welcome__stats">
            <a
              href={`${admin}/collections/leads?where[status][equals]=new`}
              className="vtegi-stat"
              data-highlight={newRequests.totalDocs > 0 || undefined}
            >
              <span className="vtegi-stat__value">{newRequests.totalDocs}</span>
              <span className="vtegi-stat__label">New requests</span>
            </a>
            <a href={`${admin}/collections/leads`} className="vtegi-stat">
              <span className="vtegi-stat__value">{allRequests.totalDocs}</span>
              <span className="vtegi-stat__label">All requests</span>
            </a>
          </div>
        )}
        <ul className="vtegi-welcome__shortcuts">
          {shortcuts.map((shortcut) => (
            <li key={shortcut.href}>
              <a href={shortcut.href}>
                {shortcut.label} <ArrowRight aria-hidden size={15} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
