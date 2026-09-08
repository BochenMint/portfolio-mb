import { LanguageSwitcher } from './LanguageSwitcher'
import { LocaleProvider } from './context'
import { useLocale } from './hooks'
import { getArchiveUi } from './archive-ui'
import './switcher.css'
import type { ReactNode } from 'react'

export function ArchiveRoot({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>
}

export function ArchiveLang({ className = '' }: { className?: string }) {
  const { locale } = useLocale()
  const ui = getArchiveUi(locale)
  return <LanguageSwitcher locale={locale} ariaLabel={ui.langAria} className={className} />
}
