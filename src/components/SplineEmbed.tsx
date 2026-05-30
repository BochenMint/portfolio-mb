import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react'

const Spline = lazy(() =>
  import('@splinetool/react-spline').then((m) => ({ default: m.default })),
)

const LOAD_TIMEOUT_MS = 18_000

export type SplineEmbedProps = {
  sceneUrl?: string
  /** Statyczny poster (mobile / timeout) */
  posterUrl?: string
  className?: string
  fallback: ReactNode
}

export function SplineEmbed({
  sceneUrl,
  posterUrl,
  className = '',
  fallback,
}: SplineEmbedProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    sceneUrl ? 'loading' : 'error',
  )

  const onLoad = useCallback(() => setStatus('ready'), [])

  useEffect(() => {
    if (!sceneUrl) {
      setStatus('error')
      return
    }
    setStatus('loading')
    const timer = window.setTimeout(() => {
      setStatus((s) => (s === 'loading' ? 'error' : s))
    }, LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [sceneUrl])

  if (!sceneUrl || status === 'error') {
    return <>{fallback}</>
  }

  const showPosterUnder = status === 'loading' && posterUrl

  return (
    <div
      className={`spline-embed relative h-full w-full ${className}`}
      data-spline-embed={sceneUrl}
      data-spline-status={status}
    >
      {showPosterUnder ? (
        <img
          src={posterUrl}
          alt=""
          className="spline-embed-poster absolute inset-0 z-0 h-full w-full object-cover object-center opacity-90"
          decoding="async"
          aria-hidden
        />
      ) : null}

      {status === 'loading' ? (
        <div className="spline-embed-skeleton absolute inset-0 z-[1] animate-pulse bg-[var(--color-ink)]/40" aria-hidden>
          {fallback}
        </div>
      ) : null}

      <Suspense fallback={fallback}>
        <Spline
          scene={sceneUrl}
          className={`spline-embed-canvas absolute inset-0 z-[2] h-full w-full transition-opacity duration-700 ${
            status === 'ready' ? 'opacity-100' : 'opacity-0'
          } [&_canvas]:!h-full [&_canvas]:!w-full`}
          onLoad={onLoad}
        />
      </Suspense>
    </div>
  )
}
