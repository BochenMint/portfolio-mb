export const LOCALES = ['pl', 'en', 'ua'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'pl'

export const LOCALE_STORAGE_KEY = 'mb-locale'

/** URL/UI locale `ua` maps to BCP 47 language `uk`. Never use `lang="ua"`. */
export const localeMeta: Record<
  Locale,
  { htmlLang: string; ogLocale: string; hreflang: string; label: string; dir: 'ltr'; prefix: string }
> = {
  pl: { htmlLang: 'pl', ogLocale: 'pl_PL', hreflang: 'pl', label: 'PL', dir: 'ltr', prefix: '' },
  en: { htmlLang: 'en', ogLocale: 'en_US', hreflang: 'en', label: 'EN', dir: 'ltr', prefix: 'en' },
  ua: { htmlLang: 'uk', ogLocale: 'uk_UA', hreflang: 'uk', label: 'UA', dir: 'ltr', prefix: 'ua' },
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'pl' || value === 'en' || value === 'ua'
}
