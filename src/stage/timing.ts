/**
 * Progress maths shared by every scene mounted on `ScrollStage`: easing, the
 * smooth-step used for shader thresholds, and the "window" a fade-in or
 * fade-out is built from — a `[start, end]` pair of scroll-progress values
 * with a linear ramp between them, clamped flat outside it.
 */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export function smoothstep(a: number, b: number, x: number): number {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Sine in-out: a roll leaves standing still and arrives standing still. */
export function easeInOut(t: number): number {
  const c = clamp01(t)
  return 0.5 - 0.5 * Math.cos(Math.PI * c)
}

/** A `[start, end]` pair of progress values marking one leg of the timeline. */
export type Window = readonly [number, number]

/** Linear progress across a window: 0 before it, 1 after — the shape every
 *  overlay fade over the pinned scroll is built from. */
export function leg(p: number, [a, b]: Window): number {
  return clamp01((p - a) / (b - a))
}
