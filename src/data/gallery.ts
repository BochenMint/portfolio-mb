/**
 * Typed accessor for the production gallery manifest.
 *
 * The raw JSON lives in two places on purpose:
 *  - public/projects/gallery-manifest.json — consumed by external automation, do not touch.
 *  - src/data/galleryManifest.json — a checked-in copy for reference/tooling.
 *
 * tsconfig.app.json does not set `resolveJsonModule`, so `tsc -b` (used by `npm run build`)
 * rejects a direct `import data from './galleryManifest.json'`. To keep the build green
 * without loosening the shared tsconfig, the manifest is inlined here as a typed const —
 * kept in sync by `npm run capture:screens` (writeGalleryManifest) + this file.
 */

export type GalleryEntry = {
  project: string
  src: string
  srcSmall: string
  width: number
  height: number
  page: string
  caption: string
}

export const galleryManifest: GalleryEntry[] = [
  {
    project: 'mint',
    src: '/projects/mint/gallery/01-strona-glowna.webp',
    srcSmall: '/projects/mint/gallery/01-strona-glowna-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://mintapartments.pl',
    caption:
      'Strona główna Mint Apartments — wyszukiwarka terminów, ocena 4,9/5 Google i rezerwacja na własnej stronie bez prowizji portalu.',
  },
  {
    project: 'mint',
    src: '/projects/mint/gallery/02-lista-apartamentow.webp',
    srcSmall: '/projects/mint/gallery/02-lista-apartamentow-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://mintapartments.pl/apartamenty',
    caption:
      'Katalog 36 apartamentów — filtry lokalizacji, gości i budżetu; karty z ceną direct i oznaczeniem Premium.',
  },
  {
    project: 'mint',
    src: '/projects/mint/gallery/03-apartament-rezerwacja.webp',
    srcSmall: '/projects/mint/gallery/03-apartament-rezerwacja-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://mintapartments.pl/apartamenty/luksusowy-seaside/',
    caption:
      'Karta apartamentu z galerią i widżetem rezerwacji — wybór dat, gości i bezpłatna anulacja do 7 dni przed przyjazdem.',
  },
  {
    project: 'plumm',
    src: '/projects/plumm/gallery/01-panel-operacyjny.webp',
    srcSmall: '/projects/plumm/gallery/01-panel-operacyjny-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://plumm.pl/#panel',
    caption:
      'Podgląd panelu Plumm — faktury, rozliczenia i CRM w jednym UX (marketingowy mock na landing; pełny panel po logowaniu na app.plumm.pl).',
  },
  {
    project: 'plumm',
    src: '/projects/plumm/gallery/02-strona-glowna.webp',
    srcSmall: '/projects/plumm/gallery/02-strona-glowna-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://plumm.pl',
    caption:
      'Landing Plumm — hub operacyjny firmy: księgowość, CRM, poczta i AI asystent podatkowy 24/7.',
  },
  {
    project: 'plumm',
    src: '/projects/plumm/gallery/03-cennik.webp',
    srcSmall: '/projects/plumm/gallery/03-cennik-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://plumm.pl/cennik-ksiegowosci-online',
    caption:
      'Cennik — plany od 0 zł (Darmowy) do Enterprise; przełącznik miesięczny/roczny i netto/brutto.',
  },
  {
    project: 'plumm',
    src: '/projects/plumm/gallery/04-ai-asystent.webp',
    srcSmall: '/projects/plumm/gallery/04-ai-asystent-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://plumm.pl/ai-asystent-ksiegowy',
    caption:
      'AI Asystent Podatkowy — odpowiedzi po polsku, baza wiedzy 2026, eskalacja do księgowej przy compliance.',
  },
  {
    project: 'idrive',
    src: '/projects/idrive/gallery/01-strona-glowna.webp',
    srcSmall: '/projects/idrive/gallery/01-strona-glowna-sm.webp',
    width: 2400,
    height: 1500,
    page: '',
    caption:
      'Strona główna iDrive Cars — editorial layout, sekcje testów i felietonów, szybkie ładowanie bez WordPressa.',
  },
  {
    project: 'idrive',
    src: '/projects/idrive/gallery/02-katalog-testow.webp',
    srcSmall: '/projects/idrive/gallery/02-katalog-testow-sm.webp',
    width: 2400,
    height: 1500,
    page: '',
    caption:
      'Katalog testów — karty artykułów z miniaturami WEBP, datą i kategorią; struktura pod SEO i indeksację.',
  },
  {
    project: 'idrive',
    src: '/projects/idrive/gallery/03-artykul-test.webp',
    srcSmall: '/projects/idrive/gallery/03-artykul-test-sm.webp',
    width: 2400,
    height: 1500,
    page: '',
    caption:
      'Długi format testu — typografia pod czytanie, galeria zdjęć i responsywny layout pod mobile.',
  },
  {
    project: 'agentic',
    src: '/projects/agentic/gallery/01-workflow-dashboard.webp',
    srcSmall: '/projects/agentic/gallery/01-workflow-dashboard-sm.webp',
    width: 2400,
    height: 1500,
    page: '',
    caption:
      'Panel zarządzania — aktywne procesy, wyniki zadań i ostatnie uruchomienia asystentów z audytem każdego kroku.',
  },
  {
    project: 'agentic',
    src: '/projects/agentic/gallery/02-audyt-krokow.webp',
    srcSmall: '/projects/agentic/gallery/02-audyt-krokow-sm.webp',
    width: 2400,
    height: 1500,
    page: '',
    caption:
      'Widok audytu — zapis kto/co/dlaczego dla każdego kroku; przy niskiej pewności decyzja wraca do człowieka.',
  },
  {
    project: 'agentic',
    src: '/projects/agentic/gallery/03-agenci-narzedzia.webp',
    srcSmall: '/projects/agentic/gallery/03-agenci-narzedzia-sm.webp',
    width: 2400,
    height: 1500,
    page: '',
    caption:
      'Lista asystentów i dozwolonych akcji — kontrolowany dostęp zamiast pełnego dostępu do systemu; szacunek kosztów.',
  },
]

/** Gallery entries for a given project id, in manifest order. Empty array when none exist. */
export function galleryForProject(projectId: string): GalleryEntry[] {
  return galleryManifest.filter((entry) => entry.project === projectId)
}

export type ShowcaseShot = {
  src: string
  srcSmall: string
  alt: string
  width: number
  height: number
}

/** Fallback scene stems when gallery manifest is incomplete (deck still shows 3 kadry). */
const FALLBACK_SCENES: Record<string, string[]> = {
  mint: ['hero', 'listings', 'apartment'],
  plumm: ['split', 'pricing', 'ai-assistant'],
  idrive: ['hero', 'testy', 'article'],
  agentic: ['hero', 'audit', 'agents'],
}

function shotFromGallery(entry: GalleryEntry): ShowcaseShot {
  return {
    src: entry.src,
    srcSmall: entry.srcSmall,
    alt: entry.caption.split('—')[0]?.trim() || entry.caption,
    width: entry.width,
    height: entry.height,
  }
}

function shotFromScene(projectId: string, scene: string): ShowcaseShot {
  return {
    src: `/projects/${projectId}/${scene}-hero.webp`,
    srcSmall: `/projects/${projectId}/${scene}-card.webp`,
    alt: scene,
    width: 1920,
    height: 1080,
  }
}

/** Up to `count` shots for sticky-stack deck — gallery order first, then scene fallbacks. */
export function showcaseShotsForProject(projectId: string, count = 3): ShowcaseShot[] {
  const gallery = galleryForProject(projectId).map(shotFromGallery)
  if (gallery.length >= count) return gallery.slice(0, count)

  const seen = new Set(gallery.map((s) => s.src))
  const fallbacks = (FALLBACK_SCENES[projectId] ?? ['hero']).map((scene) =>
    shotFromScene(projectId, scene),
  )

  const merged = [...gallery]
  for (const shot of fallbacks) {
    if (merged.length >= count) break
    if (!seen.has(shot.src)) {
      merged.push(shot)
      seen.add(shot.src)
    }
  }
  return merged.slice(0, count)
}
