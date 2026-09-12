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
 * Cutting, joints and the draw-call budget
 * ---------------------------------------------------------------------------
 * Budget is one draw call for the field and one for the edging, with no
 * per-frame CPU work. That rules out the soil/turf trick used elsewhere in
 * this codebase (an instanced layer with gaps, revealing a *separate* mesh
 * underneath for the joints) — there's no draw-call room for a backing
 * plane. So every instance's quad is sized to the FULL pitch cell (paver +
 * its share of the joint), and the fragment shader paints the joint margin
 * itself (a rounded-rect SDF separates "paver body" from "joint gap" within
 * one quad) — the same one-quad-many-materials trick `BLOOM_FRAG` uses for
 * petal vs. leaf vs. bud. A cut edge piece is just a paver quad that gets
 * `discard`ed wherever it falls outside the field rectangle in world space —
 * cheap, and for a 45°-rotated quad crossing a straight world-aligned line
 * that discard boundary *is* the triangular cut real herringbone shows at a
 * border, with no separate geometry needed for it.
 *
 * Laying and the accent swap both live entirely in the vertex shader, driven
 * by per-instance birth times, exactly as `letters.ts`'s flower field does it
 * — `growth()` there is `layT`/`accentT` here.
 */

import type * as THREE_NS from 'three'
import * as S from '../../stage/shaders'

export type PaverField = {
  group: THREE_NS.Group
  /** Scroll progress 0..1, and wall-clock seconds for anything that breathes. */
  setProgress(p: number, time: number): void
  dispose(): void
  info(): { stones: number; courses: number; accents: number }
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
function paverMetrics(coarse: boolean) {
  const shortBody = coarse ? SHORT_BODY_COARSE : SHORT_BODY
  const wp = shortBody + JOINT // short pitch (lattice module w)
  const lp = 2 * wp // long pitch
  const longBody = lp - JOINT // ~0.812 at desktop scale, not the nominal 0.8
  return { shortBody, wp, lp, longBody }
}

const CORNER_R = 0.026 // worn/rounded corner radius
const CHAMFER = 0.02 // bevel width at the top edge
const BEVEL_DEPTH = 0.006 // height drop across the chamfer
const JOINT_DIP = 0.014 // how far below the plateau the joint sits

const DROP_H = 0.15 // stones fall from this height, per the brief
const REST_BASE = 0.016 // resting paver-top height above the y=0 datum
const HEIGHT_JITTER = 0.014 // "a few millimetres" of per-stone height variation
const YAW_JITTER_DEG = 1.5
const ACCENT_LIFT = 0.05 // how far an accent stone rises during its swap

/* Edging (obrzeża): plain rectangular kerb units, no herringbone, laid end
 * to end along z on both long sides of the field. Exported so a page's own
 * scene file can size its field rectangle to leave exactly enough room for
 * the kerb without a second copy of this number. */
const EDGE_LONG = 1.2
export const EDGE_SHORT = 0.24
const EDGE_JOINT = 0.012

/* The joint-sand sweep (brief: "fills the joints with sand across the
 * frame"): a band `SAND_BAND` world units wide, moving in +x, transitions
 * every joint pixel from the raw dark gap to a sanded, sand-coloured one as
 * it passes — see `CONCRETE_SHADE`'s `sandT` and `createPaverField`'s
 * `sandWindow`. */
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
 * both the herringbone field and the plain edging kerbs, driven by whatever
 * `d` (signed distance to the paver body, negative = inside) the caller's
 * own SDF produced. Analytic normal from a fragment-local height field via
 * screen-space derivatives, same technique `SOIL_FRAG` uses, because a flat
 * instanced quad has no real geometry to bevel. */
const CONCRETE_SHADE = /* glsl */ `
vec3 concreteShade(float d, vec2 localP, float seed, vec3 world, float accentT, float uTime, float sandT) {
#ifndef COARSE
  float speck = voronoi((localP + seed * 71.0) * 14.0).x;
#else
  float speck = 0.5;
#endif

  float edgeT = smoothstep(-${CHAMFER.toFixed(4)}, 0.0, d);
  float hBody = mix(0.0, -${BEVEL_DEPTH.toFixed(4)}, edgeT);
#ifndef COARSE
  hBody += (speck - 0.5) * 0.0015;
#endif
  float jointT = smoothstep(0.0, ${CHAMFER.toFixed(4)}, d);
  float hJoint = mix(-${BEVEL_DEPTH.toFixed(4)}, -${JOINT_DIP.toFixed(4)}, jointT);
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
  // same colour whether it sits under a grey field stone or a basalt accent,
  // which is true of the real material.
  vec3 jointSand = vec3(0.15, 0.135, 0.105) * mix(0.92, 1.08, fract(seed * 23.0));
  vec3 jointC = mix(jointRaw, jointSand, sandT);
  vec3 c = d < 0.0 ? base : jointC;

  float ndl = max(dot(n, uSun), 0.0);
  vec3 lit = c * (uSky * 0.55 + uSunCol * ndl * 1.3);
  // The chamfer's own bright catch — the low sun raking across the bevel is
  // what actually reads as "chamfer" at this scale; the analytic normal
  // alone all but disappears once it's through the ACES grade.
  float rim = (1.0 - smoothstep(0.0, ${CHAMFER.toFixed(4)}, abs(d))) * step(d, 0.0);
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
 * swap width/height per orientation.
 * ------------------------------------------------------------------ */
const FIELD_VERT = /* glsl */ `
${EASE}
attribute vec2 aCenter;
attribute float aSign;
attribute float aSeed;
attribute float aBirth;
attribute float aAccentBirth;
uniform float uP;
uniform float uLayGrow;
uniform float uAccentGrow;
uniform float uRestY;
// (long pitch, short pitch) — the one thing 'coarse' changes about the
// lattice, so it travels as a uniform rather than a baked constant; see
// paverMetrics() on the JS side.
uniform vec2 uPitch;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vAccentT;
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

  // Sentinel aAccentBirth (> 1) on a non-accent stone means uP never reaches
  // it, so accentT — and the lift it drives — stays exactly 0 with no extra
  // boolean attribute needed.
  float accentT = clamp((uP - aAccentBirth) / uAccentGrow, 0.0, 1.0);
  y += sin(accentT * 3.14159265) * ${ACCENT_LIFT.toFixed(4)};

  float yaw = aSign * 45.0 * ${DEG.toFixed(8)} + (fract(aSeed * 17.0) - 0.5) * ${(2 * YAW_JITTER_DEG * DEG).toFixed(8)};
  float born = step(aBirth, uP);
  vec2 world2 = aCenter + rot(local, yaw) * born;
  vWorld = vec3(world2.x, y, world2.y);
  vAccentT = accentT;
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
varying vec2 vLocal;
varying vec3 vWorld;
varying float vAccentT;
varying float vSeed;

void main() {
  // The cut edge: a straight discard against the field rectangle. For a
  // paver rotated ±45° and straddling that line, this alone produces the
  // triangular cut piece a real herringbone border shows — no extra geometry.
  if (vWorld.x < uX0 || vWorld.x > uX1 || vWorld.z < uZFar || vWorld.z > uZNear) discard;

  float d = roundedBoxSDF(vLocal, uBodyHalf - vec2(${CORNER_R.toFixed(4)}), ${CORNER_R.toFixed(4)});
  // 0 before the sand-sweep has reached this fragment's world x, 1 after —
  // see createPaverField's sandWindow (JS side) for how uSandX moves over time.
  float sandT = clamp((uSandX - vWorld.x) / ${SAND_BAND.toFixed(3)} + 0.5, 0.0, 1.0);
  vec3 lit = concreteShade(d, vLocal, vSeed, vWorld, vAccentT, uTime, sandT);
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
  vec3 lit = concreteShade(d, vLocal, vSeed, vWorld, 0.0, uTime, sandT);
  gl_FragColor = vec4(finish(lit), 1.0);
}
`

type Stone = {
  cx: number
  cz: number
  sign: 1 | -1
  seed: number
  courseN: number
  isAccent: boolean
  accentOrder: number
}

export function createPaverField(
  THREE: typeof import('three'),
  opts: {
    x0: number
    x1: number
    zFar: number
    zNear: number
    accents: { x: number; z: number; order: number }[]
    light: Record<string, { value: unknown }>
    coarse: boolean
    seed?: number
    layWindow: [number, number]
    accentWindow: [number, number]
    sandWindow: [number, number]
  },
): PaverField {
  const rand = mulberry32(opts.seed ?? 20260912)
  const disposables: { dispose(): void }[] = []
  const group = new THREE.Group()
  const { x0, x1, zFar, zNear, light } = opts
  const { wp, lp, longBody, shortBody } = paverMetrics(opts.coarse)

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
        if (w.x > x0 - pad && w.x < x1 + pad && w.z > zFar - pad && w.z < zNear + pad) {
          stones.push({ cx: w.x, cz: w.z, sign: 1, seed: rand(), courseN: n, isAccent: false, accentOrder: 0 })
          courseSet.add(n)
        }
      }
      // Vertical-family corner, offset by (2Wp,0) in local (u,v) from H's.
      {
        const cu = lp - wp * m + lp * n + wp / 2
        const cv = wp * m + lp * n + lp / 2
        const w = toWorld(cu, cv)
        if (w.x > x0 - pad && w.x < x1 + pad && w.z > zFar - pad && w.z < zNear + pad) {
          stones.push({ cx: w.x, cz: w.z, sign: -1, seed: rand(), courseN: n, isAccent: false, accentOrder: 0 })
          courseSet.add(n)
        }
      }
    }
  }

  // Match ink points to the stone whose footprint contains them. Bucketed by
  // rounded centre so a headline's worth of accent points doesn't mean an
  // O(points × stones) scan.
  const bucketSize = lp
  const buckets = new Map<string, number[]>()
  stones.forEach((s, i) => {
    const key = `${Math.round(s.cx / bucketSize)},${Math.round(s.cz / bucketSize)}`
    const list = buckets.get(key)
    if (list) list.push(i)
    else buckets.set(key, [i])
  })
  // Matched against a small zone around the paver's own CENTRE, not its full
  // body — literally "the pavers whose centres land on ink" (brief). Tried
  // the full footprint first (any ink sample anywhere inside the paver's
  // body claims it): a paver's own body is comparable in size to a letter's
  // stroke width at the em this headline actually sets at, so that matched
  // almost every paver touching a letter ANYWHERE, filling in every counter
  // and inter-letter gap and fusing whole words into one solid bar. A tight
  // centre zone means a paver only lights up when ink genuinely sits under
  // its middle, which is what keeps the gaps between strokes as field stone.
  const halfLong = longBody / 2
  const halfShort = shortBody / 2
  const CENTRE_TOL = 0.4
  function containsPoint(s: Stone, px: number, pz: number) {
    const angle = s.sign * 45 * DEG
    const dx = px - s.cx
    const dz = pz - s.cz
    const c = Math.cos(-angle)
    const sn = Math.sin(-angle)
    const lx = dx * c - dz * sn
    const lz = dx * sn + dz * c
    return Math.abs(lx) <= halfLong * CENTRE_TOL && Math.abs(lz) <= halfShort * CENTRE_TOL
  }
  for (const pt of opts.accents) {
    const bx = Math.round(pt.x / bucketSize)
    const bz = Math.round(pt.z / bucketSize)
    for (let dxk = -1; dxk <= 1; dxk++) {
      for (let dzk = -1; dzk <= 1; dzk++) {
        const idxs = buckets.get(`${bx + dxk},${bz + dzk}`)
        if (!idxs) continue
        for (const i of idxs) {
          if (!containsPoint(stones[i], pt.x, pt.z)) continue
          if (!stones[i].isAccent || pt.order < stones[i].accentOrder) {
            stones[i].isAccent = true
            stones[i].accentOrder = pt.order
          }
        }
      }
    }
  }

  // Birth times: every stone in a course shares (almost) the same world z —
  // the lattice's own basis is world-axis-aligned, see the header comment —
  // so timing keys straight off each stone's own centre z against the
  // camera-visible field, not off the lattice loop's own (padded) range;
  // otherwise part of the window is spent animating stones that start out
  // behind the visible far edge, and the visible lay reads as delayed.
  const [layStart, layEnd] = opts.layWindow
  const [accentStart, accentEnd] = opts.accentWindow
  const [sandStart, sandEnd] = opts.sandWindow
  const layGrow = Math.max(0.015, (layEnd - layStart) * 0.12)
  const accentGrow = Math.max(0.012, (accentEnd - accentStart) * 0.22)
  // The sweep runs from just left of the field to just right of it, so a
  // fragment right at x0/x1 still gets the same soft transition as one in
  // the middle instead of starting/ending already half-sanded.
  const sandX0 = x0 - SAND_BAND
  const sandX1 = x1 + SAND_BAND

  const n = stones.length
  const aCenter = new Float32Array(n * 2)
  const aSign = new Float32Array(n)
  const aSeed = new Float32Array(n)
  const aBirth = new Float32Array(n)
  const aAccentBirth = new Float32Array(n)
  let accentCount = 0
  stones.forEach((s, i) => {
    const courseT = Math.min(1, Math.max(0, (s.cz - zFar) / Math.max(1e-3, zNear - zFar)))
    aCenter[i * 2] = s.cx
    aCenter[i * 2 + 1] = s.cz
    aSign[i] = s.sign
    aSeed[i] = s.seed
    aBirth[i] = layStart + (layEnd - layStart) * courseT + (s.seed - 0.5) * 0.03
    if (s.isAccent) {
      accentCount++
      aAccentBirth[i] = accentStart + (accentEnd - accentStart) * Math.min(1, Math.max(0, s.accentOrder)) + (s.seed - 0.5) * 0.015
    } else {
      aAccentBirth[i] = 2 // sentinel: uP (0..1) never reaches it
    }
  })

  const quad = new THREE.PlaneGeometry(1, 1)
  const fieldGeo = new THREE.InstancedBufferGeometry()
  fieldGeo.index = quad.index
  fieldGeo.setAttribute('position', quad.getAttribute('position'))
  fieldGeo.setAttribute('aCenter', new THREE.InstancedBufferAttribute(aCenter, 2))
  fieldGeo.setAttribute('aSign', new THREE.InstancedBufferAttribute(aSign, 1))
  fieldGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1))
  fieldGeo.setAttribute('aBirth', new THREE.InstancedBufferAttribute(aBirth, 1))
  fieldGeo.setAttribute('aAccentBirth', new THREE.InstancedBufferAttribute(aAccentBirth, 1))
  fieldGeo.instanceCount = n
  disposables.push(quad, fieldGeo)

  const fieldMat = new THREE.ShaderMaterial({
    vertexShader: FIELD_VERT,
    fragmentShader: (opts.coarse ? '#define COARSE 1\n' : '') + FIELD_FRAG,
    uniforms: {
      ...light,
      uP: { value: 0 },
      uTime: { value: 0 },
      uLayGrow: { value: layGrow },
      uAccentGrow: { value: accentGrow },
      uRestY: { value: REST_BASE },
      uX0: { value: x0 },
      uX1: { value: x1 },
      uZFar: { value: zFar },
      uZNear: { value: zNear },
      uSandX: { value: sandX0 },
      uPitch: { value: new THREE.Vector2(lp, wp) },
      uBodyHalf: { value: new THREE.Vector2(longBody / 2, shortBody / 2) },
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
    },
    dispose() {
      for (const d of disposables) d.dispose()
    },
    info() {
      return { stones: n, courses: courseSet.size, accents: accentCount }
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
