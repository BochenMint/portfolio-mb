# Portfolio MB — Marcin Bochenek

Portfolio konwersyjne (React + Vite + GSAP + Lenis): case studies, cennik, intake, sticky CTA.

**Produkcja:**
- [marcinbochenek.com](https://marcinbochenek.com) — portfolio IT (V3)
- [gra.marcinbochenek.com](https://gra.marcinbochenek.com) — gra kosmiczna (V4)
- [mb-ai.pl](https://mb-ai.pl) — landing automatyzacji AI

Kontakt: `kontakt@marcinbochenek.com` (Cloudflare Email Routing).

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
