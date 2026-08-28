import { DEFAULT_LOCALE, isLocale, localeMeta, type Locale } from './locales'

/** Strip `/index.html` and trailing-only noise so Vite and Caddy paths match. */
export function normalizePathname(pathname: string): string {
  const trimmed = pathname.split('?')[0]?.split('#')[0] || '/'
  let p = trimmed.replace(/\/index\.html$/i, '')
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p || '/'
}

/**
 * URL wins. `localStorage` is never read for the first paint.
 * Preview files `/mb-ai-en.html` / `/mb-ai-ua.html` count as EN/UA for the AI landing.
 * Legacy `/uk/` and `/mb-ai-uk.html` still resolve to locale `ua`.
 */
export function localeFromPath(pathname: string): Locale {
  const p = normalizePathname(pathname)
  if (p.includes('mb-ai-en') || p === '/en' || p.startsWith('/en/')) return 'en'
  if (
    p.includes('mb-ai-ua') ||
    p.includes('mb-ai-uk') ||
    p === '/ua' ||
    p.startsWith('/ua/') ||
    p === '/uk' ||
    p.startsWith('/uk/')
  ) {
    return 'ua'
  }
  return DEFAULT_LOCALE
}

export function localeFromWindow(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  return localeFromPath(window.location.pathname)
}

/** Studio (and mb-ai.pl via Caddy) homepage per locale. Always trailing slash except PL root. */
export function homePath(locale: Locale): string {
  if (locale === 'pl') return '/'
  return `/${localeMeta[locale].prefix}/`
}

export const ARCHIVE_FILES = ['v1.html', 'v2.html', 'v3.html', 'v4.html', 'v5.html', 'v6.html'] as const
export type ArchiveFile = (typeof ARCHIVE_FILES)[number]

export function archiveFileFromPath(pathname: string): ArchiveFile | null {
  const p = normalizePathname(pathname)
  const match = p.match(/^\/(?:en\/|ua\/)?(v[1-6]\.html)$/)
  if (!match) return null
  const file = match[1] as ArchiveFile
  return ARCHIVE_FILES.includes(file) ? file : null
}

export function archivePath(locale: Locale, file: ArchiveFile): string {
  if (locale === 'pl') return `/${file}`
  return `/${localeMeta[locale].prefix}/${file}`
}

export type AppSurface = 'studio' | 'mb-ai' | 'archive'

export function surfaceFromPath(pathname: string): AppSurface {
  const p = normalizePathname(pathname)
  if (archiveFileFromPath(p)) return 'archive'
  if (p.includes('mb-ai')) return 'mb-ai'
  return 'studio'
}

/**
 * Language-switcher target. On apex preview (`/mb-ai.html`) keep file URLs so we
 * do not dump the user onto the studio EN/UA homepage.
 * On `mb-ai.pl` Caddy maps `/en/` → `mb-ai-en.html` and `/ua/` → `mb-ai-ua.html`.
 * Archive MPA files keep the visual version: `/v3.html` ↔ `/en/v3.html` ↔ `/ua/v3.html`.
 */
export function switchPath(target: Locale, pathname: string): string {
  const file = archiveFileFromPath(pathname)
  if (file) return archivePath(target, file)
  const surface = surfaceFromPath(pathname)
  if (surface === 'mb-ai') {
    if (target === 'en') return '/mb-ai-en.html'
    if (target === 'ua') return '/mb-ai-ua.html'
    return '/mb-ai.html'
  }
  return homePath(target)
}

export function switchHref(target: Locale, url: { pathname: string; search: string; hash: string }): string {
  return `${switchPath(target, url.pathname)}${url.search}${url.hash}`
}

/** Article URL contract — listing + post. Used by the articles agent; no pages here. */
export const ARTICLE_INDEX: Record<Locale, string> = {
  pl: '/artykuly/',
  en: '/en/articles/',
  ua: '/ua/statti/',
}

export function articleIndexPath(locale: Locale): string {
  return ARTICLE_INDEX[locale]
}

export function articlePath(locale: Locale, slug: string): string {
  const safe = slug.replace(/^\/+|\/+$/g, '')
  return `${ARTICLE_INDEX[locale]}${safe}/`
}

export function localeFromArticlePath(pathname: string): Locale | null {
  const p = normalizePathname(pathname)
  if (p === '/artykuly' || p.startsWith('/artykuly/')) return 'pl'
  if (p === '/en/articles' || p.startsWith('/en/articles/')) return 'en'
  if (p === '/ua/statti' || p.startsWith('/ua/statti/')) return 'ua'
  if (p === '/uk/statti' || p.startsWith('/uk/statti/')) return 'ua'
  return null
}

export function persistLocaleChoice(locale: Locale) {
  if (!isLocale(locale) || typeof window === 'undefined') return
  try {
    window.localStorage.setItem('mb-locale', locale)
  } catch {
    /* private mode */
  }
}

export const SITE_ORIGIN = 'https://marcinbochenek.com'
export const MBAI_ORIGIN = 'https://mb-ai.pl'

export function absoluteUrl(origin: string, path: string): string {
  const base = origin.replace(/\/$/, '')
  if (path === '/') return `${base}/`
  return `${base}${path}`
}

export function hreflangEntries(origin: string): { hreflang: string; href: string }[] {
  return [
    { hreflang: 'pl', href: absoluteUrl(origin, '/') },
    { hreflang: 'en', href: absoluteUrl(origin, '/en/') },
    { hreflang: 'uk', href: absoluteUrl(origin, '/ua/') },
    { hreflang: 'x-default', href: absoluteUrl(origin, '/') },
  ]
}
