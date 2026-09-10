import { DATE, note, offerCennik, offerOferta, ol, p, section, table, ul } from './_blocks.mjs'

export default {
  slug: 'panel-operacyjny-zamiast-excela',
  keyword: 'panel operacyjny zamiast Excela',
  keywordEn: 'operations panel instead of Excel',
  keywordUk: 'операційна панель замість Excel',
  intent: 'commercial',
  cluster: 'ops',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'saas-czy-wlasny-panel', anchor: { pl: 'gotowy SaaS czy własny panel — jak rozstrzygam', en: 'off-the-shelf SaaS or a custom panel — how I decide', uk: 'готовий SaaS чи власна панель — як вирішую' } },
    { slug: 'ksiegowosc-online-zamiast-excela', anchor: { pl: 'księgowość online zamiast Excela w Plumm', en: 'online accounting instead of Excel in Plumm', uk: 'онлайн-бухгалтерія замість Excel у Plumm' } },
    { slug: 'ile-kosztuje-strona-firmowa', anchor: { pl: 'to nie jest strona za 8 tysięcy', en: 'this is not an PLN 8k website', uk: 'це не сайт за 8 тисяч' } },
  ],
  offer: [offerOferta(), offerCennik()],
  pl: {
    title: 'Panel operacyjny zamiast Excela: kiedy to się spina',
    description:
      'Panel operacyjny zamiast Excela ma sens, gdy kilka osób psuje jeden plik i proces się powtarza. Pakiet Platforma: od 25 000 zł. Piszę, kiedy zostawić arkusz, a kiedy budować system.',
    h1: 'Panel operacyjny zamiast Excela: kiedy arkusz kłamie, a system ma prawo kosztować',
    kicker: 'Platforma',
    lead:
      'Excel nie jest wrogiem. Wrogiem jest Excel udający ERP, CRM, kalendarz i kasę jednocześnie, gdy w pliku siedzi pięć osób i nikt nie wie, która kopia jest prawdziwa. Panel operacyjny, który wdrażam, to pakiet Platforma — od 25 000 zł, bo to nie „ładniejsza tabela w przeglądarce”. Poniżej progi, przy których mówię „zostaw arkusz” — i te, przy których arkusz już kradnie godziny.',
    sections: [
      section(
        'Objawy, że Excel przestał być narzędziem',
        ul([
          'Dwie wersje pliku w mailu i na dysku, obie „ostateczne”.',
          'Ktoś boi się filtrować, bo formuły się rozjadą.',
          'Ten sam fakt wpisywany w trzech miejscach (kalendarz, faktura, WhatsApp).',
          'Nowy pracownik uczy się procesu od człowieka, nie od systemu.',
          'Raport dla Ciebie powstaje ręcznie w niedzielę wieczorem.',
        ]),
        p('Jeśli rozpoznajesz dwa punkty, rozmawiamy. Jeśli jeden — często wystarczy porządek w arkuszu albo gotowiec. Nie sprzedaję panelu z przyzwyczajenia. [Audit Sprint](/artykuly/audyt-strony-internetowej/) (od 1 500 zł) istnieje po to, żeby nie kodować żalu za 80 tysięcy.'),
      ),
      section(
        'Co jest panelem, a co kolejnym SaaS z kartą',
        p('Panel operacyjny to aplikacja pod Wasz przepływ: role, statusy, jeden zapis zdarzenia, integracje które już macie (faktury, zamki, kalendarz). Gotowy SaaS jest tańszy, gdy Wasz proces jest rynkowym standardem. W Mint nie pisałem PMS — wziąłem Previo. W Plumm panel jest produktem, bo księgowość JDG + e-faktury + asystent to nasz proces, nie szablon z marketplace.'),
        table(
          ['Sytuacja', 'Zostaw Excel / gotowiec', 'Buduj panel (Platforma)'],
          [
            ['Ludzie na procesie', '1–2, zaufanie', '3+, zmiany zmian'],
            ['Błąd kopii', 'Rzadki, tani', 'Drogi albo wstyd przed urzędem / gościem'],
            ['Integracje', 'Eksport CSV wystarcza', 'KSeF, płatność, zamek, CRM naraz'],
            ['Budżet', '< 25 tys. i spokój', 'od 25 tys. i mierzalne „przed/po”'],
          ],
        ),
        note('Nie mam publicznego case’u „odzyskaliśmy 400 godzin u klienta X”. Publicznie klikasz [Plumm](https://plumm.pl) i [Mint](https://mintapartments.pl). Agentic OS jest wewnętrzny — nie sprzedaję go jako wdrożenia u Ciebie.'),
      ),
      section(
        'Cena, której nie da się udawać stroną firmową',
        p('Platforma: od 25 000 zł. W tej kwocie: panel albo aplikacja dla zespołu, połączenia z płatnościami / kalendarzami / e-fakturami, automatyzacja z limitami i zapisem, staging, szkolenie, pomiar po starcie. To nie jest [wizytówka Start za 2 000](/artykuly/ile-kosztuje-strona-firmowa/). Ktoś, kto „wrzuci Excel do Airtable za weekend”, robi inny produkt — często bez ról, bez audytu, bez eskalacji.'),
        p('Przed kodem ustalam metryki przed/po: godziny na raporcie, liczba pomyłek, czas od zdarzenia do faktury. Jeśli nie da się tego nazwać, nie zaczynam. Ładny interfejs bez wyniku przy tym budżecie to strata obu stron.'),
      ),
      section(
        'Ludzie, nie „cyfrowa transformacja”',
        ol([
          'Wersja testowa, zanim zespół straci stary plik.',
          'Szkolenie 1–2 h, nie PDF „jak klikać”.',
          'Kod i konfiguracja po fakturach — Twoje.',
          'NDA. Żadnego teatru z fałszywymi testimonialami z wdrożenia panelu.',
        ]),
        p('Jeśli zespół sabotażuje narzędzie, problemem nie jest React. Problem jest w procesie, którego nikt nie spisał. Panel tego nie naprawi. Najpierw mapa na audycie.'),
      ),
      section(
        'Sąsiadujące decyzje',
        p('Gotowiec vs custom: osobny artykuł. Księgowość zamiast Excela: [Plumm jako własny produkt](/artykuly/ksiegowosc-online-zamiast-excela/), nie jako „wdrożyłem u dwudziestu biur”. HITL dokładam, gdy powtarzalne kroki da się ograniczyć listą akcji — nie gdy chcesz „ChatGPT w Excelu”.'),
      ),
    ],
    faqs: [
      { q: 'Czy nLow-code (Airtable, Appsmith) nie wystarczy?', a: 'Czasem tak — i wtedy nie buduję customu. Gdy pojawiają się role, audyt, KSeF albo zamki, low-code zaczyna kłamać kosztami ukrytymi.' },
      { q: 'Ile trwa takie wdrożenie?', a: 'Zwykle 6–12 tygodni do pierwszego mierzalnego przepływu, dłużej przy wielu integracjach. Nie obiecuję „w dwa sprinty całego ERP”.' },
      { q: 'Czy mogę zacząć od wycinka?', a: 'Tak. Jeden bolesny przepływ, pomiar, dopiero wtedy reszta. Wielki bang za 25 tys.+ bez wycinka to ryzyko, którego nie biorę w ciemno.' },
      { q: 'Co z danymi w starym Excelu?', a: 'Migrujemy to, co jest źródłem prawdy. Reszta archiwum. Nie przenoszę śmieci, żeby „nic nie zginęło”.' },
    ],
    ctaTitle: 'Sprawdźmy, czy arkusz już kradnie godziny',
    ctaBody: '20 minut albo Audit Sprint. Jeśli się nie spina — zostawiasz Excel. [Zakres](/#oferta) i [cennik](/#cennik).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'An operations panel instead of Excel: when it pays',
    description:
      'An operations panel instead of Excel makes sense when several people break one file and the process repeats. Platform package: from PLN 25,000. I write when to keep the sheet and when to build.',
    h1: 'An operations panel instead of Excel: when the sheet lies and a system may cost real money',
    kicker: 'Platform',
    lead:
      'Excel is not the enemy. The enemy is Excel pretending to be ERP, CRM, calendar and till at once while five people sit in the file and nobody knows which copy is true. An operations panel I ship is the Platform package — from PLN 25,000, because it is not a prettier table in the browser. Below: thresholds where I say keep the sheet — and where the sheet already steals hours.',
    sections: [
      section(
        'Signs Excel stopped being a tool',
        ul([
          'Two “final” files, one in mail, one on disk.',
          'Someone is afraid to filter because formulas will break.',
          'The same fact typed in three places (calendar, invoice, WhatsApp).',
          'A new hire learns the process from a person, not from the system.',
          'Your report is built by hand on Sunday evening.',
        ]),
        p('If you recognise two points, we talk. If one — often a tidier sheet or an off-the-shelf tool is enough. I do not sell a panel out of habit. [Audit Sprint](/artykuly/audyt-strony-internetowej/) (from PLN 1,500) exists so we do not code regret for 80k.'),
      ),
      section(
        'What a panel is, and what is just another SaaS with a card',
        p('An operations panel is an app around your flow: roles, statuses, one event log, integrations you already have (invoices, locks, calendar). Off-the-shelf SaaS is cheaper when your process is a market standard. At Mint I did not write a PMS — I used Previo. Plumm is a product because sole-trader accounting + e-invoices + an assistant is our process, not a marketplace template.'),
        table(
          ['Situation', 'Keep Excel / off-the-shelf', 'Build a panel (Platform)'],
          [
            ['People on the process', '1–2, trust', '3+, shift changes'],
            ['Cost of a wrong copy', 'Rare, cheap', 'Expensive or shame before the tax office / guest'],
            ['Integrations', 'CSV export is enough', 'KSeF, payment, lock, CRM at once'],
            ['Budget', '< 25k and calm', '25k+ and a measurable before/after'],
          ],
        ),
        note('I do not have a public “we recovered 400 hours at client X” case. Publicly you click [Plumm](https://plumm.pl) and [Mint](https://mintapartments.pl). Agentic OS is internal — I do not sell it as a deployment at your firm.'),
      ),
      section(
        'A price a company website cannot impersonate',
        p('Platform: from PLN 25,000. In that range: a panel or a team app, connections to payments / calendars / e-invoices, automation with limits and a log, staging, training, post-launch measurement. That is not a [Start brochure at PLN 2,000](/artykuly/ile-kosztuje-strona-firmowa/). Someone who “drops Excel into Airtable over a weekend” ships a different product — often without roles, audit trail or escalation.'),
        p('Before code I name before/after metrics: hours on the report, error count, time from event to invoice. If we cannot name them, I do not start. A pretty UI with no result at this budget wastes both sides.'),
      ),
      section(
        'People, not “digital transformation”',
        ol([
          'A test version before the team loses the old file.',
          '1–2 hours of training, not a PDF on “how to click”.',
          'Code and config after invoices — yours.',
          'NDA. No theatre of fake testimonials from a panel rollout.',
        ]),
        p('If the team sabotages the tool, the problem is not React. It is an unwritten process. A panel will not fix that. Map it in the audit first.'),
      ),
      section(
        'Neighbouring decisions',
        p('Off-the-shelf vs custom: a separate article. Accounting instead of Excel: [Plumm as my own product](/artykuly/ksiegowosc-online-zamiast-excela/), not “I rolled it out to twenty offices”. I add HITL when repetitive steps can be limited to an allow-list — not when you want “ChatGPT inside Excel”.'),
      ),
    ],
    faqs: [
      { q: 'Is low-code (Airtable, Appsmith) not enough?', a: 'Sometimes yes — then I do not build custom. When roles, audit, KSeF or locks appear, low-code starts lying with hidden cost.' },
      { q: 'How long does this take?', a: 'Usually 6–12 weeks to the first measurable flow, longer with many integrations. I do not promise “the whole ERP in two sprints”.' },
      { q: 'Can we start with a slice?', a: 'Yes. One painful flow, measurement, then the rest. A 25k+ big bang without a slice is a risk I will not take blind.' },
      { q: 'What about data in the old Excel?', a: 'We migrate what is the source of truth. The rest is archive. I do not move junk so that “nothing is lost”.' },
    ],
    ctaTitle: 'Let us check whether the sheet already steals hours',
    ctaBody: 'Twenty minutes or an Audit Sprint. If it does not close — you keep Excel. [Scope](/#oferta) and [pricing](/#cennik).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Операційна панель замість Excel: коли це сходиться',
    description:
      'Операційна панель замість Excel має сенс, коли кілька людей псують один файл і процес повторюється. Пакет Платформа: від 25 000 злотих. Пишу, коли лишити аркуш, а коли будувати систему.',
    h1: 'Операційна панель замість Excel: коли аркуш бреше, а система має право коштувати',
    kicker: 'Платформа',
    lead:
      'Excel не ворог. Ворог — Excel, що вдає ERP, CRM, календар і касу одночасно, коли у файлі сидить п’ятеро людей і ніхто не знає, яка копія правдива. Операційна панель, яку впроваджую, — це пакет Платформа, від 25 000 злотих, бо це не «гарніша таблиця в браузері». Нижче пороги, на яких кажу «лишіть аркуш» — і ті, на яких аркуш уже краде години.',
    sections: [
      section(
        'Ознаки, що Excel перестав бути інструментом',
        ul([
          'Дві версії файлу в пошті й на диску, обидві «остаточні».',
          'Хтось боїться фільтрувати, бо формули роз’їдуться.',
          'Той самий факт у трьох місцях (календар, рахунок, WhatsApp).',
          'Новий працівник вчить процес від людини, не від системи.',
          'Звіт для вас збирають вручну в неділю ввечері.',
        ]),
        p('Якщо впізнаєте два пункти — розмовляємо. Якщо один — часто досить ладу в аркуші або готового інструменту. Не продаю панель зі звички. [Audit Sprint](/artykuly/audyt-strony-internetowej/) (від 1 500) існує, щоб не кодувати жаль за 80 тисяч.'),
      ),
      section(
        'Що є панеллю, а що черговим SaaS із карткою',
        p('Операційна панель — застосунок під ваш потік: ролі, статуси, один запис події, інтеграції, які вже є (рахунки, замки, календар). Готовий SaaS дешевший, коли ваш процес — ринковий стандарт. У Mint я не писав PMS — взяв Previo. У Plumm панель є продуктом, бо бухгалтерія ФОП + e-фактури + асистент — наш процес, не шаблон із маркетплейсу.'),
        table(
          ['Ситуація', 'Лишити Excel / готове', 'Будувати панель (Платформа)'],
          [
            ['Люди на процесі', '1–2, довіра', '3+, зміни змін'],
            ['Ціна помилкової копії', 'Рідко, дешево', 'Дорого або сором перед установою / гостем'],
            ['Інтеграції', 'Експорт CSV досить', 'KSeF, оплата, замок, CRM разом'],
            ['Бюджет', '< 25 тис. і спокій', 'від 25 тис. і вимірюване «до/після»'],
          ],
        ),
        note('Немає публічного кейсу «повернули 400 годин у клієнта X». Публічно клікаєте [Plumm](https://plumm.pl) і [Mint](https://mintapartments.pl). Agentic OS внутрішній — не продаю його як впровадження у вас.'),
      ),
      section(
        'Ціна, якої не вдати корпоративним сайтом',
        p('Платформа: від 25 000 злотих. У цій сумі: панель або застосунок для команди, з’єднання з платежами / календарями / e-фактурами, автоматизація з лімітами й записом, staging, навчання, вимір після старту. Це не [візитівка Start за 2 000](/artykuly/ile-kosztuje-strona-firmowa/). Хтось, хто «закине Excel в Airtable за вихідні», робить інший продукт — часто без ролей, аудиту, ескалації.'),
        p('Перед кодом фіксую метрики до/після: години на звіті, кількість помилок, час від події до рахунку. Якщо цього не назвати — не починаю. Гарний інтерфейс без результату при цьому бюджеті — втрата обох сторін.'),
      ),
      section(
        'Люди, не «цифрова трансформація»',
        ol([
          'Тестова версія, перш ніж команда втратить старий файл.',
          'Навчання 1–2 год, не PDF «як клікати».',
          'Код і конфігурація після рахунків — ваші.',
          'NDA. Жодного театру з фальшивими відгуками з впровадження панелі.',
        ]),
        p('Якщо команда саботує інструмент, проблема не в React. Проблема в процесі, якого ніхто не списав. Панель цього не виправить. Спочатку мапа на аудиті.'),
      ),
      section(
        'Суміжні рішення',
        p('Готове vs custom — окрема стаття. Бухгалтерія замість Excel: [Plumm як власний продукт](/artykuly/ksiegowosc-online-zamiast-excela/), не «впровадив у двадцяти бюро». HITL додаю, коли повторювані кроки можна обмежити списком дій — не коли хочете «ChatGPT в Excel».'),
      ),
    ],
    faqs: [
      { q: 'Чи low-code (Airtable, Appsmith) не вистачить?', a: 'Інколи так — тоді не будую custom. Коли з’являються ролі, аудит, KSeF або замки, low-code починає брехати прихованими витратами.' },
      { q: 'Скільки триває таке впровадження?', a: 'Зазвичай 6–12 тижнів до першого вимірюваного потоку, довше при багатьох інтеграціях. Не обіцяю «весь ERP за два спринт».' },
      { q: 'Чи можна почати з фрагмента?', a: 'Так. Один болісний потік, вимір, лише тоді решта. Великий вибух за 25 тис.+ без фрагмента — ризик, якого не беру наосліп.' },
      { q: 'Що з даними в старому Excel?', a: 'Мігруємо те, що є джерелом правди. Решта — архів. Не переношу сміття, щоб «нічого не зникло».' },
    ],
    ctaTitle: 'Перевіримо, чи аркуш уже краде години',
    ctaBody: '20 хвилин або Audit Sprint. Якщо не сходиться — лишаєте Excel. [Обсяг](/#oferta) і [ціни](/#cennik).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
