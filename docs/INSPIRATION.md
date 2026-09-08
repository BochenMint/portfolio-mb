# Mapa inspiracji

Redesign to **synteza wzorców**, nie klon jednej strony. Domyślnie: **editorial dark** (`#000` / `#060606`), typografia cinematic, akcent `#FFE800` oszczędnie (hover menu, indeksy, CTA).

## fromanother.love — nawigacja i pacing (maj 2026)

| Źródło | URL | Wzorzec w buildzie |
|--------|-----|-------------------|
| Awwwards Inspiration | [creative-lab-fromanother-love — Navigation Menu](https://www.awwwards.com/inspiration/creative-lab-fromanother-love) | `FullscreenMenu.tsx`: fullscreen overlay, duże linki, numery `01–04`, stagger GSAP in/out, scroll lock, Escape, focus trap |
| Awwwards Site | [fromanother.love](https://www.awwwards.com/sites/fromanother-love) | `IntroCurtain.tsx` (fade marki ≤1.2s, bez %), chapter breaks (`01`–`03`), hero pełnoekranowy, obrazy `bleed-full`, rytm sekcji `section-pad` 24–36 |

**Świadomie nie klonujemy:** WebGL, długi preloader, all-type bez treści biznesowej. Zostają 4 projekty, portret Marcina, Lenis + ScrollTrigger.

## Koto (kierunek agency — marzec 2026)

**Źródło:** [Koto — Awwwards Honorable Mention](https://www.awwwards.com/sites/koto)

**Co bierzemy:** paleta `#FFE800` + `#060606`, bold type (Syne + tight tracking na scenach), duże miniatury, hover żółty, linki „Następny projekt”, strip prac na desktopie. **Bez** WebGL i preloadera z %.

## Czytelność i struktura case studies

| Źródło | URL | Wzorzec |
|--------|-----|---------|
| Muzli Portfolio 2026 | [muz.li/inspiration/portfolio-website](https://muz.li/inspiration/portfolio-website/) | Problem → wynik → rola |
| Gloria Lo | [glorialo.design](https://www.glorialo.design/) | Intro + portret, recent work |
| Josie Allison | [itsjosie.com](https://www.itsjosie.com/) | Numery `01–04`, tagi, ludzki About |
| NorthGarden | [awwwards.com/sites/northgarden](https://www.awwwards.com/sites/northgarden) | Minimal B&W, duże zdjęcia |
| William Dzierson | [dzierson.com](https://www.dzierson.com/) | Ton builder / technologist |

## Motion (GSAP + Lenis, bez WebGL)

| Źródło | URL | Wzorzec |
|--------|-----|---------|
| Juan Mora | [awwwards.com/sites/juan-mora-1](https://www.awwwards.com/sites/juan-mora-1) | Scroll reveal, hover kart |
| Victor Furuya | [awwwards.com/sites/victor-furuya-26](https://www.awwwards.com/sites/victor-furuya-26) | Vite + GSAP |
| Archi Green | [awwwards.com/sites/archi-green-design-studio](https://www.awwwards.com/sites/archi-green-design-studio) | Poziomy strip (`lg+`) |
| Luke Baffait | [awwwards.com/sites/luke-baffait](https://www.awwwards.com/sites/luke-baffait) | Subtelny scrub obrazów |

## Świadomie pominięto

Partizan (shadery), Matveyan (3D hero), podwójne sticky CTA, kobalt `#2E54FE`, mint-green w UI, preloader z licznikiem %.

## Oczekuje URL od użytkownika

Druga inspiracja **po Koto** nie została zapisana w repo (`docs/`, `content.ts`, assets, README). Jeśli to osobny link Awwwards / strona — wklej URL; dopiszemy 2–3 wzorce bez dodawania kolejnego koloru akcentu.

## Sekcje w buildzie

| Sekcja | Synteza |
|--------|---------|
| Nav | Hamburger → `FullscreenMenu` (fromanother) |
| Hero | Portret editorial full-bleed + gradient, typ mega |
| Work + Case studies | Karty edge-to-edge, chapter breaks |
| About + Contact | Ciemny editorial, duży quote (Muzli / Josie) |
| Dev | Port **5190**, `strictPort` |
