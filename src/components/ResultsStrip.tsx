import { results, resultsDisclaimer } from '../data/content'

export function ResultsStrip() {
  return (
    <section
      aria-label="Szacunkowe efekty wdrożeń"
      className="relative overflow-hidden border-b border-[var(--color-paper)]/10 py-16 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(245,165,36,0.12),transparent_28rem)]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
        <div data-reveal className="mb-8 grid gap-4 md:grid-cols-[0.86fr_1.14fr] md:items-end">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
              Efekt biznesowy
            </p>
            <h2 className="font-headline mt-3 text-[clamp(2.25rem,5vw,4.5rem)] leading-none tracking-tight">
              Liczby, które można obronić.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-paper)]/58 md:justify-self-end">
            To nie są anonimowe „case study 10x”. To orientacyjne zakresy do walidacji na audycie, spięte z konkretnymi produktami i procesami.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((metric, i) => (
            <div
              key={metric.label}
              data-reveal
              className={`group relative min-h-[220px] overflow-hidden rounded-[1.6rem] border p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/35 hover:bg-accent/[0.045] ${
                i === 0
                  ? 'border-accent/30 bg-accent/[0.07] sm:col-span-2 lg:col-span-1'
                  : 'border-[var(--color-paper)]/12 bg-[var(--color-paper)]/[0.035]'
              }`}
            >
              <span className="absolute right-5 top-5 font-mono text-[10px] tracking-[0.18em] text-[var(--color-paper)]/28" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>

              <p className="text-sunset font-headline text-[clamp(2.25rem,5vw,3.5rem)] leading-none tracking-tight tabular-nums">
                {metric.value}
              </p>

              {/* accent underline below value */}
              <div
                aria-hidden
                className="mt-3 h-px w-8"
                style={{
                  background: 'linear-gradient(90deg, var(--color-accent), transparent)',
                }}
              />

              <p className="font-mono mt-5 text-[11px] leading-snug tracking-wide text-[var(--color-paper)]/78">
                {metric.label}
              </p>

              {metric.hint ? (
                <p className="mt-4 text-[10px] leading-relaxed text-[var(--color-paper)]/42">{metric.hint}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <p className="relative mx-auto mt-8 max-w-6xl px-6 text-[11px] leading-relaxed text-[var(--color-paper)]/42 md:px-10 lg:px-16">
        {resultsDisclaimer}
      </p>
    </section>
  )
}
