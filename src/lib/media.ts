import type { Media } from '@/payload-types'

/** Upload fields are either an ID or a populated doc; returns the doc when populated. */
export function asMedia(value: number | Media | null | undefined): Media | null {
  return value && typeof value === 'object' ? value : null
}
