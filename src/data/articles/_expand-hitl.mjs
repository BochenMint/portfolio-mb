import { note, ol, p, section, ul } from './_blocks.mjs'

export const expandHitl = {
  'wdrozyc-chatgpt-w-firmie': {
    pl: [
      section(
        'Co ludzie nazywają „wdrożeniem”, a co jest kontem Team',
        p('Wdrożyć ChatGPT w firmie najczęściej oznacza: ktoś kupił miejsca, wkleił regulamin i uważa temat za zamknięty. To nie jest wdrożenie. To jest subskrypcja. Wdrożenie zaczyna się, gdy nazywamy, które czynności model smie zaproponować, które musi zatwierdzić człowiek, i gdzie ląduje zapis. Bez tego macie wyciek w mailu, halucynację w ofercie dla klienta i zero szansy powiedzieć, kto kliknął „wyślij”.'),
        p('Enterprise/Team zmniejsza ryzyko treningu na Waszych danych. Nie zdejmuje obowiązku, żeby człowiek weryfikował to, co wychodzi na zewnątrz. RODO i AI Act nie są slajdem na końcu oferty. Są powodem, dla którego nie wpinam czatu w goły formularz „bo konkurencja tak ma”. Jeśli prezes chce widget na hero strony firmowej — najpierw [lejek i jedno CTA](/artykuly/lejek-konwersji-na-stronie/), potem ewentualnie asystent z limitami, nie odwrotnie.'),
        ul([
          'Lista systemów, z których model wolno czytać — i z których nie wolno.',
          'Dozwolone akcje: draft maila tak, wysyłka do klienta nie, przelew nigdy.',
          'Eskalacja: kto dostaje ticket, gdy model nie jest pewny albo gdy treść jest na zewnątrz.',
          'Retencja logów: ile dni, kto ma dostęp, co robimy przy żądaniu usunięcia.',
        ]),
      ),
      section(
        'HITL, bez którego „AI w firmie” jest PR-em',
        p('Kontrola człowieka to nie „niech stażysta patrzy”. To allow-lista, wymuszony stop, audyt kroków. W Plumm asystent księgowy eskaluje, zamiast udawać, że deklaracja sama się podpisuje. Ten sam kontrakt przenoszę do firm, które chcą automatyzować oferty, maile albo kwalifikację leadów. [Automatyzacja z kontrolą](/artykuly/automatyzacja-z-kontrola-czlowieka/) jest osobnym artykułem, bo ChatGPT jest tylko jednym z silników, nie religią.'),
        p('Nie obiecuję, że model zastąpi zespół. Obiecuję, że nie sprzedam Wam poczucia nowoczesności za cenę jednego złego maila do kluczowego klienta. Jeśli po dwóch tygodniach wszyscy i tak piszą w Excelu i wklejają do czatu prywatne umowy — wdrożenie nie zaszło. Zaszedł chaos z fajniejszym UI.'),
      ),
      section(
        'Gdzie w ogóle nie wpinam modelu',
        ol([
          'Wysłanie czegokolwiek na zewnątrz bez zatwierdzenia człowieka, który rozumie kontekst.',
          'Księgowanie, przelewy, zmiana cen, usuwanie danych — jako autonadawanie.',
          'Czat na stronie bez logu, bez limitów, z dostępem do CRM „bo wygodnie”.',
          'Szkolenie na danych klientów w narzędziu, którego nie kontrolujecie umową.',
        ]),
        p('To nie jest lęk przed nowością. To rachunek reputacji. Agentic, które buduję wewnętrznie, nie jest produktem z URL-em dla Ciebie — i nie udaję, że „wdrożyłem agentów u dwudziestu korporacji”. Jeśli chcesz agentów na produkcji, zaczynamy od jednej akcji, jednego logu i jednego właściciela. Nie od slajdu ze stadem awatarów.'),
        note('iDrive nie jest live. Nie używam go jako dowodu, że „AI w firmie działa u klientów”. Live są Mint i Plumm — i tam AI nie udaje, że prowadzi hotel albo podpisuje PIT.'),
      ),
      section(
        'Minimalny kontrakt, zanim kupicie kolejny seat',
        p('Jedna osoba odpowiedzialna, nie „zespół innowacji”. Jeden proces, nie cała firma. Jeden tydzień pomiaru: ile draftów przyjęto, ile odrzucono, ile wyszło na zewnątrz. Jeśli nie umiecie tego spisać, zostańcie przy Team bez integracji. To tańsze niż pozory wdrożenia. 20-minutowy audyt może skończyć się „nie wpinajcie tego w formularz”. Wtedy nie sprzedaję Wam sprintu z poczucia winy.'),
        p('Pakiet HITL w ofercie nie jest „ChatGPT w cenie strony”. Jest osobnym zakresem: limity, log, eskalacja, szkolenie. Wizytówka za 6 500–12 000 zł tego nie obejmuje. Jeśli ktoś wrzuca AI do strony firmowej w tej kwocie, ktoś kłamie na temat zakresu albo na temat odpowiedzialności. Wybierzcie, która wersja Was boli mniej — i nie wybierajcie mojej, jeśli chcecie widget za darmo.'),
      ),
    ],
    en: [
      section(
        'What people call a “rollout” versus a Team seat',
        p('Implementing ChatGPT at work usually means: someone bought seats, pasted a policy, and considers the topic closed. That is not a rollout. That is a subscription. A rollout starts when we name which tasks the model may propose, which a human must approve, and where the log lands. Without that you get a leak in email, a hallucination in a client offer, and no way to say who clicked “send”.'),
        p('Enterprise/Team reduces training risk on your data. It does not remove the duty that a human checks what goes outside. GDPR and the AI Act are not a slide at the end of a deck. They are why I do not bolt a chat onto a naked form “because competitors have one”. If the CEO wants a widget on the company-site hero — first a [funnel and one CTA](/artykuly/lejek-konwersji-na-stronie/), then maybe an assistant with limits, not the other way around.'),
        ul([
          'A list of systems the model may read — and must not.',
          'Allowed actions: draft an email yes, send to a client no, a wire never.',
          'Escalation: who gets the ticket when the model is unsure or the copy goes outside.',
          'Log retention: how many days, who has access, what we do on an erasure request.',
        ]),
      ),
      section(
        'HITL without which “AI in the company” is PR',
        p('A human in the loop is not “let the intern watch”. It is an allow-list, a forced stop, an audit of steps. In Plumm the accounting assistant escalates instead of pretending a tax return signs itself. I carry the same contract into firms that want to automate offers, mail or lead qualification. [Automation with control](/artykuly/automatyzacja-z-kontrola-czlowieka/) is a separate article because ChatGPT is one engine, not a religion.'),
        p('I do not promise the model will replace the team. I do promise I will not sell you a feeling of modernity at the price of one bad email to a key client. If after two weeks everyone still writes in Excel and pastes private contracts into chat — there was no rollout. There was chaos with a nicer UI.'),
      ),
      section(
        'Where I refuse to wire a model at all',
        ol([
          'Sending anything outside without approval from a human who understands context.',
          'Booking, wires, price changes, data deletion — as auto-send.',
          'A site chat with no log, no limits, and CRM access “because it is convenient”.',
          'Training on client data in a tool you do not control by contract.',
        ]),
        p('This is not fear of novelty. It is reputation arithmetic. The agentic stack I build internally is not a product with a URL for you — and I do not pretend I “rolled agents out to twenty corporations”. If you want agents in production, we start with one action, one log and one owner. Not a slide with a flock of avatars.'),
        note('iDrive is not live. I do not use it as proof that “AI at work works for clients”. Live are Mint and Plumm — and there AI does not pretend to run a hotel or sign a PIT return.'),
      ),
      section(
        'A minimum contract before you buy another seat',
        p('One accountable person, not an “innovation team”. One process, not the whole firm. One week of measurement: how many drafts accepted, rejected, sent outside. If you cannot write that down, keep Team with no integrations. It is cheaper than the appearance of a rollout. A 20-minute audit may end as “do not wire this into the form”. I will not sell you a guilt sprint after that.'),
        p('The HITL package in the offer is not “ChatGPT included with the website”. It is a separate scope: limits, log, escalation, training. A brochure at PLN 6,500–12,000 does not include it. If someone stuffs AI into a company site at that price, someone is lying about scope or about accountability. Pick which version hurts less — and do not pick mine if you want a free widget.'),
      ),
    ],
    uk: [
      section(
        'Що називають «впровадженням», а що є місцем Team',
        p('Впровадити ChatGPT у фірмі найчастіше означає: хтось купив місця, вставив регламент і вважає тему закритою. Це не впровадження. Це підписка. Впровадження починається, коли називаємо, які дії модель сміє запропонувати, які має затвердити людина, і де сідає запис. Без цього маєте витік у пошті, галюцинацію в оферті клієнту і нуль шансів сказати, хто клікнув «надіслати».'),
        p('Enterprise/Team зменшує ризик тренування на ваших даних. Не знімає обов’язку, щоб людина перевіряла те, що виходить назовні. GDPR і AI Act — не слайд наприкінці оферти. Це причина, чому не встромляю чат у голу форму «бо в конкурентів є». Якщо директор хоче віджет на hero корпоративного сайту — спочатку [воронка і одне CTA](/artykuly/lejek-konwersji-na-stronie/), потім можливо асистент з лімітами, не навпаки.'),
        ul([
          'Список систем, з яких моделі можна читати — і з яких не можна.',
          'Дозволені дії: чернетка листа так, надсилання клієнту ні, переказ ніколи.',
          'Ескалація: хто дістає тікет, коли модель не певна або текст іде назовні.',
          'Ретеція логів: скільки днів, хто має доступ, що робимо на запит видалення.',
        ]),
      ),
      section(
        'HITL, без якого «ШІ у фірмі» є PR',
        p('Контроль людини — не «нехай стажер дивиться». Це allow-list, примусовий стоп, аудит кроків. У Plumm бухгалтерський асистент ескалує, замість удавати, що декларація сама підписується. Той самий контракт переношу у фірми, які хочуть автоматизувати оферти, пошту чи кваліфікацію лідів. [Автоматизація з контролем](/artykuly/automatyzacja-z-kontrola-czlowieka/) — окрема стаття, бо ChatGPT лише один рушій, не релігія.'),
        p('Не обіцяю, що модель замінить команду. Обіцяю, що не продам відчуття сучасності ціною одного поганого листа ключовому клієнту. Якщо за два тижні всі й далі пишуть в Excel і вставляють у чат приватні угоди — впровадження не сталося. Стався хаос із приємнішим UI.'),
      ),
      section(
        'Куди модель не врізаю взагалі',
        ol([
          'Надсилання чогось назовні без затвердження людини, яка розуміє контекст.',
          'Проведення, перекази, зміна цін, видалення даних — як автовідправлення.',
          'Чат на сайті без логу, без лімітів, з доступом до CRM «бо зручно».',
          'Тренування на даних клієнтів в інструменті, якого не контролюєте угодою.',
        ]),
        p('Це не страх новизни. Це арифметика репутації. Agentic, який будую всередині, не є продуктом з URL для вас — і не вдаю, що «впровадив агентів у двадцяти корпораціях». Якщо хочете агентів на продакшені, починаємо з однієї дії, одного логу і одного власника. Не зі слайда зі зграєю аватарів.'),
        note('iDrive не live. Не використовую його як доказ, що «ШІ у фірмі працює в клієнтів». Live — Mint і Plumm, і там ШІ не вдає, що веде готель або підписує PIT.'),
      ),
      section(
        'Мінімальний контракт, перш ніж купувати ще одне місце',
        p('Одна відповідальна людина, не «команда інновацій». Один процес, не вся фірма. Один тиждень виміру: скільки чернеток прийнято, відхилено, вийшло назовні. Якщо цього не вмієте списати, лишіться з Team без інтеграцій. Це дешевше за видимість впровадження. 20-хвилинний аудит може закінчитися «не врізайте це у форму». Тоді не продаю вам спринт із почуття провини.'),
        p('Пакет HITL в оферті — не «ChatGPT у ціні сайту». Це окремий обсяг: ліміти, лог, ескалація, навчання. Візитівка за 6 500–12 000 злотих цього не покриває. Якщо хтось пхає ШІ в корпоративний сайт за цю суму, хтось бреше про обсяг або про відповідальність. Оберіть, яка версія болить менше — і не обирайте мою, якщо хочете віджет безкоштовно.'),
      ),
    ],
  },
  'automatyzacja-z-kontrola-czlowieka': {
    pl: [
      section(
        'Definicja, której używam, gdy ktoś mówi „zautomatyzujmy to”',
        p('Automatyzacja z kontrolą człowieka to nie wolniejszy chatbot. To maszyna, która smie wykonać wyłącznie akcje z listy, zapisuje krok i wie, kiedy się zatrzymać. Jeśli nie umiecie spisać tej listy, nie macie automatyzacji. Macie nadzieję. Nadzieja nie przechodzi audytu, gdy klient dostanie halucynację albo gdy US zapyta, kto zatwierdził dokument.'),
        p('W praktyce HITL wygląda tak: model albo reguła przygotowuje draft, system pokazuje diff, człowiek klika tak/nie/eskaluj. Czasem człowiek jest w pętli zawsze (księgowość, oferta na zewnątrz). Czasem tylko przy niskiej pewności albo przy kwocie powyżej progu. Próg spisujemy. „Jakoś to będzie” nie jest progiem.'),
        ul([
          'Allow-lista akcji — wszystko poza nią jest błędem, nie „kreatywnością modelu”.',
          'Identyfikator kroku i użytkownika. Bez tego nie ma rozmowy o odpowiedzialności.',
          'Kanał eskalacji z SLA, nie kanał memów w Messengerze.',
          'Test na stagingu z danymi, które wolno zepsuć. Produkcja nie jest laboratorium.',
        ]),
      ),
      section(
        'Gdzie HITL spina się z panelem, a gdzie z czatem',
        p('W panelu operacyjnym HITL jest naturalny: stany, role, przycisk. W czacie na stronie jest nienaturalny, bo gość nie jest operatorem, a widget chce być miły. Dlatego rzadko wpinam model w hero wizytówki. Częściej w kolejkę wewnętrzną: draft odpowiedzi, klasyfikacja zgłoszenia, propozycja kolejnego kroku dla człowieka. [Wdrożyć ChatGPT](/artykuly/wdrozyc-chatgpt-w-firmie/) bez tego rozróżnienia to zakup seata, nie systemu.'),
        p('Plumm pokazuje asystenta z eskalacją w produkcie, który sam utrzymuję. Nie pokazuje dwudziestu wdrożeń u obcych biur. Mint pokazuje rezerwacje na własnej domenie, nie „AI concierge, który sam anuluje pobyt”. Granice są częścią oferty. Jeśli chcecie przekroczyć granicę, nazywamy ryzyko i cenę — albo stop.'),
      ),
      section(
        'Błędy, które zabijają HITL w pierwszym miesiącu',
        ol([
          'Brak właściciela: „niech IT i marketing razem popilnują”. Razem znaczy nikt.',
          'Log, którego nikt nie czyta. Zapis bez przeglądu jest alibi, nie kontrolą.',
          'Model z dostępem szerszym niż operator. To nie automatyzacja. To eskalacja w złym kierunku.',
          'Sukces mierzoną liczbą „załatwionych bez człowieka”. Wtedy system uczy się ukrywać niepewność.',
        ]),
        p('Mierzę odwrotnie: ile eskalacji było słusznych, ile draftów odrzucono, ile razy człowiek poprawił treść zanim wyszła. To są zdrowe liczby. Zero eskalacji po tygodniu zwykle znaczy, że limity są martwe albo że nikt nie używa narzędzia.'),
        note('Agentic OS jest narzędziem wewnętrznym. Nie sprzedaję go jako case „dla korporacji”. iDrive nie jest live. HITL opisuję na tym, co mogę utrzymać i pokazać.'),
      ),
      section(
        'Jak zaczynam, gdy automatyzacja ma prawo wejść na produkcję',
        p('Jedna akcja. Jeden tydzień. Jeden log. Potem decyzja: rozszerzyć allow-listę, zostawić, wyłączyć. Pakiet HITL w cenniku nie jest „AI w tle strony”. Jest pracą inżynierską: integracja, limity, szkolenie, pomiar. Jeśli budżet to wizytówka 6 500–12 000 zł, najpierw strona i formularz, które działają. Automatyzacja na zepsutym follow-upie tylko przyspiesza wstyd.'),
        p('20 minut audytu może skończyć się „nie automatyzujcie jeszcze”. To jest sukces, jeśli stop oszczędza wyciek. Jeśli idziemy dalej, spisujemy, która osoba klika w niedzielę, gdy model się zatnie. Bez tej osoby zostajecie z Excelami i czatem. Wtedy uczciwiej nie zaczynać.'),
      ),
    ],
    en: [
      section(
        'The definition I use when someone says “let’s automate it”',
        p('Human-in-the-loop automation is not a slower chatbot. It is a machine that may execute only actions on a list, logs the step, and knows when to stop. If you cannot write that list, you do not have automation. You have hope. Hope does not survive an audit when a client gets a hallucination or the tax office asks who approved a document.'),
        p('In practice HITL looks like this: a model or a rule prepares a draft, the system shows a diff, a human clicks yes/no/escalate. Sometimes a human is always in the loop (accounting, an offer going outside). Sometimes only at low confidence or above a money threshold. We write the threshold down. “It will be fine” is not a threshold.'),
        ul([
          'An allow-list of actions — everything else is an error, not “model creativity”.',
          'A step id and a user id. Without that there is no conversation about accountability.',
          'An escalation channel with an SLA, not a meme channel in Messenger.',
          'A staging test with data you are allowed to break. Production is not a lab.',
        ]),
      ),
      section(
        'Where HITL fits a panel, and where it does not fit a chat',
        p('In an operations panel HITL is natural: states, roles, a button. In a site chat it is unnatural, because the guest is not an operator and the widget wants to be nice. That is why I rarely wire a model into a brochure hero. More often into an internal queue: a reply draft, a ticket class, a next-step suggestion for a human. [Implementing ChatGPT](/artykuly/wdrozyc-chatgpt-w-firmie/) without that distinction is buying a seat, not a system.'),
        p('Plumm shows an assistant with escalation in a product I maintain. It does not show twenty rollouts at other offices. Mint shows booking on your own domain, not an “AI concierge that cancels a stay by itself”. Boundaries are part of the offer. If you want to cross one, we name the risk and the price — or we stop.'),
      ),
      section(
        'Mistakes that kill HITL in the first month',
        ol([
          'No owner: “IT and marketing will watch it together”. Together means nobody.',
          'A log nobody reads. A record without review is an alibi, not control.',
          'A model with broader access than the operator. That is not automation. That is escalation the wrong way.',
          'Success measured as “resolved without a human”. Then the system learns to hide uncertainty.',
        ]),
        p('I measure the other way: how many escalations were right, how many drafts rejected, how often a human edited copy before it left. Those are healthy numbers. Zero escalations after a week usually means limits are dead or nobody uses the tool.'),
        note('Agentic OS is an internal tool. I do not sell it as a “for corporations” case. iDrive is not live. I describe HITL on what I can maintain and show.'),
      ),
      section(
        'How I start when automation may enter production',
        p('One action. One week. One log. Then a decision: extend the allow-list, keep it, switch it off. The HITL package in the price list is not “AI behind the website”. It is engineering: integration, limits, training, measurement. If the budget is a brochure at PLN 6,500–12,000, first a site and a form that work. Automation on a broken follow-up only accelerates embarrassment.'),
        p('A 20-minute audit may end as “do not automate yet”. That is a win if the stop prevents a leak. If we go on, we write down who clicks on Sunday when the model stalls. Without that person you are left with Excel and chat. Then it is more honest not to start.'),
      ),
    ],
    uk: [
      section(
        'Означення, яким користуюся, коли кажуть «давайте автоматизуємо»',
        p('Автоматизація з контролем людини — не повільніший чатбот. Це машина, яка сміє виконати лише дії зі списку, записує крок і знає, коли зупинитися. Якщо список не вмієте списати, автоматизації немає. Є надія. Надія не проходить аудит, коли клієнт дістає галюцинацію або податкова питає, хто затвердив документ.'),
        p('На практиці HITL виглядає так: модель або правило готує чернетку, система показує diff, людина клікає так/ні/ескалувати. Іноді людина в петлі завжди (бухгалтерія, оферта назовні). Іноді лише за низької певності або суми понад поріг. Поріг записуємо. «Якось буде» — не поріг.'),
        ul([
          'Allow-list дій — усе поза ним є помилкою, не «креативністю моделі».',
          'Ідентифікатор кроку й користувача. Без цього немає розмови про відповідальність.',
          'Канал ескалації з SLA, не канал мемів у Messenger.',
          'Тест на staging із даними, які можна зламати. Продакшен — не лабораторія.',
        ]),
      ),
      section(
        'Де HITL сходиться з панеллю, а де не сходиться з чатом',
        p('У операційній панелі HITL природний: стани, ролі, кнопка. У чаті на сайті — ні, бо гість не оператор, а віджет хоче бути милим. Тому рідко врізаю модель у hero візитівки. Частіше у внутрішню чергу: чернетка відповіді, клас звернення, наступний крок для людини. [Впровадити ChatGPT](/artykuly/wdrozyc-chatgpt-w-firmie/) без цього розрізнення — покупка місця, не системи.'),
        p('Plumm показує асистента з ескалацією в продукті, який сам підтримую. Не показує двадцяти впроваджень у чужих бюро. Mint показує бронювання на власному домені, не «AI concierge, який сам скасовує перебування». Межі — частина оферти. Якщо хочете перейти межу, називаємо ризик і ціну — або стоп.'),
      ),
      section(
        'Помилки, які вбивають HITL у перший місяць',
        ol([
          'Немає власника: «нехай ІТ і маркетинг разом постережуть». Разом означає ніхто.',
          'Лог, який ніхто не читає. Запис без перегляду — алібі, не контроль.',
          'Модель із ширшим доступом, ніж оператор. Це не автоматизація. Це ескалація не туди.',
          'Успіх міряють «закрито без людини». Тоді система вчиться ховати непевність.',
        ]),
        p('Міряю навпаки: скільки ескалацій були слушні, скільки чернеток відхилено, скільки разів людина править текст до виходу. Це здорові цифри. Нуль ескалацій за тиждень зазвичай означає, що ліміти мертві або інструментом ніхто не користується.'),
        note('Agentic OS — внутрішній інструмент. Не продаю його як кейс «для корпорацій». iDrive не live. HITL описую на тому, що можу підтримувати і показати.'),
      ),
      section(
        'Як починаю, коли автоматизація має право вийти в продакшен',
        p('Одна дія. Один тиждень. Один лог. Потім рішення: розширити allow-list, лишити, вимкнути. Пакет HITL у прайсі — не «ШІ в тлі сайту». Це інженерна робота: інтеграція, ліміти, навчання, вимір. Якщо бюджет — візитівка 6 500–12 000, спочатку сайт і форма, які працюють. Автоматизація на зламаному follow-up лише прискорює сором.'),
        p('20 хвилин аудиту можуть закінчитися «ще не автоматизуйте». Це успіх, якщо стоп рятує витік. Якщо йдемо далі, записуємо, хто клікає в неділю, коли модель застрягне. Без цієї людини лишаєтесь з Excel і чатом. Тоді чесніше не починати.'),
      ),
    ],
  },
}
