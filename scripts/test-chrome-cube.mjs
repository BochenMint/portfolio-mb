/**
 * Contract tests for Chrome cube autoplay / orientation.
 * Keep in lockstep with src/chrome/components/cubeOrientation.ts
 *
 * Run: node scripts/test-chrome-cube.mjs
 */
const FACE_COUNT = 6
const LATERAL_FACE_COUNT = 4
const PITCH_LIMIT = 90
const FACE_NORMALS = [
  [0, 0, 1],
  [1, 0, 0],
  [0, 0, -1],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
]
const DEG = Math.PI / 180

function facingZ(normal, yawDeg, pitchDeg) {
  const yaw = yawDeg * DEG
  const pitch = pitchDeg * DEG
  const [nx, ny, nz] = normal
  const z1 = -nx * Math.sin(yaw) + nz * Math.cos(yaw)
  return ny * Math.sin(pitch) + z1 * Math.cos(pitch)
}

function indexFromOrientation(yawDeg, pitchDeg) {
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

function nearestSnap(rot) {
  return Math.round(rot / 90) * 90
}

function nearestRotForIndex(currentRot, index) {
  const target = -index * 90
  const currentMod = ((currentRot % 360) + 360) % 360
  const targetMod = ((target % 360) + 360) % 360
  let delta = targetMod - currentMod
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return currentRot + delta
}

function orientationForIndex(index, yawDeg) {
  if (index >= LATERAL_FACE_COUNT) {
    return { yaw: nearestSnap(yawDeg), pitch: index === 4 ? PITCH_LIMIT : -PITCH_LIMIT }
  }
  return { yaw: nearestRotForIndex(yawDeg, ((index % 4) + 4) % 4), pitch: 0 }
}

function nextAutoplayIndex(current, yawDeg = 0) {
  const i = ((current % FACE_COUNT) + FACE_COUNT) % FACE_COUNT
  if (i >= LATERAL_FACE_COUNT) {
    const snapped = nearestSnap(yawDeg)
    return (((Math.round(-snapped / 90) % LATERAL_FACE_COUNT) + LATERAL_FACE_COUNT) % LATERAL_FACE_COUNT)
  }
  return (i + 1) % LATERAL_FACE_COUNT
}

const failures = []
function eq(name, got, want) {
  const same = typeof want === 'object' ? JSON.stringify(got) === JSON.stringify(want) : Object.is(got, want)
  if (!same) failures.push(`${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`)
}

eq('autoplay 0→1', nextAutoplayIndex(0), 1)
eq('autoplay 1→2', nextAutoplayIndex(1), 2)
eq('autoplay 2→3', nextAutoplayIndex(2), 3)
eq('autoplay 3→0 (never 4)', nextAutoplayIndex(3), 0)

let i = 0
const seen = new Set()
for (let n = 0; n < 12; n += 1) {
  seen.add(i)
  i = nextAutoplayIndex(i)
}
eq('autoplay never leaves the yaw ring', [...seen].sort().join(','), '0,1,2,3')

eq('from top drops to yaw ring', nextAutoplayIndex(4, 0), 0)
eq('from bottom drops to yaw ring', nextAutoplayIndex(5, 0), 0)
eq('from top at yaw -90 returns to right', nextAutoplayIndex(4, -90), 1)
eq('from bottom at yaw -180 returns to back', nextAutoplayIndex(5, -180), 2)

for (const idx of [0, 1, 2, 3]) {
  const o = orientationForIndex(idx, 0)
  eq(`lateral ${idx} pitch is 0`, o.pitch, 0)
  eq(`lateral ${idx} squares up`, indexFromOrientation(o.yaw, o.pitch), idx)
}
eq('top pitch +90', orientationForIndex(4, 0).pitch, 90)
eq('bottom pitch -90', orientationForIndex(5, 0).pitch, -90)
eq('top squares up', indexFromOrientation(0, 90), 4)
eq('bottom squares up', indexFromOrientation(0, -90), 5)

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('test-chrome-cube: ok')
