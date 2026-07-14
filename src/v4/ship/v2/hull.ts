import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { buildLoftWall, buildCapDisc, sampleKeyframes, ringPoint, type LoftSection, type Keyframe, type RingProfile } from './loft'
import { createShipMaterials, createNavLightMaterial } from './materials'

/**
 * Original lofted-hull stealth frigate — an SR-2-CLASS silhouette (long
 * needle nose with a drooped tip, a low canopy blister ~1/4 back, hull
 * cheeks flaring into a broad diamond-plan aft hull with a layered dorsal
 * spine, twin wing-booms sweeping aft/out/down from the flanks into big
 * engine pods, additional engines set into the stern block, and twin
 * upswept fins rising near the boom roots) with zero copied geometry and
 * zero franchise markings or livery. Every surface is written from scratch
 * as a superellipse loft, hull-hugging band strip, or bevelled extrude.
 *
 * Proportion map (see BRIEFS / final report for the reference study this
 * was sculpted against): nose taper runs to ~t=0.35 (a long thin wedge, not
 * a rocket cone); the canopy sits at t=0.20-0.34; the hull's widest point
 * (the diamond-plan flare that reads as the ship's "wings" in top view) is
 * at t≈0.72; the wing-booms root at t≈0.64 on the flank and sweep aft+out+
 * down to pods around t-equivalent 0.9+; the fins root near the boom roots
 * (t≈0.70) instead of at the very stern, matching the reference's mid-aft
 * "conning" fins rather than tail-tip fins.
 *
 * Deliberate deviations from the reference (documented, not accidental):
 *  1. A single large rounded engine pod per boom (with one bright thruster
 *     ring) instead of the reference's stacked hex-frame nacelle cluster.
 *  2. A plain antenna/nub greeble kit instead of the reference's exact
 *     panel-line/vent layout.
 *  3. No hull text, insignia, or livery stripe — accent banding is a plain
 *     two-tone gunmetal panel, not a copied graphic.
 */

const HULL_LENGTH = 23
const HALF_LEN = HULL_LENGTH / 2
const RADIAL_SEGMENTS = 64
const STATIONS = 96

// ─── Main hull profile — keyframed along spine parameter t ∈ [0,1] ──────────
// (0 = nose tip at z=-11.5, 1 = stern at z=+11.5; forward = -Z)
// A BROAD flat wedge nose (per art review: at t=0.25 the beam is already
// ~37% of max beam — a shallow wide chisel, not a needle) opening into a
// muscular diamond-plan aft hull (widest ~t=0.72, hull-only length:beam
// ≈ 4:1). Cross-sections stay much wider than tall (~2.8:1 at the flare)
// so the top view reads dagger+diamond and the side view reads as a long
// low lifting body with a substantial mid-aft block.
// Near-linear taper tip→widest gives a dead-straight leading edge in plan
// view (the monotone Hermite preserves collinear runs), kinking only at the
// diamond's widest point — the deliberate creased-wing read of the reference.
const HULL_HALF_WIDTH: Keyframe[] = [
  [0, 0.08],
  [0.1, 0.46],
  [0.25, 1.02],
  [0.4, 1.6],
  [0.55, 2.16],
  [0.64, 2.5],
  [0.72, 2.8],
  [0.8, 2.55],
  [0.88, 1.9],
  [0.95, 1.35],
  [1, 1.0],
]
const HULL_HALF_HEIGHT_TOP: Keyframe[] = [
  [0, 0.03],
  [0.06, 0.08],
  [0.14, 0.14],
  [0.25, 0.2],
  [0.35, 0.3],
  [0.46, 0.45],
  [0.56, 0.62],
  [0.64, 0.78],
  [0.72, 0.95],
  [0.8, 1.0],
  [0.88, 0.92],
  [0.95, 0.78],
  [1, 0.6],
]
const HULL_HALF_HEIGHT_BOT: Keyframe[] = [
  [0, 0.025],
  [0.06, 0.07],
  [0.14, 0.12],
  [0.25, 0.17],
  [0.35, 0.25],
  [0.46, 0.36],
  [0.56, 0.48],
  [0.64, 0.6],
  [0.72, 0.72],
  [0.8, 0.78],
  [0.88, 0.72],
  [0.95, 0.6],
  [1, 0.48],
]
// Horizontal Lamé exponent — very LOW at the nose (a chiseled, knife-thin
// wedge), climbing to a crisp flat-edged plate through the diamond flare
// (t≈0.6-0.85, so the widest section reads as sharp-edged in top view, like
// the reference's flat-panelled wing/cheek plan) and easing at the stern.
const HULL_NX: Keyframe[] = [
  [0, 1.3],
  [0.15, 1.55],
  [0.3, 1.95],
  [0.45, 2.35],
  [0.6, 2.9],
  [0.72, 3.6],
  [0.85, 3.1],
  [1, 2.6],
]
// Vertical exponent, top quadrants — flat-ish deck over the wedge nose
// (higher exponent = flatter crown, per art review), easing to a gently
// rounded crown aft.
const HULL_NY_TOP: Keyframe[] = [
  [0, 2.6],
  [0.2, 2.8],
  [0.45, 2.6],
  [0.7, 2.5],
  [1, 2.3],
]
// Vertical exponent, bottom quadrants — high = visibly flat belly.
const HULL_NY_BOT: Keyframe[] = [
  [0, 3.0],
  [0.2, 3.2],
  [0.45, 3.8],
  [0.7, 4.4],
  [1, 3.8],
]
// Vertical spine offset — a subtle drooping nose (long+thin now, so the
// droop is gentle rather than a steep chisel), level midships, modest rise
// into the stern.
const HULL_SPINE_Y: Keyframe[] = [
  [0, -0.55],
  [0.08, -0.46],
  [0.18, -0.32],
  [0.3, -0.16],
  [0.42, -0.04],
  [0.52, 0.0],
  [0.65, 0.06],
  [0.8, 0.16],
  [1, 0.28],
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

// ─── Hull-hugging band strips (flank accent bands) ──────────────────────────
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

// ─── Canopy blister — a LOW, subtle raised bubble on the nose crown at
// t≈0.20-0.34 (roughly a quarter of the way back), fairing into the hull
// rather than floating above it. Glass material reads as a dark visor strip
// against the polished hull, matching the reference's understated canopy
// (not a huge greenhouse bubble). ────────────────────────────────────────────
const CANOPY_T0 = 0.2
const CANOPY_T1 = 0.34
const CANOPY_Z0 = -HALF_LEN + CANOPY_T0 * HULL_LENGTH
const CANOPY_Z1 = -HALF_LEN + CANOPY_T1 * HULL_LENGTH
const CANOPY_STATIONS = 18
const CANOPY_RADIAL = 28
const CANOPY_HW: Keyframe[] = [
  [0, 0.08],
  [0.3, 0.26],
  [0.6, 0.28],
  [1, 0.1],
]
const CANOPY_HH: Keyframe[] = [
  [0, 0.03],
  [0.2, 0.2],
  [0.55, 0.3],
  [0.8, 0.23],
  [1, 0.04],
]

function canopyCenterYAt(z: number, t: number): number {
  const s = hullSurfaceAt(z)
  const hullTop = s.centerY + s.halfHeight
  const hh = sampleKeyframes(CANOPY_HH, t)
  return hullTop + hh * 0.7
}

function buildCanopyGeometry(): THREE.BufferGeometry {
  const sections: LoftSection[] = []
  for (let i = 0; i < CANOPY_STATIONS; i++) {
    const t = i / (CANOPY_STATIONS - 1)
    const z = CANOPY_Z0 + t * (CANOPY_Z1 - CANOPY_Z0)
    sections.push({
      z,
      halfWidth: sampleKeyframes(CANOPY_HW, t),
      halfHeight: sampleKeyframes(CANOPY_HH, t),
      roundness: 2.4,
      roundnessY: 2.2,
      roundnessBottom: 3.0,
      centerY: canopyCenterYAt(z, t),
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

// ─── Dorsal spine — rises behind the canopy, reads as a LAYERED ridge (a
// smaller forward shoulder, a dip, a taller aft ridge) rather than one smooth
// hump, tapering out before the stern. Seated procedurally on the actual
// hull crown at every station so it always reads as swollen hull. ──────────
const HUMP_T0 = 0.36
const HUMP_T1 = 0.9
const HUMP_Z0 = -HALF_LEN + HUMP_T0 * HULL_LENGTH
const HUMP_Z1 = -HALF_LEN + HUMP_T1 * HULL_LENGTH
const HUMP_STATIONS = 32
const HUMP_RADIAL = 40
const HUMP_HW: Keyframe[] = [
  [0, 0.1],
  [0.16, 0.42],
  [0.38, 0.3],
  [0.6, 0.74],
  [0.78, 0.64],
  [1, 0.16],
]
const HUMP_HH: Keyframe[] = [
  [0, 0.05],
  [0.16, 0.32],
  [0.38, 0.18],
  [0.62, 0.52],
  [0.78, 0.42],
  [1, 0.05],
]

function humpCenterYAt(z: number, t: number): number {
  const s = hullSurfaceAt(z)
  const hullTop = s.centerY + s.halfHeight
  const hh = sampleKeyframes(HUMP_HH, t)
  // Bottom of the hump loft stays buried ~0.3 under the hull crown while
  // the crown of the hump rises with its own half-height profile.
  return hullTop + hh * 0.9 - 0.3
}

/** Top surface Y of the dorsal spine at a given z — used to seat the fins
 * flush on the ridge instead of the bare hull. */
function humpTopYAt(z: number): number {
  const t = THREE.MathUtils.clamp((z - HUMP_Z0) / (HUMP_Z1 - HUMP_Z0), 0, 1)
  return humpCenterYAt(z, t) + sampleKeyframes(HUMP_HH, t)
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

// ─── Wing-booms — chunky pylons rooted on the hull flank (t≈0.64, near the
// widest part of the diamond flare) that sweep AFT + OUT + DOWN, thickening
// from a thin strut into a big rounded engine pod at the tip. Built as ONE
// loft (thin root -> fat tip) whose rotation is baked directly into the
// buffer geometry via rotateX/rotateY, mirrored to port with a -1 X-scale on
// the mesh (matching the existing wing/fin mirroring convention below) so a
// single geometry serves both sides. ─────────────────────────────────────────
const BOOM_ROOT_T = 0.62
const BOOM_ROOT_Z = -HALF_LEN + BOOM_ROOT_T * HULL_LENGTH
const BOOM_ROOT_THETA = 8 // degrees above the horizontal flank — low on the hull side
const BOOM_LENGTH = 4.4 // shorter span — pods read attached to the body, not winglets
const BOOM_STATIONS = 30
const BOOM_RADIAL = 32
const BOOM_TILT_DOWN = THREE.MathUtils.degToRad(17)
const BOOM_SWEEP_OUT = THREE.MathUtils.degToRad(20)
const BOOM_HW: Keyframe[] = [
  [0, 0.24],
  [0.3, 0.26],
  [0.55, 0.32],
  [0.72, 0.52],
  [0.88, 0.68],
  [1, 0.58],
]
const BOOM_HH: Keyframe[] = [
  [0, 0.2],
  [0.3, 0.22],
  [0.55, 0.27],
  [0.72, 0.48],
  [0.88, 0.64],
  [1, 0.52],
]
const BOOM_NX: Keyframe[] = [
  [0, 2.6],
  [0.5, 2.8],
  [0.75, 2.3],
  [1, 2.0],
]
const BOOM_NY: Keyframe[] = [
  [0, 2.2],
  [0.6, 2.3],
  [1, 2.2],
]
const NOZZLE_RIM_R = 0.56
const AUX_NOZZLE_R = 0.3

/** Boom loft built along local +Z (root at origin), then tilted/swept so its
 * baked-in aft axis points aft+out+down — assumes the +X (starboard) sense;
 * the port copy mirrors via mesh.scale.x = -1. */
function buildBoomGeometry(): THREE.BufferGeometry {
  const sections: LoftSection[] = []
  for (let i = 0; i < BOOM_STATIONS; i++) {
    const t = i / (BOOM_STATIONS - 1)
    sections.push({
      z: t * BOOM_LENGTH,
      halfWidth: sampleKeyframes(BOOM_HW, t),
      halfHeight: sampleKeyframes(BOOM_HH, t),
      roundness: sampleKeyframes(BOOM_NX, t),
      roundnessY: sampleKeyframes(BOOM_NY, t),
      centerY: 0,
    })
  }
  const wall = buildLoftWall(sections, BOOM_RADIAL)
  const rootCap = buildCapDisc(sections[0], BOOM_RADIAL, -1)
  const tipCap = buildCapDisc(sections[BOOM_STATIONS - 1], BOOM_RADIAL, 1)
  const merged = mergeGeometries([wall, rootCap, tipCap]) as THREE.BufferGeometry
  wall.dispose()
  rootCap.dispose()
  tipCap.dispose()
  merged.rotateX(BOOM_TILT_DOWN)
  merged.rotateY(BOOM_SWEEP_OUT)
  return merged
}

/** Unit direction the boom's local +Z tip axis ends up pointing after the
 * same rotateX-then-rotateY bake applied in buildBoomGeometry (starboard
 * sense — flip .x for port). Used to place the pod/nozzle/attach point
 * analytically without re-deriving a transform from the mesh. */
function boomAftDirLocal(): THREE.Vector3 {
  return new THREE.Vector3(0, 0, 1)
    .applyAxisAngle(new THREE.Vector3(1, 0, 0), BOOM_TILT_DOWN)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), BOOM_SWEEP_OUT)
}

// ─── Twin upswept fins — rooted near the boom attach points (mid-aft, on
// the dorsal ridge) rather than at the extreme tail tip, matching the
// reference's "conning fin" placement. ───────────────────────────────────────
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

const FIN_T = 0.7
const FIN_Z0 = -HALF_LEN + FIN_T * HULL_LENGTH
const FIN_X = 0.68
const FIN_CANT = 0.38 // ~22deg outward lean

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

  // ─── Dorsal spine (layered ridge) ────────────────────────────────────────
  addMesh(buildHumpGeometry(), materials.gunmetal)

  // ─── Canopy blister — low, subtle, on the nose crown ~1/4 back ─────────
  const canopyMesh = addMesh(buildCanopyGeometry(), materials.glass)
  canopyMesh.renderOrder = 1

  // ─── Two-tone flank accent bands — dark gunmetal stripe running the
  // length of each flank (layered paneling read, no markings). ────────────
  addMesh(buildHullBandGeometry(-8.8, 10.2, -26, 30, 0.032, 30, 14), materials.gunmetal)
  addMesh(buildHullBandGeometry(-8.8, 10.2, 150, 206, 0.032, 30, 14), materials.gunmetal)

  // ─── Wing-booms + engine pods — sweep aft/out/down from the hull flank
  // near the widest point of the diamond flare, each ending in one big
  // rounded pod with a bright thruster ring. ──────────────────────────────
  const boomGeo = buildBoomGeometry()
  ownedGeometries.push(boomGeo)
  const podRimGeo = new THREE.CylinderGeometry(NOZZLE_RIM_R, NOZZLE_RIM_R * 1.08, 0.55, 36, 1, true)
  podRimGeo.rotateX(Math.PI / 2)
  ownedGeometries.push(podRimGeo)
  const boomAftDir = boomAftDirLocal()

  const nozzleAttachPoints: THREE.Vector3[] = []
  const podCenters: THREE.Vector3[] = []
  for (const sign of [1, -1] as const) {
    const root = hullSurfacePoint(BOOM_ROOT_Z, BOOM_ROOT_THETA, sign)
    const boom = new THREE.Mesh(boomGeo, materials.steel)
    boom.position.copy(root)
    if (sign < 0) boom.scale.x = -1
    group.add(boom)

    const aftDir = new THREE.Vector3(boomAftDir.x * sign, boomAftDir.y, boomAftDir.z)
    const podCenter = root.clone().addScaledVector(aftDir, BOOM_LENGTH)
    podCenters.push(podCenter)

    const rim = new THREE.Mesh(podRimGeo, materials.gunmetal)
    rim.position.copy(podCenter).addScaledVector(aftDir, 0.14)
    rim.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), aftDir)
    group.add(rim)

    nozzleAttachPoints.push(podCenter.clone().addScaledVector(aftDir, 0.46))
  }

  // ─── Additional main engines set into the stern block ──────────────────
  const auxNozzleGeo = new THREE.CylinderGeometry(AUX_NOZZLE_R, AUX_NOZZLE_R * 1.08, 0.42, 28, 1, true)
  auxNozzleGeo.rotateX(Math.PI / 2)
  ownedGeometries.push(auxNozzleGeo)
  const aftSurf = hullSurfaceAt(HALF_LEN - 0.05)
  for (const sign of [1, -1] as const) {
    const x = sign * aftSurf.halfWidth * 0.42
    const y = aftSurf.centerY + aftSurf.halfHeight * 0.15
    const rim = new THREE.Mesh(auxNozzleGeo, materials.gunmetal)
    rim.position.set(x, y, HALF_LEN + 0.05)
    group.add(rim)
    nozzleAttachPoints.push(new THREE.Vector3(x, y, HALF_LEN + 0.36))
  }

  // ─── Twin upswept fins, canted outward, rooted on the dorsal ridge near
  // the boom attach points (mid-aft "conning fin" placement). ─────────────
  const finRootY = humpTopYAt(FIN_Z0 + 1.4) - 0.1
  const finGeo = buildFinGeometry(2.7, 3.1, 0.95, 2.2, 0.16)
  ownedGeometries.push(finGeo)
  for (const sign of [-1, 1] as const) {
    const fin = new THREE.Mesh(finGeo, materials.blade)
    fin.position.set(sign * FIN_X, finRootY, FIN_Z0)
    fin.rotation.z = -sign * FIN_CANT
    group.add(fin)
  }

  // ─── Nose sensor prongs — thin forward-pointing twin blades right at the
  // tip, canted slightly outward (small greeble, matches reference). ──────
  const prongGeo = new THREE.CylinderGeometry(0.012, 0.032, 1.0, 8)
  ownedGeometries.push(prongGeo)
  for (const sign of [-1, 1] as const) {
    const prong = new THREE.Mesh(prongGeo, materials.gunmetal)
    const noseSurf = hullSurfaceAt(-HALF_LEN + 0.2)
    prong.position.set(sign * 0.16, noseSurf.centerY, -HALF_LEN + 0.1)
    prong.rotation.x = -Math.PI / 2 + 0.08
    prong.rotation.z = sign * 0.16
    group.add(prong)
  }

  // ─── Greebles: dorsal antenna spines, RCS nub clusters, nav lights ──────
  const antennaGeo = new THREE.CylinderGeometry(0.014, 0.026, 0.9, 8)
  ownedGeometries.push(antennaGeo)
  for (const sign of [-1, 1] as const) {
    const antenna = new THREE.Mesh(antennaGeo, materials.gunmetal)
    const antennaZ = -HALF_LEN + 0.5 * HULL_LENGTH
    const humpT = (antennaZ - HUMP_Z0) / (HUMP_Z1 - HUMP_Z0)
    antenna.position.set(sign * 0.2, humpCenterYAt(antennaZ, humpT) + sampleKeyframes(HUMP_HH, humpT) + 0.4, antennaZ)
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
    [-HALF_LEN + 0.17 * HULL_LENGTH, 55, 1],
    [-HALF_LEN + 0.17 * HULL_LENGTH, 55, -1],
    [-HALF_LEN + 0.83 * HULL_LENGTH, 60, 1],
    [-HALF_LEN + 0.83 * HULL_LENGTH, 60, -1],
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

  // Running lights — classic red port / green starboard at the boom-pod
  // tips (the ship's outermost points), white aft at the stern.
  const navLightGeo = new THREE.SphereGeometry(0.055, 12, 10)
  ownedGeometries.push(navLightGeo)
  const portMat = createNavLightMaterial(0xff2a2a)
  const starMat = createNavLightMaterial(0x2bff5e)
  const whiteMat = createNavLightMaterial(0xffffff)

  const starboardPod = podCenters[0]
  const portPod = podCenters[1]
  const portLight = new THREE.Mesh(navLightGeo, portMat)
  portLight.position.copy(portPod).add(new THREE.Vector3(-0.1, 0.2, 0))
  group.add(portLight)
  const starLight = new THREE.Mesh(navLightGeo, starMat)
  starLight.position.copy(starboardPod).add(new THREE.Vector3(0.1, 0.2, 0))
  group.add(starLight)
  const aftTip = hullSurfaceAt(HALF_LEN)
  const whiteLight = new THREE.Mesh(navLightGeo, whiteMat)
  whiteLight.position.set(0, aftTip.centerY + aftTip.halfHeight * 0.7, HALF_LEN + 0.04)
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
