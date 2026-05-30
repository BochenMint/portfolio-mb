import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react'

const Spline = lazy(() =>
  import('@splinetool/react-spline').then((m) => ({ default: m.default })),
)

const LOAD_TIMEOUT_MS = 18_000

export type SplineEmbedProps = {
  sceneUrl?: string
  className?: string
  /** Three.js / CSS fallback when URL missing or Spline fails */
  fallback: ReactNode
}

export function SplineEmbed({ sceneUrl, className = '', fallback }: SplineEmbedProps) {
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

  return (
    <div className={`relative h-full w-full ${className}`} data-spline-embed={sceneUrl}>
      {status === 'loading' ? (
        <div className="absolute inset-0 z-[1]" aria-hidden>
          {fallback}
        </div>
      ) : null}
      <Suspense fallback={fallback}>
        <Spline
          scene={sceneUrl}
          className="absolute inset-0 h-full w-full [&_canvas]:!h-full [&_canvas]:!w-full"
          onLoad={onLoad}
        />
      </Suspense>
    </div>
  )
}
