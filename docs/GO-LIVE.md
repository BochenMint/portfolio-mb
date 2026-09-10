# Checklist go-live

> **Aktualizacja 2026-09:** hosting docelowy to **SEOhost** (DirectAdmin, branch `production`, webhook) — pełna procedura w [`DEPLOY-SEOHOST.md`](DEPLOY-SEOHOST.md). Opis Cloudflare Pages poniżej jest historyczny; punkty o env, Cal.com, Web3Forms i smoke teście pozostają aktualne.

Deploy docelowy: **Cloudflare Pages**, domena `marcinbochenek.com` (apex canonical, `www` przekierowuje na apex). Nameservery domeny są już na Cloudflare. `deploy/Caddyfile` i `docs/DEPLOY-MAC-MINI.md` to poprzednie podejście (Mac Mini + Caddy + Tunnel) — zostawione w repo jako referencja, ale **nieaktualne** dla tego wdrożenia. `mb-ai.pl` i `gra.marcinbochenek.com` jako osobne hosty nie są częścią tego checklisty — gra jest teraz dostępna jako `/gra.html` na głównej domenie (patrz smoke test niżej).

Repo GitHub: `BochenMint/portfolio-mb`. Build: `npm run build` → output `dist/`.

## 1. Projekt Cloudflare Pages

- [ ] Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
- [ ] Wybierz repo GitHub `BochenMint/portfolio-mb`, autoryzuj dostęp jeśli trzeba
- [ ] Production branch: `master`
- [ ] Build settings:
  - Framework preset: **Vite** (lub None)
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Root directory: `/` (repo root)
- [ ] Node version — jeśli build padnie na wersji Node, ustaw zmienną środowiskową `NODE_VERSION` (np. `20`) w **Settings → Environment variables**

## 2. Zmienne środowiskowe (Pages → Settings → Environment variables)

`VITE_*` są wbudowywane w bundle **w czasie builda** — ustaw je w Cloudflare **przed** pierwszym deployem produkcyjnym (środowisko **Production**, opcjonalnie też **Preview**). Zmiana wartości wymaga nowego builda (retrigger deployu), samo zapisanie zmiennej nic nie przebudowuje wstecznie.

Lista z `.env.example`:

| Zmienna | Wartość produkcyjna | Co się psuje, jeśli zostawisz placeholder |
|---|---|---|
| `VITE_CONTACT_EMAIL` | `kontakt@marcinbochenek.com` | Fallback `mailto:` w UI wskazuje na zły adres |
| `VITE_SITE_URL` | `https://marcinbochenek.com` | Canonical / OG tagi wskazują na zły origin |
| `VITE_PORTFOLIO_URL` | `https://marcinbochenek.com` | Cross-linki z gry (V4) wracają w złe miejsce |
| `VITE_MB_AI_URL` | `https://mb-ai.pl` | Link do landing AI prowadzi donikąd |
| `VITE_GAME_URL` | `https://marcinbochenek.com/gra.html` — `public/sitemap.xml` już indeksuje grę pod tym URL-em na apex, nie pod `gra.marcinbochenek.com` (domyślna wartość w kodzie to wciąż stara subdomena — nadpisz ją) | Cross-linki do gry z portfolio wracają na nieistniejącą/nieaktualną subdomenę |
| **`VITE_CALENDLY_URL`** | **prawdziwy link audytu**, np. `https://cal.com/twoj-user/audyt` | **Krytyczne**: `.env.example` zostawia `https://cal.com/YOUR-USER/audyt` jako placeholder. Kod traktuje pusty string, sam root `https://cal.com/` i ten placeholder jako "nieustawione" i **po cichu podmienia wszystkie CTA audytu na `#kontakt`** (scroll do formularza) zamiast otwierać Cal.com. Strona nie wywali błędu — po prostu każdy przycisk "Umów audyt" prowadzi do formularza zamiast do kalendarza. Sprawdź to explicite w smoke teście niżej. |
| `VITE_FORM_ENDPOINT` | `https://api.web3forms.com/submit` (albo Formspree endpoint) | Bez tego formularz idzie fallbackiem na `mailto:` zamiast wysyłki AJAX |
| `VITE_FORM_ACCESS_KEY` | access key z [web3forms.com](https://web3forms.com) | Puste → formularz nie wyśle się przez Web3Forms, spadnie na `mailto:` |
| `VITE_SPLINE_ORBIT_URL` | opcjonalne, tylko legacy `/v1.html` | Nieużywane poza starym archiwum v1 — pomiń, jeśli nie testujesz `/v1.html` |

- [ ] Wszystkie powyższe ustawione w **Production**
- [ ] Cloudflare Email Routing (jeśli jeszcze nie skonfigurowane): `kontakt@marcinbochenek.com` → Twoja skrzynka — inaczej `VITE_CONTACT_EMAIL` wskazuje na martwą skrzynkę

## 3. Pierwszy deploy

- [ ] Wypchnij `master` (albo trigger "Retry deployment" po ustawieniu env vars) i poczekaj na zielony build w Pages
- [ ] Sprawdź build log — `node scripts/generate-articles.mjs && tsc -b && vite build` musi przejść bez błędów; błąd `tsc` zatrzymuje cały deploy

## 4. Custom domains

**Kolejność ma znaczenie**: Cloudflare Pages traktuje pierwszą dodaną domenę jako *primary* i automatycznie 301-przekierowuje pozostałe na nią. Dodaj apex jako pierwszy, żeby przekierowanie poszło we właściwą stronę (www → apex, nie odwrotnie).

- [ ] Pages project → **Custom domains** → **Set up a custom domain** → `marcinbochenek.com` (dodaj **jako pierwszy**)
- [ ] Dodaj `www.marcinbochenek.com` jako drugą domenę
- [ ] Poczekaj aż oba statusy przejdą na **Active** (DNS + certyfikat)
- [ ] SSL/TLS → **Overview** → tryb **Full (strict)**
- [ ] SSL/TLS → **Edge Certificates** → **Always Use HTTPS** = ON
- [ ] (Zalecane) SSL/TLS → **Edge Certificates** → **HTTP Strict Transport Security (HSTS)** — włącz, jeśli chcesz HSTS; `public/_headers` celowo go nie ustawia, bo to jest zonowa decyzja niezależna od builda
- [ ] Zweryfikuj przekierowanie: `curl -I https://www.marcinbochenek.com/jakas-sciezka` → `301` z `location: https://marcinbochenek.com/jakas-sciezka` (ścieżka zachowana). To działa automatycznie z primary-domain, a `public/_redirects` ma tę samą regułę jako backstop
- [ ] Sprawdź, czy query string przeżywa przekierowanie (`?utm_source=test`) — nieudokumentowane w `_redirects`, jeśli auto-redirect domeny go gubi, przenieś tę regułę do **Bulk Redirects** (ma explicit "preserve query string")

## 5. SEO / indeksacja

- [ ] Google Search Console → dodaj property `marcinbochenek.com` (Domain property albo URL-prefix `https://marcinbochenek.com`)
- [ ] Sitemaps → prześlij `sitemap.xml` (plik już w `public/sitemap.xml`, dostępny pod `https://marcinbochenek.com/sitemap.xml`)
- [ ] Sprawdź `https://marcinbochenek.com/robots.txt` — wskazuje na sitemap, `Allow: /` dla głównych botów

## 6. Analytics i monitoring

- [ ] Cloudflare dashboard → **Analytics & Logs → Web Analytics** → dodaj `marcinbochenek.com` (albo Pages project → **Analytics** → **Enable Web Analytics**)
- [ ] To jest cookieless (beacon JS, brak fingerprintingu) — **nie wymaga banera cookie/consent**; nie dodawaj żadnego innego trackera bez rewizji RODO
- [ ] [UptimeRobot](https://uptimerobot.com) → nowy monitor HTTP(S) na `https://marcinbochenek.com/`, interwał 5 min, powiadomienia (e-mail) na Twój adres
- [ ] (Opcjonalnie) drugi monitor na `https://marcinbochenek.com/gra.html`, jeśli gra ma osobny ruch reklamowy

## 7. Smoke test (otwórz każdy URL, tryb incognito)

- [ ] `https://marcinbochenek.com/` — status 200, studio/hero się renderuje, brak błędów w konsoli
- [ ] `https://marcinbochenek.com/en/` — `html lang="en"`, hreflang, ten sam zakres treści co PL
- [ ] `https://marcinbochenek.com/ua/` — `html lang="uk"` (nie `ua`), language switcher pokazuje **UA**
- [ ] `https://marcinbochenek.com/lab.html`
- [ ] `https://marcinbochenek.com/gra.html` — gra V4 się ładuje (WebGL), link powrotu do portfolio działa
- [ ] `https://marcinbochenek.com/studio.html`
- [ ] Po jednym artykule na locale:
  - `https://marcinbochenek.com/artykuly/audyt-strony-internetowej/`
  - `https://marcinbochenek.com/en/articles/audyt-strony-internetowej/`
  - `https://marcinbochenek.com/ua/statti/audyt-strony-internetowej/`
- [ ] `https://marcinbochenek.com/404.html` — i osobno wejdź na losowy nieistniejący URL (np. `/nie-ma-takiej-strony`), sprawdź że dostajesz stronę 404 (nie index.html) ze statusem `404`
- [ ] `https://www.marcinbochenek.com/` → 301 na apex (patrz punkt 4)
- [ ] `https://marcinbochenek.com/uk/` → 301 na `/ua/`; `https://marcinbochenek.com/uk/statti/audyt-strony-internetowej` → 301 na `/ua/statti/audyt-strony-internetowej`
- [ ] `https://marcinbochenek.com/v4` → serwuje `/v4.html` (URL zostaje `/v4`, to rewrite 200, nie redirect)
- [ ] `https://marcinbochenek.com/en/v3.html` i `/ua/v4.html` — language switcher na stronach archiwum v1–v6 działa (URL zostaje z prefiksem locale, treść to ten sam plik co `/v3.html`/`/v4.html`)
- [ ] CTA "Umów audyt" na stronie głównej otwiera prawdziwy Cal.com/Calendly, **nie** scrolluje do `#kontakt` (patrz `VITE_CALENDLY_URL` w punkcie 2)
- [ ] Submit formularza kontaktowego → mail dociera na `kontakt@marcinbochenek.com`
- [ ] Nagłówki: `curl -I https://marcinbochenek.com/` pokazuje `x-content-type-options: nosniff`; `curl -I https://marcinbochenek.com/assets/<dowolny-plik>` pokazuje `cache-control: public, max-age=31536000, immutable`
- [ ] securityheaders.com na `https://marcinbochenek.com/` — brak niespodzianek (CSP świadomie nieustawione, patrz komentarz w `public/_headers`)

## 8. Bezpieczeństwo

- [ ] Orange-cloud (proxied) na `marcinbochenek.com` i `www`
- [ ] WAF Managed Rules włączone (Free plan wystarczy na start)
- [ ] Żadnych prywatnych API keys w repo — `VITE_FORM_ACCESS_KEY` i inne sekrety tylko w Pages env vars, nie w `.env` commitowanym do gita

## Po starcie

- [ ] W Search Console poczekaj na pierwsze indeksowanie (kilka dni), sprawdź **Coverage/Pages** czy `/en/`, `/ua/`, artykuły są indeksowane, a `/v4.html`, `/lab.html` (jeśli mają być `noindex`) faktycznie nie trafiają do indeksu
- [ ] Skasuj/zarchiwizuj wpisy dot. Mac Mini w `docs/DEPLOY-MAC-MINI.md`, jeśli ten tor wdrożenia faktycznie odchodzi na stałe
