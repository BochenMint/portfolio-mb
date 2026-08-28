import { DATE, note, offerCennik, offerRealizacje, ol, p, section, ul } from './_blocks.mjs'

export default {
  slug: 'rezerwacje-na-wlasnej-stronie',
  keyword: 'rezerwacje na własnej stronie',
  keywordEn: 'direct booking on your own website',
  keywordUk: 'бронювання на власному сайті',
  intent: 'commercial',
  cluster: 'strony',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'lejek-konwersji-na-stronie', anchor: { pl: 'lejek konwersji, którego częścią jest rezerwacja', en: 'the conversion funnel that booking sits inside', uk: 'воронка конверсії, частиною якої є бронювання' } },
    { slug: 'saas-czy-wlasny-panel', anchor: { pl: 'dlaczego wziąłem Previo zamiast pisać channel manager', en: 'why I used Previo instead of writing a channel manager', uk: 'чому взяв Previo замість писати channel manager' } },
    { slug: 'strona-firmowa-b2b', anchor: { pl: 'kiedy wystarczy strona firmowa bez rezerwacji', en: 'when a company site without booking is enough', uk: 'коли досить корпоративного сайту без бронювання' } },
  ],
  offer: [offerRealizacje(), offerCennik()],
  pl: {
    title: 'Rezerwacje na własnej stronie zamiast prowizji portalu',
    description:
      'Rezerwacje na własnej stronie ucinają prowizję OTA: w Mint gość płaci 10–15% mniej niż na Booking.com. Piszę, kiedy to się spina i dlaczego nie buduję własnego kalendarza od zera.',
    h1: 'Rezerwacje na własnej stronie: prowizja portalu wraca jako marża',
    kicker: 'Mint Apartments · Conversion Build',
    lead:
      'Jeśli sprzedajesz noce przez Booking albo Airbnb, prowizja nie jest „kosztem marketingu”. Jest podatkiem od każdej rezerwacji, którą mógłbyś zamknąć sam. W [Mint Apartments](https://mintapartments.pl) gość rezerwuje na domenie operatora, płaci online i dostaje kod do zamka. Szacunek: 10–15% taniej dla gościa niż na portalu*. To jedyny publiczny, klikalny przykład rezerwacji, który pokazuję — bez zmyślonych occupancy rate.',
    sections: [
      section(
        'Co znaczy „na własnej stronie”, a co jest nadal OTA',
        p('Własna strona z przyciskiem „zarezerwuj na Booking” to nie rezerwacje na własnej stronie. To baner. Rezerwacja własna: kalendarz i cena na żywo, płatność na Twojej domenie, potwierdzenie i dalsza obsługa (kod, regulamin, język) bez pośrednika w transkacji. Portal może zostać kanałem. Nie musi być kasą.'),
        p('W Mint kalendarz i stany idą z Previo. Nie pisałem channel managera. To decyzja z artykułu o [SaaS kontra własny panel](/artykuly/saas-czy-wlasny-panel/): gotowiec tam, gdzie rynek jest standardem, custom tam, gdzie proces jest Wasz.'),
        note('*10–15% i 8–15 h/mies. mniej na pytaniach gości to szacunki orientacyjne — wolumen, sezon, mix kanałów. Na audycie liczę Twój obiekt, nie średnią z PropTech Twittera.'),
      ),
      section(
        'Kiedy matematyka się spina, a kiedy nie',
        p('Spinają się, gdy masz powtarzalny popyt, rozpoznawalną markę albo płatny ruch, który i tak prowadzisz na kartę obiektu, a prowizja zjada dwucyfrowy procent. Nie spinają się, gdy 90% nocy i tak pochodzi z OTA, a strona ma trzy wejścia w tygodniu. Wtedy najpierw kanał i oferta, nie silnik płatności.'),
        ul([
          'Policz prowizję roczną, nie „2% tu czy tam”.',
          'Dodaj godziny recepcji / WhatsApp na „gdzie jest kod”.',
          'Odejmij koszt wdrożenia Conversion Build (25 000–60 000 zł) i utrzymanie bramki.',
          'Jeśli zwrot wychodzi poza 18–24 miesiące przy Twoich liczbach — mówię to wprost.',
        ]),
        p('Wizytówka za 6 500 zł tego nie udźwignie. Kalendarz, płatność, locki Tedee/Nuki i asystent w wielu językach to [lejek](/artykuly/lejek-konwersji-na-stronie/), nie pięć podstron z formularzem.'),
      ),
      section(
        'Check-in bez recepcji nie jest gadżetem',
        p('Kod do zamka o 23:00 jest częścią lejka: obietnica „przyjedź kiedy chcesz” pada, jeśli ktoś musi dyżurować. Asystent dla gości (WhatsApp, kontekst apartamentu, eskalacja do człowieka) zdejmuje powtarzalne pytania. Szacunek 8–15 h/mies.* — z gwiazdką, bo 36 apartamentów w Gdańsku to nie Twój pensjonat na 4 pokoje.'),
        p('Nie wdrażam asystenta, który zgaduje zniżki. HITL: dozwolone akcje, zapis, człowiek przy sporze. To ten sam kręgosłup co w [automatyzacji z kontrolą człowieka](/artykuly/automatyzacja-z-kontrola-czlowieka/).'),
      ),
      section(
        'Czego nie obiecuję z Mint jako „Twojego wyniku”',
        ol([
          'Nie przenoszę occupancy Mint na Twój obiekt.',
          'Nie gwarantuję, że OTA zniknie — często zostaje uzupełnieniem.',
          'Nie buduję od zera PMS, jeśli Previo (albo inny standard) już trzyma kanały.',
          'Nie pokazuję iDrive jako live — nie jest na produkcji.',
        ]),
        p('Publiczny dowód to URL mintapartments.pl. Reszta — Twoje liczby na 20-minutowym audycie. Jeśli nie masz wolumenu, zostajemy przy [stronie firmowej](/artykuly/strona-firmowa-b2b/) i nie udajemy silnika rezerwacji.'),
      ),
      section(
        'Stack, który musisz przeżyć po odbiorze',
        p('Astro/React na froncie, Previo na stanach, płatność na domenie, zamki, WhatsApp, wersje językowe. Kod po fakturach jest Twój. NDA standard. Nie trzymam Cię na motywie, którego nie wyeksportujesz. Utrzymanie to bramka i PMS, nie dwadzieścia wtyczek WordPressa.'),
      ),
    ],
    faqs: [
      { q: 'Czy mogę zostawić Booking i mieć własną rezerwację?', a: 'Tak. Często tak robię: OTA jako kanał, własna strona jako tańsza kasa. Warunek: te same stany, zero podwójnych rezerwacji.' },
      { q: 'Ile to kosztuje?', a: 'To Conversion Build: 25 000–60 000 zł, nie pakiet wizytówki. Widełki po audycie, gdy policzymy prowizję i godziny obsługi.' },
      { q: 'Czy napiszesz własny kalendarz od zera?', a: 'Rzadko. Jeśli PMS/channel manager istnieje, podpinam go. Własny kalendarz ma sens, gdy proces jest nietypowy i gotowiec kłamie.' },
      { q: 'Czy asystent AI jest obowiązkowy?', a: 'Nie. Najpierw rezerwacja i check-in. Asystent dokładam, gdy wolumen pytań to uzasadnia — z HITL, nie z czatem-ozdobą.' },
    ],
    ctaTitle: 'Policzmy prowizję, zanim zakodujemy kalendarz',
    ctaBody: '20 minut: czy rezerwacje na własnej stronie mają prawo się spiąć. Mint jest do kliknięcia w [realizacjach](/#realizacje).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'Direct bookings on your own site versus portal fees',
    description:
      'Direct booking on your site cuts OTA commission: at Mint the guest pays 10–15% less than on Booking.com. I write when the maths closes and why I do not build a calendar from scratch.',
    h1: 'Direct bookings on your own site: portal commission returns as margin',
    kicker: 'Mint Apartments · Conversion Build',
    lead:
      'If you sell nights through Booking or Airbnb, commission is not “marketing cost”. It is a tax on every stay you could have closed yourself. At [Mint Apartments](https://mintapartments.pl) the guest books on the operator’s domain, pays online and gets a lock code. Estimate: 10–15% cheaper for the guest than the portal*. That is the only public, clickable booking example I show — no invented occupancy rates.',
    sections: [
      section(
        'What “on your own site” means, and what is still an OTA',
        p('A site with a “book on Booking” button is not direct booking. It is a banner. Direct booking: live calendar and price, payment on your domain, confirmation and onward handling (code, house rules, language) without a middleman in the transaction. The portal can stay a channel. It does not have to be the till.'),
        p('At Mint, calendar and availability come from Previo. I did not write a channel manager. That is the [SaaS versus custom panel](/artykuly/saas-czy-wlasny-panel/) rule: off-the-shelf where the market is standard, custom where the process is yours.'),
        note('*10–15% and 8–15 h/month less on guest questions are directional — volume, season, channel mix. In the audit I count your property, not a PropTech-Twitter average.'),
      ),
      section(
        'When the maths closes, and when it does not',
        p('It closes when you have repeat demand, a recognisable brand or paid traffic you already send to a property page, and commission eats a double-digit share. It does not close when 90% of nights still come from OTAs and the site has three visits a week. Then channel and offer first, not a payment engine.'),
        ul([
          'Count annual commission, not “2% here or there”.',
          'Add desk / WhatsApp hours on “where is the code”.',
          'Subtract Conversion Build (PLN 25,000–60,000) and gateway upkeep.',
          'If payback sits beyond 18–24 months on your numbers — I say so.',
        ]),
        p('A PLN 6,500 brochure will not carry this. Calendar, payment, Tedee/Nuki locks and a multilingual assistant are a [funnel](/artykuly/lejek-konwersji-na-stronie/), not five pages with a form.'),
      ),
      section(
        'Check-in without a desk is not a gadget',
        p('A lock code at 23:00 is part of the funnel: “arrive when you want” fails if someone must be on duty. A guest assistant (WhatsApp, apartment context, human escalation) takes repetitive questions. Estimate 8–15 h/month* — with an asterisk, because 36 apartments in Gdańsk is not your 4-room guesthouse.'),
        p('I do not ship an assistant that invents discounts. HITL: allowed actions, a log, a human on disputes. Same spine as [human-in-the-loop automation](/artykuly/automatyzacja-z-kontrola-czlowieka/).'),
      ),
      section(
        'What I will not promise from Mint as “your result”',
        ol([
          'I do not transfer Mint occupancy onto your property.',
          'I do not guarantee the OTA disappears — it often stays as fill.',
          'I do not build a PMS from scratch if Previo (or another standard) already holds channels.',
          'I do not show iDrive as live — it is not in production.',
        ]),
        p('Public proof is mintapartments.pl. Everything else is your numbers in a 20-minute audit. If you lack volume, we stay on a [company website](/artykuly/strona-firmowa-b2b/) and do not fake a booking engine.'),
      ),
      section(
        'A stack you can live with after handover',
        p('Astro/React on the front, Previo for stock, payment on-domain, locks, WhatsApp, language versions. After invoices, the code is yours. NDA is standard. I will not hold you on a theme you cannot export. Upkeep is the gateway and the PMS, not twenty WordPress plugins.'),
      ),
    ],
    faqs: [
      { q: 'Can I keep Booking and still take direct bookings?', a: 'Yes. I often do: OTA as a channel, your site as the cheaper till. Condition: the same stock, no double bookings.' },
      { q: 'What does it cost?', a: 'Conversion Build: PLN 25,000–60,000, not the brochure package. A range after the audit, once we count commission and handling hours.' },
      { q: 'Will you write a calendar from scratch?', a: 'Rarely. If a PMS/channel manager exists, I attach it. A custom calendar makes sense when the process is unusual and the off-the-shelf tool lies.' },
      { q: 'Is an AI assistant mandatory?', a: 'No. Booking and check-in first. I add an assistant when question volume justifies it — HITL, not a decorative chat.' },
    ],
    ctaTitle: 'Let us count commission before we code a calendar',
    ctaBody: 'Twenty minutes: whether direct booking has a right to close. Mint is clickable under [work](/#realizacje).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Бронювання на власному сайті замість комісії порталу',
    description:
      'Бронювання на власному сайті ріже комісію OTA: у Mint гість платить на 10–15% менше, ніж на Booking.com. Пишу, коли це сходиться і чому не будую календар з нуля.',
    h1: 'Бронювання на власному сайті: комісія порталу повертається як маржа',
    kicker: 'Mint Apartments · Conversion Build',
    lead:
      'Якщо продаєте ночі через Booking або Airbnb, комісія — не «витрата на маркетинг». Це податок з кожного бронювання, яке могли б закрити самі. У [Mint Apartments](https://mintapartments.pl) гість бронює на домені оператора, платить онлайн і отримує код до замка. Оцінка: на 10–15% дешевше для гостя, ніж на порталі*. Це єдиний публічний, клікабельний приклад бронювання, який показую — без вигаданих occupancy.',
    sections: [
      section(
        'Що означає «на власному сайті», а що досі OTA',
        p('Власний сайт із кнопкою «бронюйте на Booking» — не бронювання на власному сайті. Це банер. Власне бронювання: календар і ціна наживо, оплата на вашому домені, підтвердження й подальший супровід (код, правила, мова) без посередника в транзакції. Портал може лишитися каналом. Не мусить бути касою.'),
        p('У Mint календар і стани йдуть з Previo. Я не писав channel manager. Це рішення зі статті [SaaS чи власна панель](/artykuly/saas-czy-wlasny-panel/): готове там, де ринок стандартний, custom там, де процес ваш.'),
        note('*10–15% і 8–15 год/міс. менше на питаннях гостей — орієнтовні оцінки: обсяг, сезон, мікс каналів. На аудиті рахую ваш об’єкт, не середнє з PropTech Twitter.'),
      ),
      section(
        'Коли математика сходиться, а коли ні',
        p('Сходиться, коли є повторюваний попит, упізнаваний бренд або платний трафік, який ви й так ведете на картку об’єкта, а комісія з’їдає двозначний відсоток. Не сходиться, коли 90% ночей і так з OTA, а сайт має три візити на тиждень. Тоді спочатку канал і оферта, не рушій оплати.'),
        ul([
          'Порахуйте річну комісію, не «2% тут чи там».',
          'Додайте години ресепшена / WhatsApp на «де код».',
          'Відніміть вартість Conversion Build (25 000–60 000 злотих) і підтримку шлюзу.',
          'Якщо повернення далі ніж 18–24 місяці на ваших цифрах — кажу це прямо.',
        ]),
        p('Візитівка за 6 500 цього не потягне. Календар, оплата, замки Tedee/Nuki й асистент багатьма мовами — це [воронка](/artykuly/lejek-konwersji-na-stronie/), не п’ять сторінок із формою.'),
      ),
      section(
        'Заселення без ресепшена — не гаджет',
        p('Код до замка о 23:00 — частина воронки: обіцянка «приїдьте коли зручно» падає, якщо хтось мусить чергувати. Асистент для гостей (WhatsApp, контекст апартаментів, ескалація до людини) знімає повторювані питання. Оцінка 8–15 год/міс.* — із зірочкою, бо 36 апартаментів у Гданську — не ваш пансіон на 4 номери.'),
        p('Не впроваджую асистента, який вигадує знижки. HITL: дозволені дії, запис, людина при спорі. Той самий хребет, що в [автоматизації з контролем людини](/artykuly/automatyzacja-z-kontrola-czlowieka/).'),
      ),
      section(
        'Чого не обіцяю з Mint як «вашого результату»',
        ol([
          'Не переношу occupancy Mint на ваш об’єкт.',
          'Не гарантую, що OTA зникне — часто лишається доповненням.',
          'Не будую PMS з нуля, якщо Previo (чи інший стандарт) уже тримає канали.',
          'Не показую iDrive як live — його немає в продакшені.',
        ]),
        p('Публічний доказ — URL mintapartments.pl. Решта — ваші цифри на 20-хвилинному аудиті. Якщо немає обсягу, лишаємось на [корпоративному сайті](/artykuly/strona-firmowa-b2b/) і не вдаємо рушій бронювання.'),
      ),
      section(
        'Стек, з яким виживете після здачі',
        p('Astro/React на фронті, Previo на станах, оплата на домені, замки, WhatsApp, мовні версії. Код після рахунків ваш. NDA — стандарт. Не тримаю вас на темі, яку не експортуєте. Підтримка — шлюз і PMS, не двадцять плагінів WordPress.'),
      ),
    ],
    faqs: [
      { q: 'Чи можна лишити Booking і мати власне бронювання?', a: 'Так. Часто так і роблю: OTA як канал, власний сайт як дешевша каса. Умова: ті самі стани, нуль подвійних бронювань.' },
      { q: 'Скільки це коштує?', a: 'Це Conversion Build: 25 000–60 000 злотих, не пакет візитівки. Вилка після аудиту, коли порахуємо комісію й години обслуговування.' },
      { q: 'Чи напишете власний календар з нуля?', a: 'Рідко. Якщо PMS/channel manager є — підключаю. Власний календар має сенс, коли процес нетиповий і готове рішення бреше.' },
      { q: 'Чи асистент ШІ обов’язковий?', a: 'Ні. Спочатку бронювання і заселення. Асистента додаю, коли обсяг питань це обґрунтовує — HITL, не чат-прикраса.' },
    ],
    ctaTitle: 'Порахуймо комісію, перш ніж кодувати календар',
    ctaBody: '20 хвилин: чи бронювання на власному сайті має право зійтися. Mint можна клікнути в [реалізаціях](/#realizacje).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
