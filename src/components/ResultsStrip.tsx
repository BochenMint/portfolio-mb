import { projects } from '../data/content'

const results = projects.map((p) => ({
  label: p.stat.label,
  value: p.stat.value,
  suffix: '',
}))

export function ResultsStrip() {
  return (
    <section data-stats data-section className="section-pad">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
        {results.map((r) => (
          <div
            key={r.label}
            data-stat
            className="border-rule border p-5 text-center md:p-6 md:text-left"
          >
            <p className="font-display text-accent text-3xl md:text-4xl">
              {r.value}
              {r.suffix && <span className="text-muted text-lg">{r.suffix}</span>}
            </p>
            <p className="text-muted mt-2 text-xs leading-snug md:text-sm">{r.label}</p>
          </div>
        ))}
      </div>
      <p data-reveal className="text-muted mx-auto mt-6 max-w-[1400px] text-center text-[10px] md:text-left">
        * Przykładowe KPI z wdrożeń — doprecyzujemy na audycie pod Twój proces.
      </p>
    </section>
  )
}
