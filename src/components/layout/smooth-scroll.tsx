'use client'

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'

/**
 * Smooth, eased page scrolling for mouse wheels and trackpads; touch keeps native scrolling.
 * Lenis turns the smoothing off for reduced-motion users, lets nested scroll areas (the mobile
 * menu, text areas) scroll on their own, and handles in-page anchor links.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    })
    return () => lenis.destroy()
  }, [])

  return null
}
