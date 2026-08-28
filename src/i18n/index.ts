export type { Locale } from './locales'
export { DEFAULT_LOCALE, LOCALES, LOCALE_STORAGE_KEY, isLocale, localeMeta } from './locales'
export {
  ARTICLE_INDEX,
  MBAI_ORIGIN,
  SITE_ORIGIN,
  absoluteUrl,
  articleIndexPath,
  articlePath,
  homePath,
  hreflangEntries,
  localeFromArticlePath,
  localeFromPath,
  localeFromWindow,
  persistLocaleChoice,
  surfaceFromPath,
  switchHref,
  switchPath,
  archiveFileFromPath,
  archivePath,
  ARCHIVE_FILES,
} from './path'
export { getLocalizedContent } from './content'
export type { LocalizedContent } from './content'
export { getStudioUi, tChrome } from './studio-ui'
export type { StudioChrome } from './studio-ui'
export { getMbAiCopy } from './mb-ai'
export type { MbAiCopy } from './mb-ai'
export { LocaleProvider, t, useContent, useLocale, useMbAiCopy, useStudioUi } from './context'
export { LanguageSwitcher } from './LanguageSwitcher'
export { ArchiveLang, ArchiveRoot } from './archive-root'
export { getArchiveUi } from './archive-ui'
export type { ArchiveChrome } from './archive-ui'
export {
  ARTICLE_INDEX as articleRoutes,
  articleIndexPath as articlesIndex,
  articlePath as articlesPost,
} from './articles'
