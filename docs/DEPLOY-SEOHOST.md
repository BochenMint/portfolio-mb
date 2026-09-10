# Deploy — Portfolio MB → SEOhost (DirectAdmin)

Runbook wdrożenia dla `marcinbochenek.com` (+ `gra.marcinbochenek.com`, `mb-ai.pl`) na
shared hostingu **SEOhost** (DirectAdmin, Apache/LiteSpeed). Mechanizm identyczny jak w
Mint Apartments 2.0: GitHub Actions builduje na push do `master`, wypycha wynik builda na
osierocony (orphan) branch `production`, a DirectAdmin Git deploy ściąga `production` do
`public_html/` webhookiem "pull on push". Zastępuje wcześniejszy plan (Cloudflare
Pages / Mac Mini — patrz `docs/GO-LIVE.md` i `docs/DEPLOY-MAC-MINI.md`, oba nieaktualne).

> **TL;DR:** Pierwsze wdrożenie = długa, jednorazowa konfiguracja DirectAdmin (rozdział 1).
> Codzienny flow = `git push` na `master` → GitHub Actions builduje i wypycha `production` →
> SEOhost sam ściąga (webhook). Nic ręcznego. Lokalny fallback: `npm run deploy`.

---

## 0. Model mentalny

| Gdzie | Co tam jest | Jak się zmienia |
|---|---|---|
| **Repo GitHub** (`BochenMint/portfolio-mb`, branch `master`) | kod źródłowy | zwykłe commity/push |
| **Branch `production`** (ten sam repo) | tylko zbudowany `dist/` (+ `DEPLOY-MANIFEST.json`) | nadpisywany przez `.github/workflows/deploy-production.yml` (force-push) |
| **SEOhost `public_html/`** | żywa strona | `git pull` z `production`, uruchamiany automatycznie webhookiem DirectAdmin |

Jeden `public_html/` (jeden build) obsługuje **trzy hosty**:

| Host | Wejście | Rola |
|---|---|---|
| `marcinbochenek.com` | `index.html` | portfolio główne |
| `gra.marcinbochenek.com` | `gra.html` | gra kosmiczna V4 (indeksowana) |
| `mb-ai.pl` (+ `/en/`, `/ua/`) | `mb-ai.html`, `mb-ai-en.html`, `mb-ai-ua.html` | landing MB AI |

Routing między nimi (host-based dispatch + locale rewrites) jest w `public/.htaccess`,
skopiowanym do `dist/.htaccess` przez Vite przy każdym buildzie — przeczytaj komentarze w
tym pliku, tłumaczą każdą regułę 1:1 z `deploy/Caddyfile`.

---

## 1. Jednorazowa konfiguracja DirectAdmin (SEOhost)

### 1.1 Domeny w panelu SEOhost

DNS dla `marcinbochenek.com` jest już na SEOhost (ns1/ns2.seohost.pl), obecnie parking
page. Trzeba przekonwertować/dodać domenę do hostingu i skonfigurować dwa dodatkowe hosty:

1. **`marcinbochenek.com`** — w DirectAdmin: *Domain Setup* → jeśli domena jest tylko
   "zaparkowana" (parked), przekonwertuj ją na pełnoprawną domenę konta (albo dodaj jako
   nową domenę, jeśli konto na to pozwala). Document root: `public_html` (albo
   `domains/marcinbochenek.com/public_html` — nazwa zależy od configu SEOhost).
2. **`gra.marcinbochenek.com`** — dodaj jako **subdomenę** domeny `marcinbochenek.com`
   (*Subdomain Management* w DirectAdmin), ale **document root ustaw na TEN SAM
   `public_html`**, co domena główna (nie na domyślny `public_html/gra`). DirectAdmin
   zwykle tworzy subdomeny z własnym podkatalogiem — trzeba to ręcznie nadpisać w
   ustawieniach subdomeny (pole "Document Root" / edycja w *Domain Setup* →
   *Manage Subdomains*), albo przez edycję `httpd.conf` custom entry, jeśli panel na to
   pozwala. Routing "który host dostaje którą stronę" i tak robi `.htaccess`
   (`RewriteCond %{HTTP_HOST}`) — kluczowe jest tylko, żeby oba hosty czytały te same pliki.
3. **`mb-ai.pl`** — to osobna domena (nie subdomena `marcinbochenek.com`), więc dwie opcje:
   - **Opcja A (preferowana): domain pointer / addon domain z custom document root.**
     Dodaj `mb-ai.pl` jako addon domain wskazujący na ten sam `public_html` co
     `marcinbochenek.com`. Nie wszystkie panele SEOhost pozwalają addon domainowi dzielić
     document root z domeną główną — jeśli DirectAdmin nie daje takiej opcji w UI, to jest
     punkt do zapytania supportu (patrz niżej).
   - **Opcja B: osobna domena z własnym `public_html`, deployowana tym samym buildem.**
     Jeśli SEOhost nie pozwala dzielić document rootu, dodaj `mb-ai.pl` jako w pełni
     osobną domenę (własny `public_html`) i skonfiguruj dla niej **drugie** Git-deploy
     (ten sam branch `production`, inny docroot). Kosztuje to drugi webhook/deploy key,
     ale działa identycznie.
   - **Co zapytać support SEOhost, jeśli opcja A nie jest dostępna w panelu:**
     „Czy mogę ustawić dla addon domain / domain pointer inny document root niż
     `public_html/<domena>` — konkretnie, żeby `mb-ai.pl` wskazywał na dokładnie ten sam
     katalog co `marcinbochenek.com`?" Jeśli nie — użyj Opcji B.
4. **`www.marcinbochenek.com`** i **`www.mb-ai.pl`** — 301 na apex obsługuje
   `.htaccess` (`RewriteCond %{HTTP_HOST} ^www\.`), więc `www` nie musi być osobno
   skonfigurowany w DirectAdmin poza tym, że DNS/SSL muszą go pokrywać (patrz SSL niżej).

### 1.2 SSL (Let's Encrypt)

W DirectAdmin → *SSL Certificates* → *Let's Encrypt* — wygeneruj/odśwież certyfikat dla
**wszystkich** hostów naraz: `marcinbochenek.com`, `www.marcinbochenek.com`,
`gra.marcinbochenek.com`, `mb-ai.pl`, `www.mb-ai.pl`. Jeśli `mb-ai.pl` skończył jako
osobna domena (Opcja B wyżej), będzie miała własny certyfikat — upewnij się, że też jest
aktywny.

### 1.3 `production` branch + Git deploy w DirectAdmin

1. Lokalnie, jednorazowo, żeby branch `production` w ogóle istniał (albo poczekaj na
   pierwszy przebieg GitHub Actions po merge do `master` — patrz rozdział 2):
   ```bash
   npm install
   npm run deploy      # build + push orphan branch `production`
   ```
2. W DirectAdmin → *Git Manager* (albo *Git Version Control*, nazwa zależy od wersji
   panelu) skonfiguruj:

   | Pole | Wartość |
   |---|---|
   | Repo URL | `git@github.com:BochenMint/portfolio-mb.git` |
   | Branch | `production` |
   | Deploy path | `public_html` (ten sam katalog dla wszystkich trzech hostów — patrz 1.1) |
   | Tryb | *Pull on push* (webhook z GitHub) |

   Jeśli konto nie ma Git Manager w panelu — poproś support SEOhost o jego włączenie
   (zwykle darmowe na większości planów) albo o ręczny post-receive hook na bare repo.

3. **Deploy key (SSH, read-only) dla GitHub:**
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/portfolio-mb-seohost-deploy -C "portfolio-mb-seohost-deploy"
   ```
   - Klucz **publiczny** (`.pub`) → GitHub repo `BochenMint/portfolio-mb` →
     *Settings → Deploy keys* → *Add deploy key* → **bez** "Allow write access"
     (SEOhost tylko czyta).
   - Klucz **prywatny** → wklej do DirectAdmin Git Manager (pole "Private Key" / "SSH Key")
     albo umieść w `~/.ssh/id_ed25519` na koncie SEOhost, jeśli panel oczekuje pliku na
     serwerze zamiast wklejenia.
4. **Webhook:** DirectAdmin Git Manager po zapisaniu configu pokazuje URL webhooka
   (coś w stylu `https://<panel>/CMD_GIT_WEBHOOK?domain=...&key=...`). Skopiuj go do
   GitHub repo → *Settings → Webhooks → Add webhook*:
   - Payload URL: URL z DirectAdmin
   - Content type: `application/json`
   - Which events: **Just the push event**
   - Active: tak
5. Zapisz. Od teraz każdy `git push` na branch `production` (czyli każdy udany run
   `deploy-production` w Actions) triggeruje webhook → DirectAdmin robi `git pull`.

### 1.4 E-mail `kontakt@marcinbochenek.com`

Wcześniejszy plan zakładał Cloudflare Email Routing. **Teraz, bo strona idzie na
SEOhost, trzeba to ustawić od nowa** — DirectAdmin → *E-Mail Accounts* → utwórz skrzynkę
`kontakt@marcinbochenek.com` (albo forwarder na istniejący Gmail, jeśli wolisz nie
zarządzać osobną skrzynką). **To decyzja Marcina** — skrzynka vs. forwarder, i czy
zostawić `VITE_CONTACT_EMAIL` jako `kontakt@marcinbochenek.com`, czy przekierować gdzie
indziej. Bez tego kroku `mailto:` fallback w UI i ewentualne potwierdzenia formularza
Web3Forms wskazują na martwy adres.

---

## 2. Codzienny flow (po jednorazowej konfiguracji)

```bash
git checkout master && git pull
# … zmiany, commit …
git push origin master
```

Push na `master` triggeruje `.github/workflows/deploy-production.yml`:

1. `npm ci`, `npm run build` (env `VITE_SITE_URL`, `VITE_CONTACT_EMAIL`,
   `VITE_CALENDLY_URL`, `VITE_FORM_ACCESS_KEY` — patrz sekcja 4).
2. Dopisuje `dist/DEPLOY-MANIFEST.json` (`builtAt`, `gitSha`, `gitBranch`).
3. Force-pushuje `dist/` jako branch `production`.
4. GitHub webhook budzi DirectAdmin → `git pull` do `public_html/` na SEOhost.

Żadnego ręcznego kroku — SEOhost sam ściąga po pushu na `production`.

---

## 3. Weryfikacja po deployu

```bash
curl -I https://marcinbochenek.com/
curl -I https://marcinbochenek.com/assets/<dowolny-plik-z-hashem>.js   # cache-control: immutable
curl -I https://gra.marcinbochenek.com/
curl -I https://mb-ai.pl/
curl -I https://mb-ai.pl/en/
curl -I https://www.marcinbochenek.com/jakas-sciezka                   # 301 -> apex, ścieżka zachowana
curl -s https://marcinbochenek.com/DEPLOY-MANIFEST.json                # sprawdź gitSha == ostatni commit na master
```

Dodatkowo w przeglądarce (incognito): homepage `/`, `/en/`, `/ua/`, `/gra.html` (WebGL się
ładuje), `/mb-ai.html` + `/en/` + `/ua/` na `mb-ai.pl`, jeden artykuł na każde locale
(`/artykuly/...`, `/en/articles/...`, `/ua/statti/...`), losowy nieistniejący URL → realny
404 (nie strona główna), formularz kontaktowy realnie wysyła (Web3Forms).

`DEPLOY-MANIFEST.json` jest tworzony **tylko przez CI** (krok "Write deploy manifest" w
workflow) — nie ma go w `dist/` po lokalnym `npm run build` bez przejścia przez
`npm run deploy` / `scripts/deploy-push.mjs` (ten skrypt też go dopisuje, ze świeżym
`gitSha`, tuż przed pushem).

---

## 4. Sekrety i zmienne GitHub Actions

*Settings → Secrets and variables → Actions* w repo `BochenMint/portfolio-mb`.

**Variables (`vars`, jawne — nie są tajne, ale trzymane poza kodem):**

| Nazwa | Wartość produkcyjna |
|---|---|
| `VITE_SITE_URL` | `https://marcinbochenek.com` |
| `VITE_CONTACT_EMAIL` | `kontakt@marcinbochenek.com` |
| `VITE_CALENDLY_URL` | prawdziwy link Cal.com/Calendly (NIE placeholder — patrz uwaga w `.env.example`, pusty/placeholder po cichu chowa CTA audytu za `#kontakt`) |

**Secrets (`secrets`, wrażliwe):**

| Nazwa | Wartość |
|---|---|
| `VITE_FORM_ACCESS_KEY` | access key z [web3forms.com](https://web3forms.com) — bez tego formularz spada na `mailto:` fallback |

Wszystkie cztery są opcjonalne w sensie "build nie padnie bez nich" — ale produkcja bez
nich ma martwe CTA/formularz, więc ustaw je przed pierwszym prawdziwym deployem.

Repo secret potrzebny też do pushowania brancha `production`: **żaden** — workflow ma
`permissions: contents: write` i używa wbudowanego `GITHUB_TOKEN`, nic dodatkowego nie
trzeba dodawać (upewnij się tylko, że *Settings → Actions → General → Workflow
permissions* ma **Read and write permissions** włączone, inaczej `git push` z Actions
dostanie 403).

---

## 5. Rollback

**Szybki rollback (branch `production`):**

```bash
git fetch origin production
git log origin/production --oneline -n 10    # znajdź commit sprzed regresji
git push origin <dobry-sha>:production --force
```

GitHub webhook odpali się jak przy normalnym pushu — DirectAdmin ściągnie ten stan.

**Alternatywa bez force-pusha z laptopa:** w DirectAdmin Git Manager jest zwykle opcja
"Deploy specific commit/branch" — wskaż tam konkretny SHA z historii `production`
zamiast najnowszego HEAD, jeśli panel na to pozwala (unikasz nadpisywania `production`
na GitHub).

**Jeśli regresja jest w kodzie na `master`:** zrewertuj commit na `master`
(`git revert <sha>`, PR/push), co przez normalny flow (rozdział 2) wypchnie poprawiony
build na `production`.

---

## 6. Skróty

- Build lokalnie: `npm run build` → `dist/`
- Build + push `production` ręcznie (fallback, gdy Actions nie działa): `npm run deploy`
  (`PORTFOLIO_FORCE_DEPLOY=1` żeby ominąć guard na brudne working tree / stary commit)
- Sam push już zbudowanego `dist/`: `npm run deploy:push`
- Workflow: `.github/workflows/deploy-production.yml` (też ręcznie: *Actions* →
  *Deploy production* → *Run workflow*)
- Routing/nagłówki: `public/.htaccess` (kopiowany do `dist/.htaccess` przez Vite)
- Referencja routingu (Caddy, nieaktualny mechanizm serwowania, ale ta sama logika
  tras): `deploy/Caddyfile`
