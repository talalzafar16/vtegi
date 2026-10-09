import type { SiteSetting } from '@/payload-types'

/** Short credential labels, e.g. "HUBZone Certified" and "ISO 9001 · 20000-1 · 27001 certified". */
export function credentialLabels(settings: SiteSetting) {
  const socioeconomic = (settings.socioeconomic ?? []).map((s) => s.label.replace(/\s*\(.*\)$/, ''))
  const isoNumbers = (settings.certifications ?? [])
    .filter((c) => c.name.startsWith('ISO'))
    .map((c) => c.name.replace(/^ISO(\/IEC)?\s*/, '').replace(/:\d{4}$/, ''))
  const iso = isoNumbers.length ? `ISO ${isoNumbers.join(' · ')} certified` : ''
  return { socioeconomic, iso, all: [...socioeconomic, iso].filter(Boolean) }
}
