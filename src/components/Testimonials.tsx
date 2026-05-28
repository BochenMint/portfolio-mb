import { testimonials } from '../data/content'

export function Testimonials() {
  return (
    <section data-section className="border-line border-y bg-surface/30 px-5 py-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 data-reveal className="font-display text-center text-3xl font-bold md:text-left md:text-4xl">
          Co mówią po wdrożeniu
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote key={t.quote} data-reveal className="glass rounded-2xl p-8">
              <p className="text-lg leading-relaxed text-cream/90">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-6 border-t border-line pt-4">
                <cite className="not-italic">
                  <span className="font-display font-semibold">{t.author}</span>
                  <span className="text-muted block text-sm">
                    {t.role} · {t.year}
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
