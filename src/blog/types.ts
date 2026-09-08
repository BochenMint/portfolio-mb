export type ArticleIntent = 'informational' | 'commercial' | 'transactional'

export type ArticleLocaleCode = 'pl' | 'en' | 'uk'

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'note'; text: string }

export type ArticleSection = {
  h2: string
  blocks: ArticleBlock[]
}

export type ArticleFaq = {
  q: string
  a: string
}

export type ArticleLocale = {
  title: string
  description: string
  h1: string
  kicker: string
  lead: string
  sections: ArticleSection[]
  faqs: ArticleFaq[]
  ctaTitle: string
  ctaBody: string
  ctaLabel: string
}

export type ArticleRelated = {
  slug: string
  anchor: Record<ArticleLocaleCode, string>
}

export type ArticleDoc = {
  slug: string
  keyword: string
  keywordEn: string
  keywordUk: string
  intent: ArticleIntent
  cluster: string
  published: string
  modified: string
  related: ArticleRelated[]
  offer: { href: string; anchor: Record<ArticleLocaleCode, string> }[]
  pl: ArticleLocale
  en: ArticleLocale
  uk: ArticleLocale
}

/** Hub paths: UA URL prefix is `/ua/`; key `uk` is BCP 47 language for article bodies. */
export const JOURNAL_INDEX = {
  pl: { path: '/artykuly/', label: 'Artykuły' },
  en: { path: '/en/articles/', label: 'Journal' },
  uk: { path: '/ua/statti/', label: 'Статті' },
} as const

export const JOURNAL_ARTICLE = {
  pl: (slug: string) => `/artykuly/${slug}/`,
  en: (slug: string) => `/en/articles/${slug}/`,
  uk: (slug: string) => `/ua/statti/${slug}/`,
} as const
