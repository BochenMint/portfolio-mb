# Efekt kursora na obrazach — fromanother.love (research + implementacja)

**Data research:** 2026-05-29  
**Data implementacji WebGL:** 2026-05-29  
**Źródło:** [fromanother.love](https://www.fromanother.love/) — sekcja *Featured work*, m.in. *Year of the Rabbit* (La Mer).

## Stack (potwierdzone z HTML / chunków `_next/static`)

| Warstwa | Technologia |
|---------|-------------|
| Framework | **Next.js** (App Router) |
| Animacja UI | **GSAP** (`quickTo`) |
| Obraz „żywy” przy kursorze | **Three.js / WebGL** — ping-pong FBO + displacement |

## Co robi oryginał

### 1. Symulacja płynu na render target (64×64–128×128)

Fragment shader: propagacja fali (sąsiedzi texeli) + tłumienie `uDissipation` + „pędzel” przy `uMouse` (`smoothstep(uBrushRadius, 0.0, dist) * uVelocity`).

### 2. Deformacja siatki obrazu

Plane z segmentacją; `pos.z += texture2D(uDisplacementMap, uv).r * uVertexStrength`; fragment shader z refrakcją UV od gradientu wysokości.

### 3. Intro

`uProgress` + fala okrężna od środka UV przy wejściu w viewport.

## Implementacja portfolio-mb (WebGL)

**Technika:** vanilla **Three.js** (dynamic `import('three')`), bez R3F — osobny chunk `three`.

| Plik | Rola |
|------|------|
| `src/webgl/createDisplacementEffect.ts` | Ping-pong RT, symulacja fali, plane + custom GLSL |
| `src/webgl/displacementConfig.ts` | Presety `hero` / `strong` / `subtle` |
| `src/components/ProjectImageWebGL.tsx` | Canvas, ResizeObserver, IntersectionObserver, RAF loop |
| `src/components/ProjectImageInteractive.tsx` | Lazy WebGL + fallback `ProjectImage` |
| `src/hooks/useWebGLCapable.ts` | `(hover:hover) and (pointer:fine)` + `prefers-reduced-motion` |
| `src/lib/projectImageUrl.ts` | Ścieżki WebP z `public/projects/` |

### Poziomy intensywności

| Poziom | Gdzie | Parametry (skrót) |
|--------|-------|-------------------|
| `hero` | Mint flagship | sim 128, segments 80, brush 0.55, vertex 42 |
| `strong` | Pozostałe 3 w FeaturedWork + karty Work/Stories | sim 96, segments 64 |
| `subtle` | Opcjonalnie (nie używane na featured) | sim 64 |
| `off` / fallback | `pointer: coarse`, reduced motion, błąd WebGL | statyczny `ProjectImage` |

### Integracja

- **App.tsx → FeaturedWork:** wszystkie 4 obrazy — `hero` (mint) / `strong` (plumm, idrive, agentic).
- **Work.tsx / ProjectStories.tsx:** `ProjectImageInteractive` (gotowe pod layout z commitów fromanother).
- **WorkStrip:** statyczny `ProjectImage` (małe miniatury).

### Performance / a11y

- Lazy import Three + `createDisplacementEffect`
- `manualChunks: { three }` w `vite.config.ts`
- `ResizeObserver` na kontenerze
- `IntersectionObserver` — pauza symulacji poza viewportem
- `renderer.dispose()` + `WEBGL_lose_context` przy unmount
- `prefers-reduced-motion` i touch → brak WebGL

### Bliskość do oryginału (szczerze)

| Aspekt | Match |
|--------|-------|
| Ping-pong FBO + brush | ~90% mechaniki |
| Vertex Z + UV distort | ~85% |
| Intro radial wave | ~75% |
| GSAP tilt całej karty + Lenis parallax sekcji | ~0% (nie portowane) |
| **Łącznie wizualnie** | **~78–85%** desktop z myszą |

Brakuje głównie **parallaxu całej karty** i **GSAP quickTo** na transformach UI obok WebGL — sam displacement/ripple jest w tej samej klasie co fromanother.

## Mobile / a11y

- Brak myszy → statyczny WebP (`ProjectImage`)
- `prefers-reduced-motion: reduce` → statyczny obraz
- Brak touch-drag (konflikt ze scroll)

## Dev

```bash
npm run dev   # port 5190, strictPort
```

Bundle: po build sprawdź `dist/assets/three-*.js` + `index-*.js` vs baseline sprzed Three.
