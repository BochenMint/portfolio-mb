import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { buildLoftWall, buildCapDisc, sampleKeyframes, ringPoint, type LoftSection, type Keyframe, type RingProfile } from './loft'
import { createShipMaterials, createNavLightMaterial } from './materials'

/**
 * Procedural SR-2-CLASS silhouette (geometry homage, no franchise mesh):
 *   • thin rectangular spine — the loft is a fuselage, not a cobra hood
 *   • hammerhead is a SEPARATE flat bar (młot), not a loft bulge
 *   • cockpit as a narrow dorsal island aft of the neck
 *   • two large engine silos on swept PLATE wings (T / inverted-Y from astern)
 *   • twin modest dorsal fins
 *
 * Forward = local -Z. Dark PBR only — no clay, no production wireframe.
 */

const HULL_LENGTH = 34
const HALF_LEN = HULL_LENGTH / 2
const RADIAL_SEGMENTS = 48
const STATIONS = 96

// Thin spine the whole way. Hammer width lives on its own meshes.
const HULL_HALF_WIDTH: Keyframe[] = [
  [0, 0.14],
  [0.08, 0.34],
  [0.16, 0.48],
  [0.32, 0.56],
  [0.5, 0.58],
  [0.7, 0.6],
  [0.88, 0.54],
  [1, 0.48],
]

const HULL_HALF_HEIGHT_TOP: Keyframe[] = [
  [0, 0.1],
  [0.14, 0.28],
  [0.4, 0.42],
  [0.68, 0.5],
  [0.88, 0.4],
  [1, 0.28],
]

const HULL_HALF_HEIGHT_BOT: Keyframe[] = [
  [0, 0.08],
  [0.14, 0.18],
  [0.4, 0.24],
  [0.68, 0.28],
  [1, 0.16],
]

const HULL_NX: Keyframe[] = [
  [0, 3.6],
  [0.2, 4.2],
  [0.6, 3.4],
  [1, 3.2],
]

const HULL_NY_TOP: Keyframe[] = [
  [0, 3.8],
  [0.3, 3.2],
  [1, 2.8],
]

const HULL_NY_BOT: Keyframe[] = [
  [0, 4.2],
  [1, 3.6],
]

function hullProfileAt(t: number): RingProfile & { centerX: number; centerY: number } {
  return {
    halfWidth: sampleKeyframes(HULL_HALF_WIDTH, t),
    halfHeight: sampleKeyframes(HULL_HALF_HEIGHT_TOP, t),
    halfHeightBottom: sampleKeyframes(HULL_HALF_HEIGHT_BOT, t),
    roundness: sampleKeyframes(HULL_NX, t),
    roundnessY: sampleKeyframes(HULL_NY_TOP, t),
    roundnessBottom: sampleKeyframes(HULL_NY_BOT, t),
    centerX: 0,
    centerY: 0,
  }
}

function buildMainHullGeometry(): THREE.BufferGeometry {
  const sections: LoftSection[] = []
  for (let i = 0; i < STATIONS; i++) {
    const t = i / (STATIONS - 1)
    const p = hullProfileAt(t)
    sections.push({ z: -HALF_LEN + t * HULL_LENGTH, ...p })
  }
  const wall = buildLoftWall(sections, RADIAL_SEGMENTS)
  const noseCap = buildCapDisc(sections[0], RADIAL_SEGMENTS, -1)
  const tailCap = buildCapDisc(sections[STATIONS - 1], RADIAL_SEGMENTS, 1)
  const merged = mergeGeometries([wall, noseCap, tailCap]) as THREE.BufferGeometry
  wall.dispose()
  noseCap.dispose()
  tailCap.dispose()
  return merged
}

function hullSurfaceAt(z: number) {
  const t = THREE.MathUtils.clamp((z + HALF_LEN) / HULL_LENGTH, 0, 1)
  return hullProfileAt(t)
}

function buildHullBandGeometry(
  z0: number,
  z1: number,
  theta0Deg: number,
  theta1Deg: number,
  offset: number,
  zSteps = 20,
  thetaSteps = 8,
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

const CANOPY_T0 = 0.22
const CANOPY_T1 = 0.36
const CANOPY_Z0 = -HALF_LEN + CANOPY_T0 * HULL_LENGTH
const CANOPY_Z1 = -HALF_LEN + CANOPY_T1 * HULL_LENGTH
const CANOPY_STATIONS = 14
const CANOPY_RADIAL = 20
const CANOPY_HW: Keyframe[] = [
  [0, 0.12],
  [0.3, 0.32],
  [0.7, 0.28],
  [1, 0.1],
]
const CANOPY_HH: Keyframe[] = [
  [0, 0.06],
  [0.35, 0.26],
  [0.7, 0.22],
  [1, 0.06],
]

function buildCanopyGeometry(): THREE.BufferGeometry {
  const sections: LoftSection[] = []
  for (let i = 0; i < CANOPY_STATIONS; i++) {
    const t = i / (CANOPY_STATIONS - 1)
    const z = CANOPY_Z0 + t * (CANOPY_Z1 - CANOPY_Z0)
    const s = hullSurfaceAt(z)
    const hh = sampleKeyframes(CANOPY_HH, t)
    sections.push({
      z,
      centerX: 0,
      centerY: s.centerY + s.halfHeight + hh * 0.28,
      halfWidth: sampleKeyframes(CANOPY_HW, t),
      halfHeight: hh,
      roundness: 2.6,
      roundnessY: 2.2,
      roundnessBottom: 3.4,
    })
  }
  const wall = buildLoftWall(sections, CANOPY_RADIAL)
  const frontCap = buildCapDisc(sections[0], CANOPY_RADIAL, -1)
  const aftCap = buildCapDisc(sections[CANOPY_STATIONS - 1], CANOPY_RADIAL, 1)
  const merged = mergeGeometries([wall, frontCap, aftCap]) as THREE.BufferGeometry
  wall.dispose()
  frontCap.dispose()
  aftCap.dispose()
  return merged
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
    bevelThickness: thickness * 0.3,
    bevelSize: thickness * 0.25,
    bevelSegments: 2,
  })
  geo.translate(0, 0, -thickness / 2)
  geo.rotateY(-Math.PI / 2)
  return geo
}

/** Thick strake / sponson — not a paper wing. Starboard planform; port is mirrored. */
function buildPylonGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0.12, 0.4)
  shape.lineTo(3.15, 2.35)
  shape.lineTo(3.35, 5.4)
  shape.lineTo(0.18, 4.1)
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.82,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.12,
    bevelSegments: 2,
  })
  geo.translate(0, 0, -0.41)
  geo.rotateX(Math.PI / 2)
  geo.computeVertexNormals()
  return geo
}

function buildNacelleGeometry(): THREE.BufferGeometry {
  const len = 10.6
  const half = len / 2
  const stations = 40
  const sections: LoftSection[] = []
  for (let i = 0; i < stations; i++) {
    const t = i / (stations - 1)
    let hw: number
    if (t < 0.14) hw = THREE.MathUtils.lerp(0.32, 1.02, t / 0.14)
    else if (t < 0.72) hw = THREE.MathUtils.lerp(1.02, 1.14, (t - 0.14) / 0.58)
    else hw = THREE.MathUtils.lerp(1.14, 1.08, (t - 0.72) / 0.28)
    const hh = hw * 0.78
    sections.push({
      z: -half + t * len,
      halfWidth: hw,
      halfHeight: hh,
      halfHeightBottom: hh * 0.92,
      roundness: 2.5,
      roundnessY: 2.3,
      roundnessBottom: 2.8,
    })
  }
  const wall = buildLoftWall(sections, 28)
  const noseCap = buildCapDisc(sections[0], 28, -1)
  const tailCap = buildCapDisc(sections[stations - 1], 28, 1)
  const merged = mergeGeometries([wall, noseCap, tailCap]) as THREE.BufferGeometry
  wall.dispose()
  noseCap.dispose()
  tailCap.dispose()
  return merged
}

const NACELLE_LEN = 10.6
const BELL_R = 0.98
const PYLON_Z = 3.4
const PYLON_Y = -0.22

function siloCenter(sign: 1 | -1): THREE.Vector3 {
  return new THREE.Vector3(sign * 3.85, -1.35, 7.65)
}

const FIN_T = 0.72
const FIN_Z0 = -HALF_LEN + FIN_T * HULL_LENGTH

export type ShipHull = {
  group: THREE.Group
  nozzleAttachPoints: THREE.Vector3[]
  dispose(): void
}

export function buildShipHull(envMap: THREE.Texture | null): ShipHull {
  const materials = createShipMaterials(envMap)
  const group = new THREE.Group()
  group.name = 'ship-hull-normandy'

  const ownedGeometries: THREE.BufferGeometry[] = []
  function addMesh(geo: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
    ownedGeometries.push(geo)
    const mesh = new THREE.Mesh(geo, material)
    group.add(mesh)
    return mesh
  }

  addMesh(buildMainHullGeometry(), materials.steel)

  const hammerZ = -HALF_LEN + 2.4
  const hammerBar = addMesh(new THREE.BoxGeometry(11.8, 0.48, 3.7), materials.gunmetal)
  hammerBar.position.set(0, 0.16, hammerZ)

  const hammerDeck = addMesh(new THREE.BoxGeometry(11.4, 0.16, 3.2), materials.steel)
  hammerDeck.position.set(0, 0.44, hammerZ)

  const hammerChin = addMesh(new THREE.BoxGeometry(10.6, 0.14, 2.4), materials.steel)
  hammerChin.position.set(0, -0.14, hammerZ + 0.2)

  const hammerLip = addMesh(new THREE.BoxGeometry(10.8, 0.32, 0.55), materials.gunmetal)
  hammerLip.position.set(0, 0.12, hammerZ - 1.95)

  const neck = addMesh(new THREE.BoxGeometry(1.7, 0.36, 2.4), materials.steel)
  neck.position.set(0, 0.2, hammerZ + 2.4)

  const canopyMesh = addMesh(buildCanopyGeometry(), materials.glass)
  canopyMesh.renderOrder = 1

  addMesh(buildHullBandGeometry(-5.5, 11.5, -12, 14, 0.014, 20, 5), materials.ceramic)
  addMesh(buildHullBandGeometry(-5.5, 11.5, 166, 194, 0.014, 20, 5), materials.ceramic)

  const pylonStbd = buildPylonGeometry()
  const pylonPort = buildPylonGeometry()
  pylonPort.scale(-1, 1, 1)
  const pylonIdx = pylonPort.getIndex()
  if (pylonIdx) {
    for (let i = 0; i < pylonIdx.count; i += 3) {
      const tmp = pylonIdx.getX(i + 1)
      pylonIdx.setX(i + 1, pylonIdx.getX(i + 2))
      pylonIdx.setX(i + 2, tmp)
    }
    pylonIdx.needsUpdate = true
  }
  pylonPort.computeVertexNormals()
  ownedGeometries.push(pylonStbd, pylonPort)
  for (const sign of [1, -1] as const) {
    const pylon = new THREE.Mesh(sign === 1 ? pylonStbd : pylonPort, materials.steel)
    pylon.position.set(0, PYLON_Y, PYLON_Z)
    pylon.rotation.z = -sign * 0.32
    group.add(pylon)
  }

  const nozzleAttachPoints: THREE.Vector3[] = []
  const nacelleGeo = buildNacelleGeometry()
  ownedGeometries.push(nacelleGeo)

  const bellGeo = new THREE.CylinderGeometry(BELL_R * 0.48, BELL_R, 0.7, 24, 1, true)
  bellGeo.rotateX(Math.PI / 2)
  ownedGeometries.push(bellGeo)

  for (const sign of [1, -1] as const) {
    const center = siloCenter(sign)
    const nacelle = new THREE.Mesh(nacelleGeo, materials.gunmetal)
    nacelle.position.copy(center)
    group.add(nacelle)

    const bell = new THREE.Mesh(bellGeo, materials.steel)
    bell.position.copy(center).add(new THREE.Vector3(0, 0, NACELLE_LEN * 0.5))
    group.add(bell)

    nozzleAttachPoints.push(center.clone().add(new THREE.Vector3(0, 0, NACELLE_LEN * 0.52)))
  }

  const finRootY = hullSurfaceAt(FIN_Z0).halfHeight + 0.02
  const finGeo = buildFinGeometry(2.15, 1.65, 0.28, 1.1, 0.07)
  ownedGeometries.push(finGeo)
  for (const sign of [-1, 1] as const) {
    const fin = new THREE.Mesh(finGeo, materials.gunmetal)
    fin.position.set(sign * 0.12, finRootY, FIN_Z0)
    fin.rotation.z = -sign * 0.08
    group.add(fin)
  }

  const navLightGeo = new THREE.SphereGeometry(0.045, 10, 8)
  ownedGeometries.push(navLightGeo)
  const portMat = createNavLightMaterial(0xff2a2a)
  const starMat = createNavLightMaterial(0x2bff5e)
  const whiteMat = createNavLightMaterial(0xd8e4f0)

  const starboard = siloCenter(1)
  const port = siloCenter(-1)
  const portLight = new THREE.Mesh(navLightGeo, portMat)
  portLight.position.copy(port).add(new THREE.Vector3(-0.85, 0.2, 0))
  group.add(portLight)
  const starLight = new THREE.Mesh(navLightGeo, starMat)
  starLight.position.copy(starboard).add(new THREE.Vector3(0.85, 0.2, 0))
  group.add(starLight)
  const aft = hullSurfaceAt(HALF_LEN)
  const whiteLight = new THREE.Mesh(navLightGeo, whiteMat)
  whiteLight.position.set(0, aft.centerY + aft.halfHeight * 0.8, HALF_LEN + 0.02)
  whiteLight.scale.setScalar(0.5)
  group.add(whiteLight)

  return {
    group,
    nozzleAttachPoints,
    dispose() {
      for (const geo of ownedGeometries) geo.dispose()
      portMat.dispose()
      starMat.dispose()
      whiteMat.dispose()
      materials.dispose()
    },
  }
}
