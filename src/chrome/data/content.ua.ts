/**
 * Ukrainian data for the Chrome edition. Mirrors the field structure of
 * content.ts exactly. Consumed only via getContent() in i18n.ts — the
 * classic (Polish-only) edition never imports this file.
 */
import type { PricingTier, Project, Service } from './content'

export const siteUa = {
  role: 'PropTech · FinTech · AI ops',
  icpBadge: 'Проєкти від 25 000 PLN · особа, яка ухвалює рішення в компанії',
  headline: ['4 продакшен-системи.', 'Один стандарт якості.'],
  subhead:
    'Будую сайти, платформи бронювання та автоматизації з AI — для власників компаній, які хочуть менше ручної праці і більше маржі. Astro, React, інтеграції API, агенти з повним аудитом кроків.',
  proofLine: '4 продакшен-продукти · hospitality · бухгалтерія · mobility · AI ops',
  ctaPrimary: 'Замовити 20-хв аудит (безкоштовно)',
  ctaSecondary: 'Переглянути кейси',
  ctaSticky: 'Аудит процесу · 20 хв',
  location: 'Польща · віддалено та на місці',
  responseTime: 'Відповідь протягом 1 робочого дня',
  minBudget: '25 000 PLN',
}

export const servicesUa: Service[] = [
  {
    title: 'Платформа та бронювання',
    subtitle: 'Прямий дохід, а не просто візитка',
    points: [
      'Багатомовне SEO, Core Web Vitals, schema.org',
      'Віджет бронювання, Previo/PMS, платежі',
      'Операційна панель під вашу команду',
    ],
  },
  {
    title: 'Автоматизація та FinTech',
    subtitle: 'Excel опівночі → pipeline',
    points: [
      'Експорти Plumm, JPK_FA, потік, готовий до KSeF',
      'Синхронізація календарів, замків, CRM',
      'Звіти та сповіщення — детерміновані дані',
    ],
  },
  {
    title: 'AI під контролем',
    subtitle: 'Агент, якого ви знаєте і можете аудитувати',
    points: [
      'Консьєрж, що знає вашу пропозицію (без галюцинацій)',
      'Agentic OS — workflow, пам’ять, логи',
      'GDPR, вартість токенів, ескалація до людини',
    ],
  },
]

export const projectsUa: Project[] = [
  {
    id: 'mint',
    title: 'Mint Apartments',
    domain: 'mintapartments.pl',
    url: 'https://mintapartments.pl',
    tagline: 'Апартаменти в Гданську · онлайн-бронювання',
    description:
      'Продакшен-сайт Mint Apartments: каталог апартаментів у Тримісті, багатомовне пряме бронювання, інтеграція Previo та AI-консьєрж — замість залежності від агрегаторних порталів.',
    client: 'Короткострокова оренда · Гданськ і околиці',
    pain: 'Гості бронювали через OTA — без єдиного бренду, прямого бронювання і послідовного UX кількома мовами',
    approach: 'Astro + React, SEO для кожної локалі, віджет Previo, операційна панель і автоматизація доступу (Tedee/Nuki)',
    result: 'mintapartments.pl як канал бронювання і преміум-бренду — готовий до масштабування портфеля',
    tags: ['Гданськ', 'Бронювання', 'Previo', 'AI-консьєрж'],
    accent: '#7ee0ff',
    stat: { value: '7', label: 'локалей · 1 екосистема' },
    metrics: ['Пряме бронювання', 'Smart lock', 'Core Web Vitals'],
    flagship: true,
  },
  {
    id: 'plumm',
    title: 'Plumm',
    domain: 'plumm.pl',
    url: 'https://plumm.pl',
    tagline: '16 рушіїв декларацій · 9 314 протестованих сценаріїв · один застосунок',
    description:
      'Plumm — це повна платформа AI-бухгалтерії для польських компаній: рахунки, KSeF, VAT/PIT/CIT/ZUS, розрахунки та AI-асистент для підприємця і бухгалтера в одному місці. Під капотом — 118 моделей даних і 456 API-ендпоінтів на близько 545 тис. рядків TypeScript, а 16 форматів декларацій (PIT-28/36/36L, CIT-8/8E, JPK_V7/FA/PKPIR, KSeF FA(3)) валідуються за офіційними схемами XSD Міністерства фінансів Польщі і покриті 9 314 тестовими сценаріями.',
    client: 'Малі та середні компанії · бухгалтерські бюро',
    pain: 'Рахунки, VAT, PIT, CIT і ZUS були розкидані по таблицях і окремих інструментах — ризик помилки при кожному закритті місяця і поданні декларації до відомства',
    approach: 'Next.js + TypeScript на 118 моделях Prisma, 16 рушіїв експорту XML, валідованих за XSD Міністерства фінансів, модуль розрахунків і AI-асистент — усе покрито 9 314 тестами',
    result: 'Рахунки, KSeF, податки, ZUS і розрахунки з одного застосунку на plumm.pl — без нічного Excel і без вгадування, що потрапить до відомства',
    tags: ['AI-бухгалтерія', 'KSeF', 'VAT · PIT · CIT', 'ZUS'],
    accent: '#3ee8c4',
    stat: { value: '16', label: 'рушіїв декларацій XSD' },
    metrics: ['9 314 тестів', '456 ендпоінтів', '118 моделей'],
  },
  {
    id: 'idrive',
    title: 'iDrive Cars',
    domain: 'idrivecars',
    url: '#',
    tagline: 'Автомобільна журналістика · тести авто · галереї',
    description:
      'Авторське портфоліо і автомобільний блог: тести авто, перші враження від їзди та фотогалереї, побудовані на Next.js 15 App Router, контент у MDX і pipeline WebP на базі Sharp.',
    client: 'Автомобільна журналістика · особистий блог',
    pain: 'Редакційному контенту потрібна була швидка, фотоцентрична публікація без громіздкої CMS',
    approach: 'Next.js 15 App Router, MDX для довгих оглядів, pipeline на Sharp, що генерує оптимізовані WebP-галереї',
    result: 'Швидка, добре індексована публікація тестів авто і галерей, повністю написана в MDX',
    tags: ['Automotive', 'MDX', 'Next.js'],
    accent: '#c9a962',
    stat: { value: 'MDX', label: 'контент-пайплайн' },
    metrics: ['Тести авто', 'Фотогалереї', 'WebP-пайплайн'],
  },
  {
    id: 'agentic',
    title: 'Agentic OS',
    domain: 'agentic OS',
    url: '#',
    tagline: 'Оркестрація AI-агентів',
    description:
      'Операційна система для агентів: завдання, пам’ять, інструменти, аудит. Передбачувані автоматизації — не чорна скринька.',
    client: 'Внутрішній продукт · B2B-клієнти',
    pain: 'Хаос промптів без логів і відповідальності',
    approach: 'Workflow engine, tool calling, human-in-the-loop',
    result: 'Повторювані процеси з повним слідом рішень',
    tags: ['AI', 'Agents', 'Automation'],
    accent: '#a78bfa',
    stat: { value: '100%', label: 'аудитовані кроки' },
    metrics: ['Workflow', 'Memory', 'Tooling'],
  },
]

export const pricingUa: PricingTier[] = [
  {
    name: 'Launch',
    from: 'від 25 000 PLN',
    description: 'Лендінг + інтеграції + базова автоматизація',
    includes: ['Преміум UX/UI', 'Технічне SEO', 'Форма + CRM', '2 ітерації'],
  },
  {
    name: 'Платформа',
    from: 'від 55 000 PLN',
    description: 'Бронювання, панель, багатомовність, API',
    includes: [
      'Усе з Launch',
      'Бронювання / PMS',
      'Адмін-панель',
      'Моніторинг і тести',
    ],
    highlight: true,
  },
  {
    name: 'AI Ops',
    from: 'від 15 000 PLN / міс.',
    description: 'Агенти, автоматизації, підтримка і розвиток',
    includes: ['Agentic workflows', 'Консьєрж / AI-підтримка', 'SLA response', 'Звіт витрат на AI'],
  },
]

export const faqUa = [
  {
    q: 'Чому мінімум 25 000 PLN?',
    a: 'Бо я роблю продакшен-продукти — з тестами, SEO і підтримкою — а не «сайт на вчора». Це фільтр, який захищає обидві сторони.',
  },
  {
    q: 'Чи робите ви прості сайти-візитки?',
    a: 'Так, якщо вони є частиною більшої мети (бронювання, автоматизація). Сам лендінг без бізнес-KPI — лише в пакеті Launch.',
  },
  {
    q: 'Як виглядає співпраця з AI?',
    a: 'Спочатку процес і дані, потім агент. Завжди: логи, ескалація до людини, оцінка вартості токенів.',
  },
  {
    q: 'Чи підписуєте ви NDA та договір?',
    a: 'Так — стандартно. Хостинг у ЄС, GDPR в обсязі з нульового дня.',
  },
]

export const processUa = [
  { step: '01', title: 'Аудит 20 хв', text: 'Чи має ваш кейс сенс з погляду ROI — чесно, без презентацій.' },
  { step: '02', title: 'Прототип руху', text: 'Відчуваєте продукт ще до написання рядка backend-коду.' },
  { step: '03', title: 'Build і впровадження', text: 'Продакшен, тести, документація для команди.' },
  { step: '04', title: 'Зростання', text: 'Метрики, ітерації — а не «проєкт закрито».' },
]

export const marqueeItemsUa = [
  'PropTech',
  'FinTech',
  'Automotive',
  'AI Ops',
  'Astro · React',
  'Previo · Plumm · KSeF',
  'Малий бізнес → великий ефект',
]

export const qualificationFieldsUa = [
  { id: 'name', label: 'Ім’я та прізвище', type: 'text', required: true },
  { id: 'email', label: 'Робочий e-mail', type: 'email', required: true },
  { id: 'company', label: 'Компанія / галузь', type: 'text', required: true },
  {
    id: 'budget',
    label: 'Орієнтовний бюджет',
    type: 'select',
    required: true,
    options: ['25–50 тис.', '50–100 тис.', '100+ тис.', 'Retainer AI Ops'],
  },
  {
    id: 'timeline',
    label: 'Термін старту',
    type: 'select',
    required: true,
    options: ['ASAP', '1–2 міс.', '3+ міс.', 'Досліджую варіанти'],
  },
  { id: 'message', label: 'Що сьогодні болить? (2–3 речення)', type: 'textarea', required: true },
]
