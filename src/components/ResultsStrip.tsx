import { results, resultsDisclaimer } from '../data/content'

export function ResultsStrip() {
  return (
    <section
      aria-label="Szacunkowe efekty wdrożeń"
      className="border-b border-[var(--color-paper)]/12 py-12 md:py-14"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4 md:px-10 lg:px-16">
        {results.map((metric) => (
          <div key={metric.label} data-reveal>
            <p className="font-headline text-[clamp(2rem,5vw,3.25rem)] leading-none tracking-tight">
              {metric.value}
            </p>
            <p className="mt-3 text-sm leading-snug text-[var(--color-paper)]/85">{metric.label}</p>
            {metric.hint ? (
              <p className="text-muted mt-2 text-[11px] leading-relaxed">{metric.hint}</p>
            ) : null}
          </div>
        ))}
      </div>
      <p className="text-muted mx-auto mt-10 max-w-6xl px-6 text-[11px] leading-relaxed md:px-10 lg:px-16">
        {resultsDisclaimer}
      </p>
    </section>
  )
}
