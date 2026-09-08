import { useLenis } from '../hooks/useLenis'
import { useReveal } from '../v2/useReveal'
import { PleatedHero } from './PleatedHero'
import { NavV3 } from './sections/NavV3'
import { MetricsBand } from './sections/MetricsBand'
import { Showcase } from './sections/Showcase'
import { ServicesV3 } from './sections/ServicesV3'
import { ProcessV3 } from './sections/ProcessV3'
import { AboutV3 } from './sections/AboutV3'
import { PricingV3 } from './sections/PricingV3'
import { TrustV3 } from './sections/TrustV3'
import { FaqV3 } from './sections/FaqV3'
import { ContactV3 } from './sections/ContactV3'
import { FooterV3 } from './sections/FooterV3'
import { MobileStickyCtaV3 } from './sections/MobileStickyCtaV3'

export function AppV3() {
  useLenis()
  useReveal()

  return (
    <div className="v3-root relative min-h-screen overflow-x-hidden">
      <NavV3 />
      <main>
        <PleatedHero />
        <MetricsBand />
        <Showcase />
        <ServicesV3 />
        <ProcessV3 />
        <AboutV3 />
        <PricingV3 />
        <TrustV3 />
        <FaqV3 />
        <ContactV3 />
      </main>
      <FooterV3 />
      <MobileStickyCtaV3 />
      <div className="film-grain pointer-events-none fixed inset-0 z-[55]" aria-hidden />
    </div>
  )
}
