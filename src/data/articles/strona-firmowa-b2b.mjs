import { DATE, h3, note, offerCennik, offerOferta, ol, p, section, table, ul } from './_blocks.mjs'

const related = [
  {
    slug: 'ile-kosztuje-strona-firmowa',
    anchor: {
      pl: 'ile kosztuje strona firmowa w moich widełkach',
      en: 'what a company website costs in my ranges',
      uk: 'скільки коштує корпоративний сайт у моїх межах',
    },
  },
  {
    slug: 'strona-wizytowka-czy-lejek',
    anchor: {
      pl: 'kiedy wizytówka wystarczy, a kiedy potrzebny jest lejek',
      en: 'when a brochure site is enough, and when you need a funnel',
      uk: 'коли візитівки досить, а коли потрібна воронка',
    },
  },
  {
    slug: 'lejek-konwersji-na-stronie',
    anchor: {
      pl: 'jak buduję lejek konwersji na stronie B2B',
      en: 'how I build a conversion funnel on a B2B site',
      uk: 'як я будую воронку конверсії на сайті B2B',
    },
  },
]

export default {
  slug: 'strona-firmowa-b2b',
  keyword: 'strona firmowa B2B',
  keywordEn: 'B2B company website',
  keywordUk: 'корпоративний сайт B2B',
  intent: 'commercial',
  cluster: 'strony',
  published: DATE,
  modified: DATE,
  related,
  offer: [offerOferta(), offerCennik()],
  pl: {
    title: 'Strona firmowa B2B — zakres, który zbiera zapytania',
    description:
      'Strona firmowa B2B zbiera zapytania, gdy ma jasną ofertę, dowód i jeden CTA. Opisuję zakres do 5 podstron (6 500–12 000 zł) i moment, w którym potrzebny jest lejek.',
    h1: 'Strona firmowa B2B, która zbiera zapytania, a nie tylko „jest”',
    kicker: 'Zakres · do 5 podstron',
    lead:
      'Strona firmowa B2B nie jest katalogiem slajdów z konferencji. Ma jeden obowiązek: właściciel firmy albo osoba decydująca o zakupie ma w kilka minut zrozumieć, co robisz, dla kogo, ile to mniej więcej kosztuje i jak się odezwać. Poniżej opisuję zakres, który wdrażam w pakiecie 6 500–12 000 zł — i uczciwie mówię, kiedy ta strona jeszcze nie sprzedaje, bo problemem jest lejek, a nie wizytówka.',
    sections: [
      section(
        'Co w praktyce oznacza strona firmowa B2B',
        p('W B2B nikt nie kupuje z hero. Kupuje po tym, że rozumie zakres, ryzyko i następny krok. Dlatego strona firmowa B2B, którą buduję, ma pięć podstron albo mniej: start, oferta, o firmie, realizacje albo dowód, kontakt. Nie dokładam bloga „na SEO”, wielojęzyczności ani CRM-u w tej cenie — to są dopłaty albo [pakiet Conversion Build](/#cennik).'),
        p('Start musi odpowiadać na trzy pytania bez scrollowania w ciemno: czy to dla mnie, co dostanę, co mam kliknąć. Oferta nie może być listą fraz typu „kompleksowe rozwiązania”. Podaję, co wchodzi w pracę, czego nie robię i w jakim horyzoncie czasowym. Kontakt to formularz z powiadomieniem, nie sam mailto, bo mailto ginie na telefonie i nie zostawia śladu.'),
        p('Dowód na stronie B2B jest najtrudniejszy, gdy nie chcesz kłamać. Ja nie wklejam fikcyjnych opinii. Jeśli masz żywe wdrożenie — linkuję. Publicznie pokazuję [Mint Apartments](https://mintapartments.pl) i [Plumm](https://plumm.pl). iDrive nie jest live, Agentic OS jest narzędziem wewnętrznym. Lepiej mniej dowodu niż teatr z gwiazdkami.'),
      ),
      section(
        'Zakres, który mieści się w 6 500–12 000 zł',
        p('W tej kwocie dostajesz projekt pod markę, nie szablon z marketplace, do pięciu podstron, formularz z ochroną przed spamem, podstawowe SEO on-page (title, description, nagłówki, sitemap, szybkość na telefonie) i pomiar zapytań po starcie. Stack, którego używam przy takich stronach, to zwykle Astro albo Next — nie WordPress z ThemeForest i wtyczką „SEO w jednym kliknięciu”.'),
        table(
          ['Element', 'W pakiecie strony firmowej', 'Poza pakietem'],
          [
            ['Podstrony', 'Do 5, zakres na audycie', 'Landingi kampanii, blog, sklep'],
            ['Formularz', 'Kontakt + powiadomienia', 'Kwalifikacja leadów, CRM, scoring'],
            ['SEO', 'On-page, sitemap, CWV', 'Treści eksperckie, link building'],
            ['Języki', 'Jeden język w tej cenie', 'PL/EN/UA i hreflang'],
            ['Copy', 'Struktura i redakcja Twoich materiałów', 'Copywriting od zera'],
          ],
        ),
        p('Jeśli agencja obiecuje „stronę firmową B2B z blogiem, AI i sklepem za 4 000 zł”, to nie jest ten sam produkt. Na polskim rynku w 2026 publiczne cenniki freelancerów i butików dla wizytówki często spadają do 3–7 tys., a mediana „strony firmowej” w zestawieniach kręci się wokół 6 tys. Moja dolna granica jest świadomie wyżej, bo nie sprzedaję motywu z wymienionym logo.'),
      ),
      section(
        'Czego B2B nie wybacza na pierwszym ekranie',
        p('Najczęstszy błąd, który widzę: firma opisuje siebie, nie decyzję klienta. „Jesteśmy dynamicznym zespołem z pasją” nie kwalifikuje budżetu. Właściciel chce wiedzieć, czy obsłużysz jego wolumen, czy wchodzisz w jego branżę i czy nie znikniesz po fakturze. Dlatego na starcie daję konkret: lokalizacja, model współpracy (zdalnie / on-site w Trójmieście), czas odpowiedzi, próg cenowy.'),
        ul([
          'Jedna obietnica w H1, nie trzy równoległe biznesy.',
          'Cena albo widełki — ukrywanie „wycena indywidualna” bez rzędu wielkości obniża liczbę zapytań od poważnych firm.',
          'CTA, które da się wykonać na telefonie w 30 sekund.',
          'Link do czegoś, co działa publicznie. Jeśli nie masz, pisz proces i zasady, nie zmyślaj case’ów.',
        ]),
        p('Drugi błąd: pięć CTA. „Zadzwoń”, „napisz”, „pobierz PDF”, „umów demo”, „zobacz sklep”. W B2B na stronie firmowej zostawiam jedno główne wezwanie — u mnie jest to 20-minutowy audyt albo formularz — i jedno słabsze (mail). Reszta rozmywa pomiar.'),
      ),
      section(
        'Kiedy strona firmowa B2B przestaje wystarczać',
        p('Wizytówka zbiera zapytania, jeśli ruch jest ciepły: polecenie, LinkedIn, lokalne Google, osoba, która już wie, że Cię potrzebuje. Przestaje wystarczać, gdy płacisz za kliknięcia, gdy klient porównuje Cię z trzema ofertami albo gdy decyzja wymaga kalkulacji (rezerwacja, konfigurator, kwalifikacja). Wtedy nie „dokręcamy kolorów”. Przechodzimy do [lejka konwersji](/artykuly/lejek-konwersji-na-stronie/).'),
        p('Przykład z mojej pracy, nie z prezentacji: [Mint Apartments](https://mintapartments.pl) nie jest wizytówką. Gość ma kalendarz i cenę na żywo, płatność na własnej domenie i check-in bez recepcji. To jest Conversion Build, nie pakiet 6 500 zł. Gdybyśmy zostawili „ładną stronę noclegową” bez rezerwacji, prowizja portalu dalej zjadałaby marżę.'),
        note('Szacunki godzin i oszczędności przy Mint i Plumm są orientacyjne — zależą od wolumenu. Na audycie liczę Twój przypadek, nie średnią z internetu.'),
      ),
      section(
        'SEO na stronie firmowej B2B: minimum, które ma sens',
        p('Nie sprzedaję pozycji na frazę „usługi dla firm”. Sprzedaję stronę, którą Google w ogóle może zrozumieć: jedno H1, logiczne H2, unikalny title, canonical, sitemap, brak noindex przez pomyłkę, szybkość (LCP i INP, nie sam wynik Lighthouse). [Szybkość strony a SEO](/artykuly/szybkosc-strony-a-seo/) to osobny temat — tu wystarczy zasada: jeśli strona na telefonie maluje się trzy sekundy, część płatnego ruchu nie zobaczy oferty.'),
        p('Treści eksperckie, takie jak ten artykuł, są osobnym ruchem. Pakiet strony firmowej ich nie obejmuje. Jeśli chcesz organiczny kanał, planujemy klastry i crawlable URL-e, nie hash w SPA. To już decyzja produktowa, nie „dodamy wtyczkę blog”.'),
      ),
      section(
        'Jak wygląda decyzja na 20-minutowym audycie',
        p('Nie zaczynam od moodboardu. Pytam: skąd dziś przychodzą zapytania, ile ich jest, co się z nimi dzieje po mailu i czy strona ma w ogóle prawo się spiąć. Jeśli masz 2 zapytania w kwartale i zero poleceń, najpierw kanał, nie redesign. Jeśli masz ruch i ciszę w skrzynce, diagnozuję [dlaczego strona nie sprzedaje](/artykuly/dlaczego-strona-nie-sprzedaje/).'),
        ol([
          '20 minut: mapa lejka na kartce, nie w Miro na trzy tygodnie.',
          'Rekomendacja pakietu: strona firmowa, Conversion Build, panel albo „nie wdrażaj”.',
          'Jeśli się spina — plan na 90 dni z pierwszym mierzalnym efektem.',
        ]),
        p('Kod po opłaceniu faktur należy do Ciebie. NDA jest standardem. Nie uzależniam Cię od panelu, którego nie możesz wyeksportować.'),
      ),
    ],
    faqs: [
      {
        q: 'Czy strona firmowa B2B musi mieć bloga?',
        a: 'Nie. Blog ma sens, gdy masz eksperta, który będzie pisał regularnie i gdy URL-e są indeksowalne. W pakiecie 6 500–12 000 zł bloga nie ma — to osobna decyzja, nie ozdoba.',
      },
      {
        q: 'Ile podstron naprawdę potrzebuję?',
        a: 'Zwykle pięć albo mniej. Każda kolejna bez osobnego search intentu rozwadnia autorytet i budżet. Lepiej jedna mocna oferta niż dwanaście cienkich zakładek.',
      },
      {
        q: 'Czy zrobisz stronę w WordPressie?',
        a: 'Nie sprzedaję motywu z ThemeForest. Dla wizytówki B2B wybieram lekki stack (Astro/Next), bo po roku liczysz utrzymanie i szybkość, nie liczbę wtyczek.',
      },
      {
        q: 'Kiedy przejść z wizytówki na lejek?',
        a: 'Gdy płacisz za ruch, gdy potrzebujesz kwalifikacji albo rezerwacji na własnej domenie, albo gdy obsługa zapytań zjada godziny. Szczegóły w artykule o wizytówce i lejku — i w cenniku Conversion Build (25 000–60 000 zł).',
      },
    ],
    ctaTitle: 'Sprawdźmy, czy wizytówka wystarczy',
    ctaBody:
      'Na 20 minutach audytu powiem wprost: pakiet strony firmowej, lejek, albo nic nie wdrażać. Jeśli wolisz pisać — użyj [formularza na stronie](/#kontakt).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'B2B company website: a scope that collects enquiries',
    description:
      'A B2B company website collects enquiries when the offer, proof and CTA are clear. I describe a five-page scope (PLN 6,500–12,000) and when you actually need a funnel instead.',
    h1: 'A B2B company website that collects enquiries, not just “exists”',
    kicker: 'Scope · up to 5 pages',
    lead:
      'A B2B company website is not a conference slide deck. It has one job: a buyer should understand in a few minutes what you do, for whom, roughly what it costs, and how to reply. Below is the scope I ship for PLN 6,500–12,000 — and an honest line for when that site still will not sell, because the problem is the funnel, not the brochure.',
    sections: [
      section(
        'What a B2B company website means in practice',
        p('In B2B nobody buys from the hero. They buy once they understand scope, risk and the next step. The B2B company website I build has five pages or fewer: home, offer, about, proof, contact. I do not add a “SEO blog”, extra languages or a CRM at this price — those are extras or a [Conversion Build](/#cennik).'),
        p('Home must answer three questions without a treasure hunt: is this for me, what do I get, what do I click. The offer cannot be a list of “comprehensive solutions”. I state what is in, what is out, and the time horizon. Contact is a form with a notification, not a lone mailto that dies on mobile and leaves no trace.'),
        p('Proof is the hard part if you refuse to lie. I do not paste fake reviews. If you have a live deployment, I link it. Publicly I show [Mint Apartments](https://mintapartments.pl) and [Plumm](https://plumm.pl). iDrive is not live. Agentic OS is an internal tool. Less proof beats a theatre of stars.'),
      ),
      section(
        'What PLN 6,500–12,000 actually covers',
        p('In that range you get a brand-specific build, not a marketplace theme, up to five pages, a spam-protected form, on-page SEO (title, description, headings, sitemap, mobile speed) and enquiry measurement after launch. The stack is usually Astro or Next — not WordPress from ThemeForest plus a “SEO in one click” plugin.'),
        table(
          ['Element', 'In the company-site package', 'Out of package'],
          [
            ['Pages', 'Up to 5, scoped in the audit', 'Campaign landings, blog, shop'],
            ['Form', 'Contact + notifications', 'Lead qualification, CRM, scoring'],
            ['SEO', 'On-page, sitemap, CWV', 'Expert articles, link building'],
            ['Languages', 'One language at this price', 'PL/EN/UA and hreflang'],
            ['Copy', 'Structure and edit of your materials', 'Copywriting from scratch'],
          ],
        ),
        p('If an agency promises a “B2B company website with a blog, AI and a shop for PLN 4,000”, it is not the same product. Polish 2026 public price lists often put brochure sites at 3–7k, with a median “company website” around 6k in some round-ups. My floor is higher on purpose: I do not sell a swapped logo on a stock theme.'),
      ),
      section(
        'What B2B will not forgive above the fold',
        p('The usual failure: the company describes itself, not the buyer’s decision. “We are a passionate, dynamic team” does not qualify a budget. An owner wants to know whether you can handle their volume, whether you enter their industry, and whether you vanish after the invoice. So the first screen carries location, working model (remote / on-site in the Tri-City), response time and a price floor.'),
        ul([
          'One promise in the H1, not three parallel businesses.',
          'A price or a range — hiding behind “individual quote” with no order of magnitude filters out serious firms.',
          'A CTA that can be finished on a phone in 30 seconds.',
          'A link to something that works in public. If you have none, write process and terms — do not invent case studies.',
        ]),
        p('The second failure: five CTAs. Call, write, download a PDF, book a demo, visit the shop. On a B2B company website I keep one primary action — a 20-minute audit or a form — and one weaker one (email). The rest destroys measurement.'),
      ),
      section(
        'When a B2B company website stops being enough',
        p('A brochure collects enquiries when traffic is already warm: referral, LinkedIn, local Google, someone who already knows they need you. It fails when you pay for clicks, when the buyer compares three proposals, or when the decision needs calculation (booking, configurator, qualification). Then we do not “tweak colours”. We move to a [conversion funnel](/artykuly/lejek-konwersji-na-stronie/).'),
        p('A real example from my work, not a slide: [Mint Apartments](https://mintapartments.pl) is not a brochure. The guest gets a live calendar and price, pays on the operator’s domain, and checks in without a desk. That is Conversion Build, not the PLN 6,500 package. A pretty lodging site without booking would still leak margin to the portal.'),
        note('Hour and saving figures for Mint and Plumm are directional — they depend on volume. In the audit I count your case, not an internet average.'),
      ),
      section(
        'SEO on a B2B company website: the minimum that matters',
        p('I do not sell a rank for “services for companies”. I sell a page Google can parse: one H1, logical H2s, a unique title, canonical, sitemap, no accidental noindex, speed (LCP and INP, not a Lighthouse vanity score). [Website speed and SEO](/artykuly/szybkosc-strony-a-seo/) is a separate piece — the rule here is simple: if the phone paint takes three seconds, part of paid traffic never sees the offer.'),
        p('Expert articles like this one are a separate channel. The company-site package does not include them. If you want organic, we plan clusters and crawlable URLs, not a hash in an SPA. That is a product decision, not “we will add a blog plugin”.'),
      ),
      section(
        'How the 20-minute audit actually decides',
        p('I do not start with a moodboard. I ask where enquiries come from, how many there are, what happens after the email, and whether a site has any right to pay for itself. Two enquiries a quarter and no referrals: fix the channel before a redesign. Traffic and a silent inbox: we diagnose [why the site does not sell](/artykuly/dlaczego-strona-nie-sprzedaje/).'),
        ol([
          'Twenty minutes: a funnel map on paper, not three weeks in a whiteboard tool.',
          'A package recommendation: company site, Conversion Build, operations panel — or do not implement.',
          'If the numbers work — a 90-day plan with a first measurable effect.',
        ]),
        p('After invoices are paid, the code is yours. NDA is standard. I will not lock you into a panel you cannot export.'),
      ),
    ],
    faqs: [
      {
        q: 'Does a B2B company website need a blog?',
        a: 'No. A blog makes sense when someone will write regularly and URLs are indexable. The PLN 6,500–12,000 package does not include a blog — that is a separate decision, not decoration.',
      },
      {
        q: 'How many pages do I actually need?',
        a: 'Usually five or fewer. Every extra page without its own search intent dilutes authority and budget. One strong offer beats twelve thin tabs.',
      },
      {
        q: 'Will you build it in WordPress?',
        a: 'I do not sell a ThemeForest theme. For a B2B brochure I pick a light stack (Astro/Next), because a year later you count maintenance and speed, not plugin count.',
      },
      {
        q: 'When should I move from a brochure to a funnel?',
        a: 'When you pay for traffic, when you need qualification or on-domain booking, or when enquiry handling eats hours. Details are in the brochure-versus-funnel article — and in Conversion Build pricing (PLN 25,000–60,000).',
      },
    ],
    ctaTitle: 'Let us check whether a brochure is enough',
    ctaBody:
      'In a 20-minute audit I will say plainly: company-site package, funnel, or ship nothing. If you prefer to write, use the [form on the site](/#kontakt).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Корпоративний сайт B2B: обсяг, який збирає запити',
    description:
      'Корпоративний сайт B2B збирає запити, коли оферта, доказ і CTA зрозумілі. Описую обсяг до 5 сторінок (6 500–12 000 злотих) і момент, коли потрібна воронка, а не візитівка.',
    h1: 'Корпоративний сайт B2B, який збирає запити, а не просто «є»',
    kicker: 'Обсяг · до 5 сторінок',
    lead:
      'Корпоративний сайт B2B — це не колода слайдів із конференції. В нього один обов’язок: власник або людина, яка вирішує про купівлю, за кілька хвилин розуміє, що ви робите, для кого, який порядок цін і як відповісти. Нижче — обсяг, який впроваджую за 6 500–12 000 злотих, і чесна межа, коли такий сайт усе ще не продає, бо проблема у воронці, а не у візитівці.',
    sections: [
      section(
        'Що на практиці означає корпоративний сайт B2B',
        p('У B2B ніхто не купує з героя. Купують, коли зрозумілі обсяг, ризик і наступний крок. Тому корпоративний сайт B2B, який я будую, має п’ять сторінок або менше: головна, оферта, про компанію, доказ, контакт. Я не додаю блог «для SEO», багатомовність чи CRM у цій ціні — це доплати або [пакет Conversion Build](/#cennik).'),
        p('Головна має відповісти на три питання без полювання: чи це для мене, що я отримаю, що натиснути. Оферта не може бути списком фраз на кшталт «комплексні рішення». Я вказую, що входить у роботу, чого не роблю і в якому горизонті. Контакт — форма з повідомленням, не сам mailto, який помирає на телефоні й не лишає сліду.'),
        p('Доказ на сайті B2B найважчий, якщо ви не хочете брехати. Я не вставляю вигадані відгуки. Якщо є живе впровадження — ставлю посилання. Публічно показую [Mint Apartments](https://mintapartments.pl) і [Plumm](https://plumm.pl). iDrive не в продакшені, Agentic OS — внутрішній інструмент. Краще менше доказу, ніж театр із зірками.'),
      ),
      section(
        'Що реально входить у 6 500–12 000 злотих',
        p('У цій сумі ви отримуєте проєкт під бренд, не шаблон із маркетплейсу, до п’яти сторінок, форму із захистом від спаму, базове on-page SEO (title, description, заголовки, sitemap, швидкість на телефоні) і вимір запитів після старту. Стек зазвичай Astro або Next — не WordPress із ThemeForest і плагіном «SEO в один клік».'),
        table(
          ['Елемент', 'У пакеті корпоративного сайту', 'Поза пакетом'],
          [
            ['Сторінки', 'До 5, обсяг на аудиті', 'Лендінги кампаній, блог, магазин'],
            ['Форма', 'Контакт + сповіщення', 'Кваліфікація лідів, CRM, скоринг'],
            ['SEO', 'On-page, sitemap, CWV', 'Експертні тексти, лінкбілдинг'],
            ['Мови', 'Одна мова в цій ціні', 'PL/EN/UA і hreflang'],
            ['Копірайт', 'Структура й редакція ваших матеріалів', 'Тексти з нуля'],
          ],
        ),
        p('Якщо агенція обіцяє «корпоративний сайт B2B з блогом, ШІ й магазином за 4 000 злотих», це не той самий продукт. На польському ринку 2026 публічні прайси фрилансерів для візитівки часто падають до 3–7 тис., а медіана «сайту компанії» в оглядах крутиться біля 6 тис. Мій нижній поріг вищий свідомо: я не продаю тему з підставленим логотипом.'),
      ),
      section(
        'Чого B2B не прощає на першому екрані',
        p('Найчастіша помилка: компанія описує себе, а не рішення клієнта. «Ми динамічна команда з пристрастю» не кваліфікує бюджет. Власник хоче знати, чи витягнете його обсяг, чи заходите в його галузь і чи не зникнете після рахунку. Тому на старті я даю конкрет: локація, модель роботи (віддалено / on-site в Тримісті), час відповіді, ціновий поріг.'),
        ul([
          'Одна обіцянка в H1, не три паралельні бізнеси.',
          'Ціна або вилка — ховання за «індивідуальною оцінкою» без порядку величини відсікає серйозні фірми.',
          'CTA, яке можна виконати на телефоні за 30 секунд.',
          'Посилання на щось, що працює публічно. Якщо цього немає — пишіть процес і правила, не вигадуйте кейси.',
        ]),
        p('Друга помилка: п’ять CTA. «Зателефонуйте», «напишіть», «завантажте PDF», «запишіться на демо», «див. магазин». На корпоративному сайті B2B лишаю одну головну дію — 20-хвилинний аудит або форму — і одну слабшу (пошта). Решта розмиває вимір.'),
      ),
      section(
        'Коли корпоративного сайту B2B уже замало',
        p('Візитівка збирає запити, коли трафік теплий: рекомендація, LinkedIn, локальний Google, людина, яка вже знає, що ви потрібні. Вона перестає вистачати, коли ви платите за кліки, коли клієнт порівнює три пропозиції або коли рішення потребує розрахунку (бронювання, конфігуратор, кваліфікація). Тоді ми не «підкручуємо кольори». Переходимо до [воронки конверсії](/artykuly/lejek-konwersji-na-stronie/).'),
        p('Приклад із моєї роботи, не з презентації: [Mint Apartments](https://mintapartments.pl) — не візитівка. Гість бачить календар і ціну наживо, платить на вашому домені й заселяється без ресепшена. Це Conversion Build, не пакет 6 500 злотих. Якби лишили «гарний сайт ночівлі» без бронювання, комісія порталу далі з’їдала б маржу.'),
        note('Оцінки годин і економії для Mint і Plumm орієнтовні — залежать від обсягу. На аудиті рахую ваш випадок, не середнє з інтернету.'),
      ),
      section(
        'SEO на корпоративному сайті B2B: мінімум, який має сенс',
        p('Я не продаю позицію за фразою «послуги для компаній». Продаю сторінку, яку Google взагалі може зрозуміти: одне H1, логічні H2, унікальний title, canonical, sitemap, без випадкового noindex, швидкість (LCP і INP, не лише бал Lighthouse). [Швидкість сайту і SEO](/artykuly/szybkosc-strony-a-seo/) — окрема тема; тут правило просте: якщо телефон малює сторінку три секунди, частина платного трафіку не побачить оферти.'),
        p('Експертні тексти, як ця стаття, — окремий канал. Пакет корпоративного сайту їх не охоплює. Якщо потрібен органічний канал, плануємо кластери й crawlable URL, не хеш у SPA. Це продуктове рішення, не «додамо плагін блогу».'),
      ),
      section(
        'Як рішення виглядає на 20-хвилинному аудиті',
        p('Я не починаю з мудборду. Питаю: звідки сьогодні приходять запити, скільки їх, що з ними стається після листа і чи сайт має право окупитися. Якщо запитів два на квартал і нуль рекомендацій — спочатку канал, не редизайн. Якщо є трафік і тиша в скриньці — діагностую, [чому сайт не продає](/artykuly/dlaczego-strona-nie-sprzedaje/).'),
        ol([
          '20 хвилин: мапа воронки на папері, не три тижні в Miro.',
          'Рекомендація пакета: корпоративний сайт, Conversion Build, панель — або «не впроваджувати».',
          'Якщо сходиться — план на 90 днів із першим вимірюваним ефектом.',
        ]),
        p('Код після оплати рахунків належить вам. NDA — стандарт. Я не прив’язую вас до панелі, яку не можна експортувати.'),
      ),
    ],
    faqs: [
      {
        q: 'Чи потрібен блоґ на корпоративному сайті B2B?',
        a: 'Ні. Блоґ має сенс, коли є експерт, який писатиме регулярно, і URL індексуються. У пакеті 6 500–12 000 злотих блогу немає — це окреме рішення, не прикраса.',
      },
      {
        q: 'Скільки сторінок мені справді потрібно?',
        a: 'Зазвичай п’ять або менше. Кожна наступна без окремого search intent розмиває авторитет і бюджет. Краще одна сильна оферта, ніж дванадцять тонких вкладок.',
      },
      {
        q: 'Чи зробите сайт на WordPress?',
        a: 'Я не продаю тему з ThemeForest. Для візитівки B2B обираю легкий стек (Astro/Next), бо за рік ви рахуєте підтримку і швидкість, не кількість плагінів.',
      },
      {
        q: 'Коли переходити з візитівки на воронку?',
        a: 'Коли платите за трафік, коли потрібна кваліфікація або бронювання на власному домені, або коли обробка запитів з’їдає години. Деталі — у статті про візитівку й воронку та в цінах Conversion Build (25 000–60 000 злотих).',
      },
    ],
    ctaTitle: 'Перевіримо, чи вистачить візитівки',
    ctaBody:
      'За 20 хвилин аудиту скажу прямо: пакет корпоративного сайту, воронка, або нічого не впроваджувати. Якщо зручніше написати — скористайтеся [формою на сайті](/#kontakt).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
