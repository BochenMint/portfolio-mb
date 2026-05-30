# Spline → Portfolio (opcjonalna ścieżka)

Obecny hero używa **trzech wariantów w czystym kodzie** (CSS + GSAP + lekki canvas), żeby nie ładować runtime Spline (~4 MB) na każdej wizycie. Poniżej: jak podmienić wariant na prawdziwy export, gdy wybierzecie zwycięzcę.

## Pliki źródłowe (.spline)

| Plik | Wariant w UI | Sugerowany export |
|------|----------------|-------------------|
| `retrofuturism_bg_animation.spline` | **Retro** | Video loop → `public/video/retro-hero.webm` |
| `distorting_typography.spline` | **Type** | Code (React) lub video pod warstwą typografii |
| `rotating_interactive_hero_section.spline` | **Orbit** | Code (React) w tle hero |

## Export z Spline

1. Otwórz plik w [Spline](https://spline.design/).
2. **Retro (tło post-FX):** `Export` → `Video` → MP4/WebM, loop, bez dźwięku. Skopiuj do `public/video/retro-hero.webm` (opcjonalnie `.mp4` jako fallback). Warstwa `<video>` w `HeroRetroLayer.tsx` już jest przygotowana.
3. **Type / Orbit (interaktywność):** `Export` → `Code` → `React`.
   - Zainstaluj: `npm install @splinetool/react-spline @splinetool/runtime`
   - Wklej URL sceny do `SplineEmbed` (prop `sceneUrl`).
4. **Wydajność:** ładuj Spline tylko dla aktywnego wariantu (`React.lazy`), nie na całej stronie.

## Przełącznik wariantów (dev / porównanie)

- UI: pigułki **Retro · Type · Orbit** (lewy dół hero).
- URL: `?hero=retro` | `?hero=type` | `?hero=orbit`
- `localStorage`: klucz `portfolio-mb-hero-variant`

Domyślny wariant: **orbit**.

## Komponent stub

`src/components/SplineEmbed.tsx` — podłącz `@splinetool/react-spline` gdy macie URL z exportu; build nie wymaga URL.

## Kompromisy jakości

| Aspekt | Kod (obecnie) | Prawdziwy Spline |
|--------|----------------|------------------|
| Rozmiar bundle | ~kilka KB + GSAP | +runtime, sceny MB |
| Post-FX retro | CSS grain, vignette, chroma | Pełne 3D + bloom |
| Szkło / typografia | `backdrop-filter`, aberracja CSS | Refrakcja 3D |
| Orbita | SVG + CSS rotate + parallax | Interaktywne pierścienie 3D |

Po wyborze zwycięzcy: usuń nieużywane warianty lub zostaw jeden export Spline + usuń pozostałe warstwy kodowe.
