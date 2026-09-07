# Portfolio MB — Bochen Studio

Dwie edycje w jednym repo (Vite multi-page):

| Ścieżka | Edycja | Kod |
|---------|--------|-----|
| `/` | **Chrome** — dojrzała marka IT: polerowany chrom, szczotkowana stal, geometria Apple, odbicie kursora w kartach, liquid-chrome headline | `src/chrome/` |
| `/classic/` | Poprzednia edycja (mint/gold, glass, horizontal scroll) | `src/components/`, `src/App.tsx` |

Obie edycje dzielą dane (`src/data/content.ts`), hooki Lenis/magnetic oraz screeny w `public/projects/`.

## Edycja Chrome — system designu

- **Fonty:** Geist (display + body), Geist Mono (etykiety), Instrument Serif italic (akcent jednego słowa)
- **Powierzchnie:** `.chrome-card` (polerowany chrom, odbicie kursora sterowane przez `useChromeReflection`), `.chrome-card-light` (lustrzany, jasny — 1 na ekran), `.brushed` (szczotkowana stal z tekstury `public/chrome/brushed.webp`)
- **Geometria:** `corner-shape: superellipse(1.7)` z fallbackiem na `border-radius` (Apple continuous corners)
- **Obrazy:** `public/chrome/` — torus chromowy w hero, tekstura szczotkowana (wygenerowane w Higgsfield, zoptymalizowane do WebP)
- **Nagłówek:** `LiquidChrome` (`src/chrome/components/LiquidChrome.tsx`) — headline hero z żywym, płynnym overlayem WebGL2 chromu nałożonym dokładnie na litery
- **Języki:** przełącznik PL/EN (`src/chrome/i18n/`) — cały content, w tym `src/data/content.ts` / `content.en.ts`, jest tłumaczony niezależnie dla obu wariantów językowych
- **Motyw:** przełącznik jasny/ciemny (`src/chrome/theme/ThemeProvider.tsx`, `localStorage` klucz `mb-theme`) — respektuje `prefers-color-scheme` i pozwala nadpisać wybór ręcznie
- **Kostki 3D projektów:** `ProjectCube` (`src/chrome/components/ProjectCube.tsx`) — obracana kostka 3D z realnymi zrzutami ekranu produktu na ściankach (osobne warianty jasne/ciemne, patrz `public/projects/<id>/faces.json`), zamiast statycznych miniaturek
- **Copy:** `src/chrome/copy.ts` (ton „international IT brand"), dane wspólne w `src/data/content.ts`

Produkty: **Plumm.pl**, **Mintapartments.pl**, **iDrive Cars**, **Agentic OS**.

## Uruchomienie

```bash
npm install
cp .env.example .env
# Uzupełnij VITE_CALENDLY_URL, VITE_FORM_ACCESS_KEY (Web3Forms)
npm run dev
```

Build: `npm run build` → `dist/`

Regeneracja screenów produktów: `npm run capture:screens`

Optymalizacja zrzutów kostek 3D (`public/projects/<id>/faces.json` + `.webp`): `npm run faces:optimize`

## Konfiguracja sprzedaży

| Plik / env | Co ustawić |
|------------|------------|
| `src/data/content.ts` | `site.email`, `site.name`, metryki w `results` |
| `.env` → `VITE_CALENDLY_URL` | Link Cal.com / Calendly — **wszystkie CTA audytu** |
| `.env` → `VITE_FORM_ENDPOINT` | `https://api.web3forms.com/submit` lub Formspree URL |
| `.env` → `VITE_FORM_ACCESS_KEY` | Klucz Web3Forms (nie commituj `.env`) |
| Testimonials | Prawdziwe cytaty + zgoda — patrz `docs/CONVERSION.md` |

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- GSAP ScrollTrigger (scroll-driven, pin horizontal)
- Lenis (smooth scroll)
- `prefers-reduced-motion` — animacje wyłączone gdy użytkownik tego wymaga

## Research

Zobacz [docs/RESEARCH.md](./docs/RESEARCH.md) — wzorce z portfolio Awwwards / Codrops 2025–2026.
