import type { Locale } from './locales'
import { studioCopy as studioCopyPl } from '../studio/copy'
import type { ThemeId } from '../studio/themes'

export type StudioCopy = typeof studioCopyPl

export type StudioChrome = StudioCopy & {
  navAria: string
  navWork: string
  navOffer: string
  navPackages: string
  navContact: string
  langAria: string
  proofKicker: string
  workKicker: string
  workTitle: string
  flagshipSuffix: string
  publicSite: string
  noPublicUrl: string
  statusLive: string
  statusInternal: string
  statusOffline: string
  briefGoal: string
  briefResult: string
  briefStatus: string
  statusProduction: string
  statusNoPublicUrl: string
  openSite: string
  chapter: string
  colProject: string
  colDomain: string
  colResult: string
  colStatus: string
  see: string
  offerKicker: string
  moduleLabel: string
  packagesKicker: string
  packagesAria: string
  colPackage: string
  colScope: string
  colFor: string
  trustKicker: string
  faqKicker: string
  contactKicker: string
  contactTitle: string
  auditCalendar: string
  mailFallback: string
  selectPlaceholder: string
  sendError: string
  sendFail: string
  enquiryFallback: string
  metricsAria: string
  hangarAlert: string
  hangarConfirm: string
  hangarDialog: string
  hangarExit: string
  hangarIframe: string
  hangarShipLoading: string
  archiveNote: string
  articlesNav: string
  workSlot: string
  skipToContent: string
  proofLiveAria: string
  proofMintAlt: string
  proofPlummAlt: string
  styleGroups: { now: string; signature: string; archive: string }
  themeLabels: Record<ThemeId, string>
  kickers: Record<string, string>
  themeNotes: Partial<Record<ThemeId, { catalog: string; note: string }>>
}

const pl: StudioChrome = {
  ...studioCopyPl,
  navAria: 'Sekcje',
  navWork: 'Realizacje',
  navOffer: 'Zakres',
  navPackages: 'Pakiety',
  navContact: 'Kontakt',
  langAria: 'Język',
  proofKicker: 'Efekt',
  workKicker: 'Wybrane realizacje',
  workTitle: 'Realizacje w produkcji',
  flagshipSuffix: ' · realizacja wiodąca',
  publicSite: 'Serwis publiczny',
  noPublicUrl: 'Brak publicznego adresu produkcyjnego',
  statusLive: 'live',
  statusInternal: 'wewnętrzny',
  statusOffline: 'offline',
  briefGoal: 'Cel',
  briefResult: 'Wynik',
  briefStatus: 'Status',
  statusProduction: 'produkcja',
  statusNoPublicUrl: 'brak publicznego URL',
  openSite: 'Otwórz serwis',
  chapter: 'Rozdział',
  colProject: 'Projekt',
  colDomain: 'Domena',
  colResult: 'Wynik',
  colStatus: 'Status',
  see: 'Zobacz',
  offerKicker: 'Zakres odpowiedzialności',
  moduleLabel: 'MODUŁ',
  packagesKicker: 'Budżet i zakres',
  packagesAria: 'Pakiety',
  colPackage: 'Pakiet',
  colScope: 'Zakres',
  colFor: 'Dla kogo',
  trustKicker: 'Weryfikacja',
  faqKicker: 'Przed rozpoczęciem',
  contactKicker: 'Rozmowa robocza',
  contactTitle: 'Kontakt',
  auditCalendar: 'Kalendarz audytu',
  mailFallback: 'Jeżeli klient poczty się nie otworzył, proszę o wiadomość na {email}.',
  selectPlaceholder: 'Wybierz',
  sendError: 'Błąd wysyłki.',
  sendFail: 'Wysyłka nie powiodła się.',
  enquiryFallback: 'zapytanie',
  metricsAria: 'Skrót metryk i wejście',
  hangarAlert: 'Sektor hangarowy',
  hangarConfirm: 'Zatwierdź',
  hangarDialog: 'Hangar 3D',
  hangarExit: 'Powrót do oferty · Esc',
  hangarIframe: 'Misja: nowa strona',
  hangarShipLoading: 'Model ładuje się z hangaru',
  archiveNote: 'To archiwum wizualne. Aktualna strona:',
  articlesNav: 'Artykuły',
  workSlot: 'SLOT',
  skipToContent: 'Przejdź do treści',
  proofLiveAria: 'Wdrożenia na produkcji — Mint Apartments i Plumm',
  proofMintAlt:
    'Mint Apartments — strona rezerwacji 36 apartamentów w Gdańsku, check-in na własnej domenie',
  proofPlummAlt: 'Plumm — panel firmy: księgowość, e-faktury, CRM i asystent podatkowy',
  styleGroups: { now: 'Aktualne', signature: 'Sygnatury', archive: 'Archiwum' },
  themeLabels: {
    swiss: 'Editorial szwajcarski',
    liquid: 'Ciekłe szkło',
    glass: 'Glassmorphism',
    retro: 'Retrofuturyzm',
    brutal: 'Neobrutalizm',
    pixel: 'Pixel art',
    massive: 'Massive Effects',
    v1: 'V1',
    v2: 'V2',
    v3: 'V3',
    v5: 'V5 VOLT',
  },
  kickers: {
    swiss: 'Marcin Bochenek · strony i systemy dla firm',
    liquid: 'Projektowanie i wdrożenie',
    glass: 'Marcin Bochenek · systemy cyfrowe dla firm',
    retro: 'Marcin Bochenek · inżynieria oprogramowania',
    brutal: 'Marcin Bochenek · projekt, kod, wdrożenie',
    pixel: 'Marcin Bochenek · studio MB',
    massive: 'Marcin Bochenek · wdrożenia cyfrowe',
    v1: 'Marcin Bochenek · wybrane realizacje',
    v2: 'Marcin Bochenek · oferta operatorska',
    v3: 'Marcin Bochenek · projektowanie systemów',
    v5: 'Marcin Bochenek · wdrożenia dla firm',
  },
  themeNotes: {
    swiss: { catalog: 'Typografia i siatka', note: 'Hierarchia bez ozdób. Najczytelniejszy kierunek sprzedażowy.' },
    liquid: { catalog: 'Światło i przestrzeń', note: 'Jasne pole, subtelne refrakcje. Bez ozdobników.' },
    glass: { catalog: 'Panel operacyjny', note: 'Ciemne tło, nasycone źródła światła za matowymi taflami.' },
    retro: { catalog: 'Horyzont i neon', note: 'Perspektywa, zachód słońca, interfejs z epoki wczesnej cyfryzacji.' },
    brutal: { catalog: 'Typografia przemysłowa', note: 'Swiss-industrial: siatka, kontrast, bez naklejek i przesady.' },
    pixel: { catalog: 'Stacja robocza MB', note: 'Raster i gęstość operatorska — nie zabawka.' },
    massive: { catalog: 'Kokpit i hangar', note: 'Wejście przez scenę 3D. Oferta w tym samym zakresie treści.' },
    v1: { catalog: 'Editorial ciemny', note: 'Serif, kadr filmowy, wolna oś narracji.' },
    v2: { catalog: 'Konsola operatorska', note: 'Gęstość informacji, siatka, bez kostiumu terminala.' },
    v3: { catalog: 'Las i złoto', note: 'Cięte płaszczyzny, plisy świetlne, pole za szkłem.' },
    v5: { catalog: 'Kampania chromatyczna', note: 'Tangerine, acid, skala plakatu.' },
  },
}

const en: StudioChrome = {
  kicker: 'Marcin Bochenek · software engineering',
  heroLead:
    'I design and ship websites, conversion funnels and ops systems for companies. Before work starts we lock scope, budget and how the result will be measured.',
  proofTitle: 'The result has to be countable',
  proofLead: 'Figures below are directional. The real baseline comes from your numbers on the audit.',
  workLead:
    'Mint Apartments and Plumm are live. iDrive is waiting to launch; Agentic OS is an internal tool.',
  offerTitle: 'Scope of work',
  packagesTitle: 'Packages and entry point',
  trustTitle: 'How we work',
  faqTitle: 'Questions before a brief',
  contactLead:
    'Describe the process that currently burns time or caps revenue. I will say whether I see grounds to build, and what scope makes sense.',
  styleLabel: 'Presentation',
  styleHint: 'Same offer — a different visual layer.',
  hangarCta: 'Enter the hangar',
  hangarLead: 'Interactive scope walkthrough in a 3D environment.',
  navAria: 'Sections',
  navWork: 'Work',
  navOffer: 'Scope',
  navPackages: 'Packages',
  navContact: 'Contact',
  langAria: 'Language',
  proofKicker: 'Outcome',
  workKicker: 'Selected work',
  workTitle: 'In production',
  flagshipSuffix: ' · flagship',
  publicSite: 'Live site',
  noPublicUrl: 'No public production URL',
  statusLive: 'live',
  statusInternal: 'internal',
  statusOffline: 'offline',
  briefGoal: 'Goal',
  briefResult: 'Result',
  briefStatus: 'Status',
  statusProduction: 'production',
  statusNoPublicUrl: 'no public URL',
  openSite: 'Open site',
  chapter: 'Chapter',
  colProject: 'Project',
  colDomain: 'Domain',
  colResult: 'Result',
  colStatus: 'Status',
  see: 'View',
  offerKicker: 'What I own',
  moduleLabel: 'MODULE',
  packagesKicker: 'Budget and scope',
  packagesAria: 'Packages',
  colPackage: 'Package',
  colScope: 'Range',
  colFor: 'Best for',
  trustKicker: 'Proof',
  faqKicker: 'Before we start',
  contactKicker: 'Working call',
  contactTitle: 'Contact',
  auditCalendar: 'Audit calendar',
  mailFallback: 'If your mail client did not open, please write to {email}.',
  selectPlaceholder: 'Select',
  sendError: 'Send failed.',
  sendFail: 'Could not send the brief.',
  enquiryFallback: 'enquiry',
  metricsAria: 'Metric snapshot and entry',
  hangarAlert: 'Hangar sector',
  hangarConfirm: 'Confirm',
  hangarDialog: '3D hangar',
  hangarExit: 'Back to the offer · Esc',
  hangarIframe: 'Mission: new site',
  hangarShipLoading: 'Model is loading from the hangar',
  archiveNote: 'This is a visual archive. Current site:',
  articlesNav: 'Articles',
  workSlot: 'SLOT',
  skipToContent: 'Skip to content',
  proofLiveAria: 'Live production work — Mint Apartments and Plumm',
  proofMintAlt:
    'Mint Apartments — booking site for 36 apartments in Gdańsk, check-in on the operator’s own domain',
  proofPlummAlt: 'Plumm — company panel: bookkeeping, e-invoices, CRM and tax assistant',
  styleGroups: { now: 'Current', signature: 'Signatures', archive: 'Archive' },
  themeLabels: {
    swiss: 'Swiss Editorial',
    liquid: 'Liquid Glass',
    glass: 'Glassmorphism',
    retro: 'Retrofuturism',
    brutal: 'Neo-brutalism',
    pixel: 'Pixel Art',
    massive: 'Massive Effects',
    v1: 'V1',
    v2: 'V2',
    v3: 'V3',
    v5: 'V5 VOLT',
  },
  kickers: {
    swiss: 'Marcin Bochenek · websites and systems for companies',
    liquid: 'Design and delivery',
    glass: 'Marcin Bochenek · digital systems for companies',
    retro: 'Marcin Bochenek · software engineering',
    brutal: 'Marcin Bochenek · design, code, delivery',
    pixel: 'Marcin Bochenek · MB studio',
    massive: 'Marcin Bochenek · digital delivery',
    v1: 'Marcin Bochenek · selected work',
    v2: 'Marcin Bochenek · operator offer',
    v3: 'Marcin Bochenek · systems design',
    v5: 'Marcin Bochenek · delivery for companies',
  },
  themeNotes: {
    swiss: { catalog: 'Typography and grid', note: 'Hierarchy without decoration. The clearest sales-facing direction.' },
    liquid: { catalog: 'Light and space', note: 'Bright field, quiet refraction. No ornaments.' },
    glass: { catalog: 'Ops panel', note: 'Dark ground, saturated light behind frosted planes.' },
    retro: { catalog: 'Horizon and neon', note: 'Perspective, sunset, early-digital interface.' },
    brutal: { catalog: 'Industrial type', note: 'Swiss-industrial: grid, contrast, no stickers.' },
    pixel: { catalog: 'MB workstation', note: 'Raster and operator density — not a toy.' },
    massive: { catalog: 'Cockpit and hangar', note: 'Entry through a 3D scene. Same content scope.' },
    v1: { catalog: 'Dark editorial', note: 'Serif, film frame, slow narrative axis.' },
    v2: { catalog: 'Ops console', note: 'Information density, grid, no terminal costume.' },
    v3: { catalog: 'Forest and gold', note: 'Cut planes, pleated light, field behind glass.' },
    v5: { catalog: 'Chromatic campaign', note: 'Tangerine, acid, poster scale.' },
  },
}

const uk: StudioChrome = {
  kicker: 'Марцін Бохенек · інженерія програмного забезпечення',
  heroLead:
    'Проєктую і впроваджую сайти, воронки конверсії та операційні системи для компаній. Перед стартом фіксуємо обсяг, бюджет і спосіб виміру результату.',
  proofTitle: 'Результат має піддаватися підрахунку',
  proofLead: 'Нижче — орієнтири. Реальну базу рахую з цифр вашої компанії на аудиті.',
  workLead:
    'У відкритому доступі працюють Mint Apartments і Plumm. iDrive чекає на запуск, Agentic OS — внутрішній інструмент.',
  offerTitle: 'Обсяг робіт',
  packagesTitle: 'Пакети та поріг входу',
  trustTitle: 'Умови співпраці',
  faqTitle: 'Питання перед брифом',
  contactLead:
    'Опишіть процес, який сьогодні з’їдає час або обмежує продажі. Відповім, чи бачу підстави для впровадження і який обсяг має сенс.',
  styleLabel: 'Презентація',
  styleHint: 'Та сама пропозиція — інший візуальний шар.',
  hangarCta: 'Увійти до ангара',
  hangarLead: 'Інтерактивна презентація обсягу в 3D-середовищі.',
  navAria: 'Розділи',
  navWork: 'Роботи',
  navOffer: 'Обсяг',
  navPackages: 'Пакети',
  navContact: 'Контакт',
  langAria: 'Мова',
  proofKicker: 'Ефект',
  workKicker: 'Вибрані роботи',
  workTitle: 'Роботи в продакшені',
  flagshipSuffix: ' · ключова робота',
  publicSite: 'Публічний сервіс',
  noPublicUrl: 'Немає публічної продакшен-адреси',
  statusLive: 'live',
  statusInternal: 'внутрішній',
  statusOffline: 'offline',
  briefGoal: 'Мета',
  briefResult: 'Результат',
  briefStatus: 'Статус',
  statusProduction: 'продакшен',
  statusNoPublicUrl: 'немає публічного URL',
  openSite: 'Відкрити сервіс',
  chapter: 'Розділ',
  colProject: 'Проєкт',
  colDomain: 'Домен',
  colResult: 'Результат',
  colStatus: 'Статус',
  see: 'Переглянути',
  offerKicker: 'Зона відповідальності',
  moduleLabel: 'МОДУЛЬ',
  packagesKicker: 'Бюджет і обсяг',
  packagesAria: 'Пакети',
  colPackage: 'Пакет',
  colScope: 'Діапазон',
  colFor: 'Для кого',
  trustKicker: 'Перевірка',
  faqKicker: 'Перед стартом',
  contactKicker: 'Робоча розмова',
  contactTitle: 'Контакт',
  auditCalendar: 'Календар аудиту',
  mailFallback: 'Якщо поштовий клієнт не відкрився, напишіть на {email}.',
  selectPlaceholder: 'Оберіть',
  sendError: 'Помилка надсилання.',
  sendFail: 'Не вдалося надіслати бриф.',
  enquiryFallback: 'запит',
  metricsAria: 'Короткі метрики та вхід',
  hangarAlert: 'Сектор ангара',
  hangarConfirm: 'Підтвердити',
  hangarDialog: '3D-ангар',
  hangarExit: 'Повернутися до пропозиції · Esc',
  hangarIframe: 'Місія: новий сайт',
  hangarShipLoading: 'Модель завантажується з ангара',
  archiveNote: 'Це візуальний архів. Актуальний сайт:',
  articlesNav: 'Статті',
  workSlot: 'СЛОТ',
  skipToContent: 'Перейти до змісту',
  proofLiveAria: 'Впровадження в продакшені — Mint Apartments і Plumm',
  proofMintAlt:
    'Mint Apartments — сайт бронювання 36 апартаментів у Гданську, заселення на власному домені',
  proofPlummAlt: 'Plumm — панель компанії: бухгалтерія, e-фактури, CRM і податковий асистент',
  styleGroups: { now: 'Поточні', signature: 'Сигнатури', archive: 'Архів' },
  themeLabels: {
    swiss: 'Швейцарський editorial',
    liquid: 'Рідке скло',
    glass: 'Скломорфізм',
    retro: 'Ретрофутуризм',
    brutal: 'Необруталізм',
    pixel: 'Піксель-арт',
    massive: 'Massive Effects',
    v1: 'V1',
    v2: 'V2',
    v3: 'V3',
    v5: 'V5 VOLT',
  },
  kickers: {
    swiss: 'Марцін Бохенек · сайти та системи для бізнесу',
    liquid: 'Проєктування та впровадження',
    glass: 'Марцін Бохенек · цифрові системи для компаній',
    retro: 'Марцін Бохенек · інженерія програмного забезпечення',
    brutal: 'Марцін Бохенек · дизайн, код, впровадження',
    pixel: 'Марцін Бохенек · студія MB',
    massive: 'Марцін Бохенек · цифрові впровадження',
    v1: 'Марцін Бохенек · вибрані роботи',
    v2: 'Марцін Бохенек · операторська пропозиція',
    v3: 'Марцін Бохенек · проєктування систем',
    v5: 'Марцін Бохенек · впровадження для компаній',
  },
  themeNotes: {
    swiss: { catalog: 'Типографія і сітка', note: 'Ієрархія без прикрас. Найчиткіший продажевий напрям.' },
    liquid: { catalog: 'Світло і простір', note: 'Світле поле, стримані рефракції. Без орнаменту.' },
    glass: { catalog: 'Операційна панель', note: 'Темний фон, насичене світло за матовими площинами.' },
    retro: { catalog: 'Горизонт і неон', note: 'Перспектива, захід сонця, інтерфейс ранньої цифровізації.' },
    brutal: { catalog: 'Промислова типографія', note: 'Swiss-industrial: сітка, контраст, без наліпок.' },
    pixel: { catalog: 'Робоча станція MB', note: 'Растр і операторська щільність — не іграшка.' },
    massive: { catalog: 'Кокпіт і ангар', note: 'Вхід через 3D-сцену. Той самий зміст пропозиції.' },
    v1: { catalog: 'Темний editorial', note: 'Антиква, кінокадр, повільна наративна вісь.' },
    v2: { catalog: 'Операторська консоль', note: 'Щільність інформації, сітка, без костюма термінала.' },
    v3: { catalog: 'Ліс і золото', note: 'Зрізи площин, складки світла, поле за склом.' },
    v5: { catalog: 'Хроматична кампанія', note: 'Tangerine, acid, масштаб плаката.' },
  },
}

const chrome: Record<Locale, StudioChrome> = { pl, en, ua: uk }

const cache = new Map<Locale, StudioChrome>()

export function getStudioUi(locale: Locale): StudioChrome {
  const hit = cache.get(locale)
  if (hit) return hit
  cache.set(locale, chrome[locale])
  return chrome[locale]
}

export function tChrome<K extends keyof StudioChrome>(locale: Locale, key: K): StudioChrome[K] {
  return getStudioUi(locale)[key]
}
