# Portfolio V4 — Asset Attribution

Assets staged for the "space game" portfolio build (`/v4`). This file is linked from the
V4 page footer. Keep it up to date if assets are swapped later.

---

## Skybox — Milky Way equirectangular render

- **Files:** `skybox-8k.jpg` (8000×4000, q80), `skybox-4k.jpg` (4096×2048, q88),
  `skybox-2k.jpg` (2048×1024, q85)
- **Source:** Wikimedia Commons — *"Milky Way 360 equirectangular rendering with
  foreground stars removed"*
  https://commons.wikimedia.org/wiki/File:Milky_Way_360_equirectangular_rendering_with_foreground_stars_removed.png
- **Author:** Kevinmloch (rendered with `bsrender` from ESA Gaia EDR3 data)
- **License:** CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/
- **Attribution line to display:**
  "Milky Way equirectangular render by Kevinmloch, CC BY-SA 4.0, via Wikimedia Commons."
- **Note:** ShareAlike applies — any redistribution of this specific image (including the
  resized JPG derivatives shipped here) must remain CC BY-SA 4.0. Original was an
  8000×4000 PNG (56.96 MB); re-encoded at native resolution (8K tier) and downsampled
  to 4K/2K JPG via sharp for web delivery.

## Planet base textures — Solar System Scope

- **Files:** `tex/city-lights-2k.jpg` (Earth night-lights map, used as the emissive mask
  base for the purple metropolis planet), `tex/earth-day-2k.jpg` (Earth day map, used as
  the land/ocean mask base for the vacation planet)
- **Source:** https://www.solarsystemscope.com/textures/
  (`2k_earth_nightmap.jpg`, `2k_earth_daymap.jpg`)
- **Author:** Solar System Scope (solarsystemscope.com)
- **License:** CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
- **Attribution line to display:**
  "Planet base textures: solarsystemscope.com/textures, CC BY 4.0."
- **Note:** these are raw inputs for hand-built procedural shaders (recolored/remapped),
  not used as photoreal planet skins as-is — see research doc
  `docs/v4-assets-research.md` §4 for the intended per-planet shader approach.

## Spaceship models — Quaternius (CC0)

- **Files:**
  - `ships/ship-interceptor-htfBk9vPfw.glb` — sleekest/most elongated needle-nose hull,
    swept blade wings, twin engine pods. Primary candidate for the "polished steel
    frigate" look.
  - `ships/ship-fighter-PQzePrvBCD.glb` — second elongated hull, distinct cockpit canopy
    shape, swept tailfins.
  - `ships/ship-fighter-colored-Jqfed124pQ.glb` — compact fighter hull, pre-textured
    pink/black colorway (shows what a finished color variant looks like out of the box).
  - All three are untextured/base-mesh except the last, which carries its own simple
    material. Final pick + re-texturing (metallic/emissive engine glow) happens in the
    build phase.
- **Original source pack:** Quaternius — "Ultimate Spaceships Pack" (CC0 1.0), 10 hulls ×
  5 color variants, FBX/OBJ/glTF/Blend — https://quaternius.com/packs/ultimatespaceships.html
- **License:** CC0 1.0 Universal (public domain) — https://creativecommons.org/publicdomain/zero/1.0/
  No attribution legally required; credited below as good practice.
- **Author:** Quaternius (quaternius.com)
- **Substitution note:** the official pack download on quaternius.com routes through a
  Google Drive folder (`drive.google.com/drive/folders/1NpfT3wqe2k3Jwue2xryi7tzxP4bWzETu`,
  confirmed named "Ultimate Spaceships - May 2021") that requires interactive
  sign-in/JS to list and download files — not scriptable via curl. Individual hulls from
  this same pack are mirrored as separate CC0-licensed GLB downloads on **poly.pizza**
  under the verified Quaternius profile (https://poly.pizza/u/Quaternius), each explicitly
  tagged `"licence":"CC0 1.0"` in the site's own model metadata. Fetched the three GLBs
  above directly from poly.pizza's CDN (`static.poly.pizza/<uuid>.glb`) as a same-license,
  same-author substitute for the gated Drive download. Source model pages:
  - https://poly.pizza/m/htfBk9vPfw
  - https://poly.pizza/m/PQzePrvBCD
  - https://poly.pizza/m/Jqfed124pQ
- **Attribution line to display (optional, CC0 needs none):**
  "Spaceship models: Quaternius (quaternius.com), CC0 1.0."
- **V4 active ship (2026-07-16):** `buildShipV2` no longer uses these Quaternius hulls.
  See **Normandy SR2** section below.

## Normandy SR2 — JoshuaS / BlendSwap (CC0) + procedural fallback

- **Active runtime path:** `src/v4/ship/buildShipV2.ts` → `loadShipNormandy.ts`
- **Preferred mesh file (manual drop-in):** `ships/normandy-sr2-joshuas-cc0.glb`
- **Source:** JoshuaS — "Normandy Ship - SR2" on BlendSwap
  https://blendswap.com/blend/8489
- **License:** CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/
  (confirmed on the BlendSwap model page; also mirrored on Printables.com as public domain)
- **Author:** JoshuaS (BlendSwap profile https://blendswap.com/profile/51532)
- **Download status (2026-08-28):** **GLB not in repo.** Legal fetch without an account is blocked.
  - BlendSwap `GET https://blendswap.com/blend/8489/download` → `200 text/html` (login wall, not a `.blend`/`.glb` body). Direct URLs 404 without session cookies.
  - Printables mirror (same CC0 mesh, re-upload by Books): https://www.printables.com/model/410734-normandy-ship-sr2 — `HEAD`/`GET` return 403 without a Printables session. GraphQL `api.printables.com` rejected the anonymous query. No public CDN object (`media.printables.com/media/prints/410734/`) exists.
  - No GitHub/raw CC0 GLB of this specific JoshuaS mesh was found. Official EA/BioWare assets are not used.
- **Manual steps to enable the GLB path (user must drop the file):**
  1. Create a free BlendSwap account and download blend #8489 (or Printables #410734 STL, then convert).
  2. Open in Blender 3.x → File → Export → glTF 2.0 (`.glb`), Y-up, apply transforms.
  3. Save as `public/v4/assets/ships/normandy-sr2-joshuas-cc0.glb`.
  4. Reload `http://localhost:5190/gra.html?debug=1` — `window.__v4.getHullSource()` should return `glb`.
- **Textures (optional):** original hand-painted textures linked from the BlendSwap
  description (MediaFire mirrors in the model page text). Not required — runtime
  reapplies Alliance charcoal/white/blue materials via `loadShipNormandy.ts`.
- **Procedural fallback:** when the GLB is absent, `src/v4/ship/v2/hull.ts` builds an
  SR2-class silhouette from scratch (offset port hammerhead, S-curve nacelles, twin
  engine pods, stern aux nozzles, dorsal fins, ceramic bands). No EA assets copied.
- **Attribution line to display (optional for CC0, good practice):**
  "Normandy SR2 fan mesh: JoshuaS, CC0 1.0, via BlendSwap."
- **IP note:** Mass Effect / Normandy is EA/BioWare trademarked IP. This is a CC0
  community fan model used for portfolio visual reference; procedural fallback avoids
  franchise textures/insignia. Evaluate commercial portfolio exposure separately.

## Black hole shader reference — oseiskar/black-hole

- **Files:** `src/v4/shaders/reference/raytracer.glsl`, `src/v4/shaders/reference/COPYRIGHT.md`
- **Source:** https://github.com/oseiskar/black-hole (raw file via raw.githubusercontent.com,
  `master` branch)
- **Author:** Otto Seiskari, 2015
- **License:** MIT (per `COPYRIGHT.md` in the same directory)
- **Note:** this is the physically-based Schwarzschild geodesic raytracer GLSL, kept
  verbatim as reference — it will be adapted (not used as-is) into the existing
  Vite/Three.js v4 render pipeline during the build phase. The demo's original
  `img/milkyway.jpg` background (CC BY-NC 2.0, Stellarium/Nick Risinger) was
  **deliberately not fetched** — it is non-commercial-licensed and is superseded by the
  Wikimedia skybox above.
- **Attribution line to display:**
  "Black hole raytracing shader adapted from oseiskar/black-hole by Otto Seiskari, MIT License."
- **Phase 2 implementation note (`src/v4/world/blackHole.ts`):** built as a camera-facing
  impostor plane whose fragment shader marches each pixel's camera ray through 3D space
  near the hole, bending it every step with a lightweight inverse-square "fake gravity"
  deflection (not the reference's full Schwarzschild `u = 1/r` geodesic ODE integration —
  impractical for real-time), tests for accretion-disk-plane crossings along the way
  (temperature-gradient + doppler-beaming shading), and — this is the part carried over
  conceptually from the reference — samples the real skybox equirect texture along each
  ray's final bent direction, so escaping/lensed rays distort the actual Milky Way
  background rather than a stand-in texture. A credit comment referencing this file lives
  at the top of `blackHole.ts`.

---

## Not used / rejected (see `docs/v4-assets-research.md` for full detail)

- Sketchfab "Normandia SR2" — rejected: unconfirmed license + Mass Effect / EA trademark risk.
- Sketchfab Normandy listings (C-a-l-a-l-a-m-i-t-y et al.) — not used: download requires
  Sketchfab login; license not confirmed as CC0; disabled models common.
- BlendSwap #8489 (JoshuaS, CC0) — **accepted license**, download requires a free account
  login; runtime supports drop-in GLB at `ships/normandy-sr2-joshuas-cc0.glb`. Printables
  #410734 is the same CC0 mesh (public-domain re-upload) and is also session-gated (403).
- Shadertoy black-hole shaders — rejected: default CC BY-NC-SA 3.0 license, incompatible
  with commercial use.
- `oseiskar/black-hole`'s bundled Milky Way background image — rejected: CC BY-NC 2.0,
  replaced with the Wikimedia skybox.

---

_Generated during asset staging for Portfolio V4. Last updated: 2026-08-28._
