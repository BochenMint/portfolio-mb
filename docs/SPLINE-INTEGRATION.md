# Spline → Portfolio hero

## Ważne

Pliki `.spline` **nie ładują się w przeglądarce**. Trzeba je opublikować w edytorze Spline i wkleić URL do `.env` (bez edycji kodu).

## Kroki Publish (dokładnie)

Dla **każdego** pliku źródłowego wykonaj osobno:

| Krok | Akcja |
|------|--------|
| 1 | Otwórz [spline.design](https://spline.design/) → **File → Open** → wybierz plik `.spline` z dysku |
| 2 | Sprawdź scenę w podglądzie (Play) |
| 3 | **Export** (prawy górny róg) → **Publish** |
| 4 | Skopiuj URL produkcyjny (`https://prod.spline.design/.../scene.splinecode`) |
| 5 | Wklej do `.env` w katalogu projektu (patrz tabela poniżej) |
| 6 | `npm run dev` → sprawdź wariant: `http://localhost:5190/?hero=retro` (lub `type` / `orbit`) |
| 7 | Opcjonalnie: `npm run capture:hero-variants` — zrzuty do `public/hero/posters/` (mobile) |

### Mapowanie plik → env

| Plik źródłowy | Wariant | Zmienna `.env` | URL dev |
|---------------|---------|----------------|---------|
| `retrofuturism_bg_animation.spline` | Retro | `VITE_SPLINE_RETRO_URL` | `?hero=retro` |
| `distorting_typography.spline` | Type | `VITE_SPLINE_TYPE_URL` | `?hero=type` |
| `rotating_interactive_hero_section.spline` | Orbit | `VITE_SPLINE_ORBIT_URL` | `?hero=orbit` |

### Gdzie zapisać zrzuty (po capture)

| Plik | Ścieżka |
|------|---------|
| Retro 1440 | `public/hero/posters/hero-retro-1440.webp` |
| Type 1440 | `public/hero/posters/hero-type-1440.webp` |
| Orbit 1440 | `public/hero/posters/hero-orbit-1440.webp` |
| Dev archive PNG | `scripts/screenshots/hero-variants/hero-{variant}-1440.png` |

## Produkcja vs lab

| Środowisko | Domyślny hero | Przełącznik Retro/Type/Orbit |
|------------|---------------|------------------------------|
| **Produkcja** | **Orbit** | Ukryty. Inne warianty tylko przez `?hero=retro` itd. (udostępnianie podglądu) |
| **Dev** (`npm run dev`) | Ostatni z localStorage lub Orbit | Pigułki w lewym dolnym rogu + banner „nie do wdrożenia” |

## Komponenty

| Plik | Rola |
|------|------|
| `src/config/splineScenes.ts` | URL z `import.meta.env` |
| `src/config/heroPosters.ts` | Postery statyczne (mobile) |
| `src/components/SplineEmbed.tsx` | Runtime Spline + skeleton + fallback |
| `src/components/hero/HeroBackground.tsx` | spline / webgl / poster / css |
| `src/webgl/hero/createOrbitHeroScene.ts` | Domyślny fallback — pierścienie + bloom |

## Bundle

`@splinetool/react-spline` ładuje się **lazy** tylko gdy jest `sceneUrl` i desktop. Three.js ładuje się **per wariant** przy przełączeniu w dev.

## Luka jakości vs prawdziwy Spline

| Aspekt | Three.js (fallback) | Spline po Publish |
|--------|---------------------|-------------------|
| Refrakcja szkła / materiały | Przybliżenie | Z edytora |
| Interakcje | Mysz → obrót / displacement | Events Spline |
| Fidelity szacunkowo | ~55–65% wizualnie | ~95%+ |

**Rekomendacja:** wdrażaj **Orbit** jako domyślny; po Publish ustaw `VITE_SPLINE_ORBIT_URL`. Retro/Type zostaw w dev lub jako eksperymenty z URL.
