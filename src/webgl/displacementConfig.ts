export type DisplacementLevel = 'hero' | 'strong' | 'subtle'

export type DisplacementOptions = {
  simResolution: number
  planeSegments: number
  brushRadius: number
  brushVelocity: number
  dissipation: number
  /** Wave neighbour coupling (lower = slower, wider ripples) */
  waveFrequency: number
  /** Max Z offset on display plane (world units) */
  vertexStrength: number
  /** UV refract multiplier in fragment shader */
  distortStrength: number
  /** Subtle RGB split from displacement gradient */
  chromaticStrength: number
  introWaveStrength: number
  /** Simulation height clamp (prevents blow-up / NaN) */
  heightClamp: number
  /** Simulation velocity clamp */
  velocityClamp: number
}

/** Premium fluid ripple — tuned toward fromanother.love (~90% character) */
export const DISPLACEMENT_LEVEL: Record<DisplacementLevel, DisplacementOptions> = {
  hero: {
    simResolution: 128,
    planeSegments: 72,
    brushRadius: 0.28,
    brushVelocity: 0.28,
    dissipation: 0.976,
    waveFrequency: 0.21,
    vertexStrength: 0.36,
    distortStrength: 0.056,
    chromaticStrength: 0.015,
    introWaveStrength: 0.22,
    heightClamp: 0.68,
    velocityClamp: 1.05,
  },
  strong: {
    simResolution: 96,
    planeSegments: 64,
    brushRadius: 0.26,
    brushVelocity: 0.24,
    dissipation: 0.978,
    waveFrequency: 0.21,
    vertexStrength: 0.32,
    distortStrength: 0.048,
    chromaticStrength: 0.013,
    introWaveStrength: 0.18,
    heightClamp: 0.64,
    velocityClamp: 0.98,
  },
  subtle: {
    simResolution: 64,
    planeSegments: 48,
    brushRadius: 0.2,
    brushVelocity: 0.15,
    dissipation: 0.982,
    waveFrequency: 0.18,
    vertexStrength: 0.2,
    distortStrength: 0.03,
    chromaticStrength: 0.008,
    introWaveStrength: 0.12,
    heightClamp: 0.5,
    velocityClamp: 0.75,
  },
}
