import { DATE, note, offerRealizacje, ol, p, section, ul } from './_blocks.mjs'

export default {
  slug: 'ksiegowosc-online-zamiast-excela',
  keyword: 'księgowość online zamiast Excela',
  keywordEn: 'online accounting instead of Excel',
  keywordUk: 'онлайн-бухгалтерія замість Excel',
  intent: 'informational',
  cluster: 'ops',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'panel-operacyjny-zamiast-excela', anchor: { pl: 'panel operacyjny zamiast Excela — szersza zasada', en: 'an operations panel instead of Excel — the wider rule', uk: 'операційна панель замість Excel — ширше правило' } },
    { slug: 'automatyzacja-z-kontrola-czlowieka', anchor: { pl: 'asystent podatkowy z eskalacją do księgowej', en: 'a tax assistant with escalation to a bookkeeper', uk: 'податковий асистент з ескалацією до бухгалтерки' } },
    { slug: 'saas-czy-wlasny-panel', anchor: { pl: 'dlaczego Plumm jest własnym panelem, nie skórką', en: 'why Plumm is a custom panel, not a skin', uk: 'чому Plumm — власна панель, не шкірка' } },
  ],
  offer: [offerRealizacje()],
  pl: {
    title: 'Księgowość online zamiast Excela i biura na godziny',
    description:
      'Księgowość online zamiast Excela: w Plumm JDG ma e-faktury, PIT/VAT/ZUS i asystenta z eskalacją. Szacunek 12–20 h/mies.* i 300–600 zł mniej niż tradycyjne biuro — bez fałszywych recenzji.',
    h1: 'Księgowość online zamiast Excela: jeden panel, urząd i człowiek w pętli',
    kicker: 'Plumm · produkt własny',
    lead:
      'Arkusz z fakturami, osobny program do JPK, mail do biura i kalendarz ZUS w głowie — to nie jest „elastyczność”. To pięć źródeł prawdy. [Plumm](https://plumm.pl) jest moim produktem: e-faktury do urzędu, rozliczenia, CRM i asystent podatkowy, który przy trudniejszej sprawie oddaje głos księgowej. Szacunki: 12–20 h/mies.* mniej na papierologii przy regularnym wolumenie; 300–600 zł/mies. mniej niż tradycyjne biuro przy JDG (plany od 149 zł). To nie case „u klienta z ulicy”. To produkt, który sam utrzymuję i który da się kliknąć.',
    sections: [
      section(
        'Excel w księgowości psuje się ciszą, nie wykresem',
        p('Formuła się rozjedzie w kwietniu, a Ty zauważysz w maju, gdy urząd już czeka. Biuro rachunkowe bywa wolne (dwa dni na pytanie) i drogie w stosunku do wolumenu JDG. Ani arkusz, ani „wyślę skany na WhatsApp” nie dają jednego statusu: czy faktura wyszła, czy deklaracja poszła, czy składka jest policzona.'),
        ul([
          'Jedno logowanie zamiast trzech programów.',
          'E-faktura zgodna z przepisami od razu, nie „dodatek za dopłatą”.',
          'Terminy w kalendarzu, nie w zeszycie.',
          'Pytanie podatkowe po polsku — z eskalacją, nie z halucynacją zostawioną w mailu do klienta.',
        ]),
        note('*Godziny i kwoty są orientacyjne, zależą od wolumenu faktur i formy. Nie uśredniam „całej Polski”. Na rozmowie liczymy Twój miesiąc.'),
      ),
      section(
        'HITL, nie „wdrożymy ChatGPT do KPiR”',
        p('Asystent w Plumm nie podpisuje deklaracji za Ciebie w ciemno. Szybkie pytania — model. Spór, interpretacja, ryzyko kary — człowiek. To ta sama filozofia co w [automatyzacji z kontrolą człowieka](/artykuly/automatyzacja-z-kontrola-czlowieka/): dozwolony zakres, zapis, eskalacja. Publiczny czat bez polityki to wyciek i halucynacja. Opisałem to przy [wdrażaniu ChatGPT](/artykuly/wdrozyc-chatgpt-w-firmie/).'),
      ),
      section(
        'Czego ten artykuł nie jest',
        ol([
          'Nie jest rankingiem „najlepszych księgowości 2026” z afiliacją.',
          'Nie jest obietnicą, że każdy JDG zaoszczędzi 20 godzin — stąd gwiazdka.',
          'Nie jest ofertą wdrożenia Plumm u obcego biura jako white-label, którego nie prowadzę publicznie.',
          'Nie używa iDrive ani Agentic jako dowodu księgowego — nie ten produkt.',
        ]),
        p('Żywy URL: plumm.pl i panel app.plumm.pl. Jeśli potrzebujesz panelu pod inny proces (nie księgowość), wracamy do [Ops](/artykuly/panel-operacyjny-zamiast-excela/) i wyceny 60–180 tys.+.'),
      ),
      section(
        'Dla kogo arkusz nadal wystarczy',
        p('Kilka faktur rocznie, zero pracowników, księgowa w rodzinie, która ogarnia termin. Wtedy Plumm może być overkill. Nie wciskam subskrypcji, gdy ROI się nie spina — ta sama zasada co przy stronach. Gdy wolumen rośnie i kary za spóźnienie są droższe niż plan, matematyka się odwraca.'),
      ),
      section(
        'Sąsiedztwo ze stroną i lejkiem',
        p('Strona plumm.pl zbiera plany i wyjaśnia produkt. To nie wizytówka za 2 000 zł w oderwaniu od panelu. Jeśli budujesz własny SaaS, strona i aplikacja to jeden system. Jeśli chcesz tylko stronę biura rachunkowego — inny pakiet, inny cel, bez udawania silnika e-faktur.'),
      ),
    ],
    faqs: [
      { q: 'Czy Plumm zastępuje biuro rachunkowe zawsze?', a: 'Nie. Przy spółkach i sporach zostaje człowiek. Asystent przyspiesza rutynę; księgowa wchodzi, gdy model nie powinien zgadywać.' },
      { q: 'Czy muszę porzucić księgową, żeby korzystać z panelu?', a: 'Nie to jest teza. Teza: jeden zapis faktur i deklaracji zamiast Excela plus trzy logowania. Model współpracy z człowiekiem zostaje do ustalenia.' },
      { q: 'Skąd liczby 12–20 h i 300–600 zł?', a: 'Z opisu produktu i typowego wolumenu JDG, z gwiazdką. Nie są gwarancją Twojego miesiąca. Audyt / rozmowa liczy Twój stos.' },
      { q: 'Czy to wdrażasz u dowolnej firmy jako custom księgowość?', a: 'Plumm jest produktem. Inny proces księgowy u Ciebie to osobne Ops, nie „sklonujemy Plumm w tydzień”.' },
    ],
    ctaTitle: 'Księgowość albo inny panel — nazwijmy proces',
    ctaBody: 'Jeśli to JDG i faktury: plumm.pl. Jeśli inny przepływ: 20 minut audytu. [Realizacje](/#realizacje).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'Online accounting instead of Excel and a monthly office',
    description:
      'Online accounting instead of Excel: in Plumm a sole trader gets e-invoices, PIT/VAT/ZUS and an assistant with escalation. Estimate 12–20 h/month* and PLN 300–600 less than a traditional office — no fake reviews.',
    h1: 'Online accounting instead of Excel: one panel, the tax office, and a human in the loop',
    kicker: 'Plumm · own product',
    lead:
      'A sheet of invoices, a separate JPK tool, mail to the accountant and ZUS dates in your head is not “flexibility”. It is five sources of truth. [Plumm](https://plumm.pl) is my product: e-invoices to the authority, filings, CRM and a tax assistant that hands hard cases to a bookkeeper. Estimates: 12–20 h/month* less paperwork at a regular volume; PLN 300–600/month less than a traditional office for a sole trader (plans from PLN 149). This is not a “street client” case. It is a product I maintain and you can click.',
    sections: [
      section(
        'Excel in accounting breaks in silence, not on a chart',
        p('A formula drifts in April; you notice in May when the office is already waiting. An accounting firm can be slow (two days per question) and expensive relative to sole-trader volume. Neither a sheet nor “I will send scans on WhatsApp” gives one status: did the invoice leave, did the return go, is the contribution calculated.'),
        ul([
          'One login instead of three programs.',
          'An e-invoice that is compliant immediately, not an “add-on”.',
          'Deadlines in a calendar, not a notebook.',
          'A tax question in Polish — with escalation, not a hallucination left in a client email.',
        ]),
        note('*Hours and amounts are directional and depend on invoice volume and legal form. I do not average “all of Poland”. On a call we count your month.'),
      ),
      section(
        'HITL, not “we will drop ChatGPT onto the ledger”',
        p('The Plumm assistant does not sign returns for you in the dark. Fast questions — the model. A dispute, an interpretation, a fine risk — a human. Same philosophy as [human-in-the-loop automation](/artykuly/automatyzacja-z-kontrola-czlowieka/): allowed scope, a log, escalation. A public chat without a policy is a leak and a hallucination. I cover that in [implementing ChatGPT](/artykuly/wdrozyc-chatgpt-w-firmie/).'),
      ),
      section(
        'What this article is not',
        ol([
          'Not an affiliate “best accounting 2026” round-up.',
          'Not a promise that every sole trader saves 20 hours — hence the asterisk.',
          'Not an offer to white-label Plumm into a third-party office I do not run in public.',
          'It does not use iDrive or Agentic as accounting proof — wrong product.',
        ]),
        p('Live URL: plumm.pl and app.plumm.pl. If you need a panel for another process (not accounting), we return to [Ops](/artykuly/panel-operacyjny-zamiast-excela/) and PLN 60–180k+.'),
      ),
      section(
        'For whom a sheet is still enough',
        p('A handful of invoices a year, no staff, a family bookkeeper who hits the deadline. Then Plumm may be overkill. I do not push a subscription when ROI does not close — same rule as websites. When volume grows and late-filing fines cost more than the plan, the maths flips.'),
      ),
      section(
        'Neighbourhood with the site and the funnel',
        p('plumm.pl collects plans and explains the product. It is not a PLN 2,000 brochure detached from the panel. If you build your own SaaS, the site and the app are one system. If you only want an accountant’s brochure — another package, another goal, no fake e-invoice engine.'),
      ),
    ],
    faqs: [
      { q: 'Does Plumm always replace an accounting firm?', a: 'No. Companies and disputes still need a human. The assistant speeds routine; the bookkeeper enters when the model must not guess.' },
      { q: 'Must I drop my bookkeeper to use the panel?', a: 'That is not the claim. The claim: one record of invoices and returns instead of Excel plus three logins. How you work with a human is still yours to set.' },
      { q: 'Where do 12–20 h and PLN 300–600 come from?', a: 'From the product description and typical sole-trader volume, with an asterisk. They are not a guarantee of your month. A call counts your stack.' },
      { q: 'Will you deploy this as custom accounting at any firm?', a: 'Plumm is a product. Another accounting process at your company is separate Ops, not “we will clone Plumm in a week”.' },
    ],
    ctaTitle: 'Accounting or another panel — let us name the process',
    ctaBody: 'If you are a sole trader with invoices: plumm.pl. If another flow: a 20-minute audit. [Work](/#realizacje).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Онлайн-бухгалтерія замість Excel і бюро на годинах',
    description:
      'Онлайн-бухгалтерія замість Excel: у Plumm ФОП має e-фактури, PIT/VAT/ZUS і асистента з ескалацією. Оцінка 12–20 год/міс.* і на 300–600 злотих менше за традиційне бюро — без фальшивих відгуків.',
    h1: 'Онлайн-бухгалтерія замість Excel: одна панель, установа і людина в циклі',
    kicker: 'Plumm · власний продукт',
    lead:
      'Аркуш із рахунками, окрема програма для JPK, лист до бюро і календар ZUS у голові — це не «гнучкість». Це п’ять джерел правди. [Plumm](https://plumm.pl) — мій продукт: e-фактури до установи, розрахунки, CRM і податковий асистент, який у складнішій справі віддає голос бухгалтерці. Оцінки: на 12–20 год/міс.* менше паперової роботи при регулярному обсязі; на 300–600 злотих/міс. менше, ніж традиційне бюро для ФОП (плани від 149 злотих). Це не кейс «клієнта з вулиці». Це продукт, який сам підтримую і який можна клікнути.',
    sections: [
      section(
        'Excel у бухгалтерії псується тишею, не графіком',
        p('Формула роз’їдеться в квітні, а ви помітите в травні, коли установа вже чекає. Бюро буває повільним (два дні на питання) і дорогим відносно обсягу ФОП. Ані аркуш, ані «надішлю скани в WhatsApp» не дають одного статусу: чи рахунок вийшов, чи декларація пішла, чи внесок пораховано.'),
        ul([
          'Один логін замість трьох програм.',
          'E-фактура одразу за правилами, не «додаток за доплату».',
          'Терміни в календарі, не в зошиті.',
          'Податкове питання польською — з ескалацією, не з галюцинацією в листі до клієнта.',
        ]),
        note('*Години й суми орієнтовні, залежать від обсягу рахунків і форми. Не усереднюю «всю Польщу». На розмові рахуємо ваш місяць.'),
      ),
      section(
        'HITL, не «впровадимо ChatGPT у KPiR»',
        p('Асистент у Plumm не підписує декларації за вас наосліп. Швидкі питання — модель. Спір, тлумачення, ризик штрафу — людина. Та сама філософія, що в [автоматизації з контролем людини](/artykuly/automatyzacja-z-kontrola-czlowieka/): дозволений обсяг, запис, ескалація. Публічний чат без політики — витік і галюцинація. Про це — у [впровадженні ChatGPT](/artykuly/wdrozyc-chatgpt-w-firmie/).'),
      ),
      section(
        'Чим ця стаття не є',
        ol([
          'Не рейтингом «найкращих бухгалтерій 2026» з афіліаткою.',
          'Не обіцянкою, що кожен ФОП заощадить 20 годин — звідси зірочка.',
          'Не офертою впровадити Plumm у чуже бюро як white-label, якого я не веду публічно.',
          'Не використовує iDrive чи Agentic як бухгалтерський доказ — не той продукт.',
        ]),
        p('Живий URL: plumm.pl і панель app.plumm.pl. Якщо потрібна панель під інший процес (не бухгалтерія), повертаємось до [Ops](/artykuly/panel-operacyjny-zamiast-excela/) і оцінки 60–180 тис.+.'),
      ),
      section(
        'Для кого аркуш іще вистачає',
        p('Кілька рахунків на рік, нуль працівників, бухгалтерка в родині, яка встигає термін. Тоді Plumm може бути overkill. Не впихаю підписку, коли ROI не сходиться — те саме правило, що для сайтів. Коли обсяг росте і штрафи за спізнення дорожчі за план, математика розвертається.'),
      ),
      section(
        'Суседство з сайтом і воронкою',
        p('Сайт plumm.pl збирає плани й пояснює продукт. Це не візитівка за 2 000 осторонь панелі. Якщо будуєте власний SaaS, сайт і застосунок — одна система. Якщо потрібна лише візитівка бюро — інший пакет, інша ціль, без удавання рушія e-фактур.'),
      ),
    ],
    faqs: [
      { q: 'Чи Plumm завжди замінює бухгалтерське бюро?', a: 'Ні. У товариствах і спорах лишається людина. Асистент прискорює рутину; бухгалтерка входить, коли модель не повинна вгадувати.' },
      { q: 'Чи мушу кинути бухгалтерку, щоб користуватися панеллю?', a: 'Це не теза. Теза: один запис рахунків і декларацій замість Excel плюс три логіни. Модель роботи з людиною лишається на узгодження.' },
      { q: 'Звідки цифри 12–20 год і 300–600 злотих?', a: 'З опису продукту й типового обсягу ФОП, із зірочкою. Це не гарантія вашого місяця. Розмова рахує ваш стіс.' },
      { q: 'Чи впроваджуєте це в будь-якій фірмі як custom-бухгалтерію?', a: 'Plumm — продукт. Інший бухгалтерський процес у вас — окремий Ops, не «склонуємо Plumm за тиждень».' },
    ],
    ctaTitle: 'Бухгалтерія чи інша панель — назвімо процес',
    ctaBody: 'Якщо це ФОП і рахунки: plumm.pl. Якщо інший потік: 20 хвилин аудиту. [Реалізації](/#realizacje).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
