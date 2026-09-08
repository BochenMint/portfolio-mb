# Project shots — rules & file map

> Ostatnia aktualizacja: lipiec 2026. Pipeline: `npm run capture:screens` → `npm run composite:plumm`.

---

## Reguły wizualne (research → ten portfolio)

Wzorowane na case study Awwwards, product marketing Linear/Vercel, hospitality booking i SaaS dashboard:

1. **Sekwencja narracyjna, nie dump** — każdy projekt ma 3–4 kadry w ustalonej kolejności: *hero (emocja / value prop) → UI detail (dowód produktu) → conversion / wynik → trust / pricing lub mobile*. Galeria case study = swipe story, nie losowe full-page.
2. **Full-bleed bez chrome przeglądarki** — czysty UI produktu; ramki urządzeń tylko gdy są częścią designu landingu (np. mock iPhone na plumm.pl), nigdy sztuczny „browser frame” wokół screenshota.
3. **Dwa formaty wyjściowe** — featured/cards: **16:9** (`*-hero.webp` 1920w, `*-card.webp` 1200w); galeria overlay: **16:10** 2400×1500 + `-sm` 1200w. Hero Mint cropowany *top-biased* (pasmo rezerwacji), nie środek pełnej strony.
4. **Nazewnictwo semantyczne** — `{moment}-{tier}.webp` (np. `booking-hero.webp`, `dashboard-card.webp`); galeria: `gallery/0N-{opis}.webp` z numeracją = kolejność w case study.
5. **Plumm = hub operacyjny (dawny FUGAZI)** — kadry: panel/CRM, landing, cennik, AI asystent. Nie pokazujemy MINTAX ani osobnego produktu FUGAZI.
6. **Mint = hospitality + conversion** — homepage z wyszukiwarką, katalog, karta apartamentu, widget rezerwacji (+ opcjonalnie mobile-booking).
7. **iDrive / Agentic bez live** — lokalny dev (`IDRIVE_ROOT`) lub **branded placeholder** z prawdziwym copy; Agentic = spójne mocki UI (workflow, audyt, agenci), nie stock.
8. **Spójność tierów** — każdy kadr → `full` (3840), `hero` (1920), `card` (1200); Plumm featured dodatkowo `split-*` z `npm run composite:plumm`.

---

## Pipeline

```bash
# Pełny capture (Playwright + Sharp)
npm run capture:screens

# Tylko wybrane projekty
npm run capture:screens -- --only=mint,plumm

# Kompozyt przekątny Plumm (featured card)
npm run composite:plumm
```

**Mac Mini / CI:** wymaga `npx playwright install chromium`, Node 20+, dostęp do sieci (mintapartments.pl, plumm.pl). Opcjonalnie w `.env`: `PLUMM_DEMO_EMAIL`, `PLUMM_DEMO_PASSWORD` dla prawdziwego panelu app.plumm.pl. iDrive: ustaw `IDRIVE_ROOT` na ścieżkę do repo Next.js (domyślnie `D:\IDRIVECARS 2.0`).

---

## Mint Apartments (`public/projects/mint/`)

| Plik | Moment | Źródło |
|------|--------|--------|
| `hero-*` | Featured hero — pasmo homepage + wyszukiwarka | mintapartments.pl/ (crop 16:9 top) |
| `apartment-*` | Featured card (karta apartamentu) | /apartamenty/luksusowy-seaside/ |
| `listings-*` | Katalog 36 apartamentów | /apartamenty |
| `booking-*` | Widget rezerwacji | scroll do booking widget |
| `mobile-booking-*` | Mobile 390×844 (opcjonalny) | ten sam URL, viewport mobile |
| `gallery/01-strona-glowna` | Case study #1 | = hero capture |
| `gallery/02-lista-apartamentow` | Case study #2 | = listings |
| `gallery/03-apartament-rezerwacja` | Case study #3 | = booking |

---

## Plumm (`public/projects/plumm/`)

| Plik | Moment | Źródło |
|------|--------|--------|
| `split-*` | **Featured** (karta + hero overlay) | kompozyt hero + dashboard |
| `hero-*` | Landing hero | plumm.pl |
| `dashboard-*` | Panel operacyjny | #panel lub app.plumm.pl po login |
| `dashboard-app-*` | Prawdziwy panel (gdy login OK) | app.plumm.pl |
| `app-*` | Mock funkcji (#funkcje) | element screenshot |
| `pricing-*` | Cennik | /cennik-ksiegowosci-online |
| `ai-assistant-*` | AI asystent | /ai-asystent-ksiegowy |
| `gallery/01-panel-operacyjny` | Case study #1 — dowód produktu | dashboard |
| `gallery/02-strona-glowna` | Case study #2 — value prop | hero |
| `gallery/03-cennik` | Case study #3 — trust / pricing | pricing |
| `gallery/04-ai-asystent` | Case study #4 — AI | ai-assistant |

---

## iDrive Cars (`public/projects/idrive/`)

| Plik | Moment | Źródło |
|------|--------|--------|
| `hero-*` | Featured | local dev `/` lub placeholder |
| `home-*` | Strona główna | local :5191/ |
| `testy-*` | Katalog testów | local /testy |
| `article-*` | Długi artykuł | local /testy/test-mercedes-amg-gt-s-… |
| `gallery/01–03` | Case study stack | jak wyżej |

**Uwaga:** idrivecars.pl na produkcji może serwować stronę parkingową — capture próbuje live, potem `IDRIVE_ROOT` dev server, na końcu branded placeholder.

---

## Agentic OS (`public/projects/agentic/`)

| Plik | Moment | Źródło |
|------|--------|--------|
| `hero-*` | Featured + workflow dashboard | HTML mock w skrypcie |
| `audit-*` | Log audytu kroków | mock |
| `agents-*` | Rejestr agentów + whitelist | mock |
| `gallery/01-workflow-dashboard` | Case study #1 | = hero |
| `gallery/02-audyt-krokow` | Case study #2 | = audit |
| `gallery/03-agenci-narzedzia` | Case study #3 | = agents |

---

## Sync manifestu

`capture:screens` zapisuje:

- `public/projects/gallery-manifest.json`
- `src/data/galleryManifest.json`

Typowany accessor: `src/data/gallery.ts` — po zmianie shot list zaktualizuj też ten plik (lub trzymaj go zsynchronizowany z manifestem).
