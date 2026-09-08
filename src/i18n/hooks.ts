import { useContext } from 'react'
import { getStudioUi, type StudioChrome } from './studio-ui'
import type { LocalizedContent } from './content'
import type { MbAiCopy } from './mb-ai'
import { LocaleContext, type LocaleContextValue } from './locale-context'
import { localeFromWindow } from './path'

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
