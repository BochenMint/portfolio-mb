import { useCallback, useState } from 'react'
import { CaseStudies } from './components/CaseStudies'
import { Contact } from './components/Contact'
import { CustomCursor } from './components/CustomCursor'
import { FAQ } from './components/FAQ'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { Pricing } from './components/Pricing'
import { Process } from './components/Process'
import { ProofBar } from './components/ProofBar'
import { ResultsStrip } from './components/ResultsStrip'
import { ScrollProgress } from './components/ScrollProgress'
import { Services } from './components/Services'
import { StickyCTA } from './components/StickyCTA'
import { Testimonials } from './components/Testimonials'
import { Work } from './components/Work'
import { useIntroAnimations } from './hooks/useIntroAnimations'
import { useLenis } from './hooks/useLenis'

function App() {
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])

  useLenis()
  useIntroAnimations(ready)

  return (
    <>
      {!ready && <Preloader onComplete={onLoaded} />}
      <div
        className={`noise transition-opacity duration-700 ${ready ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10003] focus:rounded-lg focus:bg-mint focus:px-4 focus:py-2 focus:text-ink"
        >
          Przejdź do treści
        </a>
        <ScrollProgress />
        <CustomCursor />
        <Nav />
        <main id="main">
          <Hero />
          <ProofBar />
          <Marquee />
          <ResultsStrip />
          <Work />
          <CaseStudies />
          <Services />
          <Process />
          <Pricing />
          <Testimonials />
          <FAQ />
          <Contact />
        </main>
        <StickyCTA />
      </div>
    </>
  )
}

export default App
