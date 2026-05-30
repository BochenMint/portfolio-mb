import type { ReactNode } from 'react'
import { getHeroPosterUrl } from '../../config/heroPosters'
import { getSplineSceneUrl } from '../../config/splineScenes'
import type { HeroVariant } from '../../lib/heroVariant'
import { useHeroBackgroundMode } from '../../hooks/useHeroBackgroundMode'
import { SplineEmbed } from '../SplineEmbed'

type HeroBackgroundProps = {
  variant: HeroVariant
  layerClassName: string
  webglFallback: ReactNode
  cssFallback: ReactNode
}

export function HeroBackground({
  variant,
  layerClassName,
  webglFallback,
  cssFallback,
}: HeroBackgroundProps) {
  const sceneUrl = getSplineSceneUrl(variant)
  const mode = useHeroBackgroundMode(Boolean(sceneUrl))
  const posterUrl = getHeroPosterUrl(variant)

  if (mode === 'poster') {
    return (
      <div className={layerClassName} aria-hidden>
        <img
          src={posterUrl}
          alt=""
          className="hero-poster absolute inset-0 h-full w-full object-cover object-center"
          decoding="async"
          fetchPriority="high"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="hero-poster-css-fallback absolute inset-0">{cssFallback}</div>
      </div>
    )
  }

  if (mode === 'css') {
    return (
      <div className={layerClassName} aria-hidden>
        {cssFallback}
      </div>
    )
  }

  if (mode === 'webgl') {
    return (
      <div className={layerClassName} aria-hidden>
        {webglFallback}
      </div>
    )
  }

  return (
    <div className={layerClassName} aria-hidden>
      <SplineEmbed
        sceneUrl={sceneUrl}
        posterUrl={posterUrl}
        className="absolute inset-0"
        fallback={webglFallback}
      />
    </div>
  )
}
