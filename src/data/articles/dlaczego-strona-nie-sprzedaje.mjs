import { DATE, note, offerOferta, ol, p, section, ul } from './_blocks.mjs'

export default {
  slug: 'dlaczego-strona-nie-sprzedaje',
  keyword: 'dlaczego strona nie sprzedaje',
  keywordEn: 'why a website is not converting',
  keywordUk: 'чому сайт не продає',
  intent: 'informational',
  cluster: 'strony',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'lejek-konwersji-na-stronie', anchor: { pl: 'lejek konwersji zamiast kolejnego redesignu', en: 'a conversion funnel instead of another redesign', uk: 'воронка конверсії замість чергового редизайну' } },
    { slug: 'audyt-strony-internetowej', anchor: { pl: 'audyt, który kończy się decyzją', en: 'an audit that ends in a decision', uk: 'аудит, який закінчується рішенням' } },
    { slug: 'szybkosc-strony-a-seo', anchor: { pl: 'szybkość strony a SEO i porzucony ruch', en: 'site speed, SEO and abandoned traffic', uk: 'швидкість сайту, SEO і втрачений трафік' } },
  ],
  offer: [offerOferta()],
  pl: {
    title: 'Dlaczego strona nie sprzedaje — diagnoza, nie redesign',
    description:
      'Dlaczego strona nie sprzedaje: zły ruch, zła ścieżka albo brak follow-up. Diagnozuję trzy wiadra zanim ktoś kupi nowy layout. Bez fałszywych opinii i magicznych procentów.',
    h1: 'Dlaczego strona nie sprzedaje: trzy wiadra, zanim ruszysz layout',
    kicker: 'Diagnostyka',
    lead:
      '„Zróbmy ładniej” to najdroższa hipoteza, jaką możesz kupić, gdy strona nie sprzedaje. Zanim ktokolwiek otworzy Figmę, rozdzielam problem na trzy wiadra: nie ten ruch, nie ta ścieżka, nie ta obsługa po kliknięciu. Poniżej procedura, której używam na audycie — bez list „12 grzechów UX” skopiowanych z konkurencji i bez wymyślonych case’ów.',
    sections: [
      section(
        'Wiadro 1: ruch, który nie ma prawa konwertować',
        p('Jeśli nikt nie wchodzi, strona nie ma czego sprzedawać. To nie jest problem layoutu. To kanał: brak nazwy w Google, brak poleceń, kampania na frazę, która zbiera studentów, nie właścicieli. Wtedy redesign jest teatrem. Najpierw źródło: skąd ostatnie dziesięć zapytań (jeśli były), jaki koszt kliknięcia, jaka fraza.'),
        p('Drugi wariant: ruch jest, ale nie ten. Blog o „trendach 2026” ciągnie ciekawskich. Oferta B2B wymaga budżetu i bólu. Mierzysz sesje, nie zapytania — i wnioskujesz, że „strona nie sprzedaje”. Sprzedaje źle skonstruowany content, nie przycisk. Dlatego [strona firmowa B2B](/artykuly/strona-firmowa-b2b/) w moim zakresie nie obejmuje bloga „na SEO” w cenie wizytówki.'),
        note('Nie podaję „średniego CR dla B2B z raportu X”, bo bez Twojego ICP to ozdoba. Na audycie liczę Twoje zapytania i Twój koszt obsługi.'),
      ),
      section(
        'Wiadro 2: ścieżka, która nie kończy się decyzją',
        p('Ruch ciepły, skrzynka pusta. Klasyczne przyczyny, które naprawdę widzę: H1 o firmie zamiast o decyzji; brak rzędu wielkości ceny; pięć CTA; formularz z dziewięcioma polami; mailto na mobile; brak dowodu albo — gorzej — fałszywe opinie, które niszczą zaufanie, gdy ktoś sprawdzi. Ja opinii nie zmyślam. Jeśli nie masz żywego URL-a, piszemy proces i zasady.'),
        ul([
          'Czy w 10 sekund wiadomo, dla kogo to jest?',
          'Czy da się wysłać zapytanie kciukiem, bez zoomu?',
          'Czy po wysłaniu ktoś dostaje maila w ciągu minuty, nie „sprawdzimy w piątek”?',
          'Czy mierzysz wysłanie, czy tylko odsłony?',
        ]),
        p('Tu często wychodzi, że potrzebny jest [lejek](/artykuly/lejek-konwersji-na-stronie/), nie nowa paleta. Albo odwrotnie: lejek jest overkill, a brakuje jednej jasnej oferty. [Wizytówka kontra lejek](/artykuly/strona-wizytowka-czy-lejek/) jest osobną decyzją budżetową.'),
      ),
      section(
        'Wiadro 3: follow-up, którego strona nie wygra',
        p('Formularz dochodzi, a potem cisza: oferta w PDF po tygodniu, handlowiec na urlopie, Excel z „nowymi leadami”, których nikt nie rusza. Strona „nie sprzedaje”, bo sprzedaż nie istnieje jako proces. To już granica panelu operacyjnego albo choćby powiadomienia i SLA odpowiedzi. Nie leczę tego gradientem na przycisku.'),
        p('W Mint problemem nie była „mało ładna strona”. Problemem była prowizja portalu i godziny na pytaniach gości. Strona zaczęła sprzedawać, gdy gość mógł zarezerwować taniej na własnej domenie. W Plumm — gdy JDG przestał skakać między Excelem a biurem. To operacja podpięta pod interfejs, nie magia UX.'),
      ),
      section(
        'Czego nie robię, gdy prosisz o „przyspieszenie sprzedaży”',
        ol([
          'Nie dokładam fake testimonials.',
          'Nie obiecuje pozycji w Google w 30 dni.',
          'Nie przerysowuję wszystkiego, jeśli w analityce widać, że 80% odpadu to czas LCP albo zły kanał.',
          'Nie wdrażam czatu AI na wizytówce, żeby „ożywić” brak oferty.',
        ]),
        p('Jeśli po 20 minutach widać, że nie spina się ROI, mówię to. [Audyt](/artykuly/audyt-strony-internetowej/) istnieje po to, żeby nie kupować wdrożenia z przyzwyczajenia.'),
      ),
      section(
        'Jak zbieram dowód, że to naprawdę to wiadro',
        p('Potrzebuję: Search Console albo choćby źródła zapytań z ostatnich 90 dni, nagranie mobile (albo ja wchodzę na telefonie), ścieżka maila po formularzu, czas odpowiedzi. Bez tego zgadujemy. Z tym — da się odróżnić „nikt nie przychodzi” od „przychodzą i uciekają” od „przychodzą, piszą i giną w skrzynce”.'),
        p('Szybkość jest w wiadrze 2, ale zasługuje na osobny tekst: [szybkość strony a SEO](/artykuly/szybkosc-strony-a-seo/). INP i LCP na telefonie potrafią zabić płatny ruch, zanim H1 zdąży cokolwiek obiecać. Nie myl tego z „trzeba więcej animacji”.'),
      ),
      section(
        'Co robimy po diagnozie — jedna zmiana, nie dwanaście',
        p('Wychodzi jedno zadanie wiodące: kanał, ścieżka albo follow-up. Wdrażamy to, mierzymy dwa tygodnie, dopiero wtedy dokładamy kolejne. Właściciele lubią checklisty 40 punktów, bo wyglądają na pracę. Ja lubię jedną metrykę: liczba kwalifikowanych zapytań albo czas do pierwszej odpowiedzi. Reszta jest komentarzem.'),
      ),
    ],
    faqs: [
      {
        q: 'Strona jest ładna, a zapytań brak. To na pewno SEO?',
        a: 'Nie na pewno. Najpierw sprawdzam, czy w ogóle jest ruch i jaki. SEO bywa winne, ale równie często winna jest oferta albo mailto na mobile.',
      },
      {
        q: 'Czy nowy layout podniesie sprzedaż?',
        a: 'Tylko jeśli wiadro 2 jest wąskie i layout naprawdę blokuje decyzję. Sam „nowoczesny look” bez zmiany CTA, ceny i pomiaru zwykle nic nie robi.',
      },
      {
        q: 'Potrzebuję opinii klientów na stronie. Mogę je dodać?',
        a: 'Tylko prawdziwe, z imieniem, które klient akceptuje, albo link do żywego wdrożenia. Nie piszę recenzji za Ciebie.',
      },
      {
        q: 'Ile trwa taka diagnoza?',
        a: '20 minut na start. Jeśli trzeba wejść w analitykę i proces — Audit Sprint 2 500–6 000 zł, z zaliczeniem na wdrożenie gdy ma to sens.',
      },
    ],
    ctaTitle: 'Zanim kupisz redesign, nazwij wiadro',
    ctaBody:
      '20 minut wystarczy, żeby powiedzieć: kanał, ścieżka albo follow-up. Potem ewentualnie [zakres prac](/#oferta).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'Why a website does not sell — diagnose, do not redesign',
    description:
      'Why a website does not sell: the wrong traffic, the wrong path, or no follow-up. I diagnose three buckets before anyone buys a new layout. No fake reviews, no magic percentages.',
    h1: 'Why a website does not sell: three buckets before you touch the layout',
    kicker: 'Diagnostics',
    lead:
      '“Make it prettier” is the most expensive hypothesis you can buy when a site does not sell. Before anyone opens Figma I split the problem into three buckets: the wrong traffic, the wrong path, the wrong handling after the click. Below is the procedure I use in the audit — not a recycled “12 UX sins” list and not invented case studies.',
    sections: [
      section(
        'Bucket 1: traffic that has no right to convert',
        p('If nobody arrives, the site has nothing to sell. That is not a layout problem. That is the channel: no name in Google, no referrals, a campaign on a query that pulls students, not owners. A redesign is theatre. First the source: where the last ten enquiries came from (if any), the cost per click, the query.'),
        p('Second variant: there is traffic, but the wrong kind. A “trends 2026” blog pulls the curious. A B2B offer needs budget and pain. You measure sessions, not enquiries — and conclude the “site does not sell”. It is badly aimed content, not the button. That is why a [B2B company website](/artykuly/strona-firmowa-b2b/) in my brochure package does not include an “SEO blog”.'),
        note('I do not quote an “average B2B CR from report X”; without your ICP it is decoration. In the audit I count your enquiries and your handling cost.'),
      ),
      section(
        'Bucket 2: a path that never reaches a decision',
        p('Warm traffic, empty inbox. Causes I actually see: an H1 about the company instead of the decision; no order of magnitude on price; five CTAs; a nine-field form; mailto on mobile; no proof — or worse, fake reviews that collapse when someone checks. I do not invent testimonials. If you have no live URL, we write process and terms.'),
        ul([
          'Is it clear in ten seconds who this is for?',
          'Can you send an enquiry with a thumb, without pinch-zoom?',
          'After submit, does someone get mail within a minute, not “we will check on Friday”?',
          'Do you measure submits, or only pageviews?',
        ]),
        p('This is often where you need a [funnel](/artykuly/lejek-konwersji-na-stronie/), not a new palette. Or the opposite: a funnel is overkill and you lack one clear offer. [Brochure versus funnel](/artykuly/strona-wizytowka-czy-lejek/) is a separate budget decision.'),
      ),
      section(
        'Bucket 3: follow-up a website cannot win',
        p('The form arrives, then silence: a PDF quote a week later, the salesperson on leave, an Excel of “new leads” nobody touches. The site “does not sell” because sales does not exist as a process. That is the edge of an operations panel, or at least notifications and a reply SLA. I do not treat that with a button gradient.'),
        p('At Mint the problem was not an “ugly site”. It was portal commission and hours on guest questions. The site started selling when a guest could book cheaper on the operator’s domain. At Plumm — when a sole trader stopped hopping between Excel and an accountant’s office. That is operations wired to an interface, not UX magic.'),
      ),
      section(
        'What I refuse when you ask to “boost sales”',
        ol([
          'I do not add fake testimonials.',
          'I do not promise a Google rank in 30 days.',
          'I do not redraw everything if analytics show 80% of drop-off is LCP or the wrong channel.',
          'I do not drop an AI chat on a brochure to “liven up” a missing offer.',
        ]),
        p('If after twenty minutes the ROI does not close, I say so. The [audit](/artykuly/audyt-strony-internetowej/) exists so you do not buy a build out of habit.'),
      ),
      section(
        'How I prove which bucket it is',
        p('I need: Search Console or at least enquiry sources for 90 days, a mobile recording (or I open it on a phone), the mail path after the form, reply time. Without that we guess. With it we can tell “nobody comes” from “they come and leave” from “they come, write, and die in the inbox”.'),
        p('Speed sits in bucket 2 but earns its own article: [website speed and SEO](/artykuly/szybkosc-strony-a-seo/). INP and LCP on a phone can kill paid traffic before the H1 promises anything. Do not confuse that with “we need more animation”.'),
      ),
      section(
        'After the diagnosis — one change, not twelve',
        p('There is one leading job: channel, path or follow-up. We ship that, measure two weeks, then add the next. Owners love 40-point checklists because they look like work. I like one metric: qualified enquiries or time to first reply. The rest is commentary.'),
      ),
    ],
    faqs: [
      {
        q: 'The site looks good and there are no enquiries. Is it SEO?',
        a: 'Not necessarily. I first check whether there is traffic and what kind. SEO can be guilty, but so can the offer or mailto on mobile.',
      },
      {
        q: 'Will a new layout raise sales?',
        a: 'Only if bucket 2 is the bottleneck and the layout truly blocks the decision. A “modern look” without changing CTA, price and measurement usually does nothing.',
      },
      {
        q: 'I need testimonials on the site. Can we add them?',
        a: 'Only real ones, with a name the client accepts, or a link to a live deployment. I will not write reviews for you.',
      },
      {
        q: 'How long does this diagnosis take?',
        a: 'Twenty minutes to start. If we must go into analytics and process — Audit Sprint PLN 2,500–6,000, creditable toward a build when it makes sense.',
      },
    ],
    ctaTitle: 'Name the bucket before you buy a redesign',
    ctaBody:
      'Twenty minutes is enough to say: channel, path or follow-up. Then, if needed, the [scope of work](/#oferta).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Чому сайт не продає — діагноз, не редизайн',
    description:
      'Чому сайт не продає: поганий трафік, поганий шлях або немає follow-up. Діагностую три відра, перш ніж хтось купить новий макет. Без фальшивих відгуків і магічних відсотків.',
    h1: 'Чому сайт не продає: три відра, перш ніж чіпати макет',
    kicker: 'Діагностика',
    lead:
      '«Зробімо гарніше» — найдорожча гіпотеза, яку можна купити, коли сайт не продає. Перш ніж хтось відкриє Figma, ділю проблему на три відра: не той трафік, не той шлях, не те обслуговування після кліка. Нижче процедура з аудиту — без списку «12 гріхів UX» і без вигаданих кейсів.',
    sections: [
      section(
        'Відро 1: трафік, який не має права конвертувати',
        p('Якщо ніхто не заходить, сайту немає що продавати. Це не проблема макета. Це канал: немає назви в Google, немає рекомендацій, кампанія на фразу, яка збирає студентів, не власників. Тоді редизайн — театр. Спочатку джерело: звідки останні десять запитів (якщо були), яка ціна кліка, яка фраза.'),
        p('Другий варіант: трафік є, але не той. Блоґ про «тренди 2026» тягне цікавих. Оферта B2B потребує бюджету й болю. Ви міряєте сесії, не запити — і робите висновок, що «сайт не продає». Продає погано націлений контент, не кнопка. Тому [корпоративний сайт B2B](/artykuly/strona-firmowa-b2b/) у моєму пакеті візитівки не включає блоґ «для SEO».'),
        note('Я не даю «середній CR для B2B зі звіту X» — без вашого ICP це прикраса. На аудиті рахую ваші запити і вашу вартість обслуговування.'),
      ),
      section(
        'Відро 2: шлях, який не закінчується рішенням',
        p('Трафік теплий, скринька порожня. Причини, які справді бачу: H1 про фірму замість про рішення; немає порядку величини ціни; п’ять CTA; форма з дев’ятьма полями; mailto на мобільному; немає доказу або — гірше — фальшиві відгуки, які падають, коли хтось перевірить. Я відгуків не вигадую. Якщо немає живого URL — пишемо процес і правила.'),
        ul([
          'Чи за 10 секунд зрозуміло, для кого це?',
          'Чи можна надіслати запит великим пальцем, без зуму?',
          'Чи після надсилання хтось отримує лист за хвилину, не «перевіримо в п’ятницю»?',
          'Чи міряєте надсилання, чи лише перегляди?',
        ]),
        p('Тут часто виходить, що потрібна [воронка](/artykuly/lejek-konwersji-na-stronie/), не нова палітра. Або навпаки: воронка — overkill, бракує однієї зрозумілої оферти. [Візитівка проти воронки](/artykuly/strona-wizytowka-czy-lejek/) — окреме бюджетне рішення.'),
      ),
      section(
        'Відро 3: follow-up, якого сайт не виграє',
        p('Форма доходить, далі тиша: оферта в PDF за тиждень, продавець у відпустці, Excel із «новими лідами», яких ніхто не чіпає. Сайт «не продає», бо продажу немає як процесу. Це вже межа операційної панелі або принаймні сповіщень і SLA відповіді. Я не лікую це градієнтом на кнопці.'),
        p('У Mint проблемою була не «недостатньо гарний сайт». Проблемою була комісія порталу й години на питаннях гостей. Сайт почав продавати, коли гість міг забронювати дешевше на власному домені. У Plumm — коли ФОП перестав стрибати між Excel і бюро. Це операція, підключена до інтерфейсу, не магія UX.'),
      ),
      section(
        'Чого не роблю, коли просите «прискорити продаж»',
        ol([
          'Не додаю фейкових відгуків.',
          'Не обіцяю позицію в Google за 30 днів.',
          'Не перемальовую все, якщо аналітика показує, що 80% відвалу — це LCP або поганий канал.',
          'Не ставлю чат ШІ на візитівку, щоб «оживити» відсутність оферти.',
        ]),
        p('Якщо за 20 хвилин видно, що ROI не сходиться, кажу це. [Аудит](/artykuly/audyt-strony-internetowej/) існує, щоб не купувати впровадження зі звички.'),
      ),
      section(
        'Як збираю доказ, що це справді те відро',
        p('Потрібні: Search Console або хоча б джерела запитів за 90 днів, запис mobile (або я відкриваю на телефоні), шлях листа після форми, час відповіді. Без цього вгадуємо. З цим можна відрізнити «ніхто не приходить» від «приходять і тікають» від «приходять, пишуть і гинуть у скриньці».'),
        p('Швидкість у відрі 2, але заслуговує окремого тексту: [швидкість сайту і SEO](/artykuly/szybkosc-strony-a-seo/). INP і LCP на телефоні можуть вбити платний трафік, перш ніж H1 встигне щось пообіцяти. Не плутайте це з «треба більше анімації».'),
      ),
      section(
        'Що робимо після діагнозу — одна зміна, не дванадцять',
        p('Виходить одне провідне завдання: канал, шлях або follow-up. Впроваджуємо це, міряємо два тижні, лише тоді додаємо наступне. Власники люблять чеклісти на 40 пунктів, бо вони виглядають як робота. Я люблю одну метрику: кількість кваліфікованих запитів або час до першої відповіді. Решта — коментар.'),
      ),
    ],
    faqs: [
      {
        q: 'Сайт гарний, запитів немає. Це точно SEO?',
        a: 'Не обов’язково. Спочатку перевіряю, чи є трафік і який. SEO буває винне, але так само винна оферта або mailto на мобільному.',
      },
      {
        q: 'Чи новий макет підніме продаж?',
        a: 'Лише якщо вузьке відро 2 і макет справді блокує рішення. Сам «сучасний вигляд» без зміни CTA, ціни й виміру зазвичай нічого не робить.',
      },
      {
        q: 'Потрібні відгуки клієнтів на сайті. Можна додати?',
        a: 'Лише справжні, з ім’ям, яке клієнт приймає, або посилання на живе впровадження. Я не пишу рецензії за вас.',
      },
      {
        q: 'Скільки триває така діагностика?',
        a: '20 хвилин на старт. Якщо треба зайти в аналітику й процес — Audit Sprint 2 500–6 000 злотих, із зарахуванням на впровадження, коли це має сенс.',
      },
    ],
    ctaTitle: 'Перш ніж купити редизайн, назвіть відро',
    ctaBody:
      '20 хвилин досить, щоб сказати: канал, шлях або follow-up. Потім за потреби [обсяг робіт](/#oferta).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
