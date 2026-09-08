import { lazy, Suspense, useCallback } from 'react'
import { useLocale } from '../i18n'
import { getArchiveUi } from '../i18n/archive-ui'
import { site, proofProducts } from '../i18n/live'
import { useCoarsePointer } from '../hooks/useCoarsePointer'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useWebGLCapable } from '../hooks/useWebGLCapable'
import { MagneticButton } from '../components/MagneticButton'

const HeroWebGLCanvas = lazy(() =>
  import('../components/hero/HeroWebGLCanvas').then((m) => ({ default: m.HeroWebGLCanvas })),
)

function PleatsCss() {
  return <div className="v3-pleats-css" aria-hidden />
}

export function PleatedHero() {
  const { locale } = useLocale()
  const ui = getArchiveUi(locale)
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()
  const { capable } = useWebGLCapable()

  const createScene = useCallback(
    (canvas: HTMLCanvasElement) =>
      import('./pleatedScene').then((m) =>
        m.createPleatedScene(canvas, { reducedMotion: reduced, lowPower: coarse }),
      ),
    [reduced, coarse],
  )

  const ctaHref = site.calendly || '#kontakt'

  return (
    <section id="top" className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      {/* Scena */}
      <div className="absolute inset-0 z-0" aria-hidden>
        {capable ? (
          <Suspense fallback={<PleatsCss />}>
            <HeroWebGLCanvas className="h-full w-full" createScene={createScene} fallback={<PleatsCss />} />
          </Suspense>
        ) : (
          <PleatsCss />
        )}
      </div>

      {/* Treść — centrowana, edytorialna */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pt-28 pb-20 text-center md:px-8">
        <span className="v3-pill v3-fade-up" style={{ animationDelay: '0.05s' }}>
          <span className="v3-pill-dot" aria-hidden />
          <span className="sm:hidden">{site.icpBadgeShort}</span>
          <span className="hidden sm:inline">{site.icpBadge}</span>
        </span>

        <h1 className="v3-display mt-8 text-[clamp(2.7rem,7.6vw,6.2rem)] text-balance">
          <span className="v3-hero-line">
            <span>{ui.v3HeroLine1}</span>
          </span>
          <span className="v3-hero-line">
            <span>
              {ui.v3HeroLine2Before}
              <em className="v3-serif-accent">{ui.v3HeroLine2Em}</em>
              {ui.v3HeroLine2After}
            </span>
          </span>
        </h1>

        <p
          className="v3-fade-up mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[var(--color-paper)]/82 md:text-lg"
          style={{ animationDelay: '0.3s' }}
        >
          {site.valueProp}
        </p>

        <div
          className="v3-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: '0.42s' }}
        >
          <MagneticButton
            href={ctaHref}
            className="btn-accent text-base"
            external={Boolean(site.calendly)}
          >
            {site.ctaPrimary}
            <span aria-hidden>→</span>
          </MagneticButton>
          <a href="#realizacje" className="btn-soft border-[var(--color-paper)]/25">
            Zobacz realizacje ↓
          </a>
        </div>
      </div>

      {/* Pasek zaufania — produkty w produkcji */}
      <div
        className="v3-fade-up relative z-10 border-t border-[var(--color-paper)]/12 bg-[var(--color-ink)]/35 backdrop-blur-sm"
        style={{ animationDelay: '0.55s' }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-5 py-5 md:justify-between md:px-8">
          <span className="v3-label">W produkcji</span>
          {proofProducts.map((p) =>
            p.live && p.url ? (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-grotesk text-sm font-medium text-[var(--color-paper)]/55 transition-colors hover:text-accent"
              >
                {p.name} <span aria-hidden className="text-accent/70">↗</span>
              </a>
            ) : (
              <span key={p.name} className="font-grotesk text-sm font-medium text-[var(--color-paper)]/35">
                {p.name}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
