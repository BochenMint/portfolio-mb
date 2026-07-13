# [DEMO SZKIC] Villa Bursztyn · Direct booking · 25–60 tys. PLN

⚠ To jest DEMO formatu „Szkic №1" — zgłoszenie poniżej jest fikcyjne. Tak wyglądają
szkice od agenta intake (scheduled task: `portfolio-intake-szkic`, procedura:
`D:\PORTFOLIO MB\automation\intake-agent.md`). Normalnie ten dokument byłby draftem
w Gmailu — trafił do outboxa, bo connector Gmail nie ma uprawnień do draftów
(do naprawy: ponowne połączenie connectora z dostępem do wersji roboczych).

# Szkic №1 — Villa Bursztyn (Direct booking / rezerwacje)

## 1. Zgłoszenie w pigułce
Pensjonat 12 pokoi w Sopocie, zespół 2–5 osób, branża: hotele/najem krótkoterminowy.
Ból: ~95% rezerwacji przez Booking.com (prowizja 15–17%), strona z 2015 r. bez
rezerwacji online, goście dzwonią po kody i śniadania. Budżet: 25 000–60 000 PLN,
start: do 30 dni. Kryterium sukcesu: więcej rezerwacji z własnej strony.

## 2. Diagnoza robocza
Hipotezy do weryfikacji na audycie: (a) marża oddawana OTA to przy tej skali rząd
3–6 tys. PLN/mies.; (b) brak mobilnej strony z kalendarzem = klienci wracający i tak
bookują przez OTA; (c) telefony „gdzie klucz / o której śniadanie" to powtarzalne
1–2 h dziennie w sezonie.

## 3. Proponowane rozwiązanie (MVP na 90 dni)
- Nowa strona (Astro) z kartami pokoi i kalendarzem cen — rezerwacja i płatność na
  własnej domenie od dnia 1.
- Integracja z channel managerem (jak w Mint Apartments: Previo — bez budowy
  własnego channel managera).
- Etap 2 (po starcie MVP): samodzielny check-in (smart lock) i concierge AI FAQ
  w 2 językach.
- Poza zakresem MVP: program lojalnościowy, wielojęzyczność >2, integracje księgowe.
- Pomiar przed/po: udział rezerwacji direct, liczba telefonów/tydz., prowizje OTA/mies.

## 4. Rekomendowany pakiet i widełki
Conversion Build: 25 000–60 000 PLN netto; przy tym zakresie realnie 30–45 tys.
Harmonogram: 2 tyg. projekt + treści, 3–4 tyg. wdrożenie + integracja, 1 tydz. start
i pomiar. Analogia wdrożeniowa: Mint Apartments (36 apartamentów, direct booking
10–15% taniej dla gościa niż OTA).

## 5. Ryzyka i niewiadome
- Jaki PMS/channel manager jest dziś (jeśli żaden — dochodzi wdrożenie Previo).
- Jakość zdjęć pokoi (może wymagać sesji — poza wyceną).
- Sezonowość: start przed wakacjami wymaga zamrożenia zakresu MVP.

## 6. Pytania na 20-min audyt
1. Ile rezerwacji/mies. i jaki % przez OTA (ostatnie 12 mies.)?
2. Czy jest PMS/channel manager, czy kalendarz w zeszycie/Excelu?
3. Kto odbiera telefony i ile ich jest dziennie w sezonie?
4. Czy płatności online (Przelewy24/Stripe) są akceptowalne od dnia 1?
5. Kto dostarczy treści i zdjęcia — jest sesja czy robimy nową?
6. Zamki: zwykłe klucze czy już jakiś smart lock?

## 7. Następny krok
20-min audyt w tym tygodniu (proponuję 2 terminy z kalendarza). Do audytu: eksport
rezerwacji z OTA za 12 mies. + dostęp podglądowy do obecnej strony.

---
ORYGINALNE ZGŁOSZENIE (fikcyjne, demo):

```
---BRIEF_JSON---
{"source":"portfolio-mb/v3","company":{"name":"Villa Bursztyn (DEMO)","industry":"Hotele / najem krótkoterminowy","teamSize":"2–5 osób"},"project":{"type":"Direct booking / rezerwacje / płatności","pain":"95% rezerwacji przez Booking, strona z 2015, telefony o kody i śniadania","currentTools":"Booking.com, zeszyt, telefon","successMetric":"Więcej rezerwacji / sprzedaży z własnej strony","budget":"25 000–60 000 PLN — strona / konwersja","timeline":"Teraz / do 30 dni"},"contact":{"name":"Jan Demo","email":"demo@example.com","phone":""}}
---END_BRIEF_JSON---
```
