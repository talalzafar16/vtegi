import { Section } from '@/components/ui/section'

const bar = 'animate-pulse rounded bg-ink-100 on-dark:bg-white/5'

/** Shown while the distributor loads the product (the first visit can take a few seconds). */
export default function ProductLoading() {
  return (
    <Section className="py-12 md:py-16">
      <div role="status" aria-label="Loading product">
        <div className={`${bar} h-4 w-48`} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-14">
          <div>
            <div className={`${bar} h-3 w-24`} />
            <div className={`${bar} mt-5 h-8 w-full`} />
            <div className={`${bar} mt-3 h-8 w-2/3`} />
            <div className={`${bar} mt-5 h-4 w-40`} />
            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`${bar} h-4`} />
              ))}
            </div>
          </div>
          <div className={`${bar} h-[32rem] rounded-xl`} />
        </div>
      </div>
    </Section>
  )
}
