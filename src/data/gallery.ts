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
 * kept in sync by hand with the two JSON copies above.
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
      'Strona główna Mint Apartments z wyszukiwarką terminów (przyjazd, wyjazd, liczba gości) i oznaczeniami zaufania — ocena 4,6/5 z 271 opinii, samodzielne zameldowanie 24/7 i najlepsza cena bezpośrednio u nas.',
  },
  {
    project: 'mint',
    src: '/projects/mint/gallery/02-lista-apartamentow.webp',
    srcSmall: '/projects/mint/gallery/02-lista-apartamentow-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://mintapartments.pl/apartamenty',
    caption:
      'Katalog apartamentów z wyszukiwarką opisową, filtrami lokalizacji, liczby gości i budżetu oraz kartami apartamentów z oznaczeniem Premium i najlepszą ceną u nas.',
  },
  {
    project: 'mint',
    src: '/projects/mint/gallery/03-apartament-rezerwacja.webp',
    srcSmall: '/projects/mint/gallery/03-apartament-rezerwacja-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://mintapartments.pl/apartamenty/mint-seaside',
    caption:
      'Karta apartamentu Mint Apartments Seaside z galerią zdjęć, wirtualnym obchodem i widżetem rezerwacji — wybór dat, liczby gości i bezpłatna anulacja do 7 dni przed przyjazdem.',
  },
  {
    project: 'plumm',
    src: '/projects/plumm/gallery/01-strona-glowna.webp',
    srcSmall: '/projects/plumm/gallery/01-strona-glowna-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://plumm.pl',
    caption:
      'Strona główna Plumm z podglądem aplikacji mobilnej (dochód netto, ostatnia aktywność, skróty do faktur i płatności) oraz wyróżnikami: księgowa na pokładzie, zgodność z RODO, pełna integracja z KSeF, bez ukrytych kosztów.',
  },
  {
    project: 'plumm',
    src: '/projects/plumm/gallery/02-cennik.webp',
    srcSmall: '/projects/plumm/gallery/02-cennik-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://plumm.pl/cennik-ksiegowosci-online',
    caption:
      'Cennik Plumm z przełącznikami rozliczenia miesięcznego i rocznego oraz netto/brutto, a także planami Darmowy (0 zł), Starter (149 zł/mies.) i polecany Standard (299 zł/mies.) wraz z listą funkcji każdego planu.',
  },
  {
    project: 'plumm',
    src: '/projects/plumm/gallery/03-ai-asystent.webp',
    srcSmall: '/projects/plumm/gallery/03-ai-asystent-sm.webp',
    width: 2400,
    height: 1500,
    page: 'https://plumm.pl/ai-asystent-ksiegowy',
    caption:
      'Podstrona AI Asystenta Podatkowego Plumm z hasłem Twój ekspert w kieszeni 24/7, znacznikami zaufania (baza wiedzy 2026, weryfikacja księgowej, RODO compliant, bez karty) oraz sekcją o codziennych problemach JDG i spółek.',
  },
]

/** Gallery entries for a given project id, in manifest order. Empty array when none exist. */
export function galleryForProject(projectId: string): GalleryEntry[] {
  return galleryManifest.filter((entry) => entry.project === projectId)
}
