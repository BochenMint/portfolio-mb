import { site } from '../data/content'
import { MagneticButton } from './MagneticButton'

function AccentWords({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <span className="mt-2 block overflow-hidden text-[clamp(1.25rem,4vw,2.25rem)] font-medium text-mint">
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="mr-[0.25em] inline-block overflow-hidden">
          <span data-hero-word className="inline-block">
            {word}
          </span>
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const ctaHref = site.calendly || '#kontakt'

  return (
    <section className="gradient-mesh relative flex min-h-[100dvh] flex-col justify-end overflow-hidden px-5 pb-24 pt-28 md:px-10 md:pb-32">
      <div
        className="pointer-events-none absolute top-[15%] left-1/2 h-[min(90vw,560px)] w-[min(90vw,560px)] -translate-x-1/2 rounded-full opacity-50 blur-3xl motion-safe:animate-pulse-slow"
        style={{
          background:
            'radial-gradient(circle, rgba(62,232,196,0.28) 0%, rgba(201,169,98,0.08) 45%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div data-hero-fade className="mb-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-[10px] font-semibold tracking-wide text-mint uppercase md:text-xs">
            {site.icpBadge}
          </span>
          <span className="text-muted text-xs tracking-wide uppercase">{site.role}</span>
        </div>

        <h1 className="font-display max-w-5xl text-[clamp(2.5rem,8.5vw,6.5rem)] leading-[0.95] font-bold tracking-tight">
          {site.headline.map((line) => (
            <span key={line} className="block overflow-hidden">
              <span data-hero-line className="inline-block">
                {line}
              </span>
            </span>
          ))}
          <AccentWords text={site.headlineAccent} />
        </h1>

        <p
          data-hero-fade
          className="text-balance mt-8 max-w-2xl text-base leading-relaxed text-cream/85 md:text-xl"
        >
          {site.subhead}
        </p>

        <p data-hero-fade className="text-muted mt-4 text-sm">
          {site.responseTime} · {site.location}
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton
            href={ctaHref}
            className="group rounded-full bg-mint px-8 py-4 text-sm font-bold text-ink shadow-[0_0_40px_rgba(62,232,196,0.25)]"
            external={!!site.calendly}
          >
            {site.ctaPrimary}
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </MagneticButton>
          <MagneticButton
            href="#case-studies"
            className="glass rounded-full px-8 py-4 text-sm font-medium text-cream hover:border-mint/40"
          >
            {site.ctaSecondary}
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
