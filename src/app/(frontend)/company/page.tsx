import { redirect } from 'next/navigation'

// The Company section has no landing page of its own.
export default function CompanyPage() {
  redirect('/company/about')
}
