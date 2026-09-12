/**
 * Everything the garden landing says below the stage.
 *
 * Moved out of its own `Offer.tsx` / `Contact.tsx` when the sections were
 * generalised into `stage/Sections.tsx` for the second trade. The strings
 * are the same strings; `krajobraz.html`'s FAQPage JSON-LD quotes the `faq`
 * block below, so the two cannot drift apart.
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
    ],
  },
  process: {
    eyebrow: 'Proces',
    heading: 'Jak to działa',
    steps: [
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
    ],
  },
  price: {
    eyebrow: 'Inwestycja',
    heading: 'Ile to kosztuje',
    lead: 'Wycenę podaję po rozmowie, bez ukrytych pozycji. Punkt wyjścia zależy od tego, ile strona ma robić.',
    tiers: [
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
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    heading: 'Pytania, które słyszę najczęściej',
    items: [
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
    ],
  },
}

const inquiryFields: InquiryField[] = [
  { id: 'name', label: 'Imię', type: 'text', required: true },
  { id: 'email', label: 'E-mail', type: 'email', required: true },
  { id: 'company', label: 'Pracownia / firma', type: 'text' },
  { id: 'website', label: 'Obecna strona (jeśli jest)', type: 'text', placeholder: 'np. twojapracownia.pl' },
  {
    id: 'message',
    label: 'Czego potrzebujesz?',
    type: 'textarea',
    placeholder: 'Kilka zdań: czym się zajmujecie i co ma robić nowa strona.',
  },
]

export const contactContent: ContactContent = {
  eyebrow: 'Kontakt',
  heading: 'Porozmawiajmy o stronie Twojej pracowni.',
  lead:
    'Zaprojektuję i wdrożę stronę, która pokazuje Wasze realizacje tak dobrze, jak wyglądają w naturze — i zamienia oglądających w zapytania. Jedna osoba od projektu po wdrożenie i opiekę.',
  listHeading: 'Co może się na niej znaleźć',
  bullets: [
    'Portfolio realizacji — duże zdjęcia, galerie przed i po, opis każdego projektu',
    'Usługi opisane po ludzku: projekt, realizacja, pielęgnacja',
    'Formularz zapytania, który od razu zbiera metraż, lokalizację i budżet',
    'Szybka na telefonie i widoczna w Google w Twojej okolicy',
  ],
  priceLine: 'Strony od 2 000 PLN. Wycenę podam po krótkiej rozmowie.',
  rows: [
    { label: 'E-mail', value: site.email, href: `mailto:${site.email}` },
    ...(site.calendly
      ? [{ label: 'Kalendarz', value: 'Umów 20 minut rozmowy', href: site.calendly, external: true }]
      : []),
    { label: 'Portfolio', value: 'marcinbochenek.com', href: 'https://marcinbochenek.com/' },
  ],
  responseTime: site.responseTime,
  source: 'krajobraz',
  formHeading: 'Opowiedz o swojej pracowni',
  fields: inquiryFields,
  buildSubject: (body) => `Strona dla pracowni krajobrazu — ${body.company || body.name || 'zapytanie'}`,
  glow: 'radial-gradient(70% 42% at 18% 44%, rgba(40, 66, 30, 0.3), transparent 100%), var(--moss-950)',
}
