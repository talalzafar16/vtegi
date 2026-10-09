import { Plus } from 'lucide-react'

type FaqItem = { id?: string | null; question: string; answer: string }

/** Question/answer list using native <details> (accessible, no JavaScript). */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-ink-200 border-y border-ink-200 on-dark:divide-white/10 on-dark:border-white/10">
      {items.map((item) => (
        <details key={item.id ?? item.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {item.question}
            <Plus
              aria-hidden
              className="size-5 shrink-0 text-brand-700 transition-transform group-open:rotate-45 on-dark:text-brand-400"
            />
          </summary>
          <p className="mt-3 max-w-3xl text-ink-600 on-dark:text-ink-400">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
