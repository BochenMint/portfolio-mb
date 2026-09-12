/**
 * The page's real content, between the garden (the hook) and the contact
 * form (the ask). Four groups — what you get, how it runs, what it costs,
 * what people actually ask — each its own <section> so the outline stays
 * sane, all on the same background as Contact/Footer so the garden's outro
 * hands over without a seam.
 */

type OfferBlock = { title: string; body: string }
type ProcessStep = { number: string; title: string; body: string }
type PriceTier = { name: string; price: string; desc: string }
type FaqItem = { q: string; a: string }

const offerBlocks: OfferBlock[] = [
  {
    title: 'Portfolio, które broni ceny',
    body: `Duże zdjęcia realizacji, galerie przed i po, opis zakresu i doboru roślin. Klient widzi Waszą robotę, zanim zadzwoni — i przychodzi na rozmowę z innym nastawieniem.`,
  },
  {
    title: 'Oferta rozpisana po ludzku',
    body: `Projekt, realizacja, pielęgnacja: co wchodzi w zakres, jak wygląda współpraca i czego nie robicie. Połowa zapytań odpada właśnie na tym, że tego nigdzie nie było.`,
  },
  {
    title: 'Formularz, który odsiewa',
    body: `Metraż, lokalizacja, termin i budżet zebrane w jednym kroku. Dostajesz zapytanie, z którym da się od razu pracować, zamiast „ile kosztuje ogród?".`,
  },
  {
    title: 'Widoczność tam, gdzie pracujecie',
    body: `Strona szybka na telefonie i opisana tak, żeby Google i modele AI wiedziały, w jakiej okolicy działacie i co dokładnie robicie.`,
  },
]

const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Rozmowa, 20 minut',
    body: `Pokazujesz realizacje i mówisz, komu chcesz sprzedawać. Wychodzę z tego z zakresem i widełkami — bez prezentacji i bez zobowiązania.`,
  },
  {
    number: '02',
    title: 'Projekt i wdrożenie',
    body: `Typowa strona pracowni to 2–4 tygodnie od kompletu materiałów. Postęp oglądasz na żywym podglądzie, nie w raporcie.`,
  },
  {
    number: '03',
    title: 'Start i opieka',
    body: `Przenoszę domenę, wpinam analitykę, zostaję na zmiany. Strona jest Wasza — kod i treści zostają u Was.`,
  },
]

const priceTiers: PriceTier[] = [
  {
    name: 'Wizytówka z formularzem',
    price: 'od 2 000 PLN',
    desc: 'jedna strona, realizacje, kontakt.',
  },
  {
    name: 'Strona z portfolio i lejkiem zapytań',
    price: 'od 8 000 PLN',
    desc: 'wiele podstron, panel do dodawania realizacji, integracje.',
  },
]

const faqItems: FaqItem[] = [
  {
    q: 'Czy przenosicie treści i zdjęcia ze starej strony?',
    a: `Tak. Przenoszę to, co działa, resztę przepisujemy — zwykle okazuje się, że najlepsze zdjęcia leżały poza stroną.`,
  },
  {
    q: 'Ile trwa wdrożenie?',
    a: `Typowa strona pracowni: 2–4 tygodnie od momentu, w którym mam komplet zdjęć i opisów. Sam projekt graficzny widzisz w pierwszym tygodniu.`,
  },
  {
    q: 'Czy będę mógł sam dodawać realizacje?',
    a: `Tak. Dodawanie projektów, zdjęć i opisów odbywa się w panelu, bez znajomości kodu i bez dzwonienia do mnie.`,
  },
  {
    q: 'Mam zdjęcia tylko z telefonu. To wystarczy?',
    a: `Da się z tym pracować i często tak zaczynamy. Ale jedna porządna sesja z gotowego ogrodu zwraca się na stronie szybciej niż cokolwiek innego.`,
  },
  {
    q: 'Pracujesz tylko w Polsce?',
    a: `Nie. Pracuję zdalnie, po polsku i po angielsku — lokalizacja pracowni nie ma znaczenia dla współpracy.`,
  },
]

/** Same leaf glyph as Contact's bullet list — kept local, same as there. */
function LeafMarker() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-1 shrink-0">
      <path d="M2 12C2 6 6 2 12 2C12 8 8 12 2 12Z" fill="var(--leaf)" />
    </svg>
  )
}

const cardStyle = { background: 'var(--moss-900)', borderColor: 'rgba(244, 237, 220, 0.14)' }
const sectionBg = { background: 'var(--moss-950)' }

export function Offer() {
  return (
    <>
      <section id="oferta" style={sectionBg} className="px-5 pt-24 pb-16 md:px-10 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Oferta</p>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl">Co dostajesz</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-12">
            {offerBlocks.map((block) => (
              <div key={block.title} className="flex gap-4">
                <LeafMarker />
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--cream)]">{block.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--cream-dim)]">{block.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proces" style={sectionBg} className="px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="hairline" />
          <div className="mt-16 md:mt-20">
            <p className="eyebrow">Proces</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl">Jak to działa</h2>
            <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {processSteps.map((step) => (
                <div key={step.title} className="flex gap-4">
                  <span aria-hidden className="offer-step-num">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[var(--cream)]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--cream-dim)]">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="inwestycja" style={sectionBg} className="px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="hairline" />
          <div className="mt-16 md:mt-20">
            <p className="eyebrow">Inwestycja</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl">Ile to kosztuje</h2>
            <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-[var(--cream-dim)]">
              Wycenę podaję po rozmowie, bez ukrytych pozycji. Punkt wyjścia zależy od tego, ile strona ma robić.
            </p>

            <div style={cardStyle} className="mt-8 rounded-2xl border px-6 md:px-8">
              {priceTiers.map((tier, i) => (
                <div key={tier.name}>
                  {i > 0 && <div className="hairline" />}
                  <div className="price-ladder-row">
                    <div className="price-ladder-heading">
                      <span className="price-ladder-name">{tier.name}</span>
                      <span className="price-ladder-value">{tier.price}</span>
                    </div>
                    <p className="price-ladder-desc">{tier.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" style={sectionBg} className="px-5 pt-16 pb-24 md:px-10 md:pt-20 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="hairline" />
          <div className="mt-16 md:mt-20">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl">
              Pytania, które słyszę najczęściej
            </h2>

            <div style={cardStyle} className="mt-8 rounded-2xl border">
              {faqItems.map((item, i) => (
                <div key={item.q}>
                  {i > 0 && <div className="hairline" />}
                  <details className="group px-6 py-6 md:px-8">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                      <span className="font-display text-base font-semibold text-[var(--cream)] md:text-lg">
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        className="relative shrink-0 text-2xl font-light text-[var(--leaf)] transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--cream-dim)]">{item.a}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
