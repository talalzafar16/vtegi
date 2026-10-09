'use client'

import { useEffect } from 'react'

import { Button, ButtonLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography'

type ErrorPageProps = { error: Error & { digest?: string }; reset: () => void }

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Section className="py-24 md:py-32">
      <Eyebrow>Something went wrong</Eyebrow>
      <Heading as="h1" size="xl" className="mt-5 max-w-3xl">
        We hit an unexpected problem loading this page.
      </Heading>
      <Lead className="mt-6 max-w-2xl">
        Please try again. If it keeps happening, contact us and we&apos;ll sort it out.
      </Lead>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <ButtonLink href="/contact" variant="outline" size="lg">
          Contact us
        </ButtonLink>
      </div>
    </Section>
  )
}
