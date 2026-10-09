'use client'

import type { Globe as CobeGlobe } from 'cobe'
import { useEffect, useRef, useState } from 'react'

type LatLng = [number, number]
type Rgb = [number, number, number]

const headquarters: LatLng = [38.4221, -77.4083] // Stafford, VA
const hubzoneOffice: LatLng = [38.9072, -77.0369] // Washington, DC
// Decorative links showing nationwide reach. They are not client sites, so they stay unlabeled.
// All 500+ miles out: cobe gives every arc the same height, so very close ones turn into loops.
const reach: LatLng[] = [
  [33.749, -84.388],
  [25.7617, -80.1918],
  [41.8781, -87.6298],
  [44.9778, -93.265],
  [32.7767, -96.797],
  [39.7392, -104.9903],
  [33.4484, -112.074],
  [37.7749, -122.4194],
  [47.6062, -122.3321],
]

// Rotation that faces the continental U.S. toward the viewer, and the default tilt.
const usPhi = Math.PI - ((-95 * Math.PI) / 180 - Math.PI / 2)
const baseTheta = 0.45

// Feel. Times are in seconds.
const SWAY_SPEED = 0.6 // idle sway around the U.S.: speed…
const SWAY_RANGE = 0.45 // …and reach each side (radians, ~26°)
const ENTRANCE = 2.2 // one full turn that settles on the U.S.
const LINK_CYCLE = 6 // each link fires again after this long…
const LINK_ON = 0.4 // …glowing for this share of its cycle, so 3–4 glow at any moment
const READOUT_EVERY = 2.4 // the readout switches to the newest link at most this often
const FRICTION = 0.94 // share of fling speed kept each frame
const SPRING = 0.035 // how quickly a released globe drifts back to face the U.S.

const ARC_REST: Rgb = [0.5, 0.07, 0.07]
const ARC_LIVE: Rgb = [1, 0.42, 0.36]

// Golden-ratio offsets: links fire in an overlapping, natural-looking order, not a chase.
const linkOffsets = reach.map((_, i) => (i * 0.618) % 1)

/** "38.42°N 77.41°W" */
const formatLatLng = ([lat, lng]: LatLng) =>
  `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lng).toFixed(2)}°${lng >= 0 ? 'E' : 'W'}`

/** Great-circle distance in miles, rounded to the nearest 10. */
function milesBetween([lat1, lng1]: LatLng, [lat2, lng2]: LatLng) {
  const rad = Math.PI / 180
  const h =
    Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lng2 - lng1) * rad) / 2) ** 2
  return Math.round((7918 * Math.asin(Math.sqrt(h))) / 10) * 10
}

// "39.74°N 104.99°W · 1,480 mi", all padded to one length so the centered readout doesn't jitter.
const labels = reach.map(
  (to) => `${formatLatLng(to)} · ${milesBetween(headquarters, to).toLocaleString('en-US')} mi`,
)
const linkLabels = labels.map((label) => label.padEnd(Math.max(...labels.map((l) => l.length))))

const easeOut = (x: number) => 1 - (1 - x) ** 4
const smooth = (x: number) => x * x * (3 - 2 * x)
const mix = (a: Rgb, b: Rgb, k: number): Rgb => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
  a[2] + (b[2] - a[2]) * k,
]
/** Same angle within -π..π, so a released globe springs back the short way round. */
const wrap = (angle: number) => angle - 2 * Math.PI * Math.round(angle / (2 * Math.PI))

/** Brightness of a link at a point in its cycle (0..1): quick flare, slow fade, then rest. */
function linkGlow(phase: number) {
  if (phase >= LINK_ON) return 0
  const x = phase / LINK_ON
  return x < 0.2 ? smooth(x / 0.2) : 1 - smooth((x - 0.2) / 0.8)
}

/**
 * Interactive WebGL globe (cobe) with a mono readout underneath. It spins in and settles on the
 * U.S., then links from HQ flare up across the country, several at a time (the readout types out
 * the newest). Drag to spin or tilt it; let go and it coasts, then drifts back.
 * Reduced motion: a still globe.
 */
export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeLink, setActiveLink] = useState(-1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const html = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio, 2)
    let globe: CobeGlobe | undefined
    let frame = 0
    let cancelled = false
    let visible = true
    let last = performance.now()
    let entranceStart: number | null = null
    let shownLink = -1
    let readoutAt = 0

    // Dragging: rotation (spin) and tilt offsets, plus fling speed for momentum.
    let dragging = false
    let lastX = 0
    let lastY = 0
    let lastMove = 0
    let spin = 0
    let tilt = 0
    let velocity = 0

    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    observer.observe(canvas)

    const onDown = (e: PointerEvent) => {
      dragging = true
      velocity = 0
      lastX = e.clientX
      lastY = e.clientY
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      velocity = (e.clientX - lastX) / 200
      spin += velocity
      tilt = Math.max(-0.4, Math.min(0.4, tilt + (e.clientY - lastY) / 300))
      lastX = e.clientX
      lastY = e.clientY
      lastMove = performance.now()
    }
    const onUp = () => {
      dragging = false
      // Held still before letting go: no fling. Otherwise cap it so it can't spin wildly.
      velocity = performance.now() - lastMove > 80 ? 0 : Math.max(-0.2, Math.min(0.2, velocity))
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    const render = (now: number, dt: number) => {
      if (!globe) return
      // The entrance waits while the first-visit intro still covers the page.
      if (entranceStart === null && html.dataset.intro !== 'hold') entranceStart = now
      const t = entranceStart === null ? 0 : (now - entranceStart) / 1000
      const entered = reduceMotion ? 1 : easeOut(Math.min(1, t / ENTRANCE))

      // Momentum after a fling, then a gentle spring back to the U.S. (frame-rate independent).
      if (!dragging && !reduceMotion) {
        const frames = dt * 60
        spin += velocity * frames
        velocity *= FRICTION ** frames
        if (Math.abs(velocity) < 0.002) {
          const pull = 1 - (1 - SPRING) ** frames
          spin = wrap(spin) * (1 - pull)
          tilt *= 1 - pull
        }
      }

      // Links fade in as the globe settles, then each flares on its own staggered cycle.
      const linkTime = reduceMotion ? 0 : Math.max(0, t - ENTRANCE * 0.6)
      const linksIn = smooth(Math.min(1, linkTime))
      const phases = linkOffsets.map((offset) => (linkTime / LINK_CYCLE + offset) % 1)
      const glows = phases.map((phase) => linkGlow(phase) * linksIn)

      // Readout: the link that fired most recently, but no more often than READOUT_EVERY.
      if (linksIn === 1 && now - readoutAt > READOUT_EVERY * 1000) {
        const newest = phases.indexOf(Math.min(...phases))
        if (newest !== shownLink) {
          shownLink = newest
          readoutAt = now
          setActiveLink(newest)
        }
      }

      const sway = reduceMotion ? 0 : Math.sin((now / 1000) * SWAY_SPEED) * SWAY_RANGE
      globe.update({
        phi: usPhi + sway + spin - (1 - entered) * 2 * Math.PI,
        theta: baseTheta + tilt,
        scale: 0.85 + 0.15 * entered,
        arcs: reach.map((to, i) => ({
          from: headquarters,
          to,
          // Reduced motion keeps every arc at the default red (arcColor).
          color: reduceMotion ? undefined : mix(ARC_REST, ARC_LIVE, glows[i]),
        })),
        markers: [
          // HQ: a slow, steady beacon.
          {
            location: headquarters,
            size: reduceMotion ? 0.07 : 0.07 + 0.012 * Math.sin(now / 400),
          },
          { location: hubzoneOffice, size: 0.04 },
          ...reach.map((location, i) => ({ location, size: 0.022 + 0.03 * glows[i] })),
        ],
      })
    }

    import('cobe').then(({ default: createGlobe }) => {
      if (cancelled) return
      const size = canvas.offsetWidth * dpr
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size,
        height: size,
        phi: usPhi,
        theta: baseTheta,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 5,
        baseColor: [0.24, 0.24, 0.27],
        markerColor: [0.86, 0.06, 0.06],
        glowColor: [0.32, 0.06, 0.06],
        arcColor: [0.9, 0.12, 0.12],
        arcWidth: 0.8,
        arcHeight: 0.25,
      })
      canvas.style.opacity = '1'

      // One loop drives everything; it skips drawing while the globe is off-screen.
      const tick = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        if (visible) render(now, dt)
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
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
    <div className={className}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="aspect-square w-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-1000 active:cursor-grabbing"
      />
      {/* Readout: HQ coordinates at first; then where the newest link goes and how far. */}
      <p
        aria-hidden
        className="mt-2 flex items-center justify-center gap-3 font-mono text-[11px] tracking-[0.18em] whitespace-pre text-ink-500 uppercase"
      >
        <span className="size-1.5 rounded-full bg-brand-500" />
        {activeLink < 0 ? (
          `HQ · ${formatLatLng(headquarters)} · Stafford, VA`
        ) : (
          <>
            HQ →
            <span key={activeLink} className="animate-type text-ink-300">
              {linkLabels[activeLink]}
            </span>
          </>
        )}
      </p>
    </div>
  )
}
