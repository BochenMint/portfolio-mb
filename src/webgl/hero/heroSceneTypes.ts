export type HeroSceneOptions = {
  reducedMotion: boolean
}

export type HeroScene = {
  setSize(w: number, h: number): void
  start(): void
  stop(): void
  dispose(): void
}

export function bindHeroPointer(
  root: HTMLElement,
  onMove: (nx: number, ny: number, active: boolean) => void,
): () => void {
  const onPointerMove = (e: PointerEvent) => {
    const rect = root.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) return
    const nx = (e.clientX - rect.left) / rect.width
    const ny = 1 - (e.clientY - rect.top) / rect.height
    onMove(nx, ny, true)
  }

  const onLeave = () => onMove(0.5, 0.5, false)

  root.addEventListener('pointermove', onPointerMove, { passive: true })
  root.addEventListener('pointerleave', onLeave)
  return () => {
    root.removeEventListener('pointermove', onPointerMove)
    root.removeEventListener('pointerleave', onLeave)
  }
}

export function getDpr(): number {
  return Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)
}
