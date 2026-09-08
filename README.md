# Portfolio MB — Marcin Bochenek

Portfolio (React + Vite + GSAP + Lenis + three.js): case studies, cennik, intake, artykuły PL/EN/UA.

**Produkcja:** [marcinbochenek.com](https://marcinbochenek.com), hostowane na Cloudflare Pages —
procedura wdrożenia w [docs/GO-LIVE.md](docs/GO-LIVE.md). Kontakt:
`kontakt@marcinbochenek.com` (Cloudflare Email Routing).

## Edycje

Strona główna to **edycja Chrome** (`src/chrome/`). Wcześniejsze edycje zostały przy swoich
adresach i są wypisane na `/lab.html` — z datami i jednym zdaniem o tym, co każda badała.
Nie ma przełącznika wersji w nawigacji: jedyne wejście do archiwum jest w stopce, bo
archiwum ma czytać się jak zakres, a nie jak niezdecydowanie.

| Adres | Edycja | Kod | Indeksowana |
|---|---|---|---|
| `/`, `/en/`, `/ua/` | **Chrome** — bieżąca | `src/chrome/` | tak |
| `/lab.html` | Archiwum edycji | `src/lab/` | tak |
| `/gra.html` | Gra kosmiczna | `src/v4/` | tak |
| `/studio.html` | Studio (6 skór wizualnych) | `src/studio/` | nie |
| `/v1.html` … `/v6.html` | Edycje 05–08.2026 | `src/`, `src/v2`…`src/v6` | nie |
| `/mb-ai.html` (+ `-en`, `-ua`) | Landing MB AI | `src/mb-ai/` | tak |
| `/artykuly/`, `/en/articles/`, `/ua/statti/` | Artykuły (prerender) | `scripts/generate-articles.mjs` | tak |

Archiwalne edycje mają `noindex, follow` i kanoniczne linki na siebie — sześć bliźniaczych
landingów konkurujących z stroną główną o te same frazy szkodziłoby jej w wynikach.

Język wynika z adresu (`/`, `/en/`, `/ua/`), a nie z `localStorage`: przełącznik nawiguje,
dzięki czemu `canonical` i `hreflang` każdej strony mówią prawdę i wszystkie trzy wersje są
widoczne dla robotów.

## Uruchomienie

Dev: **http://localhost:5190** (`strictPort`).

```bash
npm install
cp .env.example .env
# Uzupełnij VITE_CALENDLY_URL, VITE_FORM_ACCESS_KEY (Web3Forms)
npm run dev
```

Build: `npm run build` → `dist/`

Deploy Mac Mini + Cloudflare Tunnel: patrz [`docs/DEPLOY-MAC-MINI.md`](docs/DEPLOY-MAC-MINI.md).

## Konfiguracja sprzedaży

| Env | Co ustawić |
|-----|------------|
| `VITE_CONTACT_EMAIL` | `kontakt@marcinbochenek.com` |
| `VITE_SITE_URL` | `https://marcinbochenek.com` |
| `VITE_CALENDLY_URL` | Link Cal.com / Calendly |
| `VITE_FORM_ACCESS_KEY` | Klucz Web3Forms |
| `VITE_PORTFOLIO_URL` / `VITE_GAME_URL` / `VITE_MB_AI_URL` | Cross-linki między hostami |

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4
- GSAP ScrollTrigger + Lenis
- Three.js (hero V3 / gra V4)
