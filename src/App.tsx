import { About } from './components/About'
import { Contact } from './components/Contact'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { ProjectStories } from './components/ProjectStories'
import { Work } from './components/Work'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { useLenis } from './hooks/useLenis'
import { useScrollAnimations } from './hooks/useScrollAnimations'

function SectionWipe() {
  return (
    <div
      data-section-wipe
      className="section-wipe pointer-events-none h-px w-full bg-accent"
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
      <div
        data-progress-bar
        className="scroll-progress fixed top-0 left-0 z-[60] h-[3px] w-full origin-left bg-accent"
        aria-hidden
      />
      <div className="film-grain pointer-events-none fixed inset-0 z-[55]" aria-hidden />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:text-[var(--color-on-accent)]"
      >
        Przejdź do treści
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <SectionWipe />
        <Work />
        <SectionWipe />
        <ProjectStories />
        <SectionWipe />
        <About />
        <Contact />
      </main>
    </>
  )
}

export default App
