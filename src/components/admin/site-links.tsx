import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

/** Top of the admin nav: opens the live website in a new tab. */
export function NavSiteLink() {
  return (
    <a href="/" target="_blank" rel="noopener noreferrer" className="vtegi-site-link">
      View website <ArrowUpRight aria-hidden size={14} />
    </a>
  )
}

/** Under the login form: back to the public website. */
export function LoginSiteLink() {
  return (
    <Link href="/" className="vtegi-back-link">
      <ArrowLeft aria-hidden size={14} /> Back to vtegi.com
    </Link>
  )
}
