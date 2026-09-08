import type { HeroScene, HeroSceneOptions } from '../webgl/hero/heroSceneTypes'
import { getDpr } from '../webgl/hero/heroSceneTypes'
import { pointerOnElement } from '../lib/pointerSurface'

/**
 * "Fluted glass" — ryflowane szkło podświetlone od tyłu.
 * Za szybą: animowane pole światła (copper / sea-glass + tarragon ink).
 * Każde pionowe żebro działa jak soczewka cylindryczna: ZAŁAMUJE tło
 * (przesunięcie próbkowania w poprzek żebra), rozszczepia kolory na
 * krawędziach (dyspersja RGB), rozmywa w pionie (smuga szkła) i łapie
 * specular na grzbiecie. Mysz przesuwa światło za szybą.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uMouse;
  uniform float uBars;
  uniform float uScrim;
  uniform float uBeam;

  const vec3 INK       = vec3(0.024, 0.042, 0.034);
  const vec3 COPPER    = vec3(0.780, 0.478, 0.278);
  const vec3 BRIGHT    = vec3(0.910, 0.698, 0.438);
  const vec3 SEA_GLASS = vec3(0.208, 0.448, 0.478);
  const vec3 EMBER     = vec3(0.478, 0.312, 0.188);
  const vec3 SEA       = vec3(0.188, 0.438, 0.468);

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // ── Pole światła ZA szybą (czysta matematyka — tanie wielokrotne próbkowanie)
  vec3 lightField(vec2 uv) {
    vec2 p = vec2(uv.x * uAspect, uv.y);

    // główne słońce — góra-prawo, dryfuje + reaguje na mysz
    // portret: słońce wyżej, żeby gorący punkt nie siedział za nagłówkiem
    float portrait = max(0.0, 1.0 - uAspect);
    vec2 sun = vec2(
      (0.72 + (uMouse.x - 0.5) * 0.28 + 0.02 * sin(uTime * 0.23)) * uAspect,
      0.70 + portrait * 0.35 + (uMouse.y - 0.5) * 0.22 + 0.04 * sin(uTime * 0.17)
    );
    // żar — dół-lewo, wolny obieg
    vec2 ember = vec2(
      (0.18 + 0.05 * sin(uTime * 0.11)) * uAspect,
      0.14 + 0.05 * cos(uTime * 0.14)
    );
    // mała gorąca drobina wędrująca środkiem (życie w tle)
    vec2 spark = vec2(
      (0.45 + 0.22 * sin(uTime * 0.07)) * uAspect,
      0.38 + 0.18 * sin(uTime * 0.09 + 1.7)
    );

    // portret: bez korekty słońce zalewa cały wąski ekran (x ściśnięty przez aspect)
    float aspectFix = 1.0 + 1.7 * max(0.0, 1.0 - uAspect);
    float gSun = exp(-pow(distance(p, sun), 2.0) * 2.4 * aspectFix);
    float gEmb = exp(-pow(distance(p, ember), 2.0) * 3.0 * aspectFix);
    float gSpk = exp(-pow(distance(p, spark), 2.0) * 9.0);

    float tealZone = smoothstep(0.75, 0.0, uv.x) * smoothstep(0.15, 0.85, uv.y);
    float darkZone = smoothstep(0.45, 0.95, uv.x) * smoothstep(0.55, 0.02, uv.y);

    vec3 col = INK;
    col = mix(col, SEA, tealZone * 1.22);
    col += EMBER * gEmb * 1.18;
    col = mix(col, SEA_GLASS, clamp(gSun * 1.24, 0.0, 1.0));
    col = mix(col, COPPER, clamp(pow(gSun, 1.55) * 1.38, 0.0, 1.0));
    col = mix(col, BRIGHT, clamp(pow(gSun, 3.6) * 1.08, 0.0, 1.0));
    col += SEA_GLASS * gSpk * 0.68;
    col = mix(col, INK, darkZone * 0.82);

    // pionowa linia świetlna ZA szkłem — podświetla ryfle od dołu,
    // pozycja podąża za kursorem (refrakcja żeber łamie ją naturalnie)
    float beamX = 0.62 + (uMouse.x - 0.5) * 0.34;
    float dxB = abs(uv.x - beamX);
    float beamCore = exp(-pow(dxB / 0.0055, 2.0));
    float beamGlow = exp(-pow(dxB / 0.055, 2.0));
    float lift = smoothstep(1.1, 0.0, uv.y);                 // najjaśniej przy dole
    float beam = (beamCore * 1.5 + beamGlow * 0.5) * (0.30 + 0.85 * lift);
    col += BRIGHT * beam * uBeam;
    // gorący punkt u podstawy linii (źródło światła "od spodu")
    float base = exp(-pow(distance(uv, vec2(beamX, 0.02)) / 0.11, 2.0));
    col += BRIGHT * base * 0.55 * uBeam;

    return col;
  }

  void main() {
    vec2 uv = vUv;

    // ── geometria żebra ──
    float fx = fract(uv.x * uBars);          // 0..1 w poprzek żebra
    float c = fx - 0.5;                       // -0.5..0.5 (środek żebra = 0)

    // profil soczewki cylindrycznej: przesunięcie próbkowania rośnie ku krawędzi
    float bend = sign(c) * pow(abs(c) * 2.0, 1.6);
    float refr = bend * (10.0 / uBars) * 0.55;   // siła załamania
    // delikatna falistość szkła (nierówność ryfli)
    float wob = sin(uv.y * 9.0 + uTime * 0.4 + floor(uv.x * uBars) * 1.7) * 0.004;

    vec2 ruv = vec2(uv.x + refr + wob, uv.y);

    // ── dyspersja chromatyczna na krawędziach (szkło rozszczepia) ──
    float disp = abs(bend) * 0.010;
    vec3 col;
    col.r = lightField(ruv + vec2(disp, 0.0)).r;
    col.g = lightField(ruv).g;
    col.b = lightField(ruv - vec2(disp, 0.0)).b;

    // ── pionowa smuga (fluted glass rozmywa w pionie) ──
    vec3 smear = lightField(ruv + vec2(0.0, 0.045)) + lightField(ruv - vec2(0.0, 0.055));
    col = mix(col, (col + smear) / 3.0, 0.55);

    // ── cieniowanie szkła ──
    // ciemna spoina między żebrami
    float seam = smoothstep(0.0, 0.06, fx) * smoothstep(1.0, 0.94, fx);
    col *= mix(0.30, 1.0, seam);
    // środek żebra lekko jaśniejszy (grubość szkła)
    col *= 0.82 + 0.30 * exp(-pow(c / 0.30, 2.0));

    // specular na grzbiecie żebra — podwójny refleks, zależny od jasności tła
    float lum = dot(lightField(ruv), vec3(0.299, 0.587, 0.114));
    float spec1 = exp(-pow((fx - 0.18) / 0.045, 2.0));
    float spec2 = exp(-pow((fx - 0.86) / 0.035, 2.0));
    col += vec3(0.94, 0.86, 0.74) * (spec1 * 0.9 + spec2 * 0.45) * (0.10 + 0.75 * lum);

    // mleczność szkła (frost) — subtelna, bez wybielania
    col = mix(col, col + vec3(0.014, 0.020, 0.018), 0.32);

    // ── scrim pod typografię ──
    float scrim = exp(-pow((uv.x - 0.5) / 0.46, 2.0)) * exp(-pow((uv.y - 0.42) / 0.40, 2.0));
    col = mix(col, INK, scrim * uScrim);

    // winieta + ziarno
    float vig = smoothstep(1.35, 0.40, length(uv - 0.5));
    col *= mix(0.62, 1.0, vig);
    float n = hash(uv * (310.0 + mod(uTime, 7.0)));
    col += (n - 0.5) * 0.028;

    gl_FragColor = vec4(col, 1.0);
  }
`

export async function createPleatedScene(
  canvas: HTMLCanvasElement,
  options: HeroSceneOptions,
): Promise<HeroScene> {
  const THREE = await import('three')
  const low = options.lowPower ?? false

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: low ? 'default' : 'high-performance',
  })
  renderer.setPixelRatio(getDpr(low))

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const geo = new THREE.PlaneGeometry(2, 2)
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uBars: { value: low ? 26 : 42 },
      uScrim: { value: low ? 0.58 : 0.42 },
      uBeam: { value: low ? 0.7 : 1.0 },
    },
    depthTest: false,
    depthWrite: false,
  })
  scene.add(new THREE.Mesh(geo, mat))

  let raf = 0
  let running = false
  let time = 0
  let lastFrame = 0
  let targetMX = 0.5
  let targetMY = 0.5
  let smoothMX = 0.5
  let smoothMY = 0.5
  let removePointer: (() => void) | undefined

  const tick = (now: number) => {
    if (!running) return
    const dt = options.reducedMotion
      ? 0
      : Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016)
    lastFrame = now

    if (!options.reducedMotion) {
      time += dt
      smoothMX += (targetMX - smoothMX) * 0.085
      smoothMY += (targetMY - smoothMY) * 0.085
      mat.uniforms.uTime.value = time
      ;(mat.uniforms.uMouse.value as { set: (x: number, y: number) => void }).set(smoothMX, smoothMY)
    }

    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }

  const onMove = (e: PointerEvent) => {
    const p = pointerOnElement(e.clientX, e.clientY, canvas)
    targetMX = p.nx
    targetMY = 1 - p.ny
  }

  return {
    setSize(w: number, h: number) {
      if (w < 2 || h < 2) return
      renderer.setSize(w, h, false)
      mat.uniforms.uAspect.value = w / Math.max(h, 1)
    },

    start() {
      if (running) return
      running = true
      if (!options.reducedMotion) {
        window.addEventListener('pointermove', onMove, { passive: true })
        removePointer = () => window.removeEventListener('pointermove', onMove)
      }
      raf = requestAnimationFrame(tick)
    },

    stop() {
      running = false
      cancelAnimationFrame(raf)
      removePointer?.()
      removePointer = undefined
    },

    dispose() {
      running = false
      cancelAnimationFrame(raf)
      removePointer?.()
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
