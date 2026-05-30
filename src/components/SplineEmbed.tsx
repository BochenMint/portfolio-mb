/**
 * Stub for future @splinetool/react-spline scenes.
 * Pass `sceneUrl` after Export → Code from a .spline file (see docs/SPLINE-INTEGRATION.md).
 */
export type SplineEmbedProps = {
  sceneUrl?: string
  className?: string
  /** When true, reserves layout space even without a URL (dev placeholder). */
  showPlaceholder?: boolean
}

export function SplineEmbed({ sceneUrl, className = '', showPlaceholder = false }: SplineEmbedProps) {
  if (!sceneUrl && !showPlaceholder) return null

  return (
    <div
      className={className}
      data-spline-embed={sceneUrl ?? 'pending'}
      aria-hidden={!sceneUrl}
    >
      {sceneUrl ? (
        <p className="sr-only">Spline scene: {sceneUrl}</p>
      ) : (
        <p className="pointer-events-none text-[10px] tracking-widest text-[var(--color-paper)]/30 uppercase">
          Spline URL pending
        </p>
      )}
      {/*
        import Spline from '@splinetool/react-spline'
        return <Spline scene={sceneUrl} />
      */}
    </div>
  )
}
