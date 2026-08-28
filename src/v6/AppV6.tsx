import { useLenis } from '../hooks/useLenis'
import { useV6Motion } from './useV6Motion'
import { NavV6 } from './sections/NavV6'
import { HeroV6 } from './sections/HeroV6'
import { ProofV6 } from './sections/ProofV6'
import { WorkV6 } from './sections/WorkV6'
import { OfferV6 } from './sections/OfferV6'
import { PackagesV6 } from './sections/PackagesV6'
import { TrustV6 } from './sections/TrustV6'
import { FaqV6 } from './sections/FaqV6'
import { ContactV6 } from './sections/ContactV6'
import { FooterV6 } from './sections/FooterV6'
import { MobileStickyCtaV6 } from './sections/MobileStickyCtaV6'
import { PixelSparkles } from './PixelSparkles'

export function AppV6() {
  useLenis()
  useV6Motion()

  return (
    <div className="v6-root">
      <PixelSparkles />
      <div className="v6-scanlines" aria-hidden />
      <NavV6 />
      <main>
        <HeroV6 />
        <ProofV6 />
        <WorkV6 />
        <OfferV6 />
        <PackagesV6 />
        <TrustV6 />
        <FaqV6 />
        <ContactV6 />
      </main>
      <FooterV6 />
      <MobileStickyCtaV6 />
    </div>
  )
}
