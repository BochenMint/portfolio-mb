export function ScrollProgress() {
  return (
    <div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-px origin-left bg-rule"
      aria-hidden
    >
      <div
        data-progress-bar
        className="bg-accent h-full w-full origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
