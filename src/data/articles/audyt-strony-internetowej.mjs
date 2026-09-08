import { DATE, note, offerCennik, ol, p, section, table, ul } from './_blocks.mjs'

export default {
  slug: 'audyt-strony-internetowej',
  keyword: 'audyt strony internetowej',
  keywordEn: 'website audit cost',
  keywordUk: 'аудит сайту ціна',
  intent: 'transactional',
  cluster: 'delivery',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'dlaczego-strona-nie-sprzedaje', anchor: { pl: 'diagnoza, dlaczego strona nie sprzedaje', en: 'why the site does not sell — the diagnosis', uk: 'діагноз, чому сайт не продає' } },
    { slug: 'ile-kosztuje-strona-firmowa', anchor: { pl: 'wycena wdrożenia po audycie', en: 'implementation pricing after the audit', uk: 'оцінка впровадження після аудиту' } },
    { slug: 'wdrozenie-strony-internetowej', anchor: { pl: 'co się dzieje po decyzji: 90 dni', en: 'what happens after the decision: 90 days', uk: 'що далі після рішення: 90 днів' } },
  ],
  offer: [offerCennik()],
  pl: {
    title: 'Audyt strony internetowej: 2 500–6 000 zł i decyzja',
    description:
      'Audyt strony internetowej u mnie to Audit Sprint 2 500–6 000 zł: mapa lejka, priorytety 30/60/90 i decyzja wdrażać albo nie. 20 min bezpłatnie. Kwota sprintu może iść na wdrożenie.',
    h1: 'Audyt strony internetowej: płacisz za decyzję, nie za PDF na 80 stron',
    kicker: 'Audit Sprint',
    lead:
      'Rynek 2026 pełen jest „audytów SEO” od 500 zł, które są skanem wtyczki, i „audytów kompletnych” za kilkanaście tysięcy z checklistą 200 punktów, której nikt nie wdroży. Mój Audit Sprint kosztuje 2 500–6 000 zł, bo produktem jest decyzja: wdrażać, odłożyć albo ciąć zakres. 20 minut na start jest bezpłatne i często wystarcza, żeby powiedzieć „nie spinaj się”. Sprint zaczyna się, gdy trzeba wejść w analitykę, proces i liczby, a nie w opinię o kolorze przycisku.',
    sections: [
      section(
        '20 minut versus sprint — nie mieszaj tych produktów',
        p('Bezpłatne 20 minut: mapa na kartce, rząd wielkości pakietu, czy w ogóle rozmawiamy. Sprint: wąskie gardła lejka albo procesu, priorytety 30/60/90 dni, szacunek ROI i ryzyk integracji, jedna rekomendacja. Kwota sprintu może zostać zaliczona na wdrożenie, jeśli obie strony widzą sens. Nie zaliczam jej na „jeszcze jeden brief”.'),
        table(
          ['', '20 min', 'Audit Sprint 2,5–6 tys.'],
          [
            ['Cel', 'Czy w ogóle wdrażać', 'Co wdrażać w jakiej kolejności'],
            ['Wejście', 'Rozmowa', 'Dostęp do analityki / procesu / stawek'],
            ['Wyjście', 'Pakiet albo stop', 'Dokument + decyzja 30/60/90'],
            ['SEO-skan', 'Nie udaję, że to audyt', 'On-page i CWV jako część lejka, nie jako religia'],
          ],
        ),
      ),
      section(
        'Czego nie kupujesz za 500 zł „quick scan”',
        p('Skan indeksacji i title’i bywa użyteczny jako załącznik. Nie mówi, czy macie zły kanał, złą ścieżkę czy zły follow-up. [Dlaczego strona nie sprzedaje](/artykuly/dlaczego-strona-nie-sprzedaje/) rozdziela te wiadra. Audyt, który kończy się listą 80 poprawek meta bez biznesu, jest tanim sumieniem, nie decyzją.'),
        ul([
          'Nie obiecuję pozycji w Google w 30 dni.',
          'Nie sprzedaję HowTo-schema ani sztuczek z 2019.',
          'Nie dokładam fałszywych recenzji jako „quick win zaufania”.',
          'Nie audytuję iDrive jako live ani Agentic jako Waszego case’u.',
        ]),
      ),
      section(
        'Jak liczę, czy sprint ma prawo się spiąć',
        p('Jeśli po 20 minutach widać, że wizytówka za 6 500 zł załatwi sprawę, nie wciskam sprintu. Jeśli widać Ops za 80 tysięcy bez nazwanych metryk — najpierw sprint albo stop. [Wycena strony](/artykuly/ile-kosztuje-strona-firmowa/) i pakiety są publiczne, żebyś nie zgadywał rzędu wielkości przed call’em.'),
        note('Na polskim rynku agencje publikują audyty SEO 1–8 tys. i UX-komplety drożej. To kontekst. Mój produkt jest decyzją wdrożeniową, nie raportem dla działu marketingu, którego nie macie.'),
      ),
      section(
        'Co przynosisz, żebym nie zgadywał',
        ol([
          'Źródła ostatnich zapytań (choćby skrzynka z 90 dni).',
          'Search Console albo przyznanie, że go nie ma.',
          'Ścieżka maila po formularzu i czas odpowiedzi.',
          'Liczby, których nie chcesz publikować — zostają w NDA, nie na blogu.',
        ]),
        p('Po sprincie albo wdrażamy w [trybie 90 dni](/artykuly/wdrozenie-strony-internetowej/), albo rozchodzimy się bez urazy. Trzecia opcja „zróbmy jeszcze discovery na kwartał” mnie nie interesuje.'),
      ),
    ],
    faqs: [
      { q: 'Czy 20 minut zastępuje płatny audyt?', a: 'Często tak, gdy decyzja brzmi „nie wdrażaj” albo „wystarczy wizytówka”. Sprint jest, gdy trzeba policzyć proces albo lejek na liczbach.' },
      { q: 'Czy zaliczacie sprint na stronę?', a: 'Tak, gdy obie strony idą w wdrożenie po sprincie. Nie jako kupon na wieczność.' },
      { q: 'Czy to audyt SEO?', a: 'SEO on-page i szybkość wchodzą, jeśli blokują konwersję lub indeksację. Nie sprzedaję miesięcznego pozycjonowania w sprincie.' },
      { q: 'Ile stron przeglądasz?', a: 'Tyle, ile trzeba do decyzji, nie „każdy URL w witrynie 10k podstron”. Sklep enterprise to inna usługa, której tu nie udaję.' },
    ],
    ctaTitle: 'Zacznij od 20 minut. Sprint tylko gdy trzeba liczb',
    ctaBody: 'Bez PDF-u na półkę. [Cennik](/#cennik) ma Audit Sprint i zaliczenie na wdrożenie.',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'Website audit pricing: 2,500–6,000 PLN and a decision',
    description:
      'A website audit with me is Audit Sprint at PLN 2,500–6,000: a funnel map, 30/60/90 priorities and a ship-or-not decision. 20 minutes free. Sprint fee can credit a build.',
    h1: 'A website audit: you pay for a decision, not an 80-page PDF',
    kicker: 'Audit Sprint',
    lead:
      'The 2026 market is full of “SEO audits” from PLN 500 that are a plugin scan, and “complete audits” at five figures with a 200-point checklist nobody will ship. My Audit Sprint costs PLN 2,500–6,000 because the product is a decision: implement, wait, or cut scope. Twenty minutes up front is free and often enough to say “do not close this”. The sprint starts when we must enter analytics, process and numbers — not an opinion on button colour.',
    sections: [
      section(
        'Twenty minutes versus a sprint — do not mix the products',
        p('Free 20 minutes: a map on paper, a package order of magnitude, whether we even talk. Sprint: funnel or process bottlenecks, 30/60/90-day priorities, ROI and integration-risk estimates, one recommendation. Sprint fee may credit a build if both sides see a point. I do not credit it toward “yet another brief”.'),
        table(
          ['', '20 min', 'Audit Sprint 2.5–6k'],
          [
            ['Goal', 'Whether to implement at all', 'What to implement in which order'],
            ['Input', 'A conversation', 'Access to analytics / process / rates'],
            ['Output', 'A package or a stop', 'A document + a 30/60/90 decision'],
            ['SEO scan', 'I do not pretend it is an audit', 'On-page and CWV as part of the funnel, not a religion'],
          ],
        ),
      ),
      section(
        'What you do not buy for PLN 500 “quick scan”',
        p('An indexation and title scan can be a useful annex. It does not say whether you have the wrong channel, path or follow-up. [Why the site does not sell](/artykuly/dlaczego-strona-nie-sprzedaje/) splits those buckets. An audit that ends as 80 meta fixes with no business is cheap conscience, not a decision.'),
        ul([
          'I do not promise a Google rank in 30 days.',
          'I do not sell HowTo schema or 2019 tricks.',
          'I do not add fake reviews as a “trust quick win”.',
          'I do not audit iDrive as live or Agentic as your case.',
        ]),
      ),
      section(
        'How I judge whether a sprint has a right to close',
        p('If after 20 minutes a PLN 6,500 brochure will do, I do not push a sprint. If Ops at 80k shows up without named metrics — sprint first or stop. [Website pricing](/artykuly/ile-kosztuje-strona-firmowa/) and packages are public so you do not guess the order of magnitude before the call.'),
        note('Polish agencies publish SEO audits at 1–8k and heavier UX kits above that. Context. My product is an implementation decision, not a report for a marketing department you do not have.'),
      ),
      section(
        'What you bring so I do not guess',
        ol([
          'Sources of recent enquiries (even a 90-day inbox).',
          'Search Console, or an admission you have none.',
          'The mail path after the form and reply time.',
          'Numbers you do not want public — they stay under NDA, not on the blog.',
        ]),
        p('After the sprint we either implement in a [90-day mode](/artykuly/wdrozenie-strony-internetowej/) or we part without drama. A third option “let us do another quarter of discovery” does not interest me.'),
      ),
    ],
    faqs: [
      { q: 'Does 20 minutes replace a paid audit?', a: 'Often yes, when the decision is “do not implement” or “a brochure is enough”. The sprint is for when we must count a process or funnel on numbers.' },
      { q: 'Do you credit the sprint toward a site?', a: 'Yes, when both sides go into a build after the sprint. Not as a coupon forever.' },
      { q: 'Is this an SEO audit?', a: 'On-page SEO and speed enter if they block conversion or indexation. I do not sell monthly ranking work inside the sprint.' },
      { q: 'How many pages do you review?', a: 'As many as the decision needs, not “every URL on a 10k-page site”. Enterprise commerce is another service I do not impersonate here.' },
    ],
    ctaTitle: 'Start with 20 minutes. Sprint only when we need numbers',
    ctaBody: 'No PDF for a shelf. [Pricing](/#cennik) lists Audit Sprint and credit toward a build.',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Аудит сайту: 2 500–6 000 злотих і рішення',
    description:
      'Аудит сайту в мене — Audit Sprint 2 500–6 000 злотих: мапа воронки, пріоритети 30/60/90 і рішення впроваджувати чи ні. 20 хв безкоштовно. Сума спринту може піти на впровадження.',
    h1: 'Аудит сайту: платите за рішення, не за PDF на 80 сторінок',
    kicker: 'Audit Sprint',
    lead:
      'Ринок 2026 повний «аудитів SEO» від 500 злотих, які є сканом плагіна, і «повних аудитів» за десятки тисяч із чеклістом на 200 пунктів, якого ніхто не впровадить. Мій Audit Sprint коштує 2 500–6 000, бо продукт — рішення: впроваджувати, відкласти або різати обсяг. 20 хвилин на старт безкоштовні і часто досить, щоб сказати «не сходиться». Спринт починається, коли треба зайти в аналітику, процес і цифри, а не в думку про колір кнопки.',
    sections: [
      section(
        '20 хвилин проти спринту — не змішуйте ці продукти',
        p('Безкоштовні 20 хвилин: мапа на папері, порядок величини пакета, чи взагалі розмовляємо. Спринт: вузькі місця воронки або процесу, пріоритети 30/60/90 днів, оцінка ROI і ризиків інтеграцій, одна рекомендація. Сума спринту може бути зарахована на впровадження, якщо обидві сторони бачать сенс. Не зараховую її на «ще один бриф».'),
        table(
          ['', '20 хв', 'Audit Sprint 2,5–6 тис.'],
          [
            ['Ціль', 'Чи взагалі впроваджувати', 'Що впроваджувати в якому порядку'],
            ['Вхід', 'Розмова', 'Доступ до аналітики / процесу / ставок'],
            ['Вихід', 'Пакет або стоп', 'Документ + рішення 30/60/90'],
            ['SEO-скан', 'Не вдаю, що це аудит', 'On-page і CWV як частина воронки, не як релігія'],
          ],
        ),
      ),
      section(
        'Чого не купуєте за 500 злотих «quick scan»',
        p('Скан індексації й title буває корисним як додаток. Він не каже, чи у вас поганий канал, шлях чи follow-up. [Чому сайт не продає](/artykuly/dlaczego-strona-nie-sprzedaje/) розділяє ці відра. Аудит, який закінчується списком 80 правок мета без бізнесу, — дешеве сумління, не рішення.'),
        ul([
          'Не обіцяю позицію в Google за 30 днів.',
          'Не продаю HowTo-схему чи трюки з 2019.',
          'Не додаю фальшивих відгуків як «quick win довіри».',
          'Не аудитую iDrive як live і Agentic як ваш кейс.',
        ]),
      ),
      section(
        'Як рахую, чи спринт має право зійтися',
        p('Якщо після 20 хвилин візитівка за 6 500 закриває справу, не впихаю спринт. Якщо видно Ops за 80 тисяч без названих метрик — спочатку спринт або стоп. [Оцінка сайту](/artykuly/ile-kosztuje-strona-firmowa/) і пакети публічні, щоб ви не вгадували порядок величини до дзвінка.'),
        note('На польському ринку агенції публікують аудити SEO 1–8 тис. і важчі UX-комплекти дорожче. Це контекст. Мій продукт — рішення про впровадження, не звіт для відділу маркетингу, якого у вас немає.'),
      ),
      section(
        'Що приносите, щоб я не вгадував',
        ol([
          'Джерела останніх запитів (хоча б скринька за 90 днів).',
          'Search Console або визнання, що його немає.',
          'Шлях листа після форми і час відповіді.',
          'Цифри, які не хочете публікувати — лишаються під NDA, не в блозі.',
        ]),
        p('Після спринту або впроваджуємо в [режимі 90 днів](/artykuly/wdrozenie-strony-internetowej/), або розходимось без образи. Третій варіант «зробімо ще discovery на квартал» мене не цікавить.'),
      ),
    ],
    faqs: [
      { q: 'Чи 20 хвилин замінює платний аудит?', a: 'Часто так, коли рішення «не впроваджувати» або «досить візитівки». Спринт є, коли треба порахувати процес або воронку на цифрах.' },
      { q: 'Чи зараховуєте спринт на сайт?', a: 'Так, коли обидві сторони йдуть у впровадження після спринту. Не як купон назавжди.' },
      { q: 'Чи це аудит SEO?', a: 'On-page SEO і швидкість входять, якщо блокують конверсію або індексацію. Не продаю щомісячне просування в спринті.' },
      { q: 'Скільки сторінок переглядаєте?', a: 'Скільки треба для рішення, не «кожен URL на сайті 10 тис. сторінок». Enterprise-магазин — інша послуга, якої тут не вдаю.' },
    ],
    ctaTitle: 'Почніть із 20 хвилин. Спринт лише коли потрібні цифри',
    ctaBody: 'Без PDF на полицю. [Ціни](/#cennik) мають Audit Sprint і зарахування на впровадження.',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
