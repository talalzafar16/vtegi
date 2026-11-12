import { Phone } from 'lucide-react'

import { ButtonLink, buttonStyles } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/typography'
import { telHref } from '@/lib/navigation'
import type { HomePage } from '@/payload-types'

type ExpertCtaProps = HomePage['expert'] & { phone: string }

export function ExpertCta({ heading, text, phone }: ExpertCtaProps) {
  return (
    <section data-tone="dark" className="relative overflow-hidden bg-brand-900 text-white">
      {/* Deep oxblood: logo red glowing in from the left, fading to near black, under the grid. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,var(--color-brand-700),transparent_65%),linear-gradient(to_right,transparent_40%,var(--color-brand-950))]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_right,black,transparent_80%)]"
      />
      <Container className="relative flex flex-col gap-8 py-16 md:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <Heading size="lg">{heading}</Heading>
          <p className="mt-3 text-lg text-brand-100/90">{text}</p>
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
