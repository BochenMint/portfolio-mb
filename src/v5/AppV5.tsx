import { useRef } from 'react'
import { useLenis } from '../hooks/useLenis'
import { useVoltMotion } from './useVoltMotion'
import { NavV5 } from './sections/NavV5'
import { HeroV5 } from './sections/HeroV5'
import { CostLedgerV5 } from './sections/CostLedgerV5'
import { WorkSlabsV5 } from './sections/WorkSlabsV5'
import { OfferFieldsV5 } from './sections/OfferFieldsV5'
import { PackagesV5 } from './sections/PackagesV5'
import { ProofV5 } from './sections/ProofV5'
import { ContactV5 } from './sections/ContactV5'
import { FooterV5 } from './sections/FooterV5'
import { MobileStickyCtaV5 } from './sections/MobileStickyCtaV5'

export function AppV5() {
  useLenis()
  useVoltMotion()
  const rootRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={rootRef} className="volt-root">
      <div className="volt-bg-morph" aria-hidden />
      <NavV5 />
      <main>
        <HeroV5 />
        <CostLedgerV5 />
        <WorkSlabsV5 />
        <OfferFieldsV5 />
        <PackagesV5 />
        <ProofV5 />
        <ContactV5 />
      </main>
      <FooterV5 />
      <MobileStickyCtaV5 />
    </div>
  )
}
