import { services } from '../data/content'

export function Services() {
  return (
    <section id="uslugi" data-section className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p data-reveal className="text-mint text-xs font-semibold tracking-[0.3em] uppercase">
            Dla kogo pracuję
          </p>
          <h2 data-reveal className="font-display mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Technologia, która{' '}
            <span className="bg-gradient-to-r from-mint to-gold bg-clip-text text-transparent">
              zarabia
            </span>
            , nie tylko wygląda.
          </h2>
          <p data-reveal className="text-muted mt-6 text-lg leading-relaxed">
            Wspieram właścicieli małych firm — apartamenty, floty, biura rachunkowe, usługi lokalne.
            Nie sprzedaję „strony za 3 dni”. Buduję produkty, które trzymają standard Twojej marki.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <article
              key={service.title}
              data-reveal
              className="glass group rounded-3xl p-8 transition-colors hover:border-mint/25"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <span className="font-display text-muted text-5xl font-bold opacity-20">
                0{i + 1}
              </span>
              <h3 className="font-display mt-4 text-2xl font-bold">{service.title}</h3>
              <p className="text-mint mt-2 text-sm">{service.subtitle}</p>
              <ul className="mt-6 space-y-3">
                {service.points.map((point) => (
                  <li key={point} className="text-cream/75 flex gap-2 text-sm leading-relaxed">
                    <span className="text-mint mt-1 shrink-0">→</span>
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
