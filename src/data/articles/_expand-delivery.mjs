import { note, ol, p, section, ul } from './_blocks.mjs'

/** Extra sections appended after the article body. Sized to land PL at 1400–2200 words. */

export const expandDelivery = {
  'audyt-strony-internetowej': {
    pl: [
      section(
        'Co przynosisz na Audit Sprint, żebym nie zgadywał',
        p('Bez materiałów sprint zamienia się w teatr opinii. Potrzebuję adresu produkcyjnego, nagrania ścieżki na telefonie (albo ja wchodzę sam), źródła zapytań z 90 dni jeśli istnieje Search Console, i tego, co dzieje się z mailem po formularzu. Jeśli nikt nie odpowiada przez trzy dni, audyt strony internetowej skończy się diagnozą „giniecie w skrzynce”, nie „zły kolor przycisku”.'),
        p('Nie wymagam pełnego CRM ani hurtowni. Wymagam uczciwości: ile zapytań realnie wpada, ile jest śmiecia, ile kończy się rozmową. Jeśli nie mierzysz nic, i tak da się zrobić mapę — ale wtedy priorytety 30/60/90 są ostrożniejsze, bo hipotezy nie mają kotwicy w liczbach. Nie zmyślam Wam współczynnika konwersji „jak u innych w branży”.'),
        ul([
          'URL produkcyjny i, jeśli jest, staging — żebym nie audytował atrapy.',
          'Kto odpowiada na zapytania i w jakim SLA. Cisza jest diagnostyką.',
          'Czy płacicie za ruch. Płatny klik na wolnym LTE obnaża INP szybciej niż organiczny spacer.',
          'Integracje, które „na pewno muszą zostać”: kalendarz, płatność, KSeF, PMS. To zmienia zakres sprintu.',
        ]),
      ),
      section(
        'Mapa lejka, którą dostajesz na końcu — nie moodboard',
        p('Wynik sprintu to jeden dokument: wąskie gardła, kolejność napraw, rząd wielkości pakietu i decyzja go/no-go. Nie dostajesz 40 slajdów z „best practices 2026”. Dostajesz: tu giną kliknięcia, tu giną maile, tu w ogóle nie ma oferty. Jeśli wąskim gardłem jest follow-up, nie sprzedaję Wam rebrandu. Jeśli wąskim gardłem jest brak ceny, nie sprzedaję Wam bloga.'),
        p('Kwota 2 500–6 000 zł zależy od głębokości, nie od liczby godzin teatralnych. Dolny próg: jedna ścieżka, jeden język, brak integracji. Górny: kilka ścieżek, płatny ruch, panel albo rezerwacje w tle. 20 minut bezpłatnie zostaje bezpłatne — to filtr, czy w ogóle rozmawiamy. Nie zaliczam tych 20 minut na „jeszcze jeden brief”.'),
        p('Jeśli po sprincie idziemy we wdrożenie, kwota sprintu może zostać zaliczona. Jeśli nie idziemy — zostajesz z mapą i priorytetami. To jest produkt. Nie jest produktem PDF „wasza strona mogłaby być ładniejsza” bez decyzji.'),
      ),
      section(
        'Czego audyt strony internetowej u mnie świadomie nie obejmuje',
        ol([
          'Rankingu w Google. Nie mam dostępu do Waszego profilu linków ani historii kar. Mogę powiedzieć, czy URL jest crawlable i czy title kłamie.',
          'Pen-testu i RODO-audytu prawnego. Mogę wskazać oczywiste wycieki w formularzu. Nie zastępuję kancelarii.',
          'Fałszywego benchmarku „strony konkurencji konwertują 4,2%”. Nie mam ich CRM-u. Nie zgaduję.',
          'Obietnicy, że po sprincie „na pewno wdrażamy”. Część sprintów kończy się stopem. To sukces, jeśli stop oszczędza 40 tysięcy.',
        ]),
        note('Live proof, który mogę kliknąć razem z Tobą, to Mint Apartments i Plumm. iDrive nie jest live. Agentic jest wewnętrzne. Audyt nie polega na pokazywaniu cudzych case’ów z LinkedIn.'),
      ),
      section(
        'Kiedy sprint jest złym zakupem',
        p('Jeśli szukasz dokumentu pod przetarg, żebym „potwierdził” decyzję już podjętą w zarządzie — nie biorę tego. Jeśli chcesz, żebym pochwalił motyw z ThemeForest, bo prezes lubi fiolet — też nie. Audit Sprint ma prawo być niewygodny. Ma powiedzieć, czy [strona firmowa B2B](/artykuly/strona-firmowa-b2b/) w ogóle jest właściwym produktem, czy potrzebujecie [lejka](/artykuly/lejek-konwersji-na-stronie/), panelu albo nic, tylko dyscypliny odpowiedzi na maila.'),
        p('Zły zakup jest też wtedy, gdy nie macie właściciela po Waszej stronie. Ja nie będę gonił trzech osób po status zdjęć. Sprint bez właściciela produkuje PDF, który umiera w Drive. Właściciel to ktoś z budżetem i kalendarzem, nie „osoba od social mediów, która zbierze feedback”.'),
      ),
    ],
    en: [
      section(
        'What you bring so the audit is not guesswork',
        p('Without materials the sprint becomes theatre. I need the production URL, a mobile path recording (or I open it myself), enquiry sources for 90 days if Search Console exists, and what happens to mail after the form. If nobody replies for three days, a website audit ends as “you die in the inbox”, not “wrong button colour”.'),
        p('I do not require a full CRM. I require honesty: how many enquiries actually arrive, how much is junk, how many become a conversation. If you measure nothing, a map is still possible — but 30/60/90 priorities stay cautious, because hypotheses have no numeric anchor. I do not invent a “industry-average conversion rate” for you.'),
        ul([
          'Production URL and staging if it exists — so I do not audit a dummy.',
          'Who answers enquiries and at what SLA. Silence is a diagnosis.',
          'Whether you pay for traffic. A paid click on slow LTE exposes INP faster than an organic stroll.',
          'Integrations that “must stay”: calendar, payments, KSeF, PMS. That changes sprint depth.',
        ]),
      ),
      section(
        'The funnel map you leave with — not a moodboard',
        p('The sprint output is one document: bottlenecks, repair order, package order of magnitude, go/no-go. You do not get 40 slides of “2026 best practices”. You get: clicks die here, mail dies here, there is no offer here. If follow-up is the bottleneck, I do not sell a rebrand. If price is missing, I do not sell a blog.'),
        p('PLN 2,500–6,000 tracks depth, not theatrical hours. Lower end: one path, one language, no integrations. Upper: several paths, paid traffic, a panel or booking in the background. The free 20 minutes stay free — a filter on whether we talk at all. I do not credit those 20 minutes toward “yet another brief”.'),
        p('If we proceed to a build, the sprint fee may be credited. If we do not, you keep the map and the priorities. That is the product. A PDF that says “your site could be prettier” without a decision is not.'),
      ),
      section(
        'What a website audit with me deliberately excludes',
        ol([
          'Google rankings. I do not have your link profile or penalty history. I can say whether the URL is crawlable and whether the title lies.',
          'A pen-test or a legal GDPR audit. I can flag obvious form leaks. I do not replace a law firm.',
          'A fake benchmark that “competitors convert at 4.2%”. I do not have their CRM. I do not guess.',
          'A promise that after the sprint “we definitely build”. Some sprints end in a stop. That is a win if the stop saves forty thousand.',
        ]),
        note('Live proof I can click with you is Mint Apartments and Plumm. iDrive is not live. Agentic is internal. An audit is not a parade of other people’s LinkedIn case studies.'),
      ),
      section(
        'When the sprint is a bad purchase',
        p('If you need a document for a tender so I “confirm” a board decision already taken — I decline. If you want praise for a ThemeForest theme because the CEO likes purple — also no. Audit Sprint is allowed to be uncomfortable. It must say whether a [B2B company website](/artykuly/strona-firmowa-b2b/) is even the right product, or whether you need a [funnel](/artykuly/lejek-konwersji-na-stronie/), a panel, or nothing except the discipline of answering mail.'),
        p('It is also a bad purchase when there is no owner on your side. I will not chase three people for photo status. A sprint without an owner produces a PDF that dies in Drive. An owner has budget and a calendar, not “the social-media person who will collect feedback”.'),
      ),
    ],
    uk: [
      section(
        'Що приносите на Audit Sprint, щоб я не здогадувався',
        p('Без матеріалів спринт стає театром думок. Потрібен продакшен-URL, запис шляху на телефоні (або я заходжу сам), джерела запитів за 90 днів, якщо є Search Console, і що діється з поштою після форми. Якщо ніхто не відповідає три дні, аудит сайту закінчиться діагнозом «гинете в скриньці», не «поганий колір кнопки».'),
        p('Не вимагаю повного CRM. Вимагаю чесності: скільки запитів реально падає, скільки сміття, скільки стає розмовою. Якщо не міряєте нічого, мапу все одно можна зробити — але пріоритети 30/60/90 обережніші, бо гіпотези не мають якоря в цифрах. Не вигадую вам «середній по галузі» коефіцієнт конверсії.'),
        ul([
          'Продакшен-URL і staging, якщо є — щоб я не аудитив муляж.',
          'Хто відповідає на запити і з яким SLA. Тиша — це діагностика.',
          'Чи платите за трафік. Платний клік на повільному LTE викриває INP швидше за органічну прогулянку.',
          'Інтеграції, які «точно мають лишитися»: календар, оплата, KSeF, PMS. Це змінює глибину спринту.',
        ]),
      ),
      section(
        'Мапа воронки, з якою виходите — не moodboard',
        p('Результат спринту — один документ: вузькі місця, порядок ремонту, порядок величини пакета і рішення go/no-go. Не 40 слайдів «best practices 2026». Отримуєте: тут гинуть кліки, тут гине пошта, тут немає оферти. Якщо вузьке місце — follow-up, не продаю редизайн. Якщо немає ціни, не продаю блог.'),
        p('Сума 2 500–6 000 злотих залежить від глибини, не від театральних годин. Нижній поріг: один шлях, одна мова, без інтеграцій. Верхній: кілька шляхів, платний трафік, панель або бронювання в тлі. 20 хвилин лишаються безкоштовними — фільтр, чи взагалі розмовляємо. Не зараховую ці 20 хвилин на «ще один бриф».'),
        p('Якщо після спринту йдемо у впровадження, сума може бути зарахована. Якщо ні — лишаєтесь із мапою і пріоритетами. Це продукт. PDF «ваш сайт міг би бути гарнішим» без рішення — ні.'),
      ),
      section(
        'Чого аудит сайту в мене свідомо не покриває',
        ol([
          'Ранжування в Google. Не маю вашого профілю посилань. Можу сказати, чи URL crawlable і чи title бреше.',
          'Пентесту й юридичного GDPR-аудиту. Можу вказати на очевидний витік у формі. Не замінюю юристів.',
          'Фальшивого бенчмарку «конкуренти конвертять 4,2%». Не маю їхнього CRM. Не здогадуюсь.',
          'Обіцянки, що після спринту «точно впроваджуємо». Частина спринтів закінчується стопом. Це успіх, якщо стоп рятує сорок тисяч.',
        ]),
        note('Живий доказ, який можу клікнути разом із вами — Mint Apartments і Plumm. iDrive не live. Agentic внутрішній. Аудит — не парад чужих кейсів із LinkedIn.'),
      ),
      section(
        'Коли спринт — погана покупка',
        p('Якщо шукаєте документ під тендер, щоб я «підтвердив» уже прийняте рішення — не беру. Якщо хочете похвалити ThemeForest, бо директору подобається фіолетовий — теж ні. Audit Sprint має право бути незручним. Має сказати, чи [корпоративний сайт B2B](/artykuly/strona-firmowa-b2b/) взагалі правильний продукт, чи потрібна [воронка](/artykuly/lejek-konwersji-na-stronie/), панель, або нічого, лише дисципліна відповіді на пошту.'),
        p('Погана покупка і тоді, коли немає власника з вашого боку. Я не ганятиму трьох людей за статусом світлин. Спринт без власника робить PDF, який помирає в Drive. Власник — це бюджет і календар, не «людина від соцмереж, яка збере фідбек».'),
      ),
    ],
  },
  'wdrozenie-strony-internetowej': {
    pl: [
      section(
        'Kalendarz, który nie kłamie: materiały, staging, produkcja',
        p('Wdrożenie strony internetowej psuje się najczęściej na Waszej stronie kalendarza, nie na mojej. Zdjęcia „w przyszłym tygodniu”, teksty „dziewczyna od contentu dopieści”, logotyp w trzech wersjach bez wektora. Dlatego daty stagingu i produkcji mają bufor na materiały. Spóźnienie przesuwa start. Nie magicznie „dopracujemy jakość w weekend”. Weekend jest na sen, nie na ratowanie briefu, którego nikt nie zamknął.'),
        p('Staging jest po to, żebyście klikali jak gość, nie jak projektant. Formularz ma dojść. Na telefonie. Z wolnym LTE. Jeśli staging oglądacie tylko na iMacu w biurze, oszukujecie siebie. Produkcja to DNS, przekierowania, Search Console, pomiar. Nie confetti w Figma. Po fakturach kod jest Wasz — to nie jest abonament motywu, który umiera, gdy wygaśnie licencja przeciętnego page buildera.'),
        ul([
          'Właściciel materiałów z imieniem, nie „zbierzemy w kanale”.',
          'Lista poza zakresem podpisana przed pierwszym commitem.',
          'Jedno konto do DNS i hostingu albo jasne, kto klika rekordy.',
          'Szkolenie 1–2 h w kalendarzu, nie „nagranie, jak będzie czas”.',
        ]),
      ),
      section(
        'Kto podejmuje decyzje w trakcie 90 dni',
        p('Jeśli decyzje rozjeżdżają się między marketingiem, IT i prezesem, wdrożenie staje się parkingiem komentarzy. Potrzebuję jednej osoby z prawem powiedzieć „tak, idziemy”. Feedback zbieracie wewnętrznie; do mnie wraca jedna lista, nie dwanaście maili z sprzecznymi H1. To nie jest arogancja. To jedyny sposób, żeby 2–4 tygodnie wizytówki zostały 2–4 tygodniami, a nie kwartałem.'),
        p('On-site w Trójmieście biorę, gdy warsztat z zespołem skraca pętlę. Zdalnie w całej Polsce. SLA odpowiedzi: jeden dzień roboczy. To nie hero. To koszt, który wkalkulowuję, zamiast znikać na dwa tygodnie w „sprincie”. Jeśli potrzebujecie komitetu sterującego i cotygodniowego statusu dla pięciu dyrektorów — to inny produkt i inna stawka, nie [pakiet strony firmowej](/#cennik).'),
      ),
      section(
        'Ryzyka, które spisuję zanim napiszę pierwszą linijkę',
        p('Integracja, której „na pewno nie ruszamy”, często jest tym, co wywraca termin. Previo, bramka, KSeF, stary CMS, skrzynka, która nie przyjmuje SMTP. Na starcie nazywam ryzyka: co jest pod Waszą kontrolą, co pod dostawcą, co pod mną. Nie obiecuję, że dostawca API odpowie w 24 godziny. Obiecuję, że nie udaję, iż to ja trzymam ich SLA.'),
        p('Treści eksperckie i drugi język nie wchodzą ukradkiem. Jeśli w połowie ktoś chce [PL/EN/UA i hreflang](/artykuly/strona-firmowa-b2b/), to jest zmiana zakresu, nie „drobiazg CSS”. Blog jako hash w SPA nie jest kanałem organicznym — jeśli chcecie artykuły, planujemy crawlable URL-e jak ten dziennik. To decyzja produktowa, nie wtyczka.'),
        ol([
          'Zmiana H1 co trzy dni zabija tempo. Zamykamy copy na stagingu.',
          'Nowe logo tydzień przed startem przesuwa start, nie „wcisnę w nocy”.',
          'Prośba o sklep, CRM albo AI-czat w ostatnim tygodniu jest nowym projektem.',
        ]),
      ),
      section(
        'Po starcie: co mierzymy i czego nie gwarantuję',
        p('Mierzymy to, co nazwaliśmy na początku: zapytania, które doszły, czas do pierwszej odpowiedzi, ewentualnie rezerwacje albo e-faktury. Nie gwarantuję pozycji na frazę. Nie gwarantuję, że płatny ruch nagle stanie się tani. Gwarantuję, że nie znikam z „powodzenia w Google” i że [szybkość](/artykuly/szybkosc-strony-a-seo/) sprawdzamy na produkcji, bo staging kłamie inną siecią.'),
        p('Poprawki po starcie są w umowie albo nie są. „Drobne zmiany przez miesiąc w cenie” bez limitu to sposób, żeby wizytówka zjadła budżet lejka. Spisujemy rundę poprawek. Potem jest retainer albo stop. To jest dorosłe wdrożenie strony internetowej, nie abonament wstydu za to, że prezes zobaczył inną stronę na Instagramie.'),
      ),
    ],
    en: [
      section(
        'A calendar that does not lie: assets, staging, production',
        p('Website implementation usually breaks on your side of the calendar, not mine. Photos “next week”, copy “the content person will polish”, a logo in three rasters and no vector. Staging and production dates therefore include a buffer for your assets. Delay moves launch. Quality does not magically appear on a weekend. Weekends are for sleep, not for rescuing a brief nobody closed.'),
        p('Staging exists so you click as a guest, not as a designer. The form must arrive. On a phone. On slow LTE. If you only view staging on an iMac in the office, you are lying to yourselves. Production is DNS, redirects, Search Console, measurement. Not confetti in Figma. After invoices the code is yours — this is not a theme subscription that dies when a page-builder licence expires.'),
        ul([
          'A named owner of assets, not “we will gather it in the channel”.',
          'An out-of-scope list signed before the first commit.',
          'One DNS/hosting account, or a clear person who clicks records.',
          'A 1–2 h training in the calendar, not “a recording when we have time”.',
        ]),
      ),
      section(
        'Who decides during the 90 days',
        p('If marketing, IT and the CEO split decisions, implementation becomes a parking lot of comments. I need one person with the right to say “yes, we go”. You collect feedback internally; I get one list, not twelve emails with conflicting H1s. That is not arrogance. It is the only way 2–4 weeks for a brochure stay 2–4 weeks, not a quarter.'),
        p('I take on-site in the Tri-City when a workshop shortens the loop. Remote across Poland. Reply SLA: one working day. That is not a hero line. It is a cost I price instead of disappearing for two weeks inside a “sprint”. If you need a steering committee and a weekly status for five directors — that is another product and another rate, not the [company-site package](/#cennik).'),
      ),
      section(
        'Risks I write down before the first line of code',
        p('The integration we “definitely will not touch” is often what blows the date. Previo, a payment gateway, KSeF, a legacy CMS, a mailbox that refuses SMTP. At kickoff I name risks: what you control, what a vendor controls, what I control. I do not promise a vendor API will answer in 24 hours. I promise I will not pretend their SLA is mine.'),
        p('Expert articles and a second language do not sneak in. If halfway someone wants [PL/EN/UA and hreflang](/artykuly/strona-firmowa-b2b/), that is a scope change, not a “CSS trifle”. A blog as a hash in an SPA is not an organic channel — if you want articles, we plan crawlable URLs like this journal. That is a product decision, not a plugin.'),
        ol([
          'Changing the H1 every three days kills pace. We freeze copy on staging.',
          'A new logo a week before launch moves launch. I do not “squeeze it in overnight”.',
          'A shop, CRM or AI chat in the last week is a new project.',
        ]),
      ),
      section(
        'After launch: what we measure and what I do not guarantee',
        p('We measure what we named at the start: enquiries that arrived, time to first reply, maybe bookings or e-invoices. I do not guarantee a keyword position. I do not guarantee paid traffic becomes cheap. I do guarantee I do not vanish with “good luck in Google”, and that we check [speed](/artykuly/szybkosc-strony-a-seo/) in production, because staging lies with a different network.'),
        p('Post-launch fixes are in the contract or they are not. “Small changes for a month included” with no cap is how a brochure eats a funnel budget. We write down a round of fixes. Then a retainer or a stop. That is adult website implementation, not a shame subscription because the CEO saw another site on Instagram.'),
      ),
    ],
    uk: [
      section(
        'Календар, який не бреше: матеріали, staging, продакшен',
        p('Впровадження сайту найчастіше ламається на вашому боці календаря, не на моєму. Світлини «наступного тижня», тексти «контент-дівчина дошліфує», логотип у трьох растрах без вектора. Тому дати staging і продакшену мають буфер на матеріали. Запізнення рухає старт. Якість не з’являється «на вихідних». Вихідні — для сну, не для порятунку брифу, який ніхто не закрив.'),
        p('Staging існує, щоб ви клікали як гість, не як дизайнер. Форма має дійти. На телефоні. На повільному LTE. Якщо staging дивитеся лише на iMac в офісі, обманюєте себе. Продакшен — DNS, редиректи, Search Console, вимір. Не конфеті у Figma. Після рахунків код ваш — це не підписка на тему, яка помирає, коли згасає ліцензія page builder.'),
        ul([
          'Власник матеріалів на ім’я, не «зберемо в каналі».',
          'Список поза обсягом підписаний до першого коміту.',
          'Один акаунт DNS/хостингу або ясно, хто клікає записи.',
          'Навчання 1–2 год у календарі, не «запис, як буде час».',
        ]),
      ),
      section(
        'Хто ухвалює рішення протягом 90 днів',
        p('Якщо рішення роз’їжджаються між маркетингом, ІТ і директором, впровадження стає парковкою коментарів. Потрібна одна людина з правом сказати «так, йдемо». Фідбек збираєте всередині; до мене повертається один список, не дванадцять листів із суперечливими H1. Це не зарозумілість. Це єдиний спосіб, щоб 2–4 тижні візитівки лишилися 2–4 тижнями, а не кварталом.'),
        p('Онсайт у Тримісті беру, коли воркшоп з командою скорочує петлю. Віддалено по всій Польщі. SLA відповіді: один робочий день. Це не геройський рядок. Це вартість, яку закладаю, замість зникати на два тижні в «спринті». Якщо потрібен комітет і щотижневий статус для п’яти директорів — це інший продукт і інша ставка, не [пакет корпоративного сайту](/#cennik).'),
      ),
      section(
        'Ризики, які списую до першого рядка коду',
        p('Інтеграція, яку «точно не чіпаємо», часто валить термін. Previo, шлюз, KSeF, старий CMS, скринька, яка не приймає SMTP. На старті називаю ризики: що під вами, що під вендором, що піді мною. Не обіцяю, що API вендора відповість за 24 години. Обіцяю, що не вдаю, ніби їхній SLA — мій.'),
        p('Експертні статті й друга мова не заходять крадькома. Якщо посередині хтось хоче [PL/EN/UA і hreflang](/artykuly/strona-firmowa-b2b/), це зміна обсягу, не «дрібничка CSS». Блог як хеш у SPA не є органічним каналом — якщо хочете статті, плануємо crawlable URL, як цей журнал. Це продуктове рішення, не плагін.'),
        ol([
          'Зміна H1 щотри дні вбиває темп. Копію заморожуємо на staging.',
          'Нове лого за тиждень до старту рухає старт, не «втисну вночі».',
          'Прохання про магазин, CRM чи AI-чат на останньому тижні — новий проєкт.',
        ]),
      ),
      section(
        'Після старту: що міряємо і чого не гарантую',
        p('Міряємо те, що назвали на початку: запити, які дійшли, час до першої відповіді, можливо бронювання чи e-фактури. Не гарантую позицію за фразою. Не гарантую, що платний трафік раптом подешевшає. Гарантую, що не зникаю з «успіхів у Google» і що [швидкість](/artykuly/szybkosc-strony-a-seo/) перевіряємо на продакшені, бо staging бреше іншою мережею.'),
        p('Правки після старту є в угоді або їх немає. «Дрібні зміни місяць у ціні» без ліміту — спосіб, щоб візитівка з’їла бюджет воронки. Списуємо раунд правок. Потім ретейнер або стоп. Це доросле впровадження сайту, не підписка на сором, бо директор побачив інший сайт в Instagram.'),
      ),
    ],
  },
  'szybkosc-strony-a-seo': {
    pl: [
      section(
        'Co naprawdę mierzę po deploju, a czego nie wklejam na slajd',
        p('Szybkość strony a SEO to nie wyścig Lighthouse na localhostcie z kablem. Po starcie otwieram stronę na telefonie, na sieci, której nie kontroluję, i patrzę na LCP oraz INP. Lab z CrUX, gdy ruch w ogóle istnieje. Jeśli ruchu nie ma, lab jest hipotezą — nie certyfikatem. Nie publikuję tu fałszywego „PageSpeed 98 na Mint”. Mint i Plumm możesz zmierzyć sam. iDrive nie jest live, więc nie ma czego chwalić na produkcji.'),
        p('FID wypadł z Core Web Vitals. Agencja, która w 2026 raportuje FID jako sukces, audytuje wspomnienia. INP opisuje, jak strona reaguje na klik i pisanie. Ciężki JS, hydracja całego SPA, czat wklejony w hero — to zabójcy INP. Dlatego wizytówki stawiam na lekkim stacku. Gra i hangar 3D są osobnymi wejściami, nie obowiązkowym bagażem strony firmowej.'),
        ul([
          'LCP: hero nie może być dekoracją 4 MB „bo ładnie w portfolio”.',
          'INP: trzecie skrypty, pixel, czat. Zgoda marketingu nie jest darmowa.',
          'CLS: fonty i banery cookie, które przepychają CTA po załadowaniu.',
          'TTFB: hosting i cache. Motyw z dwudziestoma wtyczkami „optymalizacji” zwykle kłamie.',
        ]),
      ),
      section(
        'Crawlable HTML kontra hash, którego Google nie traktuje jak adresu',
        p('Ten dziennik jest statycznym HTML. To decyzja SEO, nie moda. Hash routing nie jest adresem dla Search Console. Jeśli chcesz organiczny kanał, URL musi istnieć bez JavaScriptu jako jedynego nośnika treści. Wizytówka bez bloga tego nie potrzebuje. Klastry — tak. Nie mieszam tego z „wtyczką blog w page builderze”, która produkuje zduplikowane parametry i 200 na puste facety.'),
        p('Hreflang na wersji ukraińskiej to `uk` albo `uk-UA`, nie wymysł `ua`. Prefiks URL jest `/ua/`, bo tak czyta człowiek i tak trzymamy spójność z homepage. Mylenie UK (Wielka Brytania) z UA w UI to błąd, który sam naprawiam, gdy go widzę. Szybkość i i18n spotykają się tu: trzy kopie to trzy LCP, nie jeden „przetłumaczony div”.'),
      ),
      section(
        'Czego nie wytnę, żeby Lighthouse się uśmiechnął',
        ol([
          'Treści, która sprzedaje. Pusty hero z wynikiem 100 nie zbiera zapytań.',
          'Formularza, który działa na wolnym LTE. „Szybka” strona bez CTA to błąd pomiaru.',
          'Dowodu, który można kliknąć. Obrazek z posteru nie jest Mint.',
          'Pomiaru zapytań. Pixel ma koszt INP — dlatego nie wpinam pięciu naraz „na wszelki wypadek”.',
        ]),
        p('Jeśli płacicie za ruch, najpierw naprawiamy INP i LCP na ścieżce płatnej, nie „cały serwis na 100”. [Dlaczego strona nie sprzedaje](/artykuly/dlaczego-strona-nie-sprzedaje/) często zaczyna się w wiadrze 2: ludzie przychodzą i uciekają, bo pierwszy ekran jest ciężki. Redesign bez pomiaru to zakup tapety.'),
      ),
      section(
        'Stack, którego używam, gdy szybkość jest częścią oferty',
        p('Astro albo Next na wizytówkę, nie WordPress z ThemeForest i dwudziestoma wtyczkami cache, które walczą ze sobą. Obrazy w rozsądnym formacie, bez hero-wideo 4K pod CTA. Czcionki ograniczone. Trzecie skrypty na zgodę, nie na starcie. To nie jest religia JAMstack. To rachunek: każda kilobajtowa uprzejmość wobec marketingu jest nieuprzejmością wobec INP na Androidzie z 2020 roku.'),
        p('Po [wdrożeniu](/artykuly/wdrozenie-strony-internetowej/) zostawiam Wam sposób pomiaru, nie screenshot z dnia premiery. Sieć się zmienia, pixel się dokłada, ktoś wkleja Tag Managera „na chwilę”. Szybkość strony a SEO to higiena, nie projekt zamknięty. Jeśli nie chcecie tej higieny, nie obiecuję pozycji — i nie biorę odpowiedzialności za kampanię, która pali budżet na spinnerze.'),
      ),
    ],
    en: [
      section(
        'What I actually measure after deploy, and what I refuse to slide-deck',
        p('Website speed and SEO is not a Lighthouse race on localhost with a cable. After launch I open the site on a phone, on a network I do not control, and I look at LCP and INP. CrUX when traffic exists at all. If there is no traffic, lab is a hypothesis — not a certificate. I do not publish a fake “PageSpeed 98 on Mint”. You can measure Mint and Plumm yourself. iDrive is not live, so there is nothing to boast about in production.'),
        p('FID left Core Web Vitals. An agency that in 2026 reports FID as success is auditing memories. INP describes how the page reacts to a click and to typing. Heavy JS, hydrating a whole SPA, a chat pasted into the hero — those kill INP. That is why brochure sites sit on a light stack. The 3D hangar and the game are separate entries, not mandatory luggage on a company site.'),
        ul([
          'LCP: the hero must not be a 4 MB decoration “because it looks good in a portfolio”.',
          'INP: third-party scripts, pixels, chat. Marketing consent is not free.',
          'CLS: fonts and cookie banners that shove the CTA after load.',
          'TTFB: hosting and cache. A theme with twenty “optimisation” plugins usually lies.',
        ]),
      ),
      section(
        'Crawlable HTML versus a hash Google does not treat as an address',
        p('This journal is static HTML. That is an SEO decision, not a fashion. Hash routing is not an address for Search Console. If you want an organic channel, the URL must exist without JavaScript as the only carrier of meaning. A brochure without a blog does not need that. Clusters do. I do not confuse this with a “blog plugin in a page builder” that duplicates query params and returns 200 on empty facets.'),
        p('Hreflang on the Ukrainian version is `uk` or `uk-UA`, not an invented `ua`. The URL prefix is `/ua/` because humans read it and it stays consistent with the homepage. Mixing UK (United Kingdom) with UA in the UI is a mistake I fix when I see it. Speed and i18n meet here: three copies are three LCPs, not one “translated div”.'),
      ),
      section(
        'What I will not cut so Lighthouse smiles',
        ol([
          'Copy that sells. An empty hero with a 100 score collects no enquiries.',
          'A form that works on slow LTE. A “fast” site without a CTA is a measurement error.',
          'Proof you can click. A poster image is not Mint.',
          'Enquiry measurement. A pixel has an INP cost — that is why I do not bolt five “just in case”.',
        ]),
        p('If you pay for traffic, we fix INP and LCP on the paid path first, not “the whole site to 100”. [Why a site does not sell](/artykuly/dlaczego-strona-nie-sprzedaje/) often starts in bucket 2: people arrive and leave because the first screen is heavy. A redesign without measurement is wallpaper.'),
      ),
      section(
        'The stack I use when speed is part of the offer',
        p('Astro or Next for a brochure, not WordPress from ThemeForest with twenty cache plugins fighting each other. Images in a sane format, no 4K hero video under the CTA. Limited fonts. Third-party scripts behind consent, not at start. This is not JAMstack religion. It is arithmetic: every kilobyte of courtesy to marketing is discourtesy to INP on a 2020 Android.'),
        p('After [implementation](/artykuly/wdrozenie-strony-internetowej/) I leave you a way to measure, not a screenshot from launch day. Networks change, pixels get added, someone pastes Tag Manager “for a moment”. Speed and SEO are hygiene, not a closed project. If you do not want that hygiene, I do not promise rankings — and I do not own a campaign that burns budget on a spinner.'),
      ),
    ],
    uk: [
      section(
        'Що насправді міряю після деплою, а чого не кладу на слайд',
        p('Швидкість сайту і SEO — не гонка Lighthouse на localhost з кабелем. Після старту відкриваю сайт на телефоні, в мережі, яку не контролюю, і дивлюсь LCP та INP. CrUX, коли трафік узагалі є. Якщо трафіку немає, lab — гіпотеза, не сертифікат. Не публікую тут фальшиве «PageSpeed 98 на Mint». Mint і Plumm можете виміряти самі. iDrive не live, тож хвалити продакшен немає чим.'),
        p('FID випав з Core Web Vitals. Агенція, яка в 2026 звітує FID як успіх, аудитить спогади. INP описує, як сторінка реагує на клік і введення. Важкий JS, гідрація всього SPA, чат у hero — вбивці INP. Тому візитівки ставлю на легкому стеку. Гра і 3D-ангар — окремі входи, не обов’язковий багаж корпоративного сайту.'),
        ul([
          'LCP: hero не може бути декорацією на 4 МБ «бо гарно в портфоліо».',
          'INP: сторонні скрипти, піксель, чат. Згода маркетингу не безкоштовна.',
          'CLS: шрифти й банери cookie, які штовхають CTA після завантаження.',
          'TTFB: хостинг і кеш. Тема з двадцятьма плагінами «оптимізації» зазвичай бреше.',
        ]),
      ),
      section(
        'Crawlable HTML проти хешу, який Google не вважає адресою',
        p('Цей журнал — статичний HTML. Це рішення SEO, не мода. Hash routing не є адресою для Search Console. Якщо хочете органічний канал, URL має існувати без JavaScript як єдиного носія сенсу. Візитівці без блогу це не потрібно. Кластерам — так. Не плутаю це з «плагіном блогу в page builder», який плодить дублі параметрів і 200 на порожніх фасетах.'),
        p('Hreflang на українській версії — `uk` або `uk-UA`, не вигадка `ua`. Префікс URL — `/ua/`, бо так читає людина і так тримаємо узгодженість із homepage. Плутати UK (Велика Британія) з UA в UI — помилка, яку виправляю, коли бачу. Швидкість і i18n зустрічаються тут: три копії — три LCP, не один «перекладений div».'),
      ),
      section(
        'Чого не виріжу, щоб Lighthouse усміхнувся',
        ol([
          'Тексту, який продає. Порожній hero з результатом 100 не збирає запитів.',
          'Форми, яка працює на повільному LTE. «Швидкий» сайт без CTA — помилка виміру.',
          'Доказу, який можна клікнути. Картинка з постера — не Mint.',
          'Виміру запитів. Піксель має ціну INP — тому не встромляю п’ять «про всяк випадок».',
        ]),
        p('Якщо платите за трафік, спочатку ремонтуємо INP і LCP на платному шляху, не «весь сайт на 100». [Чому сайт не продає](/artykuly/dlaczego-strona-nie-sprzedaje/) часто починається у відрі 2: люди приходять і тікають, бо перший екран важкий. Редизайн без виміру — покупка шпалер.'),
      ),
      section(
        'Стек, який використовую, коли швидкість є частиною оферти',
        p('Astro або Next для візитівки, не WordPress з ThemeForest і двадцятьма плагінами кешу, які б’ються між собою. Зображення в здоровому форматі, без hero-відео 4K під CTA. Обмежені шрифти. Сторонні скрипти за згодою, не на старті. Це не релігія JAMstack. Це арифметика: кожен кілобайт чемності до маркетингу — нечемність до INP на Android 2020 року.'),
        p('Після [впровадження](/artykuly/wdrozenie-strony-internetowej/) лишаю вам спосіб виміру, не скріншот дня прем’єри. Мережа змінюється, піксель додається, хтось вставляє Tag Manager «на хвилинку». Швидкість сайту і SEO — гігієна, не закритий проєкт. Якщо не хочете цієї гігієни, не обіцяю позицій — і не беру відповідальності за кампанію, яка палить бюджет на спінері.'),
      ),
    ],
  },
}
