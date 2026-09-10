/**
 * Chrome edition copy — Ukrainian. Same positioning as the Polish and
 * English copy: a mature, international engineering studio. No marketing
 * fluff, no exclamation points, no "we're passionate about" filler.
 */
import type { ChromeCopy } from './types'

export const copyUa = {
  brand: 'Marcin Bochenek',
  mark: 'MB',
  tagline: 'Сайти, застосунки та системи · Ґданськ',
  skipLink: 'Перейти до змісту',
  nav: [
    { href: '#realizacje', label: 'Роботи' },
    { href: '#pod-maska', label: 'Під капотом' },
    { href: '#uslugi', label: 'Послуги' },
    { href: '#proces', label: 'Процес' },
    { href: '#inwestycja', label: 'Бюджет' },
    { href: '#kontakt', label: 'Контакт' },
  ],
  navCta: 'Замовити аудит',
  underhoodCta: 'Так я будую для клієнтів',
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
    eyebrow: 'Сайти · Застосунки · Системи · Автоматизація',
    // Rendered as: line 1 + line 2, the serif word is emphasised.
    h1a: 'Створюю сайти, застосунки',
    h1b: 'та системи,',
    h1cPrefix: 'які підтримують',
    h1cEm: 'розвиток вашого бізнесу.',
    lead:
      'Онлайн-бронювання, панель замість таблиць, автоматизація рутинної роботи. Працюю з компаніями, які хочуть обслуговувати більше клієнтів, не наймаючи ще одну людину для ручного введення даних.',
    ctaPrimary: 'Замовити 20-хв аудит',
    ctaSecondary: 'Переглянути роботи',
    projectsFromLabel: (minBudget: string) => `Сайти від ${minBudget}`,
    stats: [
      { value: '4', label: 'продакшен-системи' },
      { value: '7', label: 'мов · Mint Apartments' },
      { value: '24/7', label: 'бронювання та AI-консьєрж' },
      { value: '100%', label: 'аудитованих кроків AI' },
    ],
  },
  band: ['Сайти для бізнесу', 'Лендінги', 'Онлайн-бронювання', 'Панелі та CRM', 'Інтеграції', 'Автоматизація', 'AI-асистенти', 'SEO та AI-пошук', 'GDPR', 'Хостинг у ЄС'],
  work: {
    eyebrow: 'Роботи',
    title: 'Чотири системи, що працюють у продакшені.',
    lead: 'Кожна створена під конкретний спосіб заробітку, а не під шаблон. Усі можна відкрити й перевірити самому.',
    flagshipBadge: 'флагман',
    openLabel: 'Відкрити',
    openDomainLabel: 'Відкрити',
    factEvidenceLabel: 'Джерело',
  },
  cases: {
    eyebrow: 'Кейси',
    title: 'Проблема, рішення, ефект.',
    lead: 'Без продажної презентації. Конкретика, яку можна перевірити наживо.',
    labels: { pain: 'Проблема', approach: 'Підхід', result: 'Результат' },
  },
  services: {
    eyebrow: 'Послуги',
    title: 'Три речі, які я для вас зроблю.',
    lead: 'Не продаю сам лише сайт. Залишаю систему, яка має власника, вимірюваний ефект і план подальшого розвитку.',
  },
  process: {
    eyebrow: 'Процес',
    title: 'Від першої розмови до запуску.',
    lead: 'Чотири етапи, кожен завершується чимось конкретним. Ви знаєте, що отримаєте, ще до оплати.',
  },
  pricing: {
    eyebrow: 'Бюджет',
    title: 'Чіткі вилки. Жодних сюрпризів.',
    lead: 'Вилка «від» — обсяг уточнюємо після аудиту. Мінімальний поріг захищає обидві сторони.',
    cta: 'Обговоримо обсяг',
    note: 'Ціни нетто. Retainer AI Ops оплачується щомісяця, без мінімального терміну після першого кварталу.',
  },
  testimonials: {
    eyebrow: 'Доказ',
    title: 'Продукти, які можна відкрити просто зараз.',
    open: (domain: string) => `Відкрити ${domain}`,
    notPublic: 'незабаром',
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
    successMailtoNote: (email: string) =>
      `Ваш поштовий клієнт мав відкритися з готовим листом — надішліть його, або напишіть напряму на ${email}.`,
  },
  footer: {
    rights: (brand: string, year: number) => `© ${year} ${brand}. Усі права захищені.`,
    classic: 'Архів версій — вісім редакцій і гра',
    classicHref: '/lab.html',
    stack: 'React 19 · Vite · GSAP · Lenis · Tailwind v4',
  },
} satisfies ChromeCopy
