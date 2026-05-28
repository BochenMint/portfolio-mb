import { About } from './components/About'
import { CaseStudies } from './components/CaseStudies'
import { Contact } from './components/Contact'
import { FAQ } from './components/FAQ'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Process } from './components/Process'
import { ScrollProgress } from './components/ScrollProgress'
import { Services } from './components/Services'
import { StickyCTA } from './components/StickyCTA'
import { Testimonials } from './components/Testimonials'
import { Work } from './components/Work'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { useReveal } from './hooks/useReveal'
import { useScrollProgress } from './hooks/useScrollProgress'

function App() {
  useReveal()
  useScrollProgress()
  useKeyboardNav()

  return (
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
      <main id="main">
        <Hero />
        <About />
        <Work />
        <CaseStudies />
        <Services />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <StickyCTA />
    </div>
  )
}

export default App
