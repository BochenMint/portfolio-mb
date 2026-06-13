import { testimonials } from '../data/content'

export function Testimonials() {
  return (
    <section data-section className="border-line border-t bg-surface/40 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <p data-reveal className="text-mint text-xs font-semibold tracking-[0.3em] uppercase">
          Głosy z produkcji
        </p>
        <h2 data-reveal className="font-display mt-4 max-w-2xl text-4xl font-bold md:text-5xl">
          Co zmienia się po wdrożeniu
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.quote}
              data-reveal
              className="glass flex flex-col rounded-3xl p-8"
            >
              <span aria-hidden className="font-display text-mint text-5xl leading-none">
                „
              </span>
              <p className="mt-2 flex-1 text-base leading-relaxed text-cream/90">{t.quote}</p>
              <footer className="text-muted mt-6 text-sm">
                <span className="font-medium text-cream">{t.author}</span>
                <span className="block">{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>

        <p data-reveal className="text-muted mt-8 text-xs">
          Cytaty poglądowe oparte na realnych wdrożeniach. Imienne referencje udostępniam na
          życzenie — po zgodzie klienta.
        </p>
      </div>
    </section>
  )
}
