/**
 * Assembly of the exploded F1 car: turns the manifest in `carAssets.ts` into
 * three.js objects, adds the bits that no GLB ships with (suspension,
 * steering wheel, ground), and moves everything for a given explode progress.
 *
 * `three` is passed in rather than imported so the whole 3D layer stays behind
 * one dynamic `import('three')` in `carScene.ts` and never lands in the
 * initial bundle.
 */

import type * as THREE_NS from 'three'
import {
  CORNERS,
  FRONT_TYRE_HALF_WIDTH,
  legProgress,
  PART_IDS,
  PART_WINDOWS,
  PIECES,
  REAR_TYRE_HALF_WIDTH,
  STEERING,
  windowProgress,
  type PartId,
} from './carAssets'

type THREE = typeof THREE_NS
type ThemeName = 'light' | 'dark'

export type PartVisual = {
  id: PartId
  material: THREE_NS.MeshPhysicalMaterial
  /** Objects that translate when this part explodes. */
  movers: {
    object: THREE_NS.Object3D
    base: THREE_NS.Vector3
    explode: THREE_NS.Vector3
    /** Second leg, run after `explode` finishes; zero for a single-axis move. */
    explode2: THREE_NS.Vector3 | null
  }[]
  /** World-space half extents per mover, for the camera fit. */
  halfSizes: THREE_NS.Vector3[]
  /** How lit this part currently is: 0 = dimmed, 1 = base, 2 = highlighted. */
  emphasis: number
}

export type Car = {
  root: THREE_NS.Group
  parts: Map<PartId, PartVisual>
  raycastTargets: THREE_NS.Object3D[]
  /** Union box of every piece at the last `setProgress`, for framing. */
  boundsCenter: THREE_NS.Vector3
  boundsRadius: number
  boundsMin: THREE_NS.Vector3
  boundsMax: THREE_NS.Vector3
  /**
   * Flat xyz triples: the eight corners of every piece's own box, in world
   * space. Framing against these instead of one big box is what keeps the car
   * filling the frame — the global box's corners (nose tip height, full width,
   * full length all at once) are empty air.
   */
  fitPoints: Float32Array
  setProgress(p: number): void
  /**
   * World radius of the fading floor disc. The scene sizes it from what the
   * camera can actually see, so the fade always completes inside the canvas.
   * Where the ground is at (its centre, in x/z) so the scene can aim its own
   * containment test at the right place.
   */
  groundCenter: THREE_NS.Vector3
  setGroundRadius(r: number): void
  setTheme(theme: ThemeName): void
  /** Lerp every part's material toward its emphasis target. */
  applyEmphasis(highlight: PartId | null, k: number): void
  dispose(): void
}

const BASE_COLOR = 0xe4e7ec
const LIGHT_COLOR = 0xd8dbe1
const DIM_COLOR = 0xb8bcc4
const HOT_EMISSIVE = 0x1a1c20
const BASE_ENV = 1.2
const DIM_ENV = 0.45
const HOT_ENV = 1.6

export type BuiltGeometries = Map<string, THREE_NS.BufferGeometry[]>

export function buildCar(
  THREE: THREE,
  geometries: BuiltGeometries,
  opts: { withGround: boolean },
): Car {
  const root = new THREE.Group()
  const disposables: { dispose(): void }[] = []
  const raycastTargets: THREE_NS.Object3D[] = []
  const themeColor = new THREE.Color(BASE_COLOR)

  const parts = new Map<PartId, PartVisual>()
  for (const id of PART_IDS) {
    const material = new THREE.MeshPhysicalMaterial({
      color: BASE_COLOR,
      metalness: 1,
      roughness: 0.08,
      envMapIntensity: BASE_ENV,
      clearcoat: 0.3,
      clearcoatRoughness: 0.12,
    })
    disposables.push(material)
    parts.set(id, { id, material, movers: [], halfSizes: [], emphasis: 1 })
  }

  /* ---- GLB pieces ------------------------------------------------- */
  const box = new THREE.Box3()
  const size = new THREE.Vector3()

  for (const spec of PIECES) {
    const geos = geometries.get(spec.file)
    if (!geos || geos.length === 0) continue
    const part = parts.get(spec.part)!

    // The generator centres each mesh already, but only to ~1e-3; re-centre
    // on the measured box so `position` really is the box centre.
    const holder = new THREE.Group()
    for (const g of geos) holder.add(new THREE.Mesh(g, part.material))
    box.setFromObject(holder)
    holder.position.sub(box.getCenter(size))

    const piece = new THREE.Group()
    piece.add(holder)
    piece.scale.set(spec.scale[0], spec.scale[1], spec.scale[2])
    piece.rotation.set(spec.rotation[0], spec.rotation[1], spec.rotation[2])
    root.add(piece)

    box.setFromObject(piece)
    box.getSize(size)

    const base = new THREE.Vector3(spec.position[0], spec.position[1], spec.position[2])
    piece.position.copy(base)
    part.movers.push({
      object: piece,
      base,
      explode: new THREE.Vector3(spec.explode[0], spec.explode[1], spec.explode[2]),
      explode2: spec.explode2
        ? new THREE.Vector3(spec.explode2[0], spec.explode2[1], spec.explode2[2])
        : null,
    })
    part.halfSizes.push(size.clone().multiplyScalar(0.5))

    piece.traverse((o) => {
      const mesh = o as THREE_NS.Mesh
      if (mesh.isMesh) {
        mesh.userData.partId = spec.part
        raycastTargets.push(mesh)
      }
    })
  }

  /* ---- Steering wheel (procedural) --------------------------------
   *
   * A Formula 1 steering wheel has not been round since the nineties: it is a
   * flat yoke about 280 mm across and 160 mm tall — two vertical grips, a bar
   * across the top, nothing across the bottom, and a screen in the middle with
   * the rotaries and buttons under it. Built here in its own frame: +X is the
   * wheel's own right, +Y up, −Z toward the driver (so the display faces him
   * and the shift paddles sit on +Z, behind).
   * ------------------------------------------------------------------ */
  {
    const part = parts.get('steering')!
    const face = new THREE.Group()
    const add = (geo: THREE_NS.BufferGeometry, x = 0, y = 0, z = 0) => {
      disposables.push(geo)
      const m = new THREE.Mesh(geo, part.material)
      m.position.set(x, y, z)
      face.add(m)
      return m
    }

    // Two hand grips. Capsules rather than boxes: a real grip is a moulded
    // handle, and the rounded ends are what stop the yoke reading as a plank.
    const gripGeo = new THREE.CapsuleGeometry(0.021, 0.092, 6, 16)
    disposables.push(gripGeo)
    for (const sx of [-1, 1]) {
      const grip = new THREE.Mesh(gripGeo, part.material)
      grip.position.set(sx * 0.116, -0.012, 0)
      grip.scale.set(1.15, 1, 0.95)
      // A few degrees of splay, the way the grips angle out to the driver's
      // hands rather than standing dead vertical.
      grip.rotation.z = sx * 5 * (Math.PI / 180)
      face.add(grip)
    }

    // Top bar joining the grips, and the two short shoulders down to them.
    add(new THREE.BoxGeometry(0.2, 0.03, 0.03), 0, 0.062, 0)
    for (const sx of [-1, 1]) {
      const shoulder = add(new THREE.BoxGeometry(0.05, 0.028, 0.028), sx * 0.098, 0.055, 0)
      shoulder.rotation.z = sx * -0.5
    }

    // Column boss, behind the centre.
    const bossGeo = new THREE.CylinderGeometry(0.028, 0.034, 0.05, 18)
    bossGeo.rotateX(Math.PI / 2)
    add(bossGeo, 0, 0, 0.036)

    // Display bezel: four bars, not a solid block. A block would have had its
    // own front face in front of the screen and the screen would never have
    // been seen at all — which is what happened the first time. The screen
    // plate then sits 8 mm back inside the frame, which is the recess.
    add(new THREE.BoxGeometry(0.132, 0.01, 0.026), 0, 0.056, 0)
    add(new THREE.BoxGeometry(0.132, 0.01, 0.026), 0, -0.026, 0)
    add(new THREE.BoxGeometry(0.01, 0.072, 0.026), -0.061, 0.015, 0)
    add(new THREE.BoxGeometry(0.01, 0.072, 0.026), 0.061, 0.015, 0)
    // The fascia the bezel, buttons and rotaries are all mounted on. It stops
    // short of the grips' bottom ends: that gap is what "open bottom" means on
    // a wheel that has no rim below the hands.
    add(new THREE.BoxGeometry(0.19, 0.125, 0.018), 0, 0.002, 0.012)
    // The one surface on the whole car that is not a mirror. At metalness 1 it
    // reflected the room and came out lighter than the chrome around it, which
    // is the opposite of a screen; it needs to sit in a hole in the light.
    const screenMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c0e12,
      metalness: 0.25,
      roughness: 0.3,
      envMapIntensity: 0.35,
    })
    disposables.push(screenMat)
    const screenGeo = new THREE.BoxGeometry(0.114, 0.064, 0.008)
    disposables.push(screenGeo)
    const screen = new THREE.Mesh(screenGeo, screenMat)
    screen.position.set(0, 0.015, -0.001)
    face.add(screen)

    // Six buttons in two rows and two rotaries, all under the screen.
    const buttonGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.008, 12)
    buttonGeo.rotateX(Math.PI / 2)
    disposables.push(buttonGeo)
    for (const by of [-0.036, -0.052]) {
      for (const bx of [-0.03, 0, 0.03]) {
        const b = new THREE.Mesh(buttonGeo, part.material)
        b.position.set(bx, by, -0.001)
        face.add(b)
      }
    }
    const knobGeo = new THREE.CylinderGeometry(0.015, 0.013, 0.016, 16)
    knobGeo.rotateX(Math.PI / 2)
    disposables.push(knobGeo)
    for (const sx of [-1, 1]) {
      const k = new THREE.Mesh(knobGeo, part.material)
      k.position.set(sx * 0.068, -0.044, -0.005)
      face.add(k)
    }

    // Shift paddles, behind the wheel where the fingers are.
    const paddleGeo = new THREE.BoxGeometry(0.02, 0.086, 0.006)
    disposables.push(paddleGeo)
    for (const sx of [-1, 1]) {
      const p = new THREE.Mesh(paddleGeo, part.material)
      p.position.set(sx * 0.082, -0.026, 0.048)
      p.rotation.set(0, sx * 0.22, sx * 0.12)
      face.add(p)
    }

    const wheelGroup = new THREE.Group()
    // ZYX: the quarter turn about Y aims the face down the car, then the 20°
    // about Z lays it back the way a driver actually holds it.
    face.rotation.set(STEERING.rotation[0], STEERING.rotation[1], STEERING.rotation[2], 'ZYX')
    wheelGroup.add(face)
    const base = new THREE.Vector3(STEERING.position[0], STEERING.position[1], STEERING.position[2])
    wheelGroup.position.copy(base)
    root.add(wheelGroup)

    part.movers.push({
      object: wheelGroup,
      base,
      explode: new THREE.Vector3(STEERING.explode[0], STEERING.explode[1], STEERING.explode[2]),
      explode2: null,
    })
    // World half extents of the 0.28 × 0.16 × 0.10 yoke once the quarter turn
    // and the 20° rake have been applied: its own X lies down the car's Z, its
    // own Z down the car's X, and the rake trades a little of one for the other.
    part.halfSizes.push(new THREE.Vector3(0.09, 0.1, 0.16))

    // A yoke of 40 mm tube is nearly impossible to hit with a cursor, so
    // hovering goes through an invisible sphere instead.
    const proxyGeo = new THREE.SphereGeometry(0.35, 12, 10)
    const proxyMat = new THREE.MeshBasicMaterial({ visible: false })
    disposables.push(proxyGeo, proxyMat)
    const proxy = new THREE.Mesh(proxyGeo, proxyMat)
    proxy.userData.partId = 'steering'
    wheelGroup.add(proxy)
    raycastTargets.push(proxy)
  }

  /* ---- Suspension (procedural, rebuilt every frame) ----------------
   *
   * One unit aerofoil — chord 1 down local X with the leading edge at +X,
   * thickness 1 down local Z, length 1 down local Y — scaled per link into the
   * real section and per frame onto the real arm length. Nothing is rebuilt;
   * the arms only ever get a new matrix.
   * ------------------------------------------------------------------ */
  const linkGeo = aerofoilGeometry(THREE, 22)
  disposables.push(linkGeo)
  // The upright is a plate, not a post: it is what the two wishbones and the
  // pushrod all bolt to, spanning the hub from the lower tip to the upper.
  const upright = new THREE.BoxGeometry(0.07, 0.3, 0.018)
  disposables.push(upright)

  const wheelsPart = parts.get('wheels')!
  const linkMeshes: { mesh: THREE_NS.Mesh; corner: number; link: number }[] = []
  const hubMeshes: THREE_NS.Mesh[] = []
  const noHit = () => {}

  CORNERS.forEach((c, ci) => {
    c.links.forEach((_link, li) => {
      const m = new THREE.Mesh(linkGeo, wheelsPart.material)
      m.raycast = noHit // a 14 mm blade is not a hover target
      root.add(m)
      linkMeshes.push({ mesh: m, corner: ci, link: li })
    })
    const hub = new THREE.Mesh(upright, wheelsPart.material)
    hub.raycast = noHit
    root.add(hub)
    hubMeshes.push(hub)
  })

  /* ---- Ground ------------------------------------------------------ */
  let groundMat: THREE_NS.MeshStandardMaterial | null = null
  let shadowMat: THREE_NS.MeshBasicMaterial | null = null

  let groundMesh: THREE_NS.Mesh | null = null
  let shadowMesh: THREE_NS.Mesh | null = null

  if (opts.withGround) {
    // Unit radius, scaled from the camera frustum every frame. The alpha ramp
    // reaches zero exactly at the rim, so wherever the scene puts that rim the
    // floor is already fully transparent — the plane can never end on a hard
    // edge, and the edge it does not have can never be clipped by the canvas.
    const fade = fadeTexture(THREE, 256, 0.05, 0.5)
    const groundGeo = new THREE.CircleGeometry(1, 96)
    groundGeo.rotateX(-Math.PI / 2)
    groundMat = new THREE.MeshStandardMaterial({
      color: 0x0d0e11,
      roughness: 0.85,
      metalness: 0,
      envMapIntensity: 0.12,
      transparent: true,
      alphaMap: fade,
      depthWrite: false,
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.position.set(0.1, -0.002, 0)
    ground.scale.setScalar(3.4)
    ground.renderOrder = -2
    ground.raycast = noHit
    root.add(ground)
    groundMesh = ground
    disposables.push(groundGeo, groundMat, fade)

    // Fake contact shadow: one soft blob under the whole car, which is what a
    // real one looks like from this distance and costs no shadow map. Also
    // unit-sized, so it can never grow past the floor it sits on.
    const blob = fadeTexture(THREE, 256, 0.02, 0.5)
    const shadowGeo = new THREE.PlaneGeometry(2, 0.86)
    shadowGeo.rotateX(-Math.PI / 2)
    shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.7,
      alphaMap: blob,
      depthWrite: false,
    })
    const shadow = new THREE.Mesh(shadowGeo, shadowMat)
    shadow.position.set(-0.05, 0.004, 0)
    shadow.scale.setScalar(2.8)
    shadow.renderOrder = -1
    shadow.raycast = noHit
    root.add(shadow)
    shadowMesh = shadow
    disposables.push(shadowGeo, shadowMat, blob)
  }

  /* ---- Per-frame placement ---------------------------------------- */
  const boundsMin = new THREE.Vector3()
  const boundsMax = new THREE.Vector3()
  const boundsCenter = new THREE.Vector3()
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const mid = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const chordDir = new THREE.Vector3()
  const thickDir = new THREE.Vector3()
  const basis = new THREE.Matrix4()
  const streamX = new THREE.Vector3(1, 0, 0)
  const streamZ = new THREE.Vector3(0, 0, 1)
  const wheelNow: THREE_NS.Vector3[] = CORNERS.map(() => new THREE.Vector3())
  const moverCount = PART_IDS.reduce((n, id) => n + parts.get(id)!.movers.length, 0)
  const fitPoints = new Float32Array(moverCount * 8 * 3)

  const car: Car = {
    root,
    parts,
    raycastTargets,
    boundsCenter,
    boundsRadius: 3.4,
    boundsMin,
    boundsMax,
    fitPoints,

    setProgress(p: number) {
      boundsMin.set(Infinity, Infinity, Infinity)
      boundsMax.set(-Infinity, -Infinity, -Infinity)
      let fp = 0

      for (const id of PART_IDS) {
        const part = parts.get(id)!
        const w = PART_WINDOWS[id]
        const e = windowProgress(p, w)
        // A two-leg part runs its legs back to back inside the same window,
        // so it climbs out and only then slides — never diagonally through
        // the hole it is leaving.
        const e1 = legProgress(p, w, 0)
        const e2 = legProgress(p, w, 1)
        part.movers.forEach((m, i) => {
          m.object.position.copy(m.base)
          if (m.explode2) {
            m.object.position.addScaledVector(m.explode, e1).addScaledVector(m.explode2, e2)
          } else {
            m.object.position.addScaledVector(m.explode, e)
          }
          const h = part.halfSizes[i]
          if (!h) return
          const pos = m.object.position
          boundsMin.min(a.copy(pos).sub(h))
          boundsMax.max(a.copy(pos).add(h))
          for (let c = 0; c < 8; c++) {
            fitPoints[fp++] = pos.x + (c & 1 ? h.x : -h.x)
            fitPoints[fp++] = pos.y + (c & 2 ? h.y : -h.y)
            fitPoints[fp++] = pos.z + (c & 4 ? h.z : -h.z)
          }
        })
      }

      // The suspension is rebuilt from where the wheels actually ended up, so
      // an exploded wheel drags its arms out with it instead of leaving them
      // hanging in mid-air. That is the whole "mechanically correct" read.
      const wheelMovers = wheelsPart.movers
      for (let i = 0; i < CORNERS.length; i++) {
        const mover = wheelMovers[i]
        if (mover) wheelNow[i].copy(mover.object.position)
        else wheelNow[i].set(CORNERS[i].wheel[0], CORNERS[i].wheel[1], CORNERS[i].wheel[2])
      }

      for (const { mesh, corner: ci, link: li } of linkMeshes) {
        const spec = CORNERS[ci].links[li]
        a.set(spec.inboard[0], spec.inboard[1], spec.inboard[2])
        b.copy(wheelNow[ci]).add(dir.set(spec.outboard[0], spec.outboard[1], spec.outboard[2]))
        mid.copy(a).add(b).multiplyScalar(0.5)
        dir.copy(b).sub(a)
        const len = dir.length() || 1e-4
        dir.divideScalar(len)

        // Roll the section so its chord lies along the car's axis, leading
        // edge into the airflow. `setFromUnitVectors` would have left the roll
        // to chance, which is fine for a tube and wrong for a blade. An arm
        // that happens to run fore-and-aft has no such chord, so it takes the
        // lateral axis instead.
        const along = Math.abs(dir.x)
        chordDir.copy(along > 0.94 ? streamZ : streamX)
        chordDir.addScaledVector(dir, -chordDir.dot(dir)).normalize()
        thickDir.crossVectors(chordDir, dir).normalize()
        basis.makeBasis(chordDir, dir, thickDir)

        mesh.position.copy(mid)
        mesh.quaternion.setFromRotationMatrix(basis)
        mesh.scale.set(spec.chord, len, spec.thick)
      }

      hubMeshes.forEach((mesh, ci) => {
        const inset = (ci < 2 ? FRONT_TYRE_HALF_WIDTH : REAR_TYRE_HALF_WIDTH) * 0.55
        mesh.position.copy(wheelNow[ci])
        mesh.position.z -= Math.sign(CORNERS[ci].wheel[2]) * inset
      })

      // Wheels sit on the ground, so the frame has to include y = 0 even
      // though no box centre reaches it.
      boundsMin.y = Math.min(boundsMin.y, 0)
      boundsCenter.copy(boundsMin).add(boundsMax).multiplyScalar(0.5)
      car.boundsRadius = Math.max(1, boundsMax.distanceTo(boundsMin) / 2)
    },

    groundCenter: new THREE.Vector3(0.1, 0, 0),

    setGroundRadius(r: number) {
      if (groundMesh) groundMesh.scale.setScalar(r)
      // The blob is the car's own shadow, so it tracks the car rather than the
      // camera — but it is clamped to the floor so it can never outlive it.
      if (shadowMesh) shadowMesh.scale.setScalar(Math.min(2.8, r * 0.82))
    },

    setTheme(theme: ThemeName) {
      const light = theme === 'light'
      themeColor.setHex(light ? LIGHT_COLOR : BASE_COLOR)
      if (groundMat) groundMat.color.setHex(light ? 0xd5d9df : 0x0d0e11)
      if (shadowMat) shadowMat.opacity = light ? 0.3 : 0.55
    },

    applyEmphasis(highlight: PartId | null, k: number) {
      for (const id of PART_IDS) {
        const part = parts.get(id)!
        const target = highlight === null ? 1 : highlight === id ? 2 : 0
        part.emphasis += (target - part.emphasis) * k
        const t = part.emphasis
        const m = part.material
        // 0 → receded, 1 → base, 2 → highlighted.
        m.envMapIntensity =
          t < 1 ? DIM_ENV + (BASE_ENV - DIM_ENV) * t : BASE_ENV + (HOT_ENV - BASE_ENV) * (t - 1)
        m.color.setHex(DIM_COLOR).lerp(themeColor, Math.min(1, Math.max(0, t)))
        m.emissive.setHex(HOT_EMISSIVE).multiplyScalar(Math.min(1, Math.max(0, t - 1)))
      }
    },

    dispose() {
      for (const d of disposables) d.dispose()
    },
  }

  car.setProgress(0)
  return car
}

/**
 * A unit aerofoil, extruded along its span.
 *
 * The section is the NACA symmetric thickness distribution — round leading
 * edge, maximum thickness at ~30% chord, sharp trailing edge — normalised so
 * the chord runs x ∈ [−0.5, 0.5] with the leading edge at +0.5 and the
 * thickness spans z ∈ [−0.5, 0.5]. The span runs y ∈ [−0.5, 0.5], so one
 * `scale(chord, length, thickness)` turns it into any arm on the car.
 */
function aerofoilGeometry(THREE: THREE, samples: number): THREE_NS.ExtrudeGeometry {
  const t = (u: number) =>
    0.2969 * Math.sqrt(u) - 0.126 * u - 0.3516 * u * u + 0.2843 * u ** 3 - 0.1015 * u ** 4
  const us: number[] = []
  for (let i = 0; i <= samples; i++) {
    // Cosine spacing: the leading edge is where the curvature is, so that is
    // where the points have to be.
    us.push((1 - Math.cos((i / samples) * Math.PI)) / 2)
  }
  let peak = 0
  for (const u of us) peak = Math.max(peak, t(u))
  const half = (u: number) => (t(u) / peak) * 0.5
  const x = (u: number) => 0.5 - u

  const shape = new THREE.Shape()
  shape.moveTo(x(0), 0)
  for (let i = 1; i < us.length; i++) shape.lineTo(x(us[i]), half(us[i]))
  for (let i = us.length - 2; i >= 1; i--) shape.lineTo(x(us[i]), -half(us[i]))
  shape.closePath()

  const geo = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false, steps: 1 })
  // Extrusion comes out along +Z; the arms want it along their own +Y.
  geo.rotateX(-Math.PI / 2)
  geo.translate(0, -0.5, 0)
  return geo
}

/**
 * Radial black-to-white gradient used as an `alphaMap` (three samples the
 * green channel). Painting the falloff into the colour channels rather than
 * the alpha channel keeps it independent of how the browser chooses to store
 * a partially transparent canvas.
 */
function fadeTexture(
  THREE: THREE,
  size: number,
  innerStop: number,
  outerStop: number,
): THREE_NS.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size, size)
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * innerStop,
    size / 2,
    size / 2,
    size * outerStop,
  )
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.55, '#6e6e6e')
  g.addColorStop(1, '#000000')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.NoColorSpace
  return tex
}
