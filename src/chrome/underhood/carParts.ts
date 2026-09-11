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
  HOVER_PROXIES,
  legProgress,
  PART_IDS,
  PART_WINDOWS,
  PIECES,
  REAR_MOUNT,
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
  /** Derived inboard suspension pickups, per corner then per link. */
  anchors: THREE_NS.Vector3[][]
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
/** How far past the body's skin an inboard pickup is sunk, in metres. */
const ANCHOR_BURY = 0.008
/** Where the anchor rays start, in |z|. Outside anything the body can reach. */
const RAY_START_Z = 1.2
/** Vertical step of the band sweep that finds the chassis flank, in metres. */
const ANCHOR_STEP = 0.01
/** How close to the widest hit still counts as "the flank", in metres. */
const ANCHOR_TIE = 0.004
const BOSS_RADIUS = 0.018
const BOSS_LENGTH = 0.062
const DIM_ENV = 0.45
const HOT_ENV = 1.6

/** How far the lowest halo foot is pushed past the body's skin, in metres. */
const HALO_BURY = 0.005
/** A vertex this close to the halo's lowest point is part of a foot. */
const HALO_FOOT_BAND = 0.035
/** Hardest the halo may be tilted about Z to get all three feet down. */
const HALO_MAX_TILT = 4 * (Math.PI / 180)
/** How far above the car the halo's grounding rays start, in metres. */
const HALO_RAY_Y = 2.4
/** Chrome pad half-sunk under each halo foot. */
const PAD_RADIUS = 0.03
const PAD_HEIGHT = 0.02
/** Where the wheel probe rays start, in |z| off the wheel centre. */
const WHEEL_RAY_Z = 1.2

/**
 * Half width of the strip down the middle of the rear wing where the pylons
 * are. Outside it are the endplates, which reach down to the same height and
 * would otherwise be taken for feet.
 */
const PYLON_ZONE = 0.15
/** A vertex this close to the pylons' lowest point is part of a foot. */
const PYLON_FOOT_BAND = 0.03

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
  /** The assembled body, kept aside so the suspension can aim rays at it. */
  const bodyPieces: THREE_NS.Object3D[] = []
  /** The four wheel pieces, in `CORNERS` order, kept for the face probe. */
  const wheelPieces: THREE_NS.Object3D[] = []

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
  // A wheel is a shell: its rim has an inner face the camera looks straight
  // into from the section's three-quarter view, and back-face culling turned
  // that into a see-through hole (Marcin 2026-09: the rim reading hollow).
  // Chrome has no inside anyway — both faces reflect the same room.
  parts.get('wheels')!.material.side = THREE.DoubleSide

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
    if (spec.part === 'body') bodyPieces.push(piece)
    if (spec.part === 'wheels') wheelPieces.push(piece)
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

  /* ---- Hover proxies for the thin parts -----------------------------
   *
   * The wings and the halo are blades and hoops a few centimetres thick with
   * a lot of air between them, so a cursor crossing one hits and misses it
   * several times over a handful of pixels. Each gets an invisible box the
   * size of its real envelope, pushed onto the same part as an extra mover so
   * it travels with the explode. `halfSizes` is deliberately not extended:
   * a proxy is bigger than the part it stands for and has no business
   * widening the camera fit.
   * ------------------------------------------------------------------ */
  const proxyMat = new THREE.MeshBasicMaterial({ visible: false })
  disposables.push(proxyMat)

  for (const spec of PIECES) {
    const proxy = HOVER_PROXIES[spec.part]
    if (!proxy) continue
    const part = parts.get(spec.part)!
    const geo = new THREE.BoxGeometry(proxy.size[0], proxy.size[1], proxy.size[2])
    disposables.push(geo)
    const mesh = new THREE.Mesh(geo, proxyMat)
    mesh.userData.partId = spec.part
    const off = proxy.offset ?? [0, 0, 0]
    const base = new THREE.Vector3(
      spec.position[0] + off[0],
      spec.position[1] + off[1],
      spec.position[2] + off[2],
    )
    mesh.position.copy(base)
    root.add(mesh)
    part.movers.push({
      object: mesh,
      base,
      explode: new THREE.Vector3(spec.explode[0], spec.explode[1], spec.explode[2]),
      explode2: spec.explode2
        ? new THREE.Vector3(spec.explode2[0], spec.explode2[1], spec.explode2[2])
        : null,
    })
    raycastTargets.push(mesh)
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

  /* ---- Inside the wheel --------------------------------------------
   *
   * The rim mesh has a face and a back: one side is the dished spoke face, the
   * other is the open mouth of the barrel. It is the same casting on all four
   * corners and it is never mirrored, so on one side of the car the spokes
   * point outboard and on the other they point at the gearbox — which is what
   * Marcin saw ("brak felg": from outside, the left wheels were a hollow tube
   * with the brake disc sitting in the bottom of it). `deriveWheelFace` below
   * finds which local side the spokes are on by firing rays down the axle, and
   * the wheels on the wrong side get a half turn about Y — a rigid move, not a
   * mirror, and invisible on a part that is round about that axis.
   *
   * With the face the right way round, the innards are laid out about it the
   * way a real corner is, outboard → inboard:
   *
   *   nut       a 70 mm centre lock at the middle of the spoke face, half
   *             proud of it. What must NOT be there is a disc across the
   *             mouth: that is what was hiding the spokes;
   *   spokes    the mesh's own face — the thing the visitor is meant to see;
   *   disc      r 160 mm, 90 mm behind the spoke plane, dark chrome so it
   *             reads as iron and shows only through the gaps;
   *   caliper   on the upright at the disc's plane, over the top of it;
   *   upright   at the wishbone plane, exactly where the six links land;
   *   closer    a shallow iron dish across the inboard mouth of the barrel,
   *             behind everything, so the wheel does not read hollow from the
   *             inside of the car.
   * ------------------------------------------------------------------ */
  const upright = new THREE.BoxGeometry(0.05, 0.24, 0.016)
  const caliperGeo = new THREE.BoxGeometry(0.06, 0.11, 0.045)
  const discGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.032, 32)
  discGeo.rotateX(Math.PI / 2) // spin axis from local Y onto the car's Z
  // Dished, not flat, and iron rather than mirror: a chrome plate across the
  // back of the barrel reflects the dark room and comes out as one grey disc,
  // which is the failure this whole assembly exists to avoid. A shallow cone
  // in the same material as the brake disc reads as the back of a wheel.
  const closerGeo = new THREE.CylinderGeometry(0.215, 0.17, 0.03, 36)
  closerGeo.rotateX(Math.PI / 2)
  const nutGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.03, 20)
  nutGeo.rotateX(Math.PI / 2)
  disposables.push(upright, caliperGeo, discGeo, closerGeo, nutGeo)

  // The one part of the car that is metal but not a mirror: a brake disc is
  // grey iron at 900 °C, and at metalness 1 / roughness 0.08 it would have
  // come out brighter than the rim it hides behind.
  const discMat = new THREE.MeshPhysicalMaterial({
    color: 0x8c9096,
    metalness: 1,
    roughness: 0.35,
    envMapIntensity: BASE_ENV * 0.7,
    side: THREE.DoubleSide,
  })
  disposables.push(discMat)

  const wheelsPart = parts.get('wheels')!
  const noHit = () => {}

  /* ---- Halo: put its three feet on the tub -------------------------- */
  {
    const halo = parts.get('halo')!
    const piece = halo.movers[0]?.object
    root.updateMatrixWorld(true)
    const seat = piece ? seatHalo(THREE, piece, bodyPieces) : null
    if (seat) {
      // Every mover of the part comes down together — the hoop and its hover
      // proxy — and the explode vector is untouched, so the halo still lifts
      // straight off the pads it now stands on.
      for (const m of halo.movers) {
        m.base.y -= seat.drop
        m.object.position.copy(m.base)
      }

      // Three chrome pads, half-sunk where the feet land. They belong to the
      // body: a foot leaves its pad behind the way a real one leaves its
      // bracket bolted to the chassis.
      const padGeo = new THREE.CylinderGeometry(PAD_RADIUS, PAD_RADIUS, PAD_HEIGHT, 20)
      disposables.push(padGeo)
      const bodyMat = parts.get('body')!.material
      seat.contacts.forEach((c, i) => {
        const pad = new THREE.Mesh(padGeo, bodyMat)
        pad.position.set(c.x, seat.surfaceY[i], c.z)
        pad.raycast = noHit
        root.add(pad)
      })

      if (import.meta.env.DEV) {
        console.info(
          `[underhood] halo seated: drop ${(seat.drop * 1000).toFixed(1)} mm, ` +
            `tilt ${((seat.tilt * 180) / Math.PI).toFixed(2)}°, ` +
            `feet at ${seat.residuals.map((r) => (r * 1000).toFixed(1)).join(' / ')} mm ` +
            `above the skin (negative = sunk into it)`,
        )
      }
    } else if (import.meta.env.DEV) {
      console.warn('[underhood] halo feet not found; the hoop is where the manifest put it')
    }
  }

  /* ---- Rear wing: the structure its pylons stand on -----------------
   *
   * Find the pylon feet in the wing mesh, then run the impact structure from
   * inside the gearbox bay back to just past them, its top at the height of
   * the feet plus the sink — so the feet end *in* it. See `REAR_MOUNT`.
   * ------------------------------------------------------------------ */
  {
    const piece = parts.get('rearWing')!.movers[0]?.object
    root.updateMatrixWorld(true)
    const feet = piece ? findPylonFeet(THREE, piece) : null
    if (feet) {
      const top = feet.y + REAR_MOUNT.sink
      const tail = feet.x0 - REAR_MOUNT.overhang
      // The taper may narrow the box, but never to less than the feet need.
      const need = feet.halfZ + REAR_MOUNT.footMargin
      const halfWidth: [number, number] = [
        Math.max(REAR_MOUNT.halfWidth[0], need),
        Math.max(REAR_MOUNT.halfWidth[1], need),
      ]
      const geo = impactStructureGeometry(THREE, {
        front: REAR_MOUNT.front,
        tail,
        top,
        depth: REAR_MOUNT.depth,
        halfWidth,
        corner: REAR_MOUNT.corner,
      })
      disposables.push(geo)
      // Body material, so it recedes and lights with the chassis it is part
      // of, and a body hover target for the same reason.
      const box = new THREE.Mesh(geo, parts.get('body')!.material)
      box.userData.partId = 'body'
      root.add(box)
      raycastTargets.push(box)

      // The rain light: a dark lens on the end face, centred on it. It is the
      // one detail that says "back of a racing car" from behind, and like the
      // steering display it must not be a mirror or it would vanish into the
      // chrome around it.
      const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x16080a,
        metalness: 0.3,
        roughness: 0.25,
        envMapIntensity: 0.4,
      })
      const lensGeo = new THREE.BoxGeometry(0.006, REAR_MOUNT.lamp[1], REAR_MOUNT.lamp[0])
      disposables.push(lensMat, lensGeo)
      const lens = new THREE.Mesh(lensGeo, lensMat)
      lens.position.set(tail - 0.001, top - REAR_MOUNT.depth[1] / 2, 0)
      lens.raycast = noHit
      root.add(lens)

      if (import.meta.env.DEV) {
        console.info(
          `[underhood] rear wing mounted: pylon feet x ${feet.x1.toFixed(3)}…${feet.x0.toFixed(3)}, ` +
            `y ${feet.y.toFixed(3)}, |z| ≤ ${feet.halfZ.toFixed(3)}; impact structure ` +
            `x ${REAR_MOUNT.front.toFixed(2)}…${tail.toFixed(3)}, top ${top.toFixed(3)}`,
        )
      }
    } else if (import.meta.env.DEV) {
      console.warn('[underhood] rear wing pylon feet not found; no impact structure built')
    }
  }

  /* ---- Inboard pickups, read off the body ---------------------------
   *
   * For each arm, fire a ray from outside the car straight down the lateral
   * axis toward the centreline, at the station the manifest asked for, and
   * take the first face of the body it crosses. That point, pulled 8 mm in,
   * is where the arm ends: on the monocoque's actual skin rather than at a
   * |z| somebody guessed. Once, at build time — the anchors are fixed to the
   * chassis, so nothing about an exploding wheel can move them.
   * ------------------------------------------------------------------ */
  const anchors = deriveAnchors(THREE, root, bodyPieces)

  /* ---- Which way round is a wheel? ----------------------------------
   *
   * Read off the mesh rather than guessed: `face.sign` is the local z the
   * spokes look down, `face.depth` how far the spoke plane sits from the
   * wheel's centre plane on a *front* wheel. The rears are the same casting
   * stretched 1.27× across the axle, so the depth travels as a fraction of the
   * half width rather than as a number of millimetres.
   * ------------------------------------------------------------------ */
  const face = deriveWheelFace(THREE, wheelPieces, FRONT_TYRE_HALF_WIDTH)
  const spokeFrac = face.depth / FRONT_TYRE_HALF_WIDTH
  if (import.meta.env.DEV) {
    console.info(
      `[underhood] wheel face: spokes look down local ${face.sign > 0 ? '+z' : '−z'}, ` +
        `${(face.depth * 1000).toFixed(1)} mm off the centre plane ` +
        `(${(spokeFrac * 100).toFixed(0)}% of the front half width); ` +
        `left-hand wheels turned round`,
    )
  }
  CORNERS.forEach((c, ci) => {
    const piece = wheelPieces[ci]
    if (!piece) return
    const s = Math.sign(c.wheel[2]) || 1
    // The spokes must look out of the car, so a wheel whose face points the
    // wrong way gets turned round on its axle.
    if (face.sign !== s) piece.rotation.y += Math.PI
  })
  root.updateMatrixWorld(true)

  const linkMeshes: { mesh: THREE_NS.Mesh; boss: THREE_NS.Mesh; corner: number; link: number }[] =
    []
  const hubGroups: THREE_NS.Group[] = []

  // Fairing boss: the short chromed sleeve a real arm disappears into where it
  // meets the tub. Half-sunk at the anchor, it is what turns "a blade that
  // stops at a surface" into "a blade that goes into something" once the
  // reflections have flattened every other cue.
  const bossGeo = new THREE.CylinderGeometry(BOSS_RADIUS, BOSS_RADIUS * 0.82, BOSS_LENGTH, 14)
  disposables.push(bossGeo)

  CORNERS.forEach((c, ci) => {
    c.links.forEach((_link, li) => {
      const m = new THREE.Mesh(linkGeo, wheelsPart.material)
      m.raycast = noHit // a 14 mm blade is not a hover target
      root.add(m)
      const boss = new THREE.Mesh(bossGeo, wheelsPart.material)
      boss.raycast = noHit
      root.add(boss)
      linkMeshes.push({ mesh: m, boss, corner: ci, link: li })
    })
    // The hub assembly is built in the wheel's own frame and only ever
    // translated, so every offset below is local and signed once, here.
    const s = Math.sign(c.wheel[2]) || 1
    const w = ci < 2 ? FRONT_TYRE_HALF_WIDTH : REAR_TYRE_HALF_WIDTH
    // Where this corner's links actually end, from `carAssets`.
    const hubZ = c.links[0].outboard[2]

    const hub = new THREE.Group()
    const put = (
      geo: THREE_NS.BufferGeometry,
      material: THREE_NS.Material,
      x: number,
      y: number,
      z: number,
      /** Turn the part round on the axle, for the corners where +z is inboard. */
      flip = false,
    ) => {
      const m = new THREE.Mesh(geo, material)
      m.position.set(x, y, z)
      if (flip) m.rotation.y = Math.PI
      m.raycast = noHit // the tyre is the hover target; its innards are not
      hub.add(m)
    }

    // Where this corner's spoke face sits, as a signed offset off the wheel's
    // centre plane: outboard is +s, and the fraction is the one measured on
    // the front wheel, so the wider rears push their face out with them.
    const spokeZ = s * spokeFrac * w
    // Everything else is stacked *behind* that plane, never across it.
    const discZ = spokeZ - s * Math.min(0.09, w * 0.55)

    put(upright, wheelsPart.material, 0, 0, hubZ)
    put(caliperGeo, wheelsPart.material, -0.055, 0.155, discZ)
    put(discGeo, discMat, 0, 0, discZ)
    // The barrel is closed at its inboard mouth only — behind the disc, out of
    // the way of the spokes. Across the outboard mouth (which is where a "hub
    // cap" wants to go) it would hide the one part of the wheel worth looking
    // at, and it would reflect the dark room and read as a flat grey plate.
    // Its wide end always faces into the barrel, so the left-hand wheels take
    // it turned round.
    put(closerGeo, discMat, 0, 0, -s * w * 0.92, s < 0)
    // Centre lock, half proud of the spoke face. Small on purpose: a nut, not
    // a lid.
    put(nutGeo, wheelsPart.material, 0, 0, spokeZ + s * 0.005)
    root.add(hub)
    hubGroups.push(hub)
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
    anchors,

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

      for (const { mesh, boss, corner: ci, link: li } of linkMeshes) {
        const spec = CORNERS[ci].links[li]
        a.copy(anchors[ci][li])
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

        // The boss shares the arm's axis, so it only has to sit on the anchor
        // and follow the same rotation. Half of it is already inside the skin.
        boss.position.copy(a)
        boss.quaternion.copy(mesh.quaternion)
      }

      // The whole assembly rides the wheel: every offset inside it is local.
      hubGroups.forEach((group, ci) => group.position.copy(wheelNow[ci]))

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
 * Where every arm meets the chassis, read off the body mesh itself.
 *
 * The manifest gives a station — an x and a height band — and nothing else,
 * because the only honest source for the z is the surface that is actually
 * there. So for each arm this fires a fan of rays from |z| = 1.2 (clear of
 * anything the body reaches) straight inboard across that band, keeps the
 * widest skin it finds, and sinks the point 8 mm past it so the arm ends
 * *inside* the chassis rather than kissing it. The car is narrow at the nose,
 * so the front links come out short — which is right: a short link that lands
 * on the tub reads as suspension, a long one that stops in the air reads as a
 * bug.
 *
 * Runs once, at build time. If a whole band misses the body (a floor edge
 * that has already tapered away, say) it falls back to the body's own
 * bounding box side and says so, which is loud enough to notice in dev and
 * harmless in production.
 */
function deriveAnchors(
  THREE: THREE,
  root: THREE_NS.Group,
  bodyPieces: THREE_NS.Object3D[],
): THREE_NS.Vector3[][] {
  root.updateMatrixWorld(true)
  const bodyBox = new THREE.Box3()
  for (const piece of bodyPieces) bodyBox.expandByObject(piece)

  const ray = new THREE.Raycaster()
  ray.far = RAY_START_Z * 2.2
  const origin = new THREE.Vector3()
  const inward = new THREE.Vector3()

  return CORNERS.map((corner, ci) =>
    corner.links.map((link, li) => {
      const s = corner.side
      const { x, band } = link.anchor
      const bury = ANCHOR_BURY + (link.anchor.inset ?? 0)

      // Sweep the band and keep the widest point of the skin, which is the
      // flank. Taking one ray at one height would have been at the mercy of
      // whatever section the mesh happens to have there — and this mesh has
      // undercuts that swing 300 mm over 30 mm of height.
      const hits: { y: number; az: number }[] = []
      for (let y = band[0]; y <= band[1] + 1e-6; y += ANCHOR_STEP) {
        origin.set(x, y, s * RAY_START_Z)
        inward.set(0, 0, -s)
        ray.set(origin, inward)
        const hit = ray.intersectObjects(bodyPieces, true)[0]
        if (hit) hits.push({ y, az: Math.abs(hit.point.z) })
      }
      if (hits.length > 0) {
        // Where the flank is flat — which is most of it — every height in the
        // band is as wide as every other, and the tie has to be broken on
        // something. Break it on the middle of the band, so a wishbone's two
        // legs come out level with each other instead of one landing at the
        // top of the band and the other at the bottom.
        const widest = hits.reduce((best, h) => Math.max(best, h.az), 0)
        const mid = (band[0] + band[1]) / 2
        const pick = hits
          .filter((h) => h.az >= widest - ANCHOR_TIE)
          .reduce((best, h) => (Math.abs(h.y - mid) < Math.abs(best.y - mid) ? h : best))
        return new THREE.Vector3(x, pick.y, s * (pick.az - bury))
      }

      const edge = Number.isFinite(bodyBox.max.z) ? bodyBox.max.z : 0.5
      if (import.meta.env.DEV) {
        console.warn(
          `[underhood] suspension anchor ${ci}/${li} at x=${x} found no body in ` +
            `y ∈ [${band[0]}, ${band[1]}]; falling back to the bounding box side |z|=` +
            edge.toFixed(3),
        )
      }
      return new THREE.Vector3(x, (band[0] + band[1]) / 2, s * (edge - bury))
    }),
  )
}

/**
 * Which side of the wheel mesh the spokes are on, and how deep they sit.
 *
 * Nothing in the GLB says. The reliable tell is that a rim is a cup: one face
 * is closed by the spokes near the hub, the other is the open mouth of the
 * barrel. So fire a small fan of rays straight down the axle, from well
 * outside the wheel on its +z side, at radii that fall inside the spoke area
 * and outside the centre bore, and take the median of where they first land.
 * That median *is* the spoke plane; its sign is the side the spokes look down.
 *
 * Returns local-frame numbers: `sign` is ±1 in the mesh's own z, `depth` is
 * how far the plane sits from the wheel's centre plane, in metres on a front
 * wheel. Falls back to +1 / a quarter of the half width if the probe misses,
 * which is the layout the mesh actually shipped with.
 */
function deriveWheelFace(
  THREE: THREE,
  wheelPieces: THREE_NS.Object3D[],
  halfWidth: number,
): { sign: 1 | -1; depth: number } {
  const piece = wheelPieces[0]
  const fallback = { sign: 1 as const, depth: halfWidth * 0.25 }
  if (!piece) return fallback

  const centre = piece.position
  const ray = new THREE.Raycaster()
  ray.far = WHEEL_RAY_Z * 2.4
  const origin = new THREE.Vector3()
  const down = new THREE.Vector3(0, 0, -1)
  const hits: number[] = []
  for (const r of [0.05, 0.075, 0.1]) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      origin.set(centre.x + Math.cos(a) * r, centre.y + Math.sin(a) * r, centre.z + WHEEL_RAY_Z)
      ray.set(origin, down)
      const hit = ray.intersectObject(piece, true)[0]
      if (hit) hits.push(hit.point.z - centre.z)
    }
  }
  if (hits.length === 0) {
    if (import.meta.env.DEV) {
      console.warn('[underhood] wheel face probe found no rim; assuming the spokes face +z')
    }
    return fallback
  }
  hits.sort((p, q) => p - q)
  const median = hits[hits.length >> 1]
  const sign: 1 | -1 = median >= 0 ? 1 : -1
  // Clamped: a probe that somehow landed on the tyre's shoulder must not push
  // the nut and the disc outside the wheel.
  const depth = Math.min(Math.abs(median), halfWidth * 0.75)
  return { sign, depth }
}

/**
 * Sit the halo on the tub, the way the wishbones sit on the flank.
 *
 * The manifest can only say roughly where a 0.42-scaled hoop belongs, and
 * roughly left it hovering over the cockpit on three legs that touched
 * nothing (Marcin 2026-09: "halo nie łączy się z bolidem"). So: find the three
 * feet in the mesh itself — the vertices within 35 mm of its lowest point,
 * clustered fore/aft and then left/right — drop a ray from above each one onto
 * the assembled body, and solve the one translation and the one tilt about Z
 * that put all three onto the skin at once. The lowest foot lands 5 mm inside
 * it; the tilt (capped at 4°, and the front pylon is 600 mm from the rear
 * legs, so that is 42 mm of fore-and-aft mismatch it can absorb) takes care of
 * a deck that is not level.
 *
 * Returns the numbers it derived plus the world contact points, so the caller
 * can put a mounting pad on each and dev can print them.
 */
function seatHalo(
  THREE: THREE,
  piece: THREE_NS.Object3D,
  bodyPieces: THREE_NS.Object3D[],
): {
  drop: number
  tilt: number
  contacts: THREE_NS.Vector3[]
  surfaceY: number[]
  residuals: number[]
} | null {
  piece.updateMatrixWorld(true)
  const meshes: THREE_NS.Mesh[] = []
  piece.traverse((o) => {
    const m = o as THREE_NS.Mesh
    if (m.isMesh) meshes.push(m)
  })
  if (meshes.length === 0) return null

  const v = new THREE.Vector3()
  let minY = Infinity
  for (const m of meshes) {
    const pos = m.geometry.getAttribute('position') as THREE_NS.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld)
      if (v.y < minY) minY = v.y
    }
  }
  if (!Number.isFinite(minY)) return null

  // Split on z, not on height. The three legs do not end at the same y — the
  // front pylon runs a long way down the front of the tub while the rear pair
  // stop on the cockpit rim — so "the lowest vertices" is all pylon and no
  // legs. What *is* certain is the plan view: one leg on the centreline, two
  // out at the sides. Cluster on that, then read each leg's own bottom.
  const box = new THREE.Box3().setFromObject(piece)
  const zSplit = Math.max(0.05, (box.max.z - box.min.z) * 0.18)
  const groups: { x: number; y: number; z: number }[][] = [[], [], []]
  for (const m of meshes) {
    const pos = m.geometry.getAttribute('position') as THREE_NS.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld)
      const g = Math.abs(v.z) < zSplit ? 0 : v.z > 0 ? 1 : 2
      groups[g].push({ x: v.x, y: v.y, z: v.z })
    }
  }
  if (groups.some((g) => g.length === 0)) return null

  const feet = groups.map((g) => {
    let fy = Infinity
    for (const p of g) if (p.y < fy) fy = p.y
    let sx = 0
    let sz = 0
    let n = 0
    for (const p of g) {
      if (p.y > fy + HALO_FOOT_BAND) continue
      sx += p.x
      sz += p.z
      n++
    }
    return { x: sx / n, z: sz / n, y: fy, n }
  })

  // Where the body is under each foot. Not one ray: the tub has a cockpit
  // opening a few centimetres from where the rear legs land, and a single ray
  // that drops through it comes back with the cockpit *floor*, 350 mm down.
  // A small patch of rays, keeping the highest surface any of them found, is
  // what picks the rim the leg is actually meant to stand on.
  const ray = new THREE.Raycaster()
  ray.far = HALO_RAY_Y * 1.6
  const originVec = new THREE.Vector3()
  const downVec = new THREE.Vector3(0, -1, 0)
  const surfaceY = feet.map((f) => {
    let best = -Infinity
    for (const r of [0, 0.03, 0.06]) {
      const steps = r === 0 ? 1 : 8
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2
        originVec.set(f.x + Math.cos(a) * r, HALO_RAY_Y, f.z + Math.sin(a) * r)
        ray.set(originVec, downVec)
        const hit = ray.intersectObjects(bodyPieces, true)[0]
        if (hit && hit.point.y > best) best = hit.point.y
      }
    }
    if (Number.isFinite(best)) return best
    if (import.meta.env.DEV) {
      console.warn(
        `[underhood] halo foot at x=${f.x.toFixed(3)} z=${f.z.toFixed(3)} found no body below it`,
      )
    }
    return f.y
  })

  // Drop each foot needs on its own: how far it floats above its target.
  const need = feet.map((f, i) => f.y - (surfaceY[i] - HALO_BURY))
  const pivotX = piece.position.x
  const pivotY = piece.position.y
  const dx = feet.map((f) => f.x - pivotX)
  // Two unknowns — the drop D and the tilt α — against the front foot and the
  // mean of the rear pair, which are symmetric in z and so want the same
  // answer. A foot's height after the move is `need − D + dx·α`.
  const dxRear = (dx[1] + dx[2]) / 2
  const needRear = (need[1] + need[2]) / 2
  const span = dxRear - dx[0]
  let tilt = Math.abs(span) > 1e-4 ? (need[0] - needRear) / span : 0
  const wanted = tilt
  tilt = Math.max(-HALO_MAX_TILT, Math.min(HALO_MAX_TILT, tilt))
  // Whichever foot has the furthest to fall sets the drop, so that after the
  // tilt has taken out as much of the mismatch as 4° can, no foot is left
  // hanging in the air. The others go deeper into the tub than the nominal
  // 5 mm, which is the right way to be wrong: this hoop's front pylon is
  // longer than the deck it lands on is high, and a pylon that disappears
  // into the bodywork reads as bolted to it, while a leg stopping 50 mm short
  // of the skin reads as broken — which is the bug being fixed.
  const drop = Math.max(...need.map((n, i) => n + dx[i] * tilt))
  if (import.meta.env.DEV && Math.abs(wanted) > HALO_MAX_TILT) {
    console.info(
      `[underhood] halo wanted ${((wanted * 180) / Math.PI).toFixed(1)}° of tilt to land its ` +
        `three feet level; capped at ${((HALO_MAX_TILT * 180) / Math.PI).toFixed(0)}°`,
    )
  }

  // Only the tilt is applied here. The drop belongs to the mover's `base`, or
  // the next `setProgress` would put the halo straight back where it was.
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), tilt)
  piece.quaternion.premultiply(q)

  const cos = Math.cos(tilt)
  const sin = Math.sin(tilt)
  const contacts = feet.map((f, i) => {
    const dy = f.y - pivotY
    return new THREE.Vector3(
      pivotX + dx[i] * cos - dy * sin,
      pivotY + dx[i] * sin + dy * cos - drop,
      f.z,
    )
  })
  const residuals = need.map((n, i) => n - drop + dx[i] * tilt)
  if (import.meta.env.DEV) {
    console.info(
      '[underhood] halo feet (foot y → body y): ' +
        feet
          .map(
            (f, i) =>
              `[${f.x.toFixed(2)}, ${f.z.toFixed(2)}] ` +
              `${f.y.toFixed(3)}→${surfaceY[i].toFixed(3)}`,
          )
          .join('  '),
    )
  }
  return { drop, tilt, contacts, surfaceY, residuals }
}

/**
 * Where the rear wing's pylons end, in world space.
 *
 * Only the strip down the middle of the wing is looked at: the endplates come
 * down to the same height out at the sides and are not feet. Inside the
 * strip, the lowest vertices are the bottoms of the two pylons — flat cuts,
 * so everything within 30 mm of the lowest point is foot. Returns the foot's
 * x extent (`x0` the rearmost, which is the most negative), its height, and
 * how far off the centreline its outer face is.
 */
function findPylonFeet(
  THREE: THREE,
  piece: THREE_NS.Object3D,
): { x0: number; x1: number; y: number; halfZ: number } | null {
  piece.updateMatrixWorld(true)
  const meshes: THREE_NS.Mesh[] = []
  piece.traverse((o) => {
    const m = o as THREE_NS.Mesh
    if (m.isMesh) meshes.push(m)
  })

  const v = new THREE.Vector3()
  const each = (fn: (p: THREE_NS.Vector3) => void) => {
    for (const m of meshes) {
      const pos = m.geometry.getAttribute('position') as THREE_NS.BufferAttribute
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld)
        if (Math.abs(v.z) <= PYLON_ZONE) fn(v)
      }
    }
  }

  let y = Infinity
  each((p) => {
    if (p.y < y) y = p.y
  })
  if (!Number.isFinite(y)) return null

  let x0 = Infinity
  let x1 = -Infinity
  let halfZ = 0
  each((p) => {
    if (p.y > y + PYLON_FOOT_BAND) return
    x0 = Math.min(x0, p.x)
    x1 = Math.max(x1, p.x)
    halfZ = Math.max(halfZ, Math.abs(p.z))
  })
  return { x0, x1, y, halfZ }
}

/**
 * The rear impact structure: a round-cornered box lofted down the car's axis.
 *
 * Built in world space, from `front` (inside the gearbox bay) back to `tail`.
 * The top is dead flat for the whole length — it is the face the pylon feet
 * sit on — while the underside sweeps up toward the tail and the plan tapers,
 * which is what makes it read as a crash structure rather than a beam. The
 * section is a rounded rectangle rather than a superellipse on purpose: a
 * superellipse is already falling away at the pylons' |z| and would have left
 * the outer edge of each foot hanging a few millimetres over nothing.
 *
 * Both ends are capped with their own vertices, so the recomputed normals stay
 * flat across the end faces instead of smearing round the corners.
 */
function impactStructureGeometry(
  THREE: THREE,
  spec: {
    front: number
    tail: number
    top: number
    depth: [number, number]
    halfWidth: [number, number]
    corner: number
  },
): THREE_NS.BufferGeometry {
  const STATIONS = 16
  /** Segments per quarter-circle corner. */
  const ARC = 6
  const perRing = 4 * (ARC + 1)
  const positions: number[] = []
  const index: number[] = []
  const rings: { x: number; mid: number; start: number }[] = []

  for (let i = 0; i < STATIONS; i++) {
    const t = i / (STATIONS - 1)
    const x = spec.front + (spec.tail - spec.front) * t
    // Smoothstep, so the underside leaves the gearbox level and arrives at
    // the tail level, with the sweep in between.
    const e = t * t * (3 - 2 * t)
    const bottom = spec.top - (spec.depth[0] + (spec.depth[1] - spec.depth[0]) * e)
    const w = spec.halfWidth[0] + (spec.halfWidth[1] - spec.halfWidth[0]) * t
    const h = (spec.top - bottom) / 2
    const mid = (spec.top + bottom) / 2
    const r = Math.min(spec.corner, h * 0.9, w * 0.9)
    // Corner centres, walked from +z/+y round through −z to −y: the section
    // runs anticlockwise seen from behind the car.
    const corners: [number, number, number][] = [
      [w - r, h - r, 0],
      [-(w - r), h - r, 90],
      [-(w - r), -(h - r), 180],
      [w - r, -(h - r), 270],
    ]
    rings.push({ x, mid, start: positions.length / 3 })
    for (const [cz, cy, a0] of corners) {
      for (let k = 0; k <= ARC; k++) {
        const a = ((a0 + (90 * k) / ARC) * Math.PI) / 180
        positions.push(x, mid + cy + r * Math.sin(a), cz + r * Math.cos(a))
      }
    }
  }

  // Side wall. Stations run toward −x, so (a, b, c) with b the next point
  // round the ring and c the same point one station back faces outward.
  for (let i = 0; i < STATIONS - 1; i++) {
    for (let j = 0; j < perRing; j++) {
      const a = i * perRing + j
      const b = i * perRing + ((j + 1) % perRing)
      const c = (i + 1) * perRing + j
      const d = (i + 1) * perRing + ((j + 1) % perRing)
      index.push(a, b, c, b, d, c)
    }
  }

  // End caps, each a fan round a centre vertex of its own.
  const cap = (ring: { x: number; mid: number; start: number }, facingTail: boolean) => {
    const centre = positions.length / 3
    positions.push(ring.x, ring.mid, 0)
    for (let j = 0; j < perRing; j++) {
      const p = ring.start + j
      positions.push(positions[p * 3], positions[p * 3 + 1], positions[p * 3 + 2])
    }
    for (let j = 0; j < perRing; j++) {
      const p = centre + 1 + j
      const q = centre + 1 + ((j + 1) % perRing)
      if (facingTail) index.push(centre, p, q)
      else index.push(centre, q, p)
    }
  }
  cap(rings[STATIONS - 1], true)
  cap(rings[0], false)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setIndex(index)
  geo.computeVertexNormals()
  geo.computeBoundingBox()
  geo.computeBoundingSphere()
  return geo
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
