import { site } from '../data/content'

export function Hero() {
  return (
    <section className="gradient-mesh relative flex min-h-[100dvh] flex-col justify-end overflow-hidden px-5 pb-20 pt-32 md:px-10 md:pb-28">
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 h-[min(80vw,520px)] w-[min(80vw,520px)] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(62,232,196,0.35) 0%, transparent 70%)',
          animation: 'pulse-glow 8s ease-in-out infinite',
        }}
        aria-hidden
      />
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 0.35; }
          50% { transform: translate(-50%, -4%) scale(1.08); opacity: 0.5; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="pulse-glow"] { animation: none !important; }
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-7xl">
        <p
          data-hero-fade
          className="text-muted mb-6 text-xs font-medium tracking-[0.28em] uppercase md:text-sm"
        >
          {site.role} · {site.location}
        </p>

        <h1 className="font-display text-[clamp(2.75rem,10vw,7.5rem)] leading-[0.92] font-bold tracking-tight">
          {site.headline.map((line) => (
            <span key={line} className="block overflow-hidden">
              <span data-hero-line className="inline-block">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-hero-fade
          className="text-balance mt-8 max-w-2xl text-base leading-relaxed text-cream/80 md:text-xl"
        >
          {site.subhead}
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap gap-4">
          <a
            href="#realizacje"
            className="group inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02]"
          >
            {site.ctaPrimary}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#kontakt"
            className="glass inline-flex rounded-full px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:border-mint/40"
          >
            {site.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  )
}
