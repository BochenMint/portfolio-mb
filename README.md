# Portfolio MB — Bochen Studio

Portfolio **nastawione na konwersję** (React + Vite + GSAP + Lenis): case studies PSR, cennik, brief kwalifikacyjny, sticky CTA, custom cursor (desktop).

Produkty: **Plumm.pl**, **Mintapartments.pl**, **iDrive Cars**, **Agentic OS**.

## Uruchomienie


Portfolio dev: **http://localhost:5190** (dedykowany port Vite, strictPort — nie używa 5173 ani sąsiednich portów).

```bash
npm install
cp .env.example .env
# Uzupełnij VITE_CALENDLY_URL, VITE_FORM_ACCESS_KEY (Web3Forms)
npm run dev
```

Build: `npm run build` → `dist/`

Regeneracja screenów produktów (4K WebP): `npm run capture:screens` — viewport 3840×2160, warianty full/hero/card.

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
