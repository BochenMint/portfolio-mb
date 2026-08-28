import { DATE, offerCennik, offerKontakt, ol, p, section, ul } from './_blocks.mjs'

export default {
  slug: 'wdrozenie-strony-internetowej',
  keyword: 'wdrożenie strony internetowej',
  keywordEn: 'website implementation process',
  keywordUk: 'впровадження сайту процес',
  intent: 'informational',
  cluster: 'delivery',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'audyt-strony-internetowej', anchor: { pl: 'audyt i decyzja, zanim ruszy wdrożenie', en: 'audit and decision before implementation starts', uk: 'аудит і рішення до старту впровадження' } },
    { slug: 'strona-firmowa-b2b', anchor: { pl: 'zakres strony firmowej, który wdrażam', en: 'the company-website scope I actually ship', uk: 'обсяг корпоративного сайту, який впроваджую' } },
    { slug: 'szybkosc-strony-a-seo', anchor: { pl: 'pomiar szybkości po starcie, nie tylko na stagingu', en: 'speed measurement after launch, not only on staging', uk: 'вимір швидкості після старту, не лише на staging' } },
  ],
  offer: [offerCennik(), offerKontakt()],
  pl: {
    title: 'Wdrożenie strony internetowej: 20 minut, potem 90 dni',
    description:
      'Wdrożenie strony internetowej u mnie: 20 min audytu, plan 90 dni, produkcja ze stagingiem i pomiar przed/po. Terminy: wizytówka 2–4 tyg., lejek 6–12. Bez discovery na kwartał.',
    h1: 'Wdrożenie strony internetowej: od 20 minut do pomiaru, nie do slajdów',
    kicker: 'Proces',
    lead:
      '„Jak wygląda współpraca” bywa opowiadane jak bajka o agile. U mnie są cztery kroki, których nie owijam: 20-minutowy audyt, plan na 90 dni, wdrożenie w produkcji ze stagingiem i szkoleniem, pomiar przed/po. Wizytówka: zwykle 2–4 tygodnie. Rezerwacje i integracje: 6–12. Jeśli ktoś obiecuje „stronę firmową B2B z AI i sklepem w 10 dni”, to nie ten proces — albo nie ten zakres.',
    sections: [
      section(
        'Krok 1 — 20 minut, które mają prawo zakończyć projekt',
        p('Rozmawiamy o tym, co zjada czas albo blokuje sprzedaż. Na koniec: szacunek godzin, który pakiet ma sens, albo stop. To nie jest ukryty sprzedażowy webinar. Część calli kończy się „nie wdrażaj”. Wtedy nie ma [Audit Sprintu](/artykuly/audyt-strony-internetowej/) na siłę i nie ma faktury za poczucie winy.'),
      ),
      section(
        'Krok 2 — jeden dokument na 90 dni, nie faza odkrywania',
        p('Zakres, integracje, pierwszy mierzalny efekt: zapytanie, które dochodzi, rezerwacja na żywo, e-faktura wychodząca. Bez Miro na kwartał. Jeśli nie umiemy nazwać efektu, wracamy do audytu albo się rozchodzimy. [Wizytówka czy lejek](/artykuly/strona-wizytowka-czy-lejek/) zostaje rozstrzygnięte tu, nie w połowie kodu.'),
        ul([
          'Jedna konwersja wiodąca.',
          'Lista „poza zakresem” (blog, języki, CRM) spisana, nie „jakoś się doda”.',
          'Data stagingu i data produkcji z buforem na Wasze materiały — spóźnione zdjęcia przesuwają kalendarz, nie „jakość magicznie”.',
        ]),
      ),
      section(
        'Krok 3 — produkcja, nie PDF „jak obsługiwać”',
        p('Krótkie iteracje, dostęp do wersji testowej, szkolenie 1–2 h dla zespołu. Kod po fakturach jest Twój. NDA standard. Nie zostawiam Cię z motywem, którego nie umiesz zaktualizować, bo nie buduję stosu wtyczek. Stack: zwykle Astro/Next dla stron, integracje tam, gdzie są (Previo, bramka, KSeF).'),
        p('On-site w Trójmieście, gdy warsztat z zespołem ma sens. Zdalnie w całej Polsce. Odpowiedź w jeden dzień roboczy — to SLA, nie slogan hero.'),
      ),
      section(
        'Krok 4 — pomiar, który może skończyć się poprawką, nie zniknięciem',
        p('Porównujemy przed/po: czas obsługi, liczba maili, liczba zapytań. Jeśli liczby nie siadają, poprawiam. Nie gwarantuję rankingu. Gwarantuję, że nie znikam po deploju z „powodzenia w Google”. [Szybkość i SEO](/artykuly/szybkosc-strony-a-seo/) mierzymy na produkcji, bo staging kłamie inną siecią i cache.'),
      ),
      section(
        'Czego nie ma w onboardingu',
        ol([
          'Fałszywych case’ów „poprzedni klient zyskał 300%”. Live: Mint i Plumm.',
          'Trzech opiekunów, z których żaden nie koduje.',
          'Abonamentu „opieka SEO 1500 zł”, który łata WordPress.',
          'iDrive i Agentic jako Wasz onboarding — zły produkt, zły status live.',
        ]),
      ),
    ],
    faqs: [
      { q: 'Co jeśli już mam agencję?', a: 'Mogę wejść obok: moduł, asystent, eksport. Bez przepisywania wszystkiego „bo ładniej”.' },
      { q: 'Kto pisze teksty?', a: 'W pakiecie strony redaguję Twoje materiały. Copy od zera jest poza zakresem albo osobną wyceną — to jest w cenniku, nie w niespodziance.' },
      { q: 'Czy mogę zobaczyć staging?', a: 'Tak, zanim produkcja. To nie jest „zaufaj i czekaj na wielkie otwarcie”.' },
      { q: 'Co po 90 dniach?', a: 'Albo utrzymanie godzinowe, albo nic, jeśli strona stoi i mierzy. Nie wymuszam retainera.' },
    ],
    ctaTitle: 'Pierwszy krok to 20 minut, nie brief na 40 slajdów',
    ctaBody: 'Jeśli po callu nie ma sensu — kończymy. Jeśli jest: 90 dni z efektem. [Kontakt](/#kontakt).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'Website implementation: a 20-minute audit, then 90 days',
    description:
      'Website implementation with me: a 20-min audit, a 90-day plan, production with staging, and before/after measurement. Timelines: brochure 2–4 weeks, funnel 6–12. No quarter-long discovery.',
    h1: 'Website implementation: from 20 minutes to measurement, not to slides',
    kicker: 'Process',
    lead:
      '“What collaboration looks like” is often told as an agile fairy tale. I have four steps I do not wrap: a 20-minute audit, a 90-day plan, production with staging and training, before/after measurement. Brochure: typically 2–4 weeks. Booking and integrations: 6–12. If someone promises a “B2B company site with AI and a shop in 10 days”, that is not this process — or not this scope.',
    sections: [
      section(
        'Step 1 — 20 minutes that may end the project',
        p('We talk about what eats time or blocks sales. At the end: an hours estimate, which package makes sense, or a stop. This is not a hidden sales webinar. Some calls end “do not implement”. Then there is no forced [Audit Sprint](/artykuly/audyt-strony-internetowej/) and no invoice for guilt.'),
      ),
      section(
        'Step 2 — one 90-day document, not a discovery phase',
        p('Scope, integrations, the first measurable effect: an enquiry that arrives, a live booking, an e-invoice going out. No quarter in a whiteboard tool. If we cannot name the effect, we return to the audit or we part. [Brochure or funnel](/artykuly/strona-wizytowka-czy-lejek/) is settled here, not halfway through the code.'),
        ul([
          'One leading conversion.',
          'An out-of-scope list (blog, languages, CRM) written down, not “we will add it somehow”.',
          'Staging and production dates with buffer for your assets — late photos move the calendar, not “quality magically”.',
        ]),
      ),
      section(
        'Step 3 — production, not a PDF on “how to operate”',
        p('Short iterations, access to a test version, 1–2 hours of team training. After invoices, the code is yours. NDA is standard. I do not leave you with a theme you cannot update, because I do not build a plugin pile. Stack: usually Astro/Next for sites, integrations where they exist (Previo, gateway, KSeF).'),
        p('On-site in the Tri-City when a workshop with the team makes sense. Remote across Poland. A reply within one business day — an SLA, not a hero slogan.'),
      ),
      section(
        'Step 4 — measurement that may end in a fix, not a disappearance',
        p('We compare before/after: handling time, mail volume, enquiry count. If the numbers miss, I fix. I do not guarantee rank. I do guarantee I do not vanish after deploy with “good luck in Google”. [Speed and SEO](/artykuly/szybkosc-strony-a-seo/) we measure in production, because staging lies with a different network and cache.'),
      ),
      section(
        'What onboarding does not include',
        ol([
          'Fake cases “the last client gained 300%”. Live: Mint and Plumm.',
          'Three account managers, none of whom code.',
          'A “SEO care PLN 1,500” retainer that patches WordPress.',
          'iDrive and Agentic as your onboarding — wrong product, wrong live status.',
        ]),
      ),
    ],
    faqs: [
      { q: 'What if I already have an agency?', a: 'I can come in beside: a module, an assistant, an export. Without rewriting everything “because it looks nicer”.' },
      { q: 'Who writes the copy?', a: 'In the site package I edit your materials. Copy from scratch is out of scope or a separate quote — that is in the price list, not a surprise.' },
      { q: 'Can I see staging?', a: 'Yes, before production. This is not “trust us and wait for a grand opening”.' },
      { q: 'What after 90 days?', a: 'Either hourly upkeep or nothing if the site stands and measures. I do not force a retainer.' },
    ],
    ctaTitle: 'The first step is 20 minutes, not a 40-slide brief',
    ctaBody: 'If after the call there is no point — we stop. If there is: 90 days with an effect. [Contact](/#kontakt).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Впровадження сайту: 20 хвилин, потім 90 днів',
    description:
      'Впровадження сайту в мене: 20 хв аудиту, план 90 днів, продакшен зі staging і вимір до/після. Терміни: візитівка 2–4 тиж., воронка 6–12. Без discovery на квартал.',
    h1: 'Впровадження сайту: від 20 хвилин до виміру, не до слайдів',
    kicker: 'Процес',
    lead:
      '«Як виглядає співпраця» часто розповідають як казку про agile. У мене чотири кроки, які не загортаю: 20-хвилинний аудит, план на 90 днів, впровадження в продакшені зі staging і навчанням, вимір до/після. Візитівка: зазвичай 2–4 тижні. Бронювання й інтеграції: 6–12. Якщо хтось обіцяє «корпоративний сайт B2B з ШІ й магазином за 10 днів» — це не цей процес або не цей обсяг.',
    sections: [
      section(
        'Крок 1 — 20 хвилин, які мають право закінчити проєкт',
        p('Говоримо про те, що з’їдає час або блокує продаж. Наприкінці: оцінка годин, який пакет має сенс, або стоп. Це не прихований продажний вебінар. Частина дзвінків закінчується «не впроваджуйте». Тоді немає [Audit Sprint](/artykuly/audyt-strony-internetowej/) силоміць і немає рахунку за почуття провини.'),
      ),
      section(
        'Крок 2 — один документ на 90 днів, не фаза відкриття',
        p('Обсяг, інтеграції, перший вимірюваний ефект: запит, який доходить, бронювання наживо, e-фактура, що виходить. Без Miro на квартал. Якщо не вміємо назвати ефект, повертаємось до аудиту або розходимось. [Візитівка чи воронка](/artykuly/strona-wizytowka-czy-lejek/) вирішується тут, не посеред коду.'),
        ul([
          'Одна провідна конверсія.',
          'Список «поза обсягом» (блоґ, мови, CRM) списаний, не «якось додамо».',
          'Дата staging і дата продакшену з буфером на ваші матеріали — запізнілі фото зсувають календар, не «якість магічно».',
        ]),
      ),
      section(
        'Крок 3 — продакшен, не PDF «як обслуговувати»',
        p('Короткі ітерації, доступ до тестової версії, навчання 1–2 год для команди. Код після рахунків ваш. NDA — стандарт. Не лишаю вас із темою, яку не вмієте оновити, бо не будую стіс плагінів. Стек: зазвичай Astro/Next для сайтів, інтеграції там, де вони є (Previo, шлюз, KSeF).'),
        p('On-site у Тримісті, коли воркшоп із командою має сенс. Віддалено по всій Польщі. Відповідь за один робочий день — SLA, не слоган героя.'),
      ),
      section(
        'Крок 4 — вимір, який може скінчитися правкою, не зникненням',
        p('Порівнюємо до/після: час обслуговування, кількість листів, кількість запитів. Якщо цифри не сідають — правлю. Не гарантую ранжування. Гарантую, що не зникаю після деплою з «успіхів у Google». [Швидкість і SEO](/artykuly/szybkosc-strony-a-seo/) міряємо на продакшені, бо staging бреше іншою мережею і кешем.'),
      ),
      section(
        'Чого немає в онбордингу',
        ol([
          'Фальшивих кейсів «попередній клієнт отримав 300%». Live: Mint і Plumm.',
          'Трьох опікунів, з яких жоден не кодує.',
          'Абонементу «опіка SEO 1500 злотих», який латає WordPress.',
          'iDrive і Agentic як ваш онбординг — поганий продукт, поганий статус live.',
        ]),
      ),
    ],
    faqs: [
      { q: 'Що якщо вже є агенція?', a: 'Можу зайти поряд: модуль, асистент, експорт. Без переписування всього «бо гарніше».' },
      { q: 'Хто пише тексти?', a: 'У пакеті сайту редагую ваші матеріали. Копірайт з нуля поза обсягом або окрема оцінка — це в прайсі, не в сюрпризі.' },
      { q: 'Чи можу побачити staging?', a: 'Так, до продакшену. Це не «довіряйте й чекайте на велике відкриття».' },
      { q: 'Що після 90 днів?', a: 'Або погодинна підтримка, або нічого, якщо сайт стоїть і міряє. Не нав’язую ретейнер.' },
    ],
    ctaTitle: 'Перший крок — 20 хвилин, не бриф на 40 слайдів',
    ctaBody: 'Якщо після дзвінка немає сенсу — закінчуємо. Якщо є: 90 днів з ефектом. [Контакт](/#kontakt).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
