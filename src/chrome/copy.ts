/**
 * Chrome edition copy — positioning as a mature, international IT brand.
 * Data (projects, pricing, FAQ, form) is shared with the classic edition via
 * src/data/content.ts; only tone-of-voice strings live here.
 */
import { site } from '../data/content'

export const chromeCopy = {
  brand: site.brand,
  mark: 'MB',
  tagline: 'Engineering studio · Gdańsk / EU',
  nav: [
    { href: '#realizacje', label: 'Realizacje' },
    { href: '#uslugi', label: 'Usługi' },
    { href: '#proces', label: 'Proces' },
    { href: '#inwestycja', label: 'Inwestycja' },
    { href: '#kontakt', label: 'Kontakt' },
  ],
  navCta: 'Umów audyt',
  hero: {
    eyebrow: 'Produkty cyfrowe · PropTech · FinTech · AI ops',
    // Rendered as: line 1 + line 2, the serif word is emphasised.
    h1a: 'Systemy, które',
    h1b: 'wyglądają jak marka.',
    h1c: 'Działają jak inżynieria.',
    lead:
      'Buduję platformy rezerwacji, automatyzacje finansów i audytowalne agenty AI dla firm, które chcą mniej ręcznej pracy i więcej marży. Jeden standard jakości — od pierwszego piksela po produkcję.',
    ctaPrimary: 'Umów 20-min audyt',
    ctaSecondary: 'Zobacz realizacje',
    meta: [site.responseTime, site.location, `Projekty ${site.minBudget}+`],
    stats: [
      { value: '4', label: 'produkcyjne systemy' },
      { value: '7', label: 'języków · Mint Apartments' },
      { value: '24/7', label: 'booking & concierge AI' },
      { value: '100%', label: 'audytowalne kroki AI' },
    ],
  },
  band: ['Mint Apartments', 'Plumm', 'iDrive Cars', 'Agentic OS', 'Astro', 'React', 'Previo', 'KSeF', 'RODO', 'EU hosting'],
  work: {
    eyebrow: 'Realizacje',
    title: 'Cztery ekosystemy. Jeden standard.',
    lead: 'Od direct bookingu po eksport JPK i orkiestrację agentów — każdy produkt zaprojektowany pod konkretny model biznesowy, nie pod szablon.',
  },
  cases: {
    eyebrow: 'Case studies',
    title: 'Problem. Rozwiązanie. Rezultat.',
    lead: 'Bez pitch decka. Konkret, który możesz zweryfikować w produkcji.',
    labels: { pain: 'Problem', approach: 'Podejście', result: 'Rezultat' },
  },
  services: {
    eyebrow: 'Usługi',
    title: 'Trzy obszary. Jedna odpowiedzialność.',
    lead: 'Nie sprzedaję „strony”. Dostarczam system, który ma właściciela, metryki i plan rozwoju.',
  },
  process: {
    eyebrow: 'Proces',
    title: 'Przewidywalnie, od audytu do wzrostu.',
    lead: 'Cztery etapy, każdy z jasnym artefaktem. Wiesz, co dostajesz, zanim zapłacisz.',
  },
  pricing: {
    eyebrow: 'Inwestycja',
    title: 'Przejrzyste progi. Zero niespodzianek.',
    lead: 'Widełki „od” — zakres precyzujemy po audycie. Minimalny próg chroni obie strony.',
    cta: 'Porozmawiajmy o zakresie',
    note: 'Ceny netto. Retainer AI Ops rozliczany miesięcznie, bez okresu minimalnego po pierwszym kwartale.',
  },
  testimonials: {
    eyebrow: 'Opinie',
    title: 'Co mówią właściciele.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Pytania, które warto zadać.',
  },
  contact: {
    eyebrow: 'Kontakt',
    title: 'Zacznijmy od 20 minut.',
    lead: 'Audyt procesu jest bezpłatny i bez zobowiązań. Jeśli Twój case nie ma sensu ROI — powiem to wprost.',
    emailLabel: 'E-mail',
    calendarLabel: 'Kalendarz',
    githubLabel: 'GitHub',
  },
  footer: {
    rights: `© ${new Date().getFullYear()} ${site.brand}. Wszystkie prawa zastrzeżone.`,
    classic: 'Poprzednia edycja portfolio',
    classicHref: '/classic/',
    stack: 'React 19 · Vite · GSAP · Lenis · Tailwind v4',
  },
}
