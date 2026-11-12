'use client'

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'

/** Smooth wheel and trackpad scrolling (touch stays native). Lenis disables it for reduced
 * motion, lets nested scroll areas scroll on their own and handles anchor links. */
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
