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
 * mixed fonts (Geist regular + italic Instrument Serif `<em>`) draw exactly
 * like the DOM does — including wrapping, since we never guess line breaks.
 *
 * That word mask (alpha) is blurred + Sobel-differentiated once on the CPU
 * into a static "bevel" normal map. Per frame, the fragment shader adds a
 * slow flowing noise perturbation on top (stronger away from glyph edges,
 * so the bevel stays crisp) and reflects the surface into a procedural
 * chrome environment (bright sky / dark horizon / graphite ground + a
 * couple of soft highlight streaks), inverted in light theme.
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
      powerPreference: 'low-power',
    })
    if (!gl) return // fallback: no WebGL2, keep static gradient text

    const engine = new LiquidChromeEngine(gl, wrap, canvas)
    engine.start()
    return () => engine.destroy()
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

uniform sampler2D uMask; // R,G = base normal (xy, -1..1 packed 0..1), B = edge factor, A = crisp glyph alpha
uniform float uTime;
uniform vec2 uMouse; // -1..1
uniform float uLight; // 0 = dark theme, 1 = light theme
uniform vec2 uAspect; // width/height correction for noise sampling

// cheap hash-based value noise, 2 octaves
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
float flow(vec2 p, float t) {
  float n = 0.0;
  n += vnoise(p * 2.2 + vec2(t * 0.15, -t * 0.10)) * 0.55;
  n += vnoise(p * 4.7 + vec2(-t * 0.22, t * 0.18)) * 0.30;
  n += vnoise(p * 9.3 + vec2(t * 0.31, t * 0.05)) * 0.15;
  return n;
}

vec3 chromeEnv(vec3 r, float lightMode, float t, vec2 mouse) {
  // A tight "zoom" on the environment turns even the small normal wobble of
  // a mostly-flat glyph surface into multiple sky/horizon/ground crossings
  // sweeping across the letterforms — the classic melted-metal look, rather
  // than a single flat mid-tone.
  float y = (r.y + mouse.y * 0.15) * 3.4;
  float horizonY = 0.02 + mouse.y * 0.05;

  // Dark theme: bright sky band up top, dark horizon seam, graphite ground.
  // Light theme: the emphasis inverts so the metal still reads on a pale
  // page — graphite sky, the same dark horizon seam, bright/white ground.
  float sky = smoothstep(-0.1, 0.65, y - horizonY);
  vec3 skyDark = mix(vec3(0.06, 0.065, 0.075), vec3(1.0), sky);
  vec3 skyLight = mix(vec3(0.88, 0.885, 0.90), vec3(0.14, 0.15, 0.17), sky);
  vec3 skyCol = mix(skyDark, skyLight, lightMode);

  float horizon = 1.0 - smoothstep(0.0, 0.035, abs(y - horizonY));
  vec3 horizonCol = mix(vec3(0.015), vec3(0.05), lightMode);
  vec3 col = mix(skyCol, horizonCol, horizon * 0.92);

  float bandPhase = r.x * 6.0 + t * 0.12;
  float band = sin((y - horizonY) * 55.0 + bandPhase) * 0.5 + 0.5;
  vec3 groundDark = mix(vec3(0.10, 0.105, 0.115), vec3(0.30, 0.31, 0.33), band);
  vec3 groundLight = mix(vec3(0.80, 0.82, 0.85), vec3(0.97), band);
  vec3 groundCol = mix(groundDark, groundLight, lightMode);
  col = mix(col, groundCol, smoothstep(horizonY + 0.01, horizonY - 0.5, y));

  // Soft highlight streaks (softbox reflections), slowly drifting with time
  // + mouse. In dark mode they're bright glints; in light mode they read as
  // the "darker reflections" that keep the metal legible on a pale ground.
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float speed = 0.045 + fi * 0.02;
    float width = 0.05 + fi * 0.015;
    float offset = fract(0.2 + fi * 0.37 + t * speed + mouse.x * 0.08);
    float d = abs(fract(r.x * 0.9 + 0.5) - offset);
    d = min(d, 1.0 - d);
    float streak = smoothstep(width, 0.0, d) * smoothstep(-0.9, 0.1, y - horizonY) * (0.6 - fi * 0.12);
    col += streak * mix(1.0, -0.85, lightMode);
  }

  return clamp(col, 0.0, 1.0);
}

void main() {
  vec4 mask = texture(uMask, vUv);
  float alpha = mask.a;
  if (alpha < 0.02) discard;

  vec2 baseN = mask.rg * 2.0 - 1.0;
  float edge = mask.b;

  vec2 flowUv = vUv * uAspect;
  float fx = flow(flowUv + vec2(1.7, 0.3), uTime) - 0.5;
  float fy = flow(flowUv + vec2(-2.1, 4.4), uTime) - 0.5;
  vec2 liquidN = vec2(fx, fy) * 1.1;

  // mouse gently pushes the flow field, like a light dragging across mercury
  liquidN += uMouse * 0.16;

  float interior = 1.0 - edge; // flat glyph interior flows more; edges keep their bevel
  vec2 n2 = baseN + liquidN * (0.3 + interior * 0.9);
  n2 = clamp(n2, -1.3, 1.3);
  float nz = sqrt(max(0.05, 1.0 - dot(n2, n2) * 0.45));
  vec3 normal = normalize(vec3(n2, nz));

  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 reflected = reflect(-viewDir, normal);

  vec3 env = chromeEnv(reflected, uLight, uTime, uMouse);

  float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 2.2);
  vec3 rimCol = uLight > 0.5 ? vec3(0.05) : vec3(1.0);
  vec3 color = env + rimCol * fresnel * 0.35;

  // punch contrast so it reads as bright, high-contrast liquid metal
  float contrastAmt = mix(1.35, 1.2, uLight);
  color = (color - 0.5) * contrastAmt + 0.5;
  color = clamp(color, 0.0, 1.0);

  outColor = vec4(color * alpha, alpha);
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
  private uMouse: WebGLUniformLocation | null
  private uLight: WebGLUniformLocation | null
  private uAspect: WebGLUniformLocation | null

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
  private theme: 'light' | 'dark' = 'dark'

  private mouseX = 0
  private mouseY = 0
  private mouseTX = 0
  private mouseTY = 0
  private onMouseMove = (e: MouseEvent) => {
    const r = this.wrap.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const span = Math.max(window.innerWidth, window.innerHeight)
    this.mouseTX = Math.max(-1, Math.min(1, ((e.clientX - cx) / span) * 3))
    this.mouseTY = Math.max(-1, Math.min(1, ((e.clientY - cy) / span) * 3))
  }

  private maskDpr = Math.min(window.devicePixelRatio || 1, 3)
  private renderDpr = 1

  constructor(gl: WebGL2RenderingContext, wrap: HTMLDivElement, canvas: HTMLCanvasElement) {
    this.gl = gl
    this.wrap = wrap
    this.canvas = canvas

    const dpr = window.devicePixelRatio || 1
    this.renderDpr = Math.min(dpr >= 2 ? dpr * 0.5 : dpr, 2)

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
    this.uMouse = gl.getUniformLocation(this.prog, 'uMouse')
    this.uLight = gl.getUniformLocation(this.prog, 'uLight')
    this.uAspect = gl.getUniformLocation(this.prog, 'uAspect')
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
    const w = Math.max(1, Math.round(rect.width * this.renderDpr))
    const h = Math.max(1, Math.round(rect.height * this.renderDpr))
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
    }
  }

  /** Walk real text nodes under `wrap`, draw each word where the browser put it. */
  private rebuildMask() {
    const rect = this.wrap.getBoundingClientRect()
    const cssW = Math.max(1, rect.width)
    const cssH = Math.max(1, rect.height)
    const dpr = this.maskDpr
    const w = Math.max(1, Math.round(cssW * dpr))
    const h = Math.max(1, Math.round(cssH * dpr))

    const crisp = document.createElement('canvas')
    crisp.width = w
    crisp.height = h
    const ctx = crisp.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.textAlign = 'left'
    ctx.fillStyle = '#fff'

    const domRoot = this.wrap.querySelector<HTMLElement>('.liquid-chrome__dom')
    if (!domRoot) return

    const walker = document.createTreeWalker(domRoot, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
      const text = node.textContent ?? ''
      const parent = node.parentElement
      if (!parent) continue
      const cs = window.getComputedStyle(parent)
      const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      ctx.font = font
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
        const x = box.left - rect.left
        const y = box.top - rect.top + ascent
        ctx.fillText(m[0], x, y)
      }
    }

    const src = ctx.getImageData(0, 0, w, h)
    const n = w * h
    const alpha = new Float32Array(n)
    for (let i = 0; i < n; i++) alpha[i] = src.data[i * 4 + 3] / 255

    // separable box blur (2 passes, small radius) for the normal-map source
    const radius = Math.max(1, Math.round(2 * dpr))
    const blurred = boxBlur2D(alpha, w, h, radius)

    const out = new Uint8Array(n * 4)
    const strength = 2.2
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const xm1 = Math.max(0, x - 1)
        const xp1 = Math.min(w - 1, x + 1)
        const ym1 = Math.max(0, y - 1)
        const yp1 = Math.min(h - 1, y + 1)
        const gx = (blurred[y * w + xp1] - blurred[y * w + xm1]) * 0.5
        const gy = (blurred[yp1 * w + x] - blurred[ym1 * w + x]) * 0.5
        const nx = Math.max(-1, Math.min(1, -gx * strength * dpr))
        const ny = Math.max(-1, Math.min(1, -gy * strength * dpr))
        const edge = Math.max(0, Math.min(1, Math.hypot(gx, gy) * strength * dpr))
        const i = (y * w + x) * 4
        out[i] = ((nx * 0.5 + 0.5) * 255) | 0
        out[i + 1] = ((ny * 0.5 + 0.5) * 255) | 0
        out[i + 2] = (edge * 255) | 0
        out[i + 3] = src.data[i + 3]
      }
    }

    const gl = this.gl
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, out)

    this.maskDirty = false
    this.canvas.classList.add('liquid-chrome__canvas--visible')
  }

  start() {
    const loop = (ts: number) => {
      if (this.destroyed) return
      this.raf = requestAnimationFrame(loop)
      if (document.hidden || !this.visible) return
      if (ts - this.lastRenderTs < 15.5) return // cap ~60fps
      this.lastRenderTs = ts

      if (this.maskDirty) this.rebuildMask()

      this.mouseX += (this.mouseTX - this.mouseX) * 0.05
      this.mouseY += (this.mouseTY - this.mouseY) * 0.05

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
    gl.uniform2f(this.uMouse, this.mouseX, this.mouseY)
    gl.uniform1f(this.uLight, this.theme === 'light' ? 1 : 0)
    const rect = this.wrap.getBoundingClientRect()
    gl.uniform2f(this.uAspect, Math.max(1, rect.width) / 200, Math.max(1, rect.height) / 200)
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
