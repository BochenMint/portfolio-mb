import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { buildLoftWall, buildCapDisc, sampleKeyframes, ringPoint, type LoftSection, type Keyframe, type RingProfile } from './loft'
import { createShipMaterials, createNavLightMaterial } from './materials'

/**
 * MB Kite — original procedural stealth-frigate blockout.
 * Dual-gondola category (SR-2 class as a *type*, not a mesh): kite planform,
 * forked sensor prow, hexagonal gondolas grown from chines, 2D rhomboid
 * nozzles. No franchise contour, marks, or livery.
 *
 * Forward = local -Z. Pivot = bounding-box centroid.
 */

const HULL_LENGTH = 34
const HALF_LEN = HULL_LENGTH / 2
const RADIAL_SEGMENTS = 28
const STATIONS = 44

const HULL_HALF_WIDTH: Keyframe[] = [
  [0, 0.14],
  [0.08, 0.38],
  [0.18, 0.82],
  [0.32, 1.55],
  [0.48, 2.42],
  [0.62, 3.35],
  [0.74, 3.55],
  [0.86, 3.28],
  [0.94, 2.95],
  [1, 2.72],
]

const HULL_HALF_HEIGHT_TOP: Keyframe[] = [
  [0, 0.12],
  [0.12, 0.42],
  [0.3, 0.82],
  [0.5, 1.18],
  [0.68, 1.36],
  [0.86, 1.12],
  [1, 0.92],
]

const HULL_HALF_HEIGHT_BOT: Keyframe[] = [
  [0, 0.1],
  [0.16, 0.32],
  [0.4, 0.62],
  [0.68, 0.82],
  [1, 0.7],
]

const HULL_NX: Keyframe[] = [
  [0, 1.16],
  [0.4, 1.18],
  [1, 1.22],
]

const HULL_NY_TOP: Keyframe[] = [
  [0, 1.45],
  [0.5, 1.55],
  [1, 1.62],
]

const HULL_NY_BOT: Keyframe[] = [
  [0, 1.5],
  [1, 1.7],
]

function hullProfileAt(t: number): RingProfile & { centerX: number; centerY: number } {
  return {
    halfWidth: sampleKeyframes(HULL_HALF_WIDTH, t),
    halfHeight: sampleKeyframes(HULL_HALF_HEIGHT_TOP, t),
    halfHeightBottom: sampleKeyframes(HULL_HALF_HEIGHT_BOT, t),
    roundness: sampleKeyframes(HULL_NX, t),
    roundnessY: sampleKeyframes(HULL_NY_TOP, t),
    roundnessBottom: sampleKeyframes(HULL_NY_BOT, t),
    shape: 'diamond',
    cornerBlend: 0.14,
    centerX: 0,
    centerY: 0.06,
  }
}

function hullSurfaceAt(z: number) {
  const t = THREE.MathUtils.clamp((z + HALF_LEN) / HULL_LENGTH, 0, 1)
  return hullProfileAt(t)
}

function loftSolid(sections: LoftSection[], radial: number, caps = true): THREE.BufferGeometry {
  const wall = buildLoftWall(sections, radial)
  if (!caps) return wall
  const nose = buildCapDisc(sections[0], radial, -1)
  const tail = buildCapDisc(sections[sections.length - 1], radial, 1)
  const merged = mergeGeometries([wall, nose, tail]) as THREE.BufferGeometry
  wall.dispose()
  nose.dispose()
  tail.dispose()
  return merged
}

function prepareGeo(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const src = geo.index ? geo.toNonIndexed() : geo
  const pos = src.getAttribute('position')
  const n = pos.count
  const positions = new Float32Array(n * 3)
  positions.set(pos.array.subarray(0, n * 3))
  const uvArr = new Float32Array(n * 2)
  const uv = src.getAttribute('uv')
  if (uv) {
    for (let i = 0; i < n; i++) {
      uvArr[i * 2] = uv.getX(i)
      uvArr[i * 2 + 1] = uv.getY(i)
    }
  }
  const clean = new THREE.BufferGeometry()
  clean.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  clean.setAttribute('uv', new THREE.Float32BufferAttribute(uvArr, 2))
  clean.computeVertexNormals()
  if (src !== geo) src.dispose()
  geo.dispose()
  return clean
}

function mirrorX(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const g = geo.clone()
  g.scale(-1, 1, 1)
  const idx = g.getIndex()
  if (idx) {
    for (let i = 0; i < idx.count; i += 3) {
      const b = idx.getX(i + 1)
      idx.setX(i + 1, idx.getX(i + 2))
      idx.setX(i + 2, b)
    }
    idx.needsUpdate = true
  }
  g.computeVertexNormals()
  return g
}

function buildMainHullGeometry(): THREE.BufferGeometry {
  const sections: LoftSection[] = []
  for (let i = 0; i < STATIONS; i++) {
    const t = i / (STATIONS - 1)
    const p = hullProfileAt(t)
    sections.push({ z: -HALF_LEN + t * HULL_LENGTH, ...p })
  }
  return loftSolid(sections, RADIAL_SEGMENTS)
}

function buildHullBandGeometry(
  z0: number,
  z1: number,
  theta0Deg: number,
  theta1Deg: number,
  offset: number,
  zSteps = 18,
  thetaSteps = 5,
): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const radials: number[] = []
  for (let zi = 0; zi <= zSteps; zi++) {
    const z = THREE.MathUtils.lerp(z0, z1, zi / zSteps)
    const s = hullSurfaceAt(z)
    for (let ti = 0; ti <= thetaSteps; ti++) {
      const theta = THREE.MathUtils.degToRad(THREE.MathUtils.lerp(theta0Deg, theta1Deg, ti / thetaSteps))
      const [x, y] = ringPoint(theta, s)
      const len = Math.hypot(x, y) || 1
      const nx = x / len
      const ny = y / len
      positions.push(x + nx * offset + s.centerX, y + ny * offset + s.centerY, z)
      radials.push(nx, ny)
      uvs.push(ti / thetaSteps, zi / zSteps)
    }
  }
  const cols = thetaSteps + 1
  const indices: number[] = []
  for (let zi = 0; zi < zSteps; zi++) {
    for (let ti = 0; ti < thetaSteps; ti++) {
      const a = zi * cols + ti
      const b = a + 1
      const c = a + cols
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  const normalAttr = geo.getAttribute('normal')
  const centerIdx = Math.floor((zSteps / 2) * cols + thetaSteps / 2)
  const dot = normalAttr.getX(centerIdx) * radials[centerIdx * 2] + normalAttr.getY(centerIdx) * radials[centerIdx * 2 + 1]
  if (dot < 0) {
    const idx = geo.getIndex()!
    for (let i = 0; i < idx.count; i += 3) {
      const tmp = idx.getX(i + 1)
      idx.setX(i + 1, idx.getX(i + 2))
      idx.setX(i + 2, tmp)
    }
    idx.needsUpdate = true
    geo.computeVertexNormals()
  }
  return geo
}

const CANOPY_T0 = 0.24
const CANOPY_T1 = 0.4
const CANOPY_Z0 = -HALF_LEN + CANOPY_T0 * HULL_LENGTH
const CANOPY_Z1 = -HALF_LEN + CANOPY_T1 * HULL_LENGTH

function buildCanopyGeometry(): THREE.BufferGeometry {
  const stations = 12
  const sections: LoftSection[] = []
  for (let i = 0; i < stations; i++) {
    const t = i / (stations - 1)
    const z = CANOPY_Z0 + t * (CANOPY_Z1 - CANOPY_Z0)
    const s = hullSurfaceAt(z)
    const hh = t < 0.35 ? THREE.MathUtils.lerp(0.05, 0.22, t / 0.35) : t < 0.75 ? THREE.MathUtils.lerp(0.22, 0.18, (t - 0.35) / 0.4) : THREE.MathUtils.lerp(0.18, 0.05, (t - 0.75) / 0.25)
    const hw = t < 0.4 ? THREE.MathUtils.lerp(0.1, 0.28, t / 0.4) : THREE.MathUtils.lerp(0.28, 0.1, (t - 0.4) / 0.6)
    sections.push({
      z,
      centerX: 0,
      centerY: s.centerY + s.halfHeight + hh * 0.22,
      halfWidth: hw,
      halfHeight: hh,
      roundness: 2.4,
      roundnessY: 2.1,
      roundnessBottom: 3.2,
    })
  }
  return loftSolid(sections, 16)
}

function buildFangGeometry(sign: 1 | -1): THREE.BufferGeometry {
  const stations = 10
  const z0 = -HALF_LEN - 0.92
  const z1 = -HALF_LEN + 2.45
  const sections: LoftSection[] = []
  for (let i = 0; i < stations; i++) {
    const t = i / (stations - 1)
    let hw: number
    if (t < 0.28) hw = THREE.MathUtils.lerp(0.07, 0.26, t / 0.28)
    else hw = THREE.MathUtils.lerp(0.26, 0.12, (t - 0.28) / 0.72)
    const hh = hw * 0.7
    sections.push({
      z: THREE.MathUtils.lerp(z0, z1, t),
      centerX: sign * THREE.MathUtils.lerp(1.22, 0.2, t),
      centerY: THREE.MathUtils.lerp(-0.04, 0.05, t),
      halfWidth: hw,
      halfHeight: hh,
      halfHeightBottom: hh * 0.85,
      roundness: 1.28,
      shape: 'diamond',
      cornerBlend: 0.1,
    })
  }
  return loftSolid(sections, 12)
}

function buildNeedleGeometry(): THREE.BufferGeometry {
  const stations = 8
  const z0 = -HALF_LEN - 1.05
  const z1 = -HALF_LEN + 1.35
  const sections: LoftSection[] = []
  for (let i = 0; i < stations; i++) {
    const t = i / (stations - 1)
    const hw = t < 0.18 ? THREE.MathUtils.lerp(0.02, 0.048, t / 0.18) : THREE.MathUtils.lerp(0.048, 0.03, (t - 0.18) / 0.82)
    sections.push({
      z: THREE.MathUtils.lerp(z0, z1, t),
      centerY: 0.06,
      halfWidth: hw,
      halfHeight: hw * 0.85,
      roundness: 1.55,
      shape: 'diamond',
      cornerBlend: 0.2,
    })
  }
  return loftSolid(sections, 10)
}

function buildFangTipGeometry(sign: 1 | -1): THREE.BufferGeometry {
  const sections: LoftSection[] = [
    {
      z: -HALF_LEN - 0.92,
      centerX: sign * 1.22,
      centerY: -0.02,
      halfWidth: 0.04,
      halfHeight: 0.03,
      roundness: 1.35,
      shape: 'diamond',
      cornerBlend: 0.1,
    },
    {
      z: -HALF_LEN - 0.55,
      centerX: sign * 1.05,
      centerY: -0.01,
      halfWidth: 0.12,
      halfHeight: 0.08,
      roundness: 1.32,
      shape: 'diamond',
      cornerBlend: 0.1,
    },
  ]
  return loftSolid(sections, 10)
}

function buildNeedleTipGeometry(): THREE.BufferGeometry {
  const sections: LoftSection[] = [
    { z: -HALF_LEN - 1.05, centerY: 0.06, halfWidth: 0.012, halfHeight: 0.01, roundness: 1.4, shape: 'diamond', cornerBlend: 0.15 },
    { z: -HALF_LEN - 0.72, centerY: 0.06, halfWidth: 0.038, halfHeight: 0.03, roundness: 1.45, shape: 'diamond', cornerBlend: 0.15 },
  ]
  return loftSolid(sections, 10)
}

const GONDOLA_Z0 = 1.8
const GONDOLA_Z1 = 16.45
const GONDOLA_STATIONS = 16

function gondolaX(sign: 1 | -1, z: number, t: number): number {
  const hw = hullSurfaceAt(z).halfWidth
  return sign * (hw * 0.58 + THREE.MathUtils.lerp(0.02, 0.16, t))
}

function gondolaY(z: number): number {
  const s = hullSurfaceAt(z)
  return s.centerY - (s.halfHeightBottom ?? s.halfHeight) * 0.18
}

function buildGondolaGeometry(sign: 1 | -1): THREE.BufferGeometry {
  const sections: LoftSection[] = []
  for (let i = 0; i < GONDOLA_STATIONS; i++) {
    const t = i / (GONDOLA_STATIONS - 1)
    const z = THREE.MathUtils.lerp(GONDOLA_Z0, GONDOLA_Z1, t)
    let hw: number
    if (t < 0.18) hw = THREE.MathUtils.lerp(0.12, 0.62, t / 0.18)
    else if (t < 0.82) hw = THREE.MathUtils.lerp(0.62, 0.78, (t - 0.18) / 0.64)
    else hw = THREE.MathUtils.lerp(0.78, 0.7, (t - 0.82) / 0.18)
    const hh = hw * 0.38
    sections.push({
      z,
      centerX: gondolaX(sign, z, t),
      centerY: gondolaY(z),
      halfWidth: hw,
      halfHeight: hh,
      halfHeightBottom: hh * 0.92,
      roundness: 1.22,
      shape: 'diamond',
      cornerBlend: 0.05,
    })
  }
  return loftSolid(sections, 12)
}

function buildStrakeGeometry(sign: 1 | -1): THREE.BufferGeometry {
  const z0 = -9.2
  const z1 = 15.6
  const stations = 14
  const sections: LoftSection[] = []
  for (let i = 0; i < stations; i++) {
    const t = i / (stations - 1)
    const z = THREE.MathUtils.lerp(z0, z1, t)
    const s = hullSurfaceAt(z)
    const hw = t < 0.2 ? THREE.MathUtils.lerp(0.08, 0.28, t / 0.2) : t < 0.75 ? THREE.MathUtils.lerp(0.28, 0.4, (t - 0.2) / 0.55) : THREE.MathUtils.lerp(0.4, 0.22, (t - 0.75) / 0.25)
    const hh = hw * 0.48
    sections.push({
      z,
      centerX: sign * (s.halfWidth * 0.96),
      centerY: s.centerY - (s.halfHeightBottom ?? s.halfHeight) * 0.08,
      halfWidth: hw,
      halfHeight: hh,
      halfHeightBottom: hh * 0.9,
      roundness: 1.2,
      shape: 'diamond',
      cornerBlend: 0.06,
    })
  }
  return loftSolid(sections, 10)
}

function buildRhombicNozzle(width: number, height: number, depth: number): THREE.BufferGeometry {
  const sections: LoftSection[] = []
  const stations = 5
  for (let i = 0; i < stations; i++) {
    const t = i / (stations - 1)
    const flare = THREE.MathUtils.lerp(0.78, 1, t)
    sections.push({
      z: t * depth,
      halfWidth: (width / 2) * flare,
      halfHeight: (height / 2) * flare,
      halfHeightBottom: (height / 2) * flare * 0.92,
      roundness: 1.3,
      shape: 'diamond',
      cornerBlend: 0.06,
    })
  }
  return loftSolid(sections, 12, false)
}

function buildFinGeometry(height: number, rootChord: number, tipChord: number, sweep: number, thickness: number): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(rootChord, 0)
  shape.lineTo(sweep + tipChord, height)
  shape.lineTo(sweep, height)
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.28,
    bevelSize: thickness * 0.22,
    bevelSegments: 1,
  })
  geo.translate(0, 0, -thickness / 2)
  geo.rotateY(-Math.PI / 2)
  geo.computeVertexNormals()
  return geo
}

export type ShipHull = {
  group: THREE.Group
  nozzleAttachPoints: THREE.Vector3[]
  dispose(): void
}

type Slot = 'graphite' | 'chrome' | 'ceramic' | 'glass' | 'heat'

export function buildShipHull(envMap: THREE.Texture | null, renderer?: THREE.WebGLRenderer | null): ShipHull {
  const materials = createShipMaterials(envMap, renderer)
  const group = new THREE.Group()
  group.name = 'ship-hull-mb-kite'

  const buckets: Record<Slot, THREE.BufferGeometry[]> = {
    graphite: [],
    chrome: [],
    ceramic: [],
    glass: [],
    heat: [],
  }

  function take(geo: THREE.BufferGeometry, slot: Slot) {
    buckets[slot].push(prepareGeo(geo))
  }

  take(buildMainHullGeometry(), 'graphite')
  take(buildFangGeometry(1), 'graphite')
  take(buildFangGeometry(-1), 'graphite')
  take(buildNeedleGeometry(), 'graphite')
  take(buildNeedleTipGeometry(), 'chrome')
  take(buildStrakeGeometry(1), 'graphite')
  take(buildStrakeGeometry(-1), 'graphite')
  take(buildGondolaGeometry(1), 'graphite')
  take(buildGondolaGeometry(-1), 'graphite')
  take(buildCanopyGeometry(), 'glass')

  take(buildHullBandGeometry(-HALF_LEN + 1.2, HALF_LEN - 1.4, -10, 10, 0.028, 22, 5), 'chrome')
  take(buildHullBandGeometry(-HALF_LEN + 1.2, HALF_LEN - 1.4, 170, 190, 0.028, 22, 5), 'chrome')
  take(buildHullBandGeometry(-HALF_LEN + 0.15, -HALF_LEN + 3.6, 28, 58, 0.03, 10, 4), 'chrome')
  take(buildHullBandGeometry(-HALF_LEN + 0.15, -HALF_LEN + 3.6, 122, 152, 0.03, 10, 4), 'chrome')

  const keel = buildFinGeometry(0.78, 6.2, 0.42, 2.8, 0.065)
  keel.translate(0, hullSurfaceAt(3.4).halfHeight + 0.02, 3.4)
  take(keel, 'graphite')
  const keelEdge = buildFinGeometry(0.74, 0.38, 0.1, 0.16, 0.04)
  keelEdge.translate(0, hullSurfaceAt(1.6).halfHeight + 0.04, 1.4)
  take(keelEdge, 'chrome')

  const canard = buildFinGeometry(0.48, 0.95, 0.16, 0.52, 0.04)
  const canardStbd = canard.clone()
  canardStbd.rotateZ(-Math.PI / 2)
  canardStbd.rotateY(-0.22)
  canardStbd.translate(0.55, 0.04, -12.4)
  const canardPort = mirrorX(canardStbd)
  canard.dispose()
  take(canardStbd, 'graphite')
  take(canardPort, 'graphite')

  take(buildFangTipGeometry(1), 'chrome')
  take(buildFangTipGeometry(-1), 'chrome')

  const nozzleDepth = 0.68
  const nozzleW = 1.08
  const nozzleH = 0.34
  const nozzleAttachPoints: THREE.Vector3[] = []

  for (const sign of [1, -1] as const) {
    const t = 1
    const z = GONDOLA_Z1
    const x = gondolaX(sign, z, t)
    const y = gondolaY(z)
    const sleeve = buildRhombicNozzle(nozzleW, nozzleH, nozzleDepth)
    sleeve.translate(x, y, z)
    take(sleeve, 'ceramic')
    const lip = buildRhombicNozzle(nozzleW * 1.06, nozzleH * 1.08, 0.08)
    lip.translate(x, y, z + nozzleDepth * 0.9)
    take(lip, 'chrome')
    const throat = buildRhombicNozzle(nozzleW * 0.7, nozzleH * 0.62, 0.14)
    throat.translate(x, y, z + nozzleDepth * 0.82)
    take(throat, 'heat')
    nozzleAttachPoints.push(new THREE.Vector3(x, y, z + nozzleDepth + 0.05))
  }

  const slotZ = HALF_LEN - 0.28
  const slot = buildRhombicNozzle(0.7, 0.22, 0.58)
  slot.translate(0, -0.08, slotZ)
  take(slot, 'ceramic')
  const slotLip = buildRhombicNozzle(0.74, 0.24, 0.07)
  slotLip.translate(0, -0.08, slotZ + 0.48)
  take(slotLip, 'chrome')
  const slotThroat = buildRhombicNozzle(0.48, 0.14, 0.12)
  slotThroat.translate(0, -0.08, slotZ + 0.4)
  take(slotThroat, 'heat')
  nozzleAttachPoints.push(new THREE.Vector3(0, -0.08, slotZ + 0.62))

  const ownedGeometries: THREE.BufferGeometry[] = []
  const slotMat: Record<Slot, THREE.MeshPhysicalMaterial> = {
    graphite: materials.graphite,
    chrome: materials.chrome,
    ceramic: materials.ceramic,
    glass: materials.glass,
    heat: materials.heat,
  }

  for (const slotName of Object.keys(buckets) as Slot[]) {
    const geos = buckets[slotName]
    if (!geos.length) continue
    const merged = mergeGeometries(geos, false)
    if (!merged) {
      for (const g of geos) {
        ownedGeometries.push(g)
        const mesh = new THREE.Mesh(g, slotMat[slotName])
        mesh.name = `mb-kite-${slotName}`
        if (slotName === 'glass') mesh.renderOrder = 1
        group.add(mesh)
      }
      continue
    }
    for (const g of geos) g.dispose()
    prepareGeo(merged)
    ownedGeometries.push(merged)
    const mesh = new THREE.Mesh(merged, slotMat[slotName])
    mesh.name = `mb-kite-${slotName}`
    if (slotName === 'glass') mesh.renderOrder = 1
    group.add(mesh)
  }

  const box = new THREE.Box3().setFromObject(group)
  const center = box.getCenter(new THREE.Vector3())
  for (const geo of ownedGeometries) {
    geo.translate(-center.x, -center.y, -center.z)
    geo.computeBoundingBox()
    geo.computeBoundingSphere()
  }
  for (const p of nozzleAttachPoints) p.sub(center)

  const navLightGeo = new THREE.SphereGeometry(0.06, 10, 8)
  ownedGeometries.push(navLightGeo)
  const portMat = createNavLightMaterial(0xff2a2a)
  const starMat = createNavLightMaterial(0x2bff5e)

  const stbd = nozzleAttachPoints[0]
  const port = nozzleAttachPoints[1]
  const portLight = new THREE.Mesh(navLightGeo, portMat)
  portLight.position.set(port.x - 0.72, port.y + 0.16, port.z - 5.2)
  portLight.name = 'nav-port'
  group.add(portLight)
  const starLight = new THREE.Mesh(navLightGeo, starMat)
  starLight.position.set(stbd.x + 0.72, stbd.y + 0.16, stbd.z - 5.2)
  starLight.name = 'nav-starboard'
  group.add(starLight)

  const sized = new THREE.Box3().setFromObject(group)
  const size = sized.getSize(new THREE.Vector3())
  let tris = 0
  let draws = 0
  group.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh) || !obj.visible) return
    draws += 1
    const g = obj.geometry
    const idx = g.getIndex()
    tris += idx ? idx.count / 3 : g.getAttribute('position').count / 3
  })
  group.userData.hullStats = {
    tris,
    drawCalls: draws,
    length: size.z,
    span: size.x,
    height: size.y,
  }
  group.userData.engineAnchors = nozzleAttachPoints.map((p) => p.toArray())

  return {
    group,
    nozzleAttachPoints,
    dispose() {
      for (const geo of ownedGeometries) geo.dispose()
      portMat.dispose()
      starMat.dispose()
      materials.dispose()
    },
  }
}
