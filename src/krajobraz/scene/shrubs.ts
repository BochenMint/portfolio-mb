/**
 * The border planting: low shrubs around the edge of the lawn.
 *
 * This began as a grove of small trees, and the trees were wrong — not
 * badly drawn, just wrong for the job (Marcin 2026-09: "usuń drzewa —
 * zasłaniają"). At this camera's 24° tilt a canopy raised half a metre off
 * the ground projects a long way toward the middle of the frame, so a tree
 * planted safely outside the bed still ended up lying across the words. A
 * shrub cannot do that: it is a mound sitting ON the ground, its own height
 * is a fraction of a tree's, and what it projects over the lawn is the
 * width of a bucket rather than the width of a room.
 *
 * So: mounds, not canopies; no trunks at all (a box ball seen from almost
 * overhead has no visible stem, and drawing one cost a whole draw call for
 * nothing); short soft shadows instead of long ones; and enough of them to
 * read as a planted border rather than as scattered bushes.
 *
 * Two draw calls: every leaf mass of every shrub in one instanced mesh, and
 * every ground shadow in another — the same trick the turf and the flower
 * bed use, with plain per-instance attributes rather than `THREE.InstancedMesh`
 * because the shader needs the per-blob radii and the shrub id back. `three`
 * is passed in, never imported at module scope, same as everywhere else here.
 */

import type * as THREE_NS from 'three'
import { LIGHT, NOISE } from '../../stage/shaders'

export type Shrubs = {
  group: THREE_NS.Group
  /** Per frame: wind time, and the scene progress 0..1. */
  update(time: number, progress: number): void
  dispose(): void
  /** For the debug harness. */
  info(): { shrubs: number; blobs: number }
}

/** Upper bound on shrub count, sized so the per-shrub uniform arrays below
 *  never need to grow — a border of 18 is the most the widest screen asks for. */
const MAX_SHRUBS = 24

/* ------------------------------------------------------------------ *
 * Leaf mass — a cluster of squashed-sphere blobs per shrub, one instanced
 * draw for every blob of every shrub. The silhouette break comes entirely
 * from fragment alpha (noise + alphaToCoverage), same trick the grass and
 * the bloom shader use, so the base mesh can stay a cheap low-detail
 * icosahedron and still not read as a bead.
 * ------------------------------------------------------------------ */
const LEAF_VERT = /* glsl */ `
attribute vec3 aCenter;
attribute vec3 aRadii;
attribute float aSeed;
attribute float aShrubId;
uniform float uTime;
uniform float uWindAmp;
uniform float uShrubSeed[${MAX_SHRUBS}];
varying vec3 vNormal;
varying vec3 vWorld;
varying float vSeed;
varying float vShrubId;
void main() {
  // The ellipsoid's true outward normal is the sphere normal divided by the
  // per-axis radius, not the squashed position — dividing the other way
  // (multiplying) tilts the shading toward whichever axis is longest.
  vNormal = normalize(normal / aRadii);
  vSeed = aSeed;
  vShrubId = aShrubId;
  float phase = uShrubSeed[int(aShrubId)] * 6.2831853;
  // A whole shrub moves together, and it moves less than a tree would: a
  // mound of box is a stiff thing, and the page is calm.
  vec2 sway = vec2(sin(uTime * 0.7 + phase), cos(uTime * 0.5 + phase * 1.7)) * uWindAmp;
  vec3 world = aCenter + position * aRadii + vec3(sway.x, 0.0, sway.y);
  vWorld = world;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`

const LEAF_FRAG = /* glsl */ `
${NOISE}
${LIGHT}
uniform float uTime;
uniform float uShrubWarmth[${MAX_SHRUBS}];
uniform float uShrubBloom[${MAX_SHRUBS}];
varying vec3 vNormal;
varying vec3 vWorld;
varying float vSeed;
varying float vShrubId;
void main() {
  vec3 N = normalize(vNormal);
  float up = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);

  // A couple of shrubs run warmer — the olive of a lavender or a santolina
  // among the box green — picked once per shrub and read back through its
  // id. Kept muted (R and G close, neither near 1) so it reads as foliage.
  float warmth = uShrubWarmth[int(vShrubId)];
  vec3 topCool = vec3(0.082, 0.168, 0.062);
  vec3 topWarm = vec3(0.135, 0.13, 0.058);
  vec3 topC = mix(topCool, topWarm, warmth);
  vec3 underC = vec3(0.022, 0.044, 0.026);
  vec3 base = mix(underC, topC, smoothstep(0.05, 0.85, up));

  /* Leaf texture, in WORLD space rather than across the blob's own normal.
     That is the whole difference between planting and a smudge: foliage is
     made of leaf clumps a hand across, and their size on screen has to come
     from how big a hand is, not from how big the blob is. Reading the noise
     off the normal (which is what this did first) scales the clumps with the
     blob, so a mass filling a corner of the frame came out as three soft
     lobes — an out-of-focus stain over the lawn.

     Projected onto the surface's own tangent plane, not onto the ground: a
     mass at the edge of the frame is seen half side-on, and there its world
     xz barely changes across the visible face, so a ground projection
     stretched the clumps into smooth streaks. A tangent-plane projection
     keeps one constant world scale whichever way the surface faces. */
  vec3 ref = abs(N.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 tA = normalize(cross(ref, N));
  vec3 tB = cross(N, tA);
  vec2 lp = vec2(dot(vWorld, tA), dot(vWorld, tB)) + vSeed * 31.0;
  float clump = fbm3(lp * 5.0);
  float leaf = fbm3(lp * 14.0 + 4.0);
  float fleck = vnoise(lp * 30.0);

  /* The normal follows the leaf clumps, not the ellipsoid. This is the one
     change that turns a blob into foliage: light a smooth sphere however
     carefully you like and it still reads as a ball, because every cue the
     eye uses for "many small things" lives in how the surface faces, not in
     how it is coloured. Two extra taps of the same noise give its gradient,
     and bending the normal along that gradient lets each clump catch or
     lose the sun on its own. */
  float e = 0.09;
  float gx = fbm3(lp * 5.0 + vec2(e, 0.0)) - clump;
  float gy = fbm3(lp * 5.0 + vec2(0.0, e)) - clump;
  vec3 Nl = normalize(N + (tA * gx + tB * gy) * 5.5);

  /* Silhouette. The blob's own edge (where the normal turns away from the
     camera) sets how much of the noise bites: deep at the rim, barely at
     the centre, so the mass is ragged at its outline and solid in the
     middle — a uniform threshold ate holes through the middle instead. */
  float rim = smoothstep(0.75, 0.05, abs(N.z) * 0.35 + up * 0.65);
  float bite = pow(clump, 1.35) * 0.58 + leaf * 0.42;
  float alpha = smoothstep(0.27, 0.36, bite - rim * 0.8 + 0.26 + (fleck - 0.5) * 0.34);
  if (alpha < 0.04) discard;

  // Clumps of leaf catch the light and the gaps between them fall away into
  // the depth of the shrub; the fleck is the individual leaf, just enough to
  // break the clumps up without turning into noise.
  float open = smoothstep(0.3, 0.75, clump);
  base *= mix(0.34, 1.55, open) * mix(0.72, 1.28, leaf) * (0.88 + 0.24 * fleck);

  float ndl = max(dot(Nl, uSun), 0.0);
  // A slow shimmer, per blob: leaf masses brightening as they turn to the
  // sun. Additive and small, so it can't multiply the whole blob past white.
  float shimmer = 0.5 + 0.5 * sin(uTime * 0.6 + vSeed * 23.0);
  vec3 lit = base * (uSky * 0.5 + uSunCol * (0.3 + 0.72 * ndl));
  lit += base * uSunCol * shimmer * ndl * 0.12;
  // Sunlit leaves on top of the clumps, which is what stops foliage from
  // reading as one flat tone the moment it is bigger than a thumbnail.
  lit += uSunCol * pow(open, 2.6) * ndl * 0.12;

  // Some of the border is in flower: a spirea or a hydrangea carries its
  // blossom in small heads sitting proud of the leaf. Thresholded high and
  // kept off the shaded side, so it reads as flower rather than as dust —
  // and it is the bed's own cream, not a new colour on the page.
  float bloom = uShrubBloom[int(vShrubId)];
  if (bloom > 0.0) {
    float heads = smoothstep(0.58, 0.86, vnoise(lp * 34.0 + 11.0)) * bloom * smoothstep(0.15, 0.6, up);
    lit = mix(lit, vec3(0.52, 0.47, 0.36) * (uSky * 0.4 + uSunCol * (0.4 + 0.6 * ndl)), heads * 0.85);
  }
  gl_FragColor = vec4(finish(lit), alpha);
}
`

/* ------------------------------------------------------------------ *
 * Ground shadow — one soft ellipse per leaf mass, elongated along the
 * sun's ground direction. Same soft radial falloff as BLOB_FRAG in
 * stage/shaders.ts, stretched anisotropically in the vertex stage and
 * instanced instead of one mesh per roll. A shrub's shadow is short: the
 * thing casting it is knee high.
 * ------------------------------------------------------------------ */
const SHADOW_VERT = /* glsl */ `
attribute vec2 aCenter;
attribute vec2 aSize;
attribute float aAlpha;
uniform vec2 uShadowDir;
varying vec2 vUv;
varying vec2 vWorldXZ;
varying float vAlpha;
void main() {
  vec2 dir = normalize(uShadowDir);
  vec2 perp = vec2(-dir.y, dir.x);
  vec2 local = dir * position.x * aSize.x + perp * position.y * aSize.y;
  // Sits a little above where the tallest grass blade could reach (turf tops
  // out around 0.18 in gardenScene's own units) so it depth-tests in front
  // of the lawn instead of being lost behind blade tips — the same problem
  // the roll shadow solves by sitting just above GRASS_H there.
  vec3 world = vec3(aCenter.x + local.x, 0.2, aCenter.y + local.y);
  vUv = position.xy + 0.5;
  vWorldXZ = world.xz;
  vAlpha = aAlpha;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`

const SHADOW_FRAG = /* glsl */ `
${NOISE}
varying vec2 vUv;
varying vec2 vWorldXZ;
varying float vAlpha;
void main() {
  vec2 d = (vUv - 0.5) * 2.0;
  float r = length(d);
  float a = (1.0 - smoothstep(0.1, 1.0, r)) * vAlpha;
  // Dappled, not a hole in the lawn: foliage leaks light through every gap
  // between its leaf clumps, and the gaps get wider toward the edge of the
  // shadow. A solid ellipse read as a smudge on the grass — the one thing a
  // garden photographed in low sun never has.
  float gaps = fbm3(vWorldXZ * 4.5) * 0.65 + fbm3(vWorldXZ * 11.0 + 3.0) * 0.35;
  a *= mix(0.45, 1.0, smoothstep(0.28, 0.72, gaps + (1.0 - r) * 0.25));
  // Shade is sky-lit, so it is blue-grey rather than black.
  gl_FragColor = vec4(0.02, 0.035, 0.05, a);
}
`

type ShrubSpec = {
  x: number
  z: number
  /** Centre of the mound above the ground. */
  height: number
  /** Nominal radius; individual blobs vary around this. */
  r: number
  warmth: number
  bloom: number
  seed: number
}

export function createShrubs(
  THREE: typeof import('three'),
  opts: {
    /** Half width of the visible ground at the far edge and at the near edge. */
    halfFar: number
    halfNear: number
    /** z of the far and near edges of the visible ground. */
    zFar: number
    zNear: number
    /** The flower bed, in world units: nothing may stand on or shade this. */
    bed: { centreZ: number; halfDepth: number; halfWidth: number }
    /** Light uniforms to share: { uSun, uSunCol, uSky }. */
    light: Record<string, { value: unknown }>
    /** Fewer, simpler shrubs when true (phones). */
    coarse: boolean
    /** Deterministic placement. */
    seed?: number
  },
): Shrubs {
  const rand = mulberry32(opts.seed ?? 20260912)
  const group = new THREE.Group()
  const disposables: { dispose(): void }[] = []

  const depth = opts.zNear - opts.zFar
  const halfAt = (z: number) => {
    const t = (z - opts.zFar) / depth
    return opts.halfFar + (opts.halfNear - opts.halfFar) * t
  }

  const bedZMin = opts.bed.centreZ - opts.bed.halfDepth
  const bedZMax = opts.bed.centreZ + opts.bed.halfDepth
  const bedHalfW = opts.bed.halfWidth

  const sun = opts.light.uSun.value as THREE_NS.Vector3
  const shadowDir = { x: -sun.x / sun.y, z: -sun.z / sun.y }

  const groundScale = Math.max(1.4, depth)
  /**
   * How big a shrub is. The scene is about 2.5 m of ground across, so a
   * mound of 0.4–0.7 m reads as a clipped box ball or a lavender — which is
   * what a lawn edge is planted with, and small enough that it can never
   * become the thing the visitor looks at. The trees this replaced were four
   * times the radius and twice as tall, and that is exactly why they landed
   * on the headline.
   */
  const base = groundScale * (opts.coarse ? 0.095 : 0.088)

  /** Does this footprint, and the shadow it throws, clear the headline? */
  function clearsBed(s: ShrubSpec) {
    const reach = s.r * 1.15
    const sx = s.x + shadowDir.x * s.height
    const sz = s.z + shadowDir.z * s.height
    const outside = (x: number, z: number, m: number) =>
      x < -bedHalfW - m || x > bedHalfW + m || z < bedZMin - m || z > bedZMax + m
    return outside(s.x, s.z, reach) && outside(sx, sz, s.r * 0.7)
  }

  function makeShrub(x: number, z: number, side: -1 | 0 | 1): ShrubSpec | null {
    const r = base * (0.72 + rand() * 0.62)
    // A mound, not a ball on a stick: the centre sits at about six tenths of
    // the radius, so the ellipsoid's underside meets the lawn and its top is
    // roughly one radius off the ground.
    const height = r * (0.5 + rand() * 0.22)
    const s: ShrubSpec = {
      x,
      z,
      height,
      r,
      warmth: rand() < 0.35 ? 0.5 + rand() * 0.5 : 0,
      // One in four is in flower. More than that and the border starts
      // competing with the bed, which is the only thing here worth reading.
      bloom: rand() < 0.25 ? 0.55 + rand() * 0.45 : 0,
      seed: rand(),
    }
    // Nudge outward until it clears the words; give up rather than place
    // something on top of them.
    for (let i = 0; i < 12 && !clearsBed(s); i++) {
      if (side === 0) s.z -= s.r * 0.4
      else s.x += side * s.r * 0.4
    }
    return clearsBed(s) ? s : null
  }

  /* Composition: a border strung along the far edge with irregular spacing,
     and a few down each side so the planting turns the corner. Everything
     sits just outside the visible ground, close enough that the mounds
     break the frame edge rather than hiding behind it. */
  const count = opts.coarse ? 7 + Math.floor(rand() * 3) : 12 + Math.floor(rand() * 5)
  const nFar = Math.max(3, Math.round(count * 0.55))
  const nSide = count - nFar
  const nLeft = Math.ceil(nSide / 2)

  const shrubs: ShrubSpec[] = []
  const farHalfW = halfAt(opts.zFar) * 1.15
  for (let i = 0; i < nFar; i++) {
    // Irregular spacing: a real border is planted by hand, and two of them
    // always end up closer together than the rest.
    const bin = (i + 0.5) / nFar + (rand() - 0.5) * (0.8 / nFar)
    const x = -farHalfW + bin * 2 * farHalfW
    const s = makeShrub(x, opts.zFar - base * (0.15 + rand() * 0.5), 0)
    if (s) shrubs.push(s)
  }
  for (let i = 0; i < nSide; i++) {
    const side: -1 | 1 = i < nLeft ? -1 : 1
    const z = opts.zFar + depth * (0.08 + rand() * 0.8)
    const s = makeShrub(side * (halfAt(z) + base * (0.1 + rand() * 0.5)), z, side)
    if (s) shrubs.push(s)
  }

  /* ---- Leaf masses, 3–5 per shrub ---- */
  type Mass = { cx: number; cy: number; cz: number; rx: number; ry: number; rz: number; seed: number; shrubId: number }
  const masses: Mass[] = []
  shrubs.forEach((s, shrubId) => {
    const n = opts.coarse ? 3 : 3 + Math.floor(rand() * 3)
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2
      const spread = s.r * (0.1 + rand() * 0.38)
      const rad = s.r * (0.6 + rand() * 0.42)
      masses.push({
        cx: s.x + Math.cos(a) * spread,
        cy: s.height + (rand() - 0.4) * s.r * 0.3,
        cz: s.z + Math.sin(a) * spread,
        rx: rad * (0.9 + rand() * 0.25),
        // Squashed: a shrub is wider than it is tall, and a sphere at this
        // camera angle reads as a ball dropped on the lawn.
        ry: rad * (0.52 + rand() * 0.18),
        rz: rad * (0.9 + rand() * 0.25),
        seed: rand(),
        shrubId,
      })
    }
  })

  /* ---- Leaf mesh ---- */
  const icosaBase = new THREE.IcosahedronGeometry(1, 2)
  const leafGeo = new THREE.InstancedBufferGeometry()
  leafGeo.index = icosaBase.index
  leafGeo.setAttribute('position', icosaBase.getAttribute('position'))
  leafGeo.setAttribute('normal', icosaBase.getAttribute('normal'))
  const mN = masses.length
  const aCenter = new Float32Array(mN * 3)
  const aRadii = new Float32Array(mN * 3)
  const aSeed = new Float32Array(mN)
  const aShrubId = new Float32Array(mN)
  masses.forEach((m, i) => {
    aCenter.set([m.cx, m.cy, m.cz], i * 3)
    aRadii.set([m.rx, m.ry, m.rz], i * 3)
    aSeed[i] = m.seed
    aShrubId[i] = m.shrubId
  })
  leafGeo.setAttribute('aCenter', new THREE.InstancedBufferAttribute(aCenter, 3))
  leafGeo.setAttribute('aRadii', new THREE.InstancedBufferAttribute(aRadii, 3))
  leafGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1))
  leafGeo.setAttribute('aShrubId', new THREE.InstancedBufferAttribute(aShrubId, 1))
  leafGeo.instanceCount = mN

  const seedArr = new Array(MAX_SHRUBS).fill(0)
  const warmthArr = new Array(MAX_SHRUBS).fill(0)
  const bloomArr = new Array(MAX_SHRUBS).fill(0)
  shrubs.forEach((s, i) => {
    seedArr[i] = s.seed
    warmthArr[i] = s.warmth
    bloomArr[i] = s.bloom
  })

  const leafMat = new THREE.ShaderMaterial({
    vertexShader: LEAF_VERT,
    fragmentShader: LEAF_FRAG,
    uniforms: {
      ...opts.light,
      uTime: { value: 0 },
      uWindAmp: { value: 0 },
      uShrubSeed: { value: seedArr },
      uShrubWarmth: { value: warmthArr },
      uShrubBloom: { value: bloomArr },
    },
    alphaToCoverage: true,
  })
  const leafMesh = new THREE.Mesh(leafGeo, leafMat)
  leafMesh.frustumCulled = false
  leafMesh.renderOrder = 7
  group.add(leafMesh)
  disposables.push(icosaBase, leafGeo, leafMat)

  /* ---- Ground shadow mesh: one soft ellipse per leaf mass ---- */
  const quadBase = new THREE.PlaneGeometry(1, 1)
  const shadowGeo = new THREE.InstancedBufferGeometry()
  shadowGeo.index = quadBase.index
  shadowGeo.setAttribute('position', quadBase.getAttribute('position'))
  const sCenter = new Float32Array(mN * 2)
  const sSize = new Float32Array(mN * 2)
  const sAlpha = new Float32Array(mN)
  masses.forEach((m, i) => {
    const rAvg = (m.rx + m.rz) / 2
    sCenter.set([m.cx + shadowDir.x * m.cy, m.cz + shadowDir.z * m.cy], i * 2)
    sSize.set([rAvg * 1.55, rAvg * 0.95], i * 2)
    sAlpha[i] = 0.34 + rand() * 0.12
  })
  shadowGeo.setAttribute('aCenter', new THREE.InstancedBufferAttribute(sCenter, 2))
  shadowGeo.setAttribute('aSize', new THREE.InstancedBufferAttribute(sSize, 2))
  shadowGeo.setAttribute('aAlpha', new THREE.InstancedBufferAttribute(sAlpha, 1))
  shadowGeo.instanceCount = mN

  const shadowMat = new THREE.ShaderMaterial({
    vertexShader: SHADOW_VERT,
    fragmentShader: SHADOW_FRAG,
    uniforms: { uShadowDir: { value: new THREE.Vector2(shadowDir.x, shadowDir.z) } },
    transparent: true,
    depthWrite: false,
  })
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
  shadowMesh.frustumCulled = false
  shadowMesh.renderOrder = 2
  group.add(shadowMesh)
  disposables.push(quadBase, shadowGeo, shadowMat)

  return {
    group,
    update(time, progress) {
      leafMat.uniforms.uTime.value = time
      // The border stirs a little more once the lawn is down and the bed is
      // in — the scene warms up rather than starting at full breeze.
      leafMat.uniforms.uWindAmp.value = base * 0.012 * (0.6 + 0.4 * progress)
    },
    dispose() {
      for (const d of disposables) d.dispose()
    },
    info: () => ({ shrubs: shrubs.length, blobs: mN }),
  }
}

/** Small, fast, seeded — the border must come out the same on every visit. */
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
