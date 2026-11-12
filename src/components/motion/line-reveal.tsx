import type { CSSProperties, ReactNode } from 'react'

type LineRevealProps = {
  lines: ReactNode[]
  delay?: number
}

/** Slides each line up from behind a mask; CSS-only, so it animates as soon as the page paints. */
export function LineReveal({ lines, delay = 0.1 }: LineRevealProps) {
  return lines.map((line, i) => (
    <span key={i} className="block overflow-hidden pb-[0.1em]">
      <span
        className="block animate-line-up motion-reduce:animate-none"
        style={{ animationDelay: `${delay + i * 0.12}s` } as CSSProperties}
      >
        {line}
      </span>
    </span>
  ))
}
