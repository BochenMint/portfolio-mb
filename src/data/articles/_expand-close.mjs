import { p, section } from './_blocks.mjs'

function S(pl, en, uk) {
  return { pl: [pl], en: [en], uk: [uk] }
}

export const expandClose = {
  'audyt-strony-internetowej': S(
    section(
      'Jak umawiamy sprint, żeby nie zmarnować tygodnia',
      p('Audit Sprint nie startuje z „wyślijcie dostęp do wszystkiego”. Najpierw 20 minut: czy w ogóle jest o czym mówić. Jeśli tak, spisuję jakie dostępy są potrzebne i w jakim oknie. Analityka, nagrania, skrzynka — bez tego mapa będzie grzeczna i bezużyteczna. Nie przeciągam kick-offu na trzy spotkania statusowe. Jedno wejście, jeden dokument, decyzja. Jeśli w trakcie okazuje się, że nie ma właściciela po Waszej stronie, zatrzymuję zegar. Lepiej przerwać niż wystawić fakturę za PDF, który umrze w Drive.'),
      p('Po sprincie nie ma „a może jeszcze raz przelecimy hero”. Jest 30/60/90 albo stop. Jeśli idziemy we wdrożenie, zaliczenie kwoty jest w umowie, nie w obietnicy na callu. Jeśli nie idziemy, zostajecie z mapą. To jedyny audyt strony internetowej, który chcę sprzedawać: taki, po którym ktoś może powiedzieć nie. Reszta rynku sprzedaje checklisty, które zawsze kończą się „trzeba więcej SEO”.'),
    ),
    section(
      'How we book the sprint so a week is not wasted',
      p('Audit Sprint does not start with “send access to everything”. First 20 minutes: whether there is anything to talk about. If yes, I write down which access is needed and in which window. Analytics, recordings, the inbox — without that the map will be polite and useless. I do not stretch kick-off into three status meetings. One entry, one document, a decision. If mid-way there is no owner on your side, I stop the clock. Better to halt than invoice a PDF that will die in Drive.'),
      p('After the sprint there is no “maybe we pass the hero again”. There is 30/60/90 or a stop. If we go to a build, crediting the fee is in the contract, not a promise on a call. If we do not, you keep the map. That is the only website audit I want to sell: one after which someone may say no. The rest of the market sells checklists that always end in “you need more SEO”.'),
    ),
    section(
      'Як призначаємо спринт, щоб не змарнувати тиждень',
      p('Audit Sprint не стартує з «надішліть доступ до всього». Спочатку 20 хвилин: чи взагалі є про що говорити. Якщо так, списую, які доступи потрібні і в якому вікні. Аналітика, записи, скринька — без цього мапа буде ввічлива і марна. Не розтягую kick-off на три статус-мітинги. Один вхід, один документ, рішення. Якщо посередині немає власника з вашого боку, зупиняю годинник. Краще перервати, ніж виставити рахунок за PDF, який помре в Drive.'),
      p('Після спринту немає «а може ще раз проженемо hero». Є 30/60/90 або стоп. Якщо йдемо у впровадження, зарахування суми є в угоді, не в обіцянці на дзвінку. Якщо ні — лишаєтесь із мапою. Це єдиний аудит сайту, який хочу продавати: такий, після якого хтось може сказати ні. Решта ринку продає чеклісти, які завжди кінчаються «треба більше SEO». Живий доказ, який клікаємо разом, — Mint Apartments і Plumm. iDrive не live. Agentic внутрішній. Аудит не стоїть на чужих кейсах з LinkedIn.'),
    ),
  ),
  'automatyzacja-z-kontrola-czlowieka': S(
    section(
      'Minimalny tydzień, po którym wiemy czy iść dalej',
      p('Jedna akcja z allow-listy, staging, log, człowiek z prawem stopu. Po siedmiu dniach: ile eskalacji, ile odrzuceń, ile poprawek przed wyjściem na zewnątrz. Jeśli liczby są zerowe, narzędzie jest martwe albo limity są fikcją. Wtedy wyłączamy, nie „doszlifujemy prompt”. Automatyzacja z kontrolą człowieka nie zasługuje na drugi miesiąc licencji, gdy pierwszy tydzień nie zostawił śladu. Właściciel procesu musi mieć kalendarz w niedzielę — inaczej wrócicie do Excela i czatu, tylko z gorszym sumieniem.'),
      p('Nie mieszam tego z czatem na hero wizytówki. Gość nie jest operatorem, widget chce być miły, a miły model bez allow-listy jest wyciekiem. Wewnętrzna kolejka: draft, klasyfikacja, propozycja kroku. Zewnętrzna wysyłka tylko po człowieku. Jeśli prezes chce „AI na stronie” w cenie 8 tysięcy, mówię nie. To nie jest HITL. To jest naklejka. Log, którego nikt nie czyta, też jest naklejką — tylko droższą. Przegląd raz w tygodniu albo wyłączamy narzędzie.'),
      p('Pakiet HITL w ofercie jest pracą inżynierską, nie naklejką AI na wizytówce. Pakiet Start (od 2 000 zł) tego nie obejmuje. Jeśli budżet to tylko strona, najpierw formularz i follow-up. Przyspieszenie chaosu nie jest transformacją. 20 minut audytu wolno zakończyć słowami „nie automatyzujcie jeszcze”. To jest kontrola. Reszta jest teatrem seata. Jeśli po tygodniu nie ma logu, nie ma wdrożenia — jest czat z ładniejszym oknem i ryzykiem, którego nie umiecie nazwać przed klientem ani przed US. Wtedy uczciwiej wrócić do ręcznej kolejki i jednego właściciela, niż udawać automatyzację.'),
    ),
    section(
      'A minimum week after which we know whether to continue',
      p('One allow-listed action, staging, a log, a human with a stop right. After seven days: how many escalations, rejections, edits before copy left. If the numbers are zero, the tool is dead or the limits are fiction. Then we switch off, we do not “polish the prompt”. Human-in-the-loop automation does not deserve a second month of licence when the first week left no trail. The process owner must have a Sunday calendar — otherwise you return to Excel and chat, only with a worse conscience.'),
      p('The HITL package in the offer is engineering, not an AI sticker on a brochure. The Start package (from PLN 2,000) does not include it. If the budget is only a site, first the form and follow-up. Speeding up chaos is not transformation. A 20-minute audit may end as “do not automate yet”. That is control. The rest is seat theatre.'),
    ),
    section(
      'Мінімальний тиждень, після якого знаємо, чи йти далі',
      p('Одна дія з allow-list, staging, лог, людина з правом стопу. Після семи днів: скільки ескалацій, відхилень, правок перед виходом назовні. Якщо цифри нуль, інструмент мертвий або ліміти фікція. Тоді вимикаємо, не «дошліфуємо промпт». Автоматизація з контролем людини не заслуговує на другий місяць ліцензії, коли перший тиждень не лишив сліду. Власник процесу мусить мати календар у неділю — інакше вернетесь до Excel і чату, лише з гіршим сумлінням.'),
      p('Пакет HITL в оферті — інженерна робота, не наліпка ШІ на візитівці. Пакет Start (від 2 000) цього не покриває. Якщо бюджет лише сайт, спочатку форма і follow-up. Прискорення хаосу не є трансформацією. 20 хвилин аудиту можна закінчити словами «ще не автоматизуйте». Це контроль. Решта — театр місця. Якщо за тиждень немає логу, немає впровадження — є чат із гарнішим вікном і ризиком, якого не вмієте назвати перед клієнтом і перед податковою. Тоді чесніше повернутися до ручної черги й одного власника, ніж удавати автоматизацію.'),
    ),
  ),
  'dlaczego-strona-nie-sprzedaje': S(
    section(
      'Co robię, gdy ktoś chce „po prostu nowy layout”',
      p('Proszę o trzy rzeczy zanim otworzę Figma: źródło zapytań, nagranie mobile, czas odpowiedzi. Jeśli ich nie ma, mówię wprost, że kupujecie tapetę. Czasem tapeta jest OK — marka, wstyd za starą stronę, ciepły ruch z poleceń. Wtedy wizytówka. Czasem tapeta jest droższa niż prawda: płacicie za Ads na ciężki hero, a maile leżą trzy dni. Wtedy layout jest wrogiem. Nie potrzebujecie mnie do wyboru fontu. Potrzebujecie wiadra. Audit Sprint kosztuje mniej niż rebrand, który nie trafia w wiadro.'),
      p('Nie publikuję magicznych procentów „strony, które zaczęły sprzedawać po redesignie”. Mint i Plumm są po to, żeby kliknąć działającą ścieżkę, nie żeby udawać, że każdy biznes po nowym H1 rośnie. Jeśli po diagnozie usłyszysz „nie wdrażaj”, weź to jako oszczędność. Rynek chętnie sprzeda Ci ładniej. Ja wolę powiedzieć, który z trzech powodów zabija sprzedaż — i który pakiet w ogóle ma prawo się spiąć.'),
    ),
    section(
      'What I do when someone wants “just a new layout”',
      p('I ask for three things before I open Figma: enquiry sources, a mobile recording, reply time. If they are missing, I say outright you are buying wallpaper. Sometimes wallpaper is fine — brand, shame about the old site, warm referral traffic. Then a brochure. Sometimes wallpaper is more expensive than the truth: you pay for Ads onto a heavy hero while mail sits three days. Then layout is the enemy. You do not need me to pick a font. You need a bucket. Audit Sprint costs less than a rebrand that misses the bucket.'),
      p('I do not publish magic percentages of “sites that started selling after a redesign”. Mint and Plumm exist so you can click a working path, not so I can pretend every business grows after a new H1. If after diagnosis you hear “do not ship”, take it as a saving. The market will gladly sell you prettier. I would rather name which of the three reasons kills sales — and which package even has a right to pay back.'),
    ),
    section(
      'Що роблю, коли хтось хоче «просто новий макет»',
      p('Прошу три речі, перш ніж відкрити Figma: джерело запитів, запис mobile, час відповіді. Якщо їх немає, кажу прямо, що купуєте шпалери. Іноді шпалери ОК — марка, сором за старий сайт, теплий трафік з рекомендацій. Тоді візитівка. Іноді шпалери дорожчі за правду: платите за Ads на важкий hero, а листи лежать три дні. Тоді макет — ворог. Вам не я потрібен до вибору шрифту. Потрібне відро. Audit Sprint дешевший за ребренд, який не влучає у відро.'),
      p('Не публікую магічних відсотків «сайтів, які почали продавати після редизайну». Mint і Plumm існують, щоб клікнути робочий шлях, не щоб удавати, що кожен бізнес після нового H1 росте. Якщо після діагнозу почуєте «не впроваджуйте», візьміть це як економію. Ринок охоче продасть гарніше. Я краще назву, яка з трьох причин вбиває продаж — і який пакет узагалі має право окупитися. «Зробіть гарніше» без відра — найдорожча гіпотеза в брифі.'),
    ),
  ),
  'ile-kosztuje-strona-firmowa': S(
    section(
      'Jak nie dać się porównać jak identyczne pudełka',
      p('Gdy ktoś kładzie obok siebie 4 000 zł „strony firmowej z AI” i mój pakiet Launch od 8 000 zł, nie konkurujemy. Porównujecie motyw z customem, obietnicę pozycji z titlem, sklep z formularzem — moja wizytówka Start startuje od 2 000 zł, Launch dokłada lejek i integracje. Proście o stack, o to czy kod jest Wasz, o limit poprawek po starcie, o języki. PL/EN/UA i hreflang to nie „włącznik w panelu”. To trzy LCP i trzy copy. 20 minut audytu jest tańsze niż zły przelew. Jeśli po nich usłyszysz, że potrzebujecie lejka albo nic — to też jest odpowiedź na pytanie, ile kosztuje strona firmowa: czasem zero złotych plus odwaga, żeby nie kupować.'),
    ),
    section(
      'How not to be compared as identical boxes',
      p('When someone puts a PLN 4,000 “company site with AI” next to my Launch package from PLN 8,000, we are not competing. You are comparing a theme with custom work, a ranking promise with a title tag, a shop with a form — my Start brochure starts from PLN 2,000, Launch adds the funnel and integrations. Ask about the stack, whether the code is yours, the post-launch fix cap, languages. PL/EN/UA and hreflang are not a “toggle in the panel”. They are three LCPs and three copies. A 20-minute audit is cheaper than a bad transfer. If after it you hear you need a funnel or nothing — that is also an answer to what a company website costs: sometimes zero zloty plus the courage not to buy.'),
    ),
    section(
      'Як не дати порівняти себе як однакові коробки',
      p('Коли хтось кладе поруч 4 000 «сайту компанії з ШІ» і мій пакет Launch від 8 000, ми не конкуруємо. Ви порівнюєте тему з custom, обіцянку позиції з title, магазин із формою — моя візитівка Start починається від 2 000, Launch додає воронку та інтеграції. Просіть стек, чи код ваш, ліміт правок після старту, мови. PL/EN/UA і hreflang — не «вимикач у панелі». Це три LCP і три копії. 20 хвилин аудиту дешевші за поганий переказ. Якщо після них почуєте, що потрібна воронка або нічого — це теж відповідь на те, скільки коштує корпоративний сайт: іноді нуль злотих плюс сміливість не купувати.'),
    ),
  ),
  'ksiegowosc-online-zamiast-excela': S(
    section(
      'Jak wygląda decyzja „zostaję przy biurze / arkuszu / Plumm”',
      p('Na kartce: godziny ostatniego miesiąca, terminy na styk, czy ktoś poza Tobą umie otworzyć plik. Jeśli wolisz telefon o 22:00 w kwietniu — biuro. Jeśli wolisz nie klikać — też biuro albo arkusz z dyscypliną. Jeśli wolisz produkt ze śladem, e-fakturą i eskalacją — wejdź na Plumm i oceń sam. Nie zamykam Cię slajdem ROI. Hipoteza 12–20 h i 300–600 zł zostaje hipotezą, dopóki nie zmierzysz swojego miesiąca. Księgowość online zamiast Excela jest narzędziem, nie religią. Model nie podpisuje PIT. Ty podpisujesz. Dlatego HITL nie jest wstydem produktu. Jest jedynym uczciwym układem. Jeśli po tej kartce zostajesz przy Excelu, zostaw bez poczucia, że „nie jesteś nowoczesny”. Nowoczesność bez śladu jest droższa niż stary plik z imieniem strażnika. Wejście na plumm.pl nic nie kosztuje poza uczciwością wobec własnych godzin. Godzina w produkcie powie więcej niż slajd o JDG. Jeśli po niej wracasz do biura, też jest decyzja — tylko tańsza niż rok udawania wdrożenia.'),
    ),
    section(
      'What the “office / sheet / Plumm” decision looks like',
      p('On paper: last month’s hours, close deadlines, whether anyone besides you can open the file. If you want a phone at 22:00 in April — an office. If you refuse to click — an office or a disciplined sheet. If you want a product with a trail, e-invoices and escalation — open Plumm and judge yourself. I do not lock you with an ROI slide. The 12–20 h and PLN 300–600 hypothesis stays a hypothesis until you measure your month. Online accounting instead of Excel is a tool, not a religion. The model does not sign PIT. You do. That is why HITL is not product shame. It is the only honest setup.'),
    ),
    section(
      'Як виглядає рішення «лишаюся з бюро / аркушем / Plumm»',
      p('На картці: години минулого місяця, дедлайни впритул, чи хтось окрім вас уміє відкрити файл. Якщо хочете телефон о 22:00 в квітні — бюро. Якщо не хочете клікати — теж бюро або аркуш з дисципліною. Якщо хочете продукт зі слідом, e-фактурою й ескалацією — відкрийте Plumm і оцініть самі. Не замикаю вас слайдом ROI. Гіпотеза 12–20 год і 300–600 злотих лишається гіпотезою, доки не виміряєте свій місяць. Онлайн-бухгалтерія замість Excel — інструмент, не релігія. Модель не підписує PIT. Підписуєте ви. Тому HITL не є соромом продукту. Це єдиний чесний уклад. Якщо після цієї картки лишаєтесь при Excel, лишіть без відчуття, що «ви не сучасні». Сучасність без сліду дорожча за старий файл з іменем охоронця. Вхід на plumm.pl нічого не коштує, окрім чесності щодо власних годин. Година в продукті скаже більше, ніж слайд про ФОП. Якщо після неї вертаєтесь до бюро — теж рішення, лише дешевше за рік удавання впровадження.'),
    ),
  ),
  'lejek-konwersji-na-stronie': S(
    section(
      'Pierwsza ścieżka, którą warto domknąć zanim mnożymy landingi',
      p('Jedna intencja, kilka pytań kwalifikujących, jedno CTA, zdarzenia, których nie wstyd przeczytać po tygodniu, człowiek po drugiej stronie z SLA. Dopiero potem drugi landing. Pakiet Launch, który startuje od pięciu URL-i „na test”, kończy jako cmentarz. Płatny ruch bez tej kolejności uczy Was, że lejek nie działa — choć nie mieliście lejka, mieliście kampanię na ładny obrazek. Mint pokazuje rezerwację na domenie, nie wykres. Jeśli nie macie follow-upu, 20 minut ma prawo powiedzieć „poczekajcie z Ads”. To nie jest lęk przed wzrostem. To ochrona budżetu przed wiadrem 3 w przyspieszeniu. Kwalifikacja, która boli mniej niż zły call, jest tańsza niż kolejny kreacja. Bez niej lejek konwersji na stronie zbiera śmieć i nazywa to ruchem.'),
      p('Nie dokładam do pakietu Launch obietnicy rankingu, CRM-u bez właściciela leadów ani czatu w hero bez logu. Jedna ścieżka, która domyka, jest droższa w dyscyplinie i tańsza w budżecie niż pięć landingów „na wszelki wypadek”. Jeśli po tygodniu nie umiecie powiedzieć, który URL zebrał zapytanie, nie mieliście lejka. Mieliście stronę z UTM-em. Wtedy pakiet Launch (od 8 000 zł) jest złym zakupem, a wizytówka albo nic — uczciwszym. Lejek konwersji na stronie zaczyna się od tej pokory, nie od kolejnego kreacji w Ads. Landing bez człowieka po drugiej stronie jest plakatem, za który i tak wystawią Wam fakturę z mediów. Zanim kupicie pakiet Launch, nazwijcie SLA odpowiedzi. Bez SLA nie ma lejka, jest kampania. Kampania bez lejka jest kosztem, który wraca jako pretensja do strony.'),
    ),
    section(
      'The first path worth closing before we multiply landings',
      p('One intent, a few qualifying questions, one CTA, events you are not ashamed to read after a week, a human on the other side with an SLA. Only then a second landing. The Launch package that starts from five URLs “for a test” ends as a graveyard. Paid traffic without that order teaches you the funnel does not work — though you did not have a funnel, you had a campaign on a pretty image. Mint shows booking on the domain, not a chart. If you have no follow-up, 20 minutes may say “wait on Ads”. That is not fear of growth. That is protecting budget from bucket 3 on fast-forward.'),
    ),
    section(
      'Перший шлях, який варто закрити, перш ніж множити лендінги',
      p('Один намір, кілька кваліфікаційних питань, одне CTA, події, яких не соромно прочитати за тиждень, людина з того боку з SLA. Лише потім другий лендінг. Пакет Launch, який стартує з п’яти URL «на тест», закінчується цвинтарем. Платний трафік без цього порядку вчить, що воронка не працює — хоча воронки не було, була кампанія на гарну картинку. Mint показує бронювання на домені, не графік. Якщо немає follow-up, 20 хвилин мають право сказати «зачекайте з Ads». Це не страх зростання. Це захист бюджету від відра 3 на прискоренні.'),
      p('У пакеті Launch не кладу обіцянки позиції, повного CRM без власника лідів і чату в hero без логу. Один шлях, який закриває, дорожчий дисципліною і дешевший бюджетом, ніж п’ять лендінгів «про всяк випадок». Якщо за тиждень не вмієте сказати, який URL зібрав запит, воронки не було. Був сайт з UTM. Тоді пакет Launch (від 8 000) — погана покупка, а візитівка або нічого — чесніші. Воронка конверсії на сайті починається з цієї покори, не з чергової креації в Ads. Лендінг без людини з того боку — плакат, за який медіа все одно виставить рахунок. Перед пакетом Launch назвіть SLA відповіді. Без SLA немає воронки, є кампанія. Кампанія без воронки — вартість, яка вертається претензією до сайту.'),
    ),
  ),
  'panel-operacyjny-zamiast-excela': S(
    section(
      'Dzień wyłączenia arkusza trzeba wpisać w umowę',
      p('Bez daty Excel nie umiera. Zespół wraca „na chwilę”, makro żyje na jednym laptopie, panel staje się muzeum. Szkolenie 1–2 h nie zastąpi właściciela. Migracja CSV w piątek nie zastąpi mapowania śmieci w starych kolumnach. Ops 60–180 tysięcy ma sens, gdy ten koszt jest tańszy niż miesięczny chaos albo gdy arkusz blokuje wzrost. Jeśli nie umiecie nazwać metryki, która ma spaść — nie zaczynamy. Audit Sprint albo stop. Nie sprzedaję teatru nowoczesności. Sprzedaję stany, role i zapis, albo mówię, żeby zostać przy pliku z imieniem strażnika.'),
    ),
    section(
      'The day the sheet dies must be in the contract',
      p('Without a date Excel does not die. The team returns “for a moment”, a macro lives on one laptop, the panel becomes a museum. A 1–2 h training does not replace an owner. A Friday CSV paste does not replace mapping junk in old columns. Ops at PLN 60–180k makes sense when that cost is cheaper than monthly chaos or when the sheet blocks growth. If you cannot name a metric that should fall — we do not start. Audit Sprint or a stop. I do not sell modernity theatre. I sell states, roles and a log, or I tell you to keep the file with a named guardian.'),
    ),
    section(
      'День вимкнення аркуша треба вписати в угоду',
      p('Без дати Excel не помирає. Команда вертається «на хвилину», макрос живе на одному ноутбуці, панель стає музеєм. Навчання 1–2 год не замінює власника. CSV в п’ятницю не замінює мапінг сміття в старих колонках. Ops 60–180 тисяч має сенс, коли ця ціна дешевша за місячний хаос або коли аркуш блокує зростання. Якщо не вмієте назвати метрику, яка має впасти — не починаємо. Audit Sprint або стоп. Не продаю театр сучасності. Продаю стани, ролі і запис, або кажу лишитися з файлом і іменем охоронця.'),
    ),
  ),
  'rezerwacje-na-wlasnej-stronie': S(
    section(
      'Checklista, zanim wkleicie przycisk Book na wizytówce',
      p('Parść ze stawką na OTA, te same anulacje, PMS który pilnuje overbookingu, mail który dochodzi, ścieżka na telefonie bez pinch-zoom, kto odpowiada gościowi po locku. Bez tego przycisk jest plakatem. Nie buduję kalendarza od zera w cenie strony — u Mint jest Previo. Platforma (od 25 000 zł) zaczyna się, gdy ta lista jest prawdziwa. Nowy obiekt bez marki może uczciwie prowadzić na portal. Direct-first bez kanału jest hasłem. 10–15% mniej dla gościa w Mint możesz sprawdzić na żywej stronie, nie na slajdzie z prowizjami „branży”. Widget, który wypycha na Booking z inną ceną, uczy gościa, że kłamiecie. Lepiej jasny OTA albo prawdziwy PMS niż teatr „rezerwacje na własnej stronie”, którego nie dowieziecie w sobotę wieczorem.'),
      p('Nie obiecuję, że strona zabierze Booking w 90 dni. Obiecuję ścieżkę na Waszej domenie i integrację, której nie udaję, że napisałem od zera. Kto sprzedaje silnik rezerwacji w cenie wizytówki, niech powie, kto pilnuje overbookingu po północy. Ja chcę, żeby to robił system, który już to robi. Rezerwacje na własnej stronie bez tej pokory są plakatem, który wraca gościa na OTA w chwili, gdy telefon się zacina. To nie jest „direct”. To jest wstyd z ładniejszym przyciskiem. Direct jest wtedy, gdy gość kończy u Was, a nie gdy słowo Book wisi obok galerii i cichego przekierowania w innej cenie. Tę różnicę widać w PMS, nie w moodboardzie hero. Jeśli PMS nie istnieje, najpierw PMS, potem przycisk. Odwrotna kolejność jest plakatem.'),
    ),
    section(
      'A checklist before you paste a Book button on a brochure',
      p('Parity with the OTA rate, the same cancellations, a PMS that watches overbooking, mail that arrives, a phone path without pinch-zoom, who answers the guest after lock. Without that the button is a poster. I do not build a calendar from scratch at website price — at Mint it is Previo. The Platform package (from PLN 25,000) starts when that list is real. A new unbranded property may honestly point at the portal. Direct-first without a channel is a slogan. The 10–15% less for the guest at Mint you can check on the live site, not on a slide of “industry” commissions.'),
    ),
    section(
      'Чекліст, перш ніж вставите кнопку Book на візитівку',
      p('Паритет зі ставкою OTA, ті самі ануляції, PMS який стереже overbooking, лист який доходить, шлях на телефоні без pinch-zoom, хто відповідає гостю після lock. Без цього кнопка — плакат. Не будую календар з нуля в ціні сайту — у Mint це Previo. Платформа (від 25 000 злотих) починається, коли цей список справжній. Новий об’єкт без марки може чесно вести на портал. Direct-first без каналу — гасло. На 10–15% менше для гостя в Mint можете перевірити на живому сайті, не на слайді комісій «галузі».'),
      p('Не обіцяю, що сайт забере Booking за 90 днів. Обіцяю шлях на вашому домені й інтеграцію, яку не вдаю, що написав з нуля. Хто продає рушій бронювання в ціні візитівки, хай скаже, хто стереже overbooking після півночі. Я хочу, щоб це робила система, яка вже це вміє. Бронювання на власному сайті без цієї покори — плакат, який вертає гостя на OTA, щойно телефон зависає. Це не «direct». Це сором із гарнішою кнопкою. Direct є тоді, коли гість закінчує у вас, а не коли слово Book висить біля галереї й тихого редіректу в іншій ціні. Цю різницю видно в PMS, не в moodboard hero. Якщо PMS немає — спочатку PMS, потім кнопка. Зворотний порядок є плакатом.'),
    ),
  ),
  'saas-czy-wlasny-panel': S(
    section(
      'Podpis pod decyzją, którego nie zastąpi warsztat o stacku',
      p('SaaS na 18 miesięcy, custom z imieniem utrzymującego, plan eksportu, metryka zamiast gustu prezesa. Jeśli nie umiecie tego podpisać, nie otwieram repozytorium. W Mint Previo wygrało, bo hotelarstwo nie jest moim produktem. W Plumm custom wygrał, bo produkt jest mój. To nie jest osobowość. To kto płaci w niedzielę, gdy padnie integracja. 60–180 tysięcy bez tej kartki jest slajdem. Z kartką jest umową. Wracamy do Excela albo do audytu, gdy kartki nie ma. Lepiej nuda na papierze niż lock-in, którego nie umiecie nazwać. Warsztat o stacku bez podpisu jest rozrywką dla zespołu, nie decyzją operacyjną. SaaS czy własny panel operacyjny rozstrzyga się tu, nie na konferencji o „always build”. Pycha „zawsze custom” jest droższa niż gotowiec, który pokrywa osiemdziesiąt procent procesu. Jeśli nie umiecie powiedzieć, które dwadzieścia procent jest przewagą, nie budujemy.'),
    ),
    section(
      'A signature under the decision that a stack workshop will not replace',
      p('SaaS for 18 months, custom with a named maintainer, an export plan, a metric instead of the CEO’s taste. If you cannot sign that, I do not open a repo. At Mint Previo won because hospitality is not my product. At Plumm custom won because the product is mine. That is not personality. That is who pays on Sunday when an integration dies. PLN 60–180k without that card is a slide. With the card it is a contract. We return to Excel or an audit when there is no card. Better boredom on paper than lock-in you cannot name.'),
    ),
    section(
      'Підпис під рішенням, якого не замінить воркшоп про стек',
      p('SaaS на 18 місяців, custom з іменем того, хто підтримує, план експорту, метрика замість смаку директора. Якщо цього не вмієте підписати, не відкриваю репозиторій. У Mint виграв Previo, бо готельна справа не мій продукт. У Plumm виграв custom, бо продукт мій. Це не особистість. Це хто платить у неділю, коли впаде інтеграція. 60–180 тисяч без цієї картки — слайд. З карткою — угода. Повертаємось до Excel або аудиту, коли картки немає. Краще нудьга на папері, ніж lock-in, якого не вмієте назвати. Воркшоп про стек без підпису — розвага для команди, не операційне рішення. SaaS чи власна панель розв’язується тут, не на конференції про «always build». Пиха «завжди custom» дорожча за готовець, який покриває вісімдесят відсотків процесу. Якщо не вмієте сказати, які двадцять відсотків є перевагою, не будуємо.'),
    ),
  ),
  'strona-firmowa-b2b': S(
    section(
      'Jedno CTA i jeden język — zanim ktoś doda „przy okazji”',
      p('Strona firmowa B2B w tym budżecie ma prawo być wąska. Przy okazji blog, UA, CRM i czat to osobne faktury. Lepiej pięć podstron, które zbierają zapytania, niż dwadzieścia, które nikt nie utrzymuje. Jeśli po 20 minutach słyszysz, że potrzebujecie lejka — nie dokładamy sekcji do wizytówki. Zmieniamy pudełko. Hreflang i prefiks /ua/ to nie ozdoba w tabeli. To decyzja i18n, której nie wrzucam w 8 tysięcy. Dowód: Mint i Plumm do kliknięcia. Reszta bez gwiazdek z generatora.'),
    ),
    section(
      'One CTA and one language — before someone adds “while we are at it”',
      p('A B2B company site in this budget has a right to be narrow. A blog, UA, CRM and chat “on the side” are separate invoices. Better five pages that collect enquiries than twenty nobody maintains. If after 20 minutes you hear you need a funnel — we do not bolt a section onto a brochure. We change the box. Hreflang and the /ua/ prefix are not a table decoration. They are an i18n decision I do not stuff into 8k. Proof: Mint and Plumm to click. The rest without generated stars.'),
    ),
    section(
      'Одне CTA і одна мова — перш ніж хтось додасть «заодно»',
      p('Корпоративний сайт B2B у цьому бюджеті має право бути вузьким. Заодно блог, UA, CRM і чат — окремі рахунки. Краще п’ять сторінок, які збирають запити, ніж двадцять, які ніхто не тримає. Якщо після 20 хвилин чуєте, що потрібна воронка — не додаємо секцію до візитівки. Змінюємо коробку. Hreflang і префікс /ua/ — не прикраса в таблиці. Це рішення i18n, якого не пхаю в 8 тисяч. Доказ: Mint і Plumm клікнути. Решта без зірок з генератора.'),
    ),
  ),
  'strona-wizytowka-czy-lejek': S(
    section(
      'Zdanie, które spisujemy na końcu 20 minut',
      p('„Wizytówka, bo ruch ciepły i konwersja to mail.” Albo: „Lejek, bo płacicie za klik i trzeba kwalifikować.” Albo: „Nic, bo nie ma follow-upu.” To zdanie jest produktem calla. Reszta jest moodboardem. Nie rozszerzam wizytówki do lejka sekcją. Nie sprzedaję lejka w cenie 8 tysięcy. Mint jest lejkiem rezerwacji. Plumm nie jest case’em wizytówki. Jeśli brief miesza booking, AI i blog „przy okazji”, rozdzielamy faktury albo stop. Wolę stracić deal niż dokładać się do statystyki stron, które nie sprzedają, bo kupiono złe pudełko. Test na kartce trwa krócej niż moodboard i kosztuje mniej niż zły pakiet.'),
      p('Excel, który już psuje proces, nie jest argumentem za „rozszerzoną wizytówką”. To argument za panelem albo za niczym, dopóki nie ma właściciela arkusza. Nie mieszajcie trzeciego pudełka w tę parę. Wizytówka albo lejek. Panel jest osobnym zdaniem na innym callu. 20 minut ma prawo zakończyć się tym zdaniem i niczym więcej. To nadal jest wycena — oszczędność na złym pakiecie, którego nie uniesiecie follow-upem. Spektrum „wszystko w jednym pudełku” kończy się pretensją do przycisku, nie do briefu. Na callu zostawiamy jedno zdanie. Reszta jest ozdobą.'),
    ),
    section(
      'The sentence we write down at the end of 20 minutes',
      p('“A brochure, because traffic is warm and conversion is mail.” Or: “A funnel, because you pay for clicks and must qualify.” Or: “Nothing, because there is no follow-up.” That sentence is the product of the call. The rest is a moodboard. I do not stretch a brochure into a funnel with a section. I do not sell a funnel at 8k. Mint is a booking funnel. Plumm is not a brochure case. If the brief mixes booking, AI and a blog “on the side”, we split invoices or stop. I would rather lose the deal than add to the statistic of sites that do not sell because the wrong box was bought.'),
    ),
    section(
      'Речення, яке записуємо наприкінці 20 хвилин',
      p('«Візитівка, бо трафік теплий і конверсія — лист.» Або: «Воронка, бо платите за клік і треба кваліфікувати.» Або: «Нічого, бо немає follow-up.» Це речення є продуктом розмови. Решта — moodboard. Не розтягую візитівку до воронки секцією. Не продаю воронку за 8 тисяч. Mint — воронка бронювання. Plumm не є кейсом візитівки. Якщо бриф мішає booking, ШІ і блог «заодно», ділимо рахунки або стоп. Краще втратити deal, ніж поповнювати статистику сайтів, які не продають, бо купили погану коробку.'),
      p('Excel, який уже псує процес, не є аргументом за «розширену візитівку». Це аргумент за панель або за нічого, доки немає власника аркуша. Не мішайте третю коробку в цю пару. Візитівка або воронка. Панель — окреме речення на іншій розмові. 20 хвилин мають право закінчитися цим реченням і нічим більше. Це все одно оцінка — економія на поганому пакеті, якого не потягнете follow-up. Спектр «усе в одній коробці» закінчується претензією до кнопки, не до брифу. На розмові лишаємо одне речення. Решта — прикраса.'),
    ),
  ),
  'szybkosc-strony-a-seo': S(
    section(
      'Higiena po deploju, której nie zastąpi screenshot z premiery',
      p('Ktoś wklei pixel. Ktoś doda czat. Sieć gościa nie jest Waszą siecią z biura. Zostawiam sposób pomiaru LCP i INP na telefonie, nie dyplom Lighthouse z dnia startu. Jeśli nie chcecie tej higieny, nie biorę kampanii, która ma palić budżet na spinnerze. Wizytówka na Astro/Next, obrazy bez hero 4K, zgoda przed skryptami. Dziennik crawlable pod /artykuly/ i /ua/statti/, nie hash. Hreflang uk, etykieta UA. FID w raporcie 2026 jest wspomnieniem. Szybkość strony a SEO jest częścią konwersji. Inaczej płacicie za klik, który nie zdąży przeczytać oferty. Screenshot z premiery nie broni Was trzy miesiące później, gdy Tag Manager „na chwilę” zostanie na stałe.'),
    ),
    section(
      'Post-deploy hygiene a premiere screenshot will not replace',
      p('Someone will paste a pixel. Someone will add chat. The guest’s network is not your office network. I leave a way to measure LCP and INP on a phone, not a Lighthouse diploma from launch day. If you do not want that hygiene, I do not take a campaign meant to burn budget on a spinner. A brochure on Astro/Next, images without a 4K hero, consent before scripts. A crawlable journal under /artykuly/ and /ua/statti/, not a hash. Hreflang uk, label UA. FID in a 2026 report is a memory. Website speed and SEO are part of conversion. Otherwise you pay for a click that never reads the offer.'),
    ),
    section(
      'Гігієна після деплою, якої не замінить скріншот прем’єри',
      p('Хтось вставить піксель. Хтось додасть чат. Мережа гостя не є вашою офісною. Лишаю спосіб виміру LCP та INP на телефоні, не диплом Lighthouse дня старту. Якщо не хочете цієї гігієни, не беру кампанію, яка має палити бюджет на спінері. Візитівка на Astro/Next, зображення без hero 4K, згода перед скриптами. Crawlable журнал під /artykuly/ і /ua/statti/, не хеш. Hreflang uk, позначка UA. FID у звіті 2026 — спогад. Швидкість сайту і SEO є частиною конверсії. Інакше платите за клік, який не встигне прочитати оферту. Скріншот прем’єри не захистить вас за три місяці, коли Tag Manager «на хвилинку» лишиться назавжди.'),
    ),
  ),
  'wdrozenie-strony-internetowej': S(
    section(
      'Jedna lista feedbacku albo kalendarz kłamie',
      p('Dwanaście maili z sprzecznymi H1 zamienia 2–4 tygodnie w kwartał. Właściciel decyzji, właściciel materiałów, kto klika DNS, bufor na spóźnione zdjęcia. Staging jak gość na LTE. Produkcja to Search Console i pomiar, nie confetti. Poprawki po starcie mają rundę albo retainer. Nie gwarantuję frazy. Gwarantuję, że nie znikam. 20 minut na wejściu mogą zakończyć projekt — legalnie. Wdrożenie strony internetowej bez tej dyscypliny jest discovery w przebraniu, tylko z deploje zamiast Miro. Tego nie sprzedaję w pakiecie wizytówki. Kalendarz, który nie kłamie, jest częścią zakresu — nie „dopięciem na końcu, jak już będzie kod”. Jeśli nie ma imienia przy materiałach, nie ma daty produkcji. Jest nadzieja, a nadzieja nie wchodzi do umowy. Kod wtedy czeka. Czekają też pretensje. Lepiej powiedzieć to na kick-offie niż po miesiącu ciszy. Data produkcji bez imienia przy zdjęciach jest datą teatralną. W umowie zostawiam bufor. W kalendarzu zostawiam prawdę. Jeśli prawda boli, 20 minut na starcie mogą zakończyć projekt. To nadal jest wdrożenie — tylko krótsze i tańsze.'),
    ),
    section(
      'One feedback list or the calendar is lying',
      p('Twelve emails with conflicting H1s turn 2–4 weeks into a quarter. A decision owner, an asset owner, who clicks DNS, a buffer for late photos. Staging as a guest on LTE. Production is Search Console and measurement, not confetti. Post-launch fixes have a round or a retainer. I do not guarantee a keyword. I do guarantee I do not vanish. The opening 20 minutes may end the project — legally. Website implementation without that discipline is discovery in costume, only with deploys instead of Miro. I do not sell that in a brochure package.'),
    ),
    section(
      'Один список фідбеку, або календар бреше',
      p('Дванадцять листів із суперечливими H1 перетворюють 2–4 тижні на квартал. Власник рішення, власник матеріалів, хто клікає DNS, буфер на запізнілі світлини. Staging як гість на LTE. Продакшен — Search Console і вимір, не конфеті. Правки після старту мають раунд або ретейнер. Не гарантую фразу. Гарантую, що не зникаю. 20 хвилин на вході можуть закінчити проєкт — легально. Впровадження сайту без цієї дисципліни — discovery в масці, лише з деплоями замість Miro. Цього не продаю в пакеті візитівки. Календар, який не бреше, є частиною обсягу — не «дотиснемо наприкінці, як уже буде код». Якщо немає імені при матеріалах, немає дати продакшену. Є надія, а надія не входить в угоду. Код тоді чекає. Чекають і претензії. Краще сказати це на старті, ніж після місяця тиші. Дата продакшену без імені при світлинах — театральна дата. В угоді лишаю буфер. У календарі лишаю правду. Якщо правда болить, 20 хвилин на старті можуть закінчити проєкт. Це все одно впровадження — лише коротше і дешевше.'),
    ),
  ),
  'wdrozyc-chatgpt-w-firmie': S(
    section(
      'Seat bez kontraktu zostawcie. Wdrożenie zaczyna się od logu',
      p('Jedna osoba, jeden proces, tydzień liczb: przyjęte, odrzucone, wyszłe na zewnątrz. Bez tego Team jest tańszy niż pozory. Nie wpinam modelu w formularz strony firmowej w cenie wizytówki. HITL jest osobnym zakresem. Agentic nie jest Waszym URL-em. iDrive nie jest live. Mint i Plumm nie udają, że AI prowadzi operację. Jeśli 20 minut kończy się „nie wpinajcie”, nie sprzedaję winy. Wdrożyć ChatGPT w firmie to spisać, czego modelowi nie wolno — nie kupić kolejnego miejsca i wkleić regulamin do Notion.'),
    ),
    section(
      'Leave the seat without a contract. A rollout starts with a log',
      p('One person, one process, a week of numbers: accepted, rejected, sent outside. Without that, Team is cheaper than appearances. I do not wire a model into a company-site form at brochure price. HITL is a separate scope. Agentic is not your URL. iDrive is not live. Mint and Plumm do not pretend AI runs operations. If 20 minutes end as “do not wire it”, I do not sell guilt. Implementing ChatGPT at work is writing down what the model must not do — not buying another seat and pasting a policy into Notion.'),
    ),
    section(
      'Місце без контракту лишіть. Впровадження починається з логу',
      p('Одна людина, один процес, тиждень цифр: прийняті, відхилені, вийшли назовні. Без цього Team дешевший за видимість. Не врізаю модель у форму корпоративного сайту в ціні візитівки. HITL — окремий обсяг. Agentic не ваш URL. iDrive не live. Mint і Plumm не вдають, що ШІ веде операцію. Якщо 20 хвилин кінчаються «не врізайте», не продаю провину. Впровадити ChatGPT у фірмі — списати, чого моделі не можна — не купити ще одне місце і вставити регламент у Notion.'),
    ),
  ),
}
