import {
  intakeCopy as intakeCopyPl,
  intakeSteps as intakeStepsPl,
  menuLinks as menuLinksPl,
  navLinks as navLinksPl,
  sections as sectionsPl,
  type ProcessStep,
} from '../../data/content'

type ArchiveFields = {
  sections: typeof sectionsPl
  process: ProcessStep[]
  intakeCopy: typeof intakeCopyPl
  intakeSteps: typeof intakeStepsPl
  navLinks: typeof navLinksPl
  menuLinks: typeof menuLinksPl
}

export const enArchiveFields: ArchiveFields = {
  sections: {
    about: {
      num: '01',
      title: 'About',
      lead: 'One person, a full delivery — from a process audit to production.',
    },
    services: {
      num: '02',
      title: 'What I do for your company',
      lead: 'Three pillars: a modern site that sells, less manual work, AI under control.',
    },
    work: {
      num: '03',
      title: 'Work in production',
      lead: 'Four systems already running — with hours and PLN where those numbers can be counted honestly.',
    },
    process: {
      num: '05',
      title: 'How we work',
      lead: 'No six-month “discovery”. From audit to the first measurable result.',
    },
    pricing: {
      num: '04',
      title: 'Packages and entry point',
      lead: 'Ranges before the call — from a brochure site for a small company to an ops system. Each package has a clear page and feature scope; no hidden costs, no marketplace template.',
    },
    testimonials: {
      num: '06',
      title: 'Proof, not claims',
      lead: 'Instead of pasted testimonials — live deliveries you can click, and the terms I work on.',
    },
    faq: {
      num: '07',
      title: 'Questions from company owners',
      lead: 'What you ask before the first call — answers without theatre.',
    },
    contact: {
      num: '08',
      title: 'Contact',
      lead: 'Write what is burning time today — on the audit we check whether it can be recovered in 90 days and whether the budget holds.',
    },
  },
  process: [
    {
      num: '01',
      title: '20-min audit (free)',
      description:
        'We talk about what burns time today: phones, invoices, bookings, reports. At the end: hours you can recover and which package makes sense — from a brochure site to an ops system.',
    },
    {
      num: '02',
      title: '90-day plan',
      description:
        'One document: scope, integrations, the first measurable result (e.g. live bookings or e-invoices filed). No quarter-long “discovery phase”.',
    },
    {
      num: '03',
      title: 'Production delivery',
      description:
        'Short iterations, access to a staging build before go-live, 1–2 h of training for your team. I do not leave you with a PDF on “how to operate this”.',
    },
    {
      num: '04',
      title: 'Measurement after launch',
      description:
        'We compare before/after: handling time, email volume, conversion from the site. If the numbers miss — I fix, I do not disappear.',
    },
  ],
  intakeCopy: {
    title: 'Qualification brief',
    next: 'Next',
    back: 'Back',
    submit: 'Send brief',
    submitting: 'Sending…',
    thanksTitle: 'Thanks — I have context',
    thanksBody:
      'Within one business day you will get a first sketch of a solution — with a proposed scope and range — and a time for a 20-minute audit.',
  },
  intakeSteps: [
    {
      id: 'company',
      title: 'Your company',
      hint: 'Briefly — who you are and how many people run operations today.',
      fields: [
        {
          id: 'industry',
          label: 'Industry',
          type: 'select',
          required: true,
          options: [
            'Hotels / short-term rental',
            'Professional services / B2B',
            'E-commerce / retail',
            'Digital product / online app',
            'Other industry',
          ],
        },
        {
          id: 'companyName',
          label: 'Company / site',
          type: 'text',
          required: true,
          placeholder: 'Company name or website',
        },
        {
          id: 'teamSize',
          label: 'Team size',
          type: 'select',
          required: true,
          options: ['Just me', '2–5 people', '6–20 people', '20+ people'],
        },
      ],
    },
    {
      id: 'problem',
      title: 'Problem',
      hint: 'Where it actually hurts today — without that we cannot count ROI.',
      fields: [
        {
          id: 'projectType',
          label: 'What do you want to improve',
          type: 'select',
          required: true,
          options: [
            'Company website / brochure site with a form',
            'Site / landing built for conversion',
            'Booking on your own site / payments',
            'Ops panel or integrations',
            'Guest assistant / support automation',
            'Audit and priorities before a build',
          ],
        },
        {
          id: 'pain',
          label: 'What is burning time or money today?',
          type: 'textarea',
          required: true,
          placeholder:
            'e.g. 40 guest emails a day, invoices in Excel, no booking on the site, too much manual handling…',
        },
        {
          id: 'currentTools',
          label: 'What do you use today?',
          type: 'text',
          required: false,
          placeholder: 'Excel, Booking.com, wFirma, WordPress…',
        },
      ],
    },
    {
      id: 'scale',
      title: 'Scale',
      hint: 'Budget and timing ranges so we do not spend a day matching the wrong box.',
      fields: [
        {
          id: 'budget',
          label: 'Net budget',
          type: 'select',
          required: true,
          options: [
            '2,500–6,000 PLN — audit',
            '6,500–12,000 PLN — company website',
            '25,000–60,000 PLN — conversion / direct booking',
            '60,000–180,000+ PLN — system / integrations',
            'I don’t know — I want to calculate ROI',
          ],
        },
        {
          id: 'timeline',
          label: 'When do you want to start',
          type: 'select',
          required: true,
          options: ['Now / within 30 days', '1–3 months', '3+ months', 'Audit first'],
        },
        {
          id: 'successMetric',
          label: 'How will you know the project worked?',
          type: 'select',
          required: true,
          options: [
            'More bookings / sales from your own site',
            'Fewer hours of manual handling',
            'Lower cost of customer support',
            'Order in processes and data',
            'I don’t know yet — I want to count it',
          ],
        },
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      hint: 'Where I should send the first sketch and the range.',
      fields: [
        { id: 'name', label: 'Full name', type: 'text', required: true },
        { id: 'email', label: 'Work email', type: 'email', required: true },
        {
          id: 'phone',
          label: 'Phone (optional)',
          type: 'tel',
          required: false,
          placeholder: '+48 …',
        },
      ],
    },
  ],
  navLinks: [
    { href: '#o-mnie', label: 'About' },
    { href: '#uslugi', label: 'What I do' },
    { href: '#realizacje', label: 'Work' },
    { href: '#cennik', label: 'Packages' },
    { href: '#kontakt', label: 'Contact' },
  ],
  menuLinks: [
    { href: '#o-mnie', label: 'About', num: '01' },
    { href: '#uslugi', label: 'What I do', num: '02' },
    { href: '#realizacje', label: 'Work', num: '03' },
    { href: '#cennik', label: 'Packages', num: '04' },
    { href: '#kontakt', label: 'Contact', num: '05' },
  ],
}

export const uaArchiveFields: ArchiveFields = {
  sections: {
    about: {
      num: '01',
      title: 'Про мене',
      lead: 'Одна людина, повне впровадження — від аудиту процесу до продакшену.',
    },
    services: {
      num: '02',
      title: 'Що роблю для вашої компанії',
      lead: 'Три опори: сучасний сайт, який продає, менше ручної роботи, ШІ під контролем.',
    },
    work: {
      num: '03',
      title: 'Роботи в продакшені',
      lead: 'Чотири системи, які вже працюють — з годинами і PLN там, де це можна чесно порахувати.',
    },
    process: {
      num: '05',
      title: 'Як виглядає співпраця',
      lead: 'Без «discovery» на пів року. Від аудиту до першого вимірюваного ефекту.',
    },
    pricing: {
      num: '04',
      title: 'Пакети та поріг входу',
      lead: 'Вилки до розмови — від сайту-візитки для малої компанії до операційної системи. Кожен пакет має ясний обсяг сторінок і функцій; без прихованих витрат і без шаблону з маркетплейсу.',
    },
    testimonials: {
      num: '06',
      title: 'Доказ, не декларації',
      lead: 'Замість вставлених відгуків — живі впровадження, які можна клікнути, і умови, на яких працюю.',
    },
    faq: {
      num: '07',
      title: 'Питання власників компаній',
      lead: 'Те, про що питаєте перед першою розмовою — відповіді без театру.',
    },
    contact: {
      num: '08',
      title: 'Контакт',
      lead: 'Напишіть, що сьогодні з’їдає час — на аудиті перевіримо, чи можна це повернути за 90 днів і чи бюджет має сенс.',
    },
  },
  process: [
    {
      num: '01',
      title: '20-хв аудит (безкоштовно)',
      description:
        'Говоримо про те, що сьогодні з’їдає час: телефони, рахунки, бронювання, звіти. Наприкінці: оцінка годин до вивільнення і який пакет має сенс — від візитки до операційної системи.',
    },
    {
      num: '02',
      title: 'План на 90 днів',
      description:
        'Один документ: обсяг, інтеграції, перший вимірюваний ефект (наприклад бронювання наживо або е-рахунки до відомства). Без «фази відкриття» на квартал.',
    },
    {
      num: '03',
      title: 'Впровадження в продакшені',
      description:
        'Короткі ітерації, доступ до тестової версії перед стартом, навчання 1–2 год для вашої команди. Не залишаю вас із PDF «як цим користуватися».',
    },
    {
      num: '04',
      title: 'Вимір після старту',
      description:
        'Порівнюємо «до/після»: час на обслуговування, кількість листів, конверсія із сайту. Якщо цифри не сідають — виправляю, не зникаю.',
    },
  ],
  intakeCopy: {
    title: 'Кваліфікаційний бриф',
    next: 'Далі',
    back: 'Назад',
    submit: 'Надіслати бриф',
    submitting: 'Надсилаю…',
    thanksTitle: 'Дякую — маю контекст',
    thanksBody:
      'Протягом 1 робочого дня надішлю перший ескіз рішення — з пропонованим обсягом і вилкою — та термін 20-хвилинного аудиту.',
  },
  intakeSteps: [
    {
      id: 'company',
      title: 'Ваша компанія',
      hint: 'Коротко — хто ви і скільки людей сьогодні веде операцію.',
      fields: [
        {
          id: 'industry',
          label: 'Галузь',
          type: 'select',
          required: true,
          options: [
            'Готелі / короткострокова оренда',
            'Професійні послуги / B2B',
            'E-commerce / продаж',
            'Цифровий продукт / онлайн-застосунок',
            'Інша галузь',
          ],
        },
        {
          id: 'companyName',
          label: 'Компанія / сайт',
          type: 'text',
          required: true,
          placeholder: 'Назва компанії або адреса сайту',
        },
        {
          id: 'teamSize',
          label: 'Розмір команди',
          type: 'select',
          required: true,
          options: ['Лише я', '2–5 осіб', '6–20 осіб', '20+ осіб'],
        },
      ],
    },
    {
      id: 'problem',
      title: 'Проблема',
      hint: 'Де сьогодні реально болить — без цього не порахуємо ROI.',
      fields: [
        {
          id: 'projectType',
          label: 'Що хочете покращити',
          type: 'select',
          required: true,
          options: [
            'Корпоративний сайт / візитка з формою',
            'Сайт / лендінг під конверсію',
            'Бронювання на власному сайті / оплата',
            'Операційна панель або інтеграції',
            'Асистент для гостей / автоматизація обслуговування',
            'Аудит і пріоритети перед впровадженням',
          ],
        },
        {
          id: 'pain',
          label: 'Що сьогодні з’їдає час або гроші?',
          type: 'textarea',
          required: true,
          placeholder:
            'Наприклад 40 листів на день від гостей, рахунки в Excel, немає бронювання на сайті, забагато ручної роботи…',
        },
        {
          id: 'currentTools',
          label: 'Чим користуєтесь сьогодні?',
          type: 'text',
          required: false,
          placeholder: 'Excel, Booking.com, wFirma, WordPress…',
        },
      ],
    },
    {
      id: 'scale',
      title: 'Масштаб',
      hint: 'Вилки бюджету і часу, щоб не витратити день на не ту коробку.',
      fields: [
        {
          id: 'budget',
          label: 'Бюджет нетто',
          type: 'select',
          required: true,
          options: [
            '2 500–6 000 PLN — аудит',
            '6 500–12 000 PLN — корпоративний сайт',
            '25 000–60 000 PLN — конверсія / власне бронювання',
            '60 000–180 000+ PLN — система / інтеграції',
            'Не знаю — хочу порахувати ROI',
          ],
        },
        {
          id: 'timeline',
          label: 'Коли хочете стартувати',
          type: 'select',
          required: true,
          options: ['Зараз / до 30 днів', '1–3 місяці', '3+ місяці', 'Спочатку аудит'],
        },
        {
          id: 'successMetric',
          label: 'По чому пізнаєте, що проєкт вдався?',
          type: 'select',
          required: true,
          options: [
            'Більше бронювань / продажів із власного сайту',
            'Менше годин ручного обслуговування',
            'Нижча вартість обслуговування клієнта',
            'Порядок у процесах і даних',
            'Ще не знаю — хочу це порахувати',
          ],
        },
      ],
    },
    {
      id: 'contact',
      title: 'Контакт',
      hint: 'Куди надіслати перший ескіз і вилку.',
      fields: [
        { id: 'name', label: 'Ім’я та прізвище', type: 'text', required: true },
        { id: 'email', label: 'Робочий e-mail', type: 'email', required: true },
        {
          id: 'phone',
          label: 'Телефон (необов’язково)',
          type: 'tel',
          required: false,
          placeholder: '+48 …',
        },
      ],
    },
  ],
  navLinks: [
    { href: '#o-mnie', label: 'Про мене' },
    { href: '#uslugi', label: 'Що роблю' },
    { href: '#realizacje', label: 'Роботи' },
    { href: '#cennik', label: 'Пакети' },
    { href: '#kontakt', label: 'Контакт' },
  ],
  menuLinks: [
    { href: '#o-mnie', label: 'Про мене', num: '01' },
    { href: '#uslugi', label: 'Що роблю', num: '02' },
    { href: '#realizacje', label: 'Роботи', num: '03' },
    { href: '#cennik', label: 'Пакети', num: '04' },
    { href: '#kontakt', label: 'Контакт', num: '05' },
  ],
}
