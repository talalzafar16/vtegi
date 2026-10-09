import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { ButtonLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography'
import { getSolutions } from '@/lib/cms'
import { requestHref } from '@/lib/navigation'

export default async function NotFound() {
  const solutions = await getSolutions()

  return (
    <Section className="py-24 md:py-32">
      <Eyebrow>Error 404</Eyebrow>
      <Heading as="h1" size="display" className="mt-5 max-w-3xl">
        This page took a different route.
      </Heading>
      <Lead className="mt-6 max-w-2xl">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Try one of our solutions
        below, or tell us what you need.
      </Lead>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/" size="lg">
          Back to home
        </ButtonLink>
        <ButtonLink href={requestHref()} variant="outline" size="lg">
          Start a Request
        </ButtonLink>
      </div>
      <ul className="mt-16 grid gap-x-8 gap-y-3 border-t border-zinc-200 pt-8 sm:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution) => (
          <li key={solution.id}>
            <Link
              href={`/solutions/${solution.slug}`}
              className="group inline-flex items-center gap-2 font-medium hover:text-brand-700"
            >
              {solution.title}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
