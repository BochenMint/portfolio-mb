export function ScrollProgress() {
  return (
    <div className="fixed top-0 right-0 left-0 z-[60] h-[2px] origin-left bg-white/5">
      <div
        data-progress-bar
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-mint to-gold"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden
      />
    </div>
  )
}
