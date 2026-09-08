# Wdrożenie produkcyjne — Mac Mini + Cloudflare Tunnel

Przewodnik go-live dla statycznego buildu Vite (`dist/`) serwowanego przez **Caddy** na Mac Mini, z publicznym dostępem wyłącznie przez **Cloudflare Tunnel** (bez otwierania portów 80/443 na routerze).

## Architektura

```
Internet → Cloudflare (DNS, TLS, WAF) → cloudflared (Mac Mini) → Caddy :8080 → dist/
```

| Host | Plik wejściowy | Opis |
|------|----------------|------|
| `marcinbochenek.com` | `index.html` | Portfolio główne |
| `gra.marcinbochenek.com` | `gra.html` | Gra kosmiczna (V4, indeksowana) |
| `marcinbochenek.com/v4.html` | `v4.html` | Podgląd gry na domenie głównej (`noindex`) |
| `mb-ai.pl` | `mb-ai.html` | Landing MB AI |

`www.*` przekierowuje 301 na wersję apex (bez `www`).

---

## 1. DNS w Cloudflare (oba domeny)

Dla **marcinbochenek.com** i **mb-ai.pl**:

1. Dodaj domeny do jednego konta Cloudflare (jeśli jeszcze nie są).
2. Ustaw nameservery u rejestratora na Cloudflare.
3. Po utworzeniu tunelu (krok 2) rekordy DNS dla hostów utworzy `cloudflared tunnel route dns` — upewnij się, że mają **pomarańczową chmurę** (proxy ON).
4. SSL/TLS w panelu Cloudflare: **Full** lub **Full (strict)** — TLS kończy Cloudflare; do `127.0.0.1:8080` idzie czysty HTTP (to zamierzone).

Hosty do skonfigurowania:

- `marcinbochenek.com`, `www.marcinbochenek.com`
- `gra.marcinbochenek.com`
- `mb-ai.pl`, `www.mb-ai.pl`

---

## 2. Cloudflare Tunnel + cloudflared (LaunchDaemon)

### Utworzenie tunelu

Na Mac Mini (zalogowany jako użytkownik z Homebrew):

```bash
brew install cloudflared
cloudflared tunnel login
cloudflared tunnel create portfolio-mb
```

Zapisz **Tunnel ID** z outputu.

### Konfiguracja

```bash
cp deploy/cloudflared-config.example.yml ~/.cloudflared/config.yml
```

Edytuj `~/.cloudflared/config.yml`:

- Podmień `<TUNNEL_ID>` i `<USER>`.
- Upewnij się, że `credentials-file` wskazuje na `~/.cloudflared/<TUNNEL_ID>.json`.

### DNS przez tunel

```bash
cloudflared tunnel route dns portfolio-mb marcinbochenek.com
cloudflared tunnel route dns portfolio-mb www.marcinbochenek.com
cloudflared tunnel route dns portfolio-mb gra.marcinbochenek.com
cloudflared tunnel route dns portfolio-mb mb-ai.pl
cloudflared tunnel route dns portfolio-mb www.mb-ai.pl
```

### LaunchDaemon (autostart po restarcie)

```bash
sudo cloudflared service install
sudo launchctl bootstrap system /Library/LaunchDaemons/com.cloudflare.cloudflared.plist
sudo launchctl enable system/com.cloudflare.cloudflared
```

Sprawdzenie:

```bash
sudo launchctl list | grep cloudflared
cloudflared tunnel info portfolio-mb
```

Logi: `log show --predicate 'process == "cloudflared"' --last 5m`

---

## 3. Caddy (brew) — serwowanie dist/

### Instalacja

```bash
brew install caddy
```

### Konfiguracja

```bash
sudo mkdir -p /var/www/portfolio-mb
# lub: mkdir -p ~/Sites/portfolio-mb

sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
# Na Mac bez /etc/caddy: użyj `caddy run --config deploy/Caddyfile` lub własnego plist
```

W `deploy/Caddyfile` ustaw `root` na faktyczną ścieżkę `dist/`, np.:

- `/var/www/portfolio-mb/dist`, albo
- `/Users/<USER>/Sites/portfolio-mb/dist`

Caddy nasłuchuje na **127.0.0.1:8080** — tylko localhost; z zewnątrz nie ma bezpośredniego dostępu.

### Uruchomienie (przykład LaunchDaemon)

Plist możesz trzymać w repo jako `deploy/com.portfolio-mb.caddy.plist` (opcjonalnie). Minimalnie:

```bash
caddy validate --config deploy/Caddyfile
caddy run --config deploy/Caddyfile
```

Produkcja: skonfiguruj `launchd`, aby Caddy startował po boot i po aktualizacji `dist/`.

---

## 4. Build i deploy kodu

Na Mac Mini w katalogu projektu:

```bash
cd ~/Sites/portfolio-mb   # lub Twoja ścieżka klonu
git pull
npm ci
npm run build
```

Skopiuj lub zsynchronizuj `dist/` do katalogu wskazanego w Caddyfile:

```bash
rsync -a --delete dist/ /var/www/portfolio-mb/dist/
# lub buduj bezpośrednio w docelowym katalogu
```

Po buildzie przeładuj Caddy (jeśli potrzeba): `caddy reload --config /etc/caddy/Caddyfile`

---

## 5. Email Routing (bez serwera poczty na Mini)

**Nie instaluj** Postfix/Dovecot na Mac Mini.

W Cloudflare → **Email** → **Email Routing**:

| Adres | Akcja |
|-------|--------|
| `kontakt@marcinbochenek.com` | Forward → Twój osobisty inbox |
| `kontakt@mb-ai.pl` (opcjonalnie) | Forward → ten sam lub osobny inbox |

W UI strony używany jest `VITE_CONTACT_EMAIL` — ustaw go w `.env` przed buildem, aby zgadzał się z routingiem.

---

## 6. Sekrety środowiskowe (.env)

Przed **pierwszym** buildem produkcyjnym na Mini:

```bash
cp .env.example .env
```

Uzupełnij (wartości nie trafiają do gita):

| Zmienna | Opis |
|---------|------|
| `VITE_CONTACT_EMAIL` | Np. `kontakt@marcinbochenek.com` |
| `VITE_SITE_URL` | `https://marcinbochenek.com` |
| `VITE_MB_AI_URL` | `https://mb-ai.pl` |
| `VITE_GAME_URL` | `https://gra.marcinbochenek.com` |
| `VITE_CALENDLY_URL` | Link Cal.com / Calendly |
| `VITE_FORM_ACCESS_KEY` | Klucz Web3Forms |

Zmienne `VITE_*` są **wbudowywane w bundle** w czasie `npm run build`. Po zmianie `.env` zawsze przebuduj.

---

## 7. Checklist bezpieczeństwa

- [ ] **Brak port forward** 80/443 (ani innych) z routera na Mac Mini — jedyny wejściowy ruch HTTP to tunel do `127.0.0.1:8080`.
- [ ] Caddy binduje tylko `127.0.0.1:8080`, nie `0.0.0.0`.
- [ ] Cloudflare **WAF** włączony (plan Free — podstawowe reguły).
- [ ] **Bot Fight Mode** / rate limiting według potrzeb.
- [ ] Nagłówki bezpieczeństwa w `deploy/Caddyfile` (HSTS, CSP, X-Frame-Options itd.).
- [ ] `.env` **nie** w repozytorium; tylko na serwerze.
- [ ] Aktualizacje macOS i `brew upgrade` dla `caddy` / `cloudflared`.
- [ ] Backup credentials tunelu: `~/.cloudflared/<TUNNEL_ID>.json` (bezpieczne miejsce, nie w git).

---

## 8. Smoke test (po wdrożeniu)

Otwórz w przeglądarce (najlepiej tryb incognito):

| URL | Oczekiwany wynik |
|-----|------------------|
| https://marcinbochenek.com | Portfolio, status 200 |
| https://www.marcinbochenek.com | 301 → apex |
| https://marcinbochenek.com/v4 | Podgląd gry (`v4.html`, `noindex`) |
| https://gra.marcinbochenek.com | Gra (`gra.html`, `index,follow`) |
| https://mb-ai.pl | Landing MB AI |
| https://www.mb-ai.pl | 301 → apex |
| Formularz kontaktowy | Submit → Web3Forms (sprawdź skrzynkę) |
| Przycisk audytu / Calendly | Poprawny embed lub redirect |

Narzędzia:

```bash
curl -sI https://marcinbochenek.com | head
curl -sI https://www.marcinbochenek.com | grep -i location
```

Sprawdź nagłówki CSP/HSTS w DevTools → Network.

---

## 9. Single Point of Failure (SPOF)

Mac Mini to **jedyny serwer origin**:

| Ryzyko | Skutek | Mitigacja |
|--------|--------|-----------|
| Brak prądu / wyłączenie Mini | Strony niedostępne | UPS; monitor uptime (np. Cloudflare / UptimeRobot) |
| Awaria ISP | Brak tunelu | Backup LTE / drugi ISP (opcjonalnie) |
| Awaria dysku | Brak `dist/` | Klon repo + szybki `npm ci && npm run build`; backup `.env` |
| Restart bez launchd | Caddy/cloudflared nie wstaną | LaunchDaemon dla obu usług |

Cloudflare nadal serwuje cache statyczny ograniczony czasowo przy padzie origin — nie zastępuje to działającego tunelu.

---

## Pliki w repozytorium

| Plik | Rola |
|------|------|
| `deploy/Caddyfile` | Routing hostów, nagłówki, root `dist/` |
| `deploy/cloudflared-config.example.yml` | Szablon ingress tunelu |
| `docs/DEPLOY-MAC-MINI.md` | Ten dokument |

Legacy `/v1.html` i `/v2.html` domyślnie **301 → /** (patrz komentarz w Caddyfile, aby je zostawić).
