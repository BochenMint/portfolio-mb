/**
 * The garden's scroll choreography, as fractions of the pinned section.
 *
 * One number drives everything: the visitor's progress through the stage.
 * The soil is bare at 0, the turf rolls are down and gone by ~0.55, and the
 * flower headline is fully open by ~0.93, which leaves the last stretch of the
 * pin for the finished bed to be read with the call to action under it.
 *
 * `GardenStage.tsx` hands the intro/outro fractions of this same table to
 * `stage/ScrollStage.tsx` as its `timeline` prop, so the copy fades in and
 * out on the same beats as the scene rather than on numbers of its own.
 */
export const T = {
  /** Intro copy is fully visible until here, gone by `introOut`. */
  introHold: 0.025,
  introOut: 0.075,
  /** First roll starts moving. */
  rollStart: 0.05,
  /** How long one strip takes from its first turn to leaving the frame. */
  rollSpan: 0.36,
  /** Latest a strip may start after the first one. */
  rollStagger: 0.12,
  /** The seams between strips close up over this window. */
  knit: [0.5, 0.64] as [number, number],
  /**
   * The shrubs go in: after the last roll is down and the seams have
   * started to close, and finishing just as the first flower breaks the
   * lawn. A garden is built in that order and the scroll now says so —
   * they used to be standing there from the first frame, which made them
   * scenery rather than work (Marcin 2026-09: "najpierw rozkładamy trawę,
   * potem pojawia się kilka nasadzeń").
   */
  plantStart: 0.52,
  plantEnd: 0.66,
  /** First sprout breaks the lawn. */
  flowerStart: 0.56,
  /** Left-to-right sweep of the planting across the words. */
  flowerSweep: 0.24,
  /** Interior flowers wait this long after the outline in the same place. */
  edgeLead: 0.035,
  /** One flower: sprout, bud, bloom. */
  flowerGrow: 0.075,
  /** Closing line and CTA. */
  outro: [0.88, 0.94] as [number, number],
} as const
