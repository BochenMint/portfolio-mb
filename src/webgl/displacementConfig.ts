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
  /** Subtle RGB split from displacement gradient (keep low) */
  chromaticStrength: number
  introWaveStrength: number
  /** Simulation height clamp (prevents blow-up / NaN) */
  heightClamp: number
  /** Simulation velocity clamp */
  velocityClamp: number
}

/**
 * Premium fluid ripple — fromanother.love character.
 * Wide soft brush, slow wave, low vertex + micro chroma.
 */
export const DISPLACEMENT_LEVEL: Record<DisplacementLevel, DisplacementOptions> = {
  hero: {
    simResolution: 128,
    planeSegments: 80,
    brushRadius: 0.36,
    brushVelocity: 0.34,
    dissipation: 0.978,
    waveFrequency: 0.172,
    vertexStrength: 0.26,
    distortStrength: 0.058,
    chromaticStrength: 0.0055,
    introWaveStrength: 0.12,
    heightClamp: 0.52,
    velocityClamp: 0.9,
  },
  strong: {
    simResolution: 96,
    planeSegments: 64,
    brushRadius: 0.34,
    brushVelocity: 0.32,
    dissipation: 0.98,
    waveFrequency: 0.168,
    vertexStrength: 0.24,
    distortStrength: 0.054,
    chromaticStrength: 0.005,
    introWaveStrength: 0.1,
    heightClamp: 0.48,
    velocityClamp: 0.84,
  },
  subtle: {
    simResolution: 64,
    planeSegments: 48,
    brushRadius: 0.24,
    brushVelocity: 0.13,
    dissipation: 0.986,
    waveFrequency: 0.14,
    vertexStrength: 0.14,
    distortStrength: 0.026,
    chromaticStrength: 0.003,
    introWaveStrength: 0.08,
    heightClamp: 0.36,
    velocityClamp: 0.62,
  },
}
