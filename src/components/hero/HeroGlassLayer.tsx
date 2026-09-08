import { HeroBackground } from './HeroBackground'

/**
 * Glassmorphism — CSS-first. WebGL `transmission` looked muddy on the dark page;
 * backdrop-filter frosted cards over soft, blurred gradient blobs is the canonical,
 * crisp medium for glassmorphism. A published Spline scene still overrides this
 * when VITE_SPLINE_GLASS_URL is set (HeroBackground → 'spline' mode).
 */
function GlassScene() {
  return (
    <div className="hero-glass-stage absolute inset-0 overflow-hidden" aria-hidden>
      {/* soft, heavily-blurred colour blobs */}
      <div className="hero-glass-blob hero-glass-blob--1" />
      <div className="hero-glass-blob hero-glass-blob--2" />
      <div className="hero-glass-blob hero-glass-blob--3" />
      <div className="hero-glass-blob hero-glass-blob--4" />
      {/* frosted glass cards (backdrop-blur the blobs behind) */}
      <div className="hero-glass-card hero-glass-card--1" />
      <div className="hero-glass-card hero-glass-card--2" />
      <div className="hero-glass-card hero-glass-card--3" />
    </div>
  )
}

export function HeroGlassLayer() {
  const scene = <GlassScene />
  return (
    <HeroBackground
      variant="glass"
      layerClassName="hero-glass-layer pointer-events-none absolute inset-0 z-0 overflow-hidden"
      webglFallback={scene}
      cssFallback={scene}
    />
  )
}
