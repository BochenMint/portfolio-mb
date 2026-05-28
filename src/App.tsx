import { About } from './components/About'
import { CaseStudies } from './components/CaseStudies'
import { Contact } from './components/Contact'
import { FAQ } from './components/FAQ'
import { Hero } from './components/Hero'
import { LiveSitesRibbon } from './components/LiveSitesRibbon'
import { Nav } from './components/Nav'
import { Process } from './components/Process'
import { ScrollProgress } from './components/ScrollProgress'
import { Services } from './components/Services'
import { StickyCTA } from './components/StickyCTA'
import { Testimonials } from './components/Testimonials'
import { Work } from './components/Work'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { useLenis } from './hooks/useLenis'
import { useScrollAnimations } from './hooks/useScrollAnimations'

function PageCurtain() {
  return (
    <div
      data-curtain
      className="bg-paper pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden
    />
  )
}

function App() {
  useLenis()
  useScrollAnimations()
  useKeyboardNav()

  return (
    <>
      <PageCurtain />
      <div className="page-enter">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10003] focus:bg-accent focus:px-4 focus:py-2 focus:text-paper"
        >
          Przejdź do treści
        </a>
        <p className="sr-only">
          Skróty klawiaturowe: Alt + strzałka w górę/dół lub j/k — przechodzenie między sekcjami.
        </p>
        <ScrollProgress />
        <Nav />
        <main id="main" className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
          <Hero />
          <About />
          <Work />
          <LiveSitesRibbon />
          <CaseStudies />
          <Services />
          <Process />
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
