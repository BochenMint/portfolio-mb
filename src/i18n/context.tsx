import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { getLocalizedContent, type LocalizedContent } from './content'
import { LOCALES, localeMeta, type Locale } from './locales'
import { getMbAiCopy, type MbAiCopy } from './mb-ai'
import {
  SITE_ORIGIN,
  absoluteUrl,
  archiveFileFromPath,
  archivePath,
  localeFromWindow,
} from './path'
import { getStudioUi, type StudioChrome } from './studio-ui'

export type LocaleContextValue = {
  locale: Locale
  content: LocalizedContent
  ui: StudioChrome
  mbAi: MbAiCopy
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = localeFromWindow()
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      content: getLocalizedContent(locale),
      ui: getStudioUi(locale),
      mbAi: getMbAiCopy(locale),
    }),
    [locale],
  )

  useEffect(() => {
    const meta = localeMeta[locale]
    document.documentElement.lang = meta.htmlLang
    document.documentElement.dir = meta.dir
    document.documentElement.dataset.locale = locale

    const file = archiveFileFromPath(window.location.pathname)
    if (!file) return
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', absoluteUrl(SITE_ORIGIN, archivePath(locale, file)))
    for (const item of LOCALES) {
      const link = document.querySelector(`link[rel="alternate"][hreflang="${localeMeta[item].hreflang}"]`)
      if (link) link.setAttribute('href', absoluteUrl(SITE_ORIGIN, archivePath(item, file)))
    }
  }, [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale outside LocaleProvider')
  return ctx
}

export function useContent(): LocalizedContent {
  return useLocale().content
}

export function useStudioUi(): StudioChrome {
  return useLocale().ui
}

export function useMbAiCopy(): MbAiCopy {
  return useLocale().mbAi
}

/** Chrome string for the URL locale. Safe outside React; URL wins. */
export function t<K extends keyof StudioChrome>(key: K): StudioChrome[K] {
  return getStudioUi(localeFromWindow())[key]
}
