import type { Locale } from './locales'

export type MbAiCopy = {
  navAria: string
  navProof: string
  navHow: string
  navContact: string
  ctaAudit: string
  heroTitleBefore: string
  heroTitleEm: string
  heroTitleAfter: string
  heroLead: string
  proofAria: string
  proofDisclaimer: string
  proof: { tag: string; name: string; detail: string; metric: string }[]
  howKicker: string
  howTitleBefore: string
  howTitleEm: string
  howLead: string
  steps: { num: string; title: string; description: string }[]
  contactKicker: string
  contactTitleBefore: string
  contactTitleEm: string
  contactLead: string
  sentLabel: string
  thanksTitle: string
  thanksBody: string
  sendAnother: string
  nameLabel: string
  emailLabel: string
  companyLabel: string
  companyPlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submit: string
  submitting: string
  consent: string
  sendError: string
  formSource: string
  formName: string
  formEmail: string
  formCompany: string
  enquiryFallback: string
  langAria: string
  portfolioLabel: string
  gameLabel: string
  metaTitle: string
  metaDescription: string
  ogTitle: string
  ogDescription: string
}

const pl: MbAiCopy = {
  navAria: 'Nawigacja',
  navProof: 'Wdrożenia',
  navHow: 'Jak działa',
  navContact: 'Kontakt',
  ctaAudit: 'Umów audyt',
  heroTitleBefore: 'Automatyzacje AI z ',
  heroTitleEm: 'kontrolą człowieka',
  heroTitleAfter: ', jasnym zakresem i audytem kroków',
  heroLead:
    'Asystenci przejmują powtarzalną pracę — ale tylko w ustalonym zakresie. Każdy krok zapisany, eskalacja do człowieka, gdy pewność spada.',
  proofAria: 'Wdrożenia w produkcji',
  proofDisclaimer: '* Szacunki orientacyjne — zależą od wolumenu i zakresu wdrożenia.',
  proof: [
    {
      tag: 'Automatyzacja B2B',
      name: 'Agentic OS',
      detail: 'Powtarzalne procesy z jasnym zakresem akcji i zapisem każdego kroku.',
      metric: '5–10 h/tydz. mniej na raportach*',
    },
    {
      tag: 'Księgowość · CRM',
      name: 'Plumm',
      detail:
        'Księgowość online dla JDG i spółek, asystent podatkowy, CRM i poczta — panel firmy z eskalacją do człowieka.',
      metric: '12–20 h/mies. mniej na papierologii*',
    },
    {
      tag: 'Noclegi',
      name: 'Mint Apartments — operacje',
      detail: 'Asystent dla gości w 7 językach, check-in 24/7, rezerwacje bez recepcji.',
      metric: '8–15 h/mies. mniej na mailach gości*',
    },
  ],
  howKicker: 'Jak to działa',
  howTitleBefore: 'Od audytu do agenta — ',
  howTitleEm: 'bez czarnej skrzynki',
  howLead: 'Nie wdrażam czatu w Excelu. Buduję system z limitami, zapisami i człowiekiem w pętli.',
  steps: [
    {
      num: '01',
      title: 'Audyt procesu',
      description:
        '20-min rozmowa: gdzie uciekają godziny, jakie programy już masz, co asystent może przejąć bez ryzyka.',
    },
    {
      num: '02',
      title: 'Jasny zakres akcji',
      description:
        'Ustalamy, co wolno — wysyłka maili, eksporty, odczyt danych. Asystent nie dostaje pełnego dostępu do systemu ani „zrób co chcesz".',
    },
    {
      num: '03',
      title: 'Asystent na żywo',
      description:
        'Automatyzacja z kolejką zadań i zapisem każdego kroku. Wiadomo kto, co i dlaczego zrobił — bez czarnej skrzynki.',
    },
    {
      num: '04',
      title: 'Eskalacja do człowieka',
      description:
        'Przy niskiej pewności system oddaje decyzję operatorowi. Spory i sprawy urzędowe zawsze po Twojej stronie.',
    },
  ],
  contactKicker: 'Kontakt',
  contactTitleBefore: 'Zacznij od ',
  contactTitleEm: 'audytu',
  contactLead:
    'Opisz, co dziś zjada czas — obsługa gości, raporty, faktury, maile od klientów. Na audycie sprawdzimy, czy automatyzacja ma sens i ile godzin odda.',
  sentLabel: 'Wysłano',
  thanksTitle: 'Dzięki — mam kontekst',
  thanksBody: 'Odezwę się w jeden dzień roboczy z propozycją audytu i widełkami czasu.',
  sendAnother: 'Wyślij kolejną wiadomość',
  nameLabel: 'Imię i nazwisko',
  emailLabel: 'E-mail firmowy',
  companyLabel: 'Firma',
  companyPlaceholder: 'Nazwa firmy lub branża',
  messageLabel: 'Co chcesz zautomatyzować?',
  messagePlaceholder: 'Np. 40 maili dziennie od gości, raporty w Excelu, powtarzalne zapytania od klientów…',
  submit: 'Wyślij zapytanie',
  submitting: 'Wysyłam…',
  consent: 'Wysyłając formularz zgadzasz się na kontakt w sprawie wyceny. Żadnego newslettera.',
  sendError: 'Nie udało się wysłać. Napisz bezpośrednio na e-mail.',
  formSource: 'Źródło',
  formName: 'Imię',
  formEmail: 'E-mail',
  formCompany: 'Firma',
  enquiryFallback: 'zapytanie',
  langAria: 'Język',
  portfolioLabel: 'marcinbochenek.com ↗',
  gameLabel: 'gra.marcinbochenek.com ↗',
  metaTitle: 'MB AI — automatyzacje AI z audytem każdego kroku',
  metaDescription:
    'MB AI — automatyzacje z kontrolą człowieka, jasnym zakresem akcji i audytem każdego kroku. Asystent dla gości, operacje firmowe, eskalacja do człowieka. Audyt 20 min.',
  ogTitle: 'MB AI — automatyzacje AI pod kontrolą',
  ogDescription:
    'Asystenci AI z jasnym zakresem, pełnym audytem kroków i eskalacją do człowieka. Asystent dla gości 24/7, automatyzacja operacji, panel Plumm (księgowość, CRM).',
}

const en: MbAiCopy = {
  navAria: 'Navigation',
  navProof: 'Deployments',
  navHow: 'How it works',
  navContact: 'Contact',
  ctaAudit: 'Book an audit',
  heroTitleBefore: 'AI automation with a ',
  heroTitleEm: 'human in the loop',
  heroTitleAfter: ', a hard action scope and a step audit',
  heroLead:
    'Assistants take the repetitive work — but only inside an agreed scope. Every step is logged; a human takes over when confidence drops.',
  proofAria: 'Live deployments',
  proofDisclaimer: '* Directional estimates — they depend on volume and delivery scope.',
  proof: [
    {
      tag: 'B2B automation',
      name: 'Agentic OS',
      detail: 'Repeatable processes with a hard action scope and a record of every step.',
      metric: '5–10 h/week less on reports*',
    },
    {
      tag: 'Bookkeeping · CRM',
      name: 'Plumm',
      detail:
        'Online bookkeeping for sole props (JDG) and companies, a tax assistant, CRM and mail — a company panel with human escalation.',
      metric: '12–20 h/month less on paperwork*',
    },
    {
      tag: 'Hospitality',
      name: 'Mint Apartments — operations',
      detail: 'Guest assistant in 7 languages, 24/7 check-in, bookings without a reception desk.',
      metric: '8–15 h/month less on guest email*',
    },
  ],
  howKicker: 'How it works',
  howTitleBefore: 'From audit to agent — ',
  howTitleEm: 'no black box',
  howLead: 'I do not drop a chat into Excel. I build a system with limits, logs and a human in the loop.',
  steps: [
    {
      num: '01',
      title: 'Process audit',
      description:
        'A 20-min call: where hours leak, which tools you already have, what an assistant can take without the risk.',
    },
    {
      num: '02',
      title: 'Hard action scope',
      description:
        'We lock what is allowed — sending mail, exports, reading data. The assistant does not get full system access or a “do whatever” mandate.',
    },
    {
      num: '03',
      title: 'Assistant live',
      description:
        'Automation with a task queue and a record of every step. Who did what and why — no black box.',
    },
    {
      num: '04',
      title: 'Human escalation',
      description:
        'When confidence is low the system hands the decision to an operator. Disputes and filings stay on your side.',
    },
  ],
  contactKicker: 'Contact',
  contactTitleBefore: 'Start with an ',
  contactTitleEm: 'audit',
  contactLead:
    'Describe what burns time today — guest support, reports, invoices, client email. On the audit we will check whether automation pays and how many hours it gives back.',
  sentLabel: 'Sent',
  thanksTitle: 'Thanks — I have context',
  thanksBody: 'I will reply within one business day with an audit proposal and a time range.',
  sendAnother: 'Send another message',
  nameLabel: 'Full name',
  emailLabel: 'Work email',
  companyLabel: 'Company',
  companyPlaceholder: 'Company name or industry',
  messageLabel: 'What do you want to automate?',
  messagePlaceholder: 'e.g. 40 guest emails a day, reports in Excel, repetitive client questions…',
  submit: 'Send enquiry',
  submitting: 'Sending…',
  consent: 'Sending the form means you agree to be contacted about a quote. No newsletter.',
  sendError: 'Could not send. Please write directly to email.',
  formSource: 'Source',
  formName: 'Name',
  formEmail: 'Email',
  formCompany: 'Company',
  enquiryFallback: 'enquiry',
  langAria: 'Language',
  portfolioLabel: 'marcinbochenek.com ↗',
  gameLabel: 'gra.marcinbochenek.com ↗',
  metaTitle: 'MB AI — AI automation with an audit of every step',
  metaDescription:
    'MB AI — automations with a human in the loop, a hard action scope and an audit of every step. Guest assistant, company ops, human escalation. 20-min audit.',
  ogTitle: 'MB AI — AI automation under control',
  ogDescription:
    'AI assistants with a hard scope, a full step audit and human escalation. 24/7 guest assistant, ops automation, Plumm panel (bookkeeping, CRM).',
}

const uk: MbAiCopy = {
  navAria: 'Навігація',
  navProof: 'Впровадження',
  navHow: 'Як це працює',
  navContact: 'Контакт',
  ctaAudit: 'Замовити аудит',
  heroTitleBefore: 'Автоматизації AI з ',
  heroTitleEm: 'контролем людини',
  heroTitleAfter: ', чітким обсягом дій і аудитом кроків',
  heroLead:
    'Асистенти перебирають повторювану роботу — але лише в узгодженому обсязі. Кожен крок записаний, ескалація до людини, коли впевненість падає.',
  proofAria: 'Впровадження в продакшені',
  proofDisclaimer: '* Орієнтовні оцінки — залежать від обсягу і меж впровадження.',
  proof: [
    {
      tag: 'Автоматизація B2B',
      name: 'Agentic OS',
      detail: 'Повторювані процеси з чітким обсягом дій і записом кожного кроку.',
      metric: 'на 5–10 год/тижд. менше на звітах*',
    },
    {
      tag: 'Бухгалтерія · CRM',
      name: 'Plumm',
      detail:
        'Онлайн-бухгалтерія для ФОП (JDG) і компаній, податковий асистент, CRM і пошта — панель компанії з ескалацією до людини.',
      metric: 'на 12–20 год/міс. менше на паперах*',
    },
    {
      tag: 'Ночівля',
      name: 'Mint Apartments — операції',
      detail: 'Асистент для гостей 7 мовами, check-in 24/7, бронювання без рецепції.',
      metric: 'на 8–15 год/міс. менше на листах гостей*',
    },
  ],
  howKicker: 'Як це працює',
  howTitleBefore: 'Від аудиту до агента — ',
  howTitleEm: 'без чорної скриньки',
  howLead: 'Не впроваджую чат в Excel. Будую систему з лімітами, записами і людиною в контурі.',
  steps: [
    {
      num: '01',
      title: 'Аудит процесу',
      description:
        '20-хв розмова: де тікають години, які програми вже є, що асистент може перебрати без ризику.',
    },
    {
      num: '02',
      title: 'Чіткий обсяг дій',
      description:
        'Фіксуємо, що дозволено — надсилання листів, експорти, читання даних. Асистент не отримує повного доступу до системи і не «роби що хочеш».',
    },
    {
      num: '03',
      title: 'Асистент наживо',
      description:
        'Автоматизація з чергою завдань і записом кожного кроку. Відомо хто, що і чому зробив — без чорної скриньки.',
    },
    {
      num: '04',
      title: 'Ескалація до людини',
      description:
        'При низькій впевненості система віддає рішення оператору. Суперечки і справи з відомствами завжди на вашому боці.',
    },
  ],
  contactKicker: 'Контакт',
  contactTitleBefore: 'Почніть з ',
  contactTitleEm: 'аудиту',
  contactLead:
    'Опишіть, що сьогодні з’їдає час — обслуговування гостей, звіти, рахунки, листи від клієнтів. На аудиті перевіримо, чи автоматизація має сенс і скільки годин поверне.',
  sentLabel: 'Надіслано',
  thanksTitle: 'Дякую — маю контекст',
  thanksBody: 'Відповім протягом одного робочого дня з пропозицією аудиту і вилкою за часом.',
  sendAnother: 'Надіслати ще одне повідомлення',
  nameLabel: 'Ім’я та прізвище',
  emailLabel: 'Робочий e-mail',
  companyLabel: 'Компанія',
  companyPlaceholder: 'Назва компанії або галузь',
  messageLabel: 'Що хочете автоматизувати?',
  messagePlaceholder: 'Наприклад 40 листів на день від гостей, звіти в Excel, повторювані запити клієнтів…',
  submit: 'Надіслати запит',
  submitting: 'Надсилаю…',
  consent: 'Надсилаючи форму, ви погоджуєтесь на контакт щодо оцінки. Жодної розсилки.',
  sendError: 'Не вдалося надіслати. Напишіть безпосередньо на e-mail.',
  formSource: 'Джерело',
  formName: 'Ім’я',
  formEmail: 'E-mail',
  formCompany: 'Компанія',
  enquiryFallback: 'запит',
  langAria: 'Мова',
  portfolioLabel: 'marcinbochenek.com ↗',
  gameLabel: 'gra.marcinbochenek.com ↗',
  metaTitle: 'MB AI — автоматизації AI з аудитом кожного кроку',
  metaDescription:
    'MB AI — автоматизації з контролем людини, чітким обсягом дій і аудитом кожного кроку. Асистент для гостей, операції компанії, ескалація до людини. Аудит 20 хв.',
  ogTitle: 'MB AI — автоматизації AI під контролем',
  ogDescription:
    'Асистенти AI з чітким обсягом, повним аудитом кроків і ескалацією до людини. Асистент для гостей 24/7, автоматизація операцій, панель Plumm (бухгалтерія, CRM).',
}

const dict: Record<Locale, MbAiCopy> = { pl, en, ua: uk }

export function getMbAiCopy(locale: Locale): MbAiCopy {
  return dict[locale]
}
