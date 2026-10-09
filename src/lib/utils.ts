import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge our custom theme values (globals.css), so overrides like
// `max-w-3xl` replace `max-w-site` and `text-display` isn't mistaken for a color.
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ['display', 'title'], container: ['site'] } },
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
