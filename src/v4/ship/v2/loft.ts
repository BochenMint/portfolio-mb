import * as THREE from 'three'

/**
 * Generic cross-section loft — builds a smooth tube by interpolating a stack
 * of rounded-rect/ellipse ring profiles along a spine. Used for the main hull,
 * the aft superstructure pod, and anything else that needs a flowing lofted
 * surface instead of a boxy primitive kit-bash.
 *
 * Ring shape is a superellipse (Lamé curve): |x/hw|^n + |y/hh|^n = 1, sampled
 * parametrically so every ring has identical point count/topology (required
 * for a clean loft). `roundness` IS the Lamé exponent n: 2 = pure ellipse,
 * 4-6 = a flattened rounded-rectangle-ish plate. This gives a continuous
 * family of cross-sections we can ease between per station without any
 * discontinuity in vertex count.
 */
export type RingProfile = {
  halfWidth: number
  /** Top half-height (above the section center). */
  halfHeight: number
  /** Optional distinct bottom half-height — asymmetric sections (shallower
   * belly than crown) without moving the section center. Defaults to halfHeight. */
  halfHeightBottom?: number
  /** Lamé exponent for the horizontal axis: 2 = ellipse, <2 = chiseled/pointy
   * flanks, >2 = slab-sided. */
  roundness: number
  /** Optional distinct exponent for the vertical axis (top quadrants).
   * Defaults to `roundness`. */
  roundnessY?: number
  /** Optional distinct exponent for the bottom quadrants — higher = flatter
   * belly. Defaults to `roundnessY` (then `roundness`). */
  roundnessBottom?: number
}

export type LoftSection = RingProfile & {
  z: number
  centerX?: number
  centerY?: number
}

/** Exact profile surface point at angle `theta` (0 = +X/starboard,
 * PI/2 = +Y/top) — used to seat greebles/lights flush against the real hull
 * surface instead of approximating with the ring's bounding box.
 * With per-axis exponents this is no longer a strict Lamé curve but a smooth
 * per-quadrant blend — continuous across the axis crossings because each
 * axis term vanishes exactly there. */
export function ringPoint(theta: number, p: RingProfile): [number, number] {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  const nx = Math.max(p.roundness, 1.001)
  const nyTop = Math.max(p.roundnessY ?? p.roundness, 1.001)
  const nyBot = Math.max(p.roundnessBottom ?? p.roundnessY ?? p.roundness, 1.001)
  const ny = s >= 0 ? nyTop : nyBot
  const hh = s >= 0 ? p.halfHeight : (p.halfHeightBottom ?? p.halfHeight)
  const x = Math.sign(c) * Math.pow(Math.abs(c), 2 / nx) * p.halfWidth
  const y = Math.sign(s) * Math.pow(Math.abs(s), 2 / ny) * hh
  return [x, y]
}

/** Side-wall tube only (no caps) — smooth vertex normals along the tube. */
export function buildLoftWall(sections: LoftSection[], radialSegments: number): THREE.BufferGeometry {
  const ringCount = sections.length
  const positions: number[] = []
  const uvs: number[] = []

  for (let si = 0; si < ringCount; si++) {
    const sec = sections[si]
    const v = si / (ringCount - 1)
    for (let i = 0; i < radialSegments; i++) {
      const theta = (i / radialSegments) * Math.PI * 2
      const [x, y] = ringPoint(theta, sec)
      positions.push(x + (sec.centerX ?? 0), y + (sec.centerY ?? 0), sec.z)
      uvs.push(i / radialSegments, v)
    }
  }

  // Winding derived analytically for outward-facing normals (verified via
  // cross product on a reference cylinder case): (p0,p1,p2) / (p1,p3,p2)
  // where p0/p1 are ring `si` at i/i+1 and p2/p3 are ring `si+1` at i/i+1.
  const indices: number[] = []
  for (let si = 0; si < ringCount - 1; si++) {
    const a0 = si * radialSegments
    const a1 = (si + 1) * radialSegments
    for (let i = 0; i < radialSegments; i++) {
      const i2 = (i + 1) % radialSegments
      const p0 = a0 + i
      const p1 = a0 + i2
      const p2 = a1 + i
      const p3 = a1 + i2
      indices.push(p0, p1, p2)
      indices.push(p1, p3, p2)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

/**
 * Flat fan cap at one section — its own isolated geometry (not sharing
 * indices with the wall) so it gets a distinct flat-ish normal instead of
 * blending into the tube's smooth shading at the seam.
 * faceSign: +1 = normal points toward +Z (aft caps), -1 = toward -Z (fwd caps).
 */
export function buildCapDisc(section: LoftSection, radialSegments: number, faceSign: 1 | -1): THREE.BufferGeometry {
  const positions: number[] = [section.centerX ?? 0, section.centerY ?? 0, section.z]
  const uvs: number[] = [0.5, 0.5]
  for (let i = 0; i < radialSegments; i++) {
    const theta = (i / radialSegments) * Math.PI * 2
    const [x, y] = ringPoint(theta, section)
    positions.push(x + (section.centerX ?? 0), y + (section.centerY ?? 0), section.z)
    uvs.push(0.5 + Math.cos(theta) * 0.5, 0.5 + Math.sin(theta) * 0.5)
  }
  const indices: number[] = []
  for (let i = 0; i < radialSegments; i++) {
    const i2 = (i + 1) % radialSegments
    if (faceSign > 0) indices.push(0, 1 + i, 1 + i2)
    else indices.push(0, 1 + i2, 1 + i)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

// ─── Keyframe interpolation along the spine parameter t ∈ [0,1] ─────────────
// Monotone cubic Hermite (Fritsch-Carlson limiter) — NOT a piecewise ease
// between each pair of keys. Easing independently between every adjacent
// keyframe pair forces the derivative to zero at *every* key, which for a
// hull profile with 8-11 keyframes produces a visible "scalloped"/segmented-
// worm look (a bump at every key). A monotone Hermite spline instead only
// flattens where the data itself changes direction (a genuine local max/min,
// e.g. the hull's widest point), giving one continuous flowing curve with no
// overshoot and no spurious ripples between keys.
export type Keyframe = [t: number, value: number]

type MonotoneCurve = { xs: number[]; ys: number[]; ms: number[] }

function buildMonotoneCurve(keys: Keyframe[]): MonotoneCurve {
  const n = keys.length
  const xs = keys.map((k) => k[0])
  const ys = keys.map((k) => k[1])
  const d: number[] = []
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]))

  const ms = new Array(n).fill(0)
  ms[0] = d[0]
  ms[n - 1] = d[n - 2]
  for (let i = 1; i < n - 1; i++) {
    ms[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2
  }
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      ms[i] = 0
      ms[i + 1] = 0
      continue
    }
    const a = ms[i] / d[i]
    const b = ms[i + 1] / d[i]
    const s = a * a + b * b
    if (s > 9) {
      const tau = 3 / Math.sqrt(s)
      ms[i] = tau * a * d[i]
      ms[i + 1] = tau * b * d[i]
    }
  }
  return { xs, ys, ms }
}

function evalMonotoneCurve(curve: MonotoneCurve, t: number): number {
  const { xs, ys, ms } = curve
  const n = xs.length
  if (t <= xs[0]) return ys[0]
  if (t >= xs[n - 1]) return ys[n - 1]
  let i = 0
  while (i < n - 2 && t > xs[i + 1]) i++
  const h = xs[i + 1] - xs[i]
  const s = (t - xs[i]) / h
  const s2 = s * s
  const s3 = s2 * s
  const h00 = 2 * s3 - 3 * s2 + 1
  const h10 = s3 - 2 * s2 + s
  const h01 = -2 * s3 + 3 * s2
  const h11 = s3 - s2
  return h00 * ys[i] + h10 * h * ms[i] + h01 * ys[i + 1] + h11 * h * ms[i + 1]
}

// Small cache so repeated per-station sampling of the same keyframe table
// (called once per loft, ~dozens of times) doesn't rebuild the spline coeffs
// on every call.
const curveCache = new WeakMap<Keyframe[], MonotoneCurve>()

export function sampleKeyframes(keys: Keyframe[], t: number): number {
  let curve = curveCache.get(keys)
  if (!curve) {
    curve = buildMonotoneCurve(keys)
    curveCache.set(keys, curve)
  }
  return evalMonotoneCurve(curve, t)
}
