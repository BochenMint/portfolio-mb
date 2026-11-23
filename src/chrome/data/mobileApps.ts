export type StoreId = 'app-store' | 'play'

export type MobileShot = {
  src: string
  alt: string
  width: number
  height: number
}

export type MobileApp = {
  id: 'plumm' | 'mint'
  title: string
  tagline: string
  pain: string
  approach: string
  result: string
  shots: MobileShot[]
  stores: { id: StoreId; href: string }[]
}

const plummStores: MobileApp['stores'] = [
  { id: 'app-store', href: 'https://apps.apple.com/app/plumm/id6791688022' },
  { id: 'play', href: 'https://play.google.com/store/apps/details?id=pl.plumm.app' },
]

const mintStores: MobileApp['stores'] = [
  { id: 'app-store', href: 'https://apps.apple.com/app/mint-apartments/id6828503313' },
  { id: 'play', href: 'https://play.google.com/store/apps/details?id=pl.mintapartments.app' },
]

const plummSrc = {
  dashboard: '/apps/plumm/dashboard.webp',
  scan: '/apps/plumm/scan.webp',
  mail: '/apps/plumm/mail.webp',
} as const

const mintSrc = {
  discover: '/apps/mint/discover.webp',
  stay: '/apps/mint/stay.webp',
  concierge: '/apps/mint/concierge.webp',
} as const

/** Store screenshots. Plumm frames are 720×1564, Mint frames are 720×1566. */
export const mobileApps: MobileApp[] = [
  {
    id: 'plumm',
    title: 'Plumm',
    tagline: 'Księgowość w telefonie. To samo konto co na plumm.pl.',
    pain: 'Faktury, podatki i poczta firmowa były w przeglądarce. W drodze, przy paragonie albo przy mailu z urzędu, zostawał telefon i nic, co da się zrobić od razu.',
    approach:
      'Natywna aplikacja na iOS i Android, na tym samym koncie co panel na plumm.pl. Pulpit podatków, skan paragonu prosto do księgowości, firmowa poczta i CRM. Logowanie biometryczne i weryfikacja dwuetapowa.',
    result:
      'Księgowość, której używasz z telefonu: zdjęcie paragonu, faktura w poczcie i termin VAT albo ZUS, zanim wrócisz do biurka. Aplikacja jest w App Store i Google Play.',
    shots: [
      {
        src: plummSrc.dashboard,
        width: 720,
        height: 1564,
        alt: 'Pulpit aplikacji Plumm: przychód, koszty, VAT do zapłaty, zaliczka PIT i składki ZUS.',
      },
      {
        src: plummSrc.scan,
        width: 720,
        height: 1564,
        alt: 'Ekran skanu paragonu w aplikacji Plumm. Zdjęcie trafia do księgowości.',
      },
      {
        src: plummSrc.mail,
        width: 720,
        height: 1564,
        alt: 'Poczta w aplikacji Plumm: wątki od kontrahenta, urzędu skarbowego i ZUS.',
      },
    ],
    stores: plummStores,
  },
  {
    id: 'mint',
    title: 'Mint Apartments',
    tagline: 'Rezerwacja, meldunek i klucz do apartamentu w Gdańsku.',
    pain: 'Gość z rezerwacją z portalu i tak musiał dostać kod, instrukcję i klucz. Strona przyjmowała rezerwację, ale nie otwierała drzwi.',
    approach:
      'Aplikacja na iOS i Android: katalog apartamentów, cena na żywo, płatność PayU, meldunek na ekranie i klucz do drzwi po check-inie. Wchodzisz numerem rezerwacji i e-mailem, także z Booking.com i Airbnb. Osiem języków.',
    result:
      'Od wyboru apartamentu do otwarcia drzwi wszystko jest w telefonie. Concierge odpowiada o pobycie; pilna sprawa idzie na WhatsApp. Aplikacja jest w App Store i Google Play.',
    shots: [
      {
        src: mintSrc.discover,
        width: 720,
        height: 1566,
        alt: 'Ekran startowy aplikacji Mint Apartments: termin i liczba gości w Gdańsku.',
      },
      {
        src: mintSrc.stay,
        width: 720,
        height: 1566,
        alt: 'Pobyt w aplikacji Mint Apartments: opłacona rezerwacja i meldunek online, który odblokowuje klucz do drzwi.',
      },
      {
        src: mintSrc.concierge,
        width: 720,
        height: 1566,
        alt: 'Concierge w aplikacji Mint Apartments: czat o apartamencie i pobycie.',
      },
    ],
    stores: mintStores,
  },
]

export const mobileAppsEn: MobileApp[] = [
  {
    id: 'plumm',
    title: 'Plumm',
    tagline: 'Accounting in your pocket. The same account as plumm.pl.',
    pain: 'Invoices, tax and company mail lived in the browser. On the road, with a receipt or a letter from the tax office, the phone was in your hand and there was nothing you could finish there.',
    approach:
      'A native iOS and Android app on the same account as the plumm.pl panel. Tax dashboard, a receipt photo straight into the books, company mail and CRM. Biometric sign-in and two-step verification.',
    result:
      'The books, from the phone: photograph a receipt, open an invoice from mail, and see the VAT or ZUS deadline before you are back at a desk. The app is on the App Store and Google Play.',
    shots: [
      {
        src: plummSrc.dashboard,
        width: 720,
        height: 1564,
        alt: 'Plumm app dashboard: revenue, costs, VAT due, the PIT advance and ZUS contributions.',
      },
      {
        src: plummSrc.scan,
        width: 720,
        height: 1564,
        alt: 'Receipt scan in the Plumm app. The photo goes straight into the books.',
      },
      {
        src: plummSrc.mail,
        width: 720,
        height: 1564,
        alt: 'Mail in the Plumm app: threads from a client, the tax office and ZUS.',
      },
    ],
    stores: plummStores,
  },
  {
    id: 'mint',
    title: 'Mint Apartments',
    tagline: 'Booking, check-in and the apartment key in Gdańsk.',
    pain: 'A guest who booked through a portal still needed a code, instructions and a key. The website took the booking. It did not open the door.',
    approach:
      'An iOS and Android app: the apartment catalogue, a live price, PayU payment, on-screen check-in and a door key once check-in is done. You sign in with a booking number and an email, including bookings from Booking.com and Airbnb. Eight languages.',
    result:
      'From choosing an apartment to opening the door, it happens on the phone. The concierge answers questions about the stay; anything urgent goes to WhatsApp. The app is on the App Store and Google Play.',
    shots: [
      {
        src: mintSrc.discover,
        width: 720,
        height: 1566,
        alt: 'Mint Apartments home screen: dates and guest count for a stay in Gdańsk.',
      },
      {
        src: mintSrc.stay,
        width: 720,
        height: 1566,
        alt: 'A stay in the Mint Apartments app: a paid booking and online check-in that unlocks the door key.',
      },
      {
        src: mintSrc.concierge,
        width: 720,
        height: 1566,
        alt: 'Concierge in the Mint Apartments app: a chat about the apartment and the stay.',
      },
    ],
    stores: mintStores,
  },
]

export const mobileAppsUa: MobileApp[] = [
  {
    id: 'plumm',
    title: 'Plumm',
    tagline: 'Бухгалтерія в телефоні. Той самий обліковий запис, що на plumm.pl.',
    pain: 'Рахунки, податки й робоча пошта були в браузері. У дорозі, з чеком чи листом від податкової, лишався телефон і нічого, що можна зробити одразу.',
    approach:
      'Нативний застосунок на iOS і Android, на тому самому обліковому записі, що й панель на plumm.pl. Панель податків, скан чека прямо в облік, робоча пошта і CRM. Біометричний вхід і двокрокова перевірка.',
    result:
      'Бухгалтерія з телефона: фото чека, рахунок у пошті і строк VAT чи ZUS, перш ніж повернутися до столу. Застосунок є в App Store і Google Play.',
    shots: [
      {
        src: plummSrc.dashboard,
        width: 720,
        height: 1564,
        alt: 'Панель застосунку Plumm: дохід, витрати, VAT до сплати, аванс PIT і внески ZUS.',
      },
      {
        src: plummSrc.scan,
        width: 720,
        height: 1564,
        alt: 'Екран сканування чека в застосунку Plumm. Фото потрапляє в облік.',
      },
      {
        src: plummSrc.mail,
        width: 720,
        height: 1564,
        alt: 'Пошта в застосунку Plumm: листи від контрагента, податкової і ZUS.',
      },
    ],
    stores: plummStores,
  },
  {
    id: 'mint',
    title: 'Mint Apartments',
    tagline: 'Бронювання, заселення і ключ від апартаментів у Ґданську.',
    pain: 'Гість із бронюванням з порталу все одно мав отримати код, інструкцію і ключ. Сайт приймав бронювання, але не відчиняв двері.',
    approach:
      'Застосунок на iOS і Android: каталог апартаментів, жива ціна, оплата PayU, заселення на екрані і ключ від дверей після check-in. Вхід за номером бронювання й е-поштою, також із Booking.com і Airbnb. Вісім мов.',
    result:
      'Від вибору апартаментів до відчинення дверей усе в телефоні. Консьєрж відповідає про перебування; термінова справа йде в WhatsApp. Застосунок є в App Store і Google Play.',
    shots: [
      {
        src: mintSrc.discover,
        width: 720,
        height: 1566,
        alt: 'Стартовий екран застосунку Mint Apartments: дати і кількість гостей у Ґданську.',
      },
      {
        src: mintSrc.stay,
        width: 720,
        height: 1566,
        alt: 'Перебування в застосунку Mint Apartments: оплачене бронювання і онлайн-заселення, яке відмикає ключ від дверей.',
      },
      {
        src: mintSrc.concierge,
        width: 720,
        height: 1566,
        alt: 'Консьєрж у застосунку Mint Apartments: чат про апартаменти і перебування.',
      },
    ],
    stores: mintStores,
  },
]
