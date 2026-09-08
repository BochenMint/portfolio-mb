import type { Locale } from './locales'

export type ArchiveLink = { href: string; label: string }

export type ArchiveChrome = {
  langAria: string
  skip: string
  navAria: string
  bookAudit: string
  bookAuditShort: string
  stickyAudit: string
  readyForAudit: string
  auditCtaAria: string
  contactFormAria: string
  available: string
  work: string
  triCity: string
  recovered: string
  mintPlummLive: string
  v3HeroLine1: string
  v3HeroLine2Before: string
  v3HeroLine2Em: string
  v3HeroLine2After: string
  v3ContactTitleBefore: string
  v3ContactTitleEm: string
  v3ContactAside: string
  v3Thanks1: string
  v3Thanks2: string
  v3Thanks3: string
  v6HeroScope: string
  slotMonth: string
  v1StickyLead: string
  orBookCalendar: string
  offerEyebrow: string
  packagesEyebrow: string
  contactEyebrow: string
  packagesAria: string
  v2CmdAria: string
  v2PipelineTime: string
  v2BriefLabel: string
  v2AgentFallback: string
  v3WorkLabel: string
  v2Terminal: string[]
  v2Cmds: { id: string; label: string; hint: string }[]
  v3Nav: ArchiveLink[]
  v5Nav: ArchiveLink[]
  v6Nav: ArchiveLink[]
  v4Fallback: {
    eyebrow: string
    title: string
    lead: string
    seeWork: string
    back: string
    hintBefore: string
    hintAfter: string
  }
}

const pl: ArchiveChrome = {
  langAria: 'Język',
  skip: 'Przejdź do treści',
  navAria: 'Główna nawigacja',
  bookAudit: 'Umów audyt',
  bookAuditShort: 'Audyt',
  stickyAudit: '20-min audyt',
  readyForAudit: 'gotowy na audyt?',
  auditCtaAria: 'Umów audyt — przejdź do sekcji kontakt',
  contactFormAria: 'Przejdź do formularza kontaktowego',
  available: 'dostępny',
  work: 'Realizacje',
  triCity: 'Trójmiasto / zdalnie',
  recovered: 'odzysk · szacunki',
  mintPlummLive: 'Mint · Plumm w produkcji',
  v3HeroLine1: 'Strony, panele i AI,',
  v3HeroLine2Before: 'które oddają Ci ',
  v3HeroLine2Em: 'czas',
  v3HeroLine2After: '.',
  v3ContactTitleBefore: 'Zacznijmy od ',
  v3ContactTitleEm: 'audytu',
  v3ContactAside:
    'Napisz, co dziś zjada czas — lub zarezerwuj 20-minutowy audyt. Bez ściemy, bez obietnic z pitch decka.',
  v3Thanks1: 'Czytam brief',
  v3Thanks2: 'Odsyłam szkic №1 i widełki',
  v3Thanks3: '20-min audyt i decyzja',
  v6HeroScope:
    'Strony, które zbierają zapytania. Panele zamiast Excela. Automatyzacje z kontrolą człowieka — widełki przed rozmową, nie po trzech wycenach „na wyczucie”.',
  slotMonth: '1 slot / miesiąc',
  v1StickyLead: 'Sprawdźmy ROI i zakres',
  orBookCalendar: 'Lub umów audyt w kalendarzu →',
  offerEyebrow: 'Oferta',
  packagesEyebrow: 'Pakiety',
  contactEyebrow: 'Kontakt',
  packagesAria: 'Pakiety',
  v2CmdAria: 'Otwórz paletę poleceń (Ctrl/Cmd + K)',
  v2PipelineTime: 'typowy czas od audytu do efektu',
  v2BriefLabel: '// brief audyt',
  v2AgentFallback: 'System wewnętrzny — orkiestracja agentów AI z audytem każdego kroku.',
  v3WorkLabel: '01 / Realizacje',
  v2Terminal: [
    '$ init operator.mb',
    '✓ direct booking — rezerwacje bez prowizji OTA',
    '✓ panel + integracje — KSeF · PMS · smart-lock',
    '✓ AI concierge 24/7 — z audytem każdego kroku',
    '→ szacowany odzysk: 8–15 h / mies.',
    '$ gotowy na Twój proces.',
  ],
  v2Cmds: [
    { id: 'cap', label: 'Możliwości', hint: 'co robię' },
    { id: 'dep', label: 'Realizacje', hint: 'case studies' },
    { id: 'pipe', label: 'Proces', hint: 'jak pracuję' },
    { id: 'proof', label: 'Dowód', hint: 'na żywo' },
    { id: 'console', label: 'Kontakt', hint: 'otwórz zgłoszenie' },
    { id: 'audit', label: 'Umów 20-min audyt', hint: 'formularz' },
    { id: 'mail', label: 'Napisz e-mail', hint: '' },
    { id: 'gh', label: 'GitHub', hint: 'kod' },
    { id: 'v1', label: 'Aktualna strona (studio)', hint: '/' },
  ],
  v3Nav: [
    { href: '#realizacje', label: 'Realizacje' },
    { href: '#uslugi', label: 'Usługi' },
    { href: '#o-mnie', label: 'O mnie' },
    { href: '#cennik', label: 'Cennik' },
    { href: '#faq', label: 'FAQ' },
    { href: '#kontakt', label: 'Kontakt' },
  ],
  v5Nav: [
    { href: '#volt-ledger', label: 'Metryki' },
    { href: '#volt-work', label: 'Realizacje' },
    { href: '#volt-offer', label: 'Oferta' },
    { href: '#volt-packages', label: 'Pakiety' },
    { href: '#volt-proof', label: 'Dowód' },
    { href: '#kontakt', label: 'Kontakt' },
  ],
  v6Nav: [
    { href: '#liczby', label: 'Liczby' },
    { href: '#realizacje', label: 'Realizacje' },
    { href: '#uslugi', label: 'Oferta' },
    { href: '#pakiety', label: 'Pakiety' },
    { href: '#faq', label: 'FAQ' },
    { href: '#kontakt', label: 'Kontakt' },
  ],
  v4Fallback: {
    eyebrow: 'Misja: nowa strona',
    title: 'Gra kosmiczna wymaga WebGL 2.',
    lead: 'Ta przeglądarka nie uruchomi lotu statkiem po orbicie czarnej dziury — ale możesz od razu zobaczyć cztery systemy, które już pracują w produkcji. Każdy to osobny projekt Marcina: strony, lejki i systemy operacyjne z mierzalnym ROI.',
    seeWork: 'Zobacz realizacje →',
    back: '← klasyczne portfolio',
    hintBefore: 'Masz desktop z Chrome lub Firefox? Otwórz ',
    hintAfter: ' — poleć statkiem do każdej planety i odkryj case study w locie.',
  },
}

const en: ArchiveChrome = {
  langAria: 'Language',
  skip: 'Skip to content',
  navAria: 'Main navigation',
  bookAudit: 'Book an audit',
  bookAuditShort: 'Audit',
  stickyAudit: '20-min audit',
  readyForAudit: 'ready for an audit?',
  auditCtaAria: 'Book an audit — go to the contact section',
  contactFormAria: 'Go to the contact form',
  available: 'available',
  work: 'Work',
  triCity: 'Tri-City / remote',
  recovered: 'recovered · estimates',
  mintPlummLive: 'Mint · Plumm in production',
  v3HeroLine1: 'Sites, panels and AI',
  v3HeroLine2Before: 'that give you back ',
  v3HeroLine2Em: 'time',
  v3HeroLine2After: '.',
  v3ContactTitleBefore: 'Start with an ',
  v3ContactTitleEm: 'audit',
  v3ContactAside:
    'Write what is burning time today — or book a 20-minute audit. No fluff, no pitch-deck promises.',
  v3Thanks1: 'I read the brief',
  v3Thanks2: 'I send sketch no. 1 and a range',
  v3Thanks3: '20-min audit and a decision',
  v6HeroScope:
    'Sites that capture enquiries. Panels instead of Excel. Automations with a human in the loop — ranges before the call, not after three “gut feel” quotes.',
  slotMonth: '1 slot / month',
  v1StickyLead: 'Let’s check ROI and scope',
  orBookCalendar: 'Or book the audit in the calendar →',
  offerEyebrow: 'Offer',
  packagesEyebrow: 'Packages',
  contactEyebrow: 'Contact',
  packagesAria: 'Packages',
  v2CmdAria: 'Open command palette (Ctrl/Cmd + K)',
  v2PipelineTime: 'typical time from audit to first result',
  v2BriefLabel: '// audit brief',
  v2AgentFallback: 'Internal system — AI agent orchestration with an audit trail for every step.',
  v3WorkLabel: '01 / Work',
  v2Terminal: [
    '$ init operator.mb',
    '✓ direct booking — reservations without OTA commission',
    '✓ panel + integrations — KSeF · PMS · smart-lock',
    '✓ AI concierge 24/7 — with an audit trail on every step',
    '→ estimated recovery: 8–15 h / month',
    '$ ready for your process.',
  ],
  v2Cmds: [
    { id: 'cap', label: 'Capabilities', hint: 'what I do' },
    { id: 'dep', label: 'Work', hint: 'case studies' },
    { id: 'pipe', label: 'Process', hint: 'how I work' },
    { id: 'proof', label: 'Proof', hint: 'live' },
    { id: 'console', label: 'Contact', hint: 'open a brief' },
    { id: 'audit', label: 'Book a 20-min audit', hint: 'form' },
    { id: 'mail', label: 'Write an email', hint: '' },
    { id: 'gh', label: 'GitHub', hint: 'code' },
    { id: 'v1', label: 'Current site (studio)', hint: '/' },
  ],
  v3Nav: [
    { href: '#realizacje', label: 'Work' },
    { href: '#uslugi', label: 'Services' },
    { href: '#o-mnie', label: 'About' },
    { href: '#cennik', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
    { href: '#kontakt', label: 'Contact' },
  ],
  v5Nav: [
    { href: '#volt-ledger', label: 'Metrics' },
    { href: '#volt-work', label: 'Work' },
    { href: '#volt-offer', label: 'Offer' },
    { href: '#volt-packages', label: 'Packages' },
    { href: '#volt-proof', label: 'Proof' },
    { href: '#kontakt', label: 'Contact' },
  ],
  v6Nav: [
    { href: '#liczby', label: 'Numbers' },
    { href: '#realizacje', label: 'Work' },
    { href: '#uslugi', label: 'Offer' },
    { href: '#pakiety', label: 'Packages' },
    { href: '#faq', label: 'FAQ' },
    { href: '#kontakt', label: 'Contact' },
  ],
  v4Fallback: {
    eyebrow: 'Mission: a new site',
    title: 'The space game needs WebGL 2.',
    lead: 'This browser cannot fly the ship around the black hole — but you can still see four systems already in production. Each is a separate project: sites, funnels and ops systems with measurable ROI.',
    seeWork: 'See the work →',
    back: '← classic portfolio',
    hintBefore: 'On desktop Chrome or Firefox, open ',
    hintAfter: ' — fly to each planet and open the case study in flight.',
  },
}

const ua: ArchiveChrome = {
  langAria: 'Мова',
  skip: 'Перейти до змісту',
  navAria: 'Головна навігація',
  bookAudit: 'Замовити аудит',
  bookAuditShort: 'Аудит',
  stickyAudit: '20-хв аудит',
  readyForAudit: 'готові до аудиту?',
  auditCtaAria: 'Замовити аудит — перейти до контакту',
  contactFormAria: 'Перейти до форми контакту',
  available: 'доступний',
  work: 'Роботи',
  triCity: 'Тримісто / віддалено',
  recovered: 'вивільнений час · орієнтири',
  mintPlummLive: 'Mint · Plumm у продакшені',
  v3HeroLine1: 'Сайти, панелі та ШІ,',
  v3HeroLine2Before: 'які повертають вам ',
  v3HeroLine2Em: 'час',
  v3HeroLine2After: '.',
  v3ContactTitleBefore: 'Почнімо з ',
  v3ContactTitleEm: 'аудиту',
  v3ContactAside:
    'Опишіть, що сьогодні з’їдає час — або забронюйте 20-хвилинний аудит. Без обіцянок зі слайдів.',
  v3Thanks1: 'Читаю бриф',
  v3Thanks2: 'Надсилаю ескіз №1 і вилку',
  v3Thanks3: '20-хв аудит і рішення',
  v6HeroScope:
    'Сайти, які збирають запити. Панелі замість Excel. Автоматизації з контролем людини — вилки до розмови, не після трьох оцінок «на око».',
  slotMonth: '1 слот / місяць',
  v1StickyLead: 'Перевіримо ROI і обсяг',
  orBookCalendar: 'Або замовте аудит у календарі →',
  offerEyebrow: 'Пропозиція',
  packagesEyebrow: 'Пакети',
  contactEyebrow: 'Контакт',
  packagesAria: 'Пакети',
  v2CmdAria: 'Відкрити палітру команд (Ctrl/Cmd + K)',
  v2PipelineTime: 'типовий час від аудиту до ефекту',
  v2BriefLabel: '// бриф аудиту',
  v2AgentFallback: 'Внутрішня система — оркестрація агентів ШІ з аудитом кожного кроку.',
  v3WorkLabel: '01 / Роботи',
  v2Terminal: [
    '$ init operator.mb',
    '✓ direct booking — бронювання без комісії OTA',
    '✓ панель + інтеграції — KSeF · PMS · smart-lock',
    '✓ AI concierge 24/7 — з аудитом кожного кроку',
    '→ орієнтовно: 8–15 год / міс.',
    '$ готовий до вашого процесу.',
  ],
  v2Cmds: [
    { id: 'cap', label: 'Можливості', hint: 'що роблю' },
    { id: 'dep', label: 'Роботи', hint: 'кейси' },
    { id: 'pipe', label: 'Процес', hint: 'як працюю' },
    { id: 'proof', label: 'Доказ', hint: 'наживо' },
    { id: 'console', label: 'Контакт', hint: 'відкрити бриф' },
    { id: 'audit', label: 'Замовити 20-хв аудит', hint: 'форма' },
    { id: 'mail', label: 'Написати e-mail', hint: '' },
    { id: 'gh', label: 'GitHub', hint: 'код' },
    { id: 'v1', label: 'Актуальний сайт (студія)', hint: '/' },
  ],
  v3Nav: [
    { href: '#realizacje', label: 'Роботи' },
    { href: '#uslugi', label: 'Послуги' },
    { href: '#o-mnie', label: 'Про мене' },
    { href: '#cennik', label: 'Ціни' },
    { href: '#faq', label: 'FAQ' },
    { href: '#kontakt', label: 'Контакт' },
  ],
  v5Nav: [
    { href: '#volt-ledger', label: 'Метрики' },
    { href: '#volt-work', label: 'Роботи' },
    { href: '#volt-offer', label: 'Пропозиція' },
    { href: '#volt-packages', label: 'Пакети' },
    { href: '#volt-proof', label: 'Доказ' },
    { href: '#kontakt', label: 'Контакт' },
  ],
  v6Nav: [
    { href: '#liczby', label: 'Цифри' },
    { href: '#realizacje', label: 'Роботи' },
    { href: '#uslugi', label: 'Пропозиція' },
    { href: '#pakiety', label: 'Пакети' },
    { href: '#faq', label: 'FAQ' },
    { href: '#kontakt', label: 'Контакт' },
  ],
  v4Fallback: {
    eyebrow: 'Місія: новий сайт',
    title: 'Космічна гра потребує WebGL 2.',
    lead: 'Цей браузер не запустить політ корабля біля чорної діри — але можна одразу побачити чотири системи в продакшені. Кожна — окремий проєкт: сайти, воронки й операційні системи з вимірюваним ROI.',
    seeWork: 'Переглянути роботи →',
    back: '← класичне портфоліо',
    hintBefore: 'На десктопі в Chrome або Firefox відкрийте ',
    hintAfter: ' — летіть до кожної планети і відкрийте кейс у польоті.',
  },
}

const chrome: Record<Locale, ArchiveChrome> = { pl, en, ua }

export function getArchiveUi(locale: Locale): ArchiveChrome {
  return chrome[locale]
}
