'use client'

import { Button, Link, useAuth, useConfig } from '@payloadcms/ui'
import { usePathname, useRouter } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { StoreSync, User } from '@/payload-types'

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })

async function fetchLatest(api: string): Promise<StoreSync | null> {
  const response = await fetch(`${api}?sort=-createdAt&limit=1&depth=0`, { credentials: 'include' })
  if (!response.ok) throw new Error(`Sync history request failed (${response.status})`)
  return (await response.json()).docs[0] ?? null
}

/** Sync now panel: starts the sync, then follows its progress until it finishes. Admins only. */
export function SyncPanel() {
  const { config } = useConfig()
  const { user } = useAuth<User>()
  const router = useRouter()
  const pathname = usePathname()
  const api = `${config.serverURL ?? ''}${config.routes.api}/store-syncs`
  const historyHref = formatAdminURL({
    adminRoute: config.routes.admin,
    path: '/collections/store-syncs',
  })

  const [run, setRun] = useState<StoreSync | null>()
  const [error, setError] = useState<string>()
  const [starting, setStarting] = useState(false)
  const lastStatus = useRef<StoreSync['status']>(undefined)

  const apply = useCallback(
    (latest: StoreSync | null) => {
      // A sync just finished: reload the list below so it shows the new names / history entry.
      if (lastStatus.current === 'running' && latest?.status !== 'running') router.refresh()
      lastStatus.current = latest?.status
      setRun(latest)
    },
    [router],
  )

  const isAdmin = user?.role === 'admin'
  const running = run?.status === 'running'

  // Load the latest sync, then check every 3 seconds while one is running.
  useEffect(() => {
    if (!isAdmin) return
    let active = true
    const refresh = () =>
      fetchLatest(api)
        .then((latest) => {
          if (active) apply(latest)
        })
        .catch(() => undefined)
    void refresh()
    const timer = running ? setInterval(refresh, 3000) : undefined
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [isAdmin, running, api, apply])

  if (!isAdmin) return null

  const start = async () => {
    setStarting(true)
    setError(undefined)
    try {
      const response = await fetch(`${api}/start`, { method: 'POST', credentials: 'include' })
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string }
        setError(body.error ?? 'The sync could not be started. Please try again.')
      }
      apply(await fetchLatest(api))
    } catch {
      setError('The sync could not be started. Please check your connection and try again.')
    }
    setStarting(false)
  }

  let status = 'Loading…'
  if (run === null) status = 'Not synced yet.'
  else if (run?.status === 'running')
    status = `Syncing since ${when(run.createdAt)}: ${run.progress ?? 'working'}… This takes a few minutes; you can leave this page.`
  else if (run?.status === 'success')
    status = `Last synced ${when(run.finishedAt ?? run.createdAt)}. ${run.summary ?? ''}`
  else if (run?.status === 'failed')
    status = `Last sync failed ${when(run.finishedAt ?? run.createdAt)}: ${run.error ?? 'unknown error'}`

  return (
    <div className={`vtegi-sync vtegi-sync--${run?.status ?? 'idle'}`}>
      <div className="vtegi-sync__text">
        <p className="vtegi-sync__title">Distributor names</p>
        <p className="vtegi-sync__status" role="status">
          {status}
        </p>
        {error && <p className="vtegi-sync__error">{error}</p>}
        {!pathname.endsWith('/store-syncs') && (
          <Link href={historyHref} className="vtegi-sync__link">
            View sync history
          </Link>
        )}
      </div>
      <Button
        buttonStyle="primary"
        size="medium"
        margin={false}
        disabled={running || starting}
        onClick={() => void start()}
      >
        {running || starting ? 'Syncing…' : 'Sync now'}
      </Button>
    </div>
  )
}
