import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { gsap, ScrollTrigger } from '../../animation/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { getUnderhood, type UnderhoodPartId } from '../data/underhood'
import { useLocale } from '../i18n/context'
import { partAtProgress } from '../underhood/carAssets'
import type { CarSceneHandle } from '../underhood/carScene'
import { supportsWebGL } from '../webgl'
import { Arrow, LinkButton, SectionHeader } from './primitives'
import './underhood.css'

type PartId = UnderhoodPartId

const DEBUG = typeof window !== 'undefined' && window.location.search.includes('debug=1')

/**
 * "Pod maską" — a fully chrome Formula 1 car that comes apart as you scroll,
 * one component per layer of a website that actually works.
 *
 * The scroll pin drives a single number (0 assembled … 1 fully exploded) into
 * the WebGL scene; everything else — which layer the copy shows, which row is
 * lit — is derived from that number, from what the cursor is over in the 3D
 * scene, or from what was clicked. Hover wins over a pinned selection, which
 * wins over the part whose explode window the scroll is currently inside.
 *
 * Without WebGL, or with `prefers-reduced-motion`, the same eight layers are
 * an accordion next to the pre-rendered clip and nothing pins.
 */
export function UnderHood() {
  const { locale, t } = useLocale()
  const copy = useMemo(() => getUnderhood(locale), [locale])
  const reduced = useReducedMotion()

  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<CarSceneHandle | null>(null)

  const [hovered, setHovered] = useState<PartId | null>(null)
  const [active, setActive] = useState<PartId | null>(null)
  const [auto, setAuto] = useState<PartId>('body')

  // Probed once before the first paint so a capable browser never downloads
  // the fallback clip; `lost` lets a browser that drops its context later fall
  // back to it anyway.
  const [webgl] = useState(supportsWebGL)
  const [lost, setLost] = useState(false)
  const flat = lost || reduced || !webgl

  const current: PartId = hovered ?? active ?? auto
  const layer = copy.layers.find((l) => l.id === current) ?? copy.layers[0]

  /* ---- Scene ------------------------------------------------------- */
  useEffect(() => {
    if (flat) return
    const canvas = canvasRef.current
    const host = canvasHostRef.current
    if (!canvas || !host) return

    let disposed = false
    let handle: CarSceneHandle | null = null

    void (async () => {
      const { createCarScene } = await import('../underhood/carScene')
      if (disposed) return
      handle = await createCarScene(canvas, host, { mode: 'explode', reduced })
      if (disposed) {
        handle.dispose()
        return
      }
      sceneRef.current = handle
      handle.onHover(setHovered)
      handle.onSelect((id) => setActive((prev) => (prev === id ? null : id)))
      // The pin may already have scrolled past its start before the model
      // finished decoding.
      ScrollTrigger.refresh()
      if (DEBUG) {
        ;(window as unknown as { __underhood?: unknown }).__underhood = {
          ready: true,
          setProgress: (p: number) => handle?.setProgress(p),
          setHover: (id: PartId | null) => handle?.setHover(id),
          setCamera: (
            az: number | null,
            el: number | null,
            opts?: { dist?: number; target?: [number, number, number] },
          ) => handle?.debug.setCamera(az, el, opts),
          render: () => handle?.debug.render(),
          metrics: () => handle?.debug.metrics(),
        }
      }
    })()

    const ro = new ResizeObserver(() => sceneRef.current?.resize())
    ro.observe(host)

    const onLost = () => setLost(true)
    canvas.addEventListener('carscene:lost', onLost)

    return () => {
      disposed = true
      ro.disconnect()
      canvas.removeEventListener('carscene:lost', onLost)
      handle?.dispose()
      sceneRef.current = null
    }
  }, [flat, reduced])

  /* ---- Scroll pin -------------------------------------------------- */
  useLayoutEffect(() => {
    if (flat) return
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' }, (context) => {
        const { desktop } = context.conditions!
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${desktop ? 320 : 260}%`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            sceneRef.current?.setProgress(self.progress)
            setAuto(partAtProgress(self.progress))
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [flat])

  /* ---- Selection plumbing ------------------------------------------ */
  useEffect(() => {
    sceneRef.current?.setHover(hovered)
  }, [hovered])
  useEffect(() => {
    sceneRef.current?.setActive(active)
  }, [active])

  // The scene watches its own canvas, but the pin keeps that canvas on screen
  // for the whole 320vh, so the section is the cheaper signal for "nowhere
  // near the viewport, stop rendering".
  useEffect(() => {
    const section = sectionRef.current
    if (!section || flat) return
    const io = new IntersectionObserver(
      ([entry]) => sceneRef.current?.setVisible(entry?.isIntersecting ?? true),
      { rootMargin: '200px' },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [flat])

  // On a short laptop the eight rows do not all fit under the header and the
  // card, and on a phone the chips do not all fit across — both containers
  // scroll themselves, which is only useful if the row the scroll (or the
  // cursor) just made current is the one in view. Done by hand rather than
  // with `scrollIntoView`, which would also walk up and nudge the document
  // that Lenis owns.
  const listRef = useRef<HTMLUListElement>(null)
  const railRef = useRef<HTMLUListElement>(null)
  useEffect(() => {
    keepInView(listRef.current, 'vertical')
    keepInView(railRef.current, 'horizontal')
  }, [current])

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLUListElement>) => {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) return
    const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button'))
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (index === -1) return
    e.preventDefault()
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
    buttons[(index + step + buttons.length) % buttons.length]?.focus()
  }, [])

  const pick = (id: PartId) => setActive((prev) => (prev === id ? null : id))

  /* ---- Pieces ------------------------------------------------------ */
  const proof = (
    <>
      <span className="eyebrow">{copy.proofLabel}</span>
      <span className="mx-2 opacity-40">/</span>
    </>
  )

  const card = (
    <div className="uh-card">
      <p className="eyebrow">
        {copy.partLabel} · {layer.part}
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-[-0.01em] text-white">{layer.title}</h3>
      <p className="uh-thesis mt-2 text-[14px] leading-relaxed text-silver-2">{layer.thesis}</p>
      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        {proof}
        {layer.proof}
      </p>
      <ul className="uh-tags mt-3">
        {layer.tags.map((tag) => (
          <li key={tag} className="uh-tag">
            {tag}
          </li>
        ))}
      </ul>
    </div>
  )

  const cta = (
    <div data-reveal className="mx-auto max-w-7xl">
      <LinkButton href="#uslugi" variant="ghost">
        {t.underhoodCta}
        <Arrow />
      </LinkButton>
    </div>
  )

  /* ---- Fallback ----------------------------------------------------- */
  if (flat) {
    return (
      <section id="pod-maska" className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
          <div data-reveal className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <FallbackClip />
            </div>
            <div className="lg:col-span-5">
              {copy.layers.map((l, i) => (
                <details key={l.id} className="border-b border-line py-3">
                  <summary className="flex cursor-pointer items-baseline gap-3">
                    <span className="uh-index">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="uh-part">{l.part}</span>
                      <span className="mt-0.5 block text-[15px] text-white">{l.title}</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-[14px] leading-relaxed text-silver-2">{l.thesis}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {proof}
                    {l.proof}
                  </p>
                  <ul className="uh-tags mt-3">
                    {l.tags.map((tag) => (
                      <li key={tag} className="uh-tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
          <div className="mt-10">{cta}</div>
        </div>
      </section>
    )
  }

  /* ---- Pinned stage -------------------------------------------------- */
  return (
    <section ref={sectionRef} id="pod-maska" className="relative">
      <div ref={stageRef} className="uh-stage px-5 pt-24 pb-8 md:px-10 lg:pt-20 lg:pb-4">
        <div className="mx-auto grid w-full max-w-7xl gap-4 lg:h-[min(88svh,760px)] lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:gap-x-10 lg:gap-y-3">
          <div className="min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <p data-reveal className="eyebrow">
              {copy.eyebrow}
            </p>
            <h2
              data-reveal
              className="chrome-text mt-3 text-[clamp(1.6rem,3.1vw,2.6rem)] leading-[1.06] font-bold tracking-[-0.03em]"
            >
              {copy.title}
            </h2>
            <p
              data-reveal
              className="uh-lead mt-3 hidden max-w-xl text-[15px] leading-relaxed text-silver-2 lg:block"
            >
              {copy.lead}
            </p>
          </div>

          <div
            ref={canvasHostRef}
            className="relative h-[30svh] w-full min-w-0 lg:col-span-7 lg:col-start-6 lg:row-span-3 lg:row-start-1 lg:h-full"
          >
            <canvas ref={canvasRef} className="uh-canvas" aria-hidden />
          </div>

          <div className="min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-2">{card}</div>

          <div className="flex min-h-0 min-w-0 flex-col lg:col-span-5 lg:col-start-1 lg:row-start-3">
            <ul
              ref={listRef}
              // No `flex-1`: the row is taller than eight rows need, and
              // growing into it would strand the hint at the bottom of the
              // stage. The default `flex: 0 1 auto` still lets the list shrink
              // and take its own scrollbar on a viewport too short for them.
              className="uh-list hidden min-h-0 flex-col lg:flex"
              onKeyDown={onKeyDown}
            >
              {copy.layers.map((l, i) => (
                <li key={l.id}>
                  <button
                    type="button"
                    className="uh-item"
                    data-current={l.id === current}
                    aria-pressed={l.id === active}
                    onMouseEnter={() => setHovered(l.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(l.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => pick(l.id)}
                  >
                    <span className="uh-index">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="uh-part">{l.part}</span>
                      <span className="uh-title block">{l.title}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <ul ref={railRef} className="uh-rail lg:hidden" onKeyDown={onKeyDown}>
              {copy.layers.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    className="uh-chip"
                    data-current={l.id === current}
                    aria-pressed={l.id === active}
                    onClick={() => pick(l.id)}
                  >
                    {l.title}
                  </button>
                </li>
              ))}
            </ul>

            <p className="uh-hint mt-3 shrink-0 text-[11px] tracking-[0.08em] text-muted uppercase">
              <span className="hidden lg:inline">{copy.hint}</span>
              <span className="lg:hidden">{copy.hintTouch}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="px-5 pb-24 md:px-10 md:pb-32">{cta}</div>
    </section>
  )
}

/** Scroll one container just far enough to reveal its current row. */
function keepInView(box: HTMLElement | null, axis: 'vertical' | 'horizontal') {
  const row = box?.querySelector<HTMLElement>('[data-current="true"]')
  if (!box || !row) return
  // Rects rather than offsetTop/Left: the rows are `position: relative`, so
  // their offsetParent is not the scroll box.
  const outer = box.getBoundingClientRect()
  const inner = row.getBoundingClientRect()
  if (axis === 'vertical') {
    if (inner.top < outer.top) box.scrollTop += inner.top - outer.top
    else if (inner.bottom > outer.bottom) box.scrollTop += inner.bottom - outer.bottom
    return
  }
  if (inner.left < outer.left) box.scrollLeft += inner.left - outer.left
  else if (inner.right > outer.right) box.scrollLeft += inner.right - outer.right
}

/**
 * `<source media>` only works inside `<picture>`, so the small clip has to be
 * chosen here rather than declared.
 */
function FallbackClip() {
  const [small, setSmall] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setSmall(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <video
      key={small ? 'sm' : 'lg'}
      className="uh-video"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/chrome/f1-exploded.webp"
      src={small ? '/video/f1-explode-960.mp4' : '/video/f1-explode.mp4'}
    />
  )
}
