/**
 * Everything the paving landing says below the stage.
 *
 * Same four sections as the garden's, same components out of
 * `stage/Sections.tsx` — the trade is what differs. The words are written
 * for someone who lays block paving for a living: metres, sub-base, joints,
 * and the question every one of their clients opens with. `brukarstwo.html`'s
 * FAQPage JSON-LD quotes the `faq` block below verbatim.
 */

import type { ContactContent, OfferContent } from '../stage/Sections'
import type { InquiryField } from '../stage/Inquiry'
import { site } from '../chrome/data/content'

export const offerContent: OfferContent = {
  offer: {
    eyebrow: 'Oferta',
    heading: 'Co dostajesz',
    blocks: [
      {
        title: 'Realizacje z metrażem i kosztem',
        body: `Zdjęcia podjazdów i tarasów z metrażem, rodzajem kostki i czasem realizacji. Klient sam sobie odpowiada na pytanie „ile to u mnie będzie kosztować", zanim zadzwoni.`,
      },
      {
        title: 'Zakres bez niedomówień',
        body: `Co robicie sami, a co podzlecacie: podbudowa, obrzeża, odwodnienie liniowe, cięcie, fugowanie. To pierwsza rzecz, o którą pyta inwestor, i pierwsza, której nie ma na stronach konkurencji.`,
      },
      {
        title: 'Formularz, który liczy zamiast pytać',
        body: `Metry, rodzaj kostki, dojazd i termin zebrane w jednym kroku. Zapytanie trafia do Ciebie z liczbami, a nie z pytaniem „ile za podjazd?".`,
      },
      {
        title: 'Widoczność w promieniu, w którym jeździcie',
        body: `Strona szybka na telefonie i opisana tak, żeby Google i modele AI wiedziały, w jakich miejscowościach pracujecie i czego się podejmujecie.`,
      },
    ],
  },
  process: {
    eyebrow: 'Proces',
    heading: 'Jak to działa',
    steps: [
      {
        number: '01',
        title: 'Rozmowa, 20 minut',
        body: `Pokazujesz realizacje i mówisz, jakich zleceń chcesz więcej. Wychodzę z tego z zakresem i widełkami — bez prezentacji i bez zobowiązania.`,
      },
      {
        number: '02',
        title: 'Projekt i wdrożenie',
        body: `Typowa strona wykonawcy to 2–4 tygodnie od kompletu materiałów. Postęp oglądasz na żywym podglądzie, nie w raporcie.`,
      },
      {
        number: '03',
        title: 'Start i opieka',
        body: `Przenoszę domenę, wpinam analitykę, zostaję na zmiany. Strona jest Wasza — kod i treści zostają u Was.`,
      },
    ],
  },
  price: {
    eyebrow: 'Inwestycja',
    heading: 'Ile to kosztuje',
    lead: 'Wycenę podaję po rozmowie, bez ukrytych pozycji. Punkt wyjścia zależy od tego, ile strona ma robić.',
    tiers: [
      {
        name: 'Wizytówka z formularzem',
        price: 'od 2 000 PLN',
        desc: 'jedna strona, realizacje, kontakt.',
      },
      {
        name: 'Strona z realizacjami i lejkiem zapytań',
        price: 'od 8 000 PLN',
        desc: 'wiele podstron, panel do dodawania realizacji, kalkulator metrażu.',
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    heading: 'Pytania, które słyszę najczęściej',
    items: [
      {
        q: 'Mam zdjęcia z telefonu, prosto z budowy. To wystarczy?',
        a: `Tak, i często tak zaczynamy. Zdjęcie skończonego podjazdu w słońcu robi robotę — najgorsze są kadry z błotem, bo klient patrzy wtedy na błoto, nie na kostkę.`,
      },
      {
        q: 'Czy da się wstawić kalkulator metrażu?',
        a: `Da się i zwykle to robimy. Klient podaje metry i rodzaj kostki, dostaje widełki, a Ty dostajesz zapytanie z liczbami.`,
      },
      {
        q: 'Ile trwa wdrożenie?',
        a: `Typowa strona wykonawcy: 2–4 tygodnie od momentu, w którym mam komplet zdjęć i opisów. Projekt graficzny widzisz w pierwszym tygodniu.`,
      },
      {
        q: 'Czy będę mógł sam dodawać realizacje?',
        a: `Tak. Dodawanie zdjęć i opisów odbywa się w panelu, bez znajomości kodu i bez dzwonienia do mnie.`,
      },
      {
        q: 'Pracujecie tylko lokalnie?',
        a: `Strona może celować w konkretne miejscowości, ale ja pracuję zdalnie — po polsku i po angielsku, niezależnie od tego, gdzie stoi Wasza baza.`,
      },
    ],
  },
}

const inquiryFields: InquiryField[] = [
  { id: 'name', label: 'Imię', type: 'text', required: true },
  { id: 'email', label: 'E-mail', type: 'email', required: true },
  { id: 'company', label: 'Firma', type: 'text' },
  { id: 'website', label: 'Obecna strona (jeśli jest)', type: 'text', placeholder: 'np. twojafirma.pl' },
  {
    id: 'message',
    label: 'Czego potrzebujesz?',
    type: 'textarea',
    placeholder: 'Kilka zdań: jakie zlecenia bierzecie i co ma robić nowa strona.',
  },
]

export const contactContent: ContactContent = {
  eyebrow: 'Kontakt',
  heading: 'Porozmawiajmy o stronie Twojej firmy.',
  lead:
    'Zaprojektuję i wdrożę stronę, która pokazuje Wasze podjazdy i tarasy tak, jak wyglądają ' +
    'po zamieceniu fugi — i zamienia oglądających w zapytania z metrażem. Jedna osoba od ' +
    'projektu po wdrożenie i opiekę.',
  listHeading: 'Co może się na niej znaleźć',
  bullets: [
    'Realizacje z metrażem, rodzajem kostki i czasem wykonania',
    'Zakres robót rozpisany po ludzku: podbudowa, obrzeża, odwodnienie, fugowanie',
    'Formularz, który zbiera metry, rodzaj kostki i termin',
    'Szybka na telefonie i widoczna w Google w miejscowościach, w których pracujecie',
  ],
  priceLine: 'Strony od 2 000 PLN. Wycenę podam po krótkiej rozmowie.',
  rows: [
    { label: 'E-mail', value: site.email, href: `mailto:${site.email}` },
    ...(site.calendly
      ? [{ label: 'Kalendarz', value: 'Umów 20 minut rozmowy', href: site.calendly, external: true }]
      : []),
    { label: 'Portfolio', value: 'marcinbochenek.com', href: 'https://marcinbochenek.com/' },
  ],
  responseTime: site.responseTime,
  source: 'brukarstwo',
  formHeading: 'Opowiedz o swojej firmie',
  fields: inquiryFields,
  buildSubject: (body) => `Strona dla firmy brukarskiej — ${body.company || body.name || 'zapytanie'}`,
  glow: 'radial-gradient(70% 42% at 18% 44%, rgba(70, 74, 82, 0.32), transparent 100%), var(--graphite-950)',
}
