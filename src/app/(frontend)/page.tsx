import { AgenciesSection } from '@/components/home/agencies-section'
import { CapabilitiesSection } from '@/components/home/capabilities-section'
import { ExpertCta } from '@/components/home/expert-cta'
import { Hero } from '@/components/home/hero'
import { PartnersSection } from '@/components/home/partners-section'
import { SolutionsSection } from '@/components/home/solutions-section'
import { WhySection } from '@/components/home/why-section'
import { RequestSection } from '@/features/request-form/request-section'
import {
  getCapabilities,
  getFeaturedPartners,
  getHomePage,
  getSiteSettings,
  getSolutions,
} from '@/lib/cms'
import { credentialLabels } from '@/lib/credentials'

export default async function HomePage() {
  const [home, settings, solutions, capabilities, partners] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getSolutions(),
    getCapabilities(),
    getFeaturedPartners(),
  ])
  const credentials = credentialLabels(settings)

  return (
    <>
      <Hero
        content={home.hero}
        trust={[...credentials.socioeconomic.slice(0, 2), credentials.iso].filter(Boolean)}
      />
      <SolutionsSection {...home.solutions} solutions={solutions} />
      <RequestSection {...home.process} solutions={solutions} />
      <ExpertCta {...home.expert} phone={settings.phone} />
      <CapabilitiesSection heading={home.capabilities.heading} capabilities={capabilities} />
      <WhySection {...home.why} credentials={credentials.all} />
      {settings.showAgencies && settings.agencies?.length ? (
        <AgenciesSection agencies={settings.agencies} />
      ) : null}
      <PartnersSection heading={home.partners.heading} partners={partners} />
    </>
  )
}
