/**
 * Backwards-compatible re-export of the Polish chrome copy. Components
 * should prefer `useLocale().t`, which switches between `copy.pl.ts` and
 * `copy.en.ts`; this export exists for anything still importing the static
 * default (and mirrors the previous `chromeCopy` shape/name).
 */
export { copyPl as chromeCopy } from './i18n/copy.pl'
