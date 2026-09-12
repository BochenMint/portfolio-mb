/**
 * The garden's list glyph: one leaf, used wherever a bullet would otherwise
 * be. Its counterpart on the paving landing is a block of stone — the marker
 * is the one piece of the shared sections each trade brings its own version
 * of, which is why it arrives as a prop rather than living in `stage/`.
 */
export function LeafMarker() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-1 shrink-0">
      <path d="M2 12C2 6 6 2 12 2C12 8 8 12 2 12Z" fill="var(--leaf)" />
    </svg>
  )
}
