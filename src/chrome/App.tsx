import { useCallback, useEffect, useState } from 'react'
import { useLenis } from '../hooks/useLenis'
import { Band } from './components/Band'
import { CaseStudies } from './components/CaseStudies'
import { Contact } from './components/Contact'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { Pricing } from './components/Pricing'
import { Process } from './components/Process'
import { Services } from './components/Services'
import { Testimonials } from './components/Testimonials'
import { UnderHood } from './components/UnderHood'
import { Work } from './components/Work'
import { useChromeReflection } from './hooks/useChromeReflection'
import { useIntro } from './hooks/useIntro'
import { useLocale } from './i18n/context'
import { LocaleProvider } from './i18n/LocaleProvider'
import type { Locale } from './i18n/types'
import { ThemeProvider } from './theme/ThemeProvider'

const metaDescription: Record<Locale, string> = {
  pl: 'Marcin Bochenek — inżynieria produktów cyfrowych. Mint Apartments, Plumm, iDrive Cars, Agentic OS. Booking, FinTech, AI ops. Strony od 2 000 PLN, systemy od 8 000 PLN.',
  en: 'Marcin Bochenek — digital product engineering. Mint Apartments, Plumm, iDrive Cars, Agentic OS. Booking, FinTech, AI ops. Websites from PLN 2,000, systems from PLN 8,000.',
  uk: 'Marcin Bochenek — інженерія цифрових продуктів. Mint Apartments, Plumm, iDrive Cars, Agentic OS. Booking, FinTech, AI ops. Сайти від 2 000 PLN, системи від 8 000 PLN.',
}

/**
 * Each locale has its own entry HTML now, so the title and description in the
 * document head are already the right ones — and they are better than anything
 * built from `brand — tagline`, because they are written for search results.
 * Overwriting them from JS also hid them from crawlers and link unfurlers that
 * never run scripts. Kept only as the fallback for a locale switch that
 * somehow happens without a navigation.
 */
function DocumentMeta() {
  const { locale } = useLocale()

  useEffect(() => {
    if (document.documentElement.dataset.locale === locale) return
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', metaDescription[locale])
  }, [locale])

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
        <Nav />
        <main id="main">
          <Hero />
          <UnderHood />
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
