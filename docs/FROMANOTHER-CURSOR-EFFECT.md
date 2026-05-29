# Efekt kursora na obrazach — fromanother.love (research)

**Data:** 2026-05-29  
**Źródło:** [fromanother.love](https://www.fromanother.love/) — sekcja *Featured work*, m.in. *Year of the Rabbit* (La Mer).

## Stack (potwierdzone z HTML / chunków `_next/static`)

| Warstwa | Technologia |
|---------|-------------|
| Framework | **Next.js** (App Router, `__variable_*` fonty) |
| Animacja UI | **GSAP** (`quickTo` w chunkach layout/page) |
| Komponenty | **Framer Motion** (osobny chunk) |
| Obraz „żywy” przy kursorze | **Three.js / WebGL** — nie czysty CSS |

Brak publicznego repo; analiza przez `Invoke-WebRequest` na bundlach produkcyjnych.

## Co faktycznie robi fromanother (nie tylko tilt)

### 1. Symulacja płynu na render target (64×64)

Fragment shader (skrót z `app/page-*.js`):

```glsl
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uDissipation;
uniform float uBrushRadius;
uniform float uVelocity;

// propagacja fali (sąsiedzi texeli) + tłumienie
// „pędzel” przy uMouse: smoothstep(uBrushRadius, 0.0, distMouse) * uVelocity
```

To klasyczny **ping-pong FBO**: tekstura przechowuje wysokość/prędkość fali; ruch myszy „maluje” impuls w UV przestrzeni karty.

### 2. Deformacja siatki obrazu

Drugi shader:

```glsl
uniform sampler2D uDisplacementMap;
uniform float uVertexStrength;
// pos.z += texture2D(uDisplacementMap, uv).r * uVertexStrength;
```

Obraz to **plane z segmentacją**; mapa z kroku 1 przesuwa wierzchołki w Z → wizualnie **fala / ripple** pod kursorem, nie tylko przechylenie płaszczyzny.

Dodatkowo: `uProgress`, fala okrężna przy wejściu (`smoothstep` od środka UV) — animacja „rozlewania” przy scroll/hover sekcji.

### 3. Co *nie* jest głównym efektem featured

| Technika | Werdykt |
|----------|---------|
| Sam CSS `rotateX` / `rotateY` | Obecny w GSAP (transform string), ale **uzupełnia** WebGL, nie zastępuje go |
| Multi-layer depth map (2 PNG) | Nie widać w bundlu jako osobny asset pipeline |
| Canvas 2D distortion | Nie — idzie przez Three + custom GLSL |
| Point cloud / particles | Nie na kartach work |

## Zachowanie UX (obserwacja + DOM)

| Aspekt | Opis |
|--------|------|
| **Co się rusza** | Tekstura kampanii + relief 3D od displacement; delikatny parallax całej karty przy scroll (Lenis + GSAP) |
| **Easing** | GSAP `power3` / `quickTo` (~0.5–0.8 s) na transformach UI; symulacja ma własne `uDissipation` (~0.98/frame) |
| **Hover** | Efekt aktywny przy `pointer: fine` + hover na obszarze karty |
| **Mobile** | Brak myszy → brak „pędzla”; statyczny obraz / video w tle; preloader z % |
| **Reduced motion** | Nie zweryfikowano w kodzie w 100%; bezpiecznie zakładać brak WebGL na `prefers-reduced-motion` |

## Awwwards

Strona agencji bywa na SOTD / elementach inspiracji (kategoria: Web Experience, cursor + WebGL). Powiązane tagi na Awwwards: `webgl`, `cursor`, `canvas`, `animation` — spójne z powyższą analizą bundla.

## Implementacja w portfolio-mb (decyzja)

**Wybrana technika:** warstwowy **CSS 3D tilt + parallax translate** sterowany **GSAP `quickTo`** na CSS variables (`--tilt-x`, `--tilt-y`, `--px`, `--py`), bez Three.js.

| Poziom | Gdzie | Efekt |
|--------|-------|--------|
| `hero` | Mint (flagship) w Work + case study | tilt do ~7°, parallax do ~16px, shine, scale ~1.04 |
| `subtle` | Plumm, iDrive, Agentic | tilt ~3.5°, parallax ~8px |
| `off` | Work strip, reduced motion, `pointer: coarse` | zwykły `ProjectImage` |

**Bliskość do oryginału:** ~**55–65%** wizualnie — brakuje **płynnej fali/displacement** na pikselach; zostaje „premium card“ 3D + głębia przez przesunięcie kadru i highlight. Pełny WebGL (~150–400 KB + R3F) odrzucony świadomie (INSPIRATION.md: bez WebGL w v1).

**Pliki:** `ProjectImageInteractive.tsx`, `useProjectImagePointer.ts`, integracja w `Work.tsx`, `ProjectStories.tsx`.

## Mobile / a11y

- `(hover: hover) and (pointer: fine)` — tylko desktop z myszą  
- `prefers-reduced-motion: reduce` → statyczny obraz  
- Brak touch-drag parallax (unikamy konfliktu ze scrollowaniem)
