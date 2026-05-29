import { useCallback, useEffect, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { FeaturedWork } from './components/FeaturedWork'
import { FooterCta } from './components/FooterCta'
import { Hero } from './components/Hero'
import { IntroCurtain } from './components/IntroCurtain'
import { Nav } from './components/Nav'
import { Services } from './components/Services'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { useLenis } from './hooks/useLenis'
import { useScrollAnimations } from './hooks/useScrollAnimations'

function SectionWipe() {
  return (
    <div
      data-section-wipe
      className="section-wipe pointer-events-none h-px w-full bg-[var(--color-paper)]/20"
      aria-hidden
    />
  )
}

function ChapterBreak({ label }: { label: string }) {
  return (
    <div
      className="chapter-break pointer-events-none flex min-h-[14vh] items-end border-t border-[var(--color-paper)]/12 px-6 pb-6 md:min-h-[18vh] md:px-10 md:pb-8 lg:px-16"
      aria-hidden
    >
      <span className="font-headline text-[clamp(3rem,14vw,10rem)] leading-none text-[var(--color-paper)]/[0.06]">
        {label}
      </span>
    </div>
  )
}

const INTRO_MAX_MS = 1500

function App() {
  const [introDone, setIntroDone] = useState(false)
  const completeIntro = useCallback(() => {
    setIntroDone((done) => (done ? done : true))
  }, [])

  useEffect(() => {
    const failSafe = window.setTimeout(completeIntro, INTRO_MAX_MS)
    return () => window.clearTimeout(failSafe)
  }, [completeIntro])

  useLenis()
  useScrollAnimations(introDone)
  useKeyboardNav()

  return (
    <>
      {!introDone ? <IntroCurtain onComplete={completeIntro} /> : null}

      <div
        data-progress-bar
        className="scroll-progress fixed top-0 left-0 z-[60] h-[2px] w-full origin-left bg-[var(--color-paper)]"
        aria-hidden
      />
      <div className="film-grain pointer-events-none fixed inset-0 z-[55]" aria-hidden />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--color-paper)] focus:px-4 focus:py-2 focus:font-medium focus:text-[var(--color-ink)]"
      >
        Przejdź do treści
      </a>
      <Nav />
      <main id="main" className="bg-[var(--color-ink)] text-[var(--color-paper)]">
        <Hero />
        <SectionWipe />
        <ChapterBreak label="01" />
        <About />
        <SectionWipe />
        <ChapterBreak label="02" />
        <Services />
        <SectionWipe />
        <ChapterBreak label="03" />
        <FeaturedWork />
        <SectionWipe />
        <ChapterBreak label="04" />
        <Contact />
        <FooterCta />
      </main>
    </>
  )
}

export default App
