import type { Locale } from './types'

/** A translatable string bag. Polish and English are always present; other
 *  locales are optional so a new language can ship page by page. */
export type Bag = { pl: string; en: string } & Partial<Record<Locale, string>>

/**
 * Resolves a bag for a locale, falling back to English rather than showing an
 * empty string. Ukrainian screenshot captions and fact labels are still being
 * translated, so the fallback is load-bearing, not defensive dead code.
 */
export function pick(bag: Bag, locale: Locale): string {
  return bag[locale] ?? bag.en
}
