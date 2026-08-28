import { DATE, note, offerOferta, ol, p, section, ul } from './_blocks.mjs'

export default {
  slug: 'wdrozyc-chatgpt-w-firmie',
  keyword: 'wdrożyć ChatGPT w firmie',
  keywordEn: 'implement ChatGPT in a company',
  keywordUk: 'впровадити ChatGPT у фірмі',
  intent: 'commercial',
  cluster: 'hitl',
  published: DATE,
  modified: DATE,
  related: [
    { slug: 'automatyzacja-z-kontrola-czlowieka', anchor: { pl: 'automatyzacja z kontrolą człowieka — limity i zapis', en: 'human-in-the-loop automation — limits and a log', uk: 'автоматизація з контролем людини — ліміти й запис' } },
    { slug: 'saas-czy-wlasny-panel', anchor: { pl: 'zakup miejsc w ChatGPT to nie panel operacyjny', en: 'buying ChatGPT seats is not an operations panel', uk: 'купівля місць у ChatGPT — не операційна панель' } },
    { slug: 'audyt-strony-internetowej', anchor: { pl: 'audyt zanim wkleicie dane firmy w czat', en: 'an audit before you paste company data into a chat', uk: 'аудит, перш ніж вставляти дані фірми в чат' } },
  ],
  offer: [offerOferta()],
  pl: {
    title: 'Wdrożyć ChatGPT w firmie to za mało. Potrzebny HITL',
    description:
      'Wdrożyć ChatGPT w firmie to nie kupić miejsca Team. Ryzyko: wyciek, halucynacja, brak zapisu. Opisuję HITL: dozwolone akcje, eskalacja, log — bez obietnicy, że AI zastąpi zespół.',
    h1: 'Wdrożyć ChatGPT w firmie: miejsca w czacie to nie wdrożenie',
    kicker: 'HITL AI',
    lead:
      '„Wdrożyliśmy ChatGPT” często znaczy: ktoś rozdał loginy i ludzie wklejają umowy do publicznej wersji. To nie jest wdrożenie. To shadow AI z ładniejszą nazwą. Prawdziwe wdrożenie, które robię, ma listę dozwolonych akcji, zapis kto/co/dlaczego i człowieka przy niskiej pewności. Nazywam to HITL — human in the loop — nie „asystent 24/7 bez odpowiedzialności”. AI nie zastępuje zespołu. Przejmuje powtarzalne kroki, które da się ograniczyć.',
    sections: [
      section(
        'Trzy ryzyka, których nie załatwi prompt „bądź profesjonalny”',
        ul([
          'Wyciek: umowa, PESEL, kod, cennik w publicznym modelu.',
          'Halucynacja: przekonująca odpowiedź, której nie było w ofercie — idzie do klienta.',
          'Brak audytu: po incydencie nie odtworzysz, kto co wkleił.',
        ]),
        p('Polityka AI na papierze bez kontroli technicznej umiera w tydzień. Enterprise/Team zmniejsza trening na Waszych danych — nie zdejmuje obowiązku, żeby człowiek weryfikował to, co wychodzi na zewnątrz. RODO i AI Act nie są slajdem na końcu oferty; są powodem, dla którego nie wpinam czatu w goły formularz „bo tak robi konkurencja”.'),
        note('Nie jestem kancelarią. Nie sprzedaję compliance pack. Sprzedaję ograniczenie akcji w systemie, który da się audytować. Interpretację prawną zostawiam prawnikowi.'),
      ),
      section(
        'Co wdrażam zamiast widgetu na wizytówce',
        p('Na [stronie firmowej](/artykuly/strona-firmowa-b2b/) czat AI jest zwykle złym CTA: zgaduje, nie zbiera kwalifikacji, nie zostawia SLA. Najpierw formularz i człowiek. Asystenta dokładam, gdy jest kontekst (apartament, faktura, status zlecenia) i lista rzeczy, których modelowi nie wolno zrobić: nie nadać zniżki, nie obiecać terminu urzędowego, nie otworzyć zamka bez reguły.'),
        p('W Mint asystent gościa ma kontekst lokalu i eskalację. W Plumm asystent podatkowy oddaje trudne sprawy księgowej. Agentic OS jest narzędziem wewnętrznym — nie case’em „u klienta z ulicy”. Nie opowiadam o iDrive jako live.'),
      ),
      section(
        'HITL w jednym zdaniu i w checklistie',
        p('Model proponuje albo wykonuje tylko to, co jest na liście; przy wątpliwości oddaje; każdy krok ma ślad. Szerszy opis: [automatyzacja z kontrolą człowieka](/artykuly/automatyzacja-z-kontrola-czlowieka/).'),
        ol([
          'Inwentaryzacja: gdzie już wklejacie dane (to zwykle więcej niż myślicie).',
          'Klasy danych: czego nigdy nie wolno wklejać do publicznego czatu.',
          'Narzędzie z umową (nie darmowy web) albo izolacja.',
          'Dozwolone akcje w Waszym panelu, nie uniwersalny agent z korzeniem systemu.',
          'Eskalacja i koszt zanim włączymy produkcję — bez niespodzianki na fakturze API.',
        ]),
      ),
      section(
        'Cena i pakiet: to nie jest strona za 8 tysięcy',
        p('Asystent z HITL wchodzi w wycenę po audycie, zwykle przy Conversion Build albo Ops, nie w pakiecie wizytówki. 20 minut bezpłatnie mówi, czy w ogóle macie proces, który wolno automatyzować. Jeśli nie — kupujecie szkolenie i zakaz publicznego czatu, nie silnik. Wolę to powiedzieć niż wpiąć GPT w Excel i nazwać to transformacją.'),
      ),
      section(
        'Czego nie obiecuję',
        ul([
          'Że model nie halucynuje — dlatego jest człowiek.',
          'Że zastąpicie recepcję albo księgową w sporze.',
          'Że „oszczędzicie 80% etatu” — nie mam takiej statystyki do publikacji.',
          'Fałszywych opinii z wdrożeń AI, których nie ma na liście live proof.',
        ]),
      ),
    ],
    faqs: [
      { q: 'Czy wystarczy ChatGPT Team dla całej firmy?', a: 'Jako narzędzie do szkiców — może. Jako system, który gada z klientem albo rusza dane — nie, dopóki nie ma limitów, logu i eskalacji.' },
      { q: 'Czy budujesz agentów autonomicznych?', a: 'Buduję procesy z dozwolonymi akcjami. Autonomia bez listy i zapisu to ryzyko, którego nie biorę na produkcję u klienta.' },
      { q: 'Ile to trwa?', a: 'Zależnie od integracji, zwykle tygodnie w ramach większego wdrożenia, nie „plugin w piątek”. Najpierw audyt procesu.' },
      { q: 'Czy to legalne przy AI Act?', a: 'Zależy od zastosowania. Unikam systemów, które podejmują decyzje wysokiego ryzyka bez człowieka. Szczegóły — z Waszym prawnikiem, nie z modelem.' },
    ],
    ctaTitle: 'Zanim rozdacie loginy, spiszmy dozwolone akcje',
    ctaBody: '20 minut: shadow AI, HITL albo nic nie wdrażać. [Zakres](/#oferta).',
    ctaLabel: 'Umów 20-min audyt',
  },
  en: {
    title: 'Implementing ChatGPT at work is not a deployment',
    description:
      'Implementing ChatGPT in a company is not buying Team seats. Risk: leaks, hallucinations, no log. I describe HITL: allowed actions, escalation, an audit trail — no promise that AI replaces the team.',
    h1: 'Implementing ChatGPT at work: chat seats are not a deployment',
    kicker: 'HITL AI',
    lead:
      '“We implemented ChatGPT” often means someone handed out logins and people paste contracts into the public model. That is not a deployment. That is shadow AI with a nicer name. A real deployment I ship has an allow-list of actions, a log of who/what/why, and a human at low confidence. I call it HITL — human in the loop — not “24/7 assistant with no accountability”. AI does not replace the team. It takes repetitive steps you can bound.',
    sections: [
      section(
        'Three risks a “be professional” prompt will not fix',
        ul([
          'Leak: a contract, personal data, code, a price list in a public model.',
          'Hallucination: a convincing answer that was never in the offer — sent to the client.',
          'No audit: after an incident you cannot reconstruct who pasted what.',
        ]),
        p('An AI policy on paper without technical control dies in a week. Enterprise/Team reduces training on your data — it does not remove the duty that a human checks what goes outside. GDPR and the AI Act are not a slide at the end of a deck; they are why I do not bolt a chat onto a naked form “because competitors do”.'),
        note('I am not a law firm. I do not sell a compliance pack. I sell action limits in a system you can audit. Legal interpretation stays with your lawyer.'),
      ),
      section(
        'What I ship instead of a widget on a brochure',
        p('On a [company website](/artykuly/strona-firmowa-b2b/) an AI chat is usually a bad CTA: it guesses, it does not qualify, it leaves no SLA. Form and human first. I add an assistant when there is context (apartment, invoice, job status) and a list of things the model must not do: no discount, no official deadline promise, no lock open without a rule.'),
        p('At Mint the guest assistant has listing context and escalation. At Plumm the tax assistant hands hard cases to a bookkeeper. Agentic OS is internal — not a “street client” case. I do not present iDrive as live.'),
      ),
      section(
        'HITL in one sentence and a checklist',
        p('The model proposes or executes only what is on the list; on doubt it hands over; every step has a trace. Longer form: [human-in-the-loop automation](/artykuly/automatyzacja-z-kontrola-czlowieka/).'),
        ol([
          'Inventory: where you already paste data (usually more than you think).',
          'Data classes: what must never go into a public chat.',
          'A contracted tool (not the free web) or isolation.',
          'Allowed actions in your panel, not a universal agent with root on the system.',
          'Escalation and cost before production — no surprise on the API invoice.',
        ]),
      ),
      section(
        'Price and package: this is not an PLN 8k website',
        p('A HITL assistant is priced after the audit, usually inside Conversion Build or Ops, not the brochure package. Twenty free minutes says whether you even have a process that may be automated. If not — you buy training and a ban on public chat, not an engine. I would rather say that than wire GPT into Excel and call it transformation.'),
      ),
      section(
        'What I will not promise',
        ul([
          'That the model will not hallucinate — that is why a human is there.',
          'That you will replace a desk or a bookkeeper in a dispute.',
          'That you will “save 80% of a headcount” — I have no such statistic to publish.',
          'Fake AI-rollout testimonials that are not on the live-proof list.',
        ]),
      ),
    ],
    faqs: [
      { q: 'Is ChatGPT Team enough for the whole company?', a: 'As a drafting tool — maybe. As a system that talks to clients or moves data — not until there are limits, a log and escalation.' },
      { q: 'Do you build autonomous agents?', a: 'I build processes with allowed actions. Autonomy without a list and a log is a risk I will not take to production at a client.' },
      { q: 'How long does it take?', a: 'Depends on integrations, usually weeks inside a larger build, not “a plugin on Friday”. Process audit first.' },
      { q: 'Is this lawful under the AI Act?', a: 'It depends on the use. I avoid systems that take high-risk decisions without a human. Detail — with your lawyer, not with the model.' },
    ],
    ctaTitle: 'Before you hand out logins, let us write the allow-list',
    ctaBody: 'Twenty minutes: shadow AI, HITL, or ship nothing. [Scope](/#oferta).',
    ctaLabel: 'Book a 20-min audit',
  },
  uk: {
    title: 'Впровадити ChatGPT у фірмі замало. Потрібен HITL',
    description:
      'Впровадити ChatGPT у фірмі — не купити місця Team. Ризик: витік, галюцинація, немає запису. Описую HITL: дозволені дії, ескалація, лог — без обіцянки, що ШІ замінить команду.',
    h1: 'Впровадити ChatGPT у фірмі: місця в чаті — не впровадження',
    kicker: 'HITL AI',
    lead:
      '«Впровадили ChatGPT» часто означає: хтось роздав логіни і люди вставляють договори в публічну версію. Це не впровадження. Це shadow AI з красивішою назвою. Справжнє впровадження, яке я роблю, має список дозволених дій, запис хто/що/чому і людину при низькій певності. Називаю це HITL — human in the loop — не «асистент 24/7 без відповідальності». ШІ не замінює команду. Перебирає повторювані кроки, які можна обмежити.',
    sections: [
      section(
        'Три ризики, яких не закриє промпт «будь професійним»',
        ul([
          'Витік: договір, персональні дані, код, прайс у публічній моделі.',
          'Галюцинація: переконлива відповідь, якої не було в оферті — іде клієнту.',
          'Немає аудиту: після інциденту не відтворите, хто що вставив.',
        ]),
        p('Політика ШІ на папері без технічного контролю помирає за тиждень. Enterprise/Team зменшує тренування на ваших даних — не знімає обов’язок, щоб людина перевіряла те, що виходить назовні. GDPR і AI Act — не слайд наприкінці оферти; вони причина, чому я не встромляю чат у голу форму «бо так робить конкуренція».'),
        note('Я не юридична фірма. Не продаю compliance pack. Продаю обмеження дій у системі, яку можна аудитувати. Тлумачення права лишаю вашому юристу.'),
      ),
      section(
        'Що впроваджую замість віджета на візитівці',
        p('На [корпоративному сайті](/artykuly/strona-firmowa-b2b/) чат ШІ зазвичай погане CTA: вгадує, не кваліфікує, не лишає SLA. Спочатку форма й людина. Асистента додаю, коли є контекст (апартаменти, рахунок, статус замовлення) і список речей, яких моделі не можна: не давати знижку, не обіцяти термін установи, не відкривати замок без правила.'),
        p('У Mint асистент гостя має контекст локації й ескалацію. У Plumm податковий асистент віддає складні справи бухгалтерці. Agentic OS — внутрішній інструмент, не кейс «клієнта з вулиці». Не розповідаю про iDrive як live.'),
      ),
      section(
        'HITL одним реченням і в чеклісті',
        p('Модель пропонує або виконує лише те, що в списку; при сумніві віддає; кожен крок має слід. Ширше: [автоматизація з контролем людини](/artykuly/automatyzacja-z-kontrola-czlowieka/).'),
        ol([
          'Інвентаризація: куди вже вставляєте дані (зазвичай більше, ніж думаєте).',
          'Класи даних: чого ніколи не можна вставляти в публічний чат.',
          'Інструмент із договором (не безкоштовний веб) або ізоляція.',
          'Дозволені дії у вашій панелі, не універсальний агент із коренем системи.',
          'Ескалація і вартість до продакшену — без сюрпризу на рахунку API.',
        ]),
      ),
      section(
        'Ціна і пакет: це не сайт за 8 тисяч',
        p('Асистент з HITL входить в оцінку після аудиту, зазвичай у Conversion Build або Ops, не в пакет візитівки. 20 безкоштовних хвилин каже, чи взагалі є процес, який можна автоматизувати. Якщо ні — купуєте навчання і заборону публічного чату, не рушій. Краще сказати це, ніж встромити GPT в Excel і назвати трансформацією.'),
      ),
      section(
        'Чого не обіцяю',
        ul([
          'Що модель не галюцинує — тому є людина.',
          'Що заміните ресепшен або бухгалтерку в спорі.',
          'Що «заощадите 80% ставки» — такої статистики не маю для публікації.',
          'Фальшивих відгуків з впроваджень ШІ, яких немає в live proof.',
        ]),
      ),
    ],
    faqs: [
      { q: 'Чи досить ChatGPT Team для всієї фірми?', a: 'Як інструмент для чернеток — можливо. Як система, що говорить із клієнтом або рухає дані — ні, доки немає лімітів, логу й ескалації.' },
      { q: 'Чи будуєте автономних агентів?', a: 'Будую процеси з дозволеними діями. Автономія без списку й запису — ризик, якого не беру в продакшен у клієнта.' },
      { q: 'Скільки це триває?', a: 'Залежно від інтеграцій, зазвичай тижні в межах більшого впровадження, не «плагін у п’ятницю». Спочатку аудит процесу.' },
      { q: 'Чи це законно за AI Act?', a: 'Залежить від застосування. Уникаю систем, що ухвалюють рішення високого ризику без людини. Деталі — з вашим юристом, не з моделлю.' },
    ],
    ctaTitle: 'Перш ніж роздати логіни, спишімо дозволені дії',
    ctaBody: '20 хвилин: shadow AI, HITL або нічого не впроваджувати. [Обсяг](/#oferta).',
    ctaLabel: 'Записатися на 20-хв аудит',
  },
}
