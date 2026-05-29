export type DisplacementLevel = 'hero' | 'strong' | 'subtle'

export type DisplacementOptions = {
  simResolution: number
  planeSegments: number
  brushRadius: number
  brushVelocity: number
  dissipation: number
  vertexStrength: number
  distortStrength: number
  introWaveStrength: number
}

export const DISPLACEMENT_LEVEL: Record<DisplacementLevel, DisplacementOptions> = {
  hero: {
    simResolution: 128,
    planeSegments: 80,
    brushRadius: 0.2,
    brushVelocity: 0.55,
    dissipation: 0.982,
    vertexStrength: 42,
    distortStrength: 0.095,
    introWaveStrength: 0.35,
  },
  strong: {
    simResolution: 96,
    planeSegments: 64,
    brushRadius: 0.17,
    brushVelocity: 0.46,
    dissipation: 0.985,
    vertexStrength: 32,
    distortStrength: 0.075,
    introWaveStrength: 0.28,
  },
  subtle: {
    simResolution: 64,
    planeSegments: 48,
    brushRadius: 0.14,
    brushVelocity: 0.34,
    dissipation: 0.988,
    vertexStrength: 22,
    distortStrength: 0.05,
    introWaveStrength: 0.18,
  },
}
