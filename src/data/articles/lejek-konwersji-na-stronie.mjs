import { DATE, note, offerCennik, ol, p, section, table, ul } from './_blocks.mjs'

export default {
  slug: 'lejek-konwersji-na-stronie',
  keyword: 'lejek konwersji',
  keywordEn: 'conversion funnel on a website',
  keywordUk: 'воронка конверсії на сайті',
  intent: 'commercial',
  cluster: 'strony',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'dlaczego-strona-nie-sprzedaje', anchor: { pl: 'dlaczego strona nie sprzedaje, zanim zbudujesz lejek', en: 'why the site does not sell, before you build a funnel', uk: 'чому сайт не продає, перш ніж будувати воронку' } },
    { slug: 'strona-wizytowka-czy-lejek', anchor: { pl: 'wizytówka czy lejek — która cena', en: 'brochure or funnel — which price', uk: 'візитівка чи воронка — яка ціна' } },
    { slug: 'rezerwacje-na-wlasnej-stronie', anchor: { pl: 'rezerwacje na własnej stronie zamiast prowizji', en: 'direct bookings instead of portal commission', uk: 'бронювання на власному сайті замість комісії' } },
  ],
  offer: [offerCennik()],
  pl: {
    title: 'Lejek konwersji na stronie B2B: od ruchu do zapytania',
    description:
      'Lejek konwersji na stronie to ścieżka: intencja, kwalifikacja, jedno CTA i pomiar. Opisuję Conversion Build 25–60 tys. zł oraz żywy przykład rezerwacji Mint, bez fikcyjnych procentów.',
    h1: 'Lejek konwersji na stronie: od kliknięcia do zapytania, które da się obsłużyć',
    kicker: 'Conversion Build',
    lead:
      'Lejek konwersji to nie slajd TOFU/MOFU z agencji. To kolejność na stronie: kto wchodzi, co musi zrozumieć, jakie pole wypełnia i co dzieje się w ciągu pięciu minut po wysłaniu. Wdrażam to w pakiecie Conversion Build (25 000–60 000 zł), nie w wizytówce za 8 tysięcy. Poniżej mechanika, metryki i moment, w którym lejek jest overkill.',
    sections: [
      section(
        'Jedna konwersja, nie pięć równoległych celów',
        p('Zanim narysujesz lejek, nazwij zdarzenie: zapytanie kwalifikowane, rezerwacja, umówiony call. Jeśli strona jednocześnie zbiera newsletter, demo, PDF i „zadzwoń”, nie masz lejka — masz szwedzki stół. Ja zostawiam jedno główne CTA i jedno słabsze (mail). Reszta psuje [pomiar i diagnozę](/artykuly/dlaczego-strona-nie-sprzedaje/).'),
        p('W B2B konwersja rzadko jest zakupem w sesji. Jest zgodą na rozmowę. Formularz ma więc zbierać tyle, ile trzeba do kwalifikacji, i nic ponadto. Imię, firma, e-mail, jedno pytanie o wolumen. Dziewięć pól to podatek od niezdecydowania.'),
        ul([
          'Wejście z jasną intencją (oferta, landing kampanii, karta rezerwacji).',
          'Obietnica i rząd wielkości ceny w zasięgu pierwszego ekranu.',
          'Formularz albo kalendarz — jeden, nie oba walczące o uwagę.',
          'Powiadomienie do człowieka w minucie, nie „odpiszemy w piątek”.',
        ]),
      ),
      section(
        'Co jest w Conversion Build, a czego nie udaję wizytówką',
        table(
          ['Warstwa', 'Wizytówka 6,5–12 tys.', 'Lejek 25–60 tys.'],
          [
            ['Cel', 'Potwierdzić, że istniejesz', 'Zamknąć zdarzenie mierzalne'],
            ['Strony', 'Do 5', 'Struktura + landingi pod intencję'],
            ['Formularz', 'Kontakt', 'Kwalifikacja, routing, ewentualnie CRM'],
            ['Płatność / kalendarz', 'Nie', 'Tak, gdy to jest konwersja (np. rezerwacja)'],
            ['Pomiar', 'Liczba zapytań', 'Ścieżka od źródła do zdarzenia'],
          ],
        ),
        p('Jeśli budżet jest 12 tysięcy, a celem rezerwacja online, nie „dociągam lejka”. Mówię, że pakiet się nie spina. [Wizytówka kontra lejek](/artykuly/strona-wizytowka-czy-lejek/) jest decyzją budżetową, nie gustem wizualnym.'),
      ),
      section(
        'Przykład, który da się kliknąć: rezerwacja zamiast teorii',
        p('[Mint Apartments](https://mintapartments.pl) jest lejkiem operacyjnym, nie artykułem o awareness. Gość widzi termin i cenę na żywo, płaci na domenie operatora, dostaje kod do zamka. Szacunek: 10–15% taniej niż na portalu*. To nie jest case „wzrost CR o 347%”. To URL i mechanika. iDrive nie jest live — nie używam go jako dowodu.'),
        note('*Szacunki orientacyjne, zależą od wolumenu i sezonu. Na audycie liczę Twój kanał, nie średnią z bloga o lejkach.'),
        p('Gdybyśmy zostawili ładną stronę noclegową bez kalendarza, lejek kończyłby się na Booking.com. Dlatego lejek konwersji na stronie bywa tożsamy z decyzją produktową: czy transakcja ma prawo wydarzyć się u Ciebie.'),
      ),
      section(
        'Kwalifikacja, której nie załatwi ChatGPT w widgetcie',
        p('Widget czatu na wizytówce nie jest lejkiem. Jest miejscem, w którym model zgaduje, a Ty nie masz zapisu, kto obiecał rabat. Jeśli automatyzujesz odpowiedzi, robię to z listą dozwolonych akcji i eskalacją — opisane przy [HITL](/artykuly/wdrozyc-chatgpt-w-firmie/). Na lejku B2B najpierw formularz i człowiek, potem ewentualnie asystent z limitami.'),
        ol([
          'Zdarzenie nazwane i zliczane.',
          'Pola, które sprzedawca naprawdę czyta.',
          'SLA odpowiedzi (u mnie: dzień roboczy na mail, minuty na powiadomienie z formularza).',
          'Dopiero potem automatyzacja powtarzalnych pytań.',
        ]),
      ),
      section(
        'Metryki, których nie zmyślam',
        p('Po starcie porównuję „przed/po”: liczba zapytań, czas do pierwszej odpowiedzi, odsetek śmieci. Nie publikuję branżowego benchmarku CR, bo bez Twojego ICP to ozdoba. Jeśli po dwóch tygodniach zdarzeń nie ma, wracamy do wiader: kanał, ścieżka, follow-up — nie do nowej palety kolorów.'),
        p('SEO treściowe (klastry, artykuły) zasila górę lejka, ale nie zastępuje CTA. Ten dziennik jest osobnym ruchem; pakiet strony firmowej go nie obejmuje. Lejek płatny bez pomiaru to palenie budżetu.'),
      ),
      section(
        'Kiedy lejek jest za duży',
        p('Dwa telefony z polecenia w miesiącu, zero reklam, jasna usługa: wystarczy [strona firmowa B2B](/artykuly/strona-firmowa-b2b/). Lejek 40 tysięcy przy trzech zapytaniach rocznie to honorarium za niespokojne sumienie, nie za ROI. Na 20 minutach audytu wolę powiedzieć „nie wdrażaj” niż sprzedać silnik bez paliwa.'),
      ),
    ],
    faqs: [
      { q: 'Czy lejek konwersji wymaga Google Ads?', a: 'Nie. Ads są paliwem. Lejek to ścieżka na stronie i obsługa zdarzenia. Możesz mieć organiczny ruch i nadal potrzebować kwalifikacji.' },
      { q: 'Ile trwa wdrożenie lejka?', a: 'Typowo 6–12 tygodni, zależnie od integracji (płatności, kalendarz, CRM). Wizytówka to 2–4 tygodnie — inny produkt.' },
      { q: 'Czy blog jest częścią lejka?', a: 'Może zasilać górę, ale nie jest w cenie Conversion Build automatycznie. Crawlable artykuły planujemy osobno, nie jako hash w SPA.' },
      { q: 'Jak liczycie sukces?', a: 'Zdarzeniem nazwanym na audycie: zapytanie, rezerwacja albo call. Nie slajdem z procentem bez mianownika.' },
    ],
    ctaTitle: 'Nazwijmy zdarzenie, zanim narysujemy lejek',
    ctaBody: '20 minut: czy Conversion Build ma prawo się spiąć, czy wystarczy wizytówka. Widełki w [cenniku](/#cennik).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'A B2B conversion funnel: from visit to a real enquiry',
    description:
      'A conversion funnel on a site is intent, qualification, one CTA and measurement. I describe Conversion Build at PLN 25–60k and Mint booking as live proof — no invented conversion rates.',
    h1: 'A conversion funnel on the site: from click to an enquiry you can handle',
    kicker: 'Conversion Build',
    lead:
      'A conversion funnel is not a TOFU/MOFU slide. It is order on the page: who arrives, what they must understand, which field they complete, and what happens in the five minutes after submit. I ship that as Conversion Build (PLN 25,000–60,000), not inside an PLN 8k brochure. Below: mechanics, metrics, and when a funnel is overkill.',
    sections: [
      section(
        'One conversion, not five parallel goals',
        p('Before you draw a funnel, name the event: a qualified enquiry, a booking, a booked call. If the site also hunts a newsletter, a demo, a PDF and “call us”, you do not have a funnel — you have a buffet. I keep one primary CTA and one weaker one (email). The rest wrecks [measurement and diagnosis](/artykuly/dlaczego-strona-nie-sprzedaje/).'),
        p('In B2B the conversion is rarely a same-session purchase. It is consent to talk. The form should collect what qualification needs, nothing more. Name, company, email, one volume question. Nine fields are a tax on indecision.'),
        ul([
          'An entry with clear intent (offer, campaign landing, booking card).',
          'A promise and a price order of magnitude on the first screen.',
          'A form or a calendar — one, not both fighting for attention.',
          'A human notification within a minute, not “we will reply on Friday”.',
        ]),
      ),
      section(
        'What Conversion Build includes, and what a brochure cannot fake',
        table(
          ['Layer', 'Brochure 6.5–12k', 'Funnel 25–60k'],
          [
            ['Goal', 'Prove you exist', 'Close a measurable event'],
            ['Pages', 'Up to 5', 'IA + landings per intent'],
            ['Form', 'Contact', 'Qualification, routing, maybe CRM'],
            ['Pay / calendar', 'No', 'Yes when that is the conversion'],
            ['Measurement', 'Enquiry count', 'Path from source to event'],
          ],
        ),
        p('If the budget is 12k and the goal is online booking, I do not “stretch a funnel”. I say the package does not close. [Brochure versus funnel](/artykuly/strona-wizytowka-czy-lejek/) is a budget decision, not a visual taste.'),
      ),
      section(
        'A clickable example: booking instead of theory',
        p('[Mint Apartments](https://mintapartments.pl) is an operational funnel, not an awareness essay. The guest sees a live date and price, pays on the operator’s domain, gets a lock code. Estimate: 10–15% cheaper than the portal*. This is not a “+347% CR” case. It is a URL and a mechanic. iDrive is not live — I do not use it as proof.'),
        note('*Directional estimates, volume and season apply. In the audit I count your channel, not a funnel-blog average.'),
        p('A pretty lodging site without a calendar would end the funnel on Booking.com. So a conversion funnel on the site is often a product decision: whether the transaction is allowed to happen with you.'),
      ),
      section(
        'Qualification a ChatGPT widget will not fix',
        p('A chat widget on a brochure is not a funnel. It is a place where the model guesses and you have no log of who promised a discount. If we automate replies, I do it with allowed actions and escalation — covered in [HITL versus ChatGPT](/artykuly/wdrozyc-chatgpt-w-firmie/). On a B2B funnel: form and human first, then maybe an assistant with limits.'),
        ol([
          'A named, counted event.',
          'Fields a salesperson actually reads.',
          'A reply SLA (I answer mail in one business day; form notifications in minutes).',
          'Only then automation of repetitive questions.',
        ]),
      ),
      section(
        'Metrics I will not invent',
        p('After launch I compare before/after: enquiry count, time to first reply, junk rate. I do not publish an industry CR benchmark; without your ICP it is decoration. If after two weeks there is no event, we return to the buckets: channel, path, follow-up — not a new colour palette.'),
        p('Editorial SEO (clusters, articles) can feed the top of the funnel; it does not replace a CTA. This journal is a separate stream; the company-site package does not include it. A paid funnel without measurement is burning budget.'),
      ),
      section(
        'When a funnel is too big',
        p('Two referral calls a month, no ads, one clear service: a [B2B company website](/artykuly/strona-firmowa-b2b/) is enough. A 40k funnel for three enquiries a year is a fee for a guilty conscience, not for ROI. In twenty minutes I would rather say “do not ship” than sell an engine without fuel.'),
      ),
    ],
    faqs: [
      { q: 'Does a conversion funnel require Google Ads?', a: 'No. Ads are fuel. The funnel is the on-site path and how you handle the event. You can have organic traffic and still need qualification.' },
      { q: 'How long does a funnel take to ship?', a: 'Typically 6–12 weeks, depending on integrations (payments, calendar, CRM). A brochure is 2–4 weeks — a different product.' },
      { q: 'Is a blog part of the funnel?', a: 'It can feed the top, but it is not automatic inside Conversion Build. Crawlable articles are planned separately, not as a hash in an SPA.' },
      { q: 'How do you count success?', a: 'The event named in the audit: enquiry, booking or call. Not a slide with a percentage and no denominator.' },
    ],
    ctaTitle: 'Name the event before we draw the funnel',
    ctaBody: 'Twenty minutes: whether Conversion Build can close, or a brochure is enough. Ranges in [pricing](/#cennik).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Воронка конверсії на сайті B2B: від візиту до запиту',
    description:
      'Воронка конверсії на сайті — це намір, кваліфікація, одне CTA і вимір. Описую Conversion Build 25–60 тис. злотих і живий приклад бронювання Mint, без вигаданих відсотків.',
    h1: 'Воронка конверсії на сайті: від кліка до запиту, який можна обслужити',
    kicker: 'Conversion Build',
    lead:
      'Воронка конверсії — не слайд TOFU/MOFU. Це порядок на сторінці: хто заходить, що має зрозуміти, яке поле заповнює і що стається за п’ять хвилин після надсилання. Впроваджую це в пакеті Conversion Build (25 000–60 000 злотих), не у візитівці за 8 тисяч. Нижче механіка, метрики і момент, коли воронка — overkill.',
    sections: [
      section(
        'Одна конверсія, не п’ять паралельних цілей',
        p('Перш ніж малювати воронку, назвіть подію: кваліфікований запит, бронювання, узгоджений дзвінок. Якщо сайт одночасно збирає розсилку, демо, PDF і «зателефонуйте», у вас не воронка — шведський стіл. Я лишаю одне головне CTA і одне слабше (пошта). Решта псує [вимір і діагноз](/artykuly/dlaczego-strona-nie-sprzedaje/).'),
        p('У B2B конверсія рідко є купівлею в сесії. Це згода на розмову. Форма має збирати стільки, скільки треба для кваліфікації, і нічого більше. Ім’я, фірма, e-mail, одне питання про обсяг. Дев’ять полів — податок на нерішучість.'),
        ul([
          'Вхід із зрозумілим наміром (оферта, лендінг кампанії, картка бронювання).',
          'Обіцянка і порядок величини ціни на першому екрані.',
          'Форма або календар — один, не обидва, що б’ються за увагу.',
          'Сповіщення людині за хвилину, не «відпишемо в п’ятницю».',
        ]),
      ),
      section(
        'Що в Conversion Build, а чого не імітую візитівкою',
        table(
          ['Шар', 'Візитівка 6,5–12 тис.', 'Воронка 25–60 тис.'],
          [
            ['Ціль', 'Підтвердити, що ви існуєте', 'Закрити вимірювану подію'],
            ['Сторінки', 'До 5', 'Структура + лендінги під намір'],
            ['Форма', 'Контакт', 'Кваліфікація, маршрутизація, інколи CRM'],
            ['Оплата / календар', 'Ні', 'Так, якщо це і є конверсія'],
            ['Вимір', 'Кількість запитів', 'Шлях від джерела до події'],
          ],
        ),
        p('Якщо бюджет 12 тисяч, а ціль — онлайн-бронювання, я не «донатягую воронку». Кажу, що пакет не сходиться. [Візитівка проти воронки](/artykuly/strona-wizytowka-czy-lejek/) — бюджетне рішення, не смак до макета.'),
      ),
      section(
        'Приклад, який можна клікнути: бронювання замість теорії',
        p('[Mint Apartments](https://mintapartments.pl) — операційна воронка, не текст про awareness. Гість бачить дату й ціну наживо, платить на домені оператора, отримує код до замка. Оцінка: на 10–15% дешевше, ніж на порталі*. Це не кейс «+347% CR». Це URL і механіка. iDrive не в продакшені — не використовую його як доказ.'),
        note('*Орієнтовні оцінки, залежать від обсягу й сезону. На аудиті рахую ваш канал, не середнє з блогу про воронки.'),
        p('Гарний сайт ночівлі без календаря закінчив би воронку на Booking.com. Тому воронка конверсії на сайті часто тотожна продуктовому рішенню: чи транзакція має право статися у вас.'),
      ),
      section(
        'Кваліфікація, якої не закриє віджет ChatGPT',
        p('Віджет чату на візитівці — не воронка. Це місце, де модель здогадується, а у вас немає запису, хто пообіцяв знижку. Якщо автоматизуємо відповіді, роблю це зі списком дозволених дій і ескалацією — у тексті про [HITL](/artykuly/wdrozyc-chatgpt-w-firmie/). На воронці B2B спочатку форма й людина, потім можливо асистент з лімітами.'),
        ol([
          'Названа й полічена подія.',
          'Поля, які продавець справді читає.',
          'SLA відповіді (у мене: робочий день на лист, хвилини на сповіщення з форми).',
          'Лише тоді автоматизація повторюваних питань.',
        ]),
      ),
      section(
        'Метрики, яких не вигадую',
        p('Після старту порівнюю «до/після»: кількість запитів, час до першої відповіді, частка сміття. Не публікую галузевий бенчмарк CR — без вашого ICP це прикраса. Якщо за два тижні подій немає, повертаємось до відер: канал, шлях, follow-up — не до нової палітри.'),
        p('SEO-контент (кластери, статті) живить верх воронки, але не замінює CTA. Цей журнал — окремий потік; пакет корпоративного сайту його не охоплює. Платна воронка без виміру — спалювання бюджету.'),
      ),
      section(
        'Коли воронка завелика',
        p('Два дзвінки з рекомендації на місяць, нуль реклами, зрозуміла послуга: досить [корпоративного сайту B2B](/artykuly/strona-firmowa-b2b/). Воронка за 40 тисяч при трьох запитах на рік — гонорар за неспокійне сумління, не за ROI. За 20 хвилин аудиту краще сказати «не впроваджуйте», ніж продати двигун без пального.'),
      ),
    ],
    faqs: [
      { q: 'Чи воронка конверсії потребує Google Ads?', a: 'Ні. Ads — пальне. Воронка — шлях на сайті й обробка події. Можна мати органічний трафік і все одно потребувати кваліфікації.' },
      { q: 'Скільки триває впровадження воронки?', a: 'Типово 6–12 тижнів, залежно від інтеграцій (платежі, календар, CRM). Візитівка — 2–4 тижні: інший продукт.' },
      { q: 'Чи блоґ є частиною воронки?', a: 'Може живити верх, але не входить в Conversion Build автоматично. Crawlable статті плануємо окремо, не як хеш у SPA.' },
      { q: 'Як рахуєте успіх?', a: 'Подією, названою на аудиті: запит, бронювання або дзвінок. Не слайдом із відсотком без знаменника.' },
    ],
    ctaTitle: 'Назвімо подію, перш ніж малювати воронку',
    ctaBody: '20 хвилин: чи Conversion Build має право зійтися, чи досить візитівки. Вилки в [цінах](/#cennik).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
