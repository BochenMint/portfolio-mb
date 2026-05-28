# Portfolio MB — Bochen Studio

Portfolio **nastawione na konwersję** (React + Vite + GSAP + Lenis): case studies PSR, cennik, brief kwalifikacyjny, sticky CTA, custom cursor (desktop).

Produkty: **Plumm.pl**, **Mintapartments.pl**, **iDrive Cars**, **Agentic OS**.

## Uruchomienie

```bash
npm install
cp .env.example .env   # VITE_CALENDLY_URL=...
npm run dev
```

Build: `npm run build` → `dist/`

## Konfiguracja sprzedaży

| Plik / env | Co ustawić |
|------------|------------|
| `src/data/content.ts` | `site.email`, `site.name`, metryki w `results` |
| `.env` → `VITE_CALENDLY_URL` | Link Cal.com / Calendly — primary CTA |
| Testimonials | Prawdziwe cytaty + zgoda na publikację |

## Do uzupełnienia (faza 2)

1. **Hi-res screeny** zamiast `ProjectMock` (WebP, scroll sequence)
2. **Backend formularza** (Formspree / własne API) zamiast mailto
3. **Analytics** (Plausible / GA4) + eventy na CTA

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- GSAP ScrollTrigger (scroll-driven, pin horizontal)
- Lenis (smooth scroll)
- `prefers-reduced-motion` — animacje wyłączone gdy użytkownik tego wymaga

## Research

Zobacz [docs/RESEARCH.md](./docs/RESEARCH.md) — wzorce z portfolio Awwwards / Codrops 2025–2026.
