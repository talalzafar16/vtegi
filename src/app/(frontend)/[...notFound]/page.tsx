import { notFound } from 'next/navigation'

// Unknown URLs get the styled 404 with header and footer (two root layouts, so no global 404).
export default function CatchAll() {
  notFound()
}
