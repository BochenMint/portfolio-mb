import { useEffect, useState } from 'react'
import { editions, type Edition } from './editions'

type Locale = 'pl' | 'en'

const copy = {
  pl: {
    back: 'Wróć na stronę główną',
    eyebrow: 'Archiwum',
    title: 'Osiem podejść do tej samej strony.',
    lead: 'Każda edycja została zbudowana od zera i przez jakiś czas była wersją produkcyjną. Zostawiam je pod adresami, bo droga do bieżącego wyglądu jest częścią odpowiedzi na pytanie, co potrafię.',
    open: 'Otwórz',
    current: 'Bieżąca',
    note: 'Starsze edycje są wyłączone z indeksowania i nie są już rozwijane. Działają, ale ich nie poprawiam.',
  },
  en: {
    back: 'Back to the homepage',
    eyebrow: 'Archive',
    title: 'Eight takes on the same page.',
    lead: 'Every edition was built from scratch and was the production site for a while. They stay online because the route to the current design is part of the answer to what I can build.',
    open: 'Open',
    current: 'Current',
    note: 'Older editions are excluded from indexing and no longer maintained. They work; they are not being improved.',
  },
} as const

function useLocale(): [Locale, (l: Locale) => void] {
  const [locale, setLocale] = useState<Locale>('pl')
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('mb-locale')
      if (stored === 'en' || stored === 'pl') setLocale(stored)
    } catch {
      // storage blocked — Polish stays the default
    }
  }, [])
  const update = (next: Locale) => {
    setLocale(next)
    try {
      window.localStorage.setItem('mb-locale', next)
    } catch {
      // nothing to persist to; the choice still applies for this visit
    }
  }
  return [locale, update]
}

function EditionRow({ edition, locale, t }: { edition: Edition; locale: Locale; t: (typeof copy)[Locale] }) {
  return (
    <li>
      <a
        href={edition.href}
        className="group flex border-t border-line flex-col gap-2 py-7 transition-colors md:flex-row md:items-baseline md:gap-8"
      >
        <span className="flex min-w-[13rem] items-baseline gap-3">
          <span className="font-display text-xl font-semibold text-white">{edition.name}</span>
          {edition.current && (
            <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
              {t.current}
            </span>
          )}
        </span>
        <span className="flex-1 text-[15px] leading-relaxed text-silver-2">
          {edition.note[locale]}
        </span>
        <span className="font-mono text-[11px] tracking-[0.12em] whitespace-nowrap text-muted uppercase">
          {edition.period}
        </span>
      </a>
    </li>
  )
}

export default function Lab() {
  const [locale, setLocale] = useLocale()
  const t = copy[locale]
  const featured = editions.filter((e) => e.featured)
  const rest = editions.filter((e) => !e.featured)

  useEffect(() => {
    document.documentElement.lang = locale
    document.title =
      locale === 'pl'
        ? 'Archiwum wersji — Marcin Bochenek'
        : 'Edition archive — Marcin Bochenek'
  }, [locale])

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16 md:px-10 md:py-24">
      <div className="flex items-center justify-between gap-4">
        <a
          href="/"
          className="ghost-btn px-4 py-2 text-[13px]"
          aria-label={t.back}
        >
          ← {t.back}
        </a>
        <div className="ghost-btn flex items-center gap-0.5 !px-1 !py-1" role="group">
          {(['pl', 'en'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={locale === value}
              onClick={() => setLocale(value)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] transition-colors ${
                locale === value ? 'bg-white text-ink' : 'text-silver-2 hover:text-white'
              }`}
            >
              {value.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <p className="eyebrow mt-14">{t.eyebrow}</p>
      <h1 className="mt-5 max-w-[16ch] text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.04] font-semibold text-white">
        {t.title}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-silver-2 md:text-lg">{t.lead}</p>

      {featured.map((edition) => (
        <a
          key={edition.href}
          href={edition.href}
          data-chrome
          className="chrome-card r-card mt-14 flex flex-col gap-4 p-8 md:p-10"
        >
          <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
            {edition.period}
          </span>
          <span className="font-display text-3xl font-semibold text-white md:text-4xl">
            {edition.name}
          </span>
          <span className="max-w-2xl text-[15px] leading-relaxed text-silver-2 md:text-base">
            {edition.note[locale]}
          </span>
          <span className="mt-2 font-mono text-[11px] tracking-[0.14em] text-white uppercase">
            {t.open} →
          </span>
        </a>
      ))}

      <ul className="mt-12 flex flex-col">
        {rest.map((edition) => (
          <EditionRow key={edition.href} edition={edition} locale={locale} t={t} />
        ))}
      </ul>

      <p className="mt-14 border-t border-line pt-7 text-[13px] leading-relaxed text-muted">{t.note}</p>
    </main>
  )
}
