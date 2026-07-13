# Portfolio v2 — propozycja kierunku „CONTROL ROOM"

**Co to jest:** śmielsza, alternatywna wersja portfolio jako **osobna podstrona**. NIE rusza obecnej strony (osobny entry Vite).

**Podgląd:** `npm run dev` → **http://localhost:5190/v2.html**
Powrót do obecnej wersji: `/`. Skrót **⌘K / Ctrl+K** otwiera paletę poleceń.

---

## Koncepcja
**„Control Room / Operator"** — portfolio zbudowane jak Twój własny produkt: premium konsola operatorska / live-dashboard. Medium = przekaz: *buduję systemy — o, właśnie taki*. Naturalnie pasuje do Twojego profilu (Agentic OS, panele, AI, automatyzacje) i odróżnia się od obecnej, edytorialnej wersji.

## Dlaczego tak (research, czerwiec 2026)
Najmocniejszy nurt dla studiów technicznych to **Dark Engineering / Cyber-Mono**: true-black, jeden akcent, 1px geometry, mono, grain — zamiast gładkiego SaaS-gradientu (Vercel/Linear/phantom.land/ref.digital). Wpięte wzorce:
- **Bento grid** — standard dla hero/usług (≈ +23% scroll-depth vs 12-kolumnowy).
- **⌘K command palette** — w researchu wprost wskazane jako *signature feature dla freelancera z produktami* (rzadkie w portfolio).
- **Case studies: metryka w nagłówku + numeracja (A001…)** + Problem→Rozwiązanie→Wynik + ostre screeny.
- **Marquee-separator** (≈90% topowych portfolio), **scroll-reveal**, stack **Lenis + GSAP**.
- **Konwersja:** otwieraj metryką, nie nazwą klienta; widełki „od 25 000 PLN" widoczne; sticky CTA (jeden czasownik); „solo builder = supermoc"; sygnały techniczne (stack, GitHub, terminal jako estetyka).

Źródła: Awwwards SOTD 2026, Codrops, aino.agency, obys.agency, basement.studio, ref.digital, Linear, SaaSFrame, StudioMeyer.

## Co zawiera
- **Nav** — sticky; status „● dostępny"; ⌘K; CTA „Umów audyt".
- **Bento hero** — operator (nazwisko + subhead + CTA) · portret · **agent.log** (live terminal) · metryki odzysku · 4 produkty jako status-kafle (LIVE ↗).
- **Marquee** — stack/usługi.
- **Możliwości** — 3 usługi (outcome + timeline + cena) + panel „solo builder = supermoc".
- **Realizacje** — 4 case studies (A001–A004), metryka-nagłówek, ostre screeny, naprzemienny layout, „Zobacz na żywo ↗".
- **Proces** — pipeline 4 kroki + callout czasu.
- **Dowód** — editorial serif pull-quote (ciepło) + liveProof (klikalne) + 3 zasady.
- **Kontakt** — „konsola" + formularz (mailto na prawdziwy e-mail).
- **Footer** — wielki typograficzny CTA + ⌘K + „← wersja 1".

## Reużyte vs nowe
- **Reużyte:** wszystkie dane (`src/data/content.ts`), tokeny + `.btn-accent`/`text-accent` (`src/index.css`), `useLenis`, ostre screeny projektów.
- **Nowe (tylko w `src/v2/` + `v2.html`):** cała warstwa wizualna v2. `vite.config.ts` dostał drugi entry (addytywnie). Obecna strona (`/`) nietknięta.

## Otwarte decyzje (na powrót)
1. Kierunek OK? Jeśli tak — dopieszczę: custom cursor (dot+ring), magnetic CTA, View-Transitions między sekcjami, lekki WebGL w hero (grid/particles).
2. Mobile jest długie (dużo treści) — mogę skrócić case studies na mobile (collapsy/„rozwiń").
3. Docelowo: która wersja główna (`/`), a która alternatywą? Mogę zrobić przełącznik wersji.
4. Wariant `type` w wersji 1 wciąż czeka na kierunek (kinetyczny/glitch vs bold).
