import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge our custom font sizes so `text-display` isn't mistaken for a color.
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ['display', 'title'] } },
})

/** Merge class names, letting later Tailwind classes override earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Label for a stored option value, e.g. "full-time" → "Full-time". */
export const labelOf = (
  options: readonly { label: string; value: string }[],
  value?: string | null,
) => options.find((o) => o.value === value)?.label
