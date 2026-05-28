# Mapa konwersji portfolio

## Lejek

1. **Hero** — ICP badge (25k+), 4 nazwane produkty, CTA audyt
2. **Proof bar** — Mint, Plumm, iDrive, Agentic OS
3. **Results strip** — KPI (do weryfikacji liczb z klientem)
4. **Horizontal realizacje** — hi-res WebP (`ProjectImage`)
5. **Case studies PSR** — Mint flagship (ból → podejście → wynik)
6. **Usługi** — outcome, nie feature list
7. **Cennik** — 3 pakiety + filtr budżetu
8. **Social proof** — testimonials (patrz zgody poniżej)
9. **FAQ** — obiekcje (cena, NDA, AI)
10. **Brief + Web3Forms/Formspree** — kwalifikacja przed rozmową
11. **Sticky CTA** — mobile

## Eventy do analytics (faza 2)

- `cta_hero_audit`
- `cta_sticky_audit`
- `form_brief_submit`
- `case_mint_open`

## Must-fix przed ads / LinkedIn

- [x] Hi-res screeny WebP (`public/projects/`)
- [ ] `VITE_CALENDLY_URL` w `.env` — **zamień placeholder na swój link**
- [ ] `VITE_FORM_ACCESS_KEY` — klucz z [web3forms.com](https://web3forms.com)
- [ ] Prawdziwy `site.email` w `content.ts`
- [ ] **Zgoda na cytaty** — testimonials oznaczone jako placeholder; podmień na realne cytaty po akceptacji klienta

## Regeneracja screenów

```bash
npm run capture:screens
```

Źródła: mintapartments.pl (hero + apartament), plumm.pl (hero). iDrive / Agentic OS — branded placeholder do czasu materiałów produkcyjnych.
