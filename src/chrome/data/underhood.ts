/**
 * "Pod maską" / "Under the hood" section — an exploded-view F1 car where
 * every part stands for a layer of a website that actually works. Content
 * only; the 3D scene and React section live elsewhere. All proof points
 * are facts already present in `content.ts` / `facts.ts` — nothing here is
 * invented.
 *
 * The order of `layers` is the story order, and the story order is the order
 * the car comes apart: bodywork first (the thing everyone means when they say
 * "website"), then the cover comes off and everything that actually makes it
 * work is underneath. `PART_WINDOWS` in `../underhood/carAssets.ts` is kept in
 * step with this list — chapter n and explode step n are the same beat.
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
        id: 'engineCover',
        part: 'Pokrywa silnika',
        title: 'Technologia pod spodem',
        thesis:
          'Pokrywa idzie w górę i widać, z czego strona jest naprawdę zrobiona: architektura, kod, hosting w Unii, aktualizacje bez przestojów. To decyduje, czy strona jest narzędziem, czy broszurą.',
        proof:
          'Mint Apartments i Plumm: własny kod zamiast szablonu, hosting w UE, wdrożenia z jednego pusha.',
        tags: ['TypeScript', 'Astro/Next.js', 'EU hosting', 'CI/CD'],
      },
      {
        id: 'powerUnit',
        part: 'Jednostka napędowa',
        title: 'Integracje i dane',
        thesis:
          'Silnik, który napędza sprzedaż: rezerwacje, płatności, faktury, CRM, API. Dane płyną w jednym przepływie zamiast pięciu logowań.',
        proof:
          'Plumm: 118 modeli danych, 456 endpointów API, 16 silników deklaracji walidowanych XSD; Mint: Previo, zamki Tedee/Nuki, płatności.',
        tags: ['API', 'Prisma', 'KSeF', 'Previo'],
      },
      {
        id: 'rearWing',
        part: 'Tylne skrzydło',
        title: 'Widoczność: Google i modele AI',
        thesis:
          'Docisk, który trzyma bolid na torze. Dla strony to schema.org, hreflang, sitemap, llms.txt i treść, którą ChatGPT czy Perplexity potrafią zacytować. Bez tego najładniejsza strona jest niewidzialna.',
        proof:
          'Ta strona: JSON-LD, llms.txt, trzy języki z hreflang; Mint Apartments: 592 wpisy bloga w wielu językach.',
        tags: ['schema.org', 'hreflang', 'llms.txt', 'GEO'],
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
        id: 'wheels',
        part: 'Opony',
        title: 'Konwersja',
        thesis:
          'Jedyne miejsce, gdzie moc styka się z asfaltem. Na stronie: wezwanie do działania, formularz, kalendarz, rezerwacja na własnej domenie. Reszta istnieje po to, żeby ten kontakt zamienił się w zapytanie albo rezerwację.',
        proof: 'Mint Apartments: direct booking przez Previo zamiast prowizji dla portali.',
        tags: ['direct booking', 'formularz', 'Cal.com', 'kwalifikacja leadów'],
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
        title: 'Pomiar i iteracje',
        thesis:
          'Bez telemetrii nie wiesz, czy jest szybciej. Zdarzenia, konwersje, porównanie przed i po, i kolejna iteracja co tydzień, nie raz na rok.',
        proof:
          'Każde wdrożenie kończy się pomiarem przed/po (GA4, zdarzenia, Search Console); Plumm: 9 314 testów w CI.',
        tags: ['GA4', 'Search Console', 'testy', 'iteracje'],
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
        id: 'engineCover',
        part: 'Engine cover',
        title: 'The technology underneath',
        thesis:
          'The cover lifts and you can see what the site is really made of: architecture, code, hosting in the EU, updates with no downtime. This is what decides whether a website is a tool or a brochure.',
        proof:
          'Mint Apartments and Plumm: custom code instead of a template, EU hosting, deploys from a single push.',
        tags: ['TypeScript', 'Astro/Next.js', 'EU hosting', 'CI/CD'],
      },
      {
        id: 'powerUnit',
        part: 'Power unit',
        title: 'Integrations & data',
        thesis:
          'The engine that drives the selling: bookings, payments, invoices, CRM, APIs. Data moves through one flow instead of five separate logins.',
        proof:
          'Plumm: 118 data models, 456 API endpoints, 16 declaration engines validated against XSD; Mint: Previo, Tedee/Nuki locks, payments.',
        tags: ['API', 'Prisma', 'KSeF', 'Previo'],
      },
      {
        id: 'rearWing',
        part: 'Rear wing',
        title: 'Visibility: Google and AI models',
        thesis:
          'Downforce that keeps the car on the track. For a website, that’s schema.org, hreflang, a sitemap, llms.txt, and content that ChatGPT or Perplexity can actually cite. Without it, the best-looking site is invisible.',
        proof:
          'This site: JSON-LD, llms.txt, three languages with hreflang; Mint Apartments: 592 blog posts across multiple languages.',
        tags: ['schema.org', 'hreflang', 'llms.txt', 'GEO'],
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
        id: 'wheels',
        part: 'Wheels',
        title: 'Conversion',
        thesis:
          'The only place where power meets the tarmac. On a website: the call to action, the form, the calendar, a booking flow on your own domain. Everything else exists to turn that contact into an enquiry or a booking.',
        proof: 'Mint Apartments: direct booking through Previo instead of paying portal commissions.',
        tags: ['direct booking', 'form', 'Cal.com', 'lead qualification'],
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
        title: 'Measurement & iteration',
        thesis:
          'Without telemetry you don’t know whether it got faster. Events, conversions, a before/after comparison, and the next iteration every week rather than once a year.',
        proof:
          'Every project ends with a before/after measurement (GA4, events, Search Console); Plumm: 9,314 tests in CI.',
        tags: ['GA4', 'Search Console', 'tests', 'iterations'],
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
        id: 'engineCover',
        part: 'Кришка двигуна',
        title: 'Технології під капотом',
        thesis:
          'Кришка піднімається — і видно, з чого сайт зроблений насправді: архітектура, код, хостинг у ЄС, оновлення без простоїв. Саме це вирішує, чи сайт — це інструмент, чи просто буклет.',
        proof:
          'Mint Apartments і Plumm: власний код замість шаблону, хостинг у ЄС, деплой з одного пуша.',
        tags: ['TypeScript', 'Astro/Next.js', 'хостинг у ЄС', 'CI/CD'],
      },
      {
        id: 'powerUnit',
        part: 'Силова установка',
        title: 'Інтеграції і дані',
        thesis:
          'Двигун, який рухає продажі: бронювання, платежі, рахунки, CRM, API. Дані течуть одним потоком замість п’яти окремих входів у системи.',
        proof:
          'Plumm: 118 моделей даних, 456 API-ендпоінтів, 16 рушіїв декларацій, валідованих проти XSD; Mint: Previo, замки Tedee/Nuki, платежі.',
        tags: ['API', 'Prisma', 'KSeF', 'Previo'],
      },
      {
        id: 'rearWing',
        part: 'Заднє антикрило',
        title: 'Видимість: Google і моделі ШІ',
        thesis:
          'Притискна сила, яка тримає болід на трасі. Для сайту це schema.org, hreflang, sitemap, llms.txt і контент, який ChatGPT чи Perplexity можуть процитувати. Без цього навіть найгарніший сайт лишається невидимим.',
        proof:
          'Цей сайт: JSON-LD, llms.txt, три мови з hreflang; Mint Apartments: 592 статті блогу кількома мовами.',
        tags: ['schema.org', 'hreflang', 'llms.txt', 'GEO'],
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
        id: 'wheels',
        part: 'Колеса',
        title: 'Конверсія',
        thesis:
          'Єдине місце, де потужність стикається з асфальтом. На сайті це заклик до дії, форма, календар, бронювання на власному домені. Усе інше існує для того, щоб цей контакт став запитом чи бронюванням.',
        proof: 'Mint Apartments: пряме бронювання через Previo замість комісії для порталів.',
        tags: ['пряме бронювання', 'форма', 'Cal.com', 'кваліфікація лідів'],
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
        title: 'Вимірювання та ітерації',
        thesis:
          'Без телеметрії не знаєш, чи стало швидше. Події, конверсії, порівняння до і після — і наступна ітерація щотижня, а не раз на рік.',
        proof:
          'Кожне впровадження завершується вимірюванням до/після (GA4, події, Search Console); Plumm: 9 314 тестів у CI.',
        tags: ['GA4', 'Search Console', 'тести', 'ітерації'],
      },
    ],
  },
}

export function getUnderhood(locale: 'pl' | 'en' | 'uk'): UnderhoodCopy {
  return underhoodByLocale[locale]
}
