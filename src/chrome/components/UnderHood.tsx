import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { gsap, ScrollTrigger } from '../../animation/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { getUnderhood, type UnderhoodLayer, type UnderhoodPartId } from '../data/underhood'
import { useLocale } from '../i18n/context'
import { partAtProgress, PART_WINDOWS } from '../underhood/carAssets'
import type { CarSceneHandle } from '../underhood/carScene'
import { supportsWebGL } from '../webgl'
import { Arrow, LinkButton, SectionHeader } from './primitives'
import './underhood.css'

type PartId = UnderhoodPartId

const DEBUG = typeof window !== 'undefined' && window.location.search.includes('debug=1')

/** Scroll stretch each chapter gets, as a fraction of the viewport height. */
const CHAPTER_VH = { desktop: 0.7, mobile: 0.55 }
/** Progress under which the section is still introducing itself. */
const INTRO_UNTIL = 0.06
/**
 * How long a hover from the rail survives the cursor leaving it.
 *
 * The same 160 ms the scene gives its raycast, and for the same reason: moving
 * between two rows crosses a gap, and a gap must not be able to flash the copy
 * back to whatever the scroll happens to be pointing at.
 */
const LIST_HOVER_GRACE_MS = 160

/**
 * "Pod maską" — a fully chrome Formula 1 car that comes apart as you scroll,
 * one component per layer of a website that actually works.
 *
 * The section is eight chapters long and it is read, not skimmed: the scroll
 * pin is eight viewport-sized stretches, one per chapter, and the copy is a
 * chapter card that crossfades in a fixed-height box rather than a list that
 * reflows. Underneath it a slim rail says where you are in the eight and lets
 * you jump — it is a table of contents, not a second copy of the text.
 *
 * The pin drives a single number (0 assembled … 1 fully exploded) into the
 * WebGL scene; which chapter is current is derived from that number, from what
 * the cursor is over — in the rail or in the 3D scene — or from what was
 * clicked. Rail hover wins over scene hover, which wins over a pinned
 * selection, which wins over the part whose explode window the scroll is in.
 *
 * Without WebGL, or with `prefers-reduced-motion`, the same eight chapters are
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
  const triggerRef = useRef<ScrollTrigger | null>(null)

  const [hovered, setHovered] = useState<PartId | null>(null)
  const [listHover, setListHover] = useState<PartId | null>(null)
  const [active, setActive] = useState<PartId | null>(null)
  const [auto, setAuto] = useState<PartId>('body')
  const [intro, setIntro] = useState(true)
  /** The section is close enough to the viewport to start loading its scene. */
  const [nearViewport, setNearViewport] = useState(false)

  // Probed once before the first paint so a capable browser never downloads
  // the fallback clip; `lost` lets a browser that drops its context later fall
  // back to it anyway.
  const [webgl] = useState(supportsWebGL)
  const [lost, setLost] = useState(false)
  const flat = lost || reduced || !webgl

  const current: PartId = listHover ?? hovered ?? active ?? auto
  const index = Math.max(
    0,
    copy.layers.findIndex((l) => l.id === current),
  )
  const total = copy.layers.length

  /* ---- Boot gate ------------------------------------------------------
   * The section sits well below the fold, but its scene shares the same F1
   * .glb + Draco fetches the hero already primed the cache with — creating
   * it at mount (as this used to) fired that decode again on every load,
   * whether or not the visitor ever scrolled this far. An IntersectionObserver
   * with a generous lead margin starts it only once the section is actually
   * approaching the viewport, with enough runway to be ready before it
   * arrives; the scroll pin below still sets up immediately so progress is
   * never lost while the scene itself is still loading. */
  useEffect(() => {
    if (flat || nearViewport) return
    const section = sectionRef.current
    if (!section) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNearViewport(true)
      },
      { rootMargin: '800px 0px' },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [flat, nearViewport])

  /* ---- Scene ------------------------------------------------------- */
  useEffect(() => {
    if (flat || !nearViewport) return
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
          anchors: () => handle?.debug.anchors(),
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
  }, [flat, reduced, nearViewport])

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
        const per = desktop ? CHAPTER_VH.desktop : CHAPTER_VH.mobile
        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          // One viewport-ish stretch per chapter, in pixels rather than a
          // percentage so the number means the same thing at every aspect.
          // `invalidateOnRefresh` re-runs this on resize.
          end: () => `+=${Math.round(total * per * window.innerHeight)}`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            sceneRef.current?.setProgress(self.progress)
            setAuto(partAtProgress(self.progress))
            setIntro(self.progress < INTRO_UNTIL)
          },
        })
        triggerRef.current = st
        return () => {
          if (triggerRef.current === st) triggerRef.current = null
        }
      })
    }, section)

    return () => ctx.revert()
  }, [flat, total])

  /* ---- Selection plumbing ------------------------------------------ */
  useEffect(() => {
    sceneRef.current?.setHover(listHover ?? hovered)
  }, [listHover, hovered])
  useEffect(() => {
    sceneRef.current?.setActive(active)
  }, [active])

  // The scene watches its own canvas, but the pin keeps that canvas on screen
  // for the whole stretch, so the section is the cheaper signal for "nowhere
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

  /* ---- Rail hover, with the same grace the raycast gets -------------- */
  const graceRef = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(graceRef.current), [])
  const enterRow = useCallback((id: PartId) => {
    window.clearTimeout(graceRef.current)
    setListHover(id)
  }, [])
  const leaveRow = useCallback(() => {
    window.clearTimeout(graceRef.current)
    graceRef.current = window.setTimeout(() => setListHover(null), LIST_HOVER_GRACE_MS)
  }, [])

  /* ---- Jumping between chapters ------------------------------------- */
  // Move the pin itself rather than the state: the scene, the rail and the
  // card are all derived from scroll progress, so setting state directly would
  // put them one scroll event away from disagreeing with each other.
  const goTo = useCallback(
    (i: number) => {
      const st = triggerRef.current
      const id = copy.layers[i]?.id
      if (!st || !id) return
      const [a, b] = PART_WINDOWS[id]
      // Just inside the chapter's own window; the opening chapter has no
      // window of its own, so it takes the gap between the intro and the
      // first one.
      const p = b > a ? a + 0.012 : (INTRO_UNTIL + PART_WINDOWS[copy.layers[1].id][0]) / 2
      st.scroll(st.start + (st.end - st.start) * p)
    },
    [copy],
  )

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLUListElement>) => {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) return
    const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button'))
    const at = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (at === -1) return
    e.preventDefault()
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
    buttons[(at + step + buttons.length) % buttons.length]?.focus()
  }, [])

  /* ---- Chapter card: fixed height, crossfaded ------------------------ */
  const slotRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const [cardHeight, setCardHeight] = useState(0)

  // All eight chapters are in the DOM at once, stacked at the same origin, and
  // changing chapter only flips a `data-on` attribute — no node is added or
  // removed, so a change cannot reflow anything and the crossfade is a plain
  // opacity transition rather than a swap. The box is then pinned to the
  // tallest of the eight, measured at the column's real width, so nothing
  // below it can move either. Together with the scene's raycast grace, this is
  // the flicker fix.
  useLayoutEffect(() => {
    if (flat) return
    const slot = slotRef.current
    const stack = stackRef.current
    if (!slot || !stack) return

    let lastWidth = -1
    const run = () => {
      const width = slot.clientWidth
      if (width === lastWidth) return
      lastWidth = width
      let tallest = 0
      for (const child of Array.from(stack.children)) {
        tallest = Math.max(tallest, (child as HTMLElement).offsetHeight)
      }
      if (tallest > 0) setCardHeight(tallest)
    }
    run()
    const ro = new ResizeObserver(run)
    ro.observe(slot)
    return () => ro.disconnect()
  }, [flat, copy])

  /* ---- Pieces ------------------------------------------------------ */
  const proof = (
    <>
      <span className="eyebrow">{copy.proofLabel}</span>
      <span className="mx-2 opacity-40">/</span>
    </>
  )

  const chapter = (l: UnderhoodLayer, n: number) => (
    <>
      <p className="uh-ch-index">
        {String(n + 1).padStart(2, '0')}
        <span className="uh-ch-total"> / {String(total).padStart(2, '0')}</span>
      </p>
      <p className="uh-ch-part">{l.part}</p>
      <h3 className="uh-ch-title">{l.title}</h3>
      <p className="uh-ch-thesis">{l.thesis}</p>
      <p className="uh-ch-proof">
        {proof}
        {l.proof}
      </p>
      <ul className="uh-tags uh-ch-tags">
        {l.tags.map((tag) => (
          <li key={tag} className="uh-tag">
            {tag}
          </li>
        ))}
      </ul>
    </>
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
      <div ref={stageRef} className="uh-stage px-5 pt-20 pb-8 md:px-10 lg:pt-16 lg:pb-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:h-[min(88svh,780px)] lg:grid-cols-12 lg:gap-x-12">
          {/* Canvas first in the DOM: on a phone it is the sticky top of the
              chapter, and on the desktop grid it is placed into column 6. */}
          <div
            ref={canvasHostRef}
            className="uh-canvas-host relative h-[40svh] w-full min-w-0 lg:col-span-7 lg:col-start-6 lg:h-full"
          >
            <canvas ref={canvasRef} className="uh-canvas" aria-hidden />
          </div>

          <div className="uh-col min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <div ref={slotRef} className="uh-slot" style={cardHeight ? { minHeight: cardHeight } : undefined}>
              {/* The section's own opening. It has the floor to itself for the
                  first 6% of the pin and then hands over to chapter 01. */}
              <div className="uh-intro" data-on={intro}>
                <p data-reveal className="eyebrow">
                  {copy.eyebrow}
                </p>
                <h2
                  data-reveal
                  className="chrome-text mt-3 text-[clamp(1.7rem,3.2vw,2.7rem)] leading-[1.06] font-bold tracking-[-0.03em]"
                >
                  {copy.title}
                </h2>
                <p data-reveal className="uh-lead mt-4 max-w-xl">
                  {copy.lead}
                </p>
              </div>

              <div ref={stackRef} className="uh-ch-stack" data-on={!intro}>
                {copy.layers.map((l, i) => (
                  <div
                    key={l.id}
                    className="uh-ch"
                    data-on={i === index}
                    aria-hidden={i !== index}
                  >
                    {chapter(l, i)}
                  </div>
                ))}
              </div>
            </div>

            {/* Table of contents, not a second copy of the text. */}
            <ul className="uh-rail" onKeyDown={onKeyDown} onMouseLeave={leaveRow}>
              {copy.layers.map((l, i) => (
                <li key={l.id}>
                  <button
                    type="button"
                    className="uh-row"
                    data-state={i === index ? 'current' : i < index ? 'past' : 'future'}
                    aria-current={i === index}
                    onPointerEnter={() => enterRow(l.id)}
                    onFocus={() => enterRow(l.id)}
                    onBlur={leaveRow}
                    onClick={() => goTo(i)}
                  >
                    <span className="uh-row-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="uh-row-label">
                      <span className="uh-row-part">{l.part}</span>
                      <span className="uh-row-dot"> · </span>
                      {l.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* The same rail on a phone, collapsed to a counter and two steps. */}
            <div className="uh-stepper">
              <button
                type="button"
                className="uh-step"
                onClick={() => goTo(Math.max(0, index - 1))}
                disabled={index === 0}
                aria-label={copy.layers[index - 1]?.title ?? copy.layers[0].title}
              >
                <Chevron dir="up" />
              </button>
              <span className="uh-step-count">
                {String(index + 1).padStart(2, '0')}
                <span className="uh-ch-total">/{String(total).padStart(2, '0')}</span>
              </span>
              <button
                type="button"
                className="uh-step"
                onClick={() => goTo(Math.min(total - 1, index + 1))}
                disabled={index === total - 1}
                aria-label={copy.layers[index + 1]?.title ?? copy.layers[total - 1].title}
              >
                <Chevron dir="down" />
              </button>
            </div>

            <p className="uh-hint">
              <span className="hidden lg:inline">{copy.hint}</span>
              <span className="lg:hidden">{copy.hintTouch}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="px-5 pt-16 pb-24 md:px-10 md:pb-32">{cta}</div>
    </section>
  )
}

function Chevron({ dir }: { dir: 'up' | 'down' }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden focusable="false">
      <path
        d={dir === 'up' ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
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
