# Spline → Portfolio hero

## Ważne

Pliki `.spline` **nie ładują się w przeglądarce**. Trzeba je opublikować w edytorze Spline i wkleić URL do `src/config/splineScenes.ts`.

1. Otwórz scenę w [spline.design](https://spline.design/)
2. **Export → Publish** (lub Code → skopiuj URL produkcyjny `https://prod.spline.design/...`)
3. Wklej URL w `SPLINE_SCENE_URLS.retro` | `.type` | `.orbit`
4. `npm run dev` — przy braku URL działa **Three.js fallback** (postprocessing / pierścienie / typografia)

## Pliki źródłowe

| Plik | Wariant | `?hero=` |
|------|---------|----------|
| `retrofuturism_bg_animation.spline` | Retro | `retro` |
| `distorting_typography.spline` | Type | `type` |
| `rotating_interactive_hero_section.spline` | Orbit | `orbit` |

## Porównanie wariantów

- UI: pigułki **Retro · Type · Orbit** (lewy dół hero)
- URL: `http://localhost:5190/?hero=retro` | `type` | `orbit`
- `localStorage`: `portfolio-mb-hero-variant`

## Komponenty

| Plik | Rola |
|------|------|
| `src/config/splineScenes.ts` | URL po Publish |
| `src/components/SplineEmbed.tsx` | Runtime Spline + fallback |
| `src/webgl/hero/createRetroHeroScene.ts` | Gradient shader + bloom/chroma/vignette/grain |
| `src/webgl/hero/createOrbitHeroScene.ts` | Torusy 3D, radial lines, emissive żółty segment |
| `src/webgl/hero/createTypeHeroScene.ts` | Ghost typography WebGL + HTML headline |

## Bundle

`@splinetool/react-spline` ładuje się **lazy** tylko gdy jest `sceneUrl`. Three.js dla hero ładuje się **per wariant** (dynamic import przy przełączeniu).

## Luka jakości vs prawdziwy Spline

| Aspekt | Three.js (teraz) | Spline po Publish |
|--------|------------------|-----------------|
| Refrakcja szkła / materiały | Przybliżenie shaderami | Fizycznie z edytora |
| Interakcje sceny | Mysz → obrót / displacement | Events z Spline |
| Rozmiar | ~chunk three + postprocessing | +runtime ~MB |

Po wyborze zwycięzcy: zostaw jeden URL, usuń nieużywane warianty lub warstwy fallback.
