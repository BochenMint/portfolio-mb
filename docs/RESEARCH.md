# Research: topowe portfolio (2025–2026)

## Wnioski (co robią najlepsi)

| Wzorzec | Dlaczego działa | Zastosowanie w tym szkicu |
|--------|------------------|---------------------------|
| **Scroll = timeline** (GSAP ScrollTrigger + scrub) | Użytkownik „prowadzi” historię; efekt kinowy bez wideo | Pin + horizontal track realizacji (desktop) |
| **Lenis** | Płynny scroll bez „szarpania” przeglądarki | `useLenis` + sync ze ScrollTrigger |
| **Narracja zamiast listy funkcji** | Codrops 2026: animacja służy opowieści, nie dekoracji | Hero → realizacje → usługi (dyskretna sprzedaż) → proces → CTA |
| **Glass + ciemna baza + 1 akcent** | Czytelność + premium (SaaS / luxury) | `--color-mint`, `--color-gold`, glass nav/cards |
| **Stagger text reveal** | landonorris.com / folio-2026 — pierwsze wrażenie | Preloader % + `data-hero-line` |
| **Bento / duże karty case study** | Pokazujesz *produkt*, nie screenshot 200px | `ProjectMock` → docelowo hi-res + scroll sequence |
| **Reduced motion** | Dostępność + SEO (tekst w DOM) | Media query + skip Lenis |
| **Wydajność** | folio-2026: dynamic DPR przy niskim FPS | Na razie CSS/GSAP; 3D opcjonalnie w fazie 2 |

## Referencje

- [They Call Me Giulio — Codrops](https://tympanus.net/codrops/2026/04/14/they-call-me-giulio-the-making-of-a-cinematic-cyberpunk-portfolio/) — kinematografia, dolly zoom, GSAP timelines
- [Scroll-driven 3D world — Codrops](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/) — sekcja = scena, brak „bloków z szablonu”
- [folio-2026](https://github.com/iTzRitual/folio-2026) — hybrid DOM/WebGL, FPS → DPR
- [GSAP ScrollTrigger guide](https://gsapify.com/gsap-scrolltrigger) — pin, scrub, snap
- [Apple-style scroll sequences](https://gsapvault.com/blog/scroll-image-sequence-tutorial) — docelowy upgrade dla kart produktów

## Faza 2 (żeby dorównać „#1 global”)

1. Prawdziwe screeny 2x/3x + sekwencja klatek na scroll (Plumm dashboard, Mint hero)
2. Custom cursor + magnetic CTA (tylko desktop)
3. Opcjonalnie R3F hero (monitor → zoom out do 3D biurka) jak folio-2026
4. Case study podstrony z metrykami (konwersja, czas obsługi, -% pracy ręcznej)
5. EN wersja + schema.org `Person` / `ProfessionalService`

## Dyskretna sprzedaż (copy)

Unikaj: „tanie strony”, „100% satysfakcji”, wall of badges.

Stosuj: konkretne ekosystemy (Plumm, Mint), proces 4 kroków, język właściciela firmy („marża”, „bez Excela o północy”).
