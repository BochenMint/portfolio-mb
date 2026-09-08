/**
 * Hook for the SEO-articles agent. Do not put article bodies here.
 *
 * Crawlable URL contract (must stay in sync with Caddy + sitemap):
 *   PL  /artykuly/              /artykuly/{slug}/
 *   EN  /en/articles/           /en/articles/{slug}/
 *   UA  /ua/statti/             /ua/statti/{slug}/
 *   (BCP 47 language remains `uk`; URL prefix and UI flag are `ua`.)
 *
 * Locale lives in the path. Do not use `?lang=` as the only mechanism.
 * Caddy tries files first under those prefixes and 404s until HTML exists —
 * it must not rewrite article URLs onto the homepage.
 */
export {
  ARTICLE_INDEX,
  articleIndexPath,
  articlePath,
  localeFromArticlePath,
} from './path'
export type { Locale } from './locales'
