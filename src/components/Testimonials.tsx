import { testimonials } from '../data/content'

export function Testimonials() {
  return (
    <section className="section-pad editorial-rule border-t">
      <div className="mx-auto max-w-[1400px]">
        <p data-reveal className="section-label text-center">Głosy z produkcji</p>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote key={t.quote} data-reveal>
              <p className="font-display text-2xl leading-snug italic md:text-3xl">
                „{t.quote}”
              </p>
              <footer className="text-muted mt-6 text-sm">
                — {t.author}, {t.role} · {t.year}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
