import { DATE, h3, note, offerCennik, offerKontakt, ol, p, section, table, ul } from './_blocks.mjs'

export default {
  slug: 'ile-kosztuje-strona-firmowa',
  keyword: 'ile kosztuje strona firmowa',
  keywordEn: 'how much a company website costs',
  keywordUk: 'скільки коштує корпоративний сайт',
  intent: 'commercial',
  cluster: 'strony',
  published: DATE,
  modified: DATE,
  related: [
    {
      slug: 'strona-firmowa-b2b',
      anchor: { pl: 'co wchodzi w stronę firmową B2B', en: 'what a B2B company website includes', uk: 'що входить у корпоративний сайт B2B' },
    },
    {
      slug: 'strona-wizytowka-czy-lejek',
      anchor: { pl: 'wizytówka czy lejek — która cena ma sens', en: 'brochure or funnel — which price makes sense', uk: 'візитівка чи воронка — яка ціна має сенс' },
    },
    {
      slug: 'audyt-strony-internetowej',
      anchor: { pl: 'audyt od 1 500 zł, zanim wydasz na wdrożenie', en: 'an audit from PLN 1,500 before you spend on a build', uk: 'аудит від 1 500 злотих перед впровадженням' },
    },
  ],
  offer: [offerCennik(), offerKontakt()],
  pl: {
    title: 'Ile kosztuje strona firmowa w 2026: realne widełki',
    description:
      'Ile kosztuje strona firmowa u mnie: od 2 000 zł za wizytówkę, od 8 000 zł za stronę z lejkiem konwersji. Tłumaczę, co jest w cenie, czego nie ma i kiedy zaczyna się platforma od 25 tys.',
    h1: 'Ile kosztuje strona firmowa: moje widełki, nie „od 1999 zł”',
    kicker: 'Wycena · 2026',
    lead:
      'Pytanie „ile kosztuje strona firmowa” jest złe, dopóki nie powiesz, czy chcesz wizytówkę z formularzem, czy maszynę, która kwalifikuje zapytania. Publikuję widełki przed rozmową, bo ukrywanie rzędu wielkości filtruje poważnych klientów w złą stronę. Poniżej: od 2 000 zł za wizytówkę (Start), od 8 000 zł za stronę z lejkiem i integracjami (Launch), od 25 000 zł za platformę z rezerwacjami i panelem — oraz to, czego w tych kwotach świadomie nie ma.',
    sections: [
      section(
        'Moja cena, zanim porównasz ją z cennikiem z Google',
        p('Pakiet Start (wizytówka lub landing, do 5 podstron, formularz, podstawowe SEO, Astro albo Next pod markę): od 2 000 zł netto. Nie jest to szablon WordPress za 2–5 tys. z AI-copy — to custom pod Twoją markę, tylko bez lejka i integracji. Pakiet Launch (strona pod sprzedaż, lejek konwersji, integracje formularz→CRM, kalendarz, techniczne SEO): od 8 000 zł. Platforma (rezerwacje na własnej domenie, panel operacyjny, API, wielojęzyczność): od 25 000 zł. AI Ops (agenci, automatyzacje, utrzymanie): od 3 000 zł/mies. [Audit Sprint](/artykuly/audyt-strony-internetowej/): od 1 500 zł, kwota może zostać zaliczona na wdrożenie, jeśli obie strony widzą sens.'),
        p('Na rynku PL 2026 publiczne artykuły agencji i freelancerów podają wizytówki od mniej więcej 1 500–4 000 zł, „stronę firmową” często 4–12 tys., a rozbudowane serwisy 15 tys. plus. Digital Vantage w zestawieniu ofert podawało medianę strony firmowej w okolicy 5 900 zł. To kontekst, nie moje badanie. Mój pakiet Start startuje niżej, bo to prosta wizytówka bez integracji — rosnę wraz z zakresem, nie z pozorami.'),
        note('Wszystkie kwoty netto. Nie doliczam hostingu jako ukrytego abonamentu „w cenie strony”. Hosting i domena są osobno, zwykle niski trzycyfrowy koszt roczny przy tej skali — bez 2 000 zł/mies. „opieki”, której nie potrzebujesz.'),
      ),
      section(
        'Z czego składa się Start versus Launch',
        p('Start: mała firma, jasna oferta, Twoje teksty i zdjęcia w przyzwoitym stanie, jeden język, formularz, brak integracji. Launch: lejek sprzedażowy, formularz spięty z CRM, kalendarz albo booking, techniczne SEO, pomiar konwersji od kliknięcia do leada. Nie przesuwam Cię w górę za „więcej paddingów” — przesuwam, gdy realnie zmienia się zakres.'),
        table(
          ['Sygnał', 'Bliżej pakietu Start (od 2 000 zł)', 'Bliżej pakietu Launch (od 8 000 zł)'],
          [
            ['Treść', 'Masz ofertę na jednej stronie Word', 'Oferta nieustalona, trzeba ją dopiero nazwać'],
            ['Dowód', 'Jedno żywe wdrożenie albo proces', 'Chcesz „portfolio 20 case’ów”, których nie ma'],
            ['Integracje', 'Formularz + mail', 'CRM, kalendarz, płatności, techniczne SEO'],
            ['Języki', 'PL', 'PL/EN/UA, hreflang, trzy copy'],
            ['Cel', 'Zapytanie od kogoś, kto Cię zna', 'Kampania, kwalifikacja, pomiar konwersji'],
          ],
        ),
        p('Jeśli po audycie wychodzi, że Launch nie pokryje celu — bo w grę wchodzą rezerwacje na własnej domenie, panel albo API — nie „dopycham pakietu”. Mówię: Platforma (od 25 000 zł) albo nic. Lepiej usłyszeć „nie wdrażaj” niż kupić stronę, która nie ma prawa zwrócić się w 12 miesięcy.'),
      ),
      section(
        'Ukryte koszty, których nie chowam w „opiece SEO”',
        ul([
          'Copywriting od zera — poza pakietem Start.',
          'Blog i klastry treści — osobny strumień, nie gratis do wizytówki.',
          'Wielojęzyczność — nie jest „przełączeniem w CMS”.',
          'Integracja CRM / płatności / Previo — to już Launch albo Platforma.',
          'Zdjęcia stockowe w stylu „uśmiechnięty handshake” — nie kupuję ich za Twoje pieniądze, bo psują zaufanie w B2B.',
        ]),
        p('TCO przez trzy lata przy wizytówce to wdrożenie plus hosting plus kilka godzin zmian rocznie. Nie sprzedaję abonamentu 1 500 zł/mies. za aktualizacje wtyczek, bo nie buduję stosu wtyczek. Jeśli ktoś wycenia stronę na 4 000 zł i 800 zł miesięcznie „SEO”, porównuj trzy lata, nie fakturę startową.'),
      ),
      section(
        'Kiedy pakiet Start jest za drogi, a kiedy za tani',
        p('Za drogi: masz dwa telefony w miesiącu z polecenia, Google nic nie wie, a chcesz „stronę jak u korporacji”. Wtedy najpierw oferta i kanał. Za tani: płacisz 40 zł za klik w Google Ads, a landing ładuje się 6 sekund i prowadzi do mailto. Wtedy Start jest źle wydanym budżetem — potrzebujesz [lejka](/artykuly/lejek-konwersji-na-stronie/) z pakietu Launch i pomiaru.'),
        p('Licznik, którego używam: jeśli odzyskujesz kilka godzin obsługi miesięcznie albo ucinasz prowizję portalu, budżet Launch (od 8 000 zł) albo Platforma (od 25 000 zł) ma szansę się spiąć. Jeśli celem jest „żeby było ładnie”, nawet 2 000 zł może być za dużo. Estetyka bez zapytań to koszt, nie inwestycja.'),
      ),
      section(
        'Jak wygląda wycena po 20 minutach, nie po briefie na 40 slajdów',
        ol([
          'Słucham, co zjada czas albo blokuje sprzedaż.',
          'Mówię pakiet (Start, Launch, Platforma, AI Ops) albo „odłóż”.',
          'Jeśli strona firmowa — cena od widełek pakietu i data pierwszego stagingu (typowo 2–4 tygodnie).',
          'Jeśli nie wiadomo, czy w ogóle wdrażać — [Audit Sprint](/artykuly/audyt-strony-internetowej/) zamiast zgadywania.',
        ]),
        p('Nie wysyłam trzech wariantów „silver / gold / platinum” z tym samym szablonem. Jedna rekomendacja. Kod po fakturach jest Twój. Porównaj to z agencją, która trzyma Cię na royalty motywu.'),
      ),
      section(
        'Czego nie porównuj jeden do jednego',
        p('Oferta „strona + sklep + AI + pozycjonowanie 12 miesięcy” za 500 zł to inny produkt albo pusta obietnica. Oferta software house’u 40 000 zł za five-pager z discovery na kwartał — też inny produkt. Ja jestem pośrodku: jeden człowiek, pełne wdrożenie, mierzalny cel. [Strona firmowa B2B](/artykuly/strona-firmowa-b2b/) opisuje zakres merytoryczny; ten tekst trzyma się pieniędzy.'),
        p('Nie podaję „średniej stawki godzinowej z Upwork”. Podaję pakiet, bo właściciel firmy kupuje wynik (formularz, który dochodzi, strona, która stoi, zapytania, które da się policzyć), nie godzinę juniora.'),
      ),
    ],
    faqs: [
      {
        q: 'Czy 2 000 zł za pakiet Start to cena netto?',
        a: 'Tak, podaję netto. VAT doliczam zgodnie z Twoim statusem. Nie chowam go w „promocji”.',
      },
      {
        q: 'Czy mogę zapłacić mniej, jeśli dam swój szablon?',
        a: 'Nie biorę ThemeForest do produkcji. Taniej wychodzi zrobić lekki custom niż przez rok gasić wtyczki. Jeśli budżet jest poniżej 2 000 zł — powiem, że nie jestem wykonawcą, zamiast psuć zakres.',
      },
      {
        q: 'Ile kosztuje utrzymanie po starcie?',
        a: 'Hosting i domena osobno. Drobne zmiany wyceniam godzinowo albo w krótkim retainerze, nie jako obowiązkowy abonament. Jeśli chcesz stałą opiekę i rozwój — to pakiet AI Ops od 3 000 zł/mies.',
      },
      {
        q: 'Kiedy pakiet Launch (od 8 000 zł) to za mało?',
        a: 'Gdy potrzebujesz rezerwacji na własnej stronie, panelu operacyjnego albo API. To Platforma: od 25 000 zł. Launch tego nie udaje.',
      },
    ],
    ctaTitle: 'Dostaniesz rząd wielkości, nie teatr wycen',
    ctaBody:
      '20 minut wystarczy, żeby powiedzieć: Start, Launch, Platforma, albo nie wdrażaj. Szczegóły pakietów są w [cenniku](/#cennik).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'What a company website costs in 2026: real ranges',
    description:
      'What a company website costs with me: from PLN 2,000 for a brochure site, from PLN 8,000 for a site with a conversion funnel. I spell out what is included and when a PLN 25k+ platform starts.',
    h1: 'What a company website costs: my ranges, not “from $499”',
    kicker: 'Pricing · 2026',
    lead:
      '“How much does a company website cost?” is the wrong question until you say whether you need a brochure with a form or a machine that qualifies enquiries. I publish ranges before the call, because hiding the order of magnitude filters serious buyers the wrong way. Below: from PLN 2,000 for a brochure (Start), from PLN 8,000 for a site with a funnel and integrations (Launch), from PLN 25,000 for a platform with booking and a panel — and what those numbers deliberately exclude.',
    sections: [
      section(
        'My price, before you compare it with a Google round-up',
        p('The Start package (a brochure or landing page, up to 5 pages, a form, on-page SEO, Astro or Next under your brand): from PLN 2,000 net. It is not a PLN 2–5k WordPress theme with AI copy — it is custom work for your brand, just without a funnel or integrations. The Launch package (a site built to sell, a conversion funnel, form → CRM, calendar, technical SEO): from PLN 8,000. Platform (booking on your own domain, an ops panel, an API, multilingual): from PLN 25,000. AI Ops (agents, automations, maintenance): from PLN 3,000/month. [Audit Sprint](/artykuly/audyt-strony-internetowej/): from PLN 1,500, creditable toward a build if both sides see a point.'),
        p('Polish 2026 public posts from agencies and freelancers often list brochures at roughly 1,500–4,000, a “company site” at 4–12k, and larger builds from 15k. One round-up (Digital Vantage) put a company-site median near PLN 5,900. That is context, not my survey. My Start package starts lower because it is a simple brochure with no integrations — the price grows with real scope, not appearances.'),
        note('All figures are net. I do not bury hosting in a fake “included care plan”. Domain and hosting are separate, usually a low three-digit annual cost at this scale — not a PLN 2,000/month retainer you do not need.'),
      ),
      section(
        'What separates Start from Launch',
        p('Start: a small firm, a clear offer, decent copy and photos from you, one language, a form, no integrations. Launch: a sales funnel, a form wired to your CRM, a calendar or booking, technical SEO, conversion measurement from click to lead. I do not charge extra for “more padding” — I move you up when the scope actually changes.'),
        table(
          ['Signal', 'Closer to Start (from PLN 2,000)', 'Closer to Launch (from PLN 8,000)'],
          [
            ['Copy', 'You have the offer on one Word page', 'The offer is unnamed; we would have to invent it'],
            ['Proof', 'One live deployment or a process', 'You want “20 case studies” that do not exist'],
            ['Integrations', 'Form + email', 'CRM, calendar, payments, technical SEO'],
            ['Languages', 'One', 'PL/EN/UA, hreflang, three copies'],
            ['Goal', 'An enquiry from someone who knows you', 'Ads, qualification, conversion measurement'],
          ],
        ),
        p('If the audit shows Launch cannot cover the goal — because it needs on-domain booking, a panel or an API — I do not stuff the package. I say Platform (from PLN 25,000) or nothing. Better to hear “do not ship” than to buy a site that cannot return in 12 months.'),
      ),
      section(
        'Costs I will not hide inside “SEO care”',
        ul([
          'Copywriting from scratch — outside the Start package.',
          'A blog and topic clusters — a separate stream, not a freebie.',
          'Multilingual — not a CMS toggle.',
          'CRM / payments / Previo — that is already Launch or Platform.',
          'Handshake stock photos — I will not spend your money on them; they hurt B2B trust.',
        ]),
        p('Three-year TCO for a brochure is the build plus hosting plus a few change hours a year. I do not sell a PLN 1,500/month plugin-patching plan, because I do not build a plugin pile. If someone quotes PLN 4,000 plus PLN 800/month “SEO”, compare three years, not the kickoff invoice.'),
      ),
      section(
        'When the Start package is too expensive, and when it is too cheap',
        p('Too expensive: two referral calls a month, Google knows nothing, and you want a “corporate” site. Fix the offer and the channel first. Too cheap: you pay for Google Ads clicks, the landing takes six seconds and ends in mailto. Then Start is wasted budget — you need a [funnel](/artykuly/lejek-konwersji-na-stronie/) from the Launch package and measurement.'),
        p('The counter I use: if you recover a few hours of handling a month or you cut portal commission, a Launch (from PLN 8,000) or Platform (from PLN 25,000) budget can close. If the goal is “make it pretty”, even PLN 2,000 can already be too much. Looks without enquiries are a cost, not an investment.'),
      ),
      section(
        'Pricing after twenty minutes, not a 40-slide brief',
        ol([
          'I listen to what eats time or blocks sales.',
          'I name a package — Start, Launch, Platform, AI Ops — or say “wait”.',
          'If it is a company site — a figure from the package floor and a first staging date (typically 2–4 weeks).',
          'If we do not even know whether to build — an [Audit Sprint](/artykuly/audyt-strony-internetowej/) instead of guessing.',
        ]),
        p('I do not send silver / gold / platinum with the same theme. One recommendation. After invoices, the code is yours. Compare that with an agency that keeps you on a theme royalty.'),
      ),
      section(
        'Do not compare unlike products',
        p('A “site + shop + AI + 12 months of SEO” for PLN 500 is a different product or an empty promise. A software house at PLN 40,000 for a five-pager with a quarter of discovery is also a different product. I sit in the middle: one person, a full implementation, a measurable goal. [The B2B company website](/artykuly/strona-firmowa-b2b/) covers the scope; this piece stays on money.'),
        p('I do not quote an “average Upwork hourly rate”. I quote a package, because an owner buys an outcome (a form that arrives, a site that stays up, enquiries you can count), not a junior’s hour.'),
      ),
    ],
    faqs: [
      {
        q: 'Is the PLN 2,000 Start price net?',
        a: 'Yes. VAT is added according to your status. I do not hide it in a “promotion”.',
      },
      {
        q: 'Can I pay less if I bring my own theme?',
        a: 'I do not take ThemeForest to production. A light custom build is cheaper than a year of plugin fires. If the budget is under PLN 2,000, I will say I am not the contractor rather than gut the scope.',
      },
      {
        q: 'What does upkeep cost after launch?',
        a: 'Hosting and domain separately. Small changes are hourly or a short retainer, not a mandatory subscription. If you want ongoing care and development, that is the AI Ops package from PLN 3,000/month.',
      },
      {
        q: 'When is the Launch package (from PLN 8,000) not enough?',
        a: 'When you need booking on your own site, an ops panel or an API. That is Platform: from PLN 25,000. Launch cannot fake it.',
      },
    ],
    ctaTitle: 'You get an order of magnitude, not a quoting theatre',
    ctaBody:
      'Twenty minutes is enough to say: Start, Launch, Platform, or do not implement. Package detail is on the [pricing section](/#cennik).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Скільки коштує корпоративний сайт у 2026: вилки',
    description:
      'Скільки коштує корпоративний сайт у мене: від 2 000 злотих за візитівку, від 8 000 за сайт з воронкою конверсії. Пояснюю, що в ціні і коли починається платформа від 25 тис.',
    h1: 'Скільки коштує корпоративний сайт: мої вилки, не «від 1999»',
    kicker: 'Оцінка · 2026',
    lead:
      'Питання «скільки коштує корпоративний сайт» хибне, доки ви не скажете, чи потрібна візитівка з формою, чи машина, яка кваліфікує запити. Публікую вилки до розмови, бо приховування порядку величини відсікає серйозних клієнтів не туди. Нижче: від 2 000 злотих за візитівку (Start), від 8 000 за сайт з воронкою і інтеграціями (Launch), від 25 000 за платформу з бронюванням і панеллю — і те, чого в цих сумах свідомо немає.',
    sections: [
      section(
        'Моя ціна, перш ніж порівнювати її з Google',
        p('Пакет Start (візитівка або лендінг, до 5 сторінок, форма, базове SEO, Astro або Next під бренд): від 2 000 злотих нетто. Це не шаблон WordPress за 2–5 тис. з AI-копірайтом — це custom під ваш бренд, лише без воронки та інтеграцій. Пакет Launch (сайт під продаж, воронка конверсії, форма → CRM, календар, технічне SEO): від 8 000 злотих. Платформа (бронювання на власному домені, операційна панель, API, багатомовність): від 25 000 злотих. AI Ops (агенти, автоматизації, підтримка): від 3 000 злотих/міс. [Audit Sprint](/artykuly/audyt-strony-internetowej/): від 1 500 злотих, сума може бути зарахована на впровадження, якщо обидві сторони бачать сенс.'),
        p('На ринку PL 2026 публічні тексти агенцій і фрилансерів ставлять візитівки приблизно на 1 500–4 000, «сайт компанії» часто 4–12 тис., розбудовані сервіси від 15 тис. У одному огляді (Digital Vantage) медіана сайту компанії була біля 5 900 злотих. Це контекст, не моє дослідження. Мій пакет Start починається нижче, бо це проста візитівка без інтеграцій — ціна росте з реальним обсягом, не з видимістю.'),
        note('Усі суми нетто. Я не ховаю хостинг у фальшивому «плані опіки». Домен і хостинг окремо, зазвичай низький тризначний річний кошт у цьому масштабі — не 2 000 злотих/міс. «підтримки», якої вам не потрібно.'),
      ),
      section(
        'З чого складається Start проти Launch',
        p('Start: мала фірма, зрозуміла оферта, ваші тексти й фото в пристойному стані, одна мова, форма, без інтеграцій. Launch: воронка продажів, форма, з’єднана з CRM, календар або бронювання, технічне SEO, вимір конверсії від кліку до ліда. Я не піднімаю ціну за «більше відступів» — піднімаю, коли реально змінюється обсяг.'),
        table(
          ['Сигнал', 'Ближче до Start (від 2 000)', 'Ближче до Launch (від 8 000)'],
          [
            ['Контент', 'Оферта на одній сторінці Word', 'Оферта не названа, її ще треба вигадати'],
            ['Доказ', 'Одне живе впровадження або процес', 'Хочете «20 кейсів», яких немає'],
            ['Інтеграції', 'Форма + пошта', 'CRM, календар, платежі, технічне SEO'],
            ['Мови', 'Одна', 'PL/EN/UA, hreflang, три копії'],
            ['Мета', 'Запит від когось, хто вас знає', 'Кампанія, кваліфікація, вимір конверсії'],
          ],
        ),
        p('Якщо після аудиту Launch не покриває ціль — бо потрібне бронювання на власному домені, панель або API — я не «донабиваю пакет». Кажу: Платформа (від 25 000) або нічого. Краще почути «не впроваджуйте», ніж купити сайт, який не має права повернутися за 12 місяців.'),
      ),
      section(
        'Приховані витрати, яких я не ховаю в «SEO-опіці»',
        ul([
          'Копірайт з нуля — поза пакетом Start.',
          'Блоґ і кластери — окремий потік, не подарунок до візитівки.',
          'Багатомовність — не «перемикач у CMS».',
          'CRM / платежі / Previo — уже Launch або Платформа.',
          'Стокові рукостискання — не купую їх за ваші гроші, вони псують довіру в B2B.',
        ]),
        p('TCO за три роки для візитівки — впровадження плюс хостинг плюс кілька годин змін на рік. Я не продаю абонемент 1 500 злотих/міс. на латки плагінів, бо не будую стіс плагінів. Якщо хтось ставить 4 000 плюс 800/міс. «SEO», порівнюйте три роки, не стартовий рахунок.'),
      ),
      section(
        'Коли пакет Start задорогий, а коли задешевий',
        p('Задорогий: два дзвінки з рекомендації на місяць, Google нічого не знає, а ви хочете «як у корпорації». Спочатку оферта й канал. Задешевий: платите за кліки в Google Ads, лендінг вантажиться 6 секунд і веде на mailto. Тоді Start — погано витрачений бюджет, потрібна [воронка](/artykuly/lejek-konwersji-na-stronie/) з пакета Launch і вимір.'),
        p('Лічильник, яким користуюся: якщо повертаєте кілька годин обслуговування на місяць або ріжете комісію порталу, бюджет Launch (від 8 000) або Платформа (від 25 000) має шанс зійтися. Якщо ціль — «щоб було гарно», навіть 2 000 може бути забагато. Естетика без запитів — витрата, не інвестиція.'),
      ),
      section(
        'Як виглядає оцінка після 20 хвилин, не після брифу на 40 слайдів',
        ol([
          'Слухаю, що з’їдає час або блокує продаж.',
          'Називаю пакет (Start, Launch, Платформа, AI Ops) або «зачекайте».',
          'Якщо корпоративний сайт — ціна від порога пакета і дата першого staging (типово 2–4 тижні).',
          'Якщо не зрозуміло, чи взагалі впроваджувати — [Audit Sprint](/artykuly/audyt-strony-internetowej/) замість вгадування.',
        ]),
        p('Я не надсилаю silver / gold / platinum з тим самим шаблоном. Одна рекомендація. Код після рахунків ваш. Порівняйте з агенцією, яка тримає вас на royalty теми.'),
      ),
      section(
        'Що не порівнювати один до одного',
        p('Оферта «сайт + магазин + ШІ + 12 місяців SEO» за 500 — інший продукт або порожня обіцянка. Software house за 40 000 за five-pager із discovery на квартал — теж інший продукт. Я посередині: одна людина, повне впровадження, вимірювана ціль. [Корпоративний сайт B2B](/artykuly/strona-firmowa-b2b/) описує зміст; цей текст тримається грошей.'),
        p('Я не даю «середню ставку з Upwork». Даю пакет, бо власник купує результат (форма доходить, сайт стоїть, запити можна порахувати), не годину джуніора.'),
      ),
    ],
    faqs: [
      {
        q: 'Чи 2 000 злотих за пакет Start — це нетто?',
        a: 'Так, нетто. ПДВ додаю згідно з вашим статусом. Не ховаю його в «акції».',
      },
      {
        q: 'Чи можна дешевше, якщо дам свій шаблон?',
        a: 'Не беру ThemeForest у продакшен. Дешевше зробити легкий custom, ніж рік гасити плагіни. Якщо бюджет менше 2 000 — скажу, що я не виконавець, а не поріжу обсяг.',
      },
      {
        q: 'Скільки коштує підтримка після старту?',
        a: 'Хостинг і домен окремо. Дрібні зміни — погодинно або короткий ретейнер, не обов’язковий абонемент. Якщо потрібна постійна підтримка й розвиток — це пакет AI Ops від 3 000 злотих/міс.',
      },
      {
        q: 'Коли пакета Launch (від 8 000) замало?',
        a: 'Коли потрібне бронювання на власному сайті, операційна панель або API. Це Платформа: від 25 000. Launch цього не імітує.',
      },
    ],
    ctaTitle: 'Отримаєте порядок величини, не театр оцінок',
    ctaBody:
      '20 хвилин досить, щоб сказати: Start, Launch, Платформа, або не впроваджувати. Деталі пакетів — у [цінах](/#cennik).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
