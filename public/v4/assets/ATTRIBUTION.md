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
- Shadertoy black-hole shaders — rejected: default CC BY-NC-SA 3.0 license, incompatible
  with commercial use.
- `oseiskar/black-hole`'s bundled Milky Way background image — rejected: CC BY-NC 2.0,
  replaced with the Wikimedia skybox.

---

_Generated during asset staging for Portfolio V4. Last updated: 2026-07-12._
