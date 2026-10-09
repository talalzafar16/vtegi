import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

type LogoProps = {
  /** "color" uses the red wordmark (light backgrounds); "light" uses white text (dark backgrounds). */
  tone?: 'color' | 'light'
  className?: string
}

const textWordmark =
  'text-2xl leading-none font-extrabold tracking-tight text-white font-stretch-expanded'

export function Logo({ tone = 'color', className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="VTEGI home"
      className={cn('inline-flex shrink-0 items-center gap-2.5', className)}
    >
      <Image
        src="/brand/vtegi-mark.png"
        alt=""
        width={40}
        height={39}
        priority
        className="h-9 w-auto"
      />
      {tone === 'color' ? (
        <>
          {/* The red gradient wordmark fades into dark backgrounds, so dark mode uses white text. */}
          <Image
            src="/brand/vtegi-wordmark.png"
            alt=""
            width={133}
            height={24}
            priority
            className="h-6 w-auto dark:hidden"
          />
          <span className={cn(textWordmark, 'hidden dark:inline')}>VTEGI</span>
        </>
      ) : (
        <span className={textWordmark}>VTEGI</span>
      )}
    </Link>
  )
}
