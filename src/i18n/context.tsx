import { useEffect, useMemo, type ReactNode } from 'react'
import { getLocalizedContent } from './content'
import { LOCALES, localeMeta } from './locales'
import { getMbAiCopy } from './mb-ai'
import { LocaleContext, type LocaleContextValue } from './locale-context'
import {
  SITE_ORIGIN,
  absoluteUrl,
  archiveFileFromPath,
  archivePath,
  localeFromWindow,
} from './path'
import { getStudioUi } from './studio-ui'

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
