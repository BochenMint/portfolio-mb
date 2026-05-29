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
    brushRadius: 0.26,
    brushVelocity: 0.22,
    dissipation: 0.978,
    waveFrequency: 0.2,
    vertexStrength: 0.3,
    distortStrength: 0.044,
    chromaticStrength: 0.012,
    introWaveStrength: 0.2,
    heightClamp: 0.62,
    velocityClamp: 0.95,
  },
  strong: {
    simResolution: 96,
    planeSegments: 64,
    brushRadius: 0.24,
    brushVelocity: 0.19,
    dissipation: 0.98,
    waveFrequency: 0.2,
    vertexStrength: 0.26,
    distortStrength: 0.038,
    chromaticStrength: 0.01,
    introWaveStrength: 0.16,
    heightClamp: 0.58,
    velocityClamp: 0.88,
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
