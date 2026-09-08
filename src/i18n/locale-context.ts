import { createContext } from 'react'
import type { LocalizedContent } from './content'
import type { Locale } from './locales'
import type { MbAiCopy } from './mb-ai'
import type { StudioChrome } from './studio-ui'

export type LocaleContextValue = {
  locale: Locale
  content: LocalizedContent
  ui: StudioChrome
  mbAi: MbAiCopy
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
