import { LocaleProvider, useMbAiCopy } from '../i18n'
import { NavMbAi } from './sections/NavMbAi'
import { HeroMbAi } from './sections/HeroMbAi'
import { ProofStripMbAi } from './sections/ProofStripMbAi'
import { HowItWorksMbAi } from './sections/HowItWorksMbAi'
import { ContactMbAi } from './sections/ContactMbAi'
import { FooterMbAi } from './sections/FooterMbAi'

function SkipMbAi() {
  const copy = useMbAiCopy()
  return (
    <a className="mbai-skip" href="#top">
      {copy.skipToContent}
    </a>
  )
}

export function AppMbAi() {
  return (
    <LocaleProvider>
      <div className="mbai-root relative min-h-screen overflow-x-hidden">
        <SkipMbAi />
        <NavMbAi />
        <main>
          <HeroMbAi />
          <ProofStripMbAi />
          <HowItWorksMbAi />
          <ContactMbAi />
        </main>
        <FooterMbAi />
        <div className="film-grain pointer-events-none fixed inset-0 z-[55]" aria-hidden />
      </div>
    </LocaleProvider>
  )
}
