import { useEffect, useRef, type ReactNode } from 'react'
import './liquid.css'

/**
 * Renders its `children` (real DOM text, kept for SEO/a11y/selection) with a
 * live "liquid chrome" WebGL2 overlay layered exactly on top of the glyphs.
 *
 * How the mask is built: rather than re-implementing text layout, we walk
 * the actual text nodes rendered inside the wrapper and ask the browser
 * where each word landed (`Range.getClientRects`). That gives pixel-perfect
 * positions + we read the *computed* font/letter-spacing per text node, so
 * mixed weights (the semibold line and the Light accent `<em>`) draw exactly
 * like the DOM does — including wrapping, since we never guess line breaks.
 *
 * The mask is drawn at a high, fixed resolution (>=2x CSS px) so glyph edges
 * stay crisp no matter the render target size. Alongside the crisp alpha we
 * bake a *soft* bevel normal (large blur radius, ~cap-height scale) and a
 * "local line Y" channel — each word's own top-to-bottom 0..1 position —
 * which is what actually drives the Y2K chrome look: a smooth vertical
 * sky -> horizon -> ground gradient per line of text, not a per-pixel
 * reflection off a noisy normal. A slow, very-low-frequency 2-octave noise
 * field only *wobbles* that gradient (mercury flow) and never touches
 * per-pixel color directly, so the interior stays glassy and continuous —
 * never speckled.
 *
 * Falls back to the static `.chrome-text` gradient (already applied by the
 * caller as the base className) when WebGL2 is unavailable or the user
 * prefers reduced motion — in that case no canvas is even created.
 */
export function LiquidChrome({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return // fallback: leave the static CSS gradient text visible

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      // Matches the project cubes. Contexts asking for different GPUs on the
      // same page make the browser migrate the page between them, and the
      // contexts created before the switch are lost.
      powerPreference: 'high-performance',
    })
    if (!gl) return // fallback: no WebGL2, keep static gradient text

    let engine: LiquidChromeEngine | null = null

    const build = () => {
      if (engine || gl.isContextLost()) return
      try {
        engine = new LiquidChromeEngine(gl, wrap, canvas)
        engine.start()
      } catch {
        // Shader compile/link can fail on a context that is on its way out.
        engine = null
        showDomText()
      }
    }

    /** Give the glyphs back to the DOM: `.chrome-text` underneath is a
     *  complete static fallback, and leaving the canvas marked visible would
     *  cover the headline with a dead, empty rectangle. */
    const showDomText = () => canvas.classList.remove('liquid-chrome__canvas--visible')

    const onLost = (e: Event) => {
      e.preventDefault() // without this the browser will never restore it
      engine?.destroy()
      engine = null
      showDomText()
    }
    const onRestored = () => build()

    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    build()

    return () => {
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      engine?.destroy()
    }
  }, [])

  return (
    <div ref={wrapRef} className="liquid-chrome">
      <div className="liquid-chrome__dom">{children}</div>
      <canvas ref={canvasRef} className="liquid-chrome__canvas" aria-hidden="true" />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Engine
 * ------------------------------------------------------------------ */

/** CSS px the canvas extends past the text box on every side, so descenders
 *  and italic overhang are not clipped. Keep in sync with --liquid-pad. */
const LIQUID_PAD = 16

const VERT = `#version 300 es
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

// R,G = bevel normal (xy, packed 0..1), B = local line-Y (0 top of glyph's
// own line box -> 1 bottom), A = crisp glyph alpha.
uniform sampler2D uMask;
uniform float uTime;
uniform vec2 uMouseUv;   // cursor position in the same 0..1 space as vUv
uniform float uLight;    // 0 = dark theme, 1 = light theme
uniform vec2 uNoiseScale; // low spatial frequency, in cycles across the headline

// cheap hash-based value noise
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
// At most 2 octaves, very low frequency (set via uNoiseScale, ~1.5-2.5
// cycles across the whole headline) and slow (~0.05-0.1 cycles/s) — this is
// the *only* per-pixel variance in the whole shader, so it stays a smooth,
// continuous wobble rather than speckle.
float flow(vec2 uv, float t) {
  vec2 p = uv * uNoiseScale;
  float n = vnoise(p + vec2(t * 0.11, -t * 0.08)) * 0.7;
  n += vnoise(p * 1.6 + vec2(-t * 0.08, t * 0.12) + 11.0) * 0.3;
  return n - 0.5; // -0.5..0.5
}

// Smooth Y2K chrome environment: broad sky / soft grey / a sharp dark
// horizon seam sitting in the lower-middle third of each glyph's own line,
// then a bright(ish) ground below. y is 0 at the top of the line box and
// 1 at the bottom (already includes the slow liquid wobble).
vec3 chromeBands(float y, float lightMode) {
  float horizon = 0.64;

  // Light mode is not the dark palette nudged, it is inverted. Dark theme puts
  // a near-white body against near-black paper; carrying that ground (0.95)
  // onto a #eef0f3 page left everything below the horizon — the bottom third
  // of every glyph — invisible. Here the metal is dark and the horizon is the
  // one bright reflected band, which is also how the static .chrome-text
  // gradient renders the same headline when WebGL is unavailable.
  vec3 sky = mix(vec3(0.99), vec3(0.13, 0.14, 0.16), lightMode);
  vec3 ground = mix(vec3(0.74, 0.76, 0.79), vec3(0.27, 0.28, 0.31), lightMode);
  vec3 horizonCol = mix(vec3(0.035), vec3(0.97), lightMode);

  // subtle internal gradient so sky/ground read as glossy rounded bands
  // rather than flat fills (soft grey transition toward the horizon).
  float skyFall = smoothstep(0.0, horizon, y);
  vec3 skyShaded = mix(sky * 1.03, mix(sky, horizonCol, 0.35), skyFall);

  float groundRise = smoothstep(horizon, 1.0, y);
  vec3 groundShaded = mix(mix(ground, horizonCol, 0.30), ground * 1.02, groundRise);

  float toHorizon = smoothstep(horizon - 0.07, horizon, y);
  float fromHorizon = smoothstep(horizon, horizon + 0.045, y);

  vec3 col = mix(skyShaded, horizonCol, toHorizon);
  col = mix(col, groundShaded, fromHorizon);
  return col;
}

void main() {
  vec4 mask = texture(uMask, vUv);
  float alpha = mask.a;
  // fwidth-based antialiasing on top of the already-AA'd source alpha —
  // guards against shimmer if the mask is ever sampled at an angle/scale.
  float aaw = max(fwidth(alpha), 0.0001);
  float coverage = smoothstep(0.5 - aaw, 0.5 + aaw, alpha);
  if (coverage < 0.01) discard;

  vec2 baseN = mask.rg * 2.0 - 1.0; // smooth bevel normal (large blur radius, no noise)
  float lineY = mask.b;
  float edgeMag = clamp(length(baseN), 0.0, 1.0);

  // The horizon is the surface of the liquid, so it must not sit flat. Two
  // smooth, very low frequency terms move it: an organic swell from the noise
  // field, and a long roll travelling along the headline. Both are sampled in
  // the headline's own uv rather than per glyph, so the surface reads as one
  // pour running across every letter instead of a separate effect stamped
  // into each. Amplitude is what sells it as liquid — 0.10 was a ripple.
  float wobble = flow(vUv, uTime);
  float roll = sin(vUv.x * 2.1 - uTime * 0.33) * 0.055;
  float mouseTilt = (uMouseUv.y - 0.5) * 0.09;

  // Refraction against the bevel. A curved metal surface bends whatever it
  // reflects, so the horizon has to bow as it crosses each stroke instead of
  // running through the glyph as a straight ruled line. The normal is the
  // cap-height-blurred one, so the bend is broad and smooth — this single
  // term is what separates poured metal from a gradient clipped to text.
  float refract = baseN.y * 0.19;

  float y = clamp(lineY + wobble * 0.26 + roll + mouseTilt + refract, 0.0, 1.0);

  vec3 col = chromeBands(y, uLight);

  // Broad, soft-edged softbox streaks drifting slowly across the headline.
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    float speed = 0.02 + fi * 0.015;
    float width = 0.16 + fi * 0.06;
    float center = fract(0.28 + fi * 0.42 + uTime * speed);
    float d = abs(fract(vUv.x - center + 0.5) - 0.5);
    float streak = smoothstep(width, 0.0, d);
    col += streak * mix(0.16, 0.13, uLight);
  }

  // Mild specular that follows the cursor, like a light dragging over mercury.
  float distToMouse = distance(vUv, uMouseUv);
  float specular = smoothstep(0.4, 0.0, distToMouse) * 0.18;
  col += specular * mix(1.0, 0.85, uLight);

  // Crisp embossed rim from the *smooth* bevel normal (no noise inside it):
  // brightens the top edge of strokes, darkens the bottom, like polished
  // metal catching an overhead light.
  col += (-baseN.y) * edgeMag * mix(0.22, 0.14, uLight);
  col += (-baseN.x) * edgeMag * mix(0.10, 0.06, uLight);

  // Surface tension. Poured metal beads up where it meets an edge, catching a
  // bright hairline all the way around the stroke rather than only along the
  // lit side. Cubed so it stays inside the last pixels of the outline and
  // never washes into the body of the glyph.
  col += pow(edgeMag, 3.0) * mix(0.26, 0.34, uLight);

  // Final tone map: clamp hard so highlights read as pure white and the
  // horizon reads as deep graphite — high contrast but smooth (no per-pixel
  // banding artifacts since every input above is a smooth function).
  col = clamp(col, 0.0, 1.0);

  outColor = vec4(col * coverage, coverage);
}`

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh)
    gl.deleteShader(sh)
    throw new Error(`Shader compile error: ${log}`)
  }
  return sh
}

function link(gl: WebGL2RenderingContext, vert: string, frag: string): WebGLProgram {
  const prog = gl.createProgram()!
  const vs = compile(gl, gl.VERTEX_SHADER, vert)
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag)
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog)
    gl.deleteProgram(prog)
    throw new Error(`Program link error: ${log}`)
  }
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  return prog
}

interface Metrics {
  fontBoundingBoxAscent?: number
  actualBoundingBoxAscent: number
}

class LiquidChromeEngine {
  private gl: WebGL2RenderingContext
  private wrap: HTMLDivElement
  private canvas: HTMLCanvasElement
  private prog: WebGLProgram
  private tex: WebGLTexture
  private uTime: WebGLUniformLocation | null
  private uMouseUv: WebGLUniformLocation | null
  private uLight: WebGLUniformLocation | null
  private uNoiseScale: WebGLUniformLocation | null

  private ro: ResizeObserver
  private mo: MutationObserver
  private themeMo: MutationObserver
  private io: IntersectionObserver | null = null
  private visible = true
  private raf = 0
  private startTime = performance.now()
  private lastRenderTs = 0
  private destroyed = false
  private maskDirty = true
  private maskSig = ''
  private sigRange = document.createRange()
  private theme: 'light' | 'dark' = 'dark'

  // Cursor position, smoothed, expressed in the wrapper's own 0..1 UV space.
  private mouseU = 0.5
  private mouseV = 0.3
  private mouseTU = 0.5
  private mouseTV = 0.3
  private onMouseMove = (e: MouseEvent) => {
    const r = this.wrap.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return
    this.mouseTU = (e.clientX - r.left) / r.width
    this.mouseTV = (e.clientY - r.top) / r.height
  }

  // Mask is always built at a high, fixed resolution (>=2x CSS px) so glyph
  // edges stay crisp regardless of the (possibly lower-res) render target.
  private maskDpr = Math.max(2, Math.min(window.devicePixelRatio || 1, 3))
  private renderDpr = 1

  constructor(gl: WebGL2RenderingContext, wrap: HTMLDivElement, canvas: HTMLCanvasElement) {
    this.gl = gl
    this.wrap = wrap
    this.canvas = canvas

    const dpr = window.devicePixelRatio || 1
    this.renderDpr = Math.min(dpr >= 2 ? Math.max(1.5, dpr * 0.5) : dpr, 2)

    this.prog = link(gl, VERT, FRAG)
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    this.tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.useProgram(this.prog)
    this.uTime = gl.getUniformLocation(this.prog, 'uTime')
    this.uMouseUv = gl.getUniformLocation(this.prog, 'uMouseUv')
    this.uLight = gl.getUniformLocation(this.prog, 'uLight')
    this.uNoiseScale = gl.getUniformLocation(this.prog, 'uNoiseScale')
    gl.uniform1i(gl.getUniformLocation(this.prog, 'uMask'), 0)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    this.readTheme()
    this.themeMo = new MutationObserver(() => {
      this.readTheme()
      this.maskDirty = true
    })
    this.themeMo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    this.ro = new ResizeObserver(() => {
      this.resize()
      this.maskDirty = true
    })
    this.ro.observe(this.wrap)

    this.mo = new MutationObserver(() => {
      this.maskDirty = true
    })
    this.mo.observe(this.wrap, { childList: true, characterData: true, subtree: true })

    if ('IntersectionObserver' in window) {
      this.io = new IntersectionObserver(
        (entries) => {
          this.visible = entries[0]?.isIntersecting ?? true
        },
        { threshold: 0 },
      )
      this.io.observe(this.wrap)
    }

    document.addEventListener('visibilitychange', this.onVisibility)
    window.addEventListener('mousemove', this.onMouseMove, { passive: true })

    this.resize()
    void document.fonts.ready.then(() => {
      this.maskDirty = true
    })
  }

  private onVisibility = () => {
    /* handled by rAF checking document.hidden directly */
  }

  private readTheme() {
    this.theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  }

  private resize() {
    const rect = this.wrap.getBoundingClientRect()
    const w = Math.max(1, Math.round((rect.width + LIQUID_PAD * 2) * this.renderDpr))
    const h = Math.max(1, Math.round((rect.height + LIQUID_PAD * 2) * this.renderDpr))
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
    }
  }

  /**
   * Where the glyphs currently are. The mask bakes glyph positions, so it has
   * to be rebuilt whenever they move — and the intro tween slides the lines in
   * by 36px through inline transforms, which changes no layout box and fires
   * neither the ResizeObserver nor the childList/characterData observer. A
   * mask baked mid-tween would stay offset from the real text for good.
   */
  private textSignature(): string {
    const domRoot = this.wrap.querySelector<HTMLElement>('.liquid-chrome__dom')
    if (!domRoot) return ''
    const r = this.wrap.getBoundingClientRect()
    let sig = `${Math.round(r.width)}x${Math.round(r.height)}`
    const walker = document.createTreeWalker(domRoot, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
      this.sigRange.selectNodeContents(node)
      const b = this.sigRange.getBoundingClientRect()
      sig += `|${Math.round(b.top - r.top)},${Math.round(b.left - r.left)},${Math.round(b.width)}`
    }
    return sig
  }

  /** Walk real text nodes under `wrap`, draw each word where the browser put it. */
  private rebuildMask() {
    const sig = this.textSignature()
    const rect = this.wrap.getBoundingClientRect()
    const cssW = Math.max(1, rect.width + LIQUID_PAD * 2)
    const cssH = Math.max(1, rect.height + LIQUID_PAD * 2)
    const dpr = this.maskDpr
    const w = Math.max(1, Math.round(cssW * dpr))
    const h = Math.max(1, Math.round(cssH * dpr))

    const crisp = document.createElement('canvas')
    crisp.width = w
    crisp.height = h
    const ctx = crisp.getContext('2d')
    // Second canvas: for every word, paint its own top->bottom position
    // (0..1, black->white) into its bounding box. This is what lets the
    // shader draw a coherent sky/horizon/ground gradient per *line* of
    // text instead of one continuous gradient across the whole block.
    const lineYCanvas = document.createElement('canvas')
    lineYCanvas.width = w
    lineYCanvas.height = h
    const lctx = lineYCanvas.getContext('2d')
    if (!ctx || !lctx) return
    ctx.scale(dpr, dpr)
    lctx.scale(dpr, dpr)
    ctx.textAlign = 'left'
    ctx.fillStyle = '#fff'

    const domRoot = this.wrap.querySelector<HTMLElement>('.liquid-chrome__dom')
    if (!domRoot) return

    let maxFontPx = 16
    const walker = document.createTreeWalker(domRoot, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
      const text = node.textContent ?? ''
      const parent = node.parentElement
      if (!parent) continue
      const cs = window.getComputedStyle(parent)
      const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      ctx.font = font
      const fontPx = parseFloat(cs.fontSize)
      if (Number.isFinite(fontPx)) maxFontPx = Math.max(maxFontPx, fontPx)
      const letterSpacing = cs.letterSpacing
      if (letterSpacing && letterSpacing !== 'normal' && 'letterSpacing' in ctx) {
        ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = letterSpacing
      }

      const re = /\S+/g
      let m: RegExpExecArray | null
      while ((m = re.exec(text))) {
        const range = document.createRange()
        range.setStart(node, m.index)
        range.setEnd(node, m.index + m[0].length)
        const box = range.getClientRects()[0]
        if (!box || box.width === 0) continue
        const metrics = ctx.measureText(m[0]) as unknown as Metrics
        const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent
        const x = box.left - rect.left + LIQUID_PAD
        const y = box.top - rect.top + LIQUID_PAD + ascent
        ctx.fillText(m[0], x, y)

        const y0 = box.top - rect.top + LIQUID_PAD
        const y1 = box.bottom - rect.top + LIQUID_PAD
        if (y1 > y0) {
          const grad = lctx.createLinearGradient(0, y0, 0, y1)
          grad.addColorStop(0, '#000')
          grad.addColorStop(1, '#fff')
          lctx.fillStyle = grad
          lctx.fillRect(x - 2, y0, box.width + 4, y1 - y0)
        }
      }
    }

    const src = ctx.getImageData(0, 0, w, h)
    const lineYSrc = lctx.getImageData(0, 0, w, h)
    const n = w * h
    const alpha = new Float32Array(n)
    for (let i = 0; i < n; i++) alpha[i] = src.data[i * 4 + 3] / 255

    // Bevel blur radius scales with cap-height (~70% of font size), not a
    // fixed pixel count — ~8% of cap height gives a soft rounded edge
    // rather than a thin halo, and stays proportional at any font size.
    const capHeightPx = maxFontPx * dpr * 0.7
    const radius = Math.max(3, Math.min(40, Math.round(capHeightPx * 0.08)))
    const blurred = boxBlur2D(alpha, w, h, radius)

    // Gradient magnitude for a full 0->1 transition over a blur of this
    // radius is ~1/(2*radius) per pixel; scale back up so the bevel normal
    // reaches a sensible peak tilt right at the edge, then clamp gently.
    const gradGain = radius * 1.6

    const out = new Uint8Array(n * 4)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const xm1 = Math.max(0, x - 1)
        const xp1 = Math.min(w - 1, x + 1)
        const ym1 = Math.max(0, y - 1)
        const yp1 = Math.min(h - 1, y + 1)
        const gx = (blurred[y * w + xp1] - blurred[y * w + xm1]) * 0.5
        const gy = (blurred[yp1 * w + x] - blurred[ym1 * w + x]) * 0.5
        const nx = Math.max(-0.6, Math.min(0.6, -gx * gradGain))
        const ny = Math.max(-0.6, Math.min(0.6, -gy * gradGain))
        const i = (y * w + x) * 4
        out[i] = ((nx * 0.5 + 0.5) * 255) | 0
        out[i + 1] = ((ny * 0.5 + 0.5) * 255) | 0
        out[i + 2] = lineYSrc.data[i] // local line-Y, 0..255
        out[i + 3] = src.data[i + 3] // crisp (unblurred) alpha
      }
    }

    const gl = this.gl
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, out)

    this.maskDirty = false
    this.maskSig = sig
    this.canvas.classList.add('liquid-chrome__canvas--visible')
  }

  start() {
    const loop = (ts: number) => {
      if (this.destroyed) return
      this.raf = requestAnimationFrame(loop)
      if (document.hidden || !this.visible) return
      if (ts - this.lastRenderTs < 15.5) return // cap ~60fps
      this.lastRenderTs = ts

      const sig = this.textSignature()
      if (sig !== this.maskSig) this.maskDirty = true
      if (this.maskDirty) this.rebuildMask()

      this.mouseU += (this.mouseTU - this.mouseU) * 0.05
      this.mouseV += (this.mouseTV - this.mouseV) * 0.05

      this.render((ts - this.startTime) / 1000)
    }
    this.raf = requestAnimationFrame(loop)
  }

  private render(t: number) {
    const gl = this.gl
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(this.prog)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.uniform1f(this.uTime, t)
    gl.uniform2f(this.uMouseUv, this.mouseU, this.mouseV)
    gl.uniform1f(this.uLight, this.theme === 'light' ? 1 : 0)
    // ~2 cycles of noise across the full headline width, matched in Y so
    // noise cells stay roughly square regardless of the box's aspect ratio.
    const rect = this.wrap.getBoundingClientRect()
    const aspect = rect.width > 0 ? rect.height / rect.width : 0.3
    gl.uniform2f(this.uNoiseScale, 1.3, Math.max(0.45, 1.3 * aspect))
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  destroy() {
    this.destroyed = true
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.mo.disconnect()
    this.themeMo.disconnect()
    this.io?.disconnect()
    document.removeEventListener('visibilitychange', this.onVisibility)
    window.removeEventListener('mousemove', this.onMouseMove)
    const gl = this.gl
    gl.deleteTexture(this.tex)
    gl.deleteProgram(this.prog)
  }
}

function boxBlur2D(src: Float32Array, w: number, h: number, radius: number): Float32Array {
  const tmp = new Float32Array(w * h)
  const out = new Float32Array(w * h)
  const size = radius * 2 + 1

  for (let y = 0; y < h; y++) {
    let sum = 0
    for (let x = -radius; x <= radius; x++) sum += src[y * w + Math.max(0, Math.min(w - 1, x))]
    for (let x = 0; x < w; x++) {
      tmp[y * w + x] = sum / size
      const add = src[y * w + Math.max(0, Math.min(w - 1, x + radius + 1))]
      const sub = src[y * w + Math.max(0, Math.min(w - 1, x - radius))]
      sum += add - sub
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0
    for (let y = -radius; y <= radius; y++) sum += tmp[Math.max(0, Math.min(h - 1, y)) * w + x]
    for (let y = 0; y < h; y++) {
      out[y * w + x] = sum / size
      const add = tmp[Math.max(0, Math.min(h - 1, y + radius + 1)) * w + x]
      const sub = tmp[Math.max(0, Math.min(h - 1, y - radius)) * w + x]
      sum += add - sub
    }
  }
  return out
}
