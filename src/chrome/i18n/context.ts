import { createContext, useContext } from 'react'
import type { LocalizedContent } from '../../data/i18n'
import type { ChromeCopy, Locale } from './types'

export type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: ChromeCopy
  content: LocalizedContent
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider')
  return ctx
}
