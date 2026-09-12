/**
 * The plantings: a few shrubs that go in once the lawn is down.
 *
 * Two attempts preceded this one. Trees were wrong for the camera — at a 24°
 * tilt a raised canopy projects far toward the middle of the frame, so a tree
 * planted safely outside the bed still lay across the headline. Mounds of
 * noise-alpha replaced them and were wrong for a different reason (Marcin
 * 2026-09: "te nie wyglądają dobrze"): a squashed ellipsoid lit by a shader,
 * however carefully its silhouette is nibbled, reads as a striped green ball.
 * Every cue the eye uses for "a plant" lives in the fact that a plant is made
 * of hundreds of separate leaves, each catching the light at its own angle.
 *
 * So a shrub here is not a surface. It is 60–130 instanced leaves arranged on
 * a mound, each with its own direction, size, tilt and shade, and the
 * silhouette is whatever those leaves happen to make. One draw call for every
 * leaf of every shrub, one more for the ground shadows.
 *
 * They are planted rather than pre-existing, too: the soil is prepared, the
 * turf goes down, and only then do the shrubs go in, left to right, each
 * unfurling its own leaves — the order the visitor watches the garden being
 * built in, and now the order the scroll tells it in.
 */

import type * as THREE_NS from 'three'
import { LIGHT, NOISE } from '../../stage/shaders'

export type Shrubs = {
  group: THREE_NS.Group
  /** Per frame: wind time, and scroll progress (which plants them). */
  update(time: number, progress: number): void
  dispose(): void
  info(): { shrubs: number; leaves: number }
}

/** Upper bound on shrub count, sized so the per-shrub uniform arrays below
 *  never need to grow. */
const MAX_SHRUBS = 12

/* ------------------------------------------------------------------ *
 * Leaves — one instanced quad each, oriented by the direction it grows
 * out of the mound. The quad is cut into a leaf in the fragment stage (a
 * pointed ellipse with a midrib), which costs nothing and keeps the base
 * geometry at two triangles.
 * ------------------------------------------------------------------ */
const LEAF_VERT = /* glsl */ `
attribute vec3 aCentre;
attribute vec3 aDir;
attribute vec3 aUp;
attribute vec2 aSize;
attribute float aSeed;
attribute float aShrubId;
attribute float aBirth;
uniform float uTime;
uniform float uWind;
uniform float uGrow[${MAX_SHRUBS}];
varying vec2 vLeaf;
varying vec3 vNormal;
varying float vSeed;
varying float vShrubId;
varying float vScale;
void main() {
  float g = clamp((uGrow[int(aShrubId)] - aBirth) / 0.4, 0.0, 1.0);
  // A leaf unfurls: it scales past its size and settles back, which is what
  // stops a planting from looking like it was switched on.
  float ease = g * g * (3.0 - 2.0 * g);
  float scale = ease * (1.0 + 0.16 * sin(ease * 3.14159));

  vec3 dir = normalize(aDir);
  vec3 up = normalize(aUp - dir * dot(aUp, dir));
  vec3 side = cross(up, dir);

  // Wind: the whole shrub leans and each leaf flutters around its own axis.
  // Small — this is a box ball, not a willow.
  float phase = aSeed * 6.2831853 + aShrubId * 1.7;
  float gust = 0.5 * sin(uTime * 1.1 + phase) + 0.5 * sin(uTime * 0.37 + phase * 2.3);
  vec3 sway = vec3(gust, 0.0, gust * 0.6) * uWind;
  float flutter = gust * 0.14;

  // position.xy is the quad's own −0.5…0.5; its y runs along the leaf, which
  // is anchored at the stem rather than centred, so it grows outward.
  vec2 q = position.xy * aSize * scale;
  vec3 world =
    aCentre +
    sway +
    side * (q.x * cos(flutter)) +
    up * (q.y + aSize.y * 0.5 * scale) +
    dir * (-abs(q.x) * 0.12 + q.y * flutter * 0.3);

  vLeaf = position.xy * 2.0;
  vNormal = normalize(dir + up * flutter * 0.5);
  vSeed = aSeed;
  vShrubId = aShrubId;
  vScale = scale;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`

const LEAF_FRAG = /* glsl */ `
${NOISE}
${LIGHT}
uniform float uWarmth[${MAX_SHRUBS}];
varying vec2 vLeaf;
varying vec3 vNormal;
varying float vSeed;
varying float vShrubId;
varying float vScale;
void main() {
  if (vScale < 0.02) discard;

  /* The leaf itself: widest a third of the way up, drawn to a point. The
     shape carries more than any amount of texture — a rectangle of green
     reads as a rectangle however it is shaded. */
  float t = clamp(vLeaf.y * 0.5 + 0.5, 0.0, 1.0);
  float halfW = 0.5 * sin(3.14159 * pow(t, 0.72)) * (1.0 - 0.25 * t);
  float d = abs(vLeaf.x * 0.5) - halfW;
  if (d > 0.0) discard;

  float warmth = uWarmth[int(vShrubId)];
  vec3 deep = mix(vec3(0.018, 0.045, 0.016), vec3(0.035, 0.04, 0.014), warmth);
  vec3 fresh = mix(vec3(0.085, 0.2, 0.055), vec3(0.13, 0.15, 0.05), warmth);
  // Old leaves sit low and dark, new growth is at the tips and lighter.
  vec3 c = mix(deep, fresh, smoothstep(0.1, 0.95, t) * (0.55 + 0.45 * hash12(vec2(vSeed * 37.0, 3.1))));
  c *= 0.82 + 0.36 * hash12(vec2(vSeed * 91.0, 7.7));

  // Midrib and a hint of veins: thin, dark, and the detail that survives at
  // four pixels a leaf to say "leaf" on its own.
  float rib = 1.0 - smoothstep(0.0, 0.055, abs(vLeaf.x * 0.5));
  float veins = smoothstep(0.55, 0.95, abs(sin(vLeaf.y * 9.0 + vLeaf.x * 3.0)));
  c *= 1.0 - rib * 0.28 - veins * 0.06 * (1.0 - rib);

  vec3 N = normalize(vNormal);
  float ndl = max(dot(N, uSun), 0.0);
  // A leaf is thin, so the sun behind it comes through. That glow is most of
  // what separates foliage from painted plastic.
  float through = pow(max(dot(-N, uSun), 0.0), 1.6) * 0.5;
  vec3 lit = c * (uSky * 0.45 + uSunCol * (0.22 + 0.85 * ndl));
  lit += c * uSunCol * through;
  lit += uSunCol * pow(max(dot(reflect(-uSun, N), vec3(0.0, 1.0, 0.0)), 0.0), 18.0) * 0.09 * t;

  // The rim of the leaf goes translucent rather than ending on a hard edge.
  float alpha = 1.0 - smoothstep(-0.035, 0.0, d);
  gl_FragColor = vec4(finish(lit), alpha);
}
`

/* Ground shadow — one soft, dappled ellipse per shrub, growing in with it. */
const SHADOW_VERT = /* glsl */ `
attribute vec2 aCentre;
attribute vec2 aSize;
attribute float aShrubId;
uniform vec2 uShadowDir;
uniform float uGrow[${MAX_SHRUBS}];
varying vec2 vUv;
varying vec2 vWorldXZ;
varying float vAlpha;
void main() {
  float g = clamp(uGrow[int(aShrubId)], 0.0, 1.0);
  vec2 dir = normalize(uShadowDir);
  vec2 perp = vec2(-dir.y, dir.x);
  vec2 local = (dir * position.x * aSize.x + perp * position.y * aSize.y) * max(g, 0.001);
  // Just above the tallest blade, so it depth-tests in front of the lawn.
  vec3 world = vec3(aCentre.x + local.x, 0.2, aCentre.y + local.y);
  vUv = position.xy + 0.5;
  vWorldXZ = world.xz;
  vAlpha = g;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`

const SHADOW_FRAG = /* glsl */ `
${NOISE}
varying vec2 vUv;
varying vec2 vWorldXZ;
varying float vAlpha;
void main() {
  float r = length((vUv - 0.5) * 2.0);
  float a = (1.0 - smoothstep(0.1, 1.0, r)) * 0.3 * vAlpha;
  // Dappled: a shrub leaks light through every gap between its leaves.
  float gaps = fbm3(vWorldXZ * 5.0) * 0.65 + fbm3(vWorldXZ * 12.0 + 3.0) * 0.35;
  a *= mix(0.4, 1.0, smoothstep(0.3, 0.7, gaps + (1.0 - r) * 0.25));
  gl_FragColor = vec4(0.02, 0.035, 0.05, a);
}
`

type ShrubSpec = {
  x: number
  z: number
  r: number
  warmth: number
  seed: number
  /** Where in the planting sweep this one goes in, 0…1 left to right. */
  order: number
}

export function createShrubs(
  THREE: typeof import('three'),
  opts: {
    halfFar: number
    halfNear: number
    zFar: number
    zNear: number
    /** The flower bed: nothing may stand on it or shade it. */
    bed: { centreZ: number; halfDepth: number; halfWidth: number }
    light: Record<string, { value: unknown }>
    coarse: boolean
    /** When the planting happens, as scroll progress. */
    window: [number, number]
    seed?: number
  },
): Shrubs {
  const rand = mulberry32(opts.seed ?? 20260912)
  const group = new THREE.Group()
  const disposables: { dispose(): void }[] = []

  const depth = opts.zNear - opts.zFar
  const halfAt = (z: number) => opts.halfFar + (opts.halfNear - opts.halfFar) * ((z - opts.zFar) / depth)

  const bedZMin = opts.bed.centreZ - opts.bed.halfDepth
  const bedZMax = opts.bed.centreZ + opts.bed.halfDepth
  const bedHalfW = opts.bed.halfWidth

  const sun = opts.light.uSun.value as THREE_NS.Vector3
  const shadowDir = { x: -sun.x / sun.y, z: -sun.z / sun.y }

  const groundScale = Math.max(1.4, depth)
  /** A clipped box ball or a lavender: 0.4–0.7 m across on a 2.5 m stage. */
  const base = groundScale * (opts.coarse ? 0.1 : 0.092)

  function clearsBed(s: ShrubSpec) {
    const reach = s.r * 1.2
    const sx = s.x + shadowDir.x * s.r * 0.8
    const sz = s.z + shadowDir.z * s.r * 0.8
    const outside = (x: number, z: number, m: number) =>
      x < -bedHalfW - m || x > bedHalfW + m || z < bedZMin - m || z > bedZMax + m
    return outside(s.x, s.z, reach) && outside(sx, sz, s.r * 0.7)
  }

  function makeShrub(x: number, z: number, side: -1 | 0 | 1): ShrubSpec | null {
    const s: ShrubSpec = {
      x,
      z,
      r: base * (0.72 + rand() * 0.66),
      warmth: rand() < 0.35 ? 0.5 + rand() * 0.5 : 0,
      seed: rand(),
      order: 0,
    }
    for (let i = 0; i < 12 && !clearsBed(s); i++) {
      if (side === 0) s.z -= s.r * 0.4
      else s.x += side * s.r * 0.4
    }
    return clearsBed(s) ? s : null
  }

  /* A few, not a hedge ("kilka nasadzeń"). Most along the far edge, a couple
     down each side so the planting turns the corner. */
  const count = opts.coarse ? 4 + Math.floor(rand() * 2) : 6 + Math.floor(rand() * 3)
  const nFar = Math.max(2, Math.round(count * 0.55))
  const nSide = count - nFar
  const nLeft = Math.ceil(nSide / 2)

  const shrubs: ShrubSpec[] = []
  const farHalfW = halfAt(opts.zFar) * 1.1
  for (let i = 0; i < nFar; i++) {
    const bin = (i + 0.5) / nFar + (rand() - 0.5) * (0.7 / nFar)
    const s = makeShrub(-farHalfW + bin * 2 * farHalfW, opts.zFar - base * (0.1 + rand() * 0.45), 0)
    if (s) shrubs.push(s)
  }
  for (let i = 0; i < nSide; i++) {
    const side: -1 | 1 = i < nLeft ? -1 : 1
    const z = opts.zFar + depth * (0.1 + rand() * 0.7)
    const s = makeShrub(side * (halfAt(z) + base * (0.05 + rand() * 0.4)), z, side)
    if (s) shrubs.push(s)
  }

  // Planted left to right, the same sweep the flower bed is planted in.
  const xs = shrubs.map((s) => s.x)
  const minX = Math.min(...xs, 0)
  const spanX = Math.max(...xs, 0) - minX || 1
  shrubs.forEach((s) => {
    s.order = (s.x - minX) / spanX
  })

  /* ---- Leaves ------------------------------------------------------- */
  type Leaf = {
    c: [number, number, number]
    d: [number, number, number]
    u: [number, number, number]
    len: number
    wid: number
    seed: number
    shrubId: number
    birth: number
  }
  const leaves: Leaf[] = []
  const perShrub = opts.coarse ? 60 : 130
  shrubs.forEach((s, shrubId) => {
    for (let i = 0; i < perShrub; i++) {
      // A point on the mound: upper hemisphere, squashed, and biased to the
      // shell so the inside stays dark and only the surface carries leaves.
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(1 - 0.92 * rand())
      const rr = s.r * (0.72 + rand() * 0.3)
      const dx = Math.sin(phi) * Math.cos(theta)
      const dy = Math.cos(phi)
      const dz = Math.sin(phi) * Math.sin(theta)
      const len = s.r * (0.3 + rand() * 0.2)
      const jitter = () => (rand() - 0.5) * 1.5
      leaves.push({
        c: [s.x + dx * rr, 0.02 + dy * rr * 0.78, s.z + dz * rr],
        // Tilted up a little from the pure radial: leaves reach for the sky
        // as much as they reach outward.
        d: [dx, dy + 0.35, dz],
        u: [dx * 0.5 + jitter(), 0.75 + rand() * 0.5, dz * 0.5 + jitter()],
        len,
        wid: len * (0.42 + rand() * 0.22),
        seed: rand(),
        shrubId,
        birth: rand() * 0.6,
      })
    }
  })

  const quad = new THREE.PlaneGeometry(1, 1)
  const leafGeo = new THREE.InstancedBufferGeometry()
  leafGeo.index = quad.index
  leafGeo.setAttribute('position', quad.getAttribute('position'))
  const n = leaves.length
  const aCentre = new Float32Array(n * 3)
  const aDir = new Float32Array(n * 3)
  const aUp = new Float32Array(n * 3)
  const aSize = new Float32Array(n * 2)
  const aSeed = new Float32Array(n)
  const aShrubId = new Float32Array(n)
  const aBirth = new Float32Array(n)
  leaves.forEach((l, i) => {
    aCentre.set(l.c, i * 3)
    aDir.set(l.d, i * 3)
    aUp.set(l.u, i * 3)
    aSize.set([l.wid, l.len], i * 2)
    aSeed[i] = l.seed
    aShrubId[i] = l.shrubId
    aBirth[i] = l.birth
  })
  leafGeo.setAttribute('aCentre', new THREE.InstancedBufferAttribute(aCentre, 3))
  leafGeo.setAttribute('aDir', new THREE.InstancedBufferAttribute(aDir, 3))
  leafGeo.setAttribute('aUp', new THREE.InstancedBufferAttribute(aUp, 3))
  leafGeo.setAttribute('aSize', new THREE.InstancedBufferAttribute(aSize, 2))
  leafGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1))
  leafGeo.setAttribute('aShrubId', new THREE.InstancedBufferAttribute(aShrubId, 1))
  leafGeo.setAttribute('aBirth', new THREE.InstancedBufferAttribute(aBirth, 1))
  leafGeo.instanceCount = n

  const growArr = new Array(MAX_SHRUBS).fill(0)
  const warmthArr = new Array(MAX_SHRUBS).fill(0)
  shrubs.forEach((s, i) => {
    warmthArr[i] = s.warmth
  })

  const leafMat = new THREE.ShaderMaterial({
    vertexShader: LEAF_VERT,
    fragmentShader: LEAF_FRAG,
    uniforms: {
      ...opts.light,
      uTime: { value: 0 },
      uWind: { value: 0 },
      uGrow: { value: growArr },
      uWarmth: { value: warmthArr },
    },
    // A leaf is seen from both faces on a mound, and the underside is the
    // side the sun comes through.
    side: THREE.DoubleSide,
    alphaToCoverage: true,
  })
  const leafMesh = new THREE.Mesh(leafGeo, leafMat)
  leafMesh.frustumCulled = false
  leafMesh.renderOrder = 7
  group.add(leafMesh)
  disposables.push(quad, leafGeo, leafMat)

  /* ---- Ground shadow, one per shrub --------------------------------- */
  const shadowQuad = new THREE.PlaneGeometry(1, 1)
  const shadowGeo = new THREE.InstancedBufferGeometry()
  shadowGeo.index = shadowQuad.index
  shadowGeo.setAttribute('position', shadowQuad.getAttribute('position'))
  const sCentre = new Float32Array(shrubs.length * 2)
  const sSize = new Float32Array(shrubs.length * 2)
  const sId = new Float32Array(shrubs.length)
  shrubs.forEach((s, i) => {
    sCentre.set([s.x + shadowDir.x * s.r * 0.7, s.z + shadowDir.z * s.r * 0.7], i * 2)
    sSize.set([s.r * 2.1, s.r * 1.5], i * 2)
    sId[i] = i
  })
  shadowGeo.setAttribute('aCentre', new THREE.InstancedBufferAttribute(sCentre, 2))
  shadowGeo.setAttribute('aSize', new THREE.InstancedBufferAttribute(sSize, 2))
  shadowGeo.setAttribute('aShrubId', new THREE.InstancedBufferAttribute(sId, 1))
  shadowGeo.instanceCount = shrubs.length

  const shadowMat = new THREE.ShaderMaterial({
    vertexShader: SHADOW_VERT,
    fragmentShader: SHADOW_FRAG,
    uniforms: {
      uShadowDir: { value: new THREE.Vector2(shadowDir.x, shadowDir.z) },
      uGrow: { value: growArr },
    },
    transparent: true,
    depthWrite: false,
  })
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
  shadowMesh.frustumCulled = false
  shadowMesh.renderOrder = 2
  group.add(shadowMesh)
  disposables.push(shadowQuad, shadowGeo, shadowMat)

  const [planted, done] = opts.window
  // The slots overlap: a gardener works along the bed, they do not wait for
  // one shrub to finish before starting the next.
  const slot = Math.max(0.04, (done - planted) * 0.55)

  return {
    group,
    update(time, progress) {
      shrubs.forEach((s, i) => {
        const start = planted + (done - planted - slot) * s.order
        growArr[i] = Math.min(1, Math.max(0, (progress - start) / slot))
      })
      leafMat.uniforms.uTime.value = time
      leafMat.uniforms.uWind.value = base * 0.03
    },
    dispose() {
      for (const d of disposables) d.dispose()
    },
    info: () => ({ shrubs: shrubs.length, leaves: n }),
  }
}

/** Small, fast, seeded — the planting must come out the same on every visit. */
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
