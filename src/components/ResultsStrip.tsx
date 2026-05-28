import { results } from '../data/content'

export function ResultsStrip() {
  return (
    <section data-stats data-section className="px-5 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
        {results.map((r) => (
          <div
            key={r.label}
            data-stat
            className="glass rounded-2xl p-5 text-center md:p-6 md:text-left"
          >
            <p className="font-display text-3xl font-bold text-mint md:text-4xl">
              {r.value}
              {r.suffix && <span className="text-muted text-lg">{r.suffix}</span>}
            </p>
            <p className="text-muted mt-2 text-xs leading-snug md:text-sm">{r.label}</p>
          </div>
        ))}
      </div>
      <p data-reveal className="text-muted mx-auto mt-6 max-w-7xl text-center text-[10px] md:text-left">
        * Przykładowe KPI z wdrożeń — doprecyzujemy na audycie pod Twój proces.
      </p>
    </section>
  )
}
