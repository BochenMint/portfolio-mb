import { useCallback, useEffect, useState } from 'react'
import { useLenis } from '../hooks/useLenis'
import { Band } from './components/Band'
import { CaseStudies } from './components/CaseStudies'
import { Contact } from './components/Contact'
import { Cursor } from './components/Cursor'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { Pricing } from './components/Pricing'
import { Process } from './components/Process'
import { Services } from './components/Services'
import { Testimonials } from './components/Testimonials'
import { Work } from './components/Work'
import { useChromeReflection } from './hooks/useChromeReflection'
import { useIntro } from './hooks/useIntro'
import { useLocale } from './i18n/context'
import { LocaleProvider } from './i18n/LocaleProvider'
import { ThemeProvider } from './theme/ThemeProvider'

const metaDescription = {
  pl: 'Marcin Bochenek — inżynieria produktów cyfrowych. Mint Apartments, Plumm, iDrive Cars, Agentic OS. Booking, FinTech, AI ops. Projekty od 25 000 PLN.',
  en: 'Marcin Bochenek — digital product engineering. Mint Apartments, Plumm, iDrive Cars, Agentic OS. Booking, FinTech, AI ops. Projects from PLN 25,000.',
}

function DocumentMeta() {
  const { locale, t } = useLocale()

  useEffect(() => {
    document.title = `${t.brand} — ${t.tagline}`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', metaDescription[locale])
  }, [locale, t])

  return null
}

function AppShell() {
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])
  const { t } = useLocale()

  useLenis()
  useChromeReflection()
  useIntro(ready)

  return (
    <>
      <DocumentMeta />
      {!ready && <Preloader onComplete={onLoaded} />}
      <div className={`grain transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10003] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
        >
          {t.skipLink}
        </a>
        <div
          data-progress-bar
          aria-hidden
          className="fixed top-0 right-0 left-0 z-[60] h-px origin-left scale-x-0 bg-gradient-to-r from-white/20 via-white to-white/20"
        />
        <Cursor />
        <Nav />
        <main id="main">
          <Hero />
          <Band />
          <Work />
          <CaseStudies />
          <Services />
          <Process />
          <Pricing />
          <Testimonials />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AppShell />
      </LocaleProvider>
    </ThemeProvider>
  )
}
