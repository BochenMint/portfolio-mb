/**
 * The paving landing's list glyph: one block of stone, seen at the angle the
 * scene lays them at. Its counterpart on the garden landing is a leaf — the
 * marker is the one piece of the shared sections each trade brings its own
 * version of, which is why it arrives as a prop rather than living in
 * `stage/`.
 */
export function StoneMarker() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-1 shrink-0">
      {/* A paver in plan, turned 20°: the top face in the accent, one edge a
          shade darker so it reads as a block rather than as a lozenge. */}
      <path d="M4.6 1.6 L12.4 4.2 L9.4 12.4 L1.6 9.8 Z" fill="var(--accent-mark)" />
      <path d="M9.4 12.4 L1.6 9.8 L2.1 8.4 L9.9 11.0 Z" fill="rgba(0,0,0,0.35)" />
    </svg>
  )
}
