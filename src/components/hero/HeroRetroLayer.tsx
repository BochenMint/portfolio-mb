import { lazy, Suspense, useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const RetroGrainCanvas = lazy(() =>
  import('./RetroGrainCanvas').then((m) => ({ default: m.RetroGrainCanvas })),
)

export function HeroRetroLayer() {
  const reduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced) return
    video.play().catch(() => {
      /* missing file or autoplay policy */
    })
  }, [reduced])

  return (
    <div className="hero-retro-layer pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="hero-retro-gradient absolute inset-0" />
      <div className="hero-retro-vignette absolute inset-0" />
      <div className="hero-retro-chroma hero-retro-chroma--l absolute inset-0" />
      <div className="hero-retro-chroma hero-retro-chroma--r absolute inset-0" />

      {!reduced ? (
        <Suspense fallback={<div className="hero-retro-grain-fallback absolute inset-0" />}>
          <RetroGrainCanvas />
        </Suspense>
      ) : (
        <div className="hero-retro-grain-fallback absolute inset-0" />
      )}

      {/*
        Drop Spline export: public/video/retro-hero.webm (or .mp4)
        Spline → Export → Video → loop, muted, playsinline
      */}
      <video
        ref={videoRef}
        className="hero-retro-video absolute inset-0 h-full w-full object-cover opacity-0"
        muted
        loop
        playsInline
        preload="none"
        poster=""
        aria-hidden
      >
        <source src="/video/retro-hero.webm" type="video/webm" />
        <source src="/video/retro-hero.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
