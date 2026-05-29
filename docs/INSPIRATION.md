# Mapa inspiracji — synteza portfolio

Redesign to **jedna spójna warstwa**, nie klon jednej strony. Ostatnia warstwa agency: **Koto** (żółty + ciemna scena). Pod spodem pozostaje czytelny, ludzki ton (Gloria Lo, Josie Allison). Świadomie **nie** klonujemy: Partizan (shadery), Matveyan (3D), fromanother (all-black only).

| Źródło | URL | Co pożyczamy (1 linia) |
|--------|-----|------------------------|
| Muzli | https://muz.li/inspiration/portfolio-website/ | Case studies: najpierw **problem → wynik**, potem rola i decyzje |
| Gloria Lo | https://www.glorialo.design/ | Przyjazne intro, portret obok nagłówka, siatka „recent work” na jasnym tle |
| Josie Allison | https://www.itsjosie.com/ | Numeracja **01–04**, tagi dyscyplin, osobiste About na jasnym papierze |
| William Dzierson | https://www.dzierson.com/ | Ton technologa/buildera w copy i value prop (bez korpo-slangu) |
| NorthGarden | https://www.awwwards.com/sites/northgarden | Minimal B&W, duże zdjęcia produktów, photography-first w kartach |
| Juan Mora | https://www.awwwards.com/sites/juan-mora-1 | Scroll reveal + delikatny lift/hover kart (bez WebGL) |
| Victor Furuya | https://www.awwwards.com/sites/victor-furuya-26 | Stack Vite + GSAP + Lenis — przejścia scroll, bez ciężkiej sceny 3D |
| Archi Green | https://www.awwwards.com/sites/archi-green-design-studio | Poziomy **work strip** tylko `lg+` (Archi Green) |
| Luke Baffait | https://www.awwwards.com/sites/luke-baffait | Subtelny scrub zdjęć w kartach — **nie** pełny WebGL hero |
| Koto | https://www.awwwards.com/sites/koto | `#FFE800` + `#060606`, bold type w hero, ciemna **scena** w Work, żółte indeksy i CTA |

## Tokeny wizualne

| Token | Wartość | Użycie |
|-------|---------|--------|
| `--color-paper` | `#FAFAF8` | Domyślne tło (jasne sekcje) |
| `--color-night` | `#060606` | Taśma Work / „stage” |
| `--color-accent` | `#FFE800` | Indeksy 01–04, wyniki, CTA fill |
| `--color-ink` | `#1A1A1A` | Tekst na jasnym |

## Sekcje → wzorce

| Sekcja | Synteza |
|--------|---------|
| Hero | Portret + bold serif headline (Gloria + Koto) |
| Work | Jasny nagłówek → ciemna taśma: strip (Archi Green) + karty 01–04 (Josie + Koto) |
| Case studies | Problem → wynik → rola (Muzli), jasne tło |
| About | Czytelny, osobisty blok (Josie / Gloria) |
| Contact | Wyraźny primary CTA (e-mail + formularz) |

## Wykluczone

- Partizan — shadery / WebGL overload  
- Matveyan — sceny 3D  
- fromanother — portfolio wyłącznie na czerni  
