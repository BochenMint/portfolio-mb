import { process } from '../data/content'

export function Process() {
  return (
    <section className="section-pad editorial-rule border-t">
      <div className="mx-auto max-w-[1400px]">
        <p data-reveal className="section-label">
          06 — Jak to wygląda
        </p>
        <h2 data-reveal className="font-display mt-4 text-3xl md:text-4xl">
          Proces bez ceremonii
        </h2>

        <ol className="mt-14 grid gap-0 md:grid-cols-2 lg:grid-cols-4">
          {process.map((step) => (
            <li key={step.step} data-reveal className="editorial-rule border-t p-6 md:border-l md:first:border-l-0">
              <span className="font-display text-accent text-2xl italic">{step.step}</span>
              <h3 className="mt-4 font-medium">{step.title}</h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
