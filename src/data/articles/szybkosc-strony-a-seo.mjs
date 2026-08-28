import { DATE, note, offerOferta, ol, p, section, ul } from './_blocks.mjs'

export default {
  slug: 'szybkosc-strony-a-seo',
  keyword: 'szybkość strony a SEO',
  keywordEn: 'website speed and SEO',
  keywordUk: 'швидкість сайту і SEO',
  intent: 'informational',
  cluster: 'delivery',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'dlaczego-strona-nie-sprzedaje', anchor: { pl: 'wolna strona jako jedno z wiader „nie sprzedaje”', en: 'a slow site as one bucket of “does not sell”', uk: 'повільний сайт як одне з відер «не продає»' } },
    { slug: 'strona-firmowa-b2b', anchor: { pl: 'CWV w pakiecie strony firmowej, nie jako religia', en: 'CWV in the company-site package, not as a religion', uk: 'CWV у пакеті корпоративного сайту, не як релігія' } },
    { slug: 'wdrozenie-strony-internetowej', anchor: { pl: 'pomiar na produkcji, nie tylko na stagingu', en: 'measurement in production, not only on staging', uk: 'вимір на продакшені, не лише на staging' } },
  ],
  offer: [offerOferta()],
  pl: {
    title: 'Szybkość strony a SEO: INP, LCP i pomiar po starcie',
    description:
      'Szybkość strony a SEO: liczy się INP i LCP na telefonie, nie FID i nie sam Lighthouse. Tłumaczę, dlaczego stack (Astro/Next) i pomiar po deploju są częścią konwersji, nie ozdobą.',
    h1: 'Szybkość strony a SEO: INP na telefonie, nie vanity score z Lighthouse',
    kicker: 'Core Web Vitals',
    lead:
      '„Zrób nam 100 w PageSpeed” to zły brief. Google od lat mierzy doświadczenie, nie zrzut z laboratorium na kablu. Dla interakcji liczy się INP (nie martwy FID), dla malowania LCP, dla stabilności CLS. Szybkość strony a SEO spotykają się tam, gdzie płatny albo organiczny klik umiera, zanim H1 cokolwiek obieca. W pakiecie strony firmowej obiecuję on-page i CWV na telefonie — nie religię zielonych pudełek bez konwersji.',
    sections: [
      section(
        'INP zamiast FID — żebyśmy mówili tym samym językiem',
        p('FID wypadł z Core Web Vitals. Jeśli agencja w 2026 raportuje FID jako sukces, audytuje wspomnienia. INP opisuje, jak strona reaguje na klik i pisanie. Ciężki JS, hydracja całego SPA, czat wklejony w hero — to zabójcy INP. Dlatego wizytówki stawiam na lekkim stacku (Astro/Next), a nie na motywie z dwudziestoma wtyczkami „optymalizacji”.'),
        p('Lighthouse na desktopie z cache’em dewelopera kłamie dwukrotnie: urządzenie i sieć. Decyzje biorę z pola (CrUX, jeśli jest ruch) albo z pomiaru na realnym telefonie po deploju. [Wdrożenie](/artykuly/wdrozenie-strony-internetowej/) ma krok „pomiar po starcie” właśnie dlatego.'),
      ),
      section(
        'Gdzie szybkość jest SEO, a gdzie jest tylko konwersją',
        p('Google używa sygnałów doświadczenia jako części rankingu, ale nie kupisz pozycji samą kompresją obrazków, gdy nikt nie linkuje i nie ma treści z intencją. Z drugiej strony: kampania, która ląduje na 6-sekundowym LCP, pali budżet niezależnie od title. To wiadro 2 w [dlaczego strona nie sprzedaje](/artykuly/dlaczego-strona-nie-sprzedaje/).'),
        ul([
          'Obrazy: nowoczesny format, wymiary, nie hero 4k z PNG.',
          'Czcionki: preconnect, nie pięć rodzin „na wszelki wypadek”.',
          'JS: nie ładuj Three.js na wizytówce „bo ładnie”. Gra i hangar są osobnymi wejściami.',
          'Trzecie skrypty: każdy pixel to INP. Zgoda marketingu nie jest darmowa.',
        ]),
        note('Nie publikuję tu fałszywego „PageSpeed 98 na Mint”. Mint i Plumm możesz zmierzyć sam. iDrive nie jest live — nie ma czego chwalić na produkcji.'),
      ),
      section(
        'Crawlable HTML kontra SPA z hashem',
        p('Ten dziennik jest statycznym HTML w dist, nie `/#artykuly`. To decyzja SEO, nie moda. Hash routing nie jest adresem dla Search Console. Jeśli chcesz organiczny kanał, URL musi istnieć bez JavaScriptu jako jedynego nośnika treści. Wizytówka bez bloga tego nie potrzebuje. Klastry — tak.'),
      ),
      section(
        'Czego nie robię w imię wyniku 100',
        ol([
          'Nie wycinam treści, która sprzedaje, żeby Lighthouse się uśmiechnął.',
          'Nie zostawiam „szybkiej” strony bez formularza, który działa na wolnym LTE.',
          'Nie obiecuję Core Web Vitals w polu, gdy nie ma jeszcze ruchu — lab to hipoteza.',
          'Nie sprzedaję comiesięcznego „optymalizujemy wtyczki” na stacku, którego nie stawiam.',
        ]),
        p('W [stronie firmowej B2B](/artykuly/strona-firmowa-b2b/) szybkość jest w zakresie, bo telefon jest miejscem decyzji. W Conversion Build dochodzi pomiar ścieżki: wolny krok płatności zabija lejek mocniej niż trzy punkty Lighthouse.'),
      ),
    ],
    faqs: [
      { q: 'Czy 100 w Lighthouse gwarantuje pozycje?', a: 'Nie. To laboratorium. Ranking to intencja, treść, linki i doświadczenie w polu. 100 bez zapytań to hobby.' },
      { q: 'Czy WordPress może być szybki?', a: 'Może, przy dyscyplinie, której większość motywów nie ma. Dlatego go nie sprzedaję jako domyślnego stacku wizytówki.' },
      { q: 'Czy animacje zawsze psują INP?', a: 'Nie zawsze. Psuje nieprzemyślany JS na ścieżce krytycznej. Animacja CSS na dekoracji bywa tania. Three.js w hero wizytówki — rzadko.' },
      { q: 'Kiedy mierzyć ponownie?', a: 'Po deploju na produkcji, na telefonie, przy realnym cache. Potem po dokładkach (czat, pixel, film). Każdy dodatek to nowy audyt INP, nie „już było zielono”.' },
    ],
    ctaTitle: 'Zmierzmy telefon, nie zrzut z iMaca',
    ctaBody: 'Jeśli LCP zabija kampanię, to nie jest problem „kolorów”. [Zakres](/#oferta) obejmuje CWV w pakiecie strony.',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'Website speed and SEO: INP, LCP, and post-launch proof',
    description:
      'Website speed and SEO: INP and LCP on a phone count, not FID and not Lighthouse alone. I explain why the stack (Astro/Next) and measurement after deploy are part of conversion, not decoration.',
    h1: 'Website speed and SEO: INP on a phone, not a Lighthouse vanity score',
    kicker: 'Core Web Vitals',
    lead:
      '“Give us 100 in PageSpeed” is a bad brief. Google has measured experience for years, not a lab screenshot on a cable. For interaction, INP counts (not dead FID); for paint, LCP; for stability, CLS. Speed and SEO meet where a paid or organic click dies before the H1 promises anything. In the company-site package I promise on-page and mobile CWV — not a religion of green boxes without conversion.',
    sections: [
      section(
        'INP instead of FID — so we speak the same language',
        p('FID left Core Web Vitals. If an agency in 2026 reports FID as success, it is auditing a memory. INP describes how the page reacts to tap and type. Heavy JS, hydrating a whole SPA, a chat jammed into the hero — INP killers. That is why brochures sit on a light stack (Astro/Next), not a theme with twenty “optimisation” plugins.'),
        p('Lighthouse on desktop with a developer cache lies twice: device and network. I take decisions from the field (CrUX, if there is traffic) or from a real phone after deploy. [Implementation](/artykuly/wdrozenie-strony-internetowej/) has a “measure after launch” step for that reason.'),
      ),
      section(
        'Where speed is SEO, and where it is only conversion',
        p('Google uses experience signals as part of ranking, but you will not buy a position with image compression alone when nobody links and there is no intent-matched content. Conversely: a campaign that lands on a 6-second LCP burns budget regardless of title. That is bucket 2 in [why the site does not sell](/artykuly/dlaczego-strona-nie-sprzedaje/).'),
        ul([
          'Images: a modern format, dimensions, not a 4k PNG hero.',
          'Fonts: preconnect, not five families “just in case”.',
          'JS: do not load Three.js on a brochure “because it looks nice”. The game and hangar are separate entries.',
          'Third-party scripts: every pixel is INP. Marketing consent is not free.',
        ]),
        note('I do not publish a fake “PageSpeed 98 on Mint” here. You can measure Mint and Plumm yourself. iDrive is not live — there is nothing to boast about in production.'),
      ),
      section(
        'Crawlable HTML versus a hash SPA',
        p('This journal is static HTML in dist, not `/#artykuly`. That is an SEO decision, not a fashion. Hash routing is not an address for Search Console. If you want an organic channel, the URL must exist without JavaScript as the only content carrier. A brochure without a blog does not need that. Clusters do.'),
      ),
      section(
        'What I will not do for a score of 100',
        ol([
          'I do not cut copy that sells so Lighthouse smiles.',
          'I do not leave a “fast” page without a form that works on slow LTE.',
          'I do not promise field CWV when there is no traffic yet — lab is a hypothesis.',
          'I do not sell a monthly “we optimise plugins” on a stack I do not ship.',
        ]),
        p('On a [B2B company website](/artykuly/strona-firmowa-b2b/) speed is in scope because the phone is where the decision happens. In Conversion Build, path measurement joins: a slow payment step kills the funnel harder than three Lighthouse points.'),
      ),
    ],
    faqs: [
      { q: 'Does 100 in Lighthouse guarantee rankings?', a: 'No. That is a lab. Ranking is intent, content, links and field experience. 100 with no enquiries is a hobby.' },
      { q: 'Can WordPress be fast?', a: 'It can, with a discipline most themes lack. That is why I do not sell it as the default brochure stack.' },
      { q: 'Do animations always ruin INP?', a: 'Not always. Unthought JS on the critical path does. CSS decoration can be cheap. Three.js in a brochure hero — rarely.' },
      { q: 'When should we measure again?', a: 'After production deploy, on a phone, with real cache. Then after add-ons (chat, pixel, video). Each add-on is a new INP audit, not “it was green once”.' },
    ],
    ctaTitle: 'Let us measure a phone, not an iMac screenshot',
    ctaBody: 'If LCP is killing the campaign, it is not a “colours” problem. [Scope](/#oferta) includes CWV in the site package.',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Швидкість сайту і SEO: INP, LCP і вимір після старту',
    description:
      'Швидкість сайту і SEO: на телефоні рахуються INP і LCP, не FID і не сам Lighthouse. Пояснюю, чому стек (Astro/Next) і вимір після деплою є частиною конверсії, не прикрасою.',
    h1: 'Швидкість сайту і SEO: INP на телефоні, не vanity score з Lighthouse',
    kicker: 'Core Web Vitals',
    lead:
      '«Зробіть нам 100 у PageSpeed» — поганий бриф. Google роками міряє досвід, не знімок лабораторії на кабелі. Для взаємодії рахується INP (не мертвий FID), для малювання LCP, для стабільності CLS. Швидкість сайту і SEO зустрічаються там, де платний або органічний клік помирає, перш ніж H1 щось пообіцяє. У пакеті корпоративного сайту обіцяю on-page і CWV на телефоні — не релігію зелених коробок без конверсії.',
    sections: [
      section(
        'INP замість FID — щоб говорити однією мовою',
        p('FID випав із Core Web Vitals. Якщо агенція в 2026 звітує FID як успіх, вона аудитує спогади. INP описує, як сторінка реагує на тап і введення. Важкий JS, гідрація всього SPA, чат, встромлений у героя — убивці INP. Тому візитівки ставлю на легкому стеку (Astro/Next), а не на темі з двадцятьма плагінами «оптимізації».'),
        p('Lighthouse на десктопі з кешем розробника бреше двічі: пристрій і мережа. Рішення беру з поля (CrUX, якщо є трафік) або з виміру на реальному телефоні після деплою. [Впровадження](/artykuly/wdrozenie-strony-internetowej/) має крок «вимір після старту» саме тому.'),
      ),
      section(
        'Де швидкість є SEO, а де лише конверсією',
        p('Google використовує сигнали досвіду як частину ранжування, але позицію не купите самою компресією зображень, коли ніхто не лінкує і немає змісту з інтентом. З іншого боку: кампанія, що сідає на 6-секундний LCP, палить бюджет незалежно від title. Це відро 2 в [чому сайт не продає](/artykuly/dlaczego-strona-nie-sprzedaje/).'),
        ul([
          'Зображення: сучасний формат, розміри, не hero 4k з PNG.',
          'Шрифти: preconnect, не п’ять родин «про всяк випадок».',
          'JS: не вантажте Three.js на візитівку «бо гарно». Гра і ангар — окремі входи.',
          'Сторонні скрипти: кожен піксель — це INP. Згода маркетингу не безкоштовна.',
        ]),
        note('Не публікую тут фальшиве «PageSpeed 98 на Mint». Mint і Plumm можете виміряти самі. iDrive не live — немає чим хвалитися на продакшені.'),
      ),
      section(
        'Crawlable HTML проти SPA з хешем',
        p('Цей журнал — статичний HTML у dist, не `/#artykuly`. Це рішення SEO, не мода. Hash routing не є адресою для Search Console. Якщо хочете органічний канал, URL має існувати без JavaScript як єдиного носія змісту. Візитівці без блогу це не потрібно. Кластерам — так.'),
      ),
      section(
        'Чого не роблю в ім’я результату 100',
        ol([
          'Не вирізаю текст, який продає, щоб Lighthouse посміхнувся.',
          'Не лишаю «швидку» сторінку без форми, яка працює на повільному LTE.',
          'Не обіцяю Core Web Vitals у полі, коли ще немає трафіку — лабораторія це гіпотеза.',
          'Не продаю щомісячне «оптимізуємо плагіни» на стеку, якого не ставлю.',
        ]),
        p('У [корпоративному сайті B2B](/artykuly/strona-firmowa-b2b/) швидкість в обсязі, бо телефон — місце рішення. У Conversion Build додається вимір шляху: повільний крок оплати вбиває воронку сильніше, ніж три пункти Lighthouse.'),
      ),
    ],
    faqs: [
      { q: 'Чи 100 у Lighthouse гарантує позиції?', a: 'Ні. Це лабораторія. Ранжування — інтент, зміст, лінки й досвід у полі. 100 без запитів — хобі.' },
      { q: 'Чи WordPress може бути швидким?', a: 'Може, за дисципліни, якої більшість тем не має. Тому не продаю його як типовий стек візитівки.' },
      { q: 'Чи анімації завжди псують INP?', a: 'Не завжди. Псує непродуманий JS на критичному шляху. CSS-декор іноді дешевий. Three.js у герої візитівки — рідко.' },
      { q: 'Коли міряти знову?', a: 'Після деплою на продакшені, на телефоні, з реальним кешем. Потім після додатків (чат, піксель, відео). Кожен додаток — новий аудит INP, не «уже було зелено».' },
    ],
    ctaTitle: 'Зміряймо телефон, не знімок з iMac',
    ctaBody: 'Якщо LCP вбиває кампанію, це не проблема «кольорів». [Обсяг](/#oferta) включає CWV у пакеті сайту.',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
