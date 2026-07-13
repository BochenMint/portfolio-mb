# Portfolio V4 — Space Game: Asset Research

Scope: source assets for `/v4.html` (Three.js + Vite space-game portfolio). Findings only — nothing downloaded except what's noted as "fetched" (tiny text/license files via API, no binaries pulled).

---

## 1. Black hole rendering (physically plausible, WebGL/Three.js)

### Candidate A — `oseiskar/black-hole` — **RECOMMENDED (primary)**
- Link: https://github.com/oseiskar/black-hole (live demo: https://oseiskar.github.io/black-hole/)
- License: **MIT** (confirmed in [COPYRIGHT.md](https://github.com/oseiskar/black-hole/blob/master/COPYRIGHT.md)), copyright Otto Seiskari 2015. Third-party JS libs (jQuery, three.js, dat.GUI, stats.js) are MIT/Apache-2.0.
- **Caveat:** the demo's `img/milkyway.jpg` background is **CC-BY-NC 2.0** (Stellarium / Nick Risinger Photopic Sky Survey) — non-commercial, do NOT ship that file. Trivial to fix: swap it for the CC0/public-domain skybox from section 3 below.
- Physics: integrates the actual Schwarzschild geodesic ODE per-pixel in GLSL (`raytracer.glsl`) — this is the "poprawna fizycznie" (physically correct) implementation the brief asked for, not a fake shader trick. Produces gravitational lensing + Einstein-ring distortion of the background starfield and a orbiting accretion disc.
- Tech: vanilla WebGL + three.js (2015-era, jQuery/Detector.js scaffolding — dated but the shader math is what matters).
- Repo size: ~5 MB total, no large binaries besides the one image to replace.
- Stars: 274, still referenced/forked as the canonical open black-hole raytracer (e.g. `vlwkaos/threejs-blackhole`, `avheuv/black-hole` are forks of it).
- **Integration effort: M.** Don't drag in the old scaffold — lift `raytracer.glsl` (the physics) and re-implement the fullscreen quad / render-to-texture pass inside the existing Vite/Three.js v4 setup. Feed it your own skybox as the background texture (see §3) instead of the bundled NC one.

### Candidate B — `Scenes3D/black-hole` — strong modern alternative, minor provenance caveat
- Link: https://github.com/Scenes3D/black-hole (live demo: https://black-hole-bice.vercel.app)
- License: **MIT** (verified directly — raw `LICENSE` file, copyright 2024 sebastianvasquezechavarria1234).
- Tech: **already Vite + modern Three.js + GLSL** — same stack as your v4 project, so integration is closer to copy-paste than Candidate A. Includes lil-gui debug panel, chromatic-aberration post-processing, ~50k GPU particle accretion disc.
- **Caveat:** the LICENSE file states this is "based on original code by Bruno Simon (https://github.com/brunosimon) from the repository https://github.com/brunosimon/webgl-black-hole." That original Bruno Simon repo has **no license file at all** (280 stars, all-rights-reserved by default). Scenes3D's own MIT grant is legitimate for their own contributions, but if large portions of the shader were copied verbatim from Bruno's unlicensed original, Scenes3D technically couldn't grant MIT rights over that portion. Low real-world risk (common in the creative-coding community, no takedown history), but flagging it since the brief asked for clean chain-of-title.
- Repo size: ~57 MB (bundled resource textures for the particle disc).
- Only 2 GitHub stars — very fresh (last push May 2026), not yet battle-tested.
- **Integration effort: S–M** if you accept the caveat above; otherwise treat as visual reference only and rebuild the accretion-disc particle look on top of Candidate A's geodesic math.

### Rejected / not usable
- **Shadertoy black-hole shaders** (multiple exist, e.g. searches surface several "black hole" and "Interstellar-style" shaders) — Shadertoy's **default license is CC BY-NC-SA 3.0** unless the author explicitly overrides it. That is **not usable on a commercial portfolio** regardless of how good the shader looks. Every individual Shadertoy would need its license checked (rare exceptions exist), so don't lift code from Shadertoy without confirming a non-default license on that specific shader page.
- `peabrainiac/black-hole-renderer` — no license file at all (`license: null` via GitHub API) → all rights reserved by default. Good reference/tutorial reading, not legally reusable as-is.
- `SushantGagneja/Black-Hole-simulation` (Kerr/rotating black hole, frame-dragging, Doppler beaming) — also `license: null`. Visually the most advanced (rotating black hole physics), but not licensed for reuse. Could email the author to ask, but out of scope for now.

### Recommendation
Use **oseiskar/black-hole**'s `raytracer.glsl` (clean MIT chain of title, real Schwarzschild geodesic integration) as the physics core, rendered as a fullscreen post-process shader (not a mesh/skybox) layered over your own scene, with your own CC0 starfield as the lensed background. Optionally reference Scenes3D's chromatic-aberration/particle-disc technique for polish once the core is working.

---

## 2. Spaceship model

### The requested asset: Sketchfab "Normandia SR2"
- Link: https://sketchfab.com/3d-models/normandia-sr2-94d7aab9049a444ea451740c3fce484b
- Author: "Dreamydesigner," published Oct 2018. Description: "My Normandy SR2 model from Mass Effect." 249.3k triangles / 125.2k vertices.
- **License: no CC license badge is shown on the page at all.** On Sketchfab, no explicit CC badge defaults to their own **"Standard" license** — which permits use in a project (even commercial) but **forbids redistributing the model itself as a standalone downloadable file** and forbids near-identical derivative redistribution (per https://sketchfab.com/licenses). Could not confirm a working "Download" button in the fetched content — could not verify it's actually downloadable at all; would need manual sign-in check on the page itself.
- **Hard blocker regardless of the Sketchfab license: this is the Normandy SR-2 from Mass Effect — a trademarked, copyrighted design owned by EA/BioWare.** Fan-made 3D models of copyrighted IP are tolerated by rights holders in hobbyist/portfolio-of-fan-art contexts, but putting recognizable third-party IP (a specific named starship from a commercial video game franchise) on a **business portfolio site** (Mint Apartments / Plumm-adjacent personal brand, commercial intent) is a real trademark/copyright exposure — EA has a history of enforcing Mass Effect IP. **Recommend not using it**, license technicalities aside.

### Free alternatives with clean licenses

**1. Quaternius — Ultimate Spaceships Pack — CC0**
- Link: https://quaternius.com/packs/ultimatespaceships.html
- License: **CC0 1.0 Universal** (public domain) — confirmed on the page, linked to the CC0 deed. Free for personal + commercial, no attribution required.
- Contents: 10 distinct spaceship hulls × 5 color variants each. Formats: **FBX, OBJ, Blend, glTF**. Textured (simple/stylized, not full PBR).
- File size: not stated on the page; Quaternius packs are typically a few MB (the simpler "Spaceships Pack" sibling is 852 kB per its itch.io listing: https://quaternius.itch.io/lowpoly-spaceships).
- Style: Quaternius's signature low-poly/stylized look — reads as clean sci-fi silhouettes but **not** "polerowana stal" photoreal PBR out of the box. Good base mesh to re-texture with your own metal/emissive shader.
- Integration effort: **S**. Also mirrored on Sketchfab ("Ultimate Space Kit") and poly.pizza.

**2. Kenney — Space Kit — CC0**
- Link: https://kenney.nl/assets/space-kit (also on itch.io: https://kenney-assets.itch.io/space-kit)
- License: **CC0 1.0 Universal**, confirmed: "You're allowed to use these game assets in any project including commercial ones."
- Contents: 150+ modular pieces (hull segments, engines, turrets, a monorail, characters, weapons) — build a custom frigate silhouette from parts rather than using one fixed ship.
- Formats: **OBJ, FBX, DAE, STL, glTF**. Download size: **6.3 MB**.
- Style: simple flat-shaded low-poly geometric blocks — very fast to assemble and re-light, easiest to push toward "brushed/polished steel" with a custom PBR material since geometry is dead simple.
- Integration effort: **S**, best if you want to hand-build a unique hull rather than use a stock mesh.

**3. Sketchfab — "Sci-Fi Modular Asset Pack | PBR Textured" by TVdot — CC-BY**
- Link: https://sketchfab.com/3d-models/sci-fi-modular-asset-pack-pbr-textured-9960cfc95ff2465382a3af91c1587303
- License: **CC Attribution (CC-BY)** — confirmed on page, download button present.
- Contents: modular high-poly greebles/hull-panel pieces (5.1k tris / 3.3k verts for the piece checked), true PBR texture set.
- This is **not a complete ship** — use it to detail/dress a CC0 base hull (from Quaternius or Kenney above) with believable panel-line, vent, and greeble geometry that reads as brushed/polished steel under a metallic-roughness shader. Requires attribution credit somewhere (e.g. a credits page).
- Integration effort: **M** (compositing greebles onto a base mesh in Blender before export).

**Bonus, unverified — flag for manual check before use:** Sketchfab "Low poly sci-fi space cruiser ship" by Alexandr33D (https://sketchfab.com/3d-models/low-poly-sci-fi-space-cruiser-ship-6ad306f421de478c9df15cae6bb8403e) is an excellent aesthetic match — 2,000 tris, full PBR set at 4096×4096 (base color/normal/roughness/metallic/AO/emissive) — but the automated fetch could not confirm its license badge (CC0/CC-BY/Standard). If the visual fits, open the page manually and confirm the license before touching it.

### Recommendation
Skip the Normandy model (IP risk, unconfirmed license/downloadability). Use **Quaternius Ultimate Spaceships Pack** or **Kenney Space Kit** as the CC0 base hull, optionally dressed with **TVdot's CC-BY modular greebles** for a more "polished steel with emissive engine glow" finish (drive the glow via an emissive map + bloom post-process rather than relying on the source texture).

---

## 3. Milky Way / space skybox (4K+)

### Primary recommendation — NASA SVS Deep Star Maps 2020
- Link: https://svs.gsfc.nasa.gov/4851/ (predecessor: https://svs.gsfc.nasa.gov/3895)
- License: **Public domain** — NASA Scientific Visualization Studio content is U.S. government work, released without restriction. Cleanest possible license, no attribution technically required (crediting NASA is good practice regardless).
- Data: 1.7 billion stars from Hipparcos-2, Tycho-2, and Gaia DR2 catalogs, plate carrée (equirectangular) projection — built for exactly this use case (planetarium/spherical mapping).
- Confirmed downloadable resolutions/formats:
  - `starmap_2020_4k.exr` — 4096×2048 — 34.3 MB
  - `starmap_2020_8k.exr` — 8192×4096 — 124.5 MB
  - `starmap_2020_16k.exr` — 16384×8192 — 422.9 MB (32k/64k also exist, gigabytes — overkill for a web build)
  - Only a tiny 1024×512 JPG "print" thumbnail (41.8 KB) ships as JPG; the useful resolutions are **EXR only**, so budget a conversion/compression step (EXR → KTX2/JPG, tone-mapped) before shipping to the browser. Use the 4K EXR as source; 8K is already large for a web skybox.
- Integration effort: **S** (drop in as an equirectangular env map / background texture), **+S** for the EXR→web-format conversion step.

### Ready-to-use alternative — Wikimedia "Milky Way 360 equirectangular" render
- Link: https://commons.wikimedia.org/wiki/File:Milky_Way_360_equirectangular_rendering_with_foreground_stars_removed.png
- License: **CC BY-SA 4.0**, author Kevinmloch (rendered with `bsrender` from ESA Gaia EDR3 data, foreground stars within 3 kpc removed for a cleaner deep-space look).
- Specs: 8000×4000 PNG, 56.96 MB, **already equirectangular and already in a directly-usable web format** (no EXR conversion needed) — fastest path to a working skybox.
- Requires attribution + ShareAlike (any modified redistribution of *this specific image* must stay CC BY-SA) — fine for a portfolio background, just credit it.
- Integration effort: **S** (smallest amount of prep work of any option here).

### Checked and deprioritized — ESO Milky Way panorama
- Classic panorama: https://www.eso.org/public/images/eso0932a/ — the page explicitly states "For copyright reasons, we cannot provide here the full 800-million-pixel original image"; the downloadable version is only 6000×3000 TIFF (27.7 MB) and is **not equirectangular** (it's a horizon-style panorama of the galactic plane, not a 360×180 sphere map).
- The "equirectangular" ESO Chajnantor panorama (https://www.eso.org/public/images/uhd_9428_panorama_eq/) is 19828×5796 (115.8 MB TIFF) but only covers 360°×105.2° vertically, not the full 180° needed for a complete skybox, and includes foreground landscape/telescope domes (it's a real photo of Earth + sky, not a pure starfield).
- Also, ESO's general usage policy (CC-BY-4.0 for most ESO imagery) is not explicitly restated on this specific image's page — verify per-image before use. **Not recommended** given the projection/coverage mismatch versus the two options above.
- Polyhaven: confirmed **no dedicated space/starfield HDRI category exists** (checked polyhaven.com/hdris — sky/outdoor categories only, night skies are Earth-based with visible horizon, not deep-space starfields).

### Generation fallback — Spacescape
- Link: https://github.com/FrozenStormInteractive/Spacescape (tool page: http://alexcpeterson.com/spacescape/)
- License: **MIT** (confirmed, LICENSE.md).
- What it is: a free/open desktop tool (Ogre3D + Qt + CMake) with a layered system (point stars, billboard stars, procedural nebula noise) that bakes out a **custom cubemap** skybox — zero licensing concerns since the output is procedurally generated, not sourced from a real photo/dataset. Good fallback if you want a stylized (non-photoreal) starfield matching the game's art direction, or want guaranteed-original assets with no attribution burden at all.
- Integration effort: **M** (requires running the desktop tool once to bake textures, then a cubemap→equirectangular conversion if you want a single texture rather than 6 cube faces — Three.js supports cubemaps natively too, so this step may be skippable).

### Recommendation
Primary: **Wikimedia's Kevinmloch equirectangular render** (CC BY-SA 4.0, already in the right format, least prep work) for immediate use; swap to the **NASA SVS 4K EXR** (public domain, zero attribution risk) once you've set up the EXR conversion pipeline, since it's the legally cleanest long-term choice. Fallback: **Spacescape** if you want a fully custom/stylized starfield with no source-attribution obligations at all.

---

## 4. Planet textures (4 stylized planets: city/metropolis, ocean/vacation, racetrack, machine)

### Base texture source — Solar System Scope
- Link: https://www.solarsystemscope.com/textures/
- License: **CC BY 4.0**, confirmed (also mirrored/re-confirmed on Wikimedia Commons, e.g. https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_8k_earth_daymap.jpg).
- Content: 8K equirectangular textures for Sun, all planets, Earth day/night/clouds/normal/specular maps, and an 8K starfield panorama. Realistic, not stylized — but that's expected and fine per the brief, since all 4 target planets are heavily stylized/procedural reskins anyway.
- Integration effort: **S** as raw texture input; real work is downstream (see below).

### Procedural approach per planet (this is the actual deliverable, textures are just a base layer)
Since none of the four planets (purple metropolis, green vacation ocean, racetrack, "machine" planet) are realistic bodies, treat Solar System Scope's maps as **height/mask inputs only**, and build the actual look with shaders:
- **City/purple metropolis:** reuse the classic "Earth at night" city-lights technique — an emissive lights texture (Solar System Scope's `earth nightmap` as a starting mask, recolored purple/pink) blended additively over a dark base, city-density noise to break up uniform glow, thin atmosphere rim-light shader.
- **Green vacation ocean/beaches:** Earth daymap + specular map as land/water masks; procedural Voronoi/noise-based coastline tinting (turquoise shallow water → deep green/blue), no need for photoreal texture fidelity since it's a stylized "vacation" read.
- **Racetrack planet:** least suited to the realistic texture set — better to go fully procedural: a base rocky/metallic albedo (can still start from a Mars/Mercury CC-BY texture for surface break-up) with a hand-authored or procedural ribbon/spline track texture (emissive stripe shader) wrapped around the sphere.
- **Machine planet:** Solar System Scope has no "machine" analog — go procedural: tiling panel/greeble normal maps (could reuse the TVdot CC-BY sci-fi greebles from §2 as a tiling detail texture), emissive circuit-line shader, metallic PBR base.
- Integration effort: **M–L per planet** — the texture licensing is a solved/cheap problem (CC-BY, free, 8K); the actual cost is shader/art time to stylize each one, which is expected regardless of source assets.

### Recommendation
Pull Solar System Scope's CC-BY 4K/8K maps as free base layers (attribution: credit "solarsystemscope.com/textures, CC BY 4.0" in a credits section), then invest the real effort in per-planet procedural shaders rather than hunting for already-stylized textures that don't exist for these fictional planet types.

---

## 5. Physics/controls reference — 6DOF Newtonian ship controls

Checked `squarefeet/THREE.ObjectControls` (https://github.com/squarefeet/THREE.ObjectControls, MIT-licensed per repo footer, includes a working `examples/spaceship.html`). It demonstrates the right shape of API — `positionalAcceleration` / `positionalDeceleration` (damping, must be <1) / `maxPositionalVelocity` vectors driving a Newtonian integrator — but it's a single-author, 8-commit, v0.1.0, no-releases library last touched years ago with no stated three.js version compatibility, so treat it as **reference reading, not a dependency to install**. The pattern is simple enough to hand-roll in under 100 lines: keep a `velocity: Vector3` and `angularVelocity: Vector3` on the ship rig; each frame add `thrustInput * thrustAccel * dt` to velocity, multiply velocity by a `damping` factor (e.g. `0.98` per frame, or better, `Math.pow(damping, dt*60)` for frame-rate independence) for that "space feels heavy but forgiving" arcade-Newtonian feel, clamp to `maxSpeed`, then `position.addScaledVector(velocity, dt)`. Do the same for pitch/yaw/roll torque → angular velocity → quaternion integration (`quaternion.multiply(new Quaternion().setFromAxisAngle(axis, angularVelocity.length()*dt))`). This avoids a dependency, gives full control over game feel/tuning, and sidesteps any licensing question entirely.

---

## Recommended stack

- **Black hole:** `oseiskar/black-hole` (MIT) — lift `raytracer.glsl`'s Schwarzschild geodesic math, rebuild the render pass in the existing Vite/Three.js setup; swap the bundled CC-BY-NC Milky Way background for the Wikimedia/NASA skybox below. (Optional visual reference: `Scenes3D/black-hole`, MIT, for chromatic-aberration/particle polish — mind its Bruno-Simon provenance caveat.)
- **Spaceship:** Quaternius **Ultimate Spaceships Pack** (CC0) or Kenney **Space Kit** (CC0) as base hull, detailed with TVdot's **Sci-Fi Modular Asset Pack** (CC-BY, needs credit) for polished-steel greebles + your own emissive/bloom shader for the engine glow.
- **Skybox:** Wikimedia Kevinmloch **equirectangular Milky Way render** (CC BY-SA 4.0, 8K PNG, ready to use today) → migrate to **NASA SVS Deep Star Maps 2020** 4K EXR (public domain) once an EXR conversion step exists. Fallback: **Spacescape** (MIT tool) for a fully custom procedural starfield.
- **Planet textures:** Solar System Scope 8K maps (CC BY 4.0) as base layers under hand-built procedural shaders for all 4 stylized planets.
- **Controls:** hand-rolled velocity/damping/clamp Newtonian integrator (no dependency) — pattern reference only from `THREE.ObjectControls`.

**Total download budget** (excluding the black-hole code, which is source-only): Kenney Space Kit 6.3 MB + Quaternius pack (a few MB, unstated exact size) + TVdot greebles (small, single mesh) + Wikimedia skybox 56.96 MB (or NASA 4K EXR 34.3 MB) + Solar System Scope 8K planet maps (~10–15 MB each, a handful needed) ≈ **roughly 100–150 MB total raw source assets**, before any compression/optimization (KTX2/Basis texture compression and Draco/meshopt mesh compression should shrink this substantially for production).

### Legal notes (read before implementing)
1. **Do not use the Normandy SR2 Sketchfab model.** No confirmed CC license (Sketchfab default = "Standard," redistribution-restricted), download status unconfirmed, and — independent of any license — it's recognizable EA/BioWare trademarked IP; inappropriate for a commercial business portfolio regardless of what license terms might technically apply.
2. **Never use a Shadertoy shader without personally checking that specific shader's license page.** Shadertoy's platform default is CC BY-NC-SA 3.0 (non-commercial), which is incompatible with a business portfolio; only a minority of shaders override this default.
3. `oseiskar/black-hole`'s bundled Milky Way image is CC-BY-NC — replace it (already accounted for in the recommended stack above; don't ship that file as-is).
4. Attribution obligations to track in a credits section: Solar System Scope (CC BY 4.0), Wikimedia/Kevinmloch skybox (CC BY-SA 4.0, and note ShareAlike applies to that specific image if redistributed unmodified), TVdot Sci-Fi Modular Asset Pack (CC BY). CC0 items (Quaternius, Kenney, NASA public-domain, Spacescape output) need no attribution but crediting NASA/Kenney/Quaternius is good practice anyway.
5. Two repos worth reusing techniques from but **not licensed for direct reuse**: `peabrainiac/black-hole-renderer` and `SushantGagneja/Black-Hole-simulation` (both `license: null` via GitHub API = all rights reserved by default).
