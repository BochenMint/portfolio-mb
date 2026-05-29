export type DisplacementLevel = 'hero' | 'strong' | 'subtle'

export type DisplacementOptions = {
  simResolution: number
  planeSegments: number
  brushRadius: number
  brushVelocity: number
  dissipation: number
  /** Max Z offset on display plane (world units) */
  vertexStrength: number
  /** UV refract multiplier in fragment shader */
  distortStrength: number
  introWaveStrength: number
  /** Simulation height clamp (prevents blow-up / NaN) */
  heightClamp: number
  /** Simulation velocity clamp */
  velocityClamp: number
}

/** ~80% of fromanother look with stable, clamped simulation */
export const DISPLACEMENT_LEVEL: Record<DisplacementLevel, DisplacementOptions> = {
  hero: {
    simResolution: 128,
    planeSegments: 64,
    brushRadius: 0.18,
    brushVelocity: 0.32,
    dissipation: 0.968,
    vertexStrength: 0.38,
    distortStrength: 0.062,
    introWaveStrength: 0.28,
    heightClamp: 0.72,
    velocityClamp: 1.2,
  },
  strong: {
    simResolution: 96,
    planeSegments: 56,
    brushRadius: 0.16,
    brushVelocity: 0.26,
    dissipation: 0.972,
    vertexStrength: 0.3,
    distortStrength: 0.05,
    introWaveStrength: 0.22,
    heightClamp: 0.65,
    velocityClamp: 1.0,
  },
  subtle: {
    simResolution: 64,
    planeSegments: 48,
    brushRadius: 0.14,
    brushVelocity: 0.2,
    dissipation: 0.976,
    vertexStrength: 0.22,
    distortStrength: 0.036,
    introWaveStrength: 0.16,
    heightClamp: 0.55,
    velocityClamp: 0.85,
  },
}
