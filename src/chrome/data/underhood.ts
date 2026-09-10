/**
 * "Pod maška" / "Under the hood" section — an exploded-view F1 car where
 * every part stands for a layer of a website that actually works. Content
 * only; the 3D scene and React section live elsewhere. All proof points
 * are facts already present in `content.ts` / `facts.ts` — nothing here is
 * invented.
 */

export type UnderhoodPartId =
  | 'body'
  | 'frontWing'
  | 'rearWing'
  | 'wheels'
  | 'powerUnit'
  | 'engineCover'
  | 'halo'
  | 'steering'

export type UnderhoodLayer = {
  id: UnderhoodPartId
  part: string
  title: string
  thesis: string
  proof: string
  tags: string[]
}

export type UnderhoodCopy = {
  eyebrow: string
  title: string
  lead: string
  hint: string
  hintTouch: string
  proofLabel: string
  partLabel: string
  layers: UnderhoodLayer[]
}

export const underhoodByLocale: Record<'pl' | 'en' | 'uk', UnderhoodCopy> = {
  pl: {
    eyebrow: 'Pod maską',
    title: 'Ładny landing to tylko karoseria.',
    lead: 'Bolid wygrywa tym, czego nie widać z trybun. Strona tak samo: to, co pod spodem, decyduje, czy jest szybka, czy znajdą ją Google i modele AI, i czy zamienia odwiedziny w zapytania. Przewiń, żeby rozłożyć ją na części.',
    hint: 'Najedź na część, żeby zobaczyć, za co odpowiada',
    hintTouch: 'Dotknij części, żeby zobaczyć, za co odpowiada',
    proofLabel: 'Z produkcji',
    partLabel: 'Część',
    layers: [
      {
        id: 'body',
        part: 'Karoseria',
        title: 'Design i UX',
        thesis:
          'To, co widać w pierwsze trzy sekundy: hierarchia, typografia, wersja mobilna. Ma być ładnie, ale to skorupa na tym, co niżej.',
        proof: 'Mint Apartments: jeden design, osiem wersji językowych.',
        tags: ['Astro', 'React', 'Tailwind', 'WCAG'],
      },
      {
        id: 'frontWing',
        part: 'Przednie skrzydło',
        title: 'Szybkość',
        thesis:
          'Przednie skrzydło ustawia przepływ dla całego bolidu. Na stronie robi to wydajność: szybki pierwszy render, obrazy WebP, bez zbędnego JavaScriptu. Google mierzy to, zanim przeczyta treść.',
        proof: 'Mint Apartments: statyczny build Astro z Lighthouse CI w pipeline zamiast ciężkiego CMS-a.',
        tags: ['Core Web Vitals', 'WebP', 'statyczny build', 'cache'],
      },
      {
        id: 'rearWing',
        part: 'Tylne skrzydło',
        title: 'Widoczność: Google i modele AI',
        thesis:
          'Docisk, który trzyma bolid na torze. Dla strony to schema.org, hreflang, sitemap, llms.txt i treść, którą ChatGPT czy Perplexity potrafią zacytować. Bez tego najładniejsza strona jest niewidzialna.',
        proof: 'Ta strona: JSON-LD, llms.txt, trzy języki z hreflang; Mint Apartments: 592 wpisy bloga w wielu językach.',
        tags: ['schema.org', 'hreflang', 'llms.txt', 'GEO'],
      },
      {
        id: 'wheels',
        part: 'Opony',
        title: 'Konwersja',
        thesis:
          'Jedyne miejsce, gdzie moc styka się z asfaltem. Na stronie: wezwanie do działania, formularz, kalendarz, rezerwacja na własnej domenie. Reszta istnieje po to, żeby ten kontakt zamienił się w zapytanie albo rezerwację.',
        proof: 'Mint Apartments: direct booking przez Previo zamiast prowizji dla portali.',
        tags: ['direct booking', 'formularz', 'Cal.com', 'kwalifikacja leadów'],
      },
      {
        id: 'powerUnit',
        part: 'Jednostka napędowa',
        title: 'Technologia pod spodem',
        thesis: 'Integracje, dane, API, bezpieczeństwo. To decyduje, czy strona jest narzędziem, czy broszurą.',
        proof: 'Plumm: 118 modeli danych, 456 endpointów API, 16 silników deklaracji walidowanych XSD.',
        tags: ['TypeScript', 'Prisma', 'API', 'KSeF'],
      },
      {
        id: 'engineCover',
        part: 'Pokrywa silnika',
        title: 'Proces i wdrożenia',
        thesis:
          'Wyścig wygrywa się też w boksie. Testy, CI, wdrożenie z jednego pusha, iteracje co tydzień, nie raz na rok.',
        proof: 'Plumm: 9 314 testów w CI; Mint Apartments i to portfolio: deploy przez push na branch production.',
        tags: ['CI/CD', 'testy', 'GitHub Actions', 'staging'],
      },
      {
        id: 'halo',
        part: 'Halo',
        title: 'Bezpieczeństwo i kontrola',
        thesis:
          'Halo chroni kierowcę. Na stronie: RODO, hosting w Unii, kopie zapasowe, AI z listą dozwolonych akcji i eskalacją do człowieka.',
        proof: 'Plumm i Mint Apartments: dane w UE, asystenci AI z zapisem każdego kroku.',
        tags: ['RODO', 'EU hosting', 'HITL', 'audit log'],
      },
      {
        id: 'steering',
        part: 'Kierownica i telemetria',
        title: 'Pomiar',
        thesis: 'Bez telemetrii nie wiesz, czy jest szybciej. Zdarzenia, konwersje, porównanie przed i po. Raport zamiast wrażenia.',
        proof: 'Każde wdrożenie kończy się pomiarem przed/po: GA4, zdarzenia, Search Console.',
        tags: ['GA4', 'Search Console', 'zdarzenia', 'przed/po'],
      },
    ],
  },
  en: {
    eyebrow: 'Under the hood',
    title: 'A pretty landing page is just bodywork.',
    lead: 'A car wins with what you can’t see from the stands. A website is the same: what’s underneath decides whether it’s fast, whether Google and AI models find it, and whether visits turn into enquiries. Scroll to take it apart.',
    hint: 'Hover a part to see what it’s responsible for',
    hintTouch: 'Tap a part to see what it’s responsible for',
    proofLabel: 'From production',
    partLabel: 'Part',
    layers: [
      {
        id: 'body',
        part: 'Bodywork',
        title: 'Design & UX',
        thesis:
          'What you see in the first three seconds: hierarchy, typography, the mobile version. It has to look good, but it’s a shell over everything below it.',
        proof: 'Mint Apartments: one design, eight language versions.',
        tags: ['Astro', 'React', 'Tailwind', 'WCAG'],
      },
      {
        id: 'frontWing',
        part: 'Front wing',
        title: 'Speed',
        thesis:
          'The front wing sets airflow for the whole car. On a website, that’s performance: a fast first render, WebP images, no bloated JavaScript. Google measures this before it reads a word of your content.',
        proof: 'Mint Apartments: a static Astro build with Lighthouse CI in the pipeline instead of a heavy CMS.',
        tags: ['Core Web Vitals', 'WebP', 'static build', 'caching'],
      },
      {
        id: 'rearWing',
        part: 'Rear wing',
        title: 'Visibility: Google and AI models',
        thesis:
          'Downforce that keeps the car on the track. For a website, that’s schema.org, hreflang, a sitemap, llms.txt, and content that ChatGPT or Perplexity can actually cite. Without it, the best-looking site is invisible.',
        proof: 'This site: JSON-LD, llms.txt, three languages with hreflang; Mint Apartments: 592 blog posts across multiple languages.',
        tags: ['schema.org', 'hreflang', 'llms.txt', 'GEO'],
      },
      {
        id: 'wheels',
        part: 'Wheels',
        title: 'Conversion',
        thesis:
          'The only place where power meets the tarmac. On a website: the call to action, the form, the calendar, a booking flow on your own domain. Everything else exists to turn that contact into an enquiry or a booking.',
        proof: 'Mint Apartments: direct booking through Previo instead of paying portal commissions.',
        tags: ['direct booking', 'form', 'Cal.com', 'lead qualification'],
      },
      {
        id: 'powerUnit',
        part: 'Power unit',
        title: 'The technology underneath',
        thesis: 'Integrations, data, APIs, security. This decides whether a website is a tool or a brochure.',
        proof: 'Plumm: 118 data models, 456 API endpoints, 16 declaration engines validated against XSD.',
        tags: ['TypeScript', 'Prisma', 'API', 'KSeF'],
      },
      {
        id: 'engineCover',
        part: 'Engine cover',
        title: 'Process & deployment',
        thesis:
          'Races are also won in the pit lane. Tests, CI, a deploy from a single push, weekly iterations instead of once a year.',
        proof: 'Plumm: 9,314 tests in CI; Mint Apartments and this portfolio: deploy on push to the production branch.',
        tags: ['CI/CD', 'tests', 'GitHub Actions', 'staging'],
      },
      {
        id: 'halo',
        part: 'Halo',
        title: 'Security & control',
        thesis:
          'The halo protects the driver. On a website: GDPR, EU hosting, backups, AI with an allow-listed action list and escalation to a human.',
        proof: 'Plumm and Mint Apartments: EU-hosted data, AI assistants with every step logged.',
        tags: ['GDPR', 'EU hosting', 'HITL', 'audit log'],
      },
      {
        id: 'steering',
        part: 'Steering wheel & telemetry',
        title: 'Measurement',
        thesis: 'Without telemetry you don’t know if you’re faster. Events, conversions, a before/after comparison. A report instead of a hunch.',
        proof: 'Every project ends with a before/after measurement: GA4, events, Search Console.',
        tags: ['GA4', 'Search Console', 'events', 'before/after'],
      },
    ],
  },
  uk: {
    eyebrow: 'Під капотом',
    title: 'Гарний лендинг — це лише кузов.',
    lead: 'Боліди перемагають тим, чого не видно з трибун. Із сайтом так само: те, що всередині, вирішує, чи він швидкий, чи знайдуть його Google і моделі ШІ, і чи перетворює він візити на запити. Прокрутіть, щоб розібрати його на частини.',
    hint: 'Наведіть на деталь, щоб побачити, за що вона відповідає',
    hintTouch: 'Торкніться деталі, щоб побачити, за що вона відповідає',
    proofLabel: 'З виробництва',
    partLabel: 'Деталь',
    layers: [
      {
        id: 'body',
        part: 'Кузов',
        title: 'Дизайн і UX',
        thesis:
          'Те, що видно в перші три секунди: ієрархія, типографіка, мобільна версія. Має виглядати гарно, але це лише оболонка над тим, що нижче.',
        proof: 'Mint Apartments: один дизайн, вісім мовних версій.',
        tags: ['Astro', 'React', 'Tailwind', 'WCAG'],
      },
      {
        id: 'frontWing',
        part: 'Переднє антикрило',
        title: 'Швидкість',
        thesis:
          'Переднє антикрило задає потік повітря для всього боліда. На сайті це продуктивність: швидкий перший рендер, зображення у WebP, без зайвого JavaScript. Google вимірює це ще до того, як прочитає контент.',
        proof: 'Mint Apartments: статична збірка на Astro з Lighthouse CI в пайплайні замість важкої CMS.',
        tags: ['Core Web Vitals', 'WebP', 'статична збірка', 'кешування'],
      },
      {
        id: 'rearWing',
        part: 'Заднє антикрило',
        title: 'Видимість: Google і моделі ШІ',
        thesis:
          'Притискна сила, яка тримає болід на трасі. Для сайту це schema.org, hreflang, sitemap, llms.txt і контент, який ChatGPT чи Perplexity можуть процитувати. Без цього навіть найгарніший сайт лишається невидимим.',
        proof: 'Цей сайт: JSON-LD, llms.txt, три мови з hreflang; Mint Apartments: 592 статті блогу кількома мовами.',
        tags: ['schema.org', 'hreflang', 'llms.txt', 'GEO'],
      },
      {
        id: 'wheels',
        part: 'Колеса',
        title: 'Конверсія',
        thesis:
          'Єдине місце, де потужність стикається з асфальтом. На сайті це заклик до дії, форма, календар, бронювання на власному домені. Усе інше існує для того, щоб цей контакт став запитом чи бронюванням.',
        proof: 'Mint Apartments: пряме бронювання через Previo замість комісії для порталів.',
        tags: ['пряме бронювання', 'форма', 'Cal.com', 'кваліфікація лідів'],
      },
      {
        id: 'powerUnit',
        part: 'Силова установка',
        title: 'Технології під капотом',
        thesis: 'Інтеграції, дані, API, безпека. Саме це вирішує, чи сайт — це інструмент, чи просто буклет.',
        proof: 'Plumm: 118 моделей даних, 456 API-ендпоінтів, 16 рушіїв декларацій, валідованих проти XSD.',
        tags: ['TypeScript', 'Prisma', 'API', 'KSeF'],
      },
      {
        id: 'engineCover',
        part: 'Кришка двигуна',
        title: 'Процес і впровадження',
        thesis:
          'Гонку виграють і в боксах. Тести, CI, деплой з одного пуша, тижневі ітерації замість одного разу на рік.',
        proof: 'Plumm: 9 314 тестів у CI; Mint Apartments і це портфоліо: деплой через пуш у гілку production.',
        tags: ['CI/CD', 'тести', 'GitHub Actions', 'staging'],
      },
      {
        id: 'halo',
        part: 'Захисна дуга (Halo)',
        title: 'Безпека і контроль',
        thesis:
          'Halo захищає пілота. На сайті це GDPR, хостинг у ЄС, резервні копії, ШІ зі списком дозволених дій і ескалацією до людини.',
        proof: 'Plumm і Mint Apartments: дані в ЄС, AI-асистенти з журналюванням кожного кроку.',
        tags: ['GDPR', 'хостинг у ЄС', 'HITL', 'журнал аудиту'],
      },
      {
        id: 'steering',
        part: 'Кермо і телеметрія',
        title: 'Вимірювання',
        thesis: 'Без телеметрії не знаєш, чи стало швидше. Події, конверсії, порівняння до і після. Звіт замість враження.',
        proof: 'Кожне впровадження завершується вимірюванням до/після: GA4, події, Search Console.',
        tags: ['GA4', 'Search Console', 'події', 'до/після'],
      },
    ],
  },
}

export function getUnderhood(locale: 'pl' | 'en' | 'uk'): UnderhoodCopy {
  return underhoodByLocale[locale]
}
