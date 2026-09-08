import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getContent } from '../data/i18n'
import { LocaleContext } from './context'
import { copyEn } from './copy.en'
import { copyPl } from './copy.pl'
import type { ChromeCopy, Locale } from './types'

const STORAGE_KEY = 'mb-locale'

const copyByLocale: Record<Locale, ChromeCopy> = {
  pl: copyPl,
  en: copyEn,
}

function isLocale(value: string | null): value is Locale {
  return value === 'pl' || value === 'en'
}

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'pl'

  // The URL decides the language, and the entry HTML declares it. Anything
  // else — a stored preference, the browser's language — would let /en/ serve
  // Polish, which makes the page's own hreflang and canonical tags a lie.
  const declared = document.documentElement.dataset.locale
  if (isLocale(declared ?? null)) return declared as Locale

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // localStorage unavailable (private mode, blocked storage) — fall through.
  }

  const nav = window.navigator?.language ?? ''
  return nav.toLowerCase().startsWith('pl') ? 'pl' : 'en'
}


export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale())

  useEffect(() => {
    document.documentElement.lang = locale
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // Best-effort persistence only.
    }
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: copyByLocale[locale],
      content: getContent(locale),
    }),
    [locale, setLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
