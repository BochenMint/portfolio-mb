import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { buildLoftWall, buildCapDisc, sampleKeyframes, ringPoint, type LoftSection, type Keyframe, type RingProfile } from './loft'
import { createShipMaterials, createNavLightMaterial } from './materials'

/**
 * Original lofted-hull stealth frigate — strong Normandy-CLASS silhouette
 * (wide flattened hull, chiseled drooping nose with a cockpit glazing strip,
 * dorsal hump rising behind the cockpit, faired-in flank nacelles ending in
 * paired round nozzles, twin upswept canted tail fins, two-tone flank
 * accent banding) with zero copied geometry and zero franchise markings or
 * livery. Every surface is written from scratch as a superellipse loft,
 * hull-hugging band strip, or bevelled extrude.
 */

const HULL_LENGTH = 23
const HALF_LEN = HULL_LENGTH / 2
const RADIAL_SEGMENTS = 64
const STATIONS = 96

// ─── Main hull profile — keyframed along spine parameter t ∈ [0,1] ──────────
// (0 = nose tip at z=-11.5, 1 = stern at z=+11.5; forward = -Z)
// Cross-sections are wider than tall (~1.6:1 at midships) with a flattened
// belly — a lifting-body plan, not a round dart.
const HULL_HALF_WIDTH: Keyframe[] = [
  [0, 0.3],
  [0.06, 0.85],
  [0.15, 1.15],
  [0.28, 1.4],
  [0.45, 1.54],
  [0.58, 1.58],
  [0.7, 1.44],
  [0.82, 1.16],
  [0.92, 0.94],
  [1, 0.8],
]
const HULL_HALF_HEIGHT_TOP: Keyframe[] = [
  [0, 0.12],
  [0.06, 0.36],
  [0.15, 0.6],
  [0.3, 0.76],
  [0.5, 0.98],
  [0.62, 1.0],
  [0.75, 0.88],
  [0.9, 0.68],
  [1, 0.55],
]
const HULL_HALF_HEIGHT_BOT: Keyframe[] = [
  [0, 0.1],
  [0.06, 0.3],
  [0.15, 0.51],
  [0.3, 0.64],
  [0.5, 0.86],
  [0.62, 0.9],
  [0.75, 0.8],
  [0.9, 0.62],
  [1, 0.5],
]
// Horizontal Lamé exponent — LOW toward the nose (chiseled, wedge-like
// flanks), moderate midships, easing again at the stern.
const HULL_NX: Keyframe[] = [
  [0, 1.5],
  [0.1, 1.7],
  [0.25, 2.15],
  [0.45, 2.65],
  [0.65, 2.85],
  [0.85, 2.65],
  [1, 2.4],
]
// Vertical exponent, top quadrants — gently rounded crown.
const HULL_NY_TOP: Keyframe[] = [
  [0, 1.9],
  [0.15, 2.2],
  [0.4, 2.6],
  [0.7, 2.7],
  [1, 2.4],
]
// Vertical exponent, bottom quadrants — high = visibly flat belly.
const HULL_NY_BOT: Keyframe[] = [
  [0, 2.2],
  [0.15, 3.0],
  [0.4, 4.6],
  [0.7, 4.8],
  [1, 4.0],
]
// Vertical spine offset — the signature drooping chisel nose, level
// midships, modest rise into the stern (the dorsal hump supplies the rest
// of the raised-aft read).
const HULL_SPINE_Y: Keyframe[] = [
  [0, -1.05],
  [0.1, -0.82],
  [0.22, -0.5],
  [0.35, -0.16],
  [0.5, 0.0],
  [0.65, 0.12],
  [0.8, 0.35],
  [1, 0.6],
]

function hullProfileAt(t: number): RingProfile & { centerY: number } {
  return {
    halfWidth: sampleKeyframes(HULL_HALF_WIDTH, t),
    halfHeight: sampleKeyframes(HULL_HALF_HEIGHT_TOP, t),
    halfHeightBottom: sampleKeyframes(HULL_HALF_HEIGHT_BOT, t),
    roundness: sampleKeyframes(HULL_NX, t),
    roundnessY: sampleKeyframes(HULL_NY_TOP, t),
    roundnessBottom: sampleKeyframes(HULL_NY_BOT, t),
    centerY: sampleKeyframes(HULL_SPINE_Y, t),
  }
}

function buildMainHullGeometry(): THREE.BufferGeometry {
  const sections: LoftSection[] = []
  for (let i = 0; i < STATIONS; i++) {
    const t = i / (STATIONS - 1)
    sections.push({ z: -HALF_LEN + t * HULL_LENGTH, ...hullProfileAt(t) })
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

/** Hull profile + spine offset at a given z — used to seat greebles and
 * appendages flush against the hull surface instead of guessing offsets. */
function hullSurfaceAt(z: number) {
  const t = THREE.MathUtils.clamp((z + HALF_LEN) / HULL_LENGTH, 0, 1)
  return hullProfileAt(t)
}

/** Exact point ON the hull surface at a given z and angle (0deg =
 * side/starboard, 90deg = top) — for flush-mounted greebles. `sign` mirrors
 * to port. */
function hullSurfacePoint(z: number, thetaDeg: number, sign: 1 | -1 = 1): THREE.Vector3 {
  const s = hullSurfaceAt(z)
  const [x, y] = ringPoint(THREE.MathUtils.degToRad(thetaDeg), s)
  return new THREE.Vector3(sign * x, y + s.centerY, z)
}

// ─── Hull-hugging band strips (cockpit glazing, flank accent bands) ─────────
// A grid of points sampled directly off the hull surface across a theta range
// and z range, pushed slightly outward along the radial direction — the band
// follows the droop, taper, and superellipse curvature exactly, so it reads
// as inlaid paneling rather than a floating decal slab.
function buildHullBandGeometry(
  z0: number,
  z1: number,
  theta0Deg: number,
  theta1Deg: number,
  offset: number,
  zSteps = 24,
  thetaSteps = 20,
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
      positions.push(x + nx * offset, y + ny * offset + s.centerY, z)
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
  // Orientation check: winding depends on the theta sweep direction, so
  // verify the computed normal points outward (along the radial) and flip
  // the winding if it doesn't.
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

// ─── Dorsal hump — rises behind the cockpit, peaks midships, tapers into
// the stern between the tail fins. Seated procedurally on the actual hull
// crown at every station so it always reads as swollen hull, never a pod
// floating above the deck. ─────────────────────────────────────────────────
const HUMP_Z0 = -6.2
const HUMP_Z1 = 9.6
const HUMP_STATIONS = 32
const HUMP_RADIAL = 40
const HUMP_HW: Keyframe[] = [
  [0, 0.1],
  [0.25, 0.62],
  [0.55, 0.9],
  [0.8, 0.78],
  [1, 0.26],
]
const HUMP_HH: Keyframe[] = [
  [0, 0.05],
  [0.2, 0.3],
  [0.5, 0.54],
  [0.75, 0.5],
  [0.92, 0.34],
  [1, 0.07],
]

function humpCenterYAt(z: number, t: number): number {
  const s = hullSurfaceAt(z)
  const hullTop = s.centerY + s.halfHeight
  const hh = sampleKeyframes(HUMP_HH, t)
  // Bottom of the hump loft stays buried ~0.35 under the hull crown while
  // the crown of the hump rises with its own half-height profile.
  return hullTop + hh * 0.9 - 0.35
}

function buildHumpGeometry(): THREE.BufferGeometry {
  const sections: LoftSection[] = []
  for (let i = 0; i < HUMP_STATIONS; i++) {
    const t = i / (HUMP_STATIONS - 1)
    const z = HUMP_Z0 + t * (HUMP_Z1 - HUMP_Z0)
    sections.push({
      z,
      halfWidth: sampleKeyframes(HUMP_HW, t),
      halfHeight: sampleKeyframes(HUMP_HH, t),
      roundness: 2.6,
      roundnessY: 2.4,
      roundnessBottom: 3.2,
      centerY: humpCenterYAt(z, t),
    })
  }
  const wall = buildLoftWall(sections, HUMP_RADIAL)
  const frontCap = buildCapDisc(sections[0], HUMP_RADIAL, -1)
  const aftCap = buildCapDisc(sections[HUMP_STATIONS - 1], HUMP_RADIAL, 1)
  const merged = mergeGeometries([wall, frontCap, aftCap]) as THREE.BufferGeometry
  wall.dispose()
  frontCap.dispose()
  aftCap.dispose()
  return merged
}

// ─── Faired-in flank nacelles — thick wide/flat lofts blended against the
// aft hull sides (the inner portion of each section overlaps the hull flank),
// each ending in a PAIRED set of large round nozzles. Not pipes on pylons. ──
const NAC_Z0 = 3.0
const NAC_Z1 = 12.1
const NAC_LENGTH = NAC_Z1 - NAC_Z0
const NAC_STATIONS = 36
const NAC_RADIAL = 44
const NAC_X = 1.48
const NAC_Y = 0.08
const NAC_HW: Keyframe[] = [
  [0, 0.16],
  [0.15, 0.58],
  [0.45, 0.88],
  [0.75, 0.84],
  [1, 0.76],
]
const NAC_HH: Keyframe[] = [
  [0, 0.12],
  [0.15, 0.38],
  [0.45, 0.58],
  [0.8, 0.52],
  [1, 0.46],
]
const NOZZLE_PAIR_DX = 0.42
const NOZZLE_RIM_R = 0.4

function buildNacelleGeometry(): THREE.BufferGeometry {
  const sections: LoftSection[] = []
  for (let i = 0; i < NAC_STATIONS; i++) {
    const t = i / (NAC_STATIONS - 1)
    sections.push({
      z: NAC_Z0 + t * NAC_LENGTH,
      halfWidth: sampleKeyframes(NAC_HW, t),
      halfHeight: sampleKeyframes(NAC_HH, t),
      roundness: 2.0 + t * 1.0,
      roundnessY: 2.5,
      roundnessBottom: 3.4,
      centerY: NAC_Y,
    })
  }
  const wall = buildLoftWall(sections, NAC_RADIAL)
  const frontCap = buildCapDisc(sections[0], NAC_RADIAL, -1)
  const aftCap = buildCapDisc(sections[NAC_STATIONS - 1], NAC_RADIAL, 1)
  const merged = mergeGeometries([wall, frontCap, aftCap]) as THREE.BufferGeometry
  wall.dispose()
  frontCap.dispose()
  aftCap.dispose()
  return merged
}

// ─── Swept wing blades + twin upswept tail fins ─────────────────────────────
function buildWingGeometry(span: number, rootChord: number, tipChord: number, sweep: number, thickness: number): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(0, -rootChord)
  shape.lineTo(span, -sweep - tipChord)
  shape.lineTo(span, -sweep)
  shape.closePath()

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.35,
    bevelSize: thickness * 0.3,
    bevelSegments: 3,
    curveSegments: 1,
  })
  geo.rotateX(-Math.PI / 2) // span -> +X, chord/sweep -> +Z (aft), thickness -> Y
  geo.translate(0, -thickness / 2, 0)
  return geo
}

/** Tail fin planform in the ZY plane (chord aft = +Z, height = +Y),
 * thickness centered on X. Leading edge sweeps aft going up. */
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
    bevelThickness: thickness * 0.35,
    bevelSize: thickness * 0.3,
    bevelSegments: 3,
    curveSegments: 1,
  })
  geo.translate(0, 0, -thickness / 2)
  geo.rotateY(-Math.PI / 2) // shape-x (chord) -> +Z aft, shape-y (height) -> +Y, thickness -> X
  return geo
}

const FIN_X = 0.6
const FIN_Z0 = 8.4
const FIN_CANT = 0.36 // ~21deg outward lean

export type ShipHull = {
  group: THREE.Group
  /** Local-space nozzle positions, aft direction = local +Z — feeds engineFx. */
  nozzleAttachPoints: THREE.Vector3[]
  dispose(): void
}

export function buildShipHull(envMap: THREE.Texture | null): ShipHull {
  const materials = createShipMaterials(envMap)
  const group = new THREE.Group()
  group.name = 'ship-hull-v2'

  const ownedGeometries: THREE.BufferGeometry[] = []
  function addMesh(geo: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
    ownedGeometries.push(geo)
    const mesh = new THREE.Mesh(geo, material)
    group.add(mesh)
    return mesh
  }

  // ─── Main fuselage ─────────────────────────────────────────────────────
  addMesh(buildMainHullGeometry(), materials.steel)

  // ─── Dorsal hump / spine ────────────────────────────────────────────────
  addMesh(buildHumpGeometry(), materials.gunmetal)

  // ─── Cockpit glazing strip — slim dark glossy band wrapped over the nose
  // top, forward-facing, following the droop. ─────────────────────────────
  const cockpitMesh = addMesh(buildHullBandGeometry(-8.5, -7.2, 50, 130, 0.035, 10, 24), materials.glass)
  cockpitMesh.renderOrder = 1

  // ─── Two-tone flank accent bands — dark gunmetal stripe running the
  // length of each flank (layered paneling read, no markings). ────────────
  addMesh(buildHullBandGeometry(-8.8, 10.2, -26, 30, 0.032, 30, 14), materials.gunmetal)
  addMesh(buildHullBandGeometry(-8.8, 10.2, 150, 206, 0.032, 30, 14), materials.gunmetal)

  // ─── Faired-in flank nacelles + paired nozzle rims ──────────────────────
  const nacelleGeo = buildNacelleGeometry()
  ownedGeometries.push(nacelleGeo)
  const rimGeo = new THREE.CylinderGeometry(NOZZLE_RIM_R, NOZZLE_RIM_R * 1.08, 0.55, 36, 1, true)
  rimGeo.rotateX(Math.PI / 2)
  ownedGeometries.push(rimGeo)

  const nozzleAttachPoints: THREE.Vector3[] = []
  for (const sign of [-1, 1] as const) {
    const nacelle = new THREE.Mesh(nacelleGeo, materials.steel)
    nacelle.position.set(sign * NAC_X, 0, 0)
    group.add(nacelle)

    for (const dx of [-NOZZLE_PAIR_DX, NOZZLE_PAIR_DX]) {
      const rim = new THREE.Mesh(rimGeo, materials.gunmetal)
      rim.position.set(sign * NAC_X + dx, NAC_Y, NAC_Z1 + 0.12)
      group.add(rim)
      nozzleAttachPoints.push(new THREE.Vector3(sign * NAC_X + dx, NAC_Y, NAC_Z1 + 0.42))
    }
  }

  // ─── Swept wing blades — thin, from the flank outboard past the nacelles
  // (silhouette only; the nacelles carry the engines). ────────────────────
  const wingRootZ = 3.9
  const wingTipX = 4.5
  const wingDihedral = 0.06
  for (const sign of [-1, 1] as const) {
    const rootPos = hullSurfacePoint(wingRootZ + 1.2, -8, sign)
    const span = wingTipX - Math.abs(rootPos.x) * 0.92
    const wingGeo = buildWingGeometry(span, 3.2, 1.1, 3.0, 0.15)
    ownedGeometries.push(wingGeo)
    const wing = new THREE.Mesh(wingGeo, materials.blade)
    wing.position.set(sign * Math.abs(rootPos.x) * 0.92, rootPos.y, wingRootZ)
    wing.rotation.z = sign * wingDihedral
    if (sign < 0) wing.scale.x = -1
    group.add(wing)
  }

  // ─── Twin upswept tail fins, canted outward, rising between/above the
  // nacelles at the stern. ────────────────────────────────────────────────
  const finBase = hullSurfaceAt(FIN_Z0 + 1.2)
  const finRootY = finBase.centerY + finBase.halfHeight - 0.15
  const finGeo = buildFinGeometry(1.9, 2.7, 0.85, 2.0, 0.12)
  ownedGeometries.push(finGeo)
  for (const sign of [-1, 1] as const) {
    const fin = new THREE.Mesh(finGeo, materials.blade)
    fin.position.set(sign * FIN_X, finRootY, FIN_Z0)
    fin.rotation.z = -sign * FIN_CANT
    group.add(fin)
  }

  // ─── Greebles: dorsal antenna spines, RCS nub clusters, nav lights ──────
  const antennaGeo = new THREE.CylinderGeometry(0.014, 0.026, 0.9, 8)
  ownedGeometries.push(antennaGeo)
  for (const sign of [-1, 1] as const) {
    const antenna = new THREE.Mesh(antennaGeo, materials.gunmetal)
    const humpT = (6.2 - HUMP_Z0) / (HUMP_Z1 - HUMP_Z0)
    antenna.position.set(sign * 0.2, humpCenterYAt(6.2, humpT) + sampleKeyframes(HUMP_HH, humpT) + 0.4, 6.2)
    antenna.rotation.z = sign * -0.1
    antenna.rotation.x = 0.15
    group.add(antenna)
  }

  const nubGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.09, 10)
  ownedGeometries.push(nubGeo)
  const nubClusterOffsets: Array<[number, number, number]> = [
    [0, 0, 0],
    [0.16, 0.05, 0.02],
    [-0.12, 0.1, -0.03],
  ]
  const nubSpecs: Array<[number, number, 1 | -1]> = [
    [-7.6, 55, 1],
    [-7.6, 55, -1],
    [9.4, 60, 1],
    [9.4, 60, -1],
  ]
  for (const [z, theta, sign] of nubSpecs) {
    const base = hullSurfacePoint(z, theta, sign)
    const outward = new THREE.Vector3(base.x, base.y - hullSurfaceAt(z).centerY, 0).normalize()
    for (const [oz, along, out] of nubClusterOffsets) {
      const nub = new THREE.Mesh(nubGeo, materials.gunmetal)
      nub.position.copy(base).addScaledVector(outward, out).add(new THREE.Vector3(0, along, oz))
      nub.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), outward)
      group.add(nub)
    }
  }

  // Running lights — classic red port / green starboard / white aft.
  const navLightGeo = new THREE.SphereGeometry(0.055, 12, 10)
  ownedGeometries.push(navLightGeo)
  const portMat = createNavLightMaterial(0xff2a2a)
  const starMat = createNavLightMaterial(0x2bff5e)
  const whiteMat = createNavLightMaterial(0xffffff)

  const wingTipZ = wingRootZ + 3.0 + 0.55
  const wingRootRef = hullSurfacePoint(wingRootZ + 1.2, -8, 1)
  const wingTipY = wingRootRef.y + Math.sin(wingDihedral) * (wingTipX - wingRootRef.x)
  const portLight = new THREE.Mesh(navLightGeo, portMat)
  portLight.position.set(-wingTipX + 0.05, wingTipY, wingTipZ)
  group.add(portLight)
  const starLight = new THREE.Mesh(navLightGeo, starMat)
  starLight.position.set(wingTipX - 0.05, wingTipY, wingTipZ)
  group.add(starLight)
  const aftSurf = hullSurfaceAt(HALF_LEN)
  const whiteLight = new THREE.Mesh(navLightGeo, whiteMat)
  whiteLight.position.set(0, aftSurf.centerY + aftSurf.halfHeight * 0.7, HALF_LEN + 0.04)
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
