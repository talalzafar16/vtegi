'use client'

import { Link, useConfig } from '@payloadcms/ui'
import { LogOut } from 'lucide-react'
import { formatAdminURL } from 'payload/shared'

/** Bottom of the admin nav: a labelled "Log out" link in place of Payload's bare icon. */
export function LogoutButton({ tabIndex = 0 }: { tabIndex?: number }) {
  const { config } = useConfig()
  const href = formatAdminURL({ adminRoute: config.routes.admin, path: config.admin.routes.logout })

  return (
    <Link href={href} prefetch={false} tabIndex={tabIndex} className="vtegi-logout">
      <LogOut aria-hidden size={16} /> Log out
    </Link>
  )
}
