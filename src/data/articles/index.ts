import type { ArticleIntent } from '../../blog/types'
import { JOURNAL_ARTICLE, JOURNAL_INDEX } from '../../blog/types'

export { JOURNAL_ARTICLE, JOURNAL_INDEX }

export type ArticleManifestItem = {
  slug: string
  keyword: string
  intent: ArticleIntent
  cluster: string
  published: string
}

/** Hub-and-spoke plan: one commercial pillar, four spoke clusters around money pages. */
export const articleManifest: ArticleManifestItem[] = [
  {
    slug: 'strona-firmowa-b2b',
    keyword: 'strona firmowa B2B',
    intent: 'commercial',
    cluster: 'strony',
    published: '2026-08-24',
  },
  {
    slug: 'ile-kosztuje-strona-firmowa',
    keyword: 'ile kosztuje strona firmowa',
    intent: 'commercial',
    cluster: 'strony',
    published: '2026-08-24',
  },
  {
    slug: 'strona-wizytowka-czy-lejek',
    keyword: 'strona wizytówka czy sprzedażowa',
    intent: 'commercial',
    cluster: 'strony',
    published: '2026-08-24',
  },
  {
    slug: 'dlaczego-strona-nie-sprzedaje',
    keyword: 'dlaczego strona nie sprzedaje',
    intent: 'informational',
    cluster: 'strony',
    published: '2026-08-24',
  },
  {
    slug: 'lejek-konwersji-na-stronie',
    keyword: 'lejek konwersji',
    intent: 'commercial',
    cluster: 'strony',
    published: '2026-08-24',
  },
  {
    slug: 'rezerwacje-na-wlasnej-stronie',
    keyword: 'rezerwacje na własnej stronie',
    intent: 'commercial',
    cluster: 'strony',
    published: '2026-08-24',
  },
  {
    slug: 'panel-operacyjny-zamiast-excela',
    keyword: 'panel operacyjny zamiast Excela',
    intent: 'commercial',
    cluster: 'ops',
    published: '2026-08-24',
  },
  {
    slug: 'saas-czy-wlasny-panel',
    keyword: 'gotowy system vs dedykowany panel',
    intent: 'commercial',
    cluster: 'ops',
    published: '2026-08-24',
  },
  {
    slug: 'ksiegowosc-online-zamiast-excela',
    keyword: 'księgowość online zamiast Excela',
    intent: 'informational',
    cluster: 'ops',
    published: '2026-08-24',
  },
  {
    slug: 'wdrozyc-chatgpt-w-firmie',
    keyword: 'wdrożyć ChatGPT w firmie',
    intent: 'commercial',
    cluster: 'hitl',
    published: '2026-08-24',
  },
  {
    slug: 'automatyzacja-z-kontrola-czlowieka',
    keyword: 'automatyzacja z kontrolą człowieka',
    intent: 'informational',
    cluster: 'hitl',
    published: '2026-08-24',
  },
  {
    slug: 'audyt-strony-internetowej',
    keyword: 'audyt strony internetowej',
    intent: 'transactional',
    cluster: 'delivery',
    published: '2026-08-24',
  },
  {
    slug: 'wdrozenie-strony-internetowej',
    keyword: 'wdrożenie strony internetowej',
    intent: 'informational',
    cluster: 'delivery',
    published: '2026-08-24',
  },
  {
    slug: 'szybkosc-strony-a-seo',
    keyword: 'szybkość strony a SEO',
    intent: 'informational',
    cluster: 'delivery',
    published: '2026-08-24',
  },
]

export const articleSlugs = articleManifest.map((item) => item.slug)
