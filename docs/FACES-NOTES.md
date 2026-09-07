# Faces capture notes

Provenance / technical notes for the cube-face screenshots in
`public/projects/{project}/faces.json`. These used to live inline in the
`label`/`caption` fields; they were moved here so the public-facing JSON only
carries short marketing copy. Nothing here is shown to visitors.

## mint (`public/projects/mint/faces.json`)

- **face-1 (`home`)** — Homepage (PL) rendered locally from a clone of the
  repo via `pnpm dev:web` (Astro 5, localhost:4321) — a real render using the
  repo's actual photos, no content mocked. Captured at a 1100×1000 viewport
  (not 1000×1000): at 1000px wide the nav collapses into a hamburger menu.
- **face-2 (`apartment`)** — The "Mint Apartments Seaside" detail page with
  its photo gallery and booking sidebar (dates, guest count, CTA) — local
  render from the real content-collection entry
  (`apps/web/src/content/apartments/mint-seaside.mdx`).
- **face-3 (`listing-en`)** — English-locale apartments catalogue
  (`/en/apartamenty`) — confirms working i18n (8 locales configured in
  astro.config); the real "16 matches" count matches the 16 files in
  content/apartments.
- **face-4 (`admin-dashboard`)** — The admin panel (Vue 3,
  localhost:5173/admin/) once logged in — the session and three PHP endpoints
  (bookings.php, owners.php) were intercepted with Playwright and served
  realistic fixture data, since no PHP/MySQL backend was running in this
  sandbox; the apartments count (16) matches the repo's real data, booking
  amounts are synthetic demo figures. Captured at a 1100×1000 viewport: at
  1000px wide the sidebar collapses into a hamburger menu.

## idrive (`public/projects/idrive/faces.json`)

- **face-1 (`home`)** — iDrive Cars homepage hero — full-bleed video frame
  from the Mercedes-AMG GT S test, with a live "All (136)" article counter
  pulled from the MDX content below the fold. Square 1600×1600 capture.
- **face-2 (`article`)** — Article detail page (News section — used because
  the car-test photo galleries live on the author's local disk and are not
  part of this repo checkout) showing real MDX rendering with a genuine hero
  photo, breadcrumbs and date/category metadata. Square 1600×1600 capture.
- **face-3 (`gallery`)** — News listing with real WebP thumbnails (6 genuine
  photos under public/news) — the closest photo-driven grid available in this
  checkout, since the test-article gallery binaries (public/galleries) are
  gitignored and were not cloned. Square 1600×1600 capture.
- **face-4 (`article-2`)** — News article on the Škoda Peaq production
  launch — chosen instead of the "Tests" index, whose thumbnails are broken
  in this checkout (gallery files are missing). The page renders fully at
  1000px width with a genuine factory-floor photo. Square 1600×1600 capture.

## agentic (`public/projects/agentic/faces.json`)

- **face-1 (`jarvis-home`)** — Real screenshot (React 19 + Vite; API
  responses mocked in Playwright against the actual backend schemas).
  Voice/text command center with a morning briefing synthesized locally
  (qwen3.6:27b).
- **face-2 (`operations-deck`)** — Real-time view of 10 agents across 3
  scopes (Personal/Plumm/Mint), with run history, model/tier badges, and
  escalation/pending-change counters.
- **face-3 (`capture-inbox`)** — Capture queue from iOS Shortcuts / Telegram
  / clipboard — voice, text, screenshots and links waiting to be enriched by
  the memory pipeline.
- **face-4 (`memory-explorer`)** — The L3 memory layer (Cognee + pgvector +
  Apache AGE): confidence distribution, shard counts per scope, and
  stale/superseded entries.
