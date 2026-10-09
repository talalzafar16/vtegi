import { notFound } from 'next/navigation'

// Unknown URLs land here so they get the styled 404 with the site header and footer.
// (The app has two root layouts, website and admin, so there is no single global one.)
export default function CatchAll() {
  notFound()
}
