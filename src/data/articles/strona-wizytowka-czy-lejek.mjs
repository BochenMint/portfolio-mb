import { DATE, note, offerCennik, ol, p, section, table, ul } from './_blocks.mjs'

export default {
  slug: 'strona-wizytowka-czy-lejek',
  keyword: 'strona wizytówka czy sprzedażowa',
  keywordEn: 'brochure website vs conversion website',
  keywordUk: 'сайт-візитівка чи продажевий сайт',
  intent: 'commercial',
  cluster: 'strony',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'ile-kosztuje-strona-firmowa', anchor: { pl: 'ile kosztuje strona firmowa w obu pakietach', en: 'what each package actually costs', uk: 'скільки коштує сайт у обох пакетах' } },
    { slug: 'lejek-konwersji-na-stronie', anchor: { pl: 'jak działa lejek konwersji na stronie', en: 'how a conversion funnel works on a site', uk: 'як працює воронка конверсії на сайті' } },
    { slug: 'strona-firmowa-b2b', anchor: { pl: 'zakres strony firmowej B2B', en: 'B2B company website scope', uk: 'обсяг корпоративного сайту B2B' } },
  ],
  offer: [offerCennik()],
  pl: {
    title: 'Wizytówka czy lejek: która strona firmowa ma sens?',
    description:
      'Wizytówka Start (od 2 000 zł) zbiera zapytania od ciepłego ruchu. Lejek Launch (od 8 000 zł) sprzedaje i kwalifikuje. Piszę, kiedy który pakiet ma prawo się spiąć.',
    h1: 'Wizytówka czy lejek: która strona firmowa ma sens w Twoim budżecie',
    kicker: 'Decyzja pakietu',
    lead:
      'Większość rozczarowań nie bierze się z „brzydkiego layoutu”. Bierze się z zakupu wizytówki, gdy potrzebny był lejek — albo lejka, gdy wystarczał formularz. Rozróżniam to twardo: pakiet Start od 2 000 zł versus pakiet Launch od 8 000 zł. Poniżej kryteria, nie quiz osobowości.',
    sections: [
      section(
        'Wizytówka: strona dla kogoś, kto już do Ciebie idzie',
        p('Wizytówka działa, gdy źródłem jest polecenie, LinkedIn, wizytówka Google albo branża, w której klient i tak Cię znajdzie. Jej zadanie: potwierdzić, że jesteś poważny, pokazać zakres i dać jeden sposób kontaktu. To [strona firmowa B2B](/artykuly/strona-firmowa-b2b/) do pięciu podstron, nie silnik sprzedaży.'),
        p('Nie obiecuję, że wizytówka „pozycjonuje Cię na pierwsze miejsce”. Obiecuję, że po wpisaniu nazwy firmy w Google ktoś zobaczy ofertę, nie parking albo Facebooka z 2014. Jeśli nie masz nazwy w ogóle wyszukiwanej, najpierw kanał, nie kolor przycisku.'),
        ul([
          'Jedno CTA: formularz albo 20-minutowy audyt.',
          'Cena albo widełki w zasięgu wzroku.',
          'Dowód, który da się kliknąć — albo świadomy brak, zamiast fałszywych gwiazdek.',
          'Mobile, które nie gubi pola „wyślij”.',
        ]),
      ),
      section(
        'Lejek: strona, która musi odzyskać koszt kliknięcia',
        p('Lejek zaczyna się, gdy płacisz za uwagę albo gdy decyzja wymaga więcej niż „napisz maila”. Kwalifikacja (ile apartamentów, jaki wolumen faktur, jaki budżet), landing pod konkretną kampanię, pomiar od kliknięcia do zapytania — to pakiet Launch (od 8 000 zł). Rezerwacja na własnej domenie to już Platforma (od 25 000 zł), nie „rozszerzona wizytówka”.'),
        p('Żywy przykład: [Mint Apartments](https://mintapartments.pl). Gość porównuje cenę z Booking.com. Jeśli strona tylko opowiada o apartamentach, rezerwacja i tak spadnie na portal. Lejek to kalendarz na żywo, tańsza noc na własnej domenie, kod do zamka. Tego nie wsadzisz w 8 tysięcy bez kłamstwa o zakresie.'),
        note('Nie mam publicznego case’u „+347% konwersji”. Mam działający serwis i mechanikę, którą klikniesz. Jeśli ktoś sprzedaje lejek samymi procentami bez URL-a — to slajd.'),
      ),
      section(
        'Tabela decyzji, której używam na audycie',
        table(
          ['Sytuacja', 'Wizytówka 6,5–12 tys.', 'Lejek 25–60 tys.'],
          [
            ['Ruch', 'Ciepły, niski wolumen', 'Płatny albo sezonowy, trzeba konwertować'],
            ['Oferta', 'Jedna usługa, jasna', 'Wiele wariantów, trzeba kwalifikować'],
            ['Operacje po zapytaniu', 'Odpisujesz sam', 'Zespół tonie w mailach / WhatsApp'],
            ['Płatność', 'Przelew po umowie', 'Online, kalendarz, zaliczka'],
            ['Ryzyko złego wyboru', 'Za duża strona, za mało zapytań', 'Wizytówka spalająca budżet reklam'],
          ],
        ),
        p('Jeśli w trzech wierszach wychodzi „lejek”, a budżet jest 10 tys., nie robię „mini-lejka”. Mówię, że nie wdrażamy albo odkładamy, aż liczby się spinają. Mini-lejek to zwykle wizytówka z ukrytymi kosztami.'),
      ),
      section(
        'Najczęstszy błąd: kupić lejek oczami, zapłacić jak za wizytówkę',
        p('Brief: „chcemy rezerwacje, AI, bloga, trzy języki i sklep, budżet 9 000”. To nie jest ambitny klient. To niespójny zakres. Albo tniemy do wizytówki Start i planujemy rozbudowę, albo idziemy w Platformę (od 25 000 zł). Mieszanka kończy się stroną, która udaje wszystko i nie mierzy niczego.'),
        ol([
          'Nazwij jedną konwersję: zapytanie / rezerwacja / call.',
          'Sprawdź, czy da się ją zmierzyć w tydzień po starcie.',
          'Dopiero potem dokładaj języki, bloga, asystenta.',
        ]),
        p('Asystent dla gości i HITL to osobna warstwa — nie ozdoba wizytówki. Opisałem to przy [wdrażaniu ChatGPT](/artykuly/wdrozyc-chatgpt-w-firmie/). Na stronie firmowej wystarczy człowiek po drugiej stronie formularza.'),
      ),
      section(
        'Kiedy wizytówka jest właściwym, nie „wstydliwym” wyborem',
        p('Mała kancelaria, warsztat, JDG usługowe, freelancer z poleceń: wizytówka jest profesjonalnym narzędziem, nie porażką. Wstydem jest udawanie lejka bez budżetu na treść, pomiar i follow-up. Wolę pięć jasnych podstron niż „platformę”, której nikt nie ogarnie po odbiorze.'),
        p('Jak taka wizytówka wygląda, kiedy jest zrobiona pod jeden zawód, a nie pod wszystkich naraz, widać na [stronach dla branż](/branze) — pracownia projektowa i ekipa wykonawcza dostają dwie różne strony, choć obie „pokazują realizacje”.'),
        p('Rozbudowę planuję od początku: ten sam stack, te same URL-e, bez przepisania za rok, bo „teraz chcemy rezerwacje”. Jeśli wiesz, że za dwa sezony wejdziesz w płatny ruch, mówię to na starcie — nawet jeśli dziś płacisz za wizytówkę.'),
      ),
      section(
        'Jak to zamykamy w 20 minut',
        p('Nie robię warsztatu z personami. Pytam o źródło zapytań, koszt pozyskania, co się dzieje po mailu i czy jest kalendarz w Excelu. Potem jedna rekomendacja. Szczegóły pieniędzy: [ile kosztuje strona firmowa](/artykuly/ile-kosztuje-strona-firmowa/). Szczegóły lejka: osobny artykuł w tym klastrze.'),
      ),
    ],
    faqs: [
      {
        q: 'Czy mogę zacząć od wizytówki i „dorobić lejek”?',
        a: 'Tak, jeśli stack i IA na to pozwalają. Planuję to na audycie. Nie dorabiam lejka do motywu WordPress, którego nie utrzymuję.',
      },
      {
        q: 'Czy lejek zawsze oznacza reklamy Google?',
        a: 'Nie. Lejek to ścieżka na stronie: kwalifikacja, rezerwacja, pomiar. Reklama jest paliwem, nie definicją.',
      },
      {
        q: 'Mam 15 tys. zł. Co wybieramy?',
        a: 'Zwykle wizytówkę Start z zapasem na treść i pomiar — albo czekamy na budżet Launch/Platforma. 15 tys. „połowicznego lejka” jest najgorszym kompromisem.',
      },
      {
        q: 'Czy Mint to wizytówka?',
        a: 'Nie. To serwis z rezerwacją na własnej domenie i operacją wokół gościa. Inny pakiet, inna cena, inny cel.',
      },
    ],
    ctaTitle: 'Jedna rekomendacja pakietu, nie trzy oferty',
    ctaBody:
      'Na audycie powiem: Start, Launch, Platforma albo odłóż. Widełki są w [cenniku](/#cennik).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'Brochure or funnel: which company site fits the budget',
    description:
      'A brochure at the Start price (from PLN 2,000) collects warm enquiries. A funnel at the Launch price (from PLN 8,000) sells and qualifies. I write when each package has a right to pay back.',
    h1: 'Brochure or funnel: which company website fits your budget',
    kicker: 'Package decision',
    lead:
      'Most disappointment is not an ugly layout. It is buying a brochure when you needed a funnel — or a funnel when a form would do. I split it hard: the Start package from PLN 2,000 versus the Launch package from PLN 8,000. Criteria below, not a personality quiz.',
    sections: [
      section(
        'A brochure: a site for people already walking toward you',
        p('A brochure works when the source is a referral, LinkedIn, a Google Business Profile, or a trade where the client will find you anyway. Its job: confirm you are serious, show scope, give one way to contact. That is a [B2B company website](/artykuly/strona-firmowa-b2b/) of up to five pages, not a sales engine.'),
        p('I do not promise it “ranks you first”. I promise that after someone types your name, they see an offer, not a parking page or a 2014 Facebook. If your name is not searched at all, fix the channel before the button colour.'),
        ul([
          'One CTA: a form or a 20-minute audit.',
          'A price or a range in sight.',
          'Proof you can click — or an honest absence, not fake stars.',
          'Mobile that does not lose the submit field.',
        ]),
      ),
      section(
        'A funnel: a site that must earn back the cost of a click',
        p('A funnel starts when you pay for attention or the decision needs more than “send an email”. Qualification (how many apartments, what invoice volume, what budget), a landing for a specific campaign, measurement from click to enquiry — that is the Launch package (from PLN 8,000). Booking on your domain is already Platform (from PLN 25,000), not an “extended brochure”.'),
        p('A live example: [Mint Apartments](https://mintapartments.pl). The guest compares the price with Booking.com. If the site only tells stories, the booking still lands on the portal. The funnel is a live calendar, a cheaper night on your domain, a lock code. You cannot stuff that into PLN 8,000 without lying about scope.'),
        note('I do not have a public “+347% conversion” case. I have a working site and a mechanic you can click. If someone sells a funnel with percentages and no URL, that is a slide.'),
      ),
      section(
        'The decision table I use in the audit',
        table(
          ['Situation', 'Brochure 6.5–12k', 'Funnel 25–60k'],
          [
            ['Traffic', 'Warm, low volume', 'Paid or seasonal; it must convert'],
            ['Offer', 'One clear service', 'Many variants; you must qualify'],
            ['After the enquiry', 'You answer yourself', 'The team drowns in mail / WhatsApp'],
            ['Payment', 'Transfer after a contract', 'Online, calendar, deposit'],
            ['Cost of a wrong pick', 'Too much site, too few enquiries', 'A brochure burning the ad budget'],
          ],
        ),
        p('If three rows say “funnel” and the budget is 10k, I do not build a “mini-funnel”. I say we do not ship, or we wait until the numbers close. A mini-funnel is usually a brochure with hidden costs.'),
      ),
      section(
        'The usual mistake: buy a funnel with your eyes, pay for a brochure',
        p('Brief: “we want booking, AI, a blog, three languages and a shop, budget PLN 9,000”. That is not an ambitious client. That is an incoherent scope. Either we cut to a Start brochure and plan the expansion, or we go Platform (from PLN 25,000). The blend ends as a site that pretends everything and measures nothing.'),
        ol([
          'Name one conversion: enquiry / booking / call.',
          'Check whether you can measure it a week after launch.',
          'Only then add languages, a blog, an assistant.',
        ]),
        p('A guest assistant and HITL are a separate layer — not brochure decoration. I cover that in [implementing ChatGPT](/artykuly/wdrozyc-chatgpt-w-firmie/). On a company site, a human on the other side of the form is enough.'),
      ),
      section(
        'When a brochure is the right choice, not a shameful one',
        p('A small law firm, a workshop, a service sole trader, a freelancer living on referrals: a brochure is a professional tool, not a failure. Shame is faking a funnel without budget for copy, measurement and follow-up. I prefer five clear pages to a “platform” nobody can run after handover.'),
        p('I plan the expansion from day one: same stack, same URLs, no rewrite next year because “now we want booking”. If you know paid traffic is two seasons away, I say so at the start — even if you pay for a brochure today.'),
      ),
      section(
        'How we close this in 20 minutes',
        p('I do not run a persona workshop. I ask about enquiry sources, acquisition cost, what happens after the email, and whether the calendar lives in Excel. Then one recommendation. Money detail: [what a company website costs](/artykuly/ile-kosztuje-strona-firmowa/). Funnel detail: the next article in this cluster.'),
      ),
    ],
    faqs: [
      {
        q: 'Can I start with a brochure and “add a funnel later”?',
        a: 'Yes, if the stack and IA allow it. I plan that in the audit. I do not bolt a funnel onto a WordPress theme I will not maintain.',
      },
      {
        q: 'Does a funnel always mean Google Ads?',
        a: 'No. A funnel is the path on the site: qualification, booking, measurement. Ads are fuel, not the definition.',
      },
      {
        q: 'I have PLN 15,000. What do we pick?',
        a: 'Usually a Start brochure with room for copy and measurement — or we wait for a Launch/Platform budget. 15k of a “half funnel” is the worst compromise.',
      },
      {
        q: 'Is Mint a brochure?',
        a: 'No. It is a service with on-domain booking and guest operations. Different package, different price, different goal.',
      },
    ],
    ctaTitle: 'One package recommendation, not three quotes',
    ctaBody:
      'In the audit I will say: Start, Launch, Platform, or wait. Ranges are in [pricing](/#cennik).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Візитівка чи воронка: який сайт компанії має сенс',
    description:
      'Візитівка Start (від 2 000 злотих) збирає запити з теплого трафіку. Воронка Launch (від 8 000) продає й кваліфікує. Пишу, коли який пакет має право окупитися.',
    h1: 'Візитівка чи воронка: який корпоративний сайт пасує до бюджету',
    kicker: 'Рішення пакета',
    lead:
      'Більшість розчарувань — не «поганий макет». Це купівля візитівки, коли потрібна була воронка — або воронки, коли вистачило б форми. Я розділяю це жорстко: пакет Start від 2 000 проти пакета Launch від 8 000. Нижче критерії, не тест особистості.',
    sections: [
      section(
        'Візитівка: сайт для тих, хто вже йде до вас',
        p('Візитівка працює, коли джерело — рекомендація, LinkedIn, профіль Google або галузь, де клієнт і так вас знайде. Завдання: підтвердити, що ви серйозні, показати обсяг і дати один спосіб контакту. Це [корпоративний сайт B2B](/artykuly/strona-firmowa-b2b/) до п’яти сторінок, не двигун продажу.'),
        p('Я не обіцяю, що візитівка «виведе вас на перше місце». Обіцяю, що після введення назви фірми в Google людина побачить оферту, не паркінг або Facebook 2014. Якщо назву взагалі не шукають — спочатку канал, не колір кнопки.'),
        ul([
          'Одне CTA: форма або 20-хвилинний аудит.',
          'Ціна або вилка в полі зору.',
          'Доказ, який можна клікнути — або свідома відсутність замість фальшивих зірок.',
          'Мобільна версія, яка не губить поле «надіслати».',
        ]),
      ),
      section(
        'Воронка: сайт, який має повернути вартість кліка',
        p('Воронка починається, коли ви платите за увагу або коли рішення потребує більше, ніж «напишіть листа». Кваліфікація (скільки апартаментів, який обсяг рахунків, який бюджет), лендінг під кампанію, вимір від кліка до запиту — це пакет Launch (від 8 000). Бронювання на власному домені — це вже Платформа (від 25 000), не «розширена візитівка».'),
        p('Живий приклад: [Mint Apartments](https://mintapartments.pl). Гість порівнює ціну з Booking.com. Якщо сайт лише розповідає про апартаменти, бронювання все одно впаде на портал. Воронка — календар наживо, дешевша ніч на вашому домені, код до замка. Цього не запихнете в 8 тисяч без брехні про обсяг.'),
        note('У мене немає публічного кейсу «+347% конверсії». Є робочий сервіс і механіка, яку можна клікнути. Якщо хтось продає воронку самими відсотками без URL — це слайд.'),
      ),
      section(
        'Таблиця рішення, якою користуюся на аудиті',
        table(
          ['Ситуація', 'Візитівка 6,5–12 тис.', 'Воронка 25–60 тис.'],
          [
            ['Трафік', 'Теплий, малий обсяг', 'Платний або сезонний, треба конвертувати'],
            ['Оферта', 'Одна послуга, зрозуміла', 'Багато варіантів, треба кваліфікувати'],
            ['Після запиту', 'Відповідаєте самі', 'Команда тоне в пошті / WhatsApp'],
            ['Оплата', 'Переказ після договору', 'Онлайн, календар, завдаток'],
            ['Ризик поганого вибору', 'Завеликий сайт, замало запитів', 'Візитівка, що спалює рекламний бюджет'],
          ],
        ),
        p('Якщо в трьох рядках виходить «воронка», а бюджет 10 тис., я не роблю «міні-воронку». Кажу, що не впроваджуємо або чекаємо, доки зійдуться цифри. Міні-воронка — зазвичай візитівка з прихованими витратами.'),
      ),
      section(
        'Найчастіша помилка: купити воронку очима, заплатити як за візитівку',
        p('Бриф: «хочемо бронювання, ШІ, блоґ, три мови й магазин, бюджет 9 000». Це не амбітний клієнт. Це незв’язний обсяг. Або ріжемо до візитівки Start і плануємо розвиток, або йдемо в Платформу (від 25 000). Суміш закінчується сайтом, який удає все і не вимірює нічого.'),
        ol([
          'Назвіть одну конверсію: запит / бронювання / дзвінок.',
          'Перевірте, чи її можна виміряти за тиждень після старту.',
          'Лише тоді додавайте мови, блоґ, асистента.',
        ]),
        p('Асистент для гостей і HITL — окремий шар, не прикраса візитівки. Про це — у тексті про [впровадження ChatGPT](/artykuly/wdrozyc-chatgpt-w-firmie/). На корпоративному сайті досить людини по той бік форми.'),
      ),
      section(
        'Коли візитівка — правильний, а не «соромний» вибір',
        p('Мала канцелярія, майстерня, ФОП послуг, фрилансер із рекомендацій: візитівка — професійний інструмент, не поразка. Сором — удавати воронку без бюджету на текст, вимір і follow-up. Краще п’ять зрозумілих сторінок, ніж «платформа», з якою ніхто не впорається після здачі.'),
        p('Розвиток планую з початку: той самий стек, ті самі URL, без переписування за рік, бо «тепер хочемо бронювання». Якщо знаєте, що за два сезони зайдете в платний трафік, кажу це на старті — навіть якщо сьогодні платите за візитівку.'),
      ),
      section(
        'Як це закриваємо за 20 хвилин',
        p('Я не проводжу воркшоп персон. Питаю про джерело запитів, вартість залучення, що стається після листа і чи календар живе в Excel. Потім одна рекомендація. Гроші: [скільки коштує корпоративний сайт](/artykuly/ile-kosztuje-strona-firmowa/). Воронка — наступна стаття кластера.'),
      ),
    ],
    faqs: [
      {
        q: 'Чи можна почати з візитівки й «добудувати воронку»?',
        a: 'Так, якщо стек і IA це дозволяють. Планую на аудиті. Не добудовую воронку до теми WordPress, яку не підтримую.',
      },
      {
        q: 'Чи воронка завжди означає Google Ads?',
        a: 'Ні. Воронка — шлях на сайті: кваліфікація, бронювання, вимір. Реклама — пальне, не визначення.',
      },
      {
        q: 'Маю 15 тис. злотих. Що обираємо?',
        a: 'Зазвичай візитівку Start із запасом на текст і вимір — або чекаємо бюджет Launch/Платформа. 15 тис. «половинної воронки» — найгірший компроміс.',
      },
      {
        q: 'Чи Mint — візитівка?',
        a: 'Ні. Це сервіс із бронюванням на власному домені й операцією навколо гостя. Інший пакет, інша ціна, інша ціль.',
      },
    ],
    ctaTitle: 'Одна рекомендація пакета, не три оферти',
    ctaBody:
      'На аудиті скажу: Start, Launch, Платформа або зачекати. Вилки — у [цінах](/#cennik).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
