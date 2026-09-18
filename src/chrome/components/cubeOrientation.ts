/**
 * Cube orientation helpers, kept free of three.js so autoplay and snapping
 * can be unit-tested. The spin group is yaw about local Y then pitch about
 * world X — see ProjectCube's "Orientation model" note.
 */

export const FACE_COUNT = 6
/** Front / right / back / left. Top and bottom are pitch, not yaw. */
export const LATERAL_FACE_COUNT = 4
export const PITCH_LIMIT = 90

/** Index → the face's outward normal in the cube's own space. */
export const FACE_NORMALS: ReadonlyArray<readonly [number, number, number]> = [
  [0, 0, 1], // 0 front  (+Z)
  [1, 0, 0], // 1 right  (+X)
  [0, 0, -1], // 2 back   (-Z)
  [-1, 0, 0], // 3 left   (-X)
  [0, 1, 0], // 4 top    (+Y)
  [0, -1, 0], // 5 bottom (-Y)
]

const DEG = Math.PI / 180

/**
 * How strongly a face points at the camera after the orientation is applied:
 * the world-space Z of its normal. The camera sits on +Z (12° above), so the
 * largest value wins.
 */
export function facingZ(normal: readonly [number, number, number], yawDeg: number, pitchDeg: number) {
  const yaw = yawDeg * DEG
  const pitch = pitchDeg * DEG
  const [nx, ny, nz] = normal
  const z1 = -nx * Math.sin(yaw) + nz * Math.cos(yaw)
  return ny * Math.sin(pitch) + z1 * Math.cos(pitch)
}

export function indexFromOrientation(yawDeg: number, pitchDeg: number) {
  let best = 0
  let bestZ = -Infinity
  for (let i = 0; i < FACE_COUNT; i += 1) {
    const z = facingZ(FACE_NORMALS[i], yawDeg, pitchDeg)
    if (z > bestZ) {
      bestZ = z
      best = i
    }
  }
  return best
}

export function nearestRotForIndex(currentRot: number, index: number) {
  const target = -index * 90
  const currentMod = ((currentRot % 360) + 360) % 360
  const targetMod = ((target % 360) + 360) % 360
  let delta = targetMod - currentMod
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return currentRot + delta
}

export function nearestSnap(rot: number) {
  return Math.round(rot / 90) * 90
}

/** The yaw/pitch pair that squares face `index` up to the camera, reached from
 *  the current orientation by the shortest route. */
export function orientationForIndex(index: number, yawDeg: number) {
  if (index >= LATERAL_FACE_COUNT) {
    return { yaw: nearestSnap(yawDeg), pitch: index === 4 ? PITCH_LIMIT : -PITCH_LIMIT }
  }
  return { yaw: nearestRotForIndex(yawDeg, ((index % 4) + 4) % 4), pitch: 0 }
}

/**
 * Autoplay walks the four lateral faces only. Pitching ±90° to show the top
 * plate or the bottom screenshot turns every remaining screen onto its side
 * (and RoundedBoxGeometry's rewritten UVs can leave that screenshot at
 * 90°/180° even after the pitch settles).
 *
 * Top/bottom stay reachable from dots, arrows and drag. If the timer fires
 * while those faces are showing, drop back onto the yaw ring at the current
 * yaw rather than somersaulting through ±90°.
 */
export function nextAutoplayIndex(current: number, yawDeg = 0) {
  const i = ((current % FACE_COUNT) + FACE_COUNT) % FACE_COUNT
  if (i >= LATERAL_FACE_COUNT) {
    const snapped = nearestSnap(yawDeg)
    return (((Math.round(-snapped / 90) % LATERAL_FACE_COUNT) + LATERAL_FACE_COUNT) % LATERAL_FACE_COUNT)
  }
  return (i + 1) % LATERAL_FACE_COUNT
}
