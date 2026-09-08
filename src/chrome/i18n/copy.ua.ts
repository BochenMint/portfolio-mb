/**
 * Chrome edition copy — Ukrainian. Same positioning as the Polish and
 * English copy: a mature, international engineering studio. No marketing
 * fluff, no exclamation points, no "we're passionate about" filler.
 */
import type { ChromeCopy } from './types'

export const copyUa = {
  brand: 'Marcin Bochenek',
  mark: 'MB',
  tagline: 'Інженерія цифрових продуктів · Ґданськ',
  skipLink: 'Перейти до змісту',
  nav: [
    { href: '#realizacje', label: 'Роботи' },
    { href: '#uslugi', label: 'Послуги' },
    { href: '#proces', label: 'Процес' },
    { href: '#inwestycja', label: 'Бюджет' },
    { href: '#kontakt', label: 'Контакт' },
  ],
  navCta: 'Замовити аудит',
  navAria: {
    main: 'Головна',
    openMenu: 'Відкрити меню',
    closeMenu: 'Закрити меню',
  },
  langSwitch: {
    ariaLabel: 'Змінити мову',
    pl: 'PL',
    en: 'EN',
    uk: 'UA',
  },
  themeLight: 'Світла тема',
  themeDark: 'Темна тема',
  themeToggle: 'Перемкнути тему',
  hero: {
    eyebrow: 'Цифрові продукти · PropTech · FinTech · AI ops',
    // Rendered as: line 1 + line 2, the serif word is emphasised.
    h1a: 'Системи, які',
    h1b: 'виглядають як бренд.',
    h1cPrefix: 'Працюють як',
    h1cEm: 'інженерія.',
    lead:
      'Будую платформи бронювання, фінансові автоматизації та агентів AI з повним аудитом кроків — для компаній, які хочуть менше ручної праці і більше маржі. Один стандарт якості — від першого пікселя до продакшену.',
    ctaPrimary: 'Замовити 20-хв аудит',
    ctaSecondary: 'Переглянути роботи',
    projectsFromLabel: (minBudget: string) => `Проєкти від ${minBudget}`,
    stats: [
      { value: '4', label: 'продакшен-системи' },
      { value: '7', label: 'мов · Mint Apartments' },
      { value: '24/7', label: 'бронювання та AI-консьєрж' },
      { value: '100%', label: 'аудитованих кроків AI' },
    ],
  },
  band: ['Mint Apartments', 'Plumm', 'iDrive Cars', 'Agentic OS', 'Astro', 'React', 'Previo', 'KSeF', 'GDPR', 'хостинг у ЄС'],
  work: {
    eyebrow: 'Роботи',
    title: 'Чотири екосистеми. Один стандарт.',
    lead: 'Від прямого бронювання до експорту JPK і оркестрації агентів — кожен продукт спроєктований під конкретну бізнес-модель, а не під шаблон.',
    flagshipBadge: 'флагман',
    openLabel: 'Відкрити',
    openDomainLabel: 'Відкрити',
    factEvidenceLabel: 'Джерело',
  },
  cases: {
    eyebrow: 'Кейси',
    title: 'Проблема. Рішення. Результат.',
    lead: 'Без презентацій. Конкретика, яку можна перевірити в продакшені.',
    labels: { pain: 'Проблема', approach: 'Підхід', result: 'Результат' },
  },
  services: {
    eyebrow: 'Послуги',
    title: 'Три напрями. Одна відповідальність.',
    lead: 'Не продаю «сайт». Постачаю систему, яка має власника, метрики і план розвитку.',
  },
  process: {
    eyebrow: 'Процес',
    title: 'Передбачувано, від аудиту до зростання.',
    lead: 'Чотири етапи, кожен із чітким артефактом. Ви знаєте, що отримаєте, ще до оплати.',
  },
  pricing: {
    eyebrow: 'Бюджет',
    title: 'Прозорі пороги. Жодних сюрпризів.',
    lead: 'Вилка «від» — обсяг уточнюємо після аудиту. Мінімальний поріг захищає обидві сторони.',
    cta: 'Обговоримо обсяг',
    note: 'Ціни нетто. Retainer AI Ops оплачується щомісяця, без мінімального терміну після першого кварталу.',
  },
  testimonials: {
    eyebrow: 'Доказ',
    title: 'Продукти, які можна відкрити просто зараз.',
    open: (domain: string) => `Відкрити ${domain}`,
    note: 'Я не публікую цитати клієнтів без їхньої згоди. Замість цього — чотири системи, що працюють у продакшені, і числа, які можна перевірити в коді.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Питання, які варто поставити.',
  },
  contact: {
    eyebrow: 'Контакт',
    title: 'Почнімо з 20 хвилин.',
    lead: 'Аудит процесу безкоштовний і ні до чого не зобов’язує. Якщо ваш кейс не має сенсу з погляду ROI — скажу це прямо.',
    emailLabel: 'E-mail',
    calendarLabel: 'Календар',
    calendarValue: 'Забронювати час',
    githubLabel: 'GitHub',
  },
  form: {
    title: 'Кваліфікаційний бриф (3 хв)',
    subtitle: (responseTime: string) => `Заповніть поля — повідомлення прийде мені на пошту. ${responseTime}. Без спаму.`,
    selectPlaceholder: 'Оберіть…',
    messagePlaceholder: 'Наприклад рахунки в Excel, бронювання з Booking…',
    submitIdle: 'Надіслати бриф →',
    submitLoading: 'Надсилаю…',
    errorDefault: 'Помилка надсилання. Спробуйте ще раз або напишіть напряму.',
    consent:
      'Надсилаючи форму, ви погоджуєтесь на контакт щодо проєкту. Дані потрапляють лише на налаштований endpoint форми (Web3Forms / Formspree).',
    successTitle: 'Дякую — бриф надіслано',
    successBody: (responseTime: string) => `${responseTime}. Перевірте пошту (також спам).`,
    successCalendarCta: 'Або одразу оберіть час у календарі →',
    unconfiguredTitle: 'Кваліфікаційний бриф',
    unconfiguredBody: (needsAccessKey: boolean) =>
      `Форма потребує налаштування: скопіюйте .env.example у .env і заповніть VITE_FORM_ENDPOINT${
        needsAccessKey ? ' та VITE_FORM_ACCESS_KEY' : ''
      }.`,
    unconfiguredCalendarCta: 'Замовити аудит у календарі →',
    unconfiguredCalendarHint: 'Також встановіть VITE_CALENDLY_URL для CTA календаря.',
    accessKeyError: 'Відсутній VITE_FORM_ACCESS_KEY у .env (потрібен для Web3Forms).',
  },
  footer: {
    rights: (brand: string, year: number) => `© ${year} ${brand}. Усі права захищені.`,
    classic: 'Архів версій — вісім редакцій і гра',
    classicHref: '/lab.html',
    stack: 'React 19 · Vite · GSAP · Lenis · Tailwind v4',
  },
} satisfies ChromeCopy
