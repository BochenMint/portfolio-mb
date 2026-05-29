# Case studies — notatki research (Mint + Plumm)

> Ostatnia aktualizacja: maj 2026. Źródła: live site, repo MINTAPARTMENTS 2.0, plumm.pl.

---

## Plumm.pl

### Czym jest Plumm?

**Plumm to polska platforma AI do księgowości online** — SaaS dla JDG, freelancerów i spółek (sp. z o.o., S.A., spółki osobowe). **Nie jest** systemem do wynajmu apartamentów ani modułem MINTAX z Mint Apartments.

- Firma: **PLUMM Sp. z o.o.**, NIP 5833564025, Gdańsk
- Twórca: **Marcin Bochenek** — programista i przedsiębiorca (15+ lat)
- Model: abonament od **0 zł** (plan Darmowy) do **Enterprise od 2000 zł/mies.**
- Panel: `app.plumm.pl` (wymaga logowania)

### Dla kogo?

| Segment | Plan | Cena netto |
|---------|------|------------|
| JDG z własną księgową | Darmowy | 0 zł |
| Freelancer / prosta KPiR | Starter | 149 zł/mies. |
| JDG handel/usługi + VAT | Standard | 299 zł/mies. |
| Aktywna JDG, wysoki wolumen | Pro | 449 zł/mies. |
| Sp. z o.o. | Biznes | 649 zł/mies. |
| Spółka z kadrami | Biznes Plus | 1099 zł/mies. |

### Core features

1. **KSeF** — wystawianie i odbiór e-faktur od pierwszego dnia
2. **Faktury** — sprzedaż, koszty, OCR, cykliczne, korekty, walutowe EUR/USD/GBP
3. **Rozliczenia** — PIT (skala/liniowy/ryczałt), CIT, VAT, ZUS DRA, JPK-V7M/7K, JPK_KR
4. **AI asystent podatkowy 24/7** — pytania po polsku, baza wiedzy + eskalacja do księgowej
5. **Kalendarz terminów** — ZUS, PIT, VAT, JPK — zero przeoczonych deadline'ów
6. **Kadry i płace** — UoP, UZ, UoD (w planach Standard+)
7. **Bezpieczeństwo** — 2FA TOTP, AES-256, serwery PL/DE, RODO

### Tech (znane)

- **Next.js** (landing, `_next/image`, SSR)
- **TypeScript**
- Hosting UE (Polska + Niemcy)
- W repo MINTAPARTMENTS istnieje pakiet `@mint/plumm-export` — to **adapter eksportu faktur DO Plumm** (CSV/JPK_FA/KSeF FA3) z modułu MINTAX dla właścicieli apartamentów. **To nie jest sam Plumm**, tylko mostek między MINTAX a importem w Plumm.

### Wartość biznesowa

- **JDG**: 300–600 zł/mies. za tradycyjne biuro → Plumm od 149 zł z AI i KSeF
- **Oszczędność czasu**: benchmark 80% mniej godzin na papierkową robotę
- **Jeden abonament** zamiast 5 narzędzi + biura rachunkowego
- **7 dni trial** bez karty, anulacja w dowolnym momencie

### Copy portfolio (PL)

- **Tagline:** AI księgowość online · JDG i spółki · KSeF od dnia 1
- **Klient:** PLUMM Sp. z o.o. — własny produkt SaaS
- **Problem:** Rozproszone narzędzia, koszt biura, brak natychmiastowej odpowiedzi podatkowej
- **Wkład:** Platforma Next.js/TS, KSeF, AI, JPK, landing + cennik + panel
- **Wynik:** Jeden panel, KSeF od startu, zamknięcie miesiąca jednym kliknięciem

---

## Mint Apartments (mintapartments.pl)

### Czym jest Mint?

**Operator najmu krótkoterminowego w Gdańsku** — 36 apartamentów w Trójmieście, direct booking, od 2017 roku. Oferuje też **obsługę A–Z dla właścicieli** apartamentów (projekt, wykończenie, goście, rozliczenia).

### Kluczowe liczby

- **36 apartamentów** (strona /apartamenty)
- **4,9/5 Google** (180 opinii)
- **3 lokalizacje:** Seaside Letnica, Bastion Wałowa (Stare Miasto), DOKI (Młode Miasto)
- **Od 176 zł/noc** (Letnica) do **300 zł/noc** (Bastion 2-syp.)
- **Założenie:** 2017, 9+ lat doświadczenia

### Direct booking

- Rezerwacja na własnej domenie — **10–15% taniej** niż Booking/Airbnb
- Płatność online: karta, BLIK, przelew
- Bezpłatna anulacja do **7 dni** przed przyjazdem
- Min. **2 noce** (1 noc poza sezonem na zapytanie)

### 7 języków

Potwierdzone w `apps/web`: **pl, en, de, it, es, cs, uk**

- Treści apartamentów w content collections (multilocale schema)
- Concierge UI w pełni przetłumaczony
- Auto-detekcja języka gościa w czacie

### Smart locks & check-in

- **Tedee** i **Nuki** — samodzielne zameldowanie 24/7
- Instrukcja e-mailem ~24 h przed przyjazdem
- Bez recepcji, bez ograniczeń godzinowych

### AI Concierge

- Panel „Opiekun Mint" — odpowiedzi w kilkadziesiąt sekund
- Kontekst: apartamenty, dostępność, rekomendacje, WhatsApp handoff (+48 797 412 679)
- Integracja z Previo (sprawdzanie dostępności)

### Tech stack (repo MINTAPARTMENTS 2.0)

- **Astro** + **React** (apps/web)
- **Previo** — PMS, booking engine, synchronizacja
- **MINTAX** — moduł rozliczeń/faktur dla właścicieli (legacy PHP + nowe pakiety TS)
- Panel admin Vue (apps/admin)
- SEO: structured data, wielojęzyczne URL `[lang]/apartamenty/[slug]`

### Kontekst konkurencyjny

- Gdańsk STR: wysoka konkurencja OTA (Booking, Airbnb dominują ruch)
- USP Mint: **direct price**, **lokalna wiedza** (blog/przewodnik), **premium lokalizacje** (DOKI, Bastion, plaża)
- Klimatyzacja jako wyróżnik w segmencie nadmorskim
- Workation, eventy (Polsat Plus Arena, AmberExpo)

### Copy portfolio (PL)

- **Tagline:** 36 apartamentów w Gdańsku · direct booking · 7 języków
- **Klient:** Mint Apartments — operator STR Gdańsk (od 2017)
- **Problem:** Prowizje OTA, rozproszona oferta, ręczny check-in, legacy tech
- **Wkład:** Astro+React, Previo, concierge AI, Tedee/Nuki, MINTAX, SEO
- **Wynik:** Direct booking taniej o 10–15%, check-in 24/7, 3 dzielnice z jednego panelu

---

## Screenshoty (public/projects/)

Generowane przez `npm run capture:screens` → WebP full (3840w) + hero (1920w) + card (1200w), viewport Playwright 3840×2160, q≈91.

### Mint (`public/projects/mint/`)

| Plik | Widok |
|------|-------|
| `hero-hero.webp` / `hero-card.webp` | Homepage — hero + widget dat |
| `listings-hero.webp` / `listings-card.webp` | /apartamenty — 36 apartamentów, filtry |
| `apartment-hero.webp` / `apartment-card.webp` | Detail — luksusowy-seaside, galeria |
| `booking-hero.webp` / `booking-card.webp` | Widget rezerwacji na stronie apartamentu |

### Plumm (`public/projects/plumm/`)

Źródło: **Playwright na plumm.pl** (`npm run capture:screens`). Logowanie do `app.plumm.pl` — tylko gdy w `.env` są `PLUMM_DEMO_EMAIL` + `PLUMM_DEMO_PASSWORD` (brak w repo domyślnie). W capture maj 2026: **app.plumm.pl nie rozwiązuje DNS** → dashboard z mocka marketingowego `#panel`.

| Plik | Widok | Typ |
|------|-------|-----|
| `hero-hero.webp` / `hero-card.webp` | Hero landing — karuzela mockupu iPhone (dashboard JDG) | marketing |
| `app-hero.webp` / `app-card.webp` | Sekcja funkcji `#funkcje` — panel rozliczeń (mock desktop) | marketing |
| `dashboard-hero.webp` / `dashboard-card.webp` | „Wszystko w jednym panelu" — `.v3-platform-preview` (Firma demo, rozliczenia) | marketing (= post-login UX na stronie) |
| `pricing-hero.webp` / `pricing-card.webp` | `/cennik-ksiegowosci-online` | marketing |

Portfolio UI: duży kadr case study → `dashboard`, miniatury → `app` (jak Mint: hero vs apartment).

---

## Pułapki copy (unikać)

| ❌ Błędnie | ✅ Poprawnie |
|-----------|-------------|
| Plumm = eksport JPK z MINTAX | Plumm = pełna platforma księgowości SaaS |
| Plumm dla operatorów najmu | Plumm dla JDG, freelancerów, spółek |
| Mint = tylko strona wizytówka | Mint = 36 apartamentów + PMS + AI + smart lock |
| 6 języków | 7 języków (pl, en, de, it, es, cs, uk) |
| Mintax = Plumm | MINTAX = moduł rozliczeń właścicieli apartamentów (osobny produkt) |
