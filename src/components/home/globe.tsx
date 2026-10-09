'use client'

import type { Arc, Globe as CobeGlobe, Marker } from 'cobe'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

type LatLng = [number, number]

const headquarters: LatLng = [38.4221, -77.4083] // Stafford, VA
const hubzoneOffice: LatLng = [38.9072, -77.0369] // Washington, DC
// Decorative arcs showing nationwide reach (not specific client sites).
const reach: LatLng[] = [
  [35.7796, -78.6382],
  [41.8781, -87.6298],
  [29.7604, -95.3698],
  [39.7392, -104.9903],
  [32.7157, -117.1611],
  [47.6062, -122.3321],
]

const markers: Marker[] = [
  { location: headquarters, size: 0.07 },
  { location: hubzoneOffice, size: 0.04 },
  ...reach.map((location) => ({ location, size: 0.025 })),
]
const arcs: Arc[] = reach.map((to) => ({ from: headquarters, to }))

// Rotation that faces the continental U.S. toward the viewer.
const usPhi = Math.PI - ((-95 * Math.PI) / 180 - Math.PI / 2)

// Sway around the U.S.: how fast (higher = faster) and how far each side (radians, ~0.45 ≈ 26°).
const SWAY_SPEED = 0.6
const SWAY_RANGE = 0.45

/** Interactive WebGL globe (cobe). Decorative, so hidden from assistive tech. */
export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let globe: CobeGlobe | undefined
    let frame = 0
    let visible = true
    let dragging = false
    let lastX = 0
    let dragOffset = 0
    let cancelled = false
    const start = performance.now()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio, 2)

    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    observer.observe(canvas)

    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      dragOffset += (e.clientX - lastX) / 200
      lastX = e.clientX
    }
    const onUp = () => (dragging = false)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    import('cobe').then(({ default: createGlobe }) => {
      if (cancelled) return
      const size = canvas.offsetWidth * dpr
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size,
        height: size,
        phi: usPhi,
        theta: 0.45,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 5,
        baseColor: [0.24, 0.24, 0.27],
        markerColor: [0.86, 0.06, 0.06],
        glowColor: [0.32, 0.06, 0.06],
        arcColor: [0.9, 0.12, 0.12],
        arcWidth: 0.6,
        arcHeight: 0.22,
        markers,
        arcs,
      })
      canvas.style.opacity = '1'

      // Sway gently around the U.S. so the arcs stay in view; pause when off-screen.
      const tick = () => {
        if (visible && globe) {
          const t = (performance.now() - start) / 1000
          const sway = reduceMotion ? 0 : Math.sin(t * SWAY_SPEED) * SWAY_RANGE
          globe.update({ phi: usPhi + sway + dragOffset })
        }
        frame = requestAnimationFrame(tick)
      }
      tick()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      globe?.destroy()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        'aspect-square w-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-1000 active:cursor-grabbing',
        className,
      )}
    />
  )
}
