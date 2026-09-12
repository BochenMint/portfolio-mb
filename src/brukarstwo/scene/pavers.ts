/**
 * The paver field: a rectangle of concrete block paving that lays itself in
 * herringbone (jodełka) as the visitor scrolls, seen from almost directly
 * above — the centrepiece for a paving-contractor landing page.
 *
 * Built on `stage/shaders` (`NOISE` + `LIGHT` — hand-lit in linear space, one
 * shared `finish()` ACES grade), same as every other surface on this stage.
 * This file used to point at the garden's own `krajobraz/scene/shaders.ts`,
 * back when that was the only place `NOISE`/`finish()` lived; now that they
 * live in the shared engine, this is the only shader import the field needs.
 *
 * ---------------------------------------------------------------------------
 * The herringbone lattice
 * ---------------------------------------------------------------------------
 * A paver is 2×1 (long : short). Two perpendicular families of these bricks
 * tile the plane without gaps or overlaps — but naively translating a
 * "one horizontal + one vertical" motif by simple square-grid vectors does
 * NOT work: it either leaves holes or produces basket-weave (bricks grouped
 * into same-orientation pairs), not herringbone. This was checked by brute
 * force before writing a single line of shader code (see the throwaway
 * prototypes under the harness scratchpad) — the actual translation lattice,
 * with module `w` = paver short side and brick long side `2w`, is generated
 * by the two vectors
 *
 *   p = (-w,  w)
 *   q = ( 2w, 2w)
 *
 * with a horizontal brick's bottom-left corner at every `m·p + n·q`, and a
 * vertical brick's at `(2w,0) + m·p + n·q`, for integer (m,n). That lattice
 * has a lovely property here: p and q are themselves world-axis-aligned once
 * this whole local (u,v) frame — itself rotated 45° from world (x,z), which
 * is what turns "horizontal/vertical" into the ±45° pavers the brief asks
 * for — is unrotated back to world space. So a paver's world x depends only
 * on its lattice index m, and its world z only on n. That's what lets a
 * "course" (a row of the pattern, roughly constant world z) be identified
 * directly with n, and it's why the field can lay itself far-to-near just by
 * keying each paver's birth time off its own centre z.
 *
 * Real 20×10 cm pavers with a 3 mm joint don't sit exactly on a 2:1 lattice
 * once the joint is added uniformly on both axes (0.4+0.012 vs 2×(0.2+0.012)
 * don't scale the same way) — so, exactly as manufacturers do, the long body
 * dimension is stretched ~1.5% (to 0.812 instead of 0.8) so the joint comes
 * out uniform in both directions. Invisible at this scale.
 *
 * ---------------------------------------------------------------------------
 * The lettering cut-out
 * ---------------------------------------------------------------------------
 * Three designs were tried and rejected before this one:
 *   1. Tint whichever field paver a letter's ink happens to fall under. At a
 *      field paver's actual size relative to a stroke, that fills in every
 *      counter and inter-letter gap and fuses whole words into one dark bar
 *      — confirmed by rendering it.
 *   2. A rectangular inlay panel of small setts spanning the headline's own
 *      bounding box, light setts filling its background and dark ones
 *      spelling the words. That reads, but the panel itself — sized to fit
 *      cap-height enough letters to read — swallows most of the herringbone
 *      on the page, which is the pattern that says "paving" at a glance.
 *      Confirmed by rendering that too.
 *   3. Letter-shaped cut-outs, but decided from a mask THIS file rasterised
 *      itself — fine ink SAMPLE POINTS from `stage/lettering.ts`, dropped
 *      onto a grid at the small sett's own pitch. That grid has no finer
 *      resolution than one sett, so any paver whose CENTRE survived the cut
 *      still drew its full 20×10 cm body regardless of how much of that body
 *      actually overlapped a stroke — a pale paver sitting across a letter,
 *      breaking it into two pieces. Confirmed by rendering it: real, and not
 *      fixable by tuning the sample density, because the ceiling was the
 *      grid's own cell size, not the sampling.
 * What a real crew actually does for a motif cut into a paved field: a
 * grinder follows the motif's own outline, not a coarser grid laid over it.
 * So the cut here is decided against `stage/lettering.ts`'s OWN rasterised
 * mask (`setHeadline({ returnMask: true })` — the canvas it already draws
 * the words onto to find ink for its planting points, handed back whole
 * instead of rediscretised into a second, coarser grid) — every field
 * fragment and every lettering fragment tests the SAME texture at its own
 * exact world position, so the two meet exactly wherever the glyph outline
 * actually runs. A cheap CPU test (`inkAt`, reading the same canvas's pixel
 * data once) still decides which pavers and which setts are worth
 * generating at all — there is no draw-call budget for a paver or a sett
 * that would be 100% discarded — but the FRAGMENT test is what draws the
 * edge, so a generous CPU test costs a few extra clipped instances, never a
 * visual defect.
 *
 * ---------------------------------------------------------------------------
 * Cutting, joints and the draw-call budget
 * ---------------------------------------------------------------------------
 * Budget is one draw call per part — field, edging, lettering — with no
 * per-frame CPU work. That rules out the soil/turf trick used elsewhere in
 * this codebase (an instanced layer with gaps, revealing a *separate* mesh
 * underneath for the joints) — there's no draw-call room for a backing
 * plane. So every instance's quad is sized to the FULL pitch cell (paver +
 * its share of the joint), and the fragment shader paints the joint margin
 * itself (a rounded-rect SDF separates "paver body" from "joint gap" within
 * one quad) — the same one-quad-many-materials trick `BLOOM_FRAG` uses for
 * petal vs. leaf vs. bud.
 *
 * Laying lives entirely in the vertex shader, driven by per-instance birth
 * times, exactly as `letters.ts`'s flower field does it — `growth()` there
 * is `layT` here, on both the field and the lettering.
 */

import type * as THREE_NS from 'three'
import * as S from '../../stage/shaders'

export type PaverField = {
  group: THREE_NS.Group
  /** Scroll progress 0..1, and wall-clock seconds for anything that breathes. */
  setProgress(p: number, time: number): void
  dispose(): void
  info(): { stones: number; courses: number; edging: number; lettering: number }
}

const DEG = Math.PI / 180
const INV_SQRT2 = Math.SQRT1_2

/* Paver body: 20 x 10 cm, 3 mm joint, at 1 unit = 0.25 m. The long body
 * dimension is stretched from the nominal 0.8 to keep the joint uniform on
 * both axes of the herringbone lattice — see the header comment.
 *
 * Only the lattice module (`w`, i.e. the short body) scales with `coarse`:
 * the brief asks the phone path to cut the paver count, not the frame rate,
 * and every fragment already costs the same regardless of how many
 * instances draw it — the `#define COARSE` below only trims per-fragment
 * work, it doesn't touch instance count. Fewer, larger pavers over the same
 * ground rectangle does that instead, with nothing else in the shader any
 * the wiser: `uPitch`/`uBodyHalf` carry the size into the vertex/fragment
 * stage as uniforms rather than baked constants, so there is exactly one
 * shader (not a desktop copy and a phone copy) either way. The joint width,
 * chamfer, corner radius and bevel depth stay absolute — a 3 mm joint is a
 * 3 mm joint whatever the paver size — so only this function needs to know
 * `coarse` exists. */
const SHORT_BODY = 0.4
const SHORT_BODY_COARSE = 0.56
const JOINT = 0.012
/** Exported so a scene file can size a hard-margin text box against the
 *  field's own paver footprint ("at least one field paver of clearance
 *  inside the kerb") rather than a fraction-of-the-driveway guess. */
export function paverMetrics(coarse: boolean) {
  const shortBody = coarse ? SHORT_BODY_COARSE : SHORT_BODY
  const wp = shortBody + JOINT // short pitch (lattice module w)
  const lp = 2 * wp // long pitch
  const longBody = lp - JOINT // ~0.812 at desktop scale, not the nominal 0.8
  return { shortBody, wp, lp, longBody }
}

/* Lettering setts: ~4 cm square ("kostka mała"), same joint as the field so
 * the cut-out reads as finer paving rather than a different material.
 * `coarse` scales this up too, same reasoning as the field's own — but much
 * more gently (1.19x, not the field's ~1.4x): tried 0.22 (1.35x) first and
 * it dropped setts-per-cap-height from 7.5 to 5.6, visibly blurring letters
 * that were already only just resolving at the desktop size — confirmed by
 * rendering it. The whole point of this grid is resolving a stroke; the
 * field can afford to get chunkier faster than the lettering can. */
const SETT_BODY = 0.16
const SETT_BODY_COARSE = 0.19
/** About 3 cm at this scene's 1-unit-≈-0.25 m convention — the point below
 *  which a lettering sett stops reading as a real small-paving unit at all
 *  and a scene file asking for a smaller one should drop words instead (see
 *  `settBodyForCapHeight`). */
export const SETT_BODY_FLOOR = 0.12
/** Exported so a scene file can cross-check setts-per-cap-height against
 *  the em `stage/lettering.ts` actually picked, without a second copy of
 *  these numbers drifting out of sync with this file's own (a duplicate
 *  literal here once did exactly that after a coarse-tuning pass).
 *  `bodyOverride` lets a scene file that has already solved for a SMALLER
 *  sett (via `settBodyForCapHeight`, on a cramped field) hand that back in
 *  rather than accepting the mode's own default — same pitch arithmetic
 *  either way, one place it can drift out of sync. */
export function settMetrics(coarse: boolean, bodyOverride?: number) {
  const settBody = bodyOverride ?? (coarse ? SETT_BODY_COARSE : SETT_BODY)
  const pitch = settBody + JOINT
  return { settBody, pitch }
}
/** The `em * 0.72 / pitch` arithmetic `LAYOUT_FIXED`'s own comment in
 *  `paverScene.ts` already spells out, kept here once so a scene file
 *  checking it against a target never retypes it. Cap height sits ~0.72 em
 *  above the baseline — `stage/lettering.ts`'s own optical-centring comment. */
export function settsPerCapHeight(em: number, settBody: number): number {
  return (em * 0.72) / (settBody + JOINT)
}
/** The inverse: given the em a headline actually set at, the largest sett
 *  body (down to `SETT_BODY_FLOOR`) that clears `target` setts per cap
 *  height. A scene file calls this only once the mode's own default body
 *  (from `settMetrics`) already falls short — it never returns something
 *  BIGGER than that default, only smaller. */
export function settBodyForCapHeight(em: number, target: number, coarse: boolean): number {
  const defaultBody = settMetrics(coarse).settBody
  const needed = (em * 0.72) / target - JOINT
  return Math.max(SETT_BODY_FLOOR, Math.min(defaultBody, needed))
}

const CORNER_R = 0.026 // worn/rounded corner radius, field scale
const CHAMFER = 0.02 // bevel width at the top edge, field scale
const BEVEL_DEPTH = 0.006 // height drop across the chamfer, field scale
const JOINT_DIP = 0.014 // how far below the plateau the joint sits, field scale

/* The lettering's own bevel proportions do NOT carry over unscaled from the
 * field. First attempt reused CORNER_R/CHAMFER as-is and every sett came out
 * looking like a lit dot with huge dead space around it: at a 0.16 unit
 * body, a 0.026 corner radius and 0.02 chamfer are ~30% and ~25% of the
 * half-size, not the field's ~6.5%/5%, so the "rounded box" collapses
 * toward a circle and the bevel eats almost the whole plateau. Scaled by
 * the same ratio as the body instead, so a sett reads as a small paver, not
 * a smudge — computed per-build in `createPaverField` now (from whatever
 * sett body that call actually used, default or shrunk toward the floor
 * above), not baked here, since the shrink path means the body is no longer
 * always one of exactly two constants. `SETT_SCALE_BASE` is that same ratio
 * at the mode's own DEFAULT (unshrunk) body — multiplying it by
 * `actualBody / defaultBody` down in `createPaverField` reproduces today's
 * baked numbers exactly when nothing has been shrunk, and scales the bevel
 * down with the sett when it has. */
const SETT_SCALE_BASE = SETT_BODY / SHORT_BODY

const DROP_H = 0.15 // stones fall from this height, per the brief
const REST_BASE = 0.016 // resting paver-top height above the y=0 datum
const HEIGHT_JITTER = 0.014 // "a few millimetres" of per-stone height variation
const YAW_JITTER_DEG = 1.5

/* Edging (obrzeża): plain rectangular kerb units, no herringbone, laid end
 * to end along z on both long sides of the field. Exported so a page's own
 * scene file can size its field rectangle to leave exactly enough room for
 * the kerb without a second copy of this number. */
const EDGE_LONG = 1.2
export const EDGE_SHORT = 0.24
const EDGE_JOINT = 0.012

/* The joint-sand sweep (brief: "fills the joints with sand across the
 * frame"): a band `SAND_BAND` world units wide, moving in +x, transitions
 * every joint pixel — field, edging AND lettering alike — from the raw dark
 * gap to a sanded, sand-coloured one as it passes — see `CONCRETE_SHADE`'s
 * `sandT` and `createPaverField`'s `sandWindow`. */
const SAND_BAND = 0.5

const EASE = /* glsl */ `
float easeOutBack(float t) {
  float c1 = 1.70158;
  float c3 = c1 + 1.0;
  float x = t - 1.0;
  return 1.0 + c3 * x * x * x + c1 * x * x;
}
`

const SDF = /* glsl */ `
float roundedBoxSDF(vec2 p, vec2 halfSize, float r) {
  vec2 q = abs(p) - halfSize + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
`

/* Shared concrete surface: aggregate speckle, per-stone tint, a bevelled
 * plateau over a sunken joint, and the chamfer's own bright catch — used by
 * the herringbone field, the plain edging kerbs AND the small-sett
 * lettering, driven by whatever `d` (signed distance to the paver body,
 * negative = inside) the caller's own SDF produced, and by the caller's own
 * chamfer/bevel/joint-dip (the lettering's are much smaller — see
 * `SETT_SCALE_BASE` above — so these travel as arguments, not baked constants).
 * Analytic normal from a fragment-local height field via screen-space
 * derivatives, same technique `SOIL_FRAG` uses, because a flat instanced
 * quad has no real geometry to bevel. `accentT` is 0 or 1, not an animated
 * transition — field stone or basalt lettering, never swapped mid-scene. */
const CONCRETE_SHADE = /* glsl */ `
vec3 concreteShade(float d, vec2 localP, float seed, vec3 world, float accentT, float uTime, float sandT, float chamfer, float bevelDepth, float jointDip) {
#ifndef COARSE
  float speck = voronoi((localP + seed * 71.0) * 14.0).x;
#else
  float speck = 0.5;
#endif

  float edgeT = smoothstep(-chamfer, 0.0, d);
  float hBody = mix(0.0, -bevelDepth, edgeT);
#ifndef COARSE
  hBody += (speck - 0.5) * 0.0015;
#endif
  float jointT = smoothstep(0.0, chamfer, d);
  float hJoint = mix(-bevelDepth, -jointDip, jointT);
  float h = d < 0.0 ? hBody : hJoint;

  vec3 dpx = dFdx(world);
  vec3 dpy = dFdy(world);
  float dhx = dFdx(h);
  float dhy = dFdy(h);
  float det = dpx.x * dpy.z - dpx.z * dpy.x;
  vec2 g = abs(det) > 1e-9 ? vec2(dhx * dpy.z - dhy * dpx.z, dpx.x * dhy - dpy.x * dhx) / det : vec2(0.0);
  vec3 n = normalize(vec3(-g.x * 0.6, 1.0, -g.y * 0.6));

  vec3 lightGrey = vec3(0.34, 0.345, 0.36);
  vec3 basalt = vec3(0.03, 0.028, 0.033);
  vec3 base = mix(lightGrey, basalt, accentT);
  // Per-stone colour variation — pavers come off different pallets.
  base *= mix(0.9, 1.12, fract(seed * 13.0));
  base *= mix(0.92, 1.08, speck);

  vec3 jointRaw = mix(vec3(0.02, 0.019, 0.02), vec3(0.012, 0.011, 0.014), accentT * 0.4);
  // Kiln-dried jointing sand, brushed in after the field is down: warmer and
  // much lighter than the raw gap, and — unlike the paver above it — the
  // same colour whether it sits under a grey field stone or a basalt letter,
  // which is true of the real material.
  vec3 jointSand = vec3(0.15, 0.135, 0.105) * mix(0.92, 1.08, fract(seed * 23.0));
  vec3 jointC = mix(jointRaw, jointSand, sandT);
  vec3 c = d < 0.0 ? base : jointC;

  float ndl = max(dot(n, uSun), 0.0);
  vec3 lit = c * (uSky * 0.55 + uSunCol * ndl * 1.3);
  // The chamfer's own bright catch — the low sun raking across the bevel is
  // what actually reads as "chamfer" at this scale; the analytic normal
  // alone all but disappears once it's through the ACES grade.
  float rim = (1.0 - smoothstep(0.0, chamfer, abs(d))) * step(d, 0.0);
  float glint = 0.97 + 0.03 * sin(uTime * 2.0 + seed * 40.0);
  lit += uSunCol * rim * max(uSun.y, 0.0) * 0.35 * glint;
  // The sweep itself: loose sand catches the sun for the moment the pass is
  // actually over a joint (never over the paver body), brighter than the
  // settled fill on either side of it — this, not the colour swap alone, is
  // what makes the pass read as something moving rather than a hard cut.
  float sweep = (1.0 - smoothstep(0.0, 1.0, abs(sandT - 0.5) * 4.0)) * step(0.0, d);
  lit += uSunCol * sweep * 0.5;
  return lit;
}
`

/* ------------------------------------------------------------------ *
 * Field: one instance per paver. The quad is the full pitch cell (paver +
 * its share of the joint), long axis along local x before rotation — every
 * instance uses the same rectangle, just turned ±45°, so there's no need to
 * swap width/height per orientation. No accent colour here — a field paver
 * is always plain field stone; the letters are cut whole out of it below.
 * ------------------------------------------------------------------ */
const FIELD_VERT = /* glsl */ `
${EASE}
attribute vec2 aCenter;
attribute float aSign;
attribute float aSeed;
attribute float aBirth;
uniform float uP;
uniform float uLayGrow;
uniform float uRestY;
// (long pitch, short pitch) — the one thing 'coarse' changes about the
// lattice, so it travels as a uniform rather than a baked constant; see
// paverMetrics() on the JS side.
uniform vec2 uPitch;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

vec2 rot(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 local = position.xy * uPitch;
  vLocal = local;
  vSeed = aSeed;

  float layT = clamp((uP - aBirth) / uLayGrow, 0.0, 1.0);
  float settle = easeOutBack(layT);
  float y = mix(${DROP_H.toFixed(4)}, uRestY + (aSeed - 0.5) * ${HEIGHT_JITTER.toFixed(4)}, settle);

  float yaw = aSign * 45.0 * ${DEG.toFixed(8)} + (fract(aSeed * 17.0) - 0.5) * ${(2 * YAW_JITTER_DEG * DEG).toFixed(8)};
  float born = step(aBirth, uP);
  vec2 world2 = aCenter + rot(local, yaw) * born;
  vWorld = vec3(world2.x, y, world2.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`

const FIELD_FRAG = /* glsl */ `
${S.NOISE}
${S.LIGHT}
${SDF}
${CONCRETE_SHADE}
uniform float uX0;
uniform float uX1;
uniform float uZFar;
uniform float uZNear;
uniform float uTime;
uniform float uSandX;
uniform vec2 uBodyHalf;
// The letters' own true outline, as stage/lettering.ts's own rasterised
// mask rather than a re-discretised grid — see the header comment. uHasInk
// lets a scene with no headline at all (opts.letterMask absent) skip the
// lookup instead of needing a valid dummy texture sized just so.
uniform sampler2D uInkTex;
uniform vec2 uInkOrigin;
uniform vec2 uInkExtent;
uniform float uHasInk;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

void main() {
  // The cut edge: a straight discard against the field rectangle. For a
  // paver rotated ±45° and straddling that line, this alone produces the
  // triangular cut piece a real herringbone border shows — no extra geometry.
  if (vWorld.x < uX0 || vWorld.x > uX1 || vWorld.z < uZFar || vWorld.z > uZNear) discard;

  if (uHasInk > 0.5) {
    vec2 uv = (vWorld.xz - uInkOrigin) / uInkExtent;
    if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
      // Same straight-discard trick as the outer boundary above, just driven
      // by a texture lookup instead of four numbers: a paver merely
      // straddling a letter's cut edge still gets a clean triangular cut.
      if (texture2D(uInkTex, uv).r > 0.5) discard;
    }
  }

  float d = roundedBoxSDF(vLocal, uBodyHalf - vec2(${CORNER_R.toFixed(4)}), ${CORNER_R.toFixed(4)});
  // 0 before the sand-sweep has reached this fragment's world x, 1 after —
  // see createPaverField's sandWindow (JS side) for how uSandX moves over time.
  float sandT = clamp((uSandX - vWorld.x) / ${SAND_BAND.toFixed(3)} + 0.5, 0.0, 1.0);
  vec3 lit = concreteShade(d, vLocal, vSeed, vWorld, 0.0, uTime, sandT, ${CHAMFER.toFixed(4)}, ${BEVEL_DEPTH.toFixed(4)}, ${JOINT_DIP.toFixed(4)});
  gl_FragColor = vec4(finish(lit), 1.0);
}
`

/* ------------------------------------------------------------------ *
 * Edging: plain kerb units, laid end to end along world z, no rotation.
 * ------------------------------------------------------------------ */
const EDGE_VERT = /* glsl */ `
${EASE}
attribute vec2 aCenter;
attribute float aSeed;
attribute float aBirth;
uniform float uP;
uniform float uLayGrow;
uniform float uRestY;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

void main() {
  vec2 local = position.xy * vec2(${EDGE_SHORT.toFixed(4)}, ${EDGE_LONG.toFixed(4)});
  vLocal = local;
  vSeed = aSeed;
  float layT = clamp((uP - aBirth) / uLayGrow, 0.0, 1.0);
  float settle = easeOutBack(layT);
  float y = mix(${DROP_H.toFixed(4)}, uRestY + (aSeed - 0.5) * ${HEIGHT_JITTER.toFixed(4)}, settle);
  float born = step(aBirth, uP);
  vec2 world2 = aCenter + local * born;
  vWorld = vec3(world2.x, y, world2.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`

const EDGE_FRAG = /* glsl */ `
${S.NOISE}
${S.LIGHT}
${SDF}
${CONCRETE_SHADE}
uniform float uZFar;
uniform float uZNear;
uniform float uTime;
uniform float uSandX;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

void main() {
  if (vWorld.z < uZFar || vWorld.z > uZNear) discard;
  vec2 bodyHalf = vec2(${(EDGE_SHORT / 2).toFixed(6)}, ${(EDGE_LONG / 2).toFixed(6)});
  float d = roundedBoxSDF(vLocal, bodyHalf - vec2(${CORNER_R.toFixed(4)}), ${CORNER_R.toFixed(4)});
  float sandT = clamp((uSandX - vWorld.x) / ${SAND_BAND.toFixed(3)} + 0.5, 0.0, 1.0);
  vec3 lit = concreteShade(d, vLocal, vSeed, vWorld, 0.0, uTime, sandT, ${CHAMFER.toFixed(4)}, ${BEVEL_DEPTH.toFixed(4)}, ${JOINT_DIP.toFixed(4)});
  gl_FragColor = vec4(finish(lit), 1.0);
}
`

/* ------------------------------------------------------------------ *
 * Lettering: one instance per small sett, axis-aligned (no ±45° rotation,
 * no yaw jitter — real cut-in lettering is laid true so the letters stay
 * crisp), square quad sized to the sett's own pitch. Every instance here is
 * basalt (accentT baked to 1.0 in the shader below) — only cells worth
 * generating at all ever get an instance, so there's no "field-grey filler
 * sett" any more. The FRAGMENT shader discards the mirror image of the
 * field's own test (outside the mask rather than inside it) against the
 * exact same texture, so a sett's square quad only ever shows the part of
 * itself that is genuinely ink — the two meshes meet at the one true edge
 * between them, not at two independently-guessed ones.
 * ------------------------------------------------------------------ */
const LETTER_VERT = /* glsl */ `
${EASE}
attribute vec2 aCenter;
attribute float aSeed;
attribute float aBirth;
uniform float uP;
uniform float uLayGrow;
uniform float uRestY;
uniform float uPitch;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

void main() {
  vec2 local = position.xy * vec2(uPitch, uPitch);
  vLocal = local;
  vSeed = aSeed;

  float layT = clamp((uP - aBirth) / uLayGrow, 0.0, 1.0);
  float settle = easeOutBack(layT);
  float y = mix(${DROP_H.toFixed(4)}, uRestY + (aSeed - 0.5) * ${HEIGHT_JITTER.toFixed(4)}, settle);

  float born = step(aBirth, uP);
  vec2 world2 = aCenter + local * born;
  vWorld = vec3(world2.x, y, world2.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`

/** A function, not a baked template string, because the bevel proportions
 *  depend on the sett body actually chosen for this build — the mode's own
 *  default on most screens, but shrunk toward `SETT_BODY_FLOOR` on a phone
 *  too cramped to hit six setts per cap height otherwise (see
 *  `settBodyForCapHeight` and `paverScene.ts`'s own headline-fit comment).
 *  `SETT_SCALE_BASE`'s own comment explains the scaling this call passes in. */
function letterFragSource(cornerR: number, chamfer: number, bevelDepth: number, jointDip: number) {
  return /* glsl */ `
${S.NOISE}
${S.LIGHT}
${SDF}
${CONCRETE_SHADE}
uniform float uTime;
uniform float uSandX;
uniform float uBodyHalf;
uniform sampler2D uInkTex;
uniform vec2 uInkOrigin;
uniform vec2 uInkExtent;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

void main() {
  // The mirror image of the field's own cut, against the SAME source canvas
  // (a SEPARATE THREE.CanvasTexture object, though — see letterInkTexture's
  // own comment for why): a sett only shows where the mask says ink, so a
  // sett whose square quad pokes past the true glyph edge doesn't paint
  // over the herringbone that has every right to show through there.
  vec2 uv = (vWorld.xz - uInkOrigin) / uInkExtent;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0 || texture2D(uInkTex, uv).r < 0.5) discard;

  float d = roundedBoxSDF(vLocal, vec2(uBodyHalf - ${cornerR.toFixed(4)}), ${cornerR.toFixed(4)});
  float sandT = clamp((uSandX - vWorld.x) / ${SAND_BAND.toFixed(3)} + 0.5, 0.0, 1.0);
  vec3 lit = concreteShade(d, vLocal, vSeed, vWorld, 1.0, uTime, sandT, ${chamfer.toFixed(4)}, ${bevelDepth.toFixed(6)}, ${jointDip.toFixed(6)});
  gl_FragColor = vec4(finish(lit), 1.0);
}
`
}

type Stone = {
  cx: number
  cz: number
  sign: 1 | -1
  seed: number
  courseN: number
}

export function createPaverField(
  THREE: typeof import('three'),
  opts: {
    x0: number
    x1: number
    zFar: number
    zNear: number
    /** `stage/lettering.ts`'s own rasterised mask (`setHeadline({ returnMask:
     *  true })`) and the world rect it covers — see the header comment.
     *  Undefined for a scene with no headline at all. */
    letterMask?: { canvas: HTMLCanvasElement; rect: { x0: number; z0: number; x1: number; z1: number } }
    light: Record<string, { value: unknown }>
    coarse: boolean
    seed?: number
    layWindow: [number, number]
    /** When the lettering's setts drop in, in the sweep's left-to-right order. */
    letterWindow: [number, number]
    sandWindow: [number, number]
    /** Overrides the mode's own default sett body (see `settMetrics`) — a
     *  scene file passes this once it has solved for a smaller sett (via
     *  `settBodyForCapHeight`) to keep a cramped headline's letters
     *  readable. Omitted, this is just the mode's default, same as before. */
    settBody?: number
  },
): PaverField {
  const rand = mulberry32(opts.seed ?? 20260912)
  const disposables: { dispose(): void }[] = []
  const group = new THREE.Group()
  const { x0, x1, zFar, zNear, light } = opts
  const { wp, lp, longBody, shortBody } = paverMetrics(opts.coarse)
  const { settBody, pitch: settPitch } = settMetrics(opts.coarse, opts.settBody)
  // The lettering's bevel proportions scale with whatever body this build
  // actually uses — identical to the old baked constants when settBody is
  // the mode's own default (ratio 1), smaller in the same proportion when a
  // scene file has shrunk it toward the floor. See SETT_SCALE_BASE's comment.
  const defaultSettBody = opts.coarse ? SETT_BODY_COARSE : SETT_BODY
  const settScale = SETT_SCALE_BASE * (settBody / defaultSettBody)
  const settCornerR = CORNER_R * settScale
  const settChamfer = CHAMFER * settScale
  const settBevelDepth = BEVEL_DEPTH * settScale
  const settJointDip = JOINT_DIP * settScale

  /* ---- The ink mask: read straight off `stage/lettering.ts`'s own canvas,
   * once, into a plain pixel array `inkAt` can query cheaply from JS — no
   * rediscretising it onto a grid of our own first, which is what broke a
   * stroke into pieces last time (see the header comment). The SAME canvas
   * is uploaded as a texture below, so the fragment shaders in both FIELD_
   * FRAG and LETTER_FRAG test the exact pixels `inkAt` does here — CPU and
   * GPU never disagree about where the edge is, because they read one
   * source, not two independently rebuilt ones. ---- */
  const hasInk = !!opts.letterMask
  const maskRect = opts.letterMask?.rect ?? { x0: 0, z0: 0, x1: 0, z1: 0 }
  const maskCanvas = opts.letterMask?.canvas
  const maskW = maskCanvas?.width ?? 0
  const maskH = maskCanvas?.height ?? 0
  const maskData = maskCanvas?.getContext('2d')?.getImageData(0, 0, maskW, maskH).data ?? null
  const maskSpanX = Math.max(1e-6, maskRect.x1 - maskRect.x0)
  const maskSpanZ = Math.max(1e-6, maskRect.z1 - maskRect.z0)
  function inkAt(x: number, z: number): boolean {
    if (!maskData) return false
    const u = (x - maskRect.x0) / maskSpanX
    const v = (z - maskRect.z0) / maskSpanZ
    if (u < 0 || u > 1 || v < 0 || v > 1) return false
    // The mask is drawn with canvas row 0 at maskRect.z0 (toWorldZ(0) in
    // stage/lettering.ts) and row (height-1) at maskRect.z1, so v maps to a
    // row directly — no flip. The fragment shader's own uInkOrigin/
    // uInkExtent uniforms below reproduce this same mapping; a CanvasTexture
    // flips Y by default, so that texture gets `flipY = false` explicitly to
    // keep the two in agreement (a mismatch here would silently re-introduce
    // exactly the CPU/GPU disagreement this design exists to remove).
    const px = Math.min(maskW - 1, Math.max(0, Math.round(u * maskW)))
    const py = Math.min(maskH - 1, Math.max(0, Math.round(v * maskH)))
    return maskData[(py * maskW + px) * 4] > 127
  }

  const toWorld = (u: number, v: number) => ({ x: (u - v) * INV_SQRT2, z: (u + v) * INV_SQRT2 })

  // The lattice's own basis (see header comment) happens to be world-axis
  // aligned: a paver's world x depends only on its lattice index m, its
  // world z only on n. So the (m,n) range needed to cover the field can be
  // read straight off the field's x/z extent, with a generous pad for
  // stones that only partly overlap the rectangle (the fragment shader cuts
  // them properly; this is just about not missing any).
  const pad = lp * 1.5
  const originOffsetH = toWorld(lp / 2, wp / 2) // centre offset from an H-corner
  const slopeX = Math.SQRT2 * wp // world x per step of m (negative direction)
  const slopeZ = Math.SQRT2 * lp // world z per step of n
  const mAt = (x: number) => (originOffsetH.x - x) / slopeX
  const nAt = (z: number) => (z - originOffsetH.z) / slopeZ
  const mLo = Math.floor(Math.min(mAt(x0 - pad), mAt(x1 + pad))) - 2
  const mHi = Math.ceil(Math.max(mAt(x0 - pad), mAt(x1 + pad))) + 2
  const nLo = Math.floor(Math.min(nAt(zFar - pad), nAt(zNear + pad))) - 2
  const nHi = Math.ceil(Math.max(nAt(zFar - pad), nAt(zNear + pad))) + 2

  const stones: Stone[] = []
  const courseSet = new Set<number>()
  for (let m = mLo; m <= mHi; m++) {
    for (let n = nLo; n <= nHi; n++) {
      // Horizontal-family corner, centre, world position.
      {
        const cu = -wp * m + lp * n + lp / 2
        const cv = wp * m + lp * n + wp / 2
        const w = toWorld(cu, cv)
        if (w.x > x0 - pad && w.x < x1 + pad && w.z > zFar - pad && w.z < zNear + pad && !inkAt(w.x, w.z)) {
          stones.push({ cx: w.x, cz: w.z, sign: 1, seed: rand(), courseN: n })
          courseSet.add(n)
        }
      }
      // Vertical-family corner, offset by (2Wp,0) in local (u,v) from H's.
      {
        const cu = lp - wp * m + lp * n + wp / 2
        const cv = wp * m + lp * n + lp / 2
        const w = toWorld(cu, cv)
        if (w.x > x0 - pad && w.x < x1 + pad && w.z > zFar - pad && w.z < zNear + pad && !inkAt(w.x, w.z)) {
          stones.push({ cx: w.x, cz: w.z, sign: -1, seed: rand(), courseN: n })
          courseSet.add(n)
        }
      }
    }
  }

  // Birth times: ranked by course, not by raw distance from zFar. A field
  // with letters cut clean through it doesn't remove whole courses (a
  // stroke is far narrower than the field is wide, so almost every course
  // still has plenty of surviving stones either side of a letter) the way
  // the old rectangular panel did, but ranking costs nothing here and is
  // the more robust formula regardless of how much of a course a cut
  // happens to remove — evenly spacing however many courses actually
  // survive across the lay window rather than trusting raw z-distance to
  // still mean the same thing once stones are missing from the middle.
  const [layStart, layEnd] = opts.layWindow
  const [letterStart, letterEnd] = opts.letterWindow
  const [sandStart, sandEnd] = opts.sandWindow
  const layGrow = Math.max(0.015, (layEnd - layStart) * 0.12)
  const letterGrow = Math.max(0.01, (letterEnd - letterStart) * 0.16)
  // The sweep runs from just left of the field to just right of it, so a
  // fragment right at x0/x1 still gets the same soft transition as one in
  // the middle instead of starting/ending already half-sanded.
  const sandX0 = x0 - SAND_BAND
  const sandX1 = x1 + SAND_BAND

  const courseOrder = Array.from(courseSet).sort((a, b) => a - b)
  const courseRank = new Map(courseOrder.map((c, idx) => [c, courseOrder.length > 1 ? idx / (courseOrder.length - 1) : 0]))
  const n = stones.length
  const aCenter = new Float32Array(n * 2)
  const aSign = new Float32Array(n)
  const aSeed = new Float32Array(n)
  const aBirth = new Float32Array(n)
  stones.forEach((s, i) => {
    const courseT = courseRank.get(s.courseN) ?? 0
    aCenter[i * 2] = s.cx
    aCenter[i * 2 + 1] = s.cz
    aSign[i] = s.sign
    aSeed[i] = s.seed
    aBirth[i] = layStart + (layEnd - layStart) * courseT + (s.seed - 0.5) * 0.03
  })

  const quad = new THREE.PlaneGeometry(1, 1)
  const fieldGeo = new THREE.InstancedBufferGeometry()
  fieldGeo.index = quad.index
  fieldGeo.setAttribute('position', quad.getAttribute('position'))
  fieldGeo.setAttribute('aCenter', new THREE.InstancedBufferAttribute(aCenter, 2))
  fieldGeo.setAttribute('aSign', new THREE.InstancedBufferAttribute(aSign, 1))
  fieldGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1))
  fieldGeo.setAttribute('aBirth', new THREE.InstancedBufferAttribute(aBirth, 1))
  fieldGeo.instanceCount = n
  disposables.push(quad, fieldGeo)

  // stage/lettering.ts's own canvas, uploaded whole — no rebuilding it onto
  // a coarser grid of our own, which is what let a paver and its own cut
  // disagree two rounds ago (see the header comment). A scene with no
  // headline (hasInk false) still needs SOME valid texture bound (three
  // complains about an unset sampler otherwise), so it gets a harmless 1x1
  // one; uHasInk keeps FIELD_FRAG from ever sampling it (LETTER_FRAG never
  // exists at all in that case — see below). Linear filtering, no mips: the
  // mask is already anti-aliased text at ~7px per sett pitch, and a linear
  // sample moves the discard threshold's crossing point smoothly between
  // texels instead of snapping to whichever one is nearest. NoColorSpace:
  // this is a data mask, not a colour image — it must reach the shader as
  // the exact 0..1 values `inkAt` reads on the CPU side, not sRGB-decoded.
  //
  // TWO separate THREE.CanvasTexture objects wrap this ONE canvas — a
  // one-object-shared-by-both-materials version was tried first (the
  // obvious thing to do) and produced a real, reproducible bug: FIELD_FRAG
  // read it correctly (the field's own cut matched the words exactly) while
  // LETTER_FRAG, sampling the identical uv against the identical uniforms in
  // the identical texture, read ink as LOW where it should read HIGH —
  // fully inverted, so every lettering sett discarded itself and the
  // cut-out read as empty holes. Swapping in a second CanvasTexture instance
  // (same source canvas, identical settings) for the lettering material
  // alone made it read correctly — confirmed by rendering both ways.
  //
  // WHY a shared texture breaks this is NOT established. Sharing one
  // CanvasTexture across two ShaderMaterials is ordinary three.js/WebGL
  // usage, and this has since been seen to fail on a real GPU (ANGLE/D3D11)
  // as well as the software renderer (SwiftShader) it was first diagnosed
  // on — so neither "two WebGL programs disagreeing over one texture unit
  // under a software rasteriser" nor anything else specific is a confirmed
  // mechanism, only a guess this comment used to state as fact. What IS
  // confirmed, by direct A/B rendering: one shared object reads inverted in
  // LETTER_FRAG, two separate objects over the same canvas read correctly
  // in both. Do not simplify this back to one shared object without
  // re-rendering FIELD_FRAG and LETTER_FRAG side by side to check — an
  // unverified guess at the cause would be worse than admitting it's still
  // open. Two objects cost one extra small GPU upload of the same pixels;
  // that's cheaper than debugging this again.
  const dummyCanvas = document.createElement('canvas')
  dummyCanvas.width = 1
  dummyCanvas.height = 1
  function makeInkTexture() {
    const tex = new THREE.CanvasTexture(maskCanvas ?? dummyCanvas)
    tex.flipY = false // see inkAt's own comment on why
    tex.colorSpace = THREE.NoColorSpace
    tex.generateMipmaps = false
    tex.magFilter = THREE.LinearFilter
    tex.minFilter = THREE.LinearFilter
    tex.needsUpdate = true
    return tex
  }
  const inkTexture = makeInkTexture()
  disposables.push(inkTexture)
  const letterInkTexture = makeInkTexture()
  disposables.push(letterInkTexture)

  const fieldMat = new THREE.ShaderMaterial({
    vertexShader: FIELD_VERT,
    fragmentShader: (opts.coarse ? '#define COARSE 1\n' : '') + FIELD_FRAG,
    uniforms: {
      ...light,
      uP: { value: 0 },
      uTime: { value: 0 },
      uLayGrow: { value: layGrow },
      uRestY: { value: REST_BASE },
      uX0: { value: x0 },
      uX1: { value: x1 },
      uZFar: { value: zFar },
      uZNear: { value: zNear },
      uSandX: { value: sandX0 },
      uPitch: { value: new THREE.Vector2(lp, wp) },
      uBodyHalf: { value: new THREE.Vector2(longBody / 2, shortBody / 2) },
      uInkTex: { value: inkTexture },
      uInkOrigin: { value: new THREE.Vector2(maskRect.x0, maskRect.z0) },
      uInkExtent: { value: new THREE.Vector2(maskSpanX, maskSpanZ) },
      uHasInk: { value: hasInk ? 1 : 0 },
    },
    // The vertex stage rebuilds world position from the local footprint by
    // hand (it isn't a plain transform of the source plane), so the source
    // plane's own winding/facing isn't trustworthy — same call trees.ts's
    // shadow mesh makes for the same reason.
    side: THREE.DoubleSide,
  })
  const fieldMesh = new THREE.Mesh(fieldGeo, fieldMat)
  fieldMesh.frustumCulled = false
  group.add(fieldMesh)
  disposables.push(fieldMat)

  /* ---- Edging: two rows of kerb units along x0 and x1 ---- */
  const edgeInset = EDGE_SHORT / 2
  const edgePitch = EDGE_LONG + EDGE_JOINT
  const depth = zNear - zFar
  const edgeCount = Math.max(1, Math.round(depth / edgePitch))
  const edgeCenterArr = new Float32Array(edgeCount * 2 * 2)
  const edgeSeedArr = new Float32Array(edgeCount * 2)
  const edgeBirthArr = new Float32Array(edgeCount * 2)
  let ei = 0
  for (const side of [-1, 1] as const) {
    const ex = side < 0 ? x0 - edgeInset : x1 + edgeInset
    for (let k = 0; k < edgeCount; k++) {
      const ez = zFar + (k + 0.5) * edgePitch
      const t = (ez - zFar) / Math.max(1e-3, depth)
      edgeCenterArr[ei * 2] = ex
      edgeCenterArr[ei * 2 + 1] = ez
      const seed = rand()
      edgeSeedArr[ei] = seed
      edgeBirthArr[ei] = layStart + (layEnd - layStart) * t + (seed - 0.5) * 0.02
      ei++
    }
  }
  const edgeGeo = new THREE.InstancedBufferGeometry()
  edgeGeo.index = quad.index
  edgeGeo.setAttribute('position', quad.getAttribute('position'))
  edgeGeo.setAttribute('aCenter', new THREE.InstancedBufferAttribute(edgeCenterArr, 2))
  edgeGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(edgeSeedArr, 1))
  edgeGeo.setAttribute('aBirth', new THREE.InstancedBufferAttribute(edgeBirthArr, 1))
  edgeGeo.instanceCount = ei
  disposables.push(edgeGeo)

  const edgeMat = new THREE.ShaderMaterial({
    vertexShader: EDGE_VERT,
    fragmentShader: (opts.coarse ? '#define COARSE 1\n' : '') + EDGE_FRAG,
    uniforms: {
      ...light,
      uP: { value: 0 },
      uTime: { value: 0 },
      uLayGrow: { value: layGrow },
      uRestY: { value: REST_BASE },
      uZFar: { value: zFar },
      uZNear: { value: zNear },
      uSandX: { value: sandX0 },
    },
    side: THREE.DoubleSide,
  })
  const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat)
  edgeMesh.frustumCulled = false
  group.add(edgeMesh)
  disposables.push(edgeMat)

  /* ---- Lettering: one dark sett per grid cell `inkAt` calls ink — cheap
   * (CPU-side, per-instance) existence test only, same as the field's own;
   * the fragment shader above owns the actual edge, so a cell generated here
   * that turns out to be mostly NOT ink under the true mask just draws a
   * mostly-discarded quad, never a visual defect. No separate "background"
   * instance, since the field around it is already herringbone. ---- */
  let ni = 0
  let letterMat: THREE_NS.ShaderMaterial | null = null
  if (hasInk) {
    const cols = Math.max(1, Math.ceil(maskSpanX / settPitch))
    const rows = Math.max(1, Math.ceil(maskSpanZ / settPitch))
    const centres: { cx: number; cz: number }[] = []
    for (let sj = 0; sj < rows; sj++) {
      for (let si = 0; si < cols; si++) {
        const cx = maskRect.x0 + (si + 0.5) * settPitch
        const cz = maskRect.z0 + (sj + 0.5) * settPitch
        if (inkAt(cx, cz)) centres.push({ cx, cz })
      }
    }
    ni = centres.length
    const iCenter = new Float32Array(ni * 2)
    const iSeed = new Float32Array(ni)
    const iBirth = new Float32Array(ni)
    centres.forEach(({ cx, cz }, idx) => {
      const nx = Math.min(1, Math.max(0, (cx - maskRect.x0) / maskSpanX))
      const seed = rand()
      iCenter[idx * 2] = cx
      iCenter[idx * 2 + 1] = cz
      iSeed[idx] = seed
      iBirth[idx] = letterStart + (letterEnd - letterStart) * nx + (seed - 0.5) * 0.015
    })
    const letterGeo = new THREE.InstancedBufferGeometry()
    letterGeo.index = quad.index
    letterGeo.setAttribute('position', quad.getAttribute('position'))
    letterGeo.setAttribute('aCenter', new THREE.InstancedBufferAttribute(iCenter, 2))
    letterGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(iSeed, 1))
    letterGeo.setAttribute('aBirth', new THREE.InstancedBufferAttribute(iBirth, 1))
    letterGeo.instanceCount = ni
    disposables.push(letterGeo)

    letterMat = new THREE.ShaderMaterial({
      vertexShader: LETTER_VERT,
      fragmentShader:
        (opts.coarse ? '#define COARSE 1\n' : '') + letterFragSource(settCornerR, settChamfer, settBevelDepth, settJointDip),
      uniforms: {
        ...light,
        uP: { value: 0 },
        uTime: { value: 0 },
        uLayGrow: { value: letterGrow },
        uRestY: { value: REST_BASE },
        uSandX: { value: sandX0 },
        uPitch: { value: settPitch },
        uBodyHalf: { value: settBody / 2 },
        // letterInkTexture, NOT the field's own inkTexture — same source
        // canvas, deliberately a separate THREE.Texture object; see its
        // own comment above for why sharing one between the two materials
        // is a real, confirmed bug and not just extra caution.
        uInkTex: { value: letterInkTexture },
        uInkOrigin: { value: new THREE.Vector2(maskRect.x0, maskRect.z0) },
        uInkExtent: { value: new THREE.Vector2(maskSpanX, maskSpanZ) },
      },
      side: THREE.DoubleSide,
    })
    const letterMesh = new THREE.Mesh(letterGeo, letterMat)
    letterMesh.frustumCulled = false
    // Drawn after the field: it owns the cells it was cut out of, so it
    // paints over any field paver that only partly overlapped a letter's
    // cut edge (the fragment discard already keeps that paver's own body
    // outside it, but the two meshes don't need to agree to the sub-pixel).
    letterMesh.renderOrder = 1
    group.add(letterMesh)
    disposables.push(letterMat)
  }

  return {
    group,
    setProgress(p, time) {
      fieldMat.uniforms.uP.value = p
      fieldMat.uniforms.uTime.value = time
      edgeMat.uniforms.uP.value = p
      edgeMat.uniforms.uTime.value = time
      const sandT = Math.min(1, Math.max(0, (p - sandStart) / Math.max(1e-4, sandEnd - sandStart)))
      const sandX = sandX0 + (sandX1 - sandX0) * sandT
      fieldMat.uniforms.uSandX.value = sandX
      edgeMat.uniforms.uSandX.value = sandX
      if (letterMat) {
        letterMat.uniforms.uP.value = p
        letterMat.uniforms.uTime.value = time
        letterMat.uniforms.uSandX.value = sandX
      }
    },
    dispose() {
      for (const d of disposables) d.dispose()
    },
    info() {
      return { stones: n, courses: courseSet.size, edging: ei, lettering: ni }
    },
  }
}

/** Small, fast, seeded — same generator every scene file here uses. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
