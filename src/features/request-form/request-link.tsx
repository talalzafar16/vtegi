'use client'

import Link from 'next/link'
import type { ComponentProps, MouseEvent } from 'react'

import { requestHref } from '@/lib/navigation'

type RequestLinkProps = { solution: string } & Omit<ComponentProps<typeof Link>, 'href'>

/** Links to the form with a solution pre-selected: scrolls there on pages that have the form,
 * otherwise opens /request?solution=... */
export function RequestLink({ solution, onClick, ...props }: RequestLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    const form = document.getElementById('request')
    if (!form || e.defaultPrevented) return
    e.preventDefault()
    window.history.pushState(null, '', `${window.location.pathname}?solution=${solution}#request`)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return <Link href={requestHref(solution)} onClick={handleClick} {...props} />
}
