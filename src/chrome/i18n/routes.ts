import type { Locale } from './types'

/**
 * Each locale has its own URL, so switching language is a navigation rather
 * than a client-side swap. That keeps every page's canonical and hreflang
 * tags true, and lets search engines index all three versions.
 */
export const localeHome: Record<Locale, string> = {
  pl: '/',
  en: '/en/',
}

export const localeLabel: Record<Locale, string> = {
  pl: 'PL',
  en: 'EN',
}
