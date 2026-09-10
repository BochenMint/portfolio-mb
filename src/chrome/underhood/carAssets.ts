/**
 * Placement manifest for the exploded F1 car.
 *
 * The seven GLB meshes are AI-generated from reference renders, so they arrive
 * normalised: every one is centred and fitted into a ~1.9 unit box, with an
 * arbitrary orientation. Nothing about them is to scale and nothing about them
 * knows where it belongs on a car. This file is the missing half: for each
 * piece, the rotation that puts its own axes onto the car's axes, the per-axis
 * scale that stretches its normalised box into the real-world box it occupies
 * on a 2022-spec Formula 1 car, and the position of that box's centre.
 *
 * Scene convention — 1 unit = 1 metre, +X = forward (nose), +Y = up,
 * +Z = the car's right-hand side, ground plane at y = 0.
 *
 * Reference dimensions used (metres): length 5.6 (nose tip x = +2.90, rear
 * wing trailing edge x = −2.77), width 2.0, wheelbase 3.6 (front axle
 * x = +1.55, rear axle x = −2.05), axle height 0.36, wheel diameter 0.72,
 * front tyre width 0.31 / rear 0.41, track 1.62 front / 1.55 rear.
 *
 * The measured source bounding boxes (from `public/__f1inspect.html`, which
 * renders every mesh from +X / +Z / +Y with an axes helper) are recorded next
 * to each entry so the numbers can be re-derived rather than re-guessed.
 */

import type { BufferGeometry } from 'three'

export type PartId =
  | 'body'
  | 'frontWing'
  | 'rearWing'
  | 'wheels'
  | 'powerUnit'
  | 'engineCover'
  | 'halo'
  | 'steering'

/**
 * Story order, which is also explode order: it must match `layers` in
 * `../data/underhood.ts` index for index. Chapter n and explode step n are the
 * same beat — that is the whole point of the section.
 */
export const PART_IDS: readonly PartId[] = [
  'body',
  'engineCover',
  'powerUnit',
  'rearWing',
  'frontWing',
  'wheels',
  'halo',
  'steering',
]

const D = Math.PI / 180

export type Vec3 = [number, number, number]

export type PieceSpec = {
  /** Which layer of the story this piece belongs to. */
  part: PartId
  /** File name under `/models/f1/`, without the extension. */
  file: string
  /** Euler XYZ in radians, applied to the mesh's own axes. */
  rotation: Vec3
  /** Per-axis scale, applied to the mesh's own axes (before the rotation). */
  scale: Vec3
  /** World position of the piece's box centre when the car is assembled. */
  position: Vec3
  /** Where the piece travels to when fully exploded, relative to `position`. */
  explode: Vec3
  /**
   * Optional second leg of the path, run over the back half of the part's
   * window once `explode` has finished. Only the power unit needs it: it has
   * to rise clear of the chassis rails before it can slide back, the way it
   * really comes out, and a single diagonal would drag it through the floor.
   */
  explode2?: Vec3
}

export type PartSpec = {
  id: PartId
  /** Progress window over which this part separates. */
  window: [number, number]
}

/**
 * Explode choreography — one window per chapter, in the order of the story.
 *
 * Each window is ~0.11 of the scroll with 0.01 of overlap onto the next, so a
 * part is still settling as the following one starts to move and the car comes
 * apart as a sequence rather than as eight things at once. Every window is
 * eased with power2.inOut, so a part is never moving fastest at the moment it
 * leaves the car. `body` never moves: it is the shell the whole section argues
 * against, and it is the "current" layer for everything before 0.10.
 *
 * The last window closes at 0.80 on purpose. The final fifth of the pin is the
 * fully exploded car held still, which is where the section's last chapter —
 * measurement — gets to be read rather than scrolled past.
 */
export const PART_WINDOWS: Record<PartId, [number, number]> = {
  body: [0, 0],
  engineCover: [0.1, 0.2],
  powerUnit: [0.19, 0.3],
  rearWing: [0.29, 0.4],
  frontWing: [0.39, 0.5],
  wheels: [0.49, 0.6],
  halo: [0.59, 0.7],
  steering: [0.69, 0.8],
}

/* ------------------------------------------------------------------ *
 * Wheels
 *
 * Source box 1.8983 × 1.8986 × 0.8529 — the wheel already lies in its own
 * XY plane with the axle down local Z, which is the car's lateral axis, so it
 * needs no rotation. Uniform 0.3792 puts the diameter on 0.72 m and the width
 * on 0.323 m (front). The rears are the same casting scaled 1.27× across the
 * axle for the 0.41 m rear tyre.
 * ------------------------------------------------------------------ */
const WHEEL_S = 0.72 / 1.8983 // 0.3792
const REAR_W = 1.27

export const FRONT_AXLE_X = 1.55
export const REAR_AXLE_X = -2.05
export const AXLE_Y = 0.36
export const FRONT_TRACK_HALF = 0.81
export const REAR_TRACK_HALF = 0.775
export const FRONT_TYRE_HALF_WIDTH = (0.8529 * WHEEL_S) / 2
export const REAR_TYRE_HALF_WIDTH = (0.8529 * WHEEL_S * REAR_W) / 2

const wheel = (x: number, z: number, rear: boolean): PieceSpec => ({
  part: 'wheels',
  file: 'wheel',
  rotation: [0, 0, 0],
  scale: [WHEEL_S, WHEEL_S, rear ? WHEEL_S * REAR_W : WHEEL_S],
  position: [x, AXLE_Y, z],
  // Straight out along the axle and nothing else: that is the one direction a
  // wheel can leave a hub, and lifting it as well would break the read.
  explode: [0, 0, Math.sign(z) * 0.42],
})

export const PIECES: PieceSpec[] = [
  /* Monocoque + nose + sidepods + floor, with the engine cover baked in.
     Source box 1.8990 × 0.4445 × 0.8022, nose pointing down local −X, so a
     half turn about Y puts it on +X. Stretched to 5.20 × 0.90 × 1.40 m:
     x −2.30…+2.70, y 0.05…0.95, z ±0.56. The mesh is proportionally much
     wider than a real chassis (the AI render carried the floor out to where
     the wheels sit), so Z is compressed hard: at 1.12 m the floor clears the
     inside face of the rear tyres, which sit at |z| = 0.57. */
  {
    part: 'body',
    file: 'body',
    rotation: [0, 180 * D, 0],
    scale: [2.633, 2.025, 1.4],
    position: [0.2, 0.5, 0],
    explode: [0, 0, 0],
  },

  /* Front wing. Source box 1.8991 × 0.3939 × 0.7529 with the span down local
     X and the chord down local Z. The leading edge is at +Z, not −Z as first
     assumed, so it is a quarter turn about +Y that points the main plane
     forward — the earlier −90° mounted the whole wing back to front, with the
     flaps climbing toward the nose and the endplates' tall section out over
     the tip. Target 2.00 m span, 0.59 m chord, 0.28 m tall: x 2.26…2.85, so
     the nose tip at 2.70 sits over the wing's mid-chord (where the pylons
     really land) and the tall rear of the endplates, at 2.26, tucks 0.35 m
     clear of the front tyres, which start at x = 1.91. */
  {
    part: 'frontWing',
    file: 'frontWing',
    rotation: [0, 90 * D, 0],
    scale: [1.05, 0.72, 0.78],
    position: [2.55, 0.2, 0],
    // Straight off the nose pylons, along the car's axis and nothing else.
    explode: [0.55, 0, 0],
  },

  /* Rear wing with its swan-neck pylons. Source box 1.8988 × 1.2000 × 1.4137,
     span down local X, so the same quarter turn about +Y. Uniform 0.50 gives
     a 0.95 m span, 0.60 m height and 0.71 m of depth including the pylons:
     x −2.80…−2.10, y 0.48…1.08, its pylons landing on the back of the floor,
     which ends at −2.30. */
  {
    part: 'rearWing',
    file: 'rearWing',
    rotation: [0, 90 * D, 0],
    scale: [0.5, 0.5, 0.5],
    position: [-2.45, 0.78, 0],
    // Back off its pylons, with just enough lift to clear the diffuser lip.
    explode: [-0.5, 0.12, 0],
  },

  /* Halo. Source box 1.8683 × 0.8417 × 1.8988 — the hoop lies in local XZ
     with the single front pylon at −Z and the two rear legs at +Z, so it
     needs a quarter turn the other way. Uniform 0.42 gives 0.80 m across,
     0.35 m tall, 0.78 m long: x −0.22…+0.58, y 0.60…0.95, over the cockpit. */
  {
    part: 'halo',
    file: 'halo',
    rotation: [0, -90 * D, 0],
    scale: [0.42, 0.42, 0.42],
    position: [0.18, 0.775, 0],
    // Straight up: the halo bolts to the chassis on three near-vertical legs,
    // so up is the only way it comes off.
    explode: [0, 0.42, 0],
  },

  /* Engine cover shell. Source box 1.8992 × 0.6580 × 1.0807, cockpit cut-out
     at local −X like the body, so the same half turn. Target 1.60 × 0.42 ×
     0.75 m: x −1.90…−0.30, y 0.53…0.95, i.e. from behind the cockpit rim to
     the start of the diffuser, roll-hoop intake at the top. */
  {
    part: 'engineCover',
    file: 'engineCover',
    rotation: [0, 180 * D, 0],
    scale: [0.843, 0.64, 0.694],
    position: [-1.1, 0.74, 0],
    // Straight up off its quick-release pins — a cover is lifted, not slid.
    explode: [0, 0.48, 0],
  },

  /* V6 + gearbox as one block. Source box 1.8988 × 1.2862 × 1.2768 with the
     engine already at +X and the gearbox trailing at −X, so no rotation. The
     mesh is far chunkier than a real power unit, so X is stretched more than
     Y: 1.29 × 0.64 × 0.70 m, x −1.82…−0.53, y 0.18…0.82 — between the back of
     the cockpit and the rear axle, under the cover. */
  {
    part: 'powerUnit',
    file: 'powerUnit',
    rotation: [0, 0, 0],
    scale: [0.68, 0.5, 0.55],
    position: [-1.18, 0.5, 0],
    // Up out of the chassis rails first — its window opens after the engine
    // cover's has closed, so it lifts into a hole that is already empty —
    // then back along the crankshaft axis, the way it comes off the gearbox.
    explode: [0, 0.32, 0],
    explode2: [-0.28, 0, 0],
  },

  wheel(FRONT_AXLE_X, FRONT_TRACK_HALF, false),
  wheel(FRONT_AXLE_X, -FRONT_TRACK_HALF, false),
  wheel(REAR_AXLE_X, REAR_TRACK_HALF, true),
  wheel(REAR_AXLE_X, -REAR_TRACK_HALF, true),
]

/**
 * Enlarged, invisible hover targets for the parts that are mostly air.
 *
 * A wing is a 20 mm blade with 300 mm of nothing between its planes, and the
 * halo is a 30 mm hoop. Raycasting the real geometry means the cursor crosses
 * the part and misses it several times in the space of a few pixels, which is
 * exactly the strobing Marcin saw ("sekcja migocze podczas najeżdżania"). Each
 * of these is an axis-aligned box, in metres, sized to the part's real envelope
 * plus a little, added as its own mover so it travels with the explode.
 *
 * Deliberately *not* generous: a box much larger than the part would start
 * stealing hovers from the body underneath it.
 */
export const HOVER_PROXIES: Partial<Record<PartId, { size: Vec3; offset?: Vec3 }>> = {
  // 0.59 m chord × 0.28 tall × 2.00 span, at [2.55, 0.20, 0].
  frontWing: { size: [0.78, 0.4, 2.14] },
  // 0.71 deep × 0.60 tall × 0.95 span, at [−2.45, 0.78, 0].
  rearWing: { size: [0.84, 0.72, 1.08] },
  // 0.78 long × 0.35 tall × 0.80 across, at [0.18, 0.775, 0]. Kept tight in Y:
  // the hoop sits directly over the cockpit rim and a taller box would answer
  // for the body every time the cursor crossed the tub.
  halo: { size: [0.88, 0.42, 0.9] },
}

/** The steering wheel is drawn from primitives, so it only needs a transform. */
export const STEERING = {
  position: [0.35, 0.68, 0] as Vec3,
  // Off the column and along it: the column is raked hard, so the wheel slides
  // forward as much as it rises. It has to. The halo comes off the same
  // cockpit and lands directly above it — a wheel that only rose ended up
  // inside the hoop, which is exactly where the one layer the visitor is being
  // shown must not be.
  explode: [0.8, 0.45, 0] as Vec3,
  /** ZYX so the quarter turn about Y happens first and the 20° tilt second. */
  rotation: [0, 90 * D, 20 * D] as Vec3,
}

/* ------------------------------------------------------------------ *
 * Suspension anchor points
 *
 * Two wishbones and a pushrod per corner. The outboard ends are stored
 * relative to the wheel centre so the scene can rebuild every arm from the
 * wheel's *current* position each frame. That is what makes the explode read
 * as mechanical: pull a wheel out along its axle and the arms stretch with it
 * instead of staying behind.
 *
 * The inboard ends are deliberately *not* stored as world points. They used
 * to be, and every one of them was wrong: the body mesh is compressed hard in
 * Z (see the `body` entry above) and its nose is a narrow blade, so a
 * hand-picked |z| that looked right at the rear axle left the front arms
 * ending in mid-air a hand's width outside the chassis (Marcin 2026-09:
 * "wahacz nie jest dobrze połączony z monokokiem"). What is stored instead is
 * the *station* — the x and y at which the arm should meet the chassis — and
 * `carParts.ts` finds the z by firing a ray at the assembled body and taking
 * the surface it actually hits.
 * ------------------------------------------------------------------ */

export type AnchorSpec = {
  /** World x of the chassis pickup. */
  x: number
  /**
   * Height band the pickup may live in, world y. `carParts.ts` sweeps it and
   * takes the *outermost* body surface it finds — the flank, in other words,
   * rather than whatever happens to be under one arbitrary y. The AI body has
   * spiky, non-convex sections (a floor edge at 0.56 sitting 30 mm under a
   * sidepod undercut at 0.20), and a band is what makes the answer stable
   * across them.
   */
  band: [number, number]
  /**
   * Extra depth past the body surface, on top of the standard 8 mm bury.
   * Only the pushrod uses it: its rocker lives inside the chassis, so its
   * pickup reads better a little deeper than the wishbones' outer flank.
   */
  inset?: number
}

export type LinkSpec = {
  /** Where the arm should meet the chassis; the z is derived from the mesh. */
  anchor: AnchorSpec
  /** Outboard end, relative to the wheel centre. */
  outboard: Vec3
  /**
   * Streamwise chord of the arm's aerofoil section, in metres. Nothing on a
   * modern car's suspension is a tube: every link is a flattened teardrop with
   * its leading edge into the airflow, because the arms sit in the wake of the
   * front tyre and the team gets to choose what that wake does next.
   */
  chord: number
  /** Maximum thickness of that section, across the chord. */
  thick: number
}

export type CornerSpec = {
  wheel: Vec3
  /** Which side of the car this corner is on: +1 = right (+Z), −1 = left. */
  side: 1 | -1
  links: LinkSpec[]
}

/** Section sizes, from the fat wishbones down to the thin steering arm. */
const WISHBONE = { chord: 0.055, thick: 0.014 }
const PUSHROD = { chord: 0.04, thick: 0.012 }
const TRACKROD = { chord: 0.032, thick: 0.009 }

/**
 * Where each arm looks for the chassis, front and rear.
 *
 * The two ends of the car give the suspension completely different things to
 * bolt to, so they get different stations. At the rear the body is a proper
 * tub: a floor edge at |z| ≈ 0.34–0.42 around y = 0.20 and a sidepod flank at
 * |z| ≈ 0.23–0.31 around y = 0.35, which is close to the textbook layout —
 * lower legs on the floor edge, upper legs a third of a metre above it.
 *
 * At the front there is only the nose, and the nose is a blade: it exists
 * between y = 0.32 and y = 0.50 and it is 0.20–0.26 m wide, full stop. There
 * is no floor out there to hang a lower wishbone off and no rack height to
 * put a track rod at, so the front pickups are stacked inside that 0.18 m of
 * blade — upper and pushrod along its top edge, lower and track rod along its
 * bottom. That is also what a real front end does: both wishbones land on the
 * sides of a narrow tub. It just means the front links come out short.
 *
 * `SPREAD` is the fore-and-aft gap between a wishbone's two legs: far enough
 * apart to read as a triangle, near enough that both still find body. The
 * rear pair is nudged forward because the tail ends at x = −2.30, only 0.25 m
 * behind the rear axle, and tapers to nothing over the last 50 mm.
 */
const UPPER_SPREAD = { front: 0.22, rear: 0.2 }
const LOWER_SPREAD = { front: 0.25, rear: 0.19 }
const REAR_BIAS = 0.06
const BANDS = {
  front: {
    upper: [0.42, 0.52] as [number, number],
    lower: [0.28, 0.38] as [number, number],
    push: [0.44, 0.54] as [number, number],
    track: [0.3, 0.36] as [number, number],
  },
  rear: {
    upper: [0.3, 0.4] as [number, number],
    // Deliberately above the floor's outer lip at y ≈ 0.15: that lip juts out
    // to |z| = 0.56 for 30 mm and then stops, and a leg landing on it would
    // splay 200 mm wider than its partner.
    lower: [0.18, 0.22] as [number, number],
    push: [0.4, 0.47] as [number, number],
  },
}

function corner(x: number, z: number, rear: boolean): CornerSpec {
  const s: 1 | -1 = z >= 0 ? 1 : -1
  const hubZ = s * (rear ? -0.2 : -0.16) // toward the car's centreline
  const bias = rear ? REAR_BIAS : 0
  const up = rear ? UPPER_SPREAD.rear : UPPER_SPREAD.front
  const lo = rear ? LOWER_SPREAD.rear : LOWER_SPREAD.front
  const band = rear ? BANDS.rear : BANDS.front
  // The pushrod runs to a rocker inside the tub: behind the front axle, where
  // the bulkhead is, and just ahead of the rear one, where the gearbox is.
  const pushX = x + (rear ? 0.05 : -0.14)
  const links: LinkSpec[] = [
    // Upper wishbone: a narrow V onto the top of the upright.
    { anchor: { x: x + bias + up, band: band.upper }, outboard: [0, 0.14, hubZ], ...WISHBONE },
    { anchor: { x: x + bias - up, band: band.upper }, outboard: [0, 0.14, hubZ], ...WISHBONE },
    // Lower wishbone: same idea, wider base, onto the bottom of the upright.
    { anchor: { x: x + bias + lo, band: band.lower }, outboard: [0, -0.14, hubZ], ...WISHBONE },
    { anchor: { x: x + bias - lo, band: band.lower }, outboard: [0, -0.14, hubZ], ...WISHBONE },
    // Pushrod: up off the bottom of the upright, deeper into the chassis than
    // the wishbones because the rocker it drives is inside it.
    { anchor: { x: pushX, band: band.push, inset: 0.03 }, outboard: [0, -0.13, hubZ], ...PUSHROD },
  ]
  // Track rod — only the front wheels steer, so only they get one. It sits
  // behind the axle, along the bottom edge of the nose, level with the hub.
  if (!rear) {
    links.push({ anchor: { x: x - 0.3, band: BANDS.front.track }, outboard: [0, 0, hubZ], ...TRACKROD })
  }
  return { wheel: [x, AXLE_Y, z], side: s, links }
}

export const CORNERS: CornerSpec[] = [
  corner(FRONT_AXLE_X, FRONT_TRACK_HALF, false),
  corner(FRONT_AXLE_X, -FRONT_TRACK_HALF, false),
  corner(REAR_AXLE_X, REAR_TRACK_HALF, true),
  corner(REAR_AXLE_X, -REAR_TRACK_HALF, true),
]

/* ------------------------------------------------------------------ *
 * Geometry cache
 *
 * The hero and the exploded section both want the same seven meshes. Loading
 * and re-welding them twice would cost a second Draco decode and a second
 * copy on the GPU, so the processed geometries live here at module scope and
 * both scenes clone cheap `Mesh` wrappers around them.
 * ------------------------------------------------------------------ */
const cache = new Map<string, Promise<BufferGeometry[]>>()

export function loadPartGeometries(
  file: string,
  loader: (url: string) => Promise<BufferGeometry[]>,
): Promise<BufferGeometry[]> {
  const hit = cache.get(file)
  if (hit) return hit
  const pending = loader(`/models/f1/${file}.glb`)
  cache.set(file, pending)
  // A failed load must not poison the cache for a later retry.
  pending.catch(() => cache.delete(file))
  return pending
}

/** Progress → 0..1 within a part's window, eased like GSAP's power2.inOut. */
export function windowProgress(p: number, [a, b]: [number, number]): number {
  if (b <= a) return 0
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)))
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

/** Where a two-leg path hands over from `explode` to `explode2`. */
export const LEG_SPLIT = 0.55

/** Eased progress along one leg of a two-leg path. */
export function legProgress(p: number, [a, b]: [number, number], leg: 0 | 1): number {
  const cut = a + (b - a) * LEG_SPLIT
  return leg === 0 ? windowProgress(p, [a, cut]) : windowProgress(p, [cut, b])
}

/** Parts in the order they leave the car — the order the scroll reveals them. */
export const EXPLODE_ORDER: readonly PartId[] = (
  Object.keys(PART_WINDOWS) as PartId[]
)
  .filter((id) => PART_WINDOWS[id][1] > PART_WINDOWS[id][0])
  .sort((a, b) => PART_WINDOWS[a][0] - PART_WINDOWS[b][0])

/** Which part's window contains `p`; `body` before the first one opens. */
export function partAtProgress(p: number): PartId {
  let current: PartId = 'body'
  for (const id of EXPLODE_ORDER) {
    if (p >= PART_WINDOWS[id][0]) current = id
  }
  return current
}
