import { pricing, services } from '../data/content'

export function Services() {
  return (
    <section id="uslugi" className="section-pad editorial-rule border-t">
      <div className="mx-auto max-w-[1400px]">
        <p data-reveal className="section-label">
          05 — Zakres
        </p>
        <h2 data-reveal className="font-display mt-4 max-w-3xl text-4xl md:text-5xl">
          Trzy obszary, w których pracuję najczęściej
        </h2>

        <div className="mt-16 space-y-0">
          {services.map((service, i) => (
            <article
              key={service.title}
              data-service-row
              data-reveal
              className="editorial-rule grid gap-6 border-t py-10 md:grid-cols-12 md:gap-10"
            >
              <div className="md:col-span-4">
                <span className="text-muted text-xs">0{i + 1}</span>
                <h3 className="font-display mt-2 text-2xl md:text-3xl">{service.title}</h3>
                <p className="text-accent mt-2 text-sm">{service.subtitle}</p>
              </div>
              <ul className="md:col-span-8 md:pt-6">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="border-rule flex gap-4 border-b py-4 text-sm leading-relaxed last:border-b-0"
                  >
                    <span className="text-accent shrink-0">—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div id="inwestycja" data-reveal className="mt-24">
          <p className="section-label">Inwestycja</p>
          <h3 className="font-display mt-4 text-3xl">Orientacyjne widełki</h3>
          <p className="text-muted mt-3 max-w-xl text-sm">
            Dokładna wycena po rozmowie — liczy się zakres i ryzyko, nie liczba podstron.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {pricing.map((tier) => (
              <div
                key={tier.name}
                className={`border-rule border p-6 ${tier.highlight ? 'bg-surface' : ''}`}
              >
                <p className="text-muted text-xs uppercase tracking-widest">{tier.name}</p>
                <p className="font-display mt-2 text-2xl">{tier.from}</p>
                <p className="text-muted mt-3 text-sm">{tier.description}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-accent">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
