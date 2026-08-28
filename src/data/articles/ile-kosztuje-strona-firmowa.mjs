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
      anchor: { pl: 'audyt za 2 500–6 000 zł, zanim wydasz na wdrożenie', en: 'a PLN 2,500–6,000 audit before you spend on a build', uk: 'аудит за 2 500–6 000 злотих перед впровадженням' },
    },
  ],
  offer: [offerCennik(), offerKontakt()],
  pl: {
    title: 'Ile kosztuje strona firmowa w 2026: realne widełki',
    description:
      'Ile kosztuje strona firmowa u mnie: 6 500–12 000 zł za custom do 5 podstron. Tłumaczę, co jest w cenie, czego nie ma i kiedy zaczyna się lejek 25–60 tys.',
    h1: 'Ile kosztuje strona firmowa: moje widełki, nie „od 1999 zł”',
    kicker: 'Wycena · 2026',
    lead:
      'Pytanie „ile kosztuje strona firmowa” jest złe, dopóki nie powiesz, czy chcesz wizytówkę z formularzem, czy maszynę, która kwalifikuje zapytania. Publikuję widełki przed rozmową, bo ukrywanie rzędu wielkości filtruje poważnych klientów w złą stronę. Poniżej: 6 500–12 000 zł za custom do pięciu podstron, 25 000–60 000 zł za Conversion Build, oraz to, czego w tych kwotach świadomie nie ma.',
    sections: [
      section(
        'Moja cena, zanim porównasz ją z cennikiem z Google',
        p('Strona firmowa, którą wdrażam: 6 500–12 000 zł netto, do 5 podstron, formularz, podstawowe SEO, Astro albo Next pod markę. Nie jest to szablon WordPress za 2–5 tys. z AI-copy. Conversion Build (strona pod sprzedaż, kwalifikacja, rezerwacje na własnej domenie): 25 000–60 000 zł. Ops System: od 60 000 zł. [Audit Sprint](/artykuly/audyt-strony-internetowej/): 2 500–6 000 zł, kwota może zostać zaliczona na wdrożenie, jeśli obie strony widzą sens.'),
        p('Na rynku PL 2026 publiczne artykuły agencji i freelancerów podają wizytówki od mniej więcej 1 500–4 000 zł, „stronę firmową” często 4–12 tys., a rozbudowane serwisy 15 tys. plus. Digital Vantage w zestawieniu ofert podawało medianę strony firmowej w okolicy 5 900 zł. To kontekst, nie moje badanie. Moja dolna granica jest wyżej, bo nie sprzedaję motywu z wymienionym logo i nie obiecuję bloga w tej kwocie.'),
        note('Wszystkie kwoty netto. Nie doliczam hostingu jako ukrytego abonamentu „w cenie strony”. Hosting i domena są osobno, zwykle niski trzycyfrowy koszt roczny przy tej skali — bez 2 000 zł/mies. „opieki”, której nie potrzebujesz.'),
      ),
      section(
        'Z czego składa się 6 500 versus 12 000',
        p('Dolny próg: mała firma, jasna oferta, Twoje teksty i zdjęcia w przyzwoitym stanie, jeden język, formularz, brak integracji. Górny: więcej redakcji, trudniejsza hierarchia oferty, mapa i godziny, dopracowanie mobile, pomiar zapytań, ewentualnie prosta animacja albo nietypowy layout. Nie przesuwam Cię w górę za „więcej paddingów”.'),
        table(
          ['Sygnał', 'Bliżej 6 500 zł', 'Bliżej 12 000 zł albo lejek'],
          [
            ['Treść', 'Masz ofertę na jednej stronie Word', 'Oferta nieustalona, trzeba ją dopiero nazwać'],
            ['Dowód', 'Jedno żywe wdrożenie albo proces', 'Chcesz „portfolio 20 case’ów”, których nie ma'],
            ['Integracje', 'Formularz + mail', 'CRM, płatności, kalendarz, zamki'],
            ['Języki', 'PL', 'PL/EN/UA, hreflang, trzy copy'],
            ['Cel', 'Zapytanie od kogoś, kto Cię zna', 'Kampania, rezerwacja, kwalifikacja'],
          ],
        ),
        p('Jeśli po audycie wychodzi, że 12 000 zł nie pokryje celu, nie „dopycham pakietu”. Mówię: Conversion Build albo nic. Lepiej usłyszeć „nie wdrażaj” niż kupić stronę, która nie ma prawa zwrócić się w 12 miesięcy.'),
      ),
      section(
        'Ukryte koszty, których nie chowam w „opiece SEO”',
        ul([
          'Copywriting od zera — poza pakietem strony firmowej.',
          'Blog i klastry treści — osobny strumień, nie gratis do wizytówki.',
          'Wielojęzyczność — nie jest „przełączeniem w CMS”.',
          'Integracja CRM / płatności / Previo — to już lejek albo panel.',
          'Zdjęcia stockowe w stylu „uśmiechnięty handshake” — nie kupuję ich za Twoje pieniądze, bo psują zaufanie w B2B.',
        ]),
        p('TCO przez trzy lata przy wizytówce to wdrożenie plus hosting plus kilka godzin zmian rocznie. Nie sprzedaję abonamentu 1 500 zł/mies. za aktualizacje wtyczek, bo nie buduję stosu wtyczek. Jeśli ktoś wycenia stronę na 4 000 zł i 800 zł miesięcznie „SEO”, porównuj trzy lata, nie fakturę startową.'),
      ),
      section(
        'Kiedy strona za 8 tysięcy jest za droga, a kiedy za tania',
        p('Za droga: masz dwa telefony w miesiącu z polecenia, Google nic nie wie, a chcesz „stronę jak u korporacji”. Wtedy najpierw oferta i kanał. Za tania: płacisz 40 zł za klik w Google Ads, a landing ładuje się 6 sekund i prowadzi do mailto. Wtedy 8 tys. na wizytówkę jest źle wydane — potrzebujesz [lejka](/artykuly/lejek-konwersji-na-stronie/) i pomiaru.'),
        p('Licznik, którego używam: jeśli odzyskujesz 8 godzin obsługi miesięcznie albo ucinasz prowizję portalu, budżet 25 tys.+ ma szansę się spiąć. Jeśli celem jest „żeby było ładnie”, 6 500 zł też może być za dużo. Estetyka bez zapytań to koszt, nie inwestycja.'),
      ),
      section(
        'Jak wygląda wycena po 20 minutach, nie po briefie na 40 slajdów',
        ol([
          'Słucham, co zjada czas albo blokuje sprzedaż.',
          'Mówię pakiet albo „odłóż”.',
          'Jeśli strona firmowa — widełki w podanym przedziale i data pierwszego stagingu (typowo 2–4 tygodnie).',
          'Jeśli nie wiadomo, czy w ogóle wdrażać — [Audit Sprint](/artykuly/audyt-strony-internetowej/) zamiast zgadywania.',
        ]),
        p('Nie wysyłam trzech wariantów „silver / gold / platinum” z tym samym szablonem. Jedna rekomendacja. Kod po fakturach jest Twój. Porównaj to z agencją, która trzyma Cię na royalty motywu.'),
      ),
      section(
        'Czego nie porównuj jeden do jednego',
        p('Oferta „strona + sklep + AI + pozycjonowanie 12 miesięcy” za 5 000 zł to inny produkt albo pusta obietnica. Oferta software house’u 40 000 zł za five-pager z discovery na kwartał — też inny produkt. Ja jestem pośrodku: jeden człowiek, pełne wdrożenie, mierzalny cel. [Strona firmowa B2B](/artykuly/strona-firmowa-b2b/) opisuje zakres merytoryczny; ten tekst trzyma się pieniędzy.'),
        p('Nie podaję „średniej stawki godzinowej z Upwork”. Podaję pakiet, bo właściciel firmy kupuje wynik (formularz, który dochodzi, strona, która stoi, zapytania, które da się policzyć), nie godzinę juniora.'),
      ),
    ],
    faqs: [
      {
        q: 'Czy 6 500 zł to cena netto?',
        a: 'Tak, podaję netto. VAT doliczam zgodnie z Twoim statusem. Nie chowam go w „promocji”.',
      },
      {
        q: 'Czy mogę zapłacić mniej, jeśli dam swój szablon?',
        a: 'Nie biorę ThemeForest do produkcji. Taniej wychodzi zrobić lekki custom niż przez rok gasić wtyczki. Jeśli budżet jest 3 000 zł — powiem, że nie jestem wykonawcą, zamiast psuć zakres.',
      },
      {
        q: 'Ile kosztuje utrzymanie po starcie?',
        a: 'Hosting i domena osobno. Drobne zmiany wyceniam godzinowo albo w krótkim retainerze, nie jako obowiązkowy abonament. Nie ma stosu wtyczek do łatania co tydzień.',
      },
      {
        q: 'Kiedy 12 000 zł to za mało?',
        a: 'Gdy potrzebujesz kwalifikacji zapytań, rezerwacji na własnej stronie, wielu landingów albo integracji. To Conversion Build: 25 000–60 000 zł. Wizytówka tego nie udaje.',
      },
    ],
    ctaTitle: 'Dostaniesz rząd wielkości, nie teatr wycen',
    ctaBody:
      '20 minut wystarczy, żeby powiedzieć: 6,5–12 tys., 25–60 tys., albo nie wdrażaj. Szczegóły pakietów są w [cenniku](/#cennik).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'What a company website costs in 2026: real ranges',
    description:
      'What a company website costs with me: PLN 6,500–12,000 for a custom site up to 5 pages. I spell out what is included, what is not, and when a PLN 25–60k funnel starts.',
    h1: 'What a company website costs: my ranges, not “from $499”',
    kicker: 'Pricing · 2026',
    lead:
      '“How much does a company website cost?” is the wrong question until you say whether you need a brochure with a form or a machine that qualifies enquiries. I publish ranges before the call, because hiding the order of magnitude filters serious buyers the wrong way. Below: PLN 6,500–12,000 for a custom five-page site, PLN 25,000–60,000 for Conversion Build, and what those numbers deliberately exclude.',
    sections: [
      section(
        'My price, before you compare it with a Google round-up',
        p('The company website I ship: PLN 6,500–12,000 net, up to 5 pages, a form, on-page SEO, Astro or Next under your brand. It is not a PLN 2–5k WordPress theme with AI copy. Conversion Build (a site built to sell, qualification, on-domain booking): PLN 25,000–60,000. Ops System: from PLN 60,000. [Audit Sprint](/artykuly/audyt-strony-internetowej/): PLN 2,500–6,000, creditable toward a build if both sides see a point.'),
        p('Polish 2026 public posts from agencies and freelancers often list brochures at roughly 1,500–4,000, a “company site” at 4–12k, and larger builds from 15k. One round-up (Digital Vantage) put a company-site median near PLN 5,900. That is context, not my survey. My floor is higher because I do not sell a swapped logo and I do not pretend a blog is in the fee.'),
        note('All figures are net. I do not bury hosting in a fake “included care plan”. Domain and hosting are separate, usually a low three-digit annual cost at this scale — not a PLN 2,000/month retainer you do not need.'),
      ),
      section(
        'What separates 6,500 from 12,000',
        p('Lower end: a small firm, a clear offer, decent copy and photos from you, one language, a form, no integrations. Upper end: more editing, a messier offer hierarchy, map and hours, tighter mobile, enquiry measurement, maybe a simple motion or an unusual layout. I do not charge extra for “more padding”.'),
        table(
          ['Signal', 'Closer to PLN 6,500', 'Closer to 12,000 or a funnel'],
          [
            ['Copy', 'You have the offer on one Word page', 'The offer is unnamed; we would have to invent it'],
            ['Proof', 'One live deployment or a process', 'You want “20 case studies” that do not exist'],
            ['Integrations', 'Form + email', 'CRM, payments, calendar, locks'],
            ['Languages', 'One', 'PL/EN/UA, hreflang, three copies'],
            ['Goal', 'An enquiry from someone who knows you', 'Ads, booking, qualification'],
          ],
        ),
        p('If the audit shows PLN 12,000 cannot cover the goal, I do not stuff the package. I say Conversion Build or nothing. Better to hear “do not ship” than to buy a site that cannot return in 12 months.'),
      ),
      section(
        'Costs I will not hide inside “SEO care”',
        ul([
          'Copywriting from scratch — outside the company-site package.',
          'A blog and topic clusters — a separate stream, not a freebie.',
          'Multilingual — not a CMS toggle.',
          'CRM / payments / Previo — funnel or operations panel.',
          'Handshake stock photos — I will not spend your money on them; they hurt B2B trust.',
        ]),
        p('Three-year TCO for a brochure is the build plus hosting plus a few change hours a year. I do not sell a PLN 1,500/month plugin-patching plan, because I do not build a plugin pile. If someone quotes PLN 4,000 plus PLN 800/month “SEO”, compare three years, not the kickoff invoice.'),
      ),
      section(
        'When PLN 8,000 is too expensive, and when it is too cheap',
        p('Too expensive: two referral calls a month, Google knows nothing, and you want a “corporate” site. Fix the offer and the channel first. Too cheap: you pay for Google Ads clicks, the landing takes six seconds and ends in mailto. Then 8k on a brochure is wasted — you need a [funnel](/artykuly/lejek-konwersji-na-stronie/) and measurement.'),
        p('The counter I use: if you recover eight hours of handling a month or you cut portal commission, a 25k+ budget can close. If the goal is “make it pretty”, 6,500 can already be too much. Looks without enquiries are a cost, not an investment.'),
      ),
      section(
        'Pricing after twenty minutes, not a 40-slide brief',
        ol([
          'I listen to what eats time or blocks sales.',
          'I name a package or say “wait”.',
          'If it is a company site — a figure inside the published range and a first staging date (typically 2–4 weeks).',
          'If we do not even know whether to build — an [Audit Sprint](/artykuly/audyt-strony-internetowej/) instead of guessing.',
        ]),
        p('I do not send silver / gold / platinum with the same theme. One recommendation. After invoices, the code is yours. Compare that with an agency that keeps you on a theme royalty.'),
      ),
      section(
        'Do not compare unlike products',
        p('A “site + shop + AI + 12 months of SEO” for PLN 5,000 is a different product or an empty promise. A software house at PLN 40,000 for a five-pager with a quarter of discovery is also a different product. I sit in the middle: one person, a full implementation, a measurable goal. [The B2B company website](/artykuly/strona-firmowa-b2b/) covers the scope; this piece stays on money.'),
        p('I do not quote an “average Upwork hourly rate”. I quote a package, because an owner buys an outcome (a form that arrives, a site that stays up, enquiries you can count), not a junior’s hour.'),
      ),
    ],
    faqs: [
      {
        q: 'Is PLN 6,500 net?',
        a: 'Yes. VAT is added according to your status. I do not hide it in a “promotion”.',
      },
      {
        q: 'Can I pay less if I bring my own theme?',
        a: 'I do not take ThemeForest to production. A light custom build is cheaper than a year of plugin fires. If the budget is PLN 3,000, I will say I am not the contractor rather than gut the scope.',
      },
      {
        q: 'What does upkeep cost after launch?',
        a: 'Hosting and domain separately. Small changes are hourly or a short retainer, not a mandatory subscription. There is no weekly plugin patch pile.',
      },
      {
        q: 'When is PLN 12,000 not enough?',
        a: 'When you need enquiry qualification, on-site booking, multiple landings or integrations. That is Conversion Build: PLN 25,000–60,000. A brochure cannot fake it.',
      },
    ],
    ctaTitle: 'You get an order of magnitude, not a quoting theatre',
    ctaBody:
      'Twenty minutes is enough to say: 6.5–12k, 25–60k, or do not implement. Package detail is on the [pricing section](/#cennik).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Скільки коштує корпоративний сайт у 2026: вилки',
    description:
      'Скільки коштує корпоративний сайт у мене: 6 500–12 000 злотих за custom до 5 сторінок. Пояснюю, що в ціні, чого немає і коли починається воронка на 25–60 тис.',
    h1: 'Скільки коштує корпоративний сайт: мої вилки, не «від 1999»',
    kicker: 'Оцінка · 2026',
    lead:
      'Питання «скільки коштує корпоративний сайт» хибне, доки ви не скажете, чи потрібна візитівка з формою, чи машина, яка кваліфікує запити. Публікую вилки до розмови, бо приховування порядку величини відсікає серйозних клієнтів не туди. Нижче: 6 500–12 000 злотих за custom до п’яти сторінок, 25 000–60 000 за Conversion Build, і те, чого в цих сумах свідомо немає.',
    sections: [
      section(
        'Моя ціна, перш ніж порівнювати її з Google',
        p('Корпоративний сайт, який впроваджую: 6 500–12 000 злотих нетто, до 5 сторінок, форма, базове SEO, Astro або Next під бренд. Це не шаблон WordPress за 2–5 тис. з AI-копірайтом. Conversion Build (сайт під продаж, кваліфікація, бронювання на власному домені): 25 000–60 000. Ops System: від 60 000. [Audit Sprint](/artykuly/audyt-strony-internetowej/): 2 500–6 000, сума може бути зарахована на впровадження, якщо обидві сторони бачать сенс.'),
        p('На ринку PL 2026 публічні тексти агенцій і фрилансерів ставлять візитівки приблизно на 1 500–4 000, «сайт компанії» часто 4–12 тис., розбудовані сервіси від 15 тис. У одному огляді (Digital Vantage) медіана сайту компанії була біля 5 900 злотих. Це контекст, не моє дослідження. Мій нижній поріг вищий, бо я не продаю тему з підставленим логотипом і не обіцяю блоґ у цій сумі.'),
        note('Усі суми нетто. Я не ховаю хостинг у фальшивому «плані опіки». Домен і хостинг окремо, зазвичай низький тризначний річний кошт у цьому масштабі — не 2 000 злотих/міс. «підтримки», якої вам не потрібно.'),
      ),
      section(
        'З чого складається 6 500 проти 12 000',
        p('Нижній поріг: мала фірма, зрозуміла оферта, ваші тексти й фото в пристойному стані, одна мова, форма, без інтеграцій. Верхній: більше редакції, складніша ієрархія оферти, мапа й години, мобільна доводка, вимір запитів, інколи проста анімація або нетиповий макет. Я не піднімаю ціну за «більше відступів».'),
        table(
          ['Сигнал', 'Ближче до 6 500', 'Ближче до 12 000 або воронка'],
          [
            ['Контент', 'Оферта на одній сторінці Word', 'Оферта не названа, її ще треба вигадати'],
            ['Доказ', 'Одне живе впровадження або процес', 'Хочете «20 кейсів», яких немає'],
            ['Інтеграції', 'Форма + пошта', 'CRM, платежі, календар, замки'],
            ['Мови', 'Одна', 'PL/EN/UA, hreflang, три копії'],
            ['Мета', 'Запит від когось, хто вас знає', 'Кампанія, бронювання, кваліфікація'],
          ],
        ),
        p('Якщо після аудиту 12 000 не покриває ціль, я не «донабиваю пакет». Кажу: Conversion Build або нічого. Краще почути «не впроваджуйте», ніж купити сайт, який не має права повернутися за 12 місяців.'),
      ),
      section(
        'Приховані витрати, яких я не ховаю в «SEO-опіці»',
        ul([
          'Копірайт з нуля — поза пакетом корпоративного сайту.',
          'Блоґ і кластери — окремий потік, не подарунок до візитівки.',
          'Багатомовність — не «перемикач у CMS».',
          'CRM / платежі / Previo — уже воронка або панель.',
          'Стокові рукостискання — не купую їх за ваші гроші, вони псують довіру в B2B.',
        ]),
        p('TCO за три роки для візитівки — впровадження плюс хостинг плюс кілька годин змін на рік. Я не продаю абонемент 1 500 злотих/міс. на латки плагінів, бо не будую стіс плагінів. Якщо хтось ставить 4 000 плюс 800/міс. «SEO», порівнюйте три роки, не стартовий рахунок.'),
      ),
      section(
        'Коли сайт за 8 тисяч задорогий, а коли задешевий',
        p('Задорогий: два дзвінки з рекомендації на місяць, Google нічого не знає, а ви хочете «як у корпорації». Спочатку оферта й канал. Задешевий: платите за кліки в Google Ads, лендінг вантажиться 6 секунд і веде на mailto. Тоді 8 тис. на візитівку витрачені погано — потрібна [воронка](/artykuly/lejek-konwersji-na-stronie/) і вимір.'),
        p('Лічильник, яким користуюся: якщо повертаєте 8 годин обслуговування на місяць або ріжете комісію порталу, бюджет 25 тис.+ має шанс зійтися. Якщо ціль — «щоб було гарно», 6 500 теж може бути забагато. Естетика без запитів — витрата, не інвестиція.'),
      ),
      section(
        'Як виглядає оцінка після 20 хвилин, не після брифу на 40 слайдів',
        ol([
          'Слухаю, що з’їдає час або блокує продаж.',
          'Називаю пакет або «зачекайте».',
          'Якщо корпоративний сайт — вилка в опублікованому діапазоні і дата першого staging (типово 2–4 тижні).',
          'Якщо не зрозуміло, чи взагалі впроваджувати — [Audit Sprint](/artykuly/audyt-strony-internetowej/) замість вгадування.',
        ]),
        p('Я не надсилаю silver / gold / platinum з тим самим шаблоном. Одна рекомендація. Код після рахунків ваш. Порівняйте з агенцією, яка тримає вас на royalty теми.'),
      ),
      section(
        'Що не порівнювати один до одного',
        p('Оферта «сайт + магазин + ШІ + 12 місяців SEO» за 5 000 — інший продукт або порожня обіцянка. Software house за 40 000 за five-pager із discovery на квартал — теж інший продукт. Я посередині: одна людина, повне впровадження, вимірювана ціль. [Корпоративний сайт B2B](/artykuly/strona-firmowa-b2b/) описує зміст; цей текст тримається грошей.'),
        p('Я не даю «середню ставку з Upwork». Даю пакет, бо власник купує результат (форма доходить, сайт стоїть, запити можна порахувати), не годину джуніора.'),
      ),
    ],
    faqs: [
      {
        q: 'Чи 6 500 злотих — це нетто?',
        a: 'Так, нетто. ПДВ додаю згідно з вашим статусом. Не ховаю його в «акції».',
      },
      {
        q: 'Чи можна дешевше, якщо дам свій шаблон?',
        a: 'Не беру ThemeForest у продакшен. Дешевше зробити легкий custom, ніж рік гасити плагіни. Якщо бюджет 3 000 — скажу, що я не виконавець, а не поріжу обсяг.',
      },
      {
        q: 'Скільки коштує підтримка після старту?',
        a: 'Хостинг і домен окремо. Дрібні зміни — погодинно або короткий ретейнер, не обов’язковий абонемент. Немає стосу плагінів, який треба латати щотижня.',
      },
      {
        q: 'Коли 12 000 замало?',
        a: 'Коли потрібна кваліфікація запитів, бронювання на власному сайті, кілька лендінгів або інтеграції. Це Conversion Build: 25 000–60 000. Візитівка цього не імітує.',
      },
    ],
    ctaTitle: 'Отримаєте порядок величини, не театр оцінок',
    ctaBody:
      '20 хвилин досить, щоб сказати: 6,5–12 тис., 25–60 тис., або не впроваджувати. Деталі пакетів — у [цінах](/#cennik).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
