import { results, site } from '../data/content'

export function About() {
  return (
    <section id="o-mnie" data-section className="section-pad editorial-rule border-t">
      <div className="mx-auto max-w-[1400px]">
        <p className="section-label reveal">02 — Kim jestem</p>

        <div className="mt-8 grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="font-display reveal mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-tight">
              {site.name}
              <span className="text-muted block text-2xl font-normal md:inline md:ml-2 md:text-3xl">
                · {site.brand}
              </span>
            </h2>

            <p className="reveal mt-8 text-lg leading-relaxed">
              Nie jestem agencją z działem handlowym i slajdami o „innowacji”. Jestem developerem-produktowcem:
              od pierwszej rozmowy po deploy — jedna osoba, jeden standard jakości.
            </p>
            <p className="text-muted reveal mt-5 leading-relaxed">
              Od lat buduję systemy, które zarabiają: rezerwacje apartamentów, faktury i JPK, floty
              wynajmu, agenci AI z logami. Jeśli Twój problem da się zmierzyć w PLN albo w godzinach
              zespołu — chętnie posłucham. Jeśli nie — powiem to w pierwszych dwudziestu minutach.
            </p>
            <p className="reveal font-hand text-accent mt-6 text-2xl md:text-3xl">
              {site.proofLine}
            </p>
          </div>

          <dl className="reveal border-rule grid gap-8 border-t pt-10 sm:grid-cols-2 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            {results.map((item) => (
              <div key={item.label}>
                <dt className="font-display text-accent text-4xl italic md:text-5xl">
                  {item.value}
                  {item.suffix}
                </dt>
                <dd className="text-muted mt-2 text-sm leading-snug">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
