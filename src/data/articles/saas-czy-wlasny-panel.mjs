import { DATE, note, offerCennik, ol, p, section, table, ul } from './_blocks.mjs'

export default {
  slug: 'saas-czy-wlasny-panel',
  keyword: 'gotowy system vs dedykowany panel',
  keywordEn: 'SaaS vs custom operations panel',
  keywordUk: 'готовий SaaS чи власна панель',
  intent: 'commercial',
  cluster: 'ops',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'panel-operacyjny-zamiast-excela', anchor: { pl: 'kiedy panel zamiast Excela w ogóle ma sens', en: 'when a panel instead of Excel makes sense at all', uk: 'коли панель замість Excel узагалі має сенс' } },
    { slug: 'rezerwacje-na-wlasnej-stronie', anchor: { pl: 'Previo w Mint zamiast własnego PMS', en: 'Previo at Mint instead of a custom PMS', uk: 'Previo в Mint замість власного PMS' } },
    { slug: 'wdrozyc-chatgpt-w-firmie', anchor: { pl: 'ChatGPT w firmie to nie gotowiec na procesy', en: 'ChatGPT at work is not an off-the-shelf process', uk: 'ChatGPT у фірмі — не готовий процес' } },
  ],
  offer: [offerCennik()],
  pl: {
    title: 'SaaS czy własny panel operacyjny: jak wybieram',
    description:
      'Gotowy system vs dedykowany panel: w Mint wziąłem Previo, w Plumm buduję własny produkt. Kryteria decyzji, lock-in i budżet 60–180 tys. zł — bez slajdu „zawsze custom”.',
    h1: 'Gotowy SaaS czy własny panel: nie zaczynam od kodu z ego',
    kicker: 'Architektura decyzji',
    lead:
      'Najdroższy błąd przy panelu to napisać to, co rynek już sprzedał w abonamencie. Drugi najdroższy — wcisnąć firmę w SaaS, który kłamie o Waszym procesie. W Mint nie budowałem channel managera: stany i rezerwacje trzyma Previo. Plumm jest własnym panelem, bo polska księgowość JDG, KSeF i asystent z eskalacją do księgowej to nie „kolejny Notion”. Poniżej reguła, nie religia customu.',
    sections: [
      section(
        'Pytanie, które zadaję zanim otworzę edytor',
        p('Czy Wasz przepływ jest standardem branży, czy wyjątkiem, który generuje marżę? Standard (kanały OTA, zwykły kalendarz noclegowy, poczta) — szukam gotowca z API. Wyjątek (Wasze statusy, Wasze role, połączenie rzeczy, których żaden vendor nie złożył) — rozmawiamy o [panelu operacyjnym](/artykuly/panel-operacyjny-zamiast-excela/) w widełkach Ops.'),
        ul([
          'Czy vendor ma webhooki i eksport, czy tylko CSV w piątki?',
          'Czy lock-in zabija Was, gdy cena abonamentu skoczy o 40%?',
          'Czy proces da się opisać w pięciu statusach, które SaaS już ma?',
          'Czy ktoś w zespole będzie administratorem gotowca, czy „wdrożenie” umrze z jednym loginem?',
        ]),
      ),
      section(
        'Mint: gotowiec tam, gdzie błąd podwójnej rezerwacji jest droższy niż duma inżyniera',
        p('Channel manager i PMS to rynek dojrzały. Pomyłka w stanach to nadbook. Dlatego [rezerwacje na własnej stronie](/artykuly/rezerwacje-na-wlasnej-stronie/) siedzą na Previo, a ja buduję warstwę gościa: strona, płatność na domenie, zamki, asystent. Custom na krawędzi doświadczenia, nie na rdzeniu inventory.'),
        note('To nie jest recenzja Previo dla Twojego obiektu. To przykład decyzji. Inny obiekt może mieć inny PMS. Nie zmyślam, że „wdrożyłem Previo u 50 operatorów”.'),
      ),
      section(
        'Plumm: custom, bo produkt jest procesem',
        p('[Księgowość online](/artykuly/ksiegowosc-online-zamiast-excela/) w Plumm nie jest skórką na Excelu. E-faktury do urzędu, PIT/VAT/ZUS, asystent z eskalacją — to produkt, który sam utrzymuję. Gdyby to była strona-wizytówka biura rachunkowego, wziąłbym gotowy CMS. Nie wziąłem.'),
      ),
      section(
        'Tabela, której używam na audycie',
        table(
          ['Kryterium', 'SaaS', 'Własny panel'],
          [
            ['Czas do pierwszego użycia', 'Dni / tygodnie konfiguracji', 'Tygodnie / miesiące budowy'],
            ['Koszt 3 lat', 'Abonament × sezony wzrostu ceny', 'Wdrożenie Ops + utrzymanie'],
            ['Dopasowanie procesu', 'Wy cieszycie się, albo giniecie w workarounds', 'Proces jest modelem domenowym'],
            ['Własność', 'Dane bywają, logika rzadko', 'Kod po fakturach jest Twój'],
            ['AI / HITL', 'Czarna skrzynka dostawcy', 'Dozwolone akcje i zapis, które projektuję'],
          ],
        ),
        p('Hybryda jest najczęstsza: SaaS w rdzeniu, custom na krawędzi. Czysty custom „bo tak nowocześniej” przy budżecie strony firmowej to fantazja. Czysty SaaS przy procesie, którego vendor nie zna, to pięć logowań i Excel z boku — czyli tam, skąd przyszliście.'),
      ),
      section(
        'Lock-in, o którym sprzedawcy SaaS milczą grzecznie',
        ol([
          'Eksport pełny, nie „raport PDF”.',
          'API, które przeżyje zmianę cennika.',
          'Kto jest administratorem po urlopie założyciela.',
          'Co się stanie z historią, gdy wypowiecie umowę.',
        ]),
        p('Przy customie lock-in to ja, jeśli nie oddam kodu. Dlatego oddaję. Przy SaaS lock-in to cennik i format danych. Oba da się przeżyć, jeśli nazwiecie je przed fakturą, nie po.'),
      ),
      section(
        'Budżet: nie mieszaj pakietów',
        p('Konfiguracja gotowca plus strona może zmieścić się w Conversion Build. Własny panel to Ops 60–180 tys.+. [Wycena strony](/artykuly/ile-kosztuje-strona-firmowa/) nie pokryje silnika statusów. Jeśli brief miesza „strona + ERP + ChatGPT za 15 tys.”, tniemy albo odmawiam.'),
      ),
    ],
    faqs: [
      { q: 'Czy zawsze odradzasz custom?', a: 'Nie. Odradzam custom tam, gdzie błąd inventory jest droższy niż duma. Zalecam custom tam, gdzie SaaS zmusza do kłamania w procesie.' },
      { q: 'Czy low-code to trzecia droga?', a: 'Tak, jako prototyp albo cienki panel na API. Gdy wchodzą role, audyt i urząd — niski kod często wychodzi drożej niż przyznany custom.' },
      { q: 'Kto utrzymuje SaaS po starcie?', a: 'Wy, z moim przekazaniem. Nie zostaję wiecznym administratorem cudzej subskrypcji bez umowy.' },
      { q: 'Czy Agentic OS sprzedajesz jako SaaS?', a: 'Nie. To narzędzie wewnętrzne. Na zewnątrz wdrażam HITL pod Wasze dozwolone akcje, nie „pakiet Agentic” z cennika.' },
    ],
    ctaTitle: 'Rozstrzygnijmy SaaS kontra custom zanim padnie budżet',
    ctaBody: '20 minut: gotowiec, hybryda albo Ops. Bez ego stacku. [Cennik](/#cennik).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'Off-the-shelf SaaS or a custom operations panel',
    description:
      'SaaS vs a custom panel: at Mint I used Previo; Plumm is my own product. Decision criteria, lock-in and a PLN 60–180k budget — no “always custom” slide.',
    h1: 'Off-the-shelf SaaS or a custom panel: I do not start from ego in the editor',
    kicker: 'Decision architecture',
    lead:
      'The most expensive panel mistake is writing what the market already sells as a subscription. The second is forcing a firm into SaaS that lies about your process. At Mint I did not build a channel manager: Previo holds stock and bookings. Plumm is a custom panel because Polish sole-trader accounting, KSeF and an assistant with escalation to a bookkeeper is not “another Notion”. A rule below, not a custom religion.',
    sections: [
      section(
        'The question I ask before I open the editor',
        p('Is your flow an industry standard, or the exception that makes your margin? Standard (OTA channels, a normal lodging calendar, mail) — I look for an off-the-shelf tool with an API. Exception (your statuses, your roles, a combination no vendor assembled) — we talk about an [operations panel](/artykuly/panel-operacyjny-zamiast-excela/) in the Ops range.'),
        ul([
          'Does the vendor have webhooks and export, or only a Friday CSV?',
          'Does lock-in kill you if the seat price jumps 40%?',
          'Can the process be described in five statuses the SaaS already has?',
          'Will someone on the team administer the tool, or will “the rollout” die with one login?',
        ]),
      ),
      section(
        'Mint: off-the-shelf where a double booking is costlier than engineering pride',
        p('Channel managers and PMS are a mature market. A stock error is an overbooking. So [direct booking](/artykuly/rezerwacje-na-wlasnej-stronie/) sits on Previo, and I build the guest layer: site, on-domain payment, locks, assistant. Custom on the experience edge, not on inventory core.'),
        note('This is not a Previo review for your property. It is a decision example. Another property may use another PMS. I do not invent “I rolled Previo out to 50 operators”.'),
      ),
      section(
        'Plumm: custom because the product is the process',
        p('[Online accounting](/artykuly/ksiegowosc-online-zamiast-excela/) in Plumm is not a skin on Excel. E-invoices to the authority, PIT/VAT/ZUS, an assistant with escalation — a product I maintain. If it were an accountant’s brochure site, I would have taken a CMS. I did not.'),
      ),
      section(
        'The table I use in the audit',
        table(
          ['Criterion', 'SaaS', 'Custom panel'],
          [
            ['Time to first use', 'Days / weeks of config', 'Weeks / months of build'],
            ['3-year cost', 'Seats × price-hike seasons', 'Ops build + upkeep'],
            ['Process fit', 'You cope, or drown in workarounds', 'The process is the domain model'],
            ['Ownership', 'Data sometimes, logic rarely', 'Code after invoices is yours'],
            ['AI / HITL', 'Vendor black box', 'Allowed actions and a log I design'],
          ],
        ),
        p('A hybrid is the usual case: SaaS in the core, custom on the edge. Pure custom “because it is more modern” at company-website budget is fantasy. Pure SaaS when the vendor does not know the process is five logins and Excel on the side — where you came from.'),
      ),
      section(
        'Lock-in SaaS salespeople mention politely',
        ol([
          'A full export, not a PDF report.',
          'An API that survives a price-list change.',
          'Who is the admin after the founder’s holiday.',
          'What happens to history when you terminate.',
        ]),
        p('With custom, lock-in is me if I do not hand over the code. So I hand it over. With SaaS, lock-in is the price list and the data format. Both are survivable if you name them before the invoice, not after.'),
      ),
      section(
        'Budget: do not mix packages',
        p('Configuring off-the-shelf plus a site can fit Conversion Build. A custom panel is Ops PLN 60–180k+. [Website pricing](/artykuly/ile-kosztuje-strona-firmowa/) will not cover a status engine. If the brief mixes “site + ERP + ChatGPT for 15k”, we cut or I refuse.'),
      ),
    ],
    faqs: [
      { q: 'Do you always advise against custom?', a: 'No. I advise against custom where an inventory error is costlier than pride. I advise custom where SaaS forces you to lie in the process.' },
      { q: 'Is low-code a third way?', a: 'Yes, as a prototype or a thin panel on an API. When roles, audit and the tax office enter — low-code often costs more than admitted custom.' },
      { q: 'Who runs the SaaS after launch?', a: 'You, after I hand over. I do not stay the eternal admin of someone else’s subscription without a contract.' },
      { q: 'Do you sell Agentic OS as SaaS?', a: 'No. It is an internal tool. Externally I implement HITL under your allowed actions, not an “Agentic package” on a price list.' },
    ],
    ctaTitle: 'Settle SaaS versus custom before the budget dies',
    ctaBody: 'Twenty minutes: off-the-shelf, hybrid or Ops. No stack ego. [Pricing](/#cennik).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Готовий SaaS чи власна панель: як я обираю',
    description:
      'Готовий систем vs власна панель: у Mint взяв Previo, у Plumm будую власний продукт. Критерії, lock-in і бюджет 60–180 тис. — без слайда «завжди custom».',
    h1: 'Готовий SaaS чи власна панель: не починаю з коду з его',
    kicker: 'Архітектура рішення',
    lead:
      'Найдорожча помилка з панеллю — написати те, що ринок уже продає в підписці. Друга — запхнути фірму в SaaS, який бреше про ваш процес. У Mint я не будував channel manager: стани й бронювання тримає Previo. Plumm — власна панель, бо польська бухгалтерія ФОП, KSeF і асистент з ескалацією до бухгалтерки — не «черговий Notion». Нижче правило, не релігія custom.',
    sections: [
      section(
        'Питання, яке ставлю, перш ніж відкрити редактор',
        p('Ваш потік — стандарт галузі чи виняток, що робить маржу? Стандарт (канали OTA, звичайний календар ночівлі, пошта) — шукаю готове з API. Виняток (ваші статуси, ваші ролі, поєднання, якого жоден вендор не зібрав) — говоримо про [операційну панель](/artykuly/panel-operacyjny-zamiast-excela/) у вилці Ops.'),
        ul([
          'Чи є у вендора вебхуки й експорт, чи лише CSV по п’ятницях?',
          'Чи lock-in вбиває вас, якщо ціна місця стрибне на 40%?',
          'Чи процес описується п’ятьма статусами, які SaaS уже має?',
          'Чи хтось у команді буде адміном готового, чи «впровадження» помре з одним логіном?',
        ]),
      ),
      section(
        'Mint: готове там, де помилка подвійного бронювання дорожча за інженерну гордість',
        p('Channel manager і PMS — зрілий ринок. Помилка в станах — надбук. Тому [бронювання на власному сайті](/artykuly/rezerwacje-na-wlasnej-stronie/) сидить на Previo, а я будую шар гостя: сайт, оплата на домені, замки, асистент. Custom на краї досвіду, не на ядрі inventory.'),
        note('Це не огляд Previo для вашого об’єкта. Це приклад рішення. Інший об’єкт може мати інший PMS. Не вигадую, що «впровадив Previo у 50 операторів».'),
      ),
      section(
        'Plumm: custom, бо продукт є процесом',
        p('[Онлайн-бухгалтерія](/artykuly/ksiegowosc-online-zamiast-excela/) в Plumm — не шкірка на Excel. E-фактури до установи, PIT/VAT/ZUS, асистент з ескалацією — продукт, який сам підтримую. Якби це була візитівка бюро, взяв би CMS. Не взяв.'),
      ),
      section(
        'Таблиця, якою користуюся на аудиті',
        table(
          ['Критерій', 'SaaS', 'Власна панель'],
          [
            ['Час до першого використання', 'Дні / тижні конфігурації', 'Тижні / місяці будівництва'],
            ['Вартість 3 років', 'Підписка × сезони зростання ціни', 'Впровадження Ops + підтримка'],
            ['Відповідність процесу', 'Ви терпите або гинете в обхідних шляхах', 'Процес є доменною моделлю'],
            ['Власність', 'Дані інколи, логіка рідко', 'Код після рахунків ваш'],
            ['ШІ / HITL', 'Чорна скринька постачальника', 'Дозволені дії й запис, які проєктую'],
          ],
        ),
        p('Гібрид найчастіший: SaaS у ядрі, custom на краї. Чистий custom «бо сучасніше» при бюджеті корпоративного сайту — фантазія. Чистий SaaS при процесі, якого вендор не знає — п’ять логінів і Excel збоку, тобто звідти, звідки прийшли.'),
      ),
      section(
        'Lock-in, про який продавці SaaS мовчать чемно',
        ol([
          'Повний експорт, не «звіт PDF».',
          'API, яке переживе зміну прайса.',
          'Хто адмін після відпустки засновника.',
          'Що станеться з історією, коли розірвете договір.',
        ]),
        p('При custom lock-in — я, якщо не віддам код. Тому віддаю. При SaaS lock-in — прайс і формат даних. Обидва можна пережити, якщо назвати їх до рахунку, не після.'),
      ),
      section(
        'Бюджет: не змішуйте пакети',
        p('Конфігурація готового плюс сайт може вміститися в Conversion Build. Власна панель — Ops 60–180 тис.+. [Оцінка сайту](/artykuly/ile-kosztuje-strona-firmowa/) не покриє рушій статусів. Якщо бриф змішує «сайт + ERP + ChatGPT за 15 тис.» — ріжемо або відмовляю.'),
      ),
    ],
    faqs: [
      { q: 'Чи завжди відмовляєте від custom?', a: 'Ні. Відмовляю від custom там, де помилка inventory дорожча за его. Раджу custom там, де SaaS змушує брехати в процесі.' },
      { q: 'Чи low-code — третій шлях?', a: 'Так, як прототип або тонка панель на API. Коли входять ролі, аудит і податкова — низький код часто виходить дорожче за визнаний custom.' },
      { q: 'Хто підтримує SaaS після старту?', a: 'Ви, після моєї передачі. Не лишаюся вічним адміном чужої підписки без договору.' },
      { q: 'Чи продаєте Agentic OS як SaaS?', a: 'Ні. Це внутрішній інструмент. Назовні впроваджую HITL під ваші дозволені дії, не «пакет Agentic» з прайса.' },
    ],
    ctaTitle: 'Розсудімо SaaS проти custom, перш ніж помре бюджет',
    ctaBody: '20 хвилин: готове, гібрид або Ops. Без его стеку. [Ціни](/#cennik).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
