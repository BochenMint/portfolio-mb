# Checklist go-live

Uzupełnij przed pierwszym ruchem z reklam / LinkedIn. Szczegóły deploy: [`DEPLOY-MAC-MINI.md`](DEPLOY-MAC-MINI.md).

## Konfiguracja (Twoja odpowiedzialność)

**Indeksacja gry:** `gra.marcinbochenek.com` serwuje `gra.html` (`index,follow`). Podgląd na `marcinbochenek.com/v4.html` zostaje `noindex` — Caddy w `deploy/Caddyfile` już to rozdziela; po `npm run build` wystarczy skopiować `dist/` na Mini.

- [ ] Domeny `marcinbochenek.com`, `mb-ai.pl` w Cloudflare (DNS + proxy)
- [ ] Rekord `gra.marcinbochenek.com` → ten sam Tunnel
- [ ] Cloudflare Email Routing: `kontakt@marcinbochenek.com` → Twoja skrzynka
- [ ] (Opcja) alias `kontakt@mb-ai.pl` → ta sama skrzynka
- [ ] Konto [Web3Forms](https://web3forms.com) — access key w `.env` na Mini
- [ ] Cal.com / Calendly — **prawdziwy** link audytu 20 min w `VITE_CALENDLY_URL` (np. `https://cal.com/twoj-user/audyt` — **nie** `https://cal.com/` ani placeholder z `.env.example`)
- [ ] Na Mac Mini: `cp .env.example .env` i uzupełnij wartości przed `npm run build`

## Build i serwis

- [ ] `npm ci && npm run build` na Mini
- [ ] Caddy z `deploy/Caddyfile` na `127.0.0.1:8080`
- [ ] `cloudflared` jako LaunchDaemon z `deploy/cloudflared-config.example.yml`
- [ ] **Brak** port forward 80/443 na routerze

## Smoke test

- [ ] https://marcinbochenek.com/ — studio, logo, cennik, FAQ, formularz
- [ ] https://marcinbochenek.com/en/ — English, `html lang=en`, hreflang, ten sam zakres treści
- [ ] https://marcinbochenek.com/ua/ — Ukrainian, `html lang=uk` (nie `ua`); switcher pokazuje **UA**
- [ ] Language switcher PL | EN | UA w nav i footer; URL wygrywa z localStorage
- [ ] https://marcinbochenek.com/#cennik — pakiety widoczne
- [ ] https://mb-ai.pl/ — landing MB AI
- [ ] https://mb-ai.pl/en/ i https://mb-ai.pl/ua/ — Caddy rewrite na `mb-ai-en.html` / `mb-ai-ua.html`
- [ ] https://gra.marcinbochenek.com/ — gra V4 (`gra.html`, `index,follow`), link „klasyczne portfolio” wraca na marcinbochenek.com
- [ ] https://marcinbochenek.com/v4.html — ten sam build, ale `noindex` (wariant podglądu na domenie głównej)
- [ ] Submit formularza (Web3Forms) → mail na kontakt@
- [ ] CTA audytu otwiera Cal.com/Calendly
- [ ] Favicon / apple-touch widoczne

## Bezpieczeństwo

- [ ] Orange-cloud na wszystkich hostach
- [ ] WAF Managed Rules włączone
- [ ] Headers z Caddyfile obecne (HSTS, CSP) — sprawdź securityheaders.com
- [ ] Żadnych prywatnych API keys w repo / `VITE_*` poza publicznymi (Web3Forms)

## Po starcie

- [ ] Google Search Console → obie domeny + sitemap
- [ ] Podmień placeholder Calendly w `.env.example` komentarzem „ustawione na Mini”
