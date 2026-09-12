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
    eyebrow: 'Одна людина, відповідальна за весь проєкт',
    // Rendered as: line 1 + line 2, the serif word is emphasised.
    h1a: 'Створюю сайти, застосунки',
    h1b: 'та системи',
    // Cyrillic sets wider: this split is what keeps the headline at five
    // lines instead of six, with no one-word line.
    h1cPrefix: 'для зростання',
    h1cEm: 'вашої компанії.',
    lead:
      'Онлайн-бронювання, панель замість таблиць, автоматизація рутинної роботи. Працюю з компаніями, які хочуть обслуговувати більше клієнтів, не наймаючи ще одну людину для ручної роботи.',
    ctaPrimary: 'Замовити аудит (20 хвилин)',
    ctaSecondary: 'Переглянути роботи',
    objectLabel: 'Хромований болід Формули 1 — перетягніть, щоб обернути',
    projectsFromLabel: (minBudget: string) => `Сайти від ${minBudget}`,
    stats: [
      { value: '4', label: 'системи, якими хтось користується щодня' },
      { value: '8', label: 'мов на mintapartments.pl' },
      { value: '9 314', label: 'автоматичних тестів у Plumm' },
      { value: '24/7', label: 'бронювання без участі персоналу' },
    ],
  },
  band: [
    'Сайти для бізнесу',
    'Лендінги',
    'Онлайн-бронювання',
    'Панелі та CRM',
    'Інтеграції',
    'Автоматизація',
    'AI-асистенти',
  ],
  work: {
    eyebrow: 'Роботи',
    title: 'Чотири системи, якими хтось користується щодня.',
    lead: 'Кожна створена під конкретний спосіб заробітку, а не під шаблон. Дві публічні — їх можна відкрити й перевірити просто зараз.',
    flagshipBadge: 'флагманський проєкт',
    openLabel: 'Відкрити',
    openDomainLabel: 'Відкрити',
    factEvidenceLabel: 'Джерело',
  },
  cases: {
    eyebrow: 'Кейси',
    title: 'Проблема, підхід, результат.',
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
    note: 'Ціни нетто. Супровід AI Ops оплачується щомісяця — після першого кварталу без мінімального терміну.',
  },
  testimonials: {
    eyebrow: 'Доказ',
    title: 'Чотири продукти. Два відкриєте просто зараз.',
    open: (domain: string) => `Відкрити ${domain}`,
    notPublic: 'непублічний проєкт',
    note: 'Я не публікую цитати клієнтів без їхньої згоди. Волію доказ, який ви перевірите самі: робочі продукти і числа, пораховані просто з коду.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Питання, які варто поставити.',
  },
  contact: {
    eyebrow: 'Контакт',
    title: 'Почнімо з 20 хвилин.',
    lead: 'Розмова безкоштовна і ні до чого не зобов’язує. Якщо цифри не складаються на вашу користь — скажу це прямо.',
    emailLabel: 'E-mail',
    calendarLabel: 'Календар',
    calendarValue: 'Забронювати час',
    githubLabel: 'GitHub',
  },
  form: {
    title: 'Розкажіть про проєкт (3 хвилини)',
    subtitle: (responseTime: string) => `Заповніть поля — повідомлення прийде просто мені на пошту. ${responseTime}. Без спаму.`,
    selectPlaceholder: 'Оберіть…',
    messagePlaceholder: 'Наприклад рахунки в Excel, бронювання з Booking…',
    submitIdle: 'Надіслати повідомлення',
    submitLoading: 'Надсилаю…',
    errorDefault: 'Не вдалося надіслати. Спробуйте ще раз або напишіть напряму на мою адресу.',
    consent:
      'Надсилаючи форму, ви погоджуєтесь на контакт щодо проєкту. Форма надсилає повідомлення на мою електронну адресу — дані не потрапляють більше нікуди.',
    successTitle: 'Дякую — повідомлення надіслано',
    successBody: (responseTime: string) => `${responseTime}. Перевірте пошту (також спам).`,
    successCalendarCta: 'Або одразу оберіть час у календарі',
    successMailtoNote: (email: string) =>
      `Ваш поштовий клієнт мав відкритися з готовим листом — надішліть його, або напишіть напряму на ${email}.`,
  },
  footer: {
    rights: (brand: string, year: number) => `© ${year} ${brand}. Усі права захищені.`,
    classic: 'Лабораторія',
    classicHref: '/lab.html',
    mbAi: 'MB AI — автоматизації з контролем людини',
    mbAiHref: 'https://mb-ai.pl',
    stack: 'Сайти, системи та автоматизації для компаній у Польщі та за кордоном. Працюю англійською та польською.',
    krajobraz: 'Для студій ландшафтної архітектури',
    krajobrazHref: '/krajobraz',
  },
} satisfies ChromeCopy
