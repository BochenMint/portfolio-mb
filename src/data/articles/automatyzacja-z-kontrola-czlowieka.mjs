import { DATE, note, offerOferta, ol, p, section, ul } from './_blocks.mjs'

export default {
  slug: 'automatyzacja-z-kontrola-czlowieka',
  keyword: 'automatyzacja z kontrolą człowieka',
  keywordEn: 'human-in-the-loop automation',
  keywordUk: 'автоматизація з контролем людини',
  intent: 'informational',
  cluster: 'hitl',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'wdrozyc-chatgpt-w-firmie', anchor: { pl: 'wdrożyć ChatGPT w firmie to za mało', en: 'implementing ChatGPT at work is not enough', uk: 'впровадити ChatGPT у фірмі замало' } },
    { slug: 'panel-operacyjny-zamiast-excela', anchor: { pl: 'panel operacyjny, na którym wisi HITL', en: 'the operations panel HITL hangs on', uk: 'операційна панель, на якій тримається HITL' } },
    { slug: 'ksiegowosc-online-zamiast-excela', anchor: { pl: 'eskalacja do księgowej w Plumm', en: 'escalation to a bookkeeper in Plumm', uk: 'ескалація до бухгалтерки в Plumm' } },
  ],
  offer: [offerOferta()],
  pl: {
    title: 'Automatyzacja z kontrolą człowieka: limity i zapis',
    description:
      'Automatyzacja z kontrolą człowieka (HITL) to dozwolone akcje, zapis kroku i eskalacja. Tłumaczę, czym różni się od czatu bez odpowiedzialności i kiedy w ogóle ma prawo wejść na produkcję.',
    h1: 'Automatyzacja z kontrolą człowieka: limity, zapis, eskalacja — albo nic',
    kicker: 'HITL',
    lead:
      'Automatyzacja bez człowieka w pętli wygląda dobrze na demo i źle w sporze z gościem albo z urzędem. HITL, które wdrażam, nie jest „człowiek klika OK pod każdym tokenem”. Jest listą akcji, których modelowi wolno dotknąć, śladem każdego kroku i progiem pewności, po którym decyzja wraca do operatora. Agentic OS jest silnikiem wewnętrznym — nie sprzedaję go jako paczki z cennika. Na zewnątrz składam ten sam kręgosłup pod Wasz proces.',
    sections: [
      section(
        'Trzy elementy, bez których nie włączam produkcji',
        ol([
          'Allow-list: nic poza uzgodnionym zakresem (wysłać szablon, odczytać status, nie nadać rabatu).',
          'Audit log: kto, co, na jakich danych, jaki wynik, jaka pewność.',
          'Eskalacja: niski score, spór, dane wrażliwe, kwota powyżej progu — człowiek.',
        ]),
        p('Czat, który „robi wszystko”, jest wygodny do pitcha i nie do utrzymania. Gdy klient pyta „dlaczego system obiecał X”, bez logu jesteście bezbronni. Z logiem macie rozmowę, nie teatr.'),
      ),
      section(
        'Gdzie to już siedzi w żywych produktach',
        p('Mint: asystent gościa z kontekstem apartamentu, nie generyczny GPT, i przekazanie człowiekowi. Plumm: pytanie podatkowe po polsku, trudniejsze sprawy do księgowej. Szacunki godzin są orientacyjne i opisane przy tych produktach — nie przenoszę ich na Twoją firmę jako gwarancji.'),
        note('iDrive nie jest live. Agentic nie jest produktem dla Ciebie z URL-em. Zero fałszywych wdrożeń „u dwudziestu korporacji”.'),
      ),
      section(
        'Kiedy HITL jest overkill',
        p('Wewnętrzne szkice maili, burza mózgów, tłumaczenie własnej notatki — wystarczy narzędzie z umową i zakaz wklejania tajemnic. HITL zaczyna się, gdy automat rusza stan świata: zamek, faktura, wiadomość do klienta, zmiana w panelu. Wtedy [wdrożenie ChatGPT jako same miejsca](/artykuly/wdrozyc-chatgpt-w-firmie/) jest za krótkie.'),
        ul([
          'Nie automatyzuję decyzji, których nie umiecie spisać ręcznie.',
          'Nie ukrywam kosztu tokenów — szacunek przed startem.',
          'Nie łączę modelu z korzeniem bazy „na chwilę, zobaczymy”.',
        ]),
      ),
      section(
        'Związek z panelem, nie z widgetem',
        p('HITL wisi na [panelu operacyjnym](/artykuly/panel-operacyjny-zamiast-excela/) albo na wąskiej integracji, nie na dymku na wizytówce. Wizytówka ma formularz. Lejek ma kwalifikację. Panel ma statusy. Model czyta status i wykonuje dozwolony krok. Odwrócona kolejność — najpierw czat, potem proces — kończy się halucynacją w produkcji.'),
      ),
      section(
        'Koszt i uczciwość oferty',
        p('To wycena po audycie, zwykle w pakiecie AI Ops (od 3 000 zł/mies.) albo jako moduł Launch (np. asystent gości). Nie ma pozycji „AI 1999 zł”. Jeśli proces nie jest powtarzalny, mówię nie. Jeśli jest — 20 minut wystarczy, żeby powiedzieć, czy allow-list da się w ogóle napisać.'),
      ),
    ],
    faqs: [
      { q: 'Czy HITL spowalnia automatyzację?', a: 'Tak, w sporach i na krawędzi. To cena za to, że da się spać. Rutyna idzie bez klikania; wyjątek nie idzie bez człowieka.' },
      { q: 'Czy log musi być dostępny dla klienta końcowego?', a: 'Nie. Musi być dostępny dla operatora i do rozliczenia incydentu. Transparentność wobec gościa to inna decyzja produktowa.' },
      { q: 'Czy to samo co RPA?', a: 'RPA klika UI. HITL ogranicza model i człowieka w pętli. Czasem się łączą. Nie sprzedaję magicznego bota-klawiatury jako HITL.' },
      { q: 'Czy Agentic OS mogę kupić?', a: 'Nie jako pudełko. Kupujesz wdrożenie pod Wasze akcje, albo nic. Wewnętrzny silnik zostaje wewnętrzny.' },
    ],
    ctaTitle: 'Spiszmy allow-list, zanim włączymy model',
    ctaBody: 'Jeśli nie da się jej napisać, nie automatyzujemy. [Zakres](/#oferta).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'Human-in-the-loop automation: limits and an audit log',
    description:
      'Human-in-the-loop automation (HITL) is allowed actions, a step log and escalation. I explain how it differs from a chat with no accountability and when it may enter production at all.',
    h1: 'Human-in-the-loop automation: limits, a log, escalation — or nothing',
    kicker: 'HITL',
    lead:
      'Automation without a human in the loop looks good in a demo and bad in a dispute with a guest or the tax office. HITL as I ship it is not “a human clicks OK under every token”. It is a list of actions the model may touch, a trace of every step, and a confidence threshold after which the decision returns to an operator. Agentic OS is an internal engine — I do not sell it as a boxed SKU. Externally I assemble the same spine under your process.',
    sections: [
      section(
        'Three parts I will not skip before production',
        ol([
          'Allow-list: nothing outside the agreed scope (send a template, read a status, do not grant a discount).',
          'Audit log: who, what, on which data, which result, which confidence.',
          'Escalation: low score, a dispute, sensitive data, an amount above a threshold — a human.',
        ]),
        p('A chat that “does everything” is convenient in a pitch and impossible to run. When a client asks “why did the system promise X”, without a log you are defenceless. With a log you have a conversation, not theatre.'),
      ),
      section(
        'Where this already sits in live products',
        p('Mint: a guest assistant with apartment context, not generic GPT, and a hand-off to a human. Plumm: a tax question in Polish, harder cases to a bookkeeper. Hour estimates are directional and described on those products — I do not transfer them onto your firm as a guarantee.'),
        note('iDrive is not live. Agentic is not a product for you with a URL. No fake rollouts “at twenty corporations”.'),
      ),
      section(
        'When HITL is overkill',
        p('Internal mail drafts, brainstorming, translating your own note — a contracted tool and a ban on pasting secrets is enough. HITL starts when automation moves world state: a lock, an invoice, a message to a client, a change in the panel. Then [ChatGPT seats as “implementation”](/artykuly/wdrozyc-chatgpt-w-firmie/) is too short.'),
        ul([
          'I do not automate decisions you cannot write down by hand.',
          'I do not hide token cost — an estimate before go-live.',
          'I do not connect a model to database root “just to see”.',
        ]),
      ),
      section(
        'It hangs on a panel, not a widget',
        p('HITL hangs on an [operations panel](/artykuly/panel-operacyjny-zamiast-excela/) or a narrow integration, not a bubble on a brochure. A brochure has a form. A funnel has qualification. A panel has statuses. The model reads a status and executes an allowed step. Reverse order — chat first, process later — ends as a hallucination in production.'),
      ),
      section(
        'Cost and honesty of the offer',
        p('Priced after the audit, usually inside the AI Ops package (from PLN 3,000/month) or as a Launch module (e.g. a guest assistant). There is no “AI for PLN 1,999” line. If the process is not repetitive, I say no. If it is — twenty minutes is enough to say whether an allow-list can even be written.'),
      ),
    ],
    faqs: [
      { q: 'Does HITL slow automation down?', a: 'Yes, on disputes and at the edge. That is the price of sleeping. Routine goes without a click; the exception does not go without a human.' },
      { q: 'Must the log be visible to the end customer?', a: 'No. It must be available to the operator and for incident review. Transparency toward a guest is a separate product decision.' },
      { q: 'Is this the same as RPA?', a: 'RPA clicks a UI. HITL bounds a model and a human in the loop. Sometimes they combine. I do not sell a magic keyboard-bot as HITL.' },
      { q: 'Can I buy Agentic OS?', a: 'Not as a box. You buy a deployment under your actions, or nothing. The internal engine stays internal.' },
    ],
    ctaTitle: 'Let us write the allow-list before we turn the model on',
    ctaBody: 'If it cannot be written, we do not automate. [Scope](/#oferta).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Автоматизація з контролем людини: ліміти й запис',
    description:
      'Автоматизація з контролем людини (HITL) — дозволені дії, запис кроку й ескалація. Пояснюю, чим вона відрізняється від чату без відповідальності і коли взагалі має право вийти в продакшен.',
    h1: 'Автоматизація з контролем людини: ліміти, запис, ескалація — або нічого',
    kicker: 'HITL',
    lead:
      'Автоматизація без людини в циклі добре виглядає на демо і погано в спорі з гостем або установою. HITL, який впроваджую, — не «людина тисне OK під кожним токеном». Це список дій, яких моделі можна торкатися, слід кожного кроку і поріг певності, після якого рішення повертається оператору. Agentic OS — внутрішній рушій, не коробка з прайса. Назовні складаю той самий хребет під ваш процес.',
    sections: [
      section(
        'Три елементи, без яких не вмикаю продакшен',
        ol([
          'Allow-list: нічого поза узгодженим обсягом (надіслати шаблон, прочитати статус, не давати знижку).',
          'Audit log: хто, що, на яких даних, який результат, яка певність.',
          'Ескалація: низький score, спір, чутливі дані, сума понад поріг — людина.',
        ]),
        p('Чат, який «робить усе», зручний для пітча і незручний для підтримки. Коли клієнт питає «чому система пообіцяла X», без логу ви беззахисні. З логом маєте розмову, не театр.'),
      ),
      section(
        'Де це вже сидить у живих продуктах',
        p('Mint: асистент гостя з контекстом апартаментів, не генеричний GPT, і передача людині. Plumm: податкове питання польською, складніші справи — бухгалтерці. Оцінки годин орієнтовні й описані при цих продуктах — не переношу їх на вашу фірму як гарантію.'),
        note('iDrive не live. Agentic не продукт для вас з URL. Нуль фальшивих впроваджень «у двадцяти корпораціях».'),
      ),
      section(
        'Коли HITL — overkill',
        p('Внутрішні чернетки листів, мозковий штурм, переклад власної нотатки — досить інструменту з договором і заборони вставляти таємниці. HITL починається, коли автомат рухає стан світу: замок, рахунок, повідомлення клієнту, зміна в панелі. Тоді [впровадження ChatGPT як самі місця](/artykuly/wdrozyc-chatgpt-w-firmie/) закоротке.'),
        ul([
          'Не автоматизую рішення, яких не вмієте списати вручну.',
          'Не ховаю вартість токенів — оцінка до старту.',
          'Не з’єдную модель із коренем бази «на хвилинку, подивимось».',
        ]),
      ),
      section(
        'Зв’язок із панеллю, не з віджетом',
        p('HITL тримається на [операційній панелі](/artykuly/panel-operacyjny-zamiast-excela/) або вузькій інтеграції, не на бульбашці на візитівці. Візитівка має форму. Воронка має кваліфікацію. Панель має статуси. Модель читає статус і виконує дозволений крок. Зворотний порядок — спочатку чат, потім процес — закінчується галюцинацією в продакшені.'),
      ),
      section(
        'Вартість і чесність оферти',
        p('Оцінка після аудиту, зазвичай у пакеті AI Ops (від 3 000 злотих/міс.) або як модуль Launch (наприклад асистент гостей). Немає позиції «ШІ 1999 злотих». Якщо процес не повторюваний — кажу ні. Якщо так — 20 хвилин досить, щоб сказати, чи allow-list узагалі можна написати.'),
      ),
    ],
    faqs: [
      { q: 'Чи HITL сповільнює автоматизацію?', a: 'Так, у спорах і на краї. Це ціна за те, що можна спати. Рутина йде без кліку; виняток не йде без людини.' },
      { q: 'Чи лог має бути доступний кінцевому клієнту?', a: 'Ні. Має бути доступний оператору і для розбору інциденту. Прозорість перед гостем — окреме продуктове рішення.' },
      { q: 'Чи це те саме, що RPA?', a: 'RPA клікає UI. HITL обмежує модель і людину в циклі. Інколи поєднуються. Не продаю магічного бота-клавіатуру як HITL.' },
      { q: 'Чи можу купити Agentic OS?', a: 'Не як коробку. Купуєте впровадження під ваші дії, або нічого. Внутрішній рушій лишається внутрішнім.' },
    ],
    ctaTitle: 'Спишімо allow-list, перш ніж увімкнути модель',
    ctaBody: 'Якщо її не можна написати, не автоматизуємо. [Обсяг](/#oferta).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
