/**
 * The grove: a loose ring of trees standing just outside the lawn, framing
 * the flower headline instead of hiding it.
 *
 * The garden's camera is tilted only 24° off vertical, so a standing tree
 * reads almost entirely as a canopy seen from above — the trunk is a sliver
 * that foreshortens to almost nothing. Everything here is built for that
 * angle: the budget goes into the canopy silhouette (broken up so it doesn't
 * read as a plastic ball) and the long, soft shadow it throws, not into bark
 * detail nobody will see edge-on.
 *
 * Placement is deterministic from `seed` and follows one rule above all
 * others: never shade the flower bed. Its rectangle is handed in by
 * `gardenScene.ts`, which is the only place that knows where the headline
 * was planted — this file used to re-derive it from the same constants,
 * which is exactly the kind of duplication that goes quietly out of date.
 *
 * Three draw calls total, same trick as the turf and the flower bed: one
 * `InstancedBufferGeometry` per part (canopy, trunk, ground shadow), with
 * plain per-instance attributes rather than `THREE.InstancedMesh` — matrices
 * would hide the per-blob radii and tree id this file needs to read back
 * for wind and shading, so the raw attributes are kept instead, the same
 * choice `letters.ts`'s flower field makes for the same reason. `three` is
 * passed in, never imported at module scope, same as everywhere else here.
 */

import type * as THREE_NS from 'three'
import * as S from './shaders'

export type Trees = {
  group: THREE_NS.Group
  /** Per frame: wind time, and the scene progress 0..1 if you use it. */
  update(time: number, progress: number): void
  dispose(): void
  /** For the debug harness: how many trees and canopy blobs were placed. */
  info(): { trees: number; blobs: number }
}

/** Upper bound on tree count, sized so the per-tree uniform arrays below
 *  never need to grow — 9 covers the desktop max with room to spare. */
const MAX_TREES = 9

/* shaders.ts keeps uSun/uSunCol/uSky as a private template (`LIGHT`) it
   doesn't export, so it's redeclared here — same three uniforms, same names,
   fed from the same `light` object the caller passes in. */
const LIGHT = /* glsl */ `
uniform vec3 uSun;
uniform vec3 uSunCol;
uniform vec3 uSky;
`

/* ------------------------------------------------------------------ *
 * Canopy — a cluster of squashed-sphere blobs per tree, one instanced
 * draw for every blob of every tree. The silhouette break comes entirely
 * from fragment alpha (noise + alphaToCoverage), same trick the grass and
 * the bloom shader use, so the base mesh can stay a cheap low-detail
 * icosahedron and still not read as a bead.
 * ------------------------------------------------------------------ */
const CANOPY_VERT = /* glsl */ `
attribute vec3 aCenter;
attribute vec3 aRadii;
attribute float aSeed;
attribute float aTreeId;
uniform float uTime;
uniform float uWindAmp;
uniform float uTreeSeed[${MAX_TREES}];
varying vec3 vNormal;
varying vec3 vWorld;
varying float vSeed;
varying float vTreeId;
void main() {
  // The ellipsoid's true outward normal is the sphere normal divided by the
  // per-axis radius, not the squashed position — dividing the other way
  // (multiplying) tilts the shading toward whichever axis is longest.
  vNormal = normalize(normal / aRadii);
  vSeed = aSeed;
  vTreeId = aTreeId;
  float phase = uTreeSeed[int(aTreeId)] * 6.2831853;
  // A whole tree sways together: every blob of the same tree reads the same
  // phase from the array, so nothing needs a per-instance sway value.
  vec2 sway = vec2(sin(uTime * 0.55 + phase), cos(uTime * 0.4 + phase * 1.7)) * uWindAmp;
  vec3 world = aCenter + position * aRadii + vec3(sway.x, 0.0, sway.y);
  vWorld = world;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`

const CANOPY_FRAG = /* glsl */ `
${S.NOISE}
${LIGHT}
uniform float uTime;
uniform float uTreeWarmth[${MAX_TREES}];
varying vec3 vNormal;
varying vec3 vWorld;
varying float vSeed;
varying float vTreeId;
void main() {
  vec3 N = normalize(vNormal);
  float up = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);

  // A couple of trees run warmer/yellower — late-summer foliage among the
  // green — picked once per tree and read back through its id. Kept muted
  // (R and G close but neither near 1) so it reads as olive, not highlighter.
  float warmth = uTreeWarmth[int(vTreeId)];
  vec3 topCool = vec3(0.125, 0.245, 0.072);
  vec3 topWarm = vec3(0.215, 0.185, 0.055);
  vec3 topC = mix(topCool, topWarm, warmth);
  vec3 underC = vec3(0.052, 0.098, 0.046);
  vec3 base = mix(underC, topC, smoothstep(0.05, 0.85, up));

  /* Leaf texture, in WORLD space rather than across the blob's own normal.
     That is the whole difference between a tree and a smudge: a canopy is
     made of leaf clumps about a hand across, and their size on screen has
     to come from how big a hand is, not from how big the blob is. Reading
     the noise off the normal (which is what this did first) scales the
     clumps with the blob, so a canopy filling a quarter of the frame came
     out as three soft lobes — an out-of-focus stain over the lawn. */
  // Projected onto the surface’s own tangent plane, not onto the ground.
  // A canopy at the top edge of the frame is seen side-on, and there its
  // world xz barely changes across the whole visible face — so a ground
  // projection stretched the clumps into smooth streaks and the tree went
  // back to being a smudge. A tangent-plane projection keeps one constant
  // world scale whichever way the surface happens to face.
  vec3 ref = abs(N.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 tA = normalize(cross(ref, N));
  vec3 tB = cross(N, tA);
  vec2 lp = vec2(dot(vWorld, tA), dot(vWorld, tB)) + vSeed * 31.0;
  float clump = fbm3(lp * 4.4);
  float leaf = fbm3(lp * 13.5 + 4.0);
  float fleck = vnoise(lp * 34.0);

  /* Silhouette. The blob's own edge (where the normal turns away from the
     camera) sets how much of the noise bites: deep at the rim, barely at
     the centre, so a canopy is ragged at its outline and solid in the
     middle — a uniform threshold ate holes through the middle instead. */
  float rim = smoothstep(0.75, 0.05, abs(N.z) * 0.35 + up * 0.65);
  float bite = clump * 0.6 + leaf * 0.4;
  float alpha = smoothstep(0.14, 0.5, bite - rim * 0.62 + 0.22 + (fleck - 0.5) * 0.22);
  if (alpha < 0.04) discard;

  // Clumps of leaf catch the light and the gaps between them fall away into
  // the depth of the canopy; the fleck is the individual leaf, just enough
  // to break the clumps up without turning into noise.
  float open = smoothstep(0.3, 0.75, clump);
  base *= mix(0.5, 1.32, open) * mix(0.82, 1.18, leaf) * (0.9 + 0.2 * fleck);

  float ndl = max(dot(N, uSun), 0.0);
  // A slow shimmer, per blob: leaf masses brightening as they turn to the
  // sun. Additive and small, so it can't multiply the whole blob past white.
  float shimmer = 0.5 + 0.5 * sin(uTime * 0.6 + vSeed * 23.0);
  vec3 lit = base * (uSky * 0.5 + uSunCol * (0.3 + 0.72 * ndl));
  lit += base * uSunCol * shimmer * ndl * 0.12;
  // Sunlit leaves on top of the clumps, which is what stops a canopy from
  // reading as one flat tone the moment it is bigger than a thumbnail.
  lit += uSunCol * pow(open, 3.0) * ndl * 0.075;
  gl_FragColor = vec4(finish(lit), alpha);
}
`

/* ------------------------------------------------------------------ *
 * Trunk — instanced tapered cylinders, one draw for every trunk and
 * branch stub of every tree. Barely seen at this angle, so it gets one
 * cheap bark streak and a darkened collar at the base instead of real
 * detail; the tangent frame is built per-instance from base→top so the
 * same geometry serves an upright trunk and an angled branch alike.
 * ------------------------------------------------------------------ */
const TRUNK_VERT = /* glsl */ `
attribute vec3 aBase;
attribute vec3 aTop;
attribute float aRadius;
varying float vT;
varying vec3 vNormal;
varying vec2 vBark;
void main() {
  float t = position.y + 0.5;
  vec3 axis = aTop - aBase;
  float len = length(axis);
  vec3 dir = len > 1e-5 ? axis / len : vec3(0.0, 1.0, 0.0);
  // Any hint vector not parallel to dir will do — trunks are near-vertical
  // and branches near-horizontal, so a single fixed fallback never fires.
  vec3 hint = abs(dir.y) > 0.985 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 tangent = normalize(cross(hint, dir));
  vec3 bitan = cross(dir, tangent);
  // A root flare right at the base, then a taper to the tip — a straight
  // cone read as a fence post once the canopy sat on top of it.
  float flare = 1.0 + 0.7 * smoothstep(0.16, 0.0, t);
  float r = aRadius * mix(1.0, 0.3, t) * flare;
  vec3 local = tangent * position.x * r + bitan * position.z * r;
  vNormal = normalize(tangent * position.x + bitan * position.z);
  vT = t;
  vBark = vec2(atan(position.z, position.x), t * len);
  vec3 world = aBase + dir * len * t + local;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`

const TRUNK_FRAG = /* glsl */ `
${S.NOISE}
${LIGHT}
varying float vT;
varying vec3 vNormal;
varying vec2 vBark;
void main() {
  float streak = fbm3(vec2(vBark.x * 2.4, vBark.y * 2.2));
  vec3 c = mix(vec3(0.045, 0.03, 0.018), vec3(0.09, 0.062, 0.038), streak);
  // Contact shadow where the trunk meets the soil, so the base doesn't float.
  c *= mix(0.55, 1.0, smoothstep(0.0, 0.14, vT));
  float ndl = max(dot(normalize(vNormal), uSun), 0.0);
  vec3 lit = c * (uSky * 0.6 + uSunCol * ndl * 1.1);
  gl_FragColor = vec4(finish(lit), 1.0);
}
`

/* ------------------------------------------------------------------ *
 * Ground shadow — one soft ellipse per canopy blob, elongated along the
 * sun's ground direction. Same soft radial falloff as BLOB_FRAG in
 * shaders.ts, just stretched anisotropically in the vertex stage instead
 * of drawn as a circle, and instanced instead of one mesh per roll.
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
  // Sits a little above where the tallest grass blade could reach (turf
  // tops out around 0.18 in gardenScene's own units) so it depth-tests in
  // front of the lawn instead of being lost behind blade tips — the same
  // problem the roll shadow solves by sitting just above GRASS_H there.
  vec3 world = vec3(aCenter.x + local.x, 0.2, aCenter.y + local.y);
  vUv = position.xy + 0.5;
  vWorldXZ = world.xz;
  vAlpha = aAlpha;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`

const SHADOW_FRAG = /* glsl */ `
${S.NOISE}
varying vec2 vUv;
varying vec2 vWorldXZ;
varying float vAlpha;
void main() {
  vec2 d = (vUv - 0.5) * 2.0;
  float r = length(d);
  float a = (1.0 - smoothstep(0.1, 1.0, r)) * vAlpha;
  // Dappled, not a hole in the lawn: a canopy leaks light through every gap
  // between its leaf clumps, and the gaps get wider toward the edge of the
  // shadow. A solid ellipse read as a smudge on the grass — the one thing a
  // garden photographed in low sun never has.
  float gaps = fbm3(vWorldXZ * 2.6) * 0.65 + fbm3(vWorldXZ * 7.0 + 3.0) * 0.35;
  a *= mix(0.45, 1.0, smoothstep(0.28, 0.72, gaps + (1.0 - r) * 0.25));
  // Shade is sky-lit, so it is blue-grey rather than black.
  gl_FragColor = vec4(0.02, 0.035, 0.05, a);
}
`

type TreeSpec = {
  x: number
  z: number
  /** Canopy centre height above the ground. */
  height: number
  /** Nominal canopy radius; individual blobs vary around this. */
  canopyR: number
  warmth: number
  seed: number
  kind: 'far' | 'left' | 'right'
}

export function createTrees(
  THREE: typeof import('three'),
  opts: {
    /** Half width of the visible ground at the far edge and at the near edge. */
    halfFar: number
    halfNear: number
    /** z of the far and near edges of the visible ground. */
    zFar: number
    zNear: number
    /** The flower bed, in world units: nothing may shade this rectangle. */
    bed: { centreZ: number; halfDepth: number; halfWidth: number }
    /** Light uniforms to share: { uSun, uSunCol, uSky }. */
    light: Record<string, { value: unknown }>
    /** Fewer, simpler trees when true (phones). */
    coarse: boolean
    /** Deterministic placement. */
    seed?: number
  },
): Trees {
  const rand = mulberry32(opts.seed ?? 20260912)
  const group = new THREE.Group()
  const disposables: { dispose(): void }[] = []

  const depth = opts.zNear - opts.zFar
  const halfAt = (z: number) => {
    const t = (z - opts.zFar) / depth
    return opts.halfFar + (opts.halfNear - opts.halfFar) * t
  }

  // Where `letters.ts`'s bed actually lands, straight from the caller.
  const bedZMin = opts.bed.centreZ - opts.bed.halfDepth
  const bedZMax = opts.bed.centreZ + opts.bed.halfDepth
  const bedHalfW = opts.bed.halfWidth

  const sun = opts.light.uSun.value as THREE_NS.Vector3
  const shadowDir = { x: -sun.x / sun.y, z: -sun.z / sun.y }

  // Push a tree away from the bed (further behind the far edge, or further
  // past the side margin) until its shadow's reach clears the exclusion
  // rectangle around the headline — the placement rule that matters most.
  // Small steps: the far-edge trees are already tuned to sit close behind
  // zFar for the camera's sake (see `behind` below), and the bed's own far
  // boundary isn't much further back than that, so a coarse nudge overshoots
  // by whole tree-widths where a fine one would have cleared it in one step.
  function keepShadowClear(t: TreeSpec) {
    for (let i = 0; i < 14; i++) {
      const sx = t.x + shadowDir.x * t.height
      const sz = t.z + shadowDir.z * t.height
      const r = t.canopyR * 0.55
      const clear =
        sx < -bedHalfW - r || sx > bedHalfW + r || sz < bedZMin - r || sz > bedZMax + r
      if (clear) return
      if (t.kind === 'far') t.z -= canopyBase * 0.08
      else t.x += Math.sign(t.x) * t.canopyR * 0.25
    }
  }

  const groundScale = Math.max(1.4, depth)
  // A tree, not a shrub. The scene is only ~2.5 m of ground across — the
  // camera is a step-ladder view, not a landscape — so a canopy of 1.6 m
  // across is already a small ornamental tree here, and anything smaller
  // reads as a box hedge. What it cannot be is a full-grown oak: at this
  // tilt a canopy raised above the camera projects off the top of the
  // frame entirely, so the grove is deliberately young trees.
  const canopyBase = groundScale * (opts.coarse ? 0.34 : 0.3)

  function makeTree(x: number, z: number, kind: TreeSpec['kind']): TreeSpec {
    const canopyR = canopyBase * (0.75 + rand() * 0.5)
    // At this near-vertical tilt, a taller canopy centre projects further
    // outside the frame, not into it, in whichever direction it's already
    // offset — raising a point moves it closer to the camera's own altitude,
    // which *increases* its apparent distance from the look-at centre. So a
    // tree planted just past the edge, of either kind, only shows anything
    // at all because its canopy's own near-facing bulge reaches back past
    // the boundary; a squat canopy gives more of that bulge to work with
    // than a tall one does.
    const height = canopyR * (0.62 + rand() * 0.35)
    const t: TreeSpec = { x, z, height, canopyR, warmth: rand() < 0.3 ? 0.6 + rand() * 0.4 : 0, seed: rand(), kind }
    keepShadowClear(t)
    return t
  }

  // Composition: most of the grove strung along the far edge (irregular
  // spacing, a couple of trees pulled close together), the rest just
  // outside the side margins so canopies enter at the corners too.
  const treeCount = opts.coarse ? 3 + Math.floor(rand() * 3) : 5 + Math.floor(rand() * 5)
  const nFar = Math.max(2, Math.round(treeCount * 0.6))
  const nSide = treeCount - nFar
  const nLeft = Math.ceil(nSide / 2)

  const trees: TreeSpec[] = []
  const farHalfW = halfAt(opts.zFar) * 1.2
  // A fixed shuffle of bin order, so which pair ends up pulled together
  // isn't always the same two bins.
  const clashBin = Math.floor(rand() * Math.max(1, nFar - 1))
  for (let i = 0; i < nFar; i++) {
    let bin = (i + 0.5) / nFar
    if (i === clashBin + 1) bin = (clashBin + 0.5) / nFar + 0.045 // pulled in next to its neighbour
    const x = -farHalfW + bin * 2 * farHalfW + (rand() - 0.5) * (farHalfW / nFar) * 0.5
    // Just behind the edge, scaled to the tree's own size rather than to the
    // scene's depth — at the camera's near-vertical tilt a canopy's raised
    // mass already projects well forward of its ground footprint, so a tree
    // planted more than a canopy or two behind zFar disappears off the top
    // of the frame entirely instead of peeking over the edge.
    const behind = canopyBase * rand() * 0.22
    trees.push(makeTree(x, opts.zFar - behind, 'far'))
  }
  for (let i = 0; i < nSide; i++) {
    const side = i < nLeft ? -1 : 1
    const z = opts.zFar + depth * (0.1 + rand() * 0.75)
    const x = side * (halfAt(z) * (0.95 + rand() * 0.05) + canopyBase * rand() * 0.18)
    trees.push(makeTree(x, z, side < 0 ? 'left' : 'right'))
  }

  /* ---- Canopy blobs, one per tree, 3–6 of them (fewer when coarse) ---- */
  // Named CanopyBlob, not Blob — `lib.dom` already owns that name for the
  // File API type, and shadowing it reads oddly even though TS allows it.
  type CanopyBlob = { cx: number; cy: number; cz: number; rx: number; ry: number; rz: number; seed: number; treeId: number }
  const blobs: CanopyBlob[] = []
  trees.forEach((t, treeId) => {
    const n = opts.coarse ? 3 + Math.floor(rand() * 2) : 3 + Math.floor(rand() * 4)
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2
      const spread = t.canopyR * (0.12 + rand() * 0.5)
      const rad = t.canopyR * (0.55 + rand() * 0.45)
      blobs.push({
        cx: t.x + Math.cos(a) * spread,
        cy: t.height + (rand() - 0.35) * t.canopyR * 0.4,
        cz: t.z + Math.sin(a) * spread,
        rx: rad * (0.85 + rand() * 0.3),
        ry: rad * (0.6 + rand() * 0.2),
        rz: rad * (0.85 + rand() * 0.3),
        seed: rand(),
        treeId,
      })
    }
  })

  /* ---- Trunk + a couple of branch stubs per tree ---- */
  type Beam = { bx: number; by: number; bz: number; tx: number; ty: number; tz: number; r: number }
  const beams: Beam[] = []
  trees.forEach((t, treeId) => {
    const trunkR = t.canopyR * 0.11
    // Sunk slightly below ground so the base doesn't float, and its top
    // reaches up into the underside of the canopy cluster rather than
    // stopping short of it.
    const base = { x: t.x, y: -t.canopyR * 0.05, z: t.z }
    const top = { x: t.x + (rand() - 0.5) * t.canopyR * 0.15, y: t.height - t.canopyR * 0.55, z: t.z + (rand() - 0.5) * t.canopyR * 0.15 }
    beams.push({ bx: base.x, by: base.y, bz: base.z, tx: top.x, ty: top.y, tz: top.z, r: trunkR })
    if (!opts.coarse) {
      const myBlobs = blobs.filter((b) => b.treeId === treeId)
      for (let i = 0; i < 2; i++) {
        const along = 0.5 + rand() * 0.3
        const bx = base.x + (top.x - base.x) * along
        const by = base.y + (top.y - base.y) * along
        const bz = base.z + (top.z - base.z) * along
        const target = myBlobs[Math.floor(rand() * myBlobs.length)] ?? { cx: top.x, cy: top.y, cz: top.z }
        const reach = 0.55 + rand() * 0.25
        beams.push({
          bx,
          by,
          bz,
          tx: bx + (target.cx - bx) * reach,
          ty: by + (target.cy - by) * reach,
          tz: bz + (target.cz - bz) * reach,
          r: trunkR * 0.45,
        })
      }
    }
  })

  /* ---- Canopy mesh ---- */
  const icosaBase = new THREE.IcosahedronGeometry(1, 2)
  const canopyGeo = new THREE.InstancedBufferGeometry()
  canopyGeo.index = icosaBase.index
  canopyGeo.setAttribute('position', icosaBase.getAttribute('position'))
  canopyGeo.setAttribute('normal', icosaBase.getAttribute('normal'))
  const bN = blobs.length
  const aCenter = new Float32Array(bN * 3)
  const aRadii = new Float32Array(bN * 3)
  const aSeed = new Float32Array(bN)
  const aTreeId = new Float32Array(bN)
  blobs.forEach((b, i) => {
    aCenter.set([b.cx, b.cy, b.cz], i * 3)
    aRadii.set([b.rx, b.ry, b.rz], i * 3)
    aSeed[i] = b.seed
    aTreeId[i] = b.treeId
  })
  canopyGeo.setAttribute('aCenter', new THREE.InstancedBufferAttribute(aCenter, 3))
  canopyGeo.setAttribute('aRadii', new THREE.InstancedBufferAttribute(aRadii, 3))
  canopyGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1))
  canopyGeo.setAttribute('aTreeId', new THREE.InstancedBufferAttribute(aTreeId, 1))
  canopyGeo.instanceCount = bN

  const treeSeedArr = new Array(MAX_TREES).fill(0)
  const treeWarmthArr = new Array(MAX_TREES).fill(0)
  trees.forEach((t, i) => {
    treeSeedArr[i] = t.seed
    treeWarmthArr[i] = t.warmth
  })

  const canopyMat = new THREE.ShaderMaterial({
    vertexShader: CANOPY_VERT,
    fragmentShader: CANOPY_FRAG,
    uniforms: {
      ...opts.light,
      uTime: { value: 0 },
      uWindAmp: { value: 0 },
      uTreeSeed: { value: treeSeedArr },
      uTreeWarmth: { value: treeWarmthArr },
    },
    alphaToCoverage: true,
  })
  const canopyMesh = new THREE.Mesh(canopyGeo, canopyMat)
  canopyMesh.frustumCulled = false
  canopyMesh.renderOrder = 7
  group.add(canopyMesh)
  disposables.push(icosaBase, canopyGeo, canopyMat)

  /* ---- Trunk mesh ---- */
  const cylBase = new THREE.CylinderGeometry(1, 1, 1, 7, 1, true)
  const trunkGeo = new THREE.InstancedBufferGeometry()
  trunkGeo.index = cylBase.index
  trunkGeo.setAttribute('position', cylBase.getAttribute('position'))
  const beamN = beams.length
  const aBase = new Float32Array(beamN * 3)
  const aTop = new Float32Array(beamN * 3)
  const aRadius = new Float32Array(beamN)
  beams.forEach((b, i) => {
    aBase.set([b.bx, b.by, b.bz], i * 3)
    aTop.set([b.tx, b.ty, b.tz], i * 3)
    aRadius[i] = b.r
  })
  trunkGeo.setAttribute('aBase', new THREE.InstancedBufferAttribute(aBase, 3))
  trunkGeo.setAttribute('aTop', new THREE.InstancedBufferAttribute(aTop, 3))
  trunkGeo.setAttribute('aRadius', new THREE.InstancedBufferAttribute(aRadius, 1))
  trunkGeo.instanceCount = beamN

  const trunkMat = new THREE.ShaderMaterial({
    vertexShader: TRUNK_VERT,
    fragmentShader: TRUNK_FRAG,
    uniforms: { ...opts.light },
  })
  const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat)
  trunkMesh.frustumCulled = false
  trunkMesh.renderOrder = 7
  group.add(trunkMesh)
  disposables.push(cylBase, trunkGeo, trunkMat)

  /* ---- Ground shadow mesh: one soft ellipse per canopy blob ---- */
  const quadBase = new THREE.PlaneGeometry(1, 1)
  const shadowGeo = new THREE.InstancedBufferGeometry()
  shadowGeo.index = quadBase.index
  shadowGeo.setAttribute('position', quadBase.getAttribute('position'))
  const sCenter = new Float32Array(bN * 2)
  const sSize = new Float32Array(bN * 2)
  const sAlpha = new Float32Array(bN)
  blobs.forEach((b, i) => {
    const rAvg = (b.rx + b.rz) / 2
    sCenter.set([b.cx + shadowDir.x * b.cy, b.cz + shadowDir.z * b.cy], i * 2)
    sSize.set([rAvg * 2.0, rAvg * 0.95], i * 2)
    sAlpha[i] = 0.3 + rand() * 0.12
  })
  shadowGeo.setAttribute('aCenter', new THREE.InstancedBufferAttribute(sCenter, 2))
  shadowGeo.setAttribute('aSize', new THREE.InstancedBufferAttribute(sSize, 2))
  shadowGeo.setAttribute('aAlpha', new THREE.InstancedBufferAttribute(sAlpha, 1))
  shadowGeo.instanceCount = bN

  const shadowMat = new THREE.ShaderMaterial({
    vertexShader: SHADOW_VERT,
    fragmentShader: SHADOW_FRAG,
    uniforms: { uShadowDir: { value: new THREE.Vector2(shadowDir.x, shadowDir.z) } },
    transparent: true,
    depthWrite: false,
    // The vertex stage rebuilds world position from scratch and doesn't
    // preserve the source plane's own facing, so winding isn't trustworthy —
    // same call BLOOM_FRAG/STEM_FRAG in shaders.ts make for the same reason.
    side: THREE.DoubleSide,
  })
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
  shadowMesh.frustumCulled = false
  shadowMesh.renderOrder = 2
  group.add(shadowMesh)
  disposables.push(quadBase, shadowGeo, shadowMat)

  const baseWindAmp = 0.1

  return {
    group,
    update(time, progress) {
      canopyMat.uniforms.uTime.value = time
      // A touch more life in the air as the bed fills in — never enough to
      // compete with the flowers' own sway, which is what carries the shot.
      canopyMat.uniforms.uWindAmp.value = baseWindAmp * (0.6 + 0.4 * Math.min(1, Math.max(0, progress)))
    },
    dispose() {
      for (const d of disposables) d.dispose()
    },
    info() {
      return { trees: trees.length, blobs: blobs.length }
    },
  }
}

/** Small, fast, seeded — same generator every scene file here uses, kept
 *  local rather than shared so this file has no import besides `shaders`. */
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
