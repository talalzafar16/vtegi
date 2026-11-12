import { Search } from 'lucide-react'

import { buttonStyles } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Store search: a plain GET form to /store/search, so it works without JavaScript. */
export function SearchBox({
  defaultValue,
  className,
}: {
  defaultValue?: string
  className?: string
}) {
  return (
    <form
      action="/store/search"
      role="search"
      className={cn('flex w-full max-w-2xl gap-2', className)}
    >
      <label htmlFor="store-search" className="sr-only">
        Search the store
      </label>
      <div className="relative flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-400"
        />
        <input
          id="store-search"
          name="q"
          type="search"
          required
          minLength={2}
          maxLength={100}
          defaultValue={defaultValue}
          placeholder="Search products, brands or part numbers"
          className="h-13 w-full rounded-md border border-ink-300 bg-white pr-4 pl-12 text-[15px] text-ink-900 shadow-xs placeholder:text-ink-400 focus-visible:border-brand-600 focus-visible:ring-3 focus-visible:ring-brand-600/15 focus-visible:outline-none on-dark:border-white/15 on-dark:bg-white/[0.06] on-dark:text-white"
        />
      </div>
      <button type="submit" className={buttonStyles({ size: 'lg' })}>
        Search
      </button>
    </form>
  )
}
