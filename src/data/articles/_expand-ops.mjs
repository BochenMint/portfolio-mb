import { note, ol, p, section, ul } from './_blocks.mjs'

export const expandOps = {
  'panel-operacyjny-zamiast-excela': {
    pl: [
      section(
        'Objawy, że arkusz już zarządza Wami, a nie Wy arkuszem',
        p('Panel operacyjny zamiast Excela nie zaczyna się od „chcemy nowocześnie”. Zaczyna się od tego, że dwie osoby nadpisują ten sam wiersz, makro pada na jednym laptopie, a wersja „final_v7_naprawdę” leży w mailu. Gdy proces się powtarza co tydzień i dotyczy pieniędzy albo obłożenia, koszt błędu przestaje być „poprawimy ręcznie”. Wtedy rozmawiamy o systemie, nie o ładniejszej tabeli.'),
        p('Zostawiam Excel, gdy jedna osoba ogarnia niski wolumen, nie ma równoległych edycji i nie ma audytu. Wstydliwa prawda: wiele firm nie potrzebuje panelu. Potrzebuje dyscypliny nazw plików i jednej osoby, która nie wyjeżdża bez zastępstwa. Platforma (od 25 000 zł) ma sens, gdy ten koszt jest tańszy niż miesięczny chaos albo gdy Excel blokuje wzrost, którego już nie udawacie.'),
        ul([
          'Kilka ról na jednym pliku: recepcja, księgowość, właściciel.',
          'Historia zmian, której nie da się odtworzyć z „ktoś skasował wiersz”.',
          'Ten sam proces w trzech lokalizacjach albo trzech obiektach.',
          'Integracja, której Excel nie utrzyma: KSeF, PMS, płatności, kolejka maili.',
        ]),
      ),
      section(
        'Co wchodzi w zakres, a co jest fantazją „Excel+AI”',
        p('Buduję stany, role, zapisy kroków i listy dozwolonych akcji. Nie buduję „ChatGPT w arkuszu, który sam księguje”. HITL dokładam, gdy powtarzalny krok da się ograniczyć allow-listą. Gdy chcecie, żeby model zgadywał VAT z PDF-a i od razu wysyłał, to nie jest panel — to ryzyko. [Księgowość online](/artykuly/ksiegowosc-online-zamiast-excela/) w Plumm jest własnym produktem, nie obietnicą, że wdrożyłem go u dwudziestu biur.'),
        p('SaaS czy custom rozstrzygamy osobno. Jeśli rynek ma narzędzie, które pokrywa 80% procesu, biorę je — jak Previo przy rezerwacjach Mint. Jeśli proces jest Waszą przewagą, jak e-faktury i asystent w Plumm, buduję. [Gotowiec vs panel](/artykuly/saas-czy-wlasny-panel/) nie jest slajdem religijnym. Jest rachunkiem lock-in i kosztu zmiany za dwa lata.'),
      ),
      section(
        'Wdrożenie panelu: dane, szkolenie, dzień, w którym Excel umiera',
        p('Migracja to nie „wkleimy CSV w piątek”. To mapowanie pól, śmieci w starych kolumnach, decyzja co z historią. Szkolenie 1–2 h nie zastąpi właściciela procesu. Jeśli po starcie wszyscy wracają do arkusza „bo tak szybciej”, panel był teatrem. Dlatego spisuję, który dzień jest dniem wyłączenia Excela i kto ma prawo otworzyć wyjątek.'),
        p('Nie gwarantuję, że zespół pokocha UI. Gwarantuję, że nie zostawiam Was z hasłem do serwera i PDF-em. Kod po fakturach jest Wasz albo produkt jest moim SaaS-em — to dwie różne umowy. Mylenie ich jest najczęstszym źródłem pretensji po roku.'),
        note('Nie zmyślam, że „wdrożyłem panele w 40 hotelach”. Publiczny, klikalny dowód operacyjny, który pokazuję, to to, co działa: Mint i Plumm. Reszta rozmowy jest o Waszym procesie, nie o cudzej galerii.'),
      ),
      section(
        'Kiedy nie biorę projektu panelu',
        ol([
          'Nie ma właściciela procesu — jest „zespół, który zbierze wymagania”.',
          'Budżet to „zróbmy MVP za kilka tysięcy jak aplikację z szablonu”.',
          'Celem jest zastąpić ludzi modelem językowym bez logu i eskalacji.',
          'Excel boli, ale nikt nie umie nazwać jednej metryki, która ma spaść.',
        ]),
        p('Wtedy uczciwszy jest [Audit Sprint](/artykuly/audyt-strony-internetowej/) albo stop. Panel operacyjny zamiast Excela jest drogi, bo błąd w stanie jest drogi. Jeśli nie czujecie tej ceny, zostańcie przy arkuszu i zatrudnijcie kogoś, kto go pilnuje. To też jest decyzja. Nie sprzedaję wstydu za to, że jeszcze nie „digital”.'),
      ),
    ],
    en: [
      section(
        'Symptoms that the sheet already manages you',
        p('An operations panel instead of Excel does not start with “we want to look modern”. It starts when two people overwrite the same row, a macro dies on one laptop, and “final_v7_really” lives in email. When a process repeats every week and touches money or occupancy, the cost of a mistake stops being “we will fix it by hand”. Then we talk about a system, not a prettier table.'),
        p('I leave Excel when one person handles low volume, there are no parallel edits, and there is no audit trail. An awkward truth: many firms do not need a panel. They need file-name discipline and one person who does not leave without a deputy. The Platform package at PLN 25,000+ makes sense when that cost is cheaper than monthly chaos, or when Excel blocks growth you no longer pretend not to have.'),
        ul([
          'Several roles on one file: front desk, accounting, owner.',
          'A change history you cannot reconstruct from “someone deleted a row”.',
          'The same process in three locations or three properties.',
          'An integration Excel will not hold: KSeF, PMS, payments, a mail queue.',
        ]),
      ),
      section(
        'What is in scope, and what is “Excel+AI” fantasy',
        p('I build states, roles, step logs and allow-lists. I do not build “ChatGPT in a sheet that books the accounts by itself”. I add HITL when a repetitive step can be limited to an allow-list. If you want a model to guess VAT from a PDF and send it immediately, that is not a panel — that is risk. [Online accounting](/artykuly/ksiegowosc-online-zamiast-excela/) in Plumm is my own product, not a claim that I rolled it out to twenty offices.'),
        p('SaaS versus custom is a separate call. If the market has a tool covering 80% of the process, I take it — like Previo for Mint bookings. If the process is your edge, like e-invoices and the assistant in Plumm, I build. [Off-the-shelf vs a panel](/artykuly/saas-czy-wlasny-panel/) is not a religious slide. It is lock-in arithmetic and the cost of change in two years.'),
      ),
      section(
        'Shipping a panel: data, training, the day Excel dies',
        p('Migration is not “we will paste CSV on Friday”. It is field mapping, junk in old columns, a decision about history. A 1–2 h training does not replace a process owner. If after launch everyone returns to the sheet “because it is faster”, the panel was theatre. So I write down which day Excel is switched off and who may open an exception.'),
        p('I do not guarantee the team will love the UI. I do guarantee I do not leave you with a server password and a PDF. After invoices the code is yours, or the product is my SaaS — two different contracts. Mixing them is the usual source of grievance a year later.'),
        note('I do not invent “I shipped panels to 40 hotels”. The public, clickable operational proof I show is what actually runs: Mint and Plumm. The rest of the conversation is your process, not someone else’s gallery.'),
      ),
      section(
        'When I decline a panel project',
        ol([
          'There is no process owner — only “a team that will gather requirements”.',
          'The budget is “an MVP for a few thousand, like a template app”.',
          'The goal is to replace people with a language model, no log, no escalation.',
          'Excel hurts, but nobody can name one metric that should fall.',
        ]),
        p('Then an [Audit Sprint](/artykuly/audyt-strony-internetowej/) or a stop is more honest. An operations panel instead of Excel is expensive because a bad state is expensive. If you do not feel that price, keep the sheet and hire someone to guard it. That is also a decision. I do not sell shame for not being “digital” yet.'),
      ),
    ],
    uk: [
      section(
        'Ознаки, що аркуш уже керує вами',
        p('Операційна панель замість Excel не починається з «хочемо сучасно». Починається з того, що двоє людей перезаписують один рядок, макрос падає на одному ноутбуці, а «final_v7_really» лежить у пошті. Коли процес повторюється щотижня і стосується грошей або завантаження, ціна помилки перестає бути «виправимо вручну». Тоді говоримо про систему, не про гарнішу таблицю.'),
        p('Лишаю Excel, коли одна людина тягне малий обсяг, немає паралельних правок і немає аудиту. Не зручна правда: багатьом фірмам панель не потрібна. Потрібна дисципліна назв файлів і людина, яка не їде без заступника. Платформа (від 25 000 злотих) має сенс, коли ця ціна дешевша за місячний хаос, або коли Excel блокує зростання, яке ви вже не вдаєте.'),
        ul([
          'Кілька ролей на одному файлі: рецепція, бухгалтерія, власник.',
          'Історія змін, якої не відновити з «хтось видалив рядок».',
          'Той самий процес у трьох локаціях або трьох об’єктах.',
          'Інтеграція, яку Excel не втримає: KSeF, PMS, оплати, черга листів.',
        ]),
      ),
      section(
        'Що в обсязі, а що є фантазією «Excel+ШІ»',
        p('Будую стани, ролі, записи кроків і списки дозволених дій. Не будую «ChatGPT в аркуші, який сам проводить облік». HITL додаю, коли повторюваний крок можна обмежити allow-list. Якщо хочете, щоб модель вгадувала VAT з PDF і одразу надсилала — це не панель, це ризик. [Онлайн-бухгалтерія](/artykuly/ksiegowosc-online-zamiast-excela/) у Plumm — власний продукт, не обіцянка, що я впровадив його в двадцяти бюро.'),
        p('SaaS чи custom вирішуємо окремо. Якщо ринок має інструмент на 80% процесу, беру його — як Previo для бронювань Mint. Якщо процес є вашою перевагою, як e-фактури й асистент у Plumm, будую. [Готовець vs панель](/artykuly/saas-czy-wlasny-panel/) — не релігійний слайд. Це арифметика lock-in і вартості зміни за два роки.'),
      ),
      section(
        'Впровадження панелі: дані, навчання, день смерті Excel',
        p('Міграція — не «вставимо CSV в п’ятницю». Це мапінг полів, сміття в старих колонках, рішення щодо історії. Навчання 1–2 год не замінює власника процесу. Якщо після старту всі вертаються до аркуша «бо так швидше», панель була театром. Тому списую, який день вимикає Excel і хто має право на виняток.'),
        p('Не гарантую, що команда полюбить UI. Гарантую, що не лишаю вас із паролем до сервера і PDF. Після рахунків код ваш, або продукт — мій SaaS: дві різні угоди. Плутати їх — найчастіше джерело претензій за рік.'),
        note('Не вигадую, що «впровадив панелі в 40 готелях». Публічний, клікабельний операційний доказ — те, що працює: Mint і Plumm. Решта розмови — про ваш процес, не про чужу галерею.'),
      ),
      section(
        'Коли не беру проєкт панелі',
        ol([
          'Немає власника процесу — є «команда, яка збере вимоги».',
          'Бюджет — «зробімо MVP за кілька тисяч, як застосунок із шаблону».',
          'Мета — замінити людей мовною моделлю без логу й ескалації.',
          'Excel болить, але ніхто не вміє назвати одну метрику, яка має впасти.',
        ]),
        p('Тоді чесніший [Audit Sprint](/artykuly/audyt-strony-internetowej/) або стоп. Операційна панель замість Excel дорога, бо помилка стану дорога. Якщо не відчуваєте цієї ціни, лишіться з аркушем і найміть того, хто його стереже. Це теж рішення. Не продаю сором за те, що ви ще не «digital».'),
      ),
    ],
  },
  'saas-czy-wlasny-panel': {
    pl: [
      section(
        'Pytania, które zadaję zanim ktoś powie „zawsze custom”',
        p('Gotowy system vs dedykowany panel: pierwsze pytanie nie dotyczy stacku. Czy proces jest Waszą przewagą, czy kosztem, który trzeba ogarnąć? W Mint rezerwacje nie są moim produktem — są operacją obiektu. Previo pokrywa kalendarz, kanały, rozliczenia gościa. Budowanie PMS od zera w budżecie strony byłoby pychą. W Plumm e-faktury, PIT/VAT/ZUS i asystent z eskalacją są produktem. Tam custom ma sens, bo to ja ponoszę lock-in, nie klient hotelu.'),
        p('Drugie pytanie: kto trzyma dane za dwa lata. SaaS oznacza, że wyłączenie konta boli. Custom oznacza, że musicie mieć kogoś, kto utrzyma kod — ja albo inny zespół, z umową. Nie sprzedaję „wolności od vendor lock-in”, a potem zostawiam Was z repozytorium bez dokumentacji. Trzecie: budżet 60–180 tys. zł na Ops nie jest „średnią branży”. Jest rzędem wielkości, gdy kilka ról, stany i integracje są prawdziwe.'),
        ul([
          'Czy 80% procesu już istnieje na rynku w narzędziu, które da się kupić.',
          'Czy wyjątki, które „musi mieć nasz Excel”, są przewagą czy sentymentem.',
          'Czy umiecie nazwać koszt zmiany dostawcy za 24 miesiące.',
          'Czy potrzebujecie audytu kroków (HITL), którego SaaS nie loguje po Waszemu.',
        ]),
      ),
      section(
        'Lock-in, którego nie da się wykliknąć w cenniku',
        p('Previo, KSeF, bramka, skrzynka — każdy kontrakt ma wyjście, które boli inaczej. Liczę to na głos. Nie obiecuję, że „zawsze da się wyeksportować”. Obiecuję, że zanim wpiąć, spisujemy co jest Wasze: dane gości, faktury, stany. UI dostawcy nie jest Waszym aktywem. Waszym aktywem jest proces i historia, której nie chcecie zgubić przy rozwodzie.'),
        p('Custom lock-in jest ze mną albo z kolejnym deweloperem. Dlatego kod po fakturach, NDA, szkolenie. Jeśli chcecie, żebym był jedynym człowiekiem na świecie, który rozumie panel — to jest zły deal dla Was. Wbudowuję prostotę, nie magię. Magia jest nieutrzymywalna, gdy ja będę na urlopie.'),
      ),
      section(
        'Kiedy SaaS wygrywa, mimo że „nie jest szyty na miarę”',
        p('Gdy kalendarz, kanały OTA i płatność gościa są standardem branży — szycie na miarę jest zazwyczaj droższym sposobem, żeby odkryć te same edge case’y. Mint nie udaje, że wymyśliłem hotelarstwo. Strona zbiera ruch i zamyka rezerwację na własnej domenie; PMS robi PMS. [Rezerwacje na własnej stronie](/artykuly/rezerwacje-na-wlasnej-stronie/) opisują tę granicę bez teatrzyku „napisałem Booking.com”.'),
        p('SaaS przegrywa, gdy Wasz proces jest regulowany albo nietypowy tak, że konfiguracja gotowca staje się drugim etatem. Albo gdy vendor nie da Wam logu decyzji, a Wy musicie pokazać kto kliknął „wystaw”. Wtedy panel z HITL. Nie dlatego, że custom brzmi drożej na fakturze — dlatego, że odpowiedzialność nie mieści się w cudzym checkboxie.'),
        note('To nie jest recenzja Previo dla Twojego obiektu. Inny obiekt, inny PMS. Nie zmyślam rolloutu u pięćdziesięciu operatorów.'),
      ),
      section(
        'Decyzja, którą spisujemy, żeby nie wracać za pół roku',
        ol([
          'Co kupujemy jako SaaS i co jest poza dyskusją przez 18 miesięcy.',
          'Co budujemy i kto utrzymuje po starcie.',
          'Jaki jest plan wyjścia: eksport, dokumentacja, eskalacja.',
          'Jakiej metryki użyjemy, żeby nie oceniać UI po gustie prezesa.',
        ]),
        p('Jeśli nie umiecie tego podpisać, nie zaczynamy budowy. Wracamy do [audytu](/artykuly/audyt-strony-internetowej/) albo do Excela z właścicielem. SaaS czy własny panel operacyjny to nie test osobowości. To umowa o tym, kto płaci, gdy coś się zepsuje w niedzielę.'),
      ),
    ],
    en: [
      section(
        'Questions I ask before anyone says “always custom”',
        p('Off-the-shelf versus a dedicated panel: the first question is not the stack. Is the process your edge, or a cost you must contain? At Mint, bookings are not my product — they are property operations. Previo covers the calendar, channels, guest settlement. Building a PMS from scratch inside a website budget would be vanity. In Plumm, e-invoices, PIT/VAT/ZUS and an assistant with escalation are the product. There custom makes sense, because I carry the lock-in, not a hotel client.'),
        p('Second: who holds the data in two years. SaaS means turning the account off hurts. Custom means you need someone who will keep the code — me or another team, under contract. I do not sell “freedom from vendor lock-in” and then leave you a repo with no docs. Third: PLN 60–180k for Ops is not an “industry average”. It is an order of magnitude when several roles, states and integrations are real.'),
        ul([
          'Whether 80% of the process already exists in a tool you can buy.',
          'Whether the exceptions “our Excel must have” are an edge or nostalgia.',
          'Whether you can name the cost of changing vendor in 24 months.',
          'Whether you need a step audit (HITL) the SaaS will not log your way.',
        ]),
      ),
      section(
        'Lock-in you cannot click away in a pricing table',
        p('Previo, KSeF, a gateway, a mailbox — every contract has an exit that hurts differently. I count that out loud. I do not promise “you can always export”. I promise that before we wire it, we write down what is yours: guest data, invoices, states. The vendor UI is not your asset. Your asset is the process and the history you do not want to lose in a divorce.'),
        p('Custom lock-in is with me or the next developer. Hence code after invoices, NDA, training. If you want me to be the only human on earth who understands the panel — that is a bad deal for you. I build simplicity, not magic. Magic is unmaintainable when I am on leave.'),
      ),
      section(
        'When SaaS wins even though it is “not tailored”',
        p('When calendars, OTA channels and guest payment are industry standard, tailoring is usually a more expensive way to rediscover the same edge cases. Mint does not pretend I invented hospitality. The site captures demand and closes booking on your domain; the PMS does PMS. [Direct bookings](/artykuly/rezerwacje-na-wlasnej-stronie/) describe that boundary without a theatre of “I wrote Booking.com”.'),
        p('SaaS loses when your process is regulated or so unusual that configuring the ready-made tool becomes a second job. Or when the vendor will not give you a decision log and you must show who clicked “issue”. Then a panel with HITL. Not because custom sounds more expensive on an invoice — because accountability does not fit in someone else’s checkbox.'),
        note('This is not a Previo review for your property. Another property, another PMS. I do not invent a rollout to fifty operators.'),
      ),
      section(
        'A decision we write down so we do not reopen it in six months',
        ol([
          'What we buy as SaaS and what is off the table for 18 months.',
          'What we build and who maintains it after launch.',
          'The exit plan: export, documentation, escalation.',
          'Which metric we will use so we do not judge UI by the CEO’s taste.',
        ]),
        p('If you cannot sign that, we do not start a build. We return to an [audit](/artykuly/audyt-strony-internetowej/) or to Excel with an owner. SaaS or a custom operations panel is not a personality test. It is a contract about who pays when something breaks on a Sunday.'),
      ),
    ],
    uk: [
      section(
        'Питання, які ставлю, перш ніж хтось скаже «завжди custom»',
        p('Готовий систем vs власна панель: перше питання не про стек. Процес — ваша перевага чи вартість, яку треба стримати? У Mint бронювання — не мій продукт, а операція об’єкта. Previo покриває календар, канали, розрахунки гостя. Будувати PMS з нуля в бюджеті сайту було б пихою. У Plumm e-фактури, PIT/VAT/ZUS і асистент з ескалацією є продуктом. Там custom має сенс, бо lock-in несу я, не клієнт готелю.'),
        p('Друге: хто тримає дані за два роки. SaaS означає, що вимкнення акаунта болить. Custom означає, що потрібен хтось, хто триматиме код — я або інша команда, за угодою. Не продаю «свободу від vendor lock-in», а потім лишаю репозиторій без документації. Третє: 60–180 тис. злотих на Ops — не «середнє по галузі». Це порядок величини, коли кілька ролей, стани й інтеграції справжні.'),
        ul([
          'Чи 80% процесу вже є на ринку в інструменті, який можна купити.',
          'Чи винятки, які «має мати наш Excel», — перевага чи ностальгія.',
          'Чи вмієте назвати вартість зміни вендора за 24 місяці.',
          'Чи потрібен аудит кроків (HITL), якого SaaS не логує по-вашому.',
        ]),
      ),
      section(
        'Lock-in, який не виклікаєш у прайсі',
        p('Previo, KSeF, шлюз, скринька — кожен контракт має вихід, який болить інакше. Рахую це вголос. Не обіцяю, що «завжди можна експортувати». Обіцяю, що перед врізкою спишемо, що ваше: дані гостей, рахунки, стани. UI вендора — не ваш актив. Ваш актив — процес і історія, яку не хочете загубити при розлученні.'),
        p('Custom lock-in — зі мною або з наступним розробником. Тому код після рахунків, NDA, навчання. Якщо хочете, щоб я був єдиною людиною на світі, яка розуміє панель — це погана угода для вас. Вбудовую простоту, не магію. Магія не підтримується, коли я у відпустці.'),
      ),
      section(
        'Коли SaaS виграє, навіть якщо «не під вас»',
        p('Коли календар, канали OTA й оплата гостя — стандарт галузі, пошиття зазвичай дорожчий спосіб відкрити ті самі edge case. Mint не вдає, що я винайшов готельну справу. Сайт збирає попит і закриває бронювання на вашому домені; PMS робить PMS. [Бронювання на власному сайті](/artykuly/rezerwacje-na-wlasnej-stronie/) описують цю межу без театру «я написав Booking.com».'),
        p('SaaS програє, коли ваш процес регульований або настільки нетиповий, що конфіг готовця стає другою роботою. Або коли вендор не дасть логу рішень, а ви мусите показати, хто клікнув «виставити». Тоді панель з HITL. Не тому, що custom звучить дорожче в рахунку — тому, що відповідальність не вміщається в чужий чекбокс.'),
        note('Це не огляд Previo для вашого об’єкта. Інший об’єкт — інший PMS. Не вигадую розгортання у п’ятдесяти операторів.'),
      ),
      section(
        'Рішення, яке записуємо, щоб не повертатися за пів року',
        ol([
          'Що купуємо як SaaS і що поза дискусією 18 місяців.',
          'Що будуємо і хто підтримує після старту.',
          'План виходу: експорт, документація, ескалація.',
          'Якою метрикою оцінюємо, щоб не судити UI смаком директора.',
        ]),
        p('Якщо цього не можете підписати, не починаємо будівництво. Повертаємось до [аудиту](/artykuly/audyt-strony-internetowej/) або до Excel із власником. SaaS чи власна панель — не тест особистості. Це угода про те, хто платить, коли щось ламається в неділю.'),
      ),
    ],
  },
  'ksiegowosc-online-zamiast-excela': {
    pl: [
      section(
        'Co Excel robi dobrze — i gdzie JDG zaczyna płacić czasem',
        p('Księgowość online zamiast Excela nie oznacza, że arkusz jest głupi. Excel jest świetny, gdy jedna osoba ogarnia niski wolumen i pamięta, co znaczy kolumna G. Psuje się, gdy dochodzi KSeF, terminy PIT/VAT/ZUS, choroba, urlop i „wyślę jutro”. Wtedy błąd nie jest kosmetyczny. Jest odsetkami, wezwaniem albo nocą przed terminem. Plumm buduję jako własny produkt dla JDG, nie jako wdrożenie u dwudziestu biur, których nie umiem pokazać.'),
        p('Szacunek 12–20 godzin miesięcznie i 300–600 zł mniej niż tradycyjne biuro jest hipotezą produktową, nie certyfikatem Twojej firmy. Gwiazdka zostaje. Nie wklejam fałszywych recenzji „biuro mnie okradało, Plumm mnie zbawił”. Jeśli masz księgową, która ogarnia i odbiera telefon — nie namawiam Cię do zdrady z ideologii. Namawiam, gdy arkusz i panika przed terminem są Twoim stałym rytuałem.'),
        ul([
          'E-faktury, które mają dojść, nie „plik w mailu, który ktoś zgubi”.',
          'Terminarz składek i podatków, którego nie trzymasz w głowie.',
          'Asystent z eskalacją do człowieka — nie autonadawanie bez logu.',
          'Eksport i historia, gdy zmienisz zdanie. Lock-in bez wyjścia jest wrogiem JDG.',
        ]),
      ),
      section(
        'HITL w księgowości: model nie podpisuje deklaracji za Ciebie',
        p('Asystent, który proponuje, a człowiek zatwierdza, to jedyny układ, który uważam za dorosły. Halucynacja na fakturze jest droższa niż wolniejszy klik. Dlatego w Plumm eskalacja nie jest wstydem produktu. Jest cechą. [Automatyzacja z kontrolą człowieka](/artykuly/automatyzacja-z-kontrola-czlowieka/) opisuje ten sam kontrakt w innych procesach: allow-lista, zapis, kto kliknął „wystaw”.'),
        p('Nie obiecuję, że AI „załatwi księgowość”. Obiecuję, że nie wpinam czatu w goły formularz, żeby wyglądało nowocześnie. RODO i odpowiedzialność za deklarację zostają przy Tobie i przy narzędziu, które umie pokazać ślad. Jeśli chcesz magii bez śladu — nie jesteśmy sobie pisani.'),
      ),
      section(
        'Kiedy biuro wciąż wygrywa z produktem online',
        p('Gdy masz spółkę, kadrę, środek trwały i spory, których JDG w Plumm nie pokrywa. Gdy potrzebujesz człowieka, który zna Twoją historię sporów z US i odbiera o 22:00 w kwietniu. Produkt online nie udaje kancelarii. Jeśli ktoś sprzedaje „pełną księgowość AI dla każdego” bez limitu formy prawnej — czytaj umowę dwa razy. Ja limity piszę na stronie, nie w przypisie 8 punktu.'),
        p('Biuro wygrywa też, gdy nie chcesz być operatorem narzędzia. Plumm zakłada, że klikniesz. Jeśli nienawidzisz klikania bardziej niż faktury za obsługę — zostań. To nie jest pogarda. To kwalifikacja. Lepiej nie mieć Cię jako użytkownika, niż mieć Cię jako wściekły ticket „bo myślałem, że samo się księguje”.'),
      ),
      section(
        'Jak ocenić, czy w ogóle ruszać z Excela',
        ol([
          'Policz godziny ostaniego miesiąca: faktury, maile do księgowej, poprawki.',
          'Zapisz, ile razy terminy były „na styk” albo po terminie.',
          'Sprawdź, czy ktoś poza Tobą umie otworzyć Twój arkusz i nic nie zepsuć.',
          'Zdecyduj, czy chcesz produktu z logiem, czy człowieka z telefonem.',
        ]),
        p('Jeśli po tej kartce wciąż wolisz Excel — zostaw. Jeśli wolisz człowieka — zadzwoń do biura. Jeśli chcesz zobaczyć, jak to wygląda w produkcie, który sam utrzymuję, wejdź na [Plumm](https://plumm.pl). Nie zmyślam case’ów klientów, których nie mogę nazwać. To jest cała uczciwość, na którą Cię stać przede mną i przed sobą.'),
      ),
    ],
    en: [
      section(
        'What Excel still does well — and where a sole trader starts paying in time',
        p('Online accounting instead of Excel does not mean the sheet is stupid. Excel is excellent when one person handles low volume and remembers what column G means. It breaks when KSeF arrives, PIT/VAT/ZUS deadlines, illness, leave, and “I will send it tomorrow”. Then a mistake is not cosmetic. It is interest, a summons, or a night before the deadline. I build Plumm as my own product for sole traders, not as a rollout to twenty offices I cannot show.'),
        p('The estimate of 12–20 hours a month and PLN 300–600 less than a traditional office is a product hypothesis, not a certificate for your firm. The asterisk stays. I do not paste fake reviews that “the office robbed me, Plumm saved me”. If you have an accountant who handles it and picks up the phone — I will not talk you into betrayal out of ideology. I talk when the sheet and deadline panic are your standing ritual.'),
        ul([
          'E-invoices that must arrive, not “a file in mail someone will lose”.',
          'A calendar of contributions and tax you do not keep in your head.',
          'An assistant with escalation to a human — not auto-send without a log.',
          'Export and history if you change your mind. Lock-in with no exit is an enemy of a sole trader.',
        ]),
      ),
      section(
        'HITL in accounting: the model does not sign the return for you',
        p('An assistant that proposes and a human that approves is the only adult setup I accept. A hallucination on an invoice is more expensive than a slower click. That is why escalation in Plumm is not a product shame. It is a feature. [Human-in-the-loop automation](/artykuly/automatyzacja-z-kontrola-czlowieka/) describes the same contract in other processes: allow-list, log, who clicked “issue”.'),
        p('I do not promise AI will “handle the books”. I promise I do not bolt a chat onto a naked form to look modern. GDPR and responsibility for the return stay with you and with a tool that can show a trail. If you want magic with no trail — we are not a match.'),
      ),
      section(
        'When an office still beats an online product',
        p('When you have a company, payroll, fixed assets and disputes a sole-trader Plumm does not cover. When you need a human who knows your history with the tax office and picks up at 22:00 in April. An online product does not impersonate a law firm. If someone sells “full AI accounting for everyone” with no legal-form limit — read the contract twice. I write limits on the page, not in footnote 8.'),
        p('An office also wins when you refuse to operate a tool. Plumm assumes you will click. If you hate clicking more than you hate the service invoice — stay. That is not contempt. That is qualification. Better not to have you as a user than to have you as an angry ticket because you thought “it books itself”.'),
      ),
      section(
        'How to judge whether to leave Excel at all',
        ol([
          'Count last month’s hours: invoices, mails to the accountant, corrections.',
          'Write down how often deadlines were “close” or late.',
          'Check whether anyone besides you can open the sheet without breaking it.',
          'Decide if you want a product with a log, or a human with a phone.',
        ]),
        p('If after that card you still prefer Excel — keep it. If you prefer a human — call an office. If you want to see how it looks in a product I maintain myself, open [Plumm](https://plumm.pl). I do not invent client case studies I cannot name. That is the whole honesty you can afford with me and with yourself.'),
      ),
    ],
    uk: [
      section(
        'Що Excel досі робить добре — і де ФОП починає платити часом',
        p('Онлайн-бухгалтерія замість Excel не означає, що аркуш дурний. Excel чудовий, коли одна людина тягне малий обсяг і пам’ятає, що означає колонка G. Ламається, коли з’являється KSeF, дедлайни PIT/VAT/ZUS, хвороба, відпустка і «надішлю завтра». Тоді помилка не косметична. Це відсотки, виклик або ніч перед терміном. Plumm будую як власний продукт для ФОП, не як впровадження в двадцяти бюро, яких не можу показати.'),
        p('Оцінка 12–20 годин на місяць і на 300–600 злотих менше за традиційне бюро — продуктова гіпотеза, не сертифікат вашої фірми. Зірочка лишається. Не вставляю фальшивих відгуків «бюро мене грабувало, Plumm врятував». Якщо є бухгалтер, який тягне і бере трубку — не вмовляю на зраду з ідеології. Вмовляю, коли аркуш і паніка перед дедлайном є вашим постійним ритуалом.'),
        ul([
          'E-фактури, які мають дійти, не «файл у пошті, який хтось загубить».',
          'Календар внесків і податків, якого не тримаєте в голові.',
          'Асистент з ескалацією до людини — не автовідправлення без логу.',
          'Експорт і історія, якщо передумаєте. Lock-in без виходу — ворог ФОП.',
        ]),
      ),
      section(
        'HITL у бухгалтерії: модель не підписує декларацію за вас',
        p('Асистент пропонує, людина затверджує — єдиний дорослий уклад, який визнаю. Галюцинація на рахунку дорожча за повільніший клік. Тому ескалація в Plumm — не сором продукту. Це риса. [Автоматизація з контролем людини](/artykuly/automatyzacja-z-kontrola-czlowieka/) описує той самий контракт в інших процесах: allow-list, запис, хто клікнув «виставити».'),
        p('Не обіцяю, що ШІ «закриє бухгалтерію». Обіцяю, що не встромляю чат у голу форму, щоб виглядало сучасно. GDPR і відповідальність за декларацію лишаються за вами і за інструментом, який уміє показати слід. Якщо хочете магії без сліду — ми не одне одному.'),
      ),
      section(
        'Коли бюро досі виграє в онлайн-продукту',
        p('Коли є компанія, кадри, основні засоби і спори, яких ФОП у Plumm не покриває. Коли потрібна людина, яка знає вашу історію з податковою і бере слухавку о 22:00 в квітні. Онлайн-продукт не вдає канцелярію. Якщо хтось продає «повну бухгалтерію ШІ для всіх» без ліміту форми — читайте угоду двічі. Я ліміти пишу на сторінці, не в посиланні пункту 8.'),
        p('Бюро виграє і тоді, коли не хочете бути оператором інструмента. Plumm припускає, що ви клікнете. Якщо ненавидите кліки більше за рахунок за обслуговування — лишіться. Це не презирство. Це кваліфікація. Краще не мати вас як користувача, ніж мати як злий тікет «бо думав, що само проводиться».'),
      ),
      section(
        'Як оцінити, чи взагалі рушати з Excel',
        ol([
          'Порахуйте години минулого місяця: рахунки, листи до бухгалтера, правки.',
          'Запишіть, скільки разів дедлайни були «впритул» або після терміну.',
          'Перевірте, чи хтось окрім вас уміє відкрити аркуш і нічого не зламати.',
          'Вирішіть, чи хочете продукт із логом, чи людину з телефоном.',
        ]),
        p('Якщо після цієї картки досі хочете Excel — лишіть. Якщо людину — телефонуйте в бюро. Якщо хочете побачити, як це виглядає в продукті, який сам підтримую, відкрийте [Plumm](https://plumm.pl). Не вигадую кейсів клієнтів, яких не можу назвати. Це вся чесність, на яку вас стати переді мною і перед собою.'),
      ),
    ],
  },
}
