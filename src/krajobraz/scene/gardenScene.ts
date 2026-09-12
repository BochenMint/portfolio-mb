/**
 * The garden: bare soil, turf rolled out over it by scroll, and a flower
 * bed that plants the headline into the new lawn.
 *
 * One perspective camera looks down at the ground plane (y = 0) from a 24°
 * tilt — enough for the rolls to read as cylinders and the lawn to have
 * depth, not so much that the words stop reading as words. Everything is
 * sized from what that camera can see, so a phone gets three strips and a
 * tall five-line bed while a wide screen gets seven strips and three lines.
 * The camera itself, the render loop, and the rebuild-on-resize plumbing
 * live in `stage/sceneHost.ts`; this file only builds and animates the
 * world that sits inside it.
 *
 * Conventions: 1 unit ≈ 0.25 m, +x right, +z toward the camera (the bottom
 * of the screen), the rolls travel +z. `three` is never imported here at
 * module scope — it arrives through `ctx.THREE`, itself behind the dynamic
 * import in `sceneHost.ts`.
 */

import type * as THREE_NS from 'three'
import { GARDEN_PALETTE, GARDEN_RAKE, GROUND_FRAG, GROUND_VERT, groundUniforms } from '../../stage/ground'
import { createSceneHost, type SceneCtx, type SceneHandle } from '../../stage/sceneHost'
import { BLOB_FRAG, BLOB_VERT } from '../../stage/shaders'
import { easeInOut, smoothstep } from '../../stage/timing'
import { plantHeadline, type FlowerField } from './letters'
import * as S from './shaders'
import { T } from './timeline'
import { createShrubs, type Shrubs } from './shrubs'

export type GardenHandle = SceneHandle

const DEG = Math.PI / 180
const TILT_DEG = 24
/** Only the camera's own framing needs the tilt in degrees (handed to the
 *  host); the flower bed's z-stretch needs it in radians right here. */
const TILT = TILT_DEG * DEG
const VFOV = 36
const MAX_STRIPS = 8
/** Grass blade height, and where the turf mat sits above the soil. */
const GRASS_H = 0.16
const TURF_BASE = 0.018
/** Sun from the far left, low enough to rake the soil, warm. */
const SUN: [number, number, number] = normalize([-0.5, 0.74, -0.45])
const SUN_COL: [number, number, number] = [1.45, 1.12, 0.78]
const SKY: [number, number, number] = [0.36, 0.42, 0.55]
const FONT = `"Hanken Grotesk", system-ui, sans-serif`

type Strip = {
  x: number
  len: number
  zInit: number
  total: number
  tau: number
  startAt: number
  shade: number
}

type World = {
  group: THREE_NS.Group
  strips: Strip[]
  r0: number
  core: number
  rolls: {
    group: THREE_NS.Group
    body: THREE_NS.ShaderMaterial
    caps: THREE_NS.ShaderMaterial[]
    shadow: THREE_NS.Mesh
    shadowMat: THREE_NS.ShaderMaterial
  }[]
  grass: THREE_NS.ShaderMaterial
  flowerMats: THREE_NS.ShaderMaterial[]
  field: FlowerField
  shrubs: Shrubs
  dispose(): void
}

export async function createGardenScene(
  canvas: HTMLCanvasElement,
  opts: { reduced: boolean; coarse: boolean },
): Promise<GardenHandle> {
  // The bed is set in the page's own face. Wait for it, but not forever: a
  // font that never arrives must not leave the stage empty.
  await Promise.race([
    document.fonts?.load(`900 64px "Hanken Grotesk"`, 'Zbudujęąó').catch(() => undefined),
    new Promise((r) => setTimeout(r, 2500)),
  ])

  const shells = opts.coarse ? 10 : 14

  return createSceneHost<World>(canvas, {
    reduced: opts.reduced,
    coarse: opts.coarse,
    tilt: TILT_DEG,
    vfov: VFOV,
    // Ground width held at the point the camera looks at: generous on a wide
    // screen, never so narrow on a phone that a strip is thinner than a roll.
    groundWidth: (aspect) => Math.max(5.6, Math.min(14.5, 7.8 * aspect)),
    sun: SUN,
    sunColor: SUN_COL,
    sky: SKY,
    clearColor: 0x120c08,
    pixelRatioCap: 1.5,
    build: (ctx) => build(ctx, opts, shells),
    update: (world, p, ctx) => update(world, p, ctx),
    debugInfo: (world) => ({
      strips: world?.strips.length,
      flowers: world?.field.count,
      lines: world?.field.lines,
      em: world?.field.em,
      pitch: world?.field.pitch,
      shells,
      shrubs: world?.shrubs.info(),
    }),
  })
}

/* ---- World (rebuilt when the shape of the screen changes) -------- */
function build(ctx: SceneCtx, opts: { reduced: boolean; coarse: boolean }, shells: number): World {
  const { THREE, light } = ctx
  const fp = ctx.frame
  const disposables: { dispose(): void }[] = []
  const group = new THREE.Group()
  const rand = mulberry32(911)

  const depth = fp.zNear - fp.zFar
  const bedW = 2 * Math.max(fp.halfFar, fp.halfNear) + 0.8
  const n = Math.min(MAX_STRIPS, Math.max(3, Math.round(bedW / 2.4)))
  const w = bedW / n
  const x0 = -bedW / 2
  const r0 = Math.min(0.7, w * 0.27)
  const core = 0.035
  const zStart = fp.zFar - 1.2
  const zEnd = fp.zNear + r0 + 0.9

  // Start order: a fixed shuffle, so the strips go down out of step with
  // each other — which is also what exposes the spiral on a roll's end.
  const order = Array.from({ length: n }, (_, i) => i / Math.max(1, n - 1))
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const strips: Strip[] = Array.from({ length: n }, (_, i) => {
    // A band of lawn is already down at the far edge when the page opens,
    // with the rolls waiting on it: the job has visibly been started.
    const zInit = fp.zFar + depth * 0.3 + (rand() - 0.5) * 0.45
    const total = zEnd - zInit
    return {
      x: x0 + (i + 0.5) * w,
      len: w * 0.985,
      zInit,
      total,
      tau: (Math.PI * (r0 * r0 - core * core)) / total,
      startAt: T.rollStart + T.rollStagger * order[i],
      // Mowing stripes are mostly which way the blades lie (the grass shader
      // combs alternate strips opposite ways); this is only the tint that
      // rides along with that, plus a shade of per-roll variation.
      shade: (i % 2 ? 0.92 : 1.0) * (0.97 + rand() * 0.06),
    }
  })

  /* Soil */
  {
    const geo = new THREE.PlaneGeometry(bedW + 6, depth + 8).rotateX(-Math.PI / 2)
    geo.translate(0, 0, (fp.zFar + fp.zNear) / 2)
    const mat = new THREE.ShaderMaterial({
      vertexShader: GROUND_VERT,
      // The finest grade of crumb is a whole extra voronoi per pixel over
      // the full screen, which is the one thing on this page a phone
      // cannot afford — and at a phone's size it is under a pixel anyway.
      fragmentShader: (opts.coarse ? '#define COARSE 1\n' : '') + GROUND_FRAG,
      uniforms: { ...light, ...groundUniforms(THREE, GARDEN_PALETTE, GARDEN_RAKE) },
    })
    const mesh = new THREE.Mesh(geo, mat)
    // Drawn after the turf: wherever the lawn is down, its depth is already
    // in the buffer and the soil's heavy shader is rejected before it runs.
    mesh.renderOrder = 1
    group.add(mesh)
    disposables.push(geo, mat)
  }

  /* Turf: one plane over the whole bed, drawn once per shell. */
  const grassMat = new THREE.ShaderMaterial({
    vertexShader: S.GRASS_VERT,
    fragmentShader: S.GRASS_FRAG,
    uniforms: {
      ...light,
      uBase: { value: TURF_BASE },
      uHeight: { value: GRASS_H },
      uX0: { value: x0 },
      uW: { value: w },
      uN: { value: n },
      uZc: { value: new Array(MAX_STRIPS).fill(zStart) },
      uShade: { value: Array.from({ length: MAX_STRIPS }, (_, i) => strips[i]?.shade ?? 1) },
      uDensity: { value: opts.coarse ? 26 : 30 },
      uTime: { value: 0 },
      uKnit: { value: 0 },
    },
    alphaToCoverage: true,
  })
  {
    // Subdivided so the vertex shader has enough samples of the gust field.
    const plane = new THREE.PlaneGeometry(bedW, zEnd - zStart, 40, 60).rotateX(-Math.PI / 2)
    plane.translate(0, 0, (zStart + zEnd) / 2)
    const geo = new THREE.InstancedBufferGeometry()
    geo.index = plane.index
    geo.setAttribute('position', plane.getAttribute('position'))
    const layers = new Float32Array(shells)
    for (let i = 0; i < shells; i++) layers[i] = i / (shells - 1)
    geo.setAttribute('aLayer', new THREE.InstancedBufferAttribute(layers, 1))
    geo.instanceCount = shells
    const mesh = new THREE.Mesh(geo, grassMat)
    mesh.frustumCulled = false
    mesh.renderOrder = 0
    group.add(mesh)
    disposables.push(plane, geo, grassMat)
  }

  /* Rolls */
  const bodyGeo = new THREE.CylinderGeometry(1, 1, 1, 72, 1, true).rotateZ(Math.PI / 2)
  const capR = new THREE.CircleGeometry(1, 72).rotateY(Math.PI / 2).translate(0.5, 0, 0)
  const capL = new THREE.CircleGeometry(1, 72).rotateY(-Math.PI / 2).translate(-0.5, 0, 0)
  const blobGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)
  disposables.push(bodyGeo, capR, capL, blobGeo)
  const rolls = strips.map((s) => {
    const g = new THREE.Group()
    const body = new THREE.ShaderMaterial({
      vertexShader: S.ROLL_VERT,
      fragmentShader: S.ROLL_FRAG,
      uniforms: { ...light, uR0: { value: r0 }, uR: { value: r0 }, uLen: { value: s.len } },
    })
    const caps = [1, -1].map(
      (side) =>
        new THREE.ShaderMaterial({
          vertexShader: S.ROLL_VERT,
          fragmentShader: S.CAP_FRAG,
          uniforms: {
            ...light,
            uR: { value: r0 },
            uTau: { value: s.tau },
            uCore: { value: core },
            // The caps face ±x and the sun is off to the left, so the
            // left-hand ends are lit and the right-hand ones in shade.
            uCapLight: { value: Math.max(0.12, SUN[0] * side) * 1.1 },
          },
        }),
    )
    const bodyMesh = new THREE.Mesh(bodyGeo, body)
    const capMeshR = new THREE.Mesh(capR, caps[0])
    const capMeshL = new THREE.Mesh(capL, caps[1])
    for (const m of [bodyMesh, capMeshR, capMeshL]) m.renderOrder = 3
    g.add(bodyMesh, capMeshR, capMeshL)
    group.add(g)

    const shadowMat = new THREE.ShaderMaterial({
      vertexShader: BLOB_VERT,
      fragmentShader: BLOB_FRAG,
      uniforms: { uOpacity: { value: 0.6 } },
      transparent: true,
      depthWrite: false,
    })
    const shadow = new THREE.Mesh(blobGeo, shadowMat)
    shadow.renderOrder = 2
    group.add(shadow)
    disposables.push(body, ...caps, shadowMat)
    return { group: g, body, caps, shadow, shadowMat }
  })

  /* Flowers */
  const textDepth = depth * 0.6
  const centreZ = fp.zFar + depth * 0.46
  const field = plantHeadline({
    width: 2 * fp.halfAt(centreZ + textDepth / 2) * 0.86,
    depth: textDepth,
    centreZ,
    stretch: 1 / Math.cos(TILT),
    maxCount: opts.coarse ? 4800 : 7500,
    fontFamily: FONT,
    timeline: { start: T.flowerStart, sweep: T.flowerSweep, edgeLead: T.edgeLead },
  })
  const quad = new THREE.PlaneGeometry(1, 1)
  const fgeo = new THREE.InstancedBufferGeometry()
  fgeo.index = quad.index
  fgeo.setAttribute('position', quad.getAttribute('position'))
  fgeo.setAttribute('uv', quad.getAttribute('uv'))
  fgeo.setAttribute('aPos', new THREE.InstancedBufferAttribute(field.pos, 3))
  fgeo.setAttribute('aSize', new THREE.InstancedBufferAttribute(field.size, 1))
  fgeo.setAttribute('aPetal', new THREE.InstancedBufferAttribute(field.petal, 3))
  fgeo.setAttribute('aCentre', new THREE.InstancedBufferAttribute(field.centre, 3))
  fgeo.setAttribute('aShape', new THREE.InstancedBufferAttribute(field.shape, 3))
  fgeo.setAttribute('aBirth', new THREE.InstancedBufferAttribute(field.birth, 1))
  fgeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(field.seed, 1))
  fgeo.instanceCount = field.count
  disposables.push(quad, fgeo)

  const flowerUniforms = {
    uP: { value: 0 },
    uGrow: { value: T.flowerGrow },
    uTime: { value: 0 },
    uWind: { value: opts.reduced ? 0 : 0.09 },
    uGrassTop: { value: TURF_BASE + GRASS_H },
  }
  const shadowMat = new THREE.ShaderMaterial({
    vertexShader: S.FLOWER_SHADOW_VERT,
    fragmentShader: S.FLOWER_SHADOW_FRAG,
    uniforms: {
      ...flowerUniforms,
      uShadowDir: { value: new THREE.Vector2(-SUN[0] / SUN[1], -SUN[2] / SUN[1]) },
    },
    transparent: true,
    depthWrite: false,
  })
  const right = new THREE.Vector3().setFromMatrixColumn(ctx.camera.matrixWorld, 0)
  right.y = 0
  right.normalize()
  const stemMat = new THREE.ShaderMaterial({
    vertexShader: S.STEM_VERT,
    fragmentShader: S.STEM_FRAG,
    uniforms: { ...flowerUniforms, ...light, uCamRight: { value: right }, uStemW: { value: 0.011 } },
    side: THREE.DoubleSide,
  })
  const bloomMat = new THREE.ShaderMaterial({
    vertexShader: S.BLOOM_VERT,
    fragmentShader: S.BLOOM_FRAG,
    uniforms: { ...flowerUniforms, ...light },
    side: THREE.DoubleSide,
    alphaToCoverage: true,
  })
  ;[shadowMat, stemMat, bloomMat].forEach((m, i) => {
    const mesh = new THREE.Mesh(fgeo, m)
    mesh.frustumCulled = false
    mesh.renderOrder = 4 + i
    group.add(mesh)
    disposables.push(m)
  })

  /* The plantings --------------------------------------------------------
   *
   * Low shrubs around the outside of the frame — trees projected across
   * the headline from well outside it at this tilt (Marcin: "usuń drzewa
   * — zasłaniają"). They are planted, not scenery: they go in after the
   * turf, left to right, each unfurling its own leaves.
   */
  const shrubs = createShrubs(THREE, {
    halfFar: fp.halfFar,
    halfNear: fp.halfNear,
    zFar: fp.zFar,
    zNear: fp.zNear,
    // The bed the words are planted in, so the border can keep itself and
    // its shadows off it. Handed over rather than re-derived: these are the
    // very numbers `plantHeadline` was called with.
    bed: {
      centreZ,
      halfDepth: textDepth / 2,
      halfWidth: fp.halfAt(centreZ + textDepth / 2) * 0.86,
    },
    light,
    coarse: opts.coarse,
    window: [T.plantStart, T.plantEnd],
  })
  group.add(shrubs.group)
  disposables.push(shrubs)

  return {
    group,
    shrubs,
    strips,
    r0,
    core,
    rolls,
    grass: grassMat,
    flowerMats: [shadowMat, stemMat, bloomMat],
    field,
    dispose() {
      for (const d of disposables) d.dispose()
    },
  }
}

/* ---- Per frame ----------------------------------------------------- */
function update(w: World, p: number, ctx: SceneCtx) {
  const zc = w.grass.uniforms.uZc.value as number[]
  w.strips.forEach((s, i) => {
    const e = easeInOut((p - s.startAt) / T.rollSpan)
    const z = s.zInit + s.total * e
    const used = z - s.zInit
    const r = Math.sqrt(Math.max(w.core * w.core, w.r0 * w.r0 - (s.tau * used) / Math.PI))
    // Rolling without slipping: dφ = dz / r, integrated in closed form.
    const phi = ((2 * Math.PI) / s.tau) * (w.r0 - r)
    zc[i] = z
    const roll = w.rolls[i]
    const alive = e < 0.999
    roll.group.visible = alive
    roll.shadow.visible = alive
    if (!alive) return
    roll.group.position.set(s.x, r + TURF_BASE * 0.5, z)
    roll.group.scale.set(s.len, r, r)
    roll.group.rotation.set(phi, 0, 0)
    roll.body.uniforms.uR.value = r
    for (const c of roll.caps) c.uniforms.uR.value = r
    roll.shadow.position.set(s.x + r * 0.25, TURF_BASE + GRASS_H + 0.01, z + r * 0.55)
    roll.shadow.scale.set(s.len * 1.06, 1, r * 2.9)
    roll.shadowMat.uniforms.uOpacity.value = 0.62 * Math.sqrt(r / w.r0)
  })
  w.grass.uniforms.uKnit.value = smoothstep(T.knit[0], T.knit[1], p)
  w.grass.uniforms.uTime.value = ctx.clock.time
  w.shrubs.update(ctx.clock.time, p)
  for (const m of w.flowerMats) {
    m.uniforms.uP.value = p
    m.uniforms.uTime.value = ctx.clock.time
  }
}

function normalize(v: [number, number, number]): [number, number, number] {
  const l = Math.hypot(v[0], v[1], v[2])
  return [v[0] / l, v[1] / l, v[2] / l]
}

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
