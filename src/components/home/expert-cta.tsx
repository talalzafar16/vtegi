import { Phone } from 'lucide-react'

import { ButtonLink, buttonStyles } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/typography'
import { telHref } from '@/lib/navigation'
import type { HomePage } from '@/payload-types'

type ExpertCtaProps = HomePage['expert'] & { phone: string }

/** "Not sure which solution is right for you?" band from Terry's brief. */
export function ExpertCta({ heading, text, phone }: ExpertCtaProps) {
  return (
    <section data-tone="dark" className="bg-brand-700 text-white">
      <Container className="flex flex-col gap-8 py-14 md:py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <Heading size="lg">{heading}</Heading>
          <p className="mt-3 text-lg text-brand-100">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#request" variant="secondary" size="lg">
            Talk to an Expert
          </ButtonLink>
          <a href={telHref(phone)} className={buttonStyles({ variant: 'outline', size: 'lg' })}>
            <Phone aria-hidden className="size-4" /> Call {phone}
          </a>
        </div>
      </Container>
    </section>
  )
}
