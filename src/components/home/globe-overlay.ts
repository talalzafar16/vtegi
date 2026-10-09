/**
 * The 2D layer drawn over the cobe globe: satellites on tilted orbits, data packets flying along
 * the links with a ping where they land, and satellite uplinks down to HQ. It reuses cobe's
 * geometry (globe radius, lat/lng mapping, rotation, arc curve), so it stays locked to the globe.
 */

export type LatLng = [number, number]
type Vec3 = [number, number, number]
type Orbit = { radius: number; tilt: number; roll: number; period: number; start: number }

// cobe's scene units: globe radius and its default marker elevation.
const GLOBE = 0.8
const ELEVATION = 0.05

// Orbits live in view space, so satellites keep circling while the globe turns beneath them.
// radius: in globe units (the globe is 0.8) · tilt: how open the ellipse looks · roll: its angle
// on screen · period: seconds per lap (negative = the other way) · start: starting angle.
const orbits: Orbit[] = [
  { radius: 0.98, tilt: 0.3, roll: -0.35, period: 16, start: 0.5 },
  { radius: 1.06, tilt: 0.55, roll: 0.5, period: -22, start: 2.6 },
  { radius: 1.13, tilt: 0.18, roll: 0.1, period: 30, start: 4.4 },
]
export const SATELLITES = orbits.length

// Timing, in seconds or shares of a link's cycle.
const LINK_CYCLE = 6 // a packet leaves on each link this often…
const IN_FLIGHT = 0.3 // …flies for this share of the cycle…
const PINGING = 0.18 // …then pings where it lands for this share
const UPLINK_EVERY = 5 // a satellite beams down to HQ this often…
const UPLINK_TIME = 1.6 // …for this long

const RED = '255, 70, 60'
const TAU = Math.PI * 2
const easeInOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2)
const easeOut = (x: number) => 1 - (1 - x) ** 3

/** cobe's lat/lng → point on the unit sphere. */
function toUnit([lat, lng]: LatLng): Vec3 {
  const a = (lat * Math.PI) / 180
  const b = (lng * Math.PI) / 180 - Math.PI
  return [-Math.cos(a) * Math.cos(b), Math.sin(a), Math.cos(a) * Math.sin(b)]
}

/** Rotates a globe point into view space (x right, y up, z toward the viewer), as cobe does. */
function toView([x, y, z]: Vec3, phi: number, theta: number): Vec3 {
  const [cp, sp, ct, st] = [Math.cos(phi), Math.sin(phi), Math.cos(theta), Math.sin(theta)]
  return [cp * x + sp * z, sp * st * x + ct * y - cp * st * z, -sp * ct * x + st * y + cp * ct * z]
}

/** A unit-sphere point raised to where cobe draws markers and arc ends. */
const onSurface = ([x, y, z]: Vec3): Vec3 => {
  const r = GLOBE + ELEVATION
  return [x * r, y * r, z * r]
}

/** Behind the globe and inside its outline, so out of sight. */
const hidden = ([x, y, z]: Vec3) => z < 0 && x * x + y * y < GLOBE * GLOBE

/** Point `t` (0..1) along a cobe arc: a quadratic curve between the ends, lifted by `height`. */
function arcPoint(from: Vec3, to: Vec3, height: number, t: number): Vec3 {
  const mid: Vec3 = [from[0] + to[0], from[1] + to[1], from[2] + to[2]]
  const end = GLOBE + ELEVATION
  const lift = (GLOBE + height + ELEVATION) / Math.hypot(...mid)
  const [a, b, c] = [(1 - t) ** 2 * end, 2 * (1 - t) * t * lift, t ** 2 * end]
  return [0, 1, 2].map((k) => a * from[k] + b * mid[k] + c * to[k]) as Vec3
}

function orbitPoint({ radius, tilt, roll }: Orbit, angle: number): Vec3 {
  const x = radius * Math.cos(angle)
  const y = -radius * Math.sin(angle) * Math.sin(tilt)
  const z = radius * Math.sin(angle) * Math.cos(tilt)
  return [x * Math.cos(roll) - y * Math.sin(roll), x * Math.sin(roll) + y * Math.cos(roll), z]
}

/** Something worth showing in the readout: a packet landed, or a satellite started an uplink. */
export type OverlayEvent = { link: number } | { satellite: number }

export type OverlayFrame = {
  phi: number
  theta: number
  scale: number
  /** Seconds since the layer started; drives orbits, packets and uplinks. */
  time: number
  opacity: number
  /** Reduced motion: orbits and satellites only, nothing moving. */
  still: boolean
}

type OverlayOptions = { hq: LatLng; links: LatLng[]; arcHeight: number; dpr: number }

export function createOverlay(canvas: HTMLCanvasElement, options: OverlayOptions) {
  const ctx = canvas.getContext('2d')
  const { dpr, arcHeight } = options
  const size = canvas.width
  const hq = toUnit(options.hq)
  const ends = options.links.map(toUnit)
  // Golden-ratio offsets: packets leave in an overlapping, natural order rather than a chase.
  const offsets = ends.map((_, i) => (i * 0.618) % 1)
  let lastPhases: number[] | null = null
  let lastUplink = -1
  let uplinkSat = -1
  let scale = 1

  const satelliteAt = (n: number, time: number) =>
    orbitPoint(orbits[n], orbits[n].start + (TAU * time) / orbits[n].period)

  const toPx = ([x, y]: Vec3): [number, number] => [
    ((x * scale + 1) / 2) * size,
    ((1 - y * scale) / 2) * size,
  ]

  const segment = (a: Vec3, b: Vec3, style: string | CanvasGradient, width: number) => {
    if (!ctx) return
    ctx.strokeStyle = style
    ctx.lineWidth = width * dpr
    ctx.beginPath()
    ctx.moveTo(...toPx(a))
    ctx.lineTo(...toPx(b))
    ctx.stroke()
  }

  const glowDot = (at: Vec3, radius: number, glow: string) => {
    if (!ctx) return
    ctx.save()
    ctx.shadowColor = glow
    ctx.shadowBlur = 12 * dpr
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(...toPx(at), radius * dpr, 0, TAU)
    ctx.fill()
    ctx.restore()
  }

  /** A ring spreading out on the globe's surface (an ellipse, foreshortened like the surface). */
  const ping = (at: Vec3, progress: number) => {
    if (!ctx || at[2] < 0) return
    const [nx, ny, nz] = at.map((v) => v / Math.hypot(...at))
    const r = (3 + 16 * easeOut(progress)) * dpr
    ctx.strokeStyle = `rgba(${RED}, ${0.9 * (1 - progress)})`
    ctx.lineWidth = 1.2 * dpr
    ctx.beginPath()
    ctx.ellipse(...toPx(at), r * Math.max(0.2, nz), r, Math.atan2(-ny, nx), 0, TAU)
    ctx.stroke()
  }

  const drawOrbit = (orbit: Orbit) => {
    if (!ctx) return
    const front = new Path2D()
    const back = new Path2D()
    let prev = orbitPoint(orbit, 0)
    for (let i = 1; i <= 160; i++) {
      const next = orbitPoint(orbit, (i / 160) * TAU)
      if (!hidden(prev) && !hidden(next)) {
        const path = prev[2] >= 0 ? front : back
        path.moveTo(...toPx(prev))
        path.lineTo(...toPx(next))
      }
      prev = next
    }
    ctx.lineWidth = dpr
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.13)'
    ctx.stroke(front)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.stroke(back)
  }

  const drawSatellite = (orbit: Orbit, angle: number) => {
    const at = orbitPoint(orbit, angle)
    if (!ctx || hidden(at)) return
    const dir = Math.sign(orbit.period)
    // A short fading trail behind it.
    for (let i = 0; i < 12; i++) {
      const a = orbitPoint(orbit, angle - dir * (i + 1) * 0.03)
      const b = orbitPoint(orbit, angle - dir * i * 0.03)
      if (hidden(a)) break
      segment(a, b, `rgba(255, 255, 255, ${0.45 * (1 - i / 12)})`, 1.2)
    }
    // Body with two solar panels across its path; dimmer while it's round the back.
    const [x, y] = toPx(at)
    const [ax, ay] = toPx(orbitPoint(orbit, angle + dir * 0.01))
    ctx.save()
    ctx.globalAlpha *= at[2] >= 0 ? 1 : 0.45
    ctx.translate(x, y)
    ctx.rotate(Math.atan2(ay - y, ax - x))
    ctx.scale(dpr, dpr)
    ctx.fillStyle = 'rgba(214, 208, 207, 0.85)'
    ctx.fillRect(-1, -7, 2, 4.5)
    ctx.fillRect(-1, 2.5, 2, 4.5)
    ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'
    ctx.shadowBlur = 6 * dpr
    ctx.fillStyle = '#fff'
    ctx.fillRect(-1.75, -1.75, 3.5, 3.5)
    ctx.restore()
  }

  /** Draws one frame; returns what just happened, if anything, for the readout. */
  return function draw(frame: OverlayFrame): OverlayEvent | null {
    if (!ctx) return null
    const { phi, theta, time, opacity, still } = frame
    scale = frame.scale
    ctx.clearRect(0, 0, size, size)
    if (opacity <= 0) return null
    ctx.globalAlpha = opacity
    let event: OverlayEvent | null = null

    for (const orbit of orbits) {
      drawOrbit(orbit)
      drawSatellite(orbit, orbit.start + (still ? 0 : (TAU * time) / orbit.period))
    }

    if (!still) {
      // Packets: fly out from HQ along each link with a fading tail, then ping on landing.
      const phases = offsets.map((offset) => (time / LINK_CYCLE + offset) % 1)
      ends.forEach((end, i) => {
        const phase = phases[i]
        if (phase < IN_FLIGHT) {
          const head = easeInOut(phase / IN_FLIGHT)
          const tail = Array.from({ length: 11 }, (_, k) =>
            toView(
              arcPoint(hq, end, arcHeight, Math.max(0, head - 0.2 * (1 - k / 10))),
              phi,
              theta,
            ),
          )
          for (let k = 1; k < tail.length; k++) {
            if (hidden(tail[k - 1]) || hidden(tail[k])) continue
            segment(tail[k - 1], tail[k], `rgba(${RED}, ${(0.85 * k) / 10})`, 0.5 + (1.5 * k) / 10)
          }
          if (!hidden(tail[10])) glowDot(tail[10], 2.2, `rgb(${RED})`)
        } else if (phase < IN_FLIGHT + PINGING) {
          ping(toView(onSurface(end), phi, theta), (phase - IN_FLIGHT) / PINGING)
        }
        if (lastPhases && lastPhases[i] < IN_FLIGHT && phase >= IN_FLIGHT) event = { link: i }
      })
      lastPhases = phases

      // Uplink: a satellite in front of the globe beams a pulse down to HQ, which pings.
      const round = Math.floor(time / UPLINK_EVERY)
      const progress = (time % UPLINK_EVERY) / UPLINK_TIME
      const base = toView(onSurface(hq), phi, theta)
      if (round !== lastUplink) {
        lastUplink = round
        // Take turns, skipping any satellite that's currently behind the globe.
        uplinkSat =
          orbits
            .map((_, k) => (round + k) % orbits.length)
            .find((k) => satelliteAt(k, time)[2] >= 0) ?? -1
        if (uplinkSat >= 0 && base[2] >= 0) event ??= { satellite: uplinkSat }
      }
      const sat = uplinkSat >= 0 ? satelliteAt(uplinkSat, time) : null
      if (sat && progress < 1 && sat[2] >= 0 && base[2] >= 0) {
        const fade = Math.sin(Math.PI * progress)
        const beam = ctx.createLinearGradient(...toPx(sat), ...toPx(base))
        beam.addColorStop(0, `rgba(255, 255, 255, ${0.75 * fade})`)
        beam.addColorStop(1, `rgba(${RED}, ${0.9 * fade})`)
        segment(sat, base, `rgba(${RED}, ${0.12 * fade})`, 5) // soft glow around the beam
        segment(sat, base, beam, 1.2)
        if (progress < 0.7) {
          const k = easeInOut(progress / 0.7)
          const pulse: Vec3 = [0, 1, 2].map((i) => sat[i] + (base[i] - sat[i]) * k) as Vec3
          glowDot(pulse, 2.4, `rgb(${RED})`)
        } else {
          ping(base, (progress - 0.7) / 0.3)
        }
      }
    }

    ctx.globalAlpha = 1
    return event
  }
}
