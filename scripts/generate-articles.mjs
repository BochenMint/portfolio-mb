import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { articleExpansions } from '../src/data/articles/_expansions.mjs'
import { faqsFor } from '../src/data/articles/_expand-faqs.mjs'
import { articleMeta } from '../src/data/articles/_meta.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const articlesDir = path.join(root, 'src', 'data', 'articles')
const publicDir = path.join(root, 'public')
const cssSrc = path.join(root, 'src', 'blog', 'blog.css')

const SITE = 'https://marcinbochenek.com'
const AUTHOR = 'Marcin Bochenek'
const EMAIL = 'kontakt@marcinbochenek.com'
const OG = `${SITE}/brand/og-default.png`
const LOGO = `${SITE}/brand/logo-mb.svg`
const PHOTO = `${SITE}/images/marcin-bochenek.webp`
const PUBLISHED_DEFAULT = '2026-08-24'

const LOCALES = {
  pl: {
    lang: 'pl',
    og: 'pl_PL',
    indexPath: '/artykuly/',
    articlePath: (slug) => `/artykuly/${slug}/`,
    indexLabel: 'Artykuły',
    homeLabel: 'Strona główna',
    crumbsHome: 'Start',
    related: 'Powiązane artykuły',
    offer: 'Oferta',
    faq: 'Pytania',
    updated: 'Aktualizacja',
    authorBy: 'Autor',
    localeName: 'PL',
    packages: 'Pakiety',
    contact: 'Kontakt',
    htmlLang: 'pl',
    skip: 'Przejdź do treści',
    langAria: 'Język',
  },
  en: {
    lang: 'en',
    og: 'en_US',
    indexPath: '/en/articles/',
    articlePath: (slug) => `/en/articles/${slug}/`,
    indexLabel: 'Journal',
    homeLabel: 'Home',
    crumbsHome: 'Home',
    related: 'Related articles',
    offer: 'Services',
    faq: 'Questions',
    updated: 'Updated',
    authorBy: 'Author',
    localeName: 'EN',
    packages: 'Packages',
    contact: 'Contact',
    htmlLang: 'en',
    skip: 'Skip to content',
    langAria: 'Language',
  },
  uk: {
    lang: 'uk',
    og: 'uk_UA',
    indexPath: '/ua/statti/',
    articlePath: (slug) => `/ua/statti/${slug}/`,
    indexLabel: 'Статті',
    homeLabel: 'Головна',
    crumbsHome: 'Головна',
    related: 'Пов’язані статті',
    offer: 'Пропозиція',
    faq: 'Питання',
    updated: 'Оновлення',
    authorBy: 'Автор',
    localeName: 'UA',
    packages: 'Пакети',
    contact: 'Контакт',
    htmlLang: 'uk',
    skip: 'Перейти до змісту',
    langAria: 'Мова',
  },
}

const HOME_HREF = { pl: '/', en: '/en/', uk: '/ua/' }

function uiFlag(code) {
  if (code === 'uk') return 'UA'
  return String(code).toUpperCase()
}

function loadDotEnv() {
  const envPath = path.join(root, '.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (process.env[key] == null) process.env[key] = value
  }
}

function normalizeCalendlyUrl(raw) {
  const url = (raw || '').trim()
  if (!url) return ''
  try {
    const { hostname, pathname } = new URL(url)
    const isSchedulerHost =
      hostname === 'cal.com' ||
      hostname === 'www.cal.com' ||
      hostname === 'calendly.com' ||
      hostname === 'www.calendly.com'
    if (!isSchedulerHost) return url
    const bareRoot = pathname === '/' || pathname === ''
    if (bareRoot) return ''
    if (/\/(twoj-link|your-user)(\/|$)/i.test(pathname)) return ''
    return url
  } catch {
    return ''
  }
}

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function escAttr(value) {
  return esc(value).replaceAll("'", '&#39;')
}

function countWords(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean).length
}

function charLen(text) {
  return [...text].length
}

function lastSentenceEnd(text) {
  let last = -1
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch !== '.' && ch !== '?' && ch !== '!') continue
    const next = text[i + 1]
    if (next == null || next === ' ') last = i
  }
  return last
}

/** Keep author-written meta intact when it is already a complete blurb. Google truncates; mid-sentence HTML does not. */
function fitChars(text, min, max) {
  const raw = String(text || '')
    .trim()
    .replace(/\s+/g, ' ')
  const len = charLen(raw)
  const hardMax = Math.max(max, 220)
  if (len <= hardMax && /[.!?]$/.test(raw)) return raw
  if (len <= max) return raw
  const slice = [...raw].slice(0, hardMax).join('')
  const end = lastSentenceEnd(slice)
  if (end >= Math.min(min, 80)) return slice.slice(0, end + 1).trim()
  let cut = [...raw].slice(0, max).join('')
  const breakAt = Math.max(cut.lastIndexOf(' — '), cut.lastIndexOf(', '), cut.lastIndexOf(' '))
  if (breakAt > 40) cut = cut.slice(0, breakAt)
  cut = cut.replace(/[\s,;:—.–-]+$/u, '')
  cut = cut.replace(/\s+(?:a|an|the|and|or|of|to|for|with|when|vs|i|w|z|na|do|oraz|а|і|в|з|на|до)$/iu, '').trim()
  if (!/[.!?]$/.test(cut)) cut += '.'
  return cut
}

function stripMd(text) {
  return String(text || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
}

function contactHref(locale, calendly) {
  if (calendly) return calendly
  return `${HOME_HREF[locale]}#kontakt`
}

function rewriteHref(href, locale) {
  const prefixes = {
    pl: '/artykuly/',
    en: '/en/articles/',
    uk: '/ua/statti/',
  }
  let out = href
  if (out.startsWith('/artykuly/')) out = prefixes[locale] + out.slice('/artykuly/'.length)
  if (out.startsWith('/uk/statti/')) out = prefixes[locale] + out.slice('/uk/statti/'.length)
  if (out.startsWith('/#') || out === '/') {
    if (locale === 'en') out = `/en${out === '/' ? '/' : out}`
    if (locale === 'uk') out = `/ua${out === '/' ? '/' : out}`
  }
  return out
}

function inlineLinks(text, locale) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const resolved = rewriteHref(href, locale)
    const external = /^https?:\/\//.test(resolved)
    const rel = external ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${escAttr(resolved)}"${rel}>${esc(label)}</a>`
  })
}

function renderBlocks(blocks, locale) {
  return blocks
    .map((block) => {
      if (block.type === 'p') return `<p>${inlineLinks(block.text, locale)}</p>`
      if (block.type === 'h3') return `<h3>${esc(block.text)}</h3>`
      if (block.type === 'ul') {
        return `<ul>${block.items.map((item) => `<li>${inlineLinks(item, locale)}</li>`).join('')}</ul>`
      }
      if (block.type === 'ol') {
        return `<ol>${block.items.map((item) => `<li>${inlineLinks(item, locale)}</li>`).join('')}</ol>`
      }
      if (block.type === 'note') return `<aside class="j-note">${inlineLinks(block.text, locale)}</aside>`
      if (block.type === 'table') {
        const head = `<tr>${block.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>`
        const body = block.rows
          .map((row) => `<tr>${row.map((cell) => `<td>${inlineLinks(cell, locale)}</td>`).join('')}</tr>`)
          .join('')
        return `<div class="j-table-wrap"><table>${head}${body}</table></div>`
      }
      throw new Error(`Unknown block type: ${block.type}`)
    })
    .join('\n')
}

function localeBodyText(loc) {
  const parts = [loc.h1, loc.lead]
  for (const section of loc.sections) {
    parts.push(section.h2)
    for (const block of section.blocks) {
      if (block.type === 'p' || block.type === 'h3' || block.type === 'note') parts.push(block.text)
      if (block.type === 'ul' || block.type === 'ol') parts.push(block.items.join(' '))
      if (block.type === 'table') {
        parts.push(block.headers.join(' '))
        parts.push(block.rows.flat().join(' '))
      }
    }
  }
  for (const faq of loc.faqs) parts.push(faq.q, faq.a)
  parts.push(loc.ctaTitle, loc.ctaBody)
  return parts.join(' ')
}

function hreflangTags(slug) {
  const pl = `${SITE}${LOCALES.pl.articlePath(slug)}`
  const en = `${SITE}${LOCALES.en.articlePath(slug)}`
  const uk = `${SITE}${LOCALES.uk.articlePath(slug)}`
  return [
    `<link rel="alternate" hreflang="pl" href="${pl}" />`,
    `<link rel="alternate" hreflang="en" href="${en}" />`,
    `<link rel="alternate" hreflang="uk" href="${uk}" />`,
    `<link rel="alternate" hreflang="x-default" href="${pl}" />`,
  ].join('\n    ')
}

function hreflangIndexTags() {
  const pl = `${SITE}${LOCALES.pl.indexPath}`
  const en = `${SITE}${LOCALES.en.indexPath}`
  const uk = `${SITE}${LOCALES.uk.indexPath}`
  return [
    `<link rel="alternate" hreflang="pl" href="${pl}" />`,
    `<link rel="alternate" hreflang="en" href="${en}" />`,
    `<link rel="alternate" hreflang="uk" href="${uk}" />`,
    `<link rel="alternate" hreflang="x-default" href="${pl}" />`,
  ].join('\n    ')
}

function personJsonLd() {
  return {
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: AUTHOR,
    url: `${SITE}/`,
    email: EMAIL,
    jobTitle: 'Software engineer',
    image: PHOTO,
    sameAs: ['https://github.com/BochenMint'],
  }
}

function articleJsonLd(doc, locale, loc, canonical, wordCount) {
  const faqEntities = loc.faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') },
  }))
  return [
    {
      '@context': 'https://schema.org',
      '@type': ['Article', 'BlogPosting'],
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      headline: loc.title,
      description: loc.description,
      inLanguage: LOCALES[locale].htmlLang,
      datePublished: doc.published || PUBLISHED_DEFAULT,
      dateModified: doc.modified || doc.published || PUBLISHED_DEFAULT,
      wordCount,
      image: [OG],
      author: personJsonLd(),
      publisher: {
        '@type': 'Organization',
        name: AUTHOR,
        url: `${SITE}/`,
        logo: { '@type': 'ImageObject', url: LOGO },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: LOCALES[locale].homeLabel, item: `${SITE}${HOME_HREF[locale]}` },
        { '@type': 'ListItem', position: 2, name: LOCALES[locale].indexLabel, item: `${SITE}${LOCALES[locale].indexPath}` },
        { '@type': 'ListItem', position: 3, name: loc.h1, item: canonical },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqEntities,
    },
  ]
}

function shell({ lang, ogLocale, title, description, canonical, hreflang, extraHead, body, ogType = 'article' }) {
  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${escAttr(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escAttr(canonical)}" />
    ${hreflang}
    <meta property="og:type" content="${escAttr(ogType)}" />
    <meta property="og:title" content="${escAttr(title)}" />
    <meta property="og:description" content="${escAttr(description)}" />
    <meta property="og:url" content="${escAttr(canonical)}" />
    <meta property="og:locale" content="${ogLocale}" />
${['pl_PL', 'en_US', 'uk_UA']
  .filter((og) => og !== ogLocale)
  .map((og) => `    <meta property="og:locale:alternate" content="${og}" />`)
  .join('\n')}
    <meta property="og:image" content="${OG}" />
    <meta property="og:site_name" content="${AUTHOR}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escAttr(title)}" />
    <meta name="twitter:description" content="${escAttr(description)}" />
    <meta name="twitter:image" content="${OG}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/journal.css" />
    ${extraHead}
  </head>
  <body>
    ${body}
  </body>
</html>
`
}

function localeSwitcher(locale, slug) {
  const items = [
    ['pl', slug ? LOCALES.pl.articlePath(slug) : LOCALES.pl.indexPath, 'PL'],
    ['en', slug ? LOCALES.en.articlePath(slug) : LOCALES.en.indexPath, 'EN'],
    ['uk', slug ? LOCALES.uk.articlePath(slug) : LOCALES.uk.indexPath, 'UA'],
  ]
  return items
    .map(([code, href, label]) => {
      const current = code === locale ? ' aria-current="page"' : ''
      const htmlLang = code === 'uk' ? 'uk' : code
      return `<a href="${href}"${current} lang="${htmlLang}" hreflang="${htmlLang}">${label}</a>`
    })
    .join('')
}

function header(locale, ctaHref, slug) {
  const L = LOCALES[locale]
  return `<a class="j-skip" href="#content">${esc(L.skip)}</a>
    <header class="j-header">
      <a class="j-mark" href="${HOME_HREF[locale]}">MB<span>${AUTHOR}</span></a>
      <nav class="j-nav" aria-label="${escAttr(L.indexLabel)}">
        <a href="${L.indexPath}">${esc(L.indexLabel)}</a>
        <a href="${HOME_HREF[locale]}#cennik">${esc(L.packages)}</a>
        <a href="${escAttr(ctaHref)}">${esc(L.contact)}</a>
      </nav>
      <nav class="j-locales" aria-label="${escAttr(L.langAria)}">${localeSwitcher(locale, slug)}</nav>
    </header>`
}

function footer(locale) {
  const L = LOCALES[locale]
  return `<footer class="j-footer">
      <p>${AUTHOR}</p>
      <div>
        <a href="mailto:${EMAIL}">${EMAIL}</a>
        ·
        <a href="${L.indexPath}">${esc(L.indexLabel)}</a>
        ·
        <a href="${HOME_HREF[locale]}">${esc(L.homeLabel)}</a>
      </div>
    </footer>`
}

function articleLocaleSwitcher(doc, locale) {
  return localeSwitcher(locale, doc.slug)
}

function renderArticle(doc, locale, ctaHref) {
  const L = LOCALES[locale]
  const loc = doc[locale]
  const canonical = `${SITE}${L.articlePath(doc.slug)}`
  const bodyText = localeBodyText(loc)
  const words = countWords(bodyText)
  const titleLen = charLen(loc.title)
  const descLen = charLen(loc.description)
  const issues = []
  if (locale === 'pl' && (words < 1400 || words > 2400)) issues.push(`PL words ${words} (want 1400–2200)`)
  if (locale === 'en' && words < 1200) issues.push(`en words ${words} (want complete, not abridged)`)
  if (locale === 'uk' && words < 1400) issues.push(`UA words ${words} (want 1400+, expert not abridged)`)
  if (titleLen < 45 || titleLen > 70) issues.push(`${locale} title ${titleLen} chars: "${loc.title}"`)
  if (descLen < 120 || descLen > 220) issues.push(`${locale} description ${descLen} chars`)
  if (!/[.!?]$/.test(loc.description)) {
    issues.push(`${locale} description chopped mid-sentence: "…${loc.description.slice(-48)}"`)
  }

  const sectionsHtml = loc.sections
    .map((section) => `<h2>${esc(section.h2)}</h2>\n${renderBlocks(section.blocks, locale)}`)
    .join('\n')

  const faqHtml = loc.faqs
    .map(
      (item) =>
        `<details><summary>${esc(item.q)}</summary><p>${inlineLinks(item.a, locale)}</p></details>`,
    )
    .join('\n')

  const relatedHtml = doc.related
    .map((item) => {
      const href = L.articlePath(item.slug)
      return `<li><a href="${href}">${esc(item.anchor[locale])}</a></li>`
    })
    .join('')

  const offerHtml = doc.offer
    .map((item) => {
      const href = rewriteHref(item.href, locale)
      return `<li><a href="${escAttr(href)}">${esc(item.anchor[locale])}</a></li>`
    })
    .join('')

  const jsonLd = articleJsonLd(doc, locale, loc, canonical, words)
  const extraHead = jsonLd
    .map((node) => `<script type="application/ld+json">${JSON.stringify(node)}</script>`)
    .join('\n    ')

  const modified = doc.modified || doc.published || PUBLISHED_DEFAULT
  const body = `${header(locale, ctaHref, doc.slug)}
    <main class="j-main" id="content">
      <nav class="j-crumbs" aria-label="Breadcrumb">
        <ol>
          <li><a href="${HOME_HREF[locale]}">${esc(L.crumbsHome)}</a></li>
          <li><a href="${L.indexPath}">${esc(L.indexLabel)}</a></li>
          <li>${esc(loc.h1)}</li>
        </ol>
      </nav>
      <article class="j-article">
        <p class="j-kicker">${esc(loc.kicker)}</p>
        <h1>${esc(loc.h1)}</h1>
        <p class="j-meta">${esc(L.authorBy)}: ${AUTHOR} · ${esc(L.updated)}: <time datetime="${modified}">${modified}</time></p>
        <p class="j-lead">${inlineLinks(loc.lead, locale)}</p>
        ${sectionsHtml}
        <section class="j-faq" aria-labelledby="faq-title">
          <h2 id="faq-title">${esc(L.faq)}</h2>
          ${faqHtml}
        </section>
        <section class="j-cta">
          <h2>${esc(loc.ctaTitle)}</h2>
          <p>${inlineLinks(loc.ctaBody, locale)}</p>
          <a href="${escAttr(ctaHref)}"${/^https?:\/\//.test(ctaHref) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(loc.ctaLabel)}</a>
        </section>
        <section class="j-related">
          <h2>${esc(L.related)}</h2>
          <ul>${relatedHtml}</ul>
          <h3>${esc(L.offer)}</h3>
          <ul>${offerHtml}</ul>
        </section>
      </article>
    </main>
    <div class="j-header" style="border:0;padding-bottom:0">
      <nav class="j-locales" aria-label="${escAttr(L.langAria)}">${articleLocaleSwitcher(doc, locale)}</nav>
    </div>
    ${footer(locale)}`

  const html = shell({
    lang: L.htmlLang,
    ogLocale: L.og,
    title: loc.title,
    description: loc.description,
    canonical,
    hreflang: hreflangTags(doc.slug),
    extraHead,
    body,
  })

  return { html, words, titleLen, descLen, issues, canonical }
}

function renderIndex(docs, locale, ctaHref) {
  const L = LOCALES[locale]
  const canonical = `${SITE}${L.indexPath}`
  const titles = {
    pl: {
      title: 'Eksperckie artykuły o stronach i systemach w firmie',
      description:
        'Artykuły Marcina Bochenka: strona firmowa B2B, lejek konwersji, wycena, panel zamiast Excela i AI z kontrolą człowieka. Czytaj i umów 20-min audyt.',
      h1: 'Artykuły: strony, lejki, panele, HITL',
      lead: 'Piszę z pierwszej osoby o tym, co wdrażam: strony firmowe, lejki konwersji, panele operacyjne i automatyzację z kontrolą człowieka. Bez fałszywych opinii i bez case’ów, których nie da się kliknąć.',
    },
    en: {
      title: 'Expert journal on B2B websites, funnels and HITL AI',
      description:
        'Journal by Marcin Bochenek: B2B websites, conversion funnels, pricing, ops panels instead of Excel, HITL AI. Read, then book a 20-minute audit.',
      h1: 'Journal: sites, funnels, panels, HITL',
      lead: 'First-person notes on work I actually ship: company websites, conversion funnels, operations panels, and automation with a human in the loop. No invented reviews. Live proof is Mint Apartments and Plumm.',
    },
    uk: {
      title: 'Експертні статті про сайти, воронки, панелі і HITL',
      description:
        'Статті Марціна Бохенека про корпоративні сайти B2B, воронки, ціни, операційні панелі замість Excel і ШІ HITL. Читайте й запишіться на 20-хв аудит.',
      h1: 'Статті: сайти, воронки, панелі, HITL',
      lead: 'Пишу від першої особи про те, що впроваджую: корпоративні сайти, воронки конверсії, операційні панелі та автоматизацію з контролем людини. Без вигаданих відгуків. Живі докази — Mint Apartments і Plumm.',
    },
  }
  const copy = {
    title: fitChars(titles[locale].title, 50, 60),
    description: fitChars(titles[locale].description, 140, 160),
    h1: titles[locale].h1,
    lead: titles[locale].lead,
  }
  const items = docs
    .map((doc) => {
      const loc = doc[locale]
      return `<li>
          <a href="${L.articlePath(doc.slug)}">
            <h2>${esc(loc.h1)}</h2>
            <p>${esc(stripMd(loc.lead).slice(0, 180))}${stripMd(loc.lead).length > 180 ? '…' : ''}</p>
          </a>
        </li>`
    })
    .join('\n')

  const listLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy.h1,
    inLanguage: L.htmlLang,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: AUTHOR, url: SITE },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: docs.map((doc, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}${L.articlePath(doc.slug)}`,
        name: doc[locale].h1,
      })),
    },
  }
  const extraHead = `<script type="application/ld+json">${JSON.stringify(listLd)}</script>`
  const body = `${header(locale, ctaHref)}
    <main class="j-main" id="content">
      <p class="j-kicker">${AUTHOR}</p>
      <h1>${esc(copy.h1)}</h1>
      <p class="j-lead">${esc(copy.lead)}</p>
      <ul class="j-index">${items}</ul>
    </main>
    ${footer(locale)}`

  for (const key of ['title', 'description']) {
    const len = charLen(copy[key])
    if (key === 'title' && (len < 45 || len > 70)) {
      console.warn(`Index ${locale} title ${len} chars`)
    }
    if (key === 'description' && (len < 120 || len > 220 || !/[.!?]$/.test(copy[key]))) {
      console.warn(`Index ${locale} description ${len} chars chopped=${!/[.!?]$/.test(copy[key])}`)
    }
  }

  return shell({
    lang: L.htmlLang,
    ogLocale: L.og,
    title: copy.title,
    description: copy.description,
    canonical,
    hreflang: hreflangIndexTags(),
    extraHead,
    body,
    ogType: 'website',
  })
}

function xhtmlLinks(slug) {
  const pl = `${SITE}${LOCALES.pl.articlePath(slug)}`
  const en = `${SITE}${LOCALES.en.articlePath(slug)}`
  const uk = `${SITE}${LOCALES.uk.articlePath(slug)}`
  return [
    `    <xhtml:link rel="alternate" hreflang="pl" href="${pl}" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
    `    <xhtml:link rel="alternate" hreflang="uk" href="${uk}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pl}" />`,
  ].join('\n')
}

function indexXhtmlLinks() {
  const pl = `${SITE}${LOCALES.pl.indexPath}`
  const en = `${SITE}${LOCALES.en.indexPath}`
  const uk = `${SITE}${LOCALES.uk.indexPath}`
  return [
    `    <xhtml:link rel="alternate" hreflang="pl" href="${pl}" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
    `    <xhtml:link rel="alternate" hreflang="uk" href="${uk}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pl}" />`,
  ].join('\n')
}

function homeXhtmlLinks() {
  const pl = `${SITE}/`
  const en = `${SITE}/en/`
  const uk = `${SITE}/ua/`
  return [
    `    <xhtml:link rel="alternate" hreflang="pl" href="${pl}" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
    `    <xhtml:link rel="alternate" hreflang="uk" href="${uk}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pl}" />`,
  ].join('\n')
}

function mbaiXhtmlLinks() {
  const pl = 'https://mb-ai.pl/'
  const en = 'https://mb-ai.pl/en/'
  const uk = 'https://mb-ai.pl/ua/'
  return [
    `    <xhtml:link rel="alternate" hreflang="pl" href="${pl}" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
    `    <xhtml:link rel="alternate" hreflang="uk" href="${uk}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pl}" />`,
  ].join('\n')
}

function xhtmlForKeptLoc(loc) {
  if (loc === `${SITE}/` || loc === `${SITE}/en/` || loc === `${SITE}/ua/`) return homeXhtmlLinks()
  if (loc === 'https://mb-ai.pl/' || loc === 'https://mb-ai.pl/en/' || loc === 'https://mb-ai.pl/ua/') {
    return mbaiXhtmlLinks()
  }
  return ''
}

function patchSitemap(docs) {
  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  const original = fs.readFileSync(sitemapPath, 'utf8')
  const locRe = /<loc>([^<]+)<\/loc>/g
  const kept = []
  const seen = new Set()
  let match
  while ((match = locRe.exec(original))) {
    const loc = match[1]
    if (loc.includes('/artykuly') || loc.includes('/articles/') || loc.includes('/statti/')) continue
    if (seen.has(loc)) continue
    seen.add(loc)
    kept.push(loc)
  }

  const lastmod = PUBLISHED_DEFAULT
  const blocks = []
  for (const loc of kept) {
    const links = xhtmlForKeptLoc(loc)
    const extra = links ? `\n${links}` : ''
    blocks.push(`  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>${extra}\n  </url>`)
  }

  const indexLocs = [
    [LOCALES.pl.indexPath, indexXhtmlLinks()],
    [LOCALES.en.indexPath, indexXhtmlLinks()],
    [LOCALES.uk.indexPath, indexXhtmlLinks()],
  ]
  for (const [p, links] of indexLocs) {
    blocks.push(`  <url>\n    <loc>${SITE}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n${links}\n  </url>`)
  }
  for (const doc of docs) {
    for (const locale of ['pl', 'en', 'uk']) {
      const loc = `${SITE}${LOCALES[locale].articlePath(doc.slug)}`
      blocks.push(`  <url>\n    <loc>${loc}</loc>\n    <lastmod>${doc.modified || lastmod}</lastmod>\n${xhtmlLinks(doc.slug)}\n  </url>`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join('\n')}
</urlset>
`
  fs.writeFileSync(sitemapPath, xml)
}

function writeFile(rel, contents) {
  const full = path.join(publicDir, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, contents)
}

async function loadArticles() {
  const files = fs
    .readdirSync(articlesDir)
    .filter((name) => (name.endsWith('.json') || name.endsWith('.mjs')) && !name.startsWith('_'))
    .sort()
  if (files.length < 12 || files.length > 16) {
    throw new Error(`Expected 12–16 article files, found ${files.length}`)
  }
  const docs = []
  for (const name of files) {
    const full = path.join(articlesDir, name)
    let doc
    if (name.endsWith('.json')) {
      doc = JSON.parse(fs.readFileSync(full, 'utf8'))
    } else {
      const mod = await import(pathToFileURL(full).href)
      doc = mod.default
    }
    const slugFromFile = name.replace(/\.(json|mjs)$/, '')
    if (doc.slug !== slugFromFile) {
      throw new Error(`Slug mismatch in ${name}: ${doc.slug}`)
    }
    docs.push(applyArticleExtras(doc))
  }
  return docs
}

function applyArticleExtras(doc) {
  const meta = articleMeta[doc.slug]
  if (meta) {
    for (const locale of ['pl', 'en', 'uk']) {
      const patch = meta[locale]
      if (!patch) continue
      if (patch.title) doc[locale].title = patch.title
      if (patch.description) doc[locale].description = patch.description
    }
  }
  for (const locale of ['pl', 'en', 'uk']) {
    doc[locale].description = fitChars(doc[locale].description, 140, 160)
  }
  const extra = articleExpansions[doc.slug]
  if (extra) {
    for (const locale of ['pl', 'en', 'uk']) {
      if (Array.isArray(extra[locale]) && extra[locale].length) {
        doc[locale].sections = [...doc[locale].sections, ...extra[locale]]
      }
    }
  }
  for (const locale of ['pl', 'en', 'uk']) {
    const moreFaqs = faqsFor(doc.slug, locale)
    if (moreFaqs.length) doc[locale].faqs = [...doc[locale].faqs, ...moreFaqs]
  }
  return doc
}

async function main() {
  loadDotEnv()
  const calendly = normalizeCalendlyUrl(process.env.VITE_CALENDLY_URL)
  const docs = await loadArticles()
  fs.copyFileSync(cssSrc, path.join(publicDir, 'journal.css'))

  const report = []
  const allIssues = []
  for (const doc of docs) {
    const row = { slug: doc.slug, keyword: doc.keyword, intent: doc.intent }
    for (const locale of ['pl', 'en', 'uk']) {
      const result = renderArticle(doc, locale, contactHref(locale, calendly))
      const L = LOCALES[locale]
      const rel = `${L.articlePath(doc.slug).replace(/^\//, '')}index.html`
      writeFile(rel, result.html)
      row[`${locale}Words`] = result.words
      row[`${locale}Title`] = result.titleLen
      row[`${locale}Desc`] = result.descLen
      allIssues.push(...result.issues.map((issue) => `${doc.slug}: ${issue}`))
    }
    report.push(row)
  }

  for (const locale of ['pl', 'en', 'uk']) {
    const html = renderIndex(docs, locale, contactHref(locale, calendly))
    writeFile(`${LOCALES[locale].indexPath.replace(/^\//, '')}index.html`, html)
  }

  patchSitemap(docs)

  console.log('Generated journal pages\n')
  console.log(
    ['slug', 'keyword', 'intent', 'pl', 'en', 'uk'].map((h) => h.padEnd(h === 'keyword' ? 36 : 16)).join(''),
  )
  for (const row of report) {
    console.log(
      [
        row.slug.padEnd(36),
        row.keyword.padEnd(36),
        row.intent.padEnd(16),
        String(row.plWords).padEnd(16),
        String(row.enWords).padEnd(16),
        String(row.ukWords),
      ].join(''),
    )
  }
  if (allIssues.length) {
    console.log('\nValidation issues:')
    for (const issue of allIssues) console.log(` - ${issue}`)
    process.exitCode = 1
  }
}

main()
