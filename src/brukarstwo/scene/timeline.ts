/**
 * The paving contractor's scroll choreography, as fractions of the pinned
 * section — same shape as `krajobraz/scene/timeline.ts`, tuned to this
 * trade's own beats (the brief's "Scene choreography").
 *
 * One number drives everything, same as the garden: the bed is screeded and
 * bare at 0, every course is down by ~0.55, the headline's stones swap while
 * the joints are still being sanded, and the last stretch of the pin is left
 * for the finished drive to be read with the call to action under it.
 *
 * `BrukarstwoStage.tsx` hands the intro/outro fractions of this same table to
 * `stage/ScrollStage.tsx` as its `timeline` prop, so the copy fades in and out
 * on the same beats as the scene rather than on numbers of its own.
 */
export const T = {
  /** Intro copy is fully visible until here, gone by `introOut`. */
  introHold: 0.03,
  introOut: 0.1,
  /** Courses lay themselves far-to-near across this window. */
  layStart: 0.05,
  layEnd: 0.55,
  /** The headline's inlay — small setts, both ink and field-grey — drops in
   *  across this window, in the sweep's left-to-right order. */
  inlayStart: 0.56,
  inlayEnd: 0.93,
  /** The joint-sand pass sweeps left-to-right across the finished field. */
  sandStart: 0.6,
  sandEnd: 0.75,
  /** Closing line and CTA. */
  outro: [0.88, 0.94] as [number, number],
} as const
