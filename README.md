# Portfolio MB — szkic premium

Animowane portfolio (React + Vite + GSAP + Lenis) prezentujące produkty: **Plumm.pl**, **Mintapartments.pl**, **iDrive Cars**, **Agentic OS**.

## Uruchomienie

```bash
npm install
npm run dev
```

Build produkcyjny: `npm run build` → folder `dist/`

## Do uzupełnienia przed publikacją

1. **`src/data/content.ts`** — imię/nazwisko, e-mail (`site.email`), ewentualnie linki do idrivecars i Agentic OS
2. **Zdjęcia / screeny** — zamień `ProjectMock` na prawdziwe hi-res mockupy lub WebP sekwencje (Apple-style scroll)
3. **Analytics & formularz** — Cal.com, Formspree lub własny endpoint

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- GSAP ScrollTrigger (scroll-driven, pin horizontal)
- Lenis (smooth scroll)
- `prefers-reduced-motion` — animacje wyłączone gdy użytkownik tego wymaga

## Research

Zobacz [docs/RESEARCH.md](./docs/RESEARCH.md) — wzorce z portfolio Awwwards / Codrops 2025–2026.
