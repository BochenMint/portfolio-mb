/**
 * The garden: bare soil, turf rolled out over it by scroll, and a flower bed
 * that plants the headline into the new lawn.
 *
 * One perspective camera looks down at the ground plane (y = 0) from a 24°
 * tilt — enough for the rolls to read as cylinders and the lawn to have
 * depth, not so much that the words stop reading as words. Everything is
 * sized from what that camera can see, so a phone gets three strips and a
 * tall five-line bed while a wide screen gets seven strips and three lines.
 *
 * Conventions: 1 unit ≈ 0.25 m, +x right, +z toward the camera (the bottom
 * of the screen), the rolls travel +z. `three` is loaded here, behind the
 * dynamic import in `GardenStage.tsx`, so none of it is in the first bundle.
 */

import type * as THREE_NS from 'three'
import { plantHeadline, type FlowerField } from './letters'
import * as S from './shaders'
import { T, easeInOut } from './timeline'
import { createTrees, type Trees } from './trees'

export type GardenHandle = {
  /** Where the visitor is in the pinned section, 0…1. Eased toward, not jumped to. */
  setProgress(p: number): void
  resize(): void
  /** Stop the frame loop while the stage is off screen. */
  setVisible(v: boolean): void
  dispose(): void
  debug: {
    /** Snap to a progress with no easing and draw once. */
    jump(p: number, time?: number): void
    info(): Record<string, unknown>
  }
}

const DEG = Math.PI / 180
const TILT = 24 * DEG
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
  trees: Trees
  disposables: { dispose(): void }[]
}

export async function createGardenScene(
  canvas: HTMLCanvasElement,
  opts: { reduced: boolean; coarse: boolean },
): Promise<GardenHandle> {
  const THREE = await import('three')

  // The bed is set in the page's own face. Wait for it, but not forever: a
  // font that never arrives must not leave the stage empty.
  await Promise.race([
    document.fonts?.load(`900 64px "Hanken Grotesk"`, 'Zbudujęąó').catch(() => undefined),
    new Promise((r) => setTimeout(r, 2500)),
  ])

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  })
  // Capped: the lawn is a stack of full-screen layers, and past 1.5× the
  // blades are already finer than the eye resolves at arm's length.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.setClearColor(0x120c08, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(VFOV, 1, 0.1, 120)
  const light = {
    uSun: { value: new THREE.Vector3(...SUN) },
    uSunCol: { value: new THREE.Vector3(...SUN_COL) },
    uSky: { value: new THREE.Vector3(...SKY) },
  }
  const clock = { time: 0 }
  const shells = opts.coarse ? 10 : 14

  let world: World | null = null
  let aspectBuilt = 0
  let widthBuilt = 0

  /* ---- Framing ------------------------------------------------------- */
  function frame(aspect: number) {
    // Ground width held at the point the camera looks at: generous on a wide
    // screen, never so narrow on a phone that a strip is thinner than a roll.
    const targetW = Math.max(5.6, Math.min(14.5, 7.8 * aspect))
    const d = targetW / (2 * Math.tan((VFOV * DEG) / 2) * aspect)
    camera.aspect = aspect
    camera.position.set(0, d * Math.cos(TILT), d * Math.sin(TILT))
    camera.up.set(0, 1, 0)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld(true)

    // Where the four corners of the view land on the ground.
    const hit = (nx: number, ny: number) => {
      const v = new THREE.Vector3(nx, ny, 0.5).unproject(camera).sub(camera.position).normalize()
      const t = -camera.position.y / v.y
      return camera.position.clone().addScaledVector(v, t)
    }
    const tl = hit(-1, 1)
    const bl = hit(-1, -1)
    return {
      zFar: tl.z,
      zNear: bl.z,
      halfFar: Math.abs(tl.x),
      halfNear: Math.abs(bl.x),
      /** Half width of the visible ground at a given z. */
      halfAt(z: number) {
        const t = (z - tl.z) / (bl.z - tl.z)
        return Math.abs(tl.x) + (Math.abs(bl.x) - Math.abs(tl.x)) * t
      },
    }
  }

  /* ---- World (rebuilt when the shape of the screen changes) -------- */
  function build(aspect: number): World {
    const fp = frame(aspect)
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
        vertexShader: S.SOIL_VERT,
        // The finest grade of crumb is a whole extra voronoi per pixel over
        // the full screen, which is the one thing on this page a phone
        // cannot afford — and at a phone's size it is under a pixel anyway.
        fragmentShader: (opts.coarse ? '#define COARSE 1\n' : '') + S.SOIL_FRAG,
        uniforms: { ...light },
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
        vertexShader: S.BLOB_VERT,
        fragmentShader: S.BLOB_FRAG,
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
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0)
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

    /* Trees ------------------------------------------------------------
     *
     * The boundary of the garden, and the only thing in the scene that was
     * already here before the visitor arrived: the soil is being prepared,
     * the turf is being laid, the flowers are being planted — the trees
     * just stand there. They are placed outside the bed and their shadows
     * are kept off it, so they frame the words without ever touching them.
     */
    const trees = createTrees(THREE, {
      halfFar: fp.halfFar,
      halfNear: fp.halfNear,
      zFar: fp.zFar,
      zNear: fp.zNear,
      // The bed the words are planted in, so the grove can keep itself and
      // its shadows off it. Handed over rather than re-derived: these are the
      // very numbers `plantHeadline` was called with.
      bed: {
        centreZ,
        halfDepth: textDepth / 2,
        halfWidth: fp.halfAt(centreZ + textDepth / 2) * 0.86,
      },
      light,
      coarse: opts.coarse,
    })
    group.add(trees.group)
    disposables.push(trees)

    scene.add(group)
    return {
      group,
      trees,
      strips,
      r0,
      core,
      rolls,
      grass: grassMat,
      flowerMats: [shadowMat, stemMat, bloomMat],
      field,
      disposables,
    }
  }

  function destroy(w: World) {
    scene.remove(w.group)
    for (const d of w.disposables) d.dispose()
  }

  /* ---- Per frame ----------------------------------------------------- */
  function update(p: number) {
    const w = world
    if (!w) return
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
    w.grass.uniforms.uTime.value = clock.time
    w.trees.update(clock.time, p)
    for (const m of w.flowerMats) {
      m.uniforms.uP.value = p
      m.uniforms.uTime.value = clock.time
    }
  }

  /* ---- Size ------------------------------------------------------------ */
  function resize() {
    const host = canvas.parentElement ?? canvas
    const width = Math.max(1, host.clientWidth)
    const height = Math.max(1, host.clientHeight)
    renderer.setSize(width, height, false)
    const aspect = width / height
    // Rebuild only when the shape really changed. A phone's toolbar sliding
    // in and out changes the height by a few percent and must not replant
    // the whole bed.
    if (!world || Math.abs(aspect / aspectBuilt - 1) > 0.04 || Math.abs(width / widthBuilt - 1) > 0.04) {
      if (world) destroy(world)
      world = build(aspect)
      aspectBuilt = aspect
      widthBuilt = width
    } else {
      frame(aspect)
    }
    update(shown)
    dirty = true
  }

  /* ---- Loop ------------------------------------------------------------ */
  let target = opts.reduced ? 1 : 0
  let shown = target
  let visible = true
  let dirty = true
  let raf = 0
  let last = performance.now()
  let idleFor = 0
  let skip = false

  const draw = () => {
    renderer.render(scene, camera)
    dirty = false
  }

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    const gap = target - shown
    shown = Math.abs(gap) < 1e-4 ? target : shown + gap * (1 - Math.exp(-dt * 7))
    idleFor = Math.abs(gap) < 1e-4 ? idleFor + dt : 0
    // Wind keeps the lawn alive while nobody scrolls, at half the rate.
    if (idleFor > 1.5) {
      skip = !skip
      if (skip) return
    }
    clock.time += dt
    update(shown)
    draw()
  }

  const start = () => {
    if (raf || opts.reduced) return
    last = performance.now()
    raf = requestAnimationFrame(tick)
  }
  const stop = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }

  const onVisibility = () => {
    if (document.hidden) stop()
    else if (visible) start()
  }
  document.addEventListener('visibilitychange', onVisibility)

  resize()
  update(shown)
  draw()
  start()

  const handle: GardenHandle = {
    setProgress(p) {
      target = opts.reduced ? 1 : Math.min(1, Math.max(0, p))
      if (opts.reduced && dirty) draw()
    },
    resize() {
      resize()
      if (!raf) draw()
    },
    setVisible(v) {
      visible = v
      if (v && !document.hidden) start()
      else stop()
    },
    dispose() {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      if (world) destroy(world)
      world = null
      renderer.dispose()
    },
    debug: {
      jump(p, time) {
        target = shown = p
        if (time !== undefined) clock.time = time
        update(p)
        draw()
      },
      info() {
        return {
          strips: world?.strips.length,
          flowers: world?.field.count,
          lines: world?.field.lines,
          em: world?.field.em,
          pitch: world?.field.pitch,
          shells,
          trees: world?.trees.info(),
          pixelRatio: renderer.getPixelRatio(),
          progress: shown,
        }
      },
    },
  }
  return handle
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
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
