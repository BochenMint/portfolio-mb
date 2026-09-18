import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
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
 * Eight chapters, read not skimmed. Desktop pins the stage with GSAP (the
 * existing premium scrub). Mobile must not: `pin: true` jumps the stage to
 * `position: fixed`, inserts a pin-spacer and produced CLS ~1 plus a scrollY
 * yank on the live phone. Mobile is a naturally tall runway + `position:
 * sticky` on a stable `100svh` frame that holds the car AND the chapter copy
 * at once. ScrollTrigger only reads progress (`pin: false`).
 *
 * Progress 0…1 drives the WebGL explode; the current chapter is derived from
 * that number, from what the cursor is over — rail or 3D — or from a click.
 * Rail hover wins over scene hover, which wins over a pinned selection, which
 * wins over the part whose explode window the scroll is in.
 *
 * Without WebGL, or with `prefers-reduced-motion`, the same eight chapters are
 * an accordion next to the pre-rendered clip: no pin, no tall empty track.
 */
export function UnderHood() {
  const { locale, t } = useLocale()
  const copy = useMemo(() => getUnderhood(locale), [locale])
  const reduced = useReducedMotion()

  const sectionRef = useRef<HTMLElement>(null)
  const runwayRef = useRef<HTMLDivElement>(null)
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
      // Apply wherever the pin already is. A full ScrollTrigger.refresh()
      // here rebuilt pin spacers and jumped scrollY on phones.
      const st = triggerRef.current
      if (st) handle.setProgress(st.progress)
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

  /* ---- Scroll progress --------------------------------------------- */
  useLayoutEffect(() => {
    if (flat) return
    const section = sectionRef.current
    const runway = runwayRef.current
    const stage = stageRef.current
    if (!section || !runway || !stage) return

    const apply = (progress: number) => {
      const p = Math.min(1, Math.max(0, progress))
      stage.style.setProperty('--uh-p', p.toFixed(4))
      stage.dataset.uhP = p.toFixed(4)
      sceneRef.current?.setProgress(p)
      const nextAuto = partAtProgress(p)
      const nextIntro = p < INTRO_UNTIL
      setAuto((prev) => (prev === nextAuto ? prev : nextAuto))
      setIntro((prev) => (prev === nextIntro ? prev : nextIntro))
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' }, (context) => {
        const { desktop } = context.conditions!
        if (desktop) {
          const st = ScrollTrigger.create({
            trigger: runway,
            start: 'top top',
            end: () => `+=${Math.round(total * CHAPTER_VH.desktop * window.innerHeight)}`,
            pin: stage,
            pinSpacing: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => apply(self.progress),
          })
          triggerRef.current = st
          apply(st.progress)
          return () => {
            if (triggerRef.current === st) triggerRef.current = null
          }
        }

        // CSS sticky + progress from the runway rect. rAF while on screen so
        // programmatic scroll / iOS visualViewport still drive 0→1; window
        // `scroll` alone is missed by some WebKit and Playwright mobile paths.
        const read = () => {
          const rect = runway.getBoundingClientRect()
          const span = rect.height - window.innerHeight
          const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : rect.top < 0 ? 1 : 0
          apply(p)
        }
        let visible = false
        let raf = 0
        const io = new IntersectionObserver(([entry]) => {
          visible = entry?.isIntersecting ?? false
          read()
        }, { rootMargin: '200px 0px' })
        io.observe(runway)
        const tick = () => {
          if (visible) read()
          raf = window.requestAnimationFrame(tick)
        }
        raf = window.requestAnimationFrame(tick)
        window.addEventListener('scroll', read, { passive: true })
        window.addEventListener('resize', read)
        read()
        return () => {
          visible = false
          window.cancelAnimationFrame(raf)
          io.disconnect()
          window.removeEventListener('scroll', read)
          window.removeEventListener('resize', read)
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
      const id = copy.layers[i]?.id
      if (!id) return
      const [a, b] = PART_WINDOWS[id]
      const p = b > a ? a + 0.012 : (INTRO_UNTIL + PART_WINDOWS[copy.layers[1].id][0]) / 2
      const st = triggerRef.current
      if (st) {
        st.scroll(st.start + (st.end - st.start) * p)
        return
      }
      const runway = runwayRef.current
      if (!runway) return
      const top = runway.getBoundingClientRect().top + window.scrollY
      const span = Math.max(1, runway.offsetHeight - window.innerHeight)
      window.scrollTo({ top: top + span * p })
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
    const desktop = window.matchMedia('(min-width: 1024px)')
    const run = () => {
      // Mobile slot is a flex leftover inside a sticky svh frame; a measured
      // min-height of the tallest chapter would overflow the canvas+copy pack.
      if (!desktop.matches) {
        lastWidth = -1
        setCardHeight(0)
        return
      }
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
    desktop.addEventListener('change', run)
    return () => {
      ro.disconnect()
      desktop.removeEventListener('change', run)
    }
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

  /* ---- Stage: desktop pin, mobile sticky track ----------------------- */
  return (
    <section ref={sectionRef} id="pod-maska" className="uh-track relative">
      <div
        ref={runwayRef}
        className="uh-runway"
        style={{ '--uh-chapters': total, '--uh-chapter-vh': CHAPTER_VH.mobile } as CSSProperties}
      >
        <div ref={stageRef} className="uh-stage px-5 md:px-10">
          <div className="uh-frame mx-auto grid w-full max-w-7xl gap-6 lg:h-[min(88svh,780px)] lg:grid-cols-12 lg:gap-x-12">
            {/* Canvas first in the DOM so the desktop grid can place it in
                column 6. On a phone it sits above the copy *inside* the
                sticky frame — never as a sticky overlay that ate titles. */}
            <div ref={canvasHostRef} className="uh-canvas-host relative w-full min-w-0 lg:col-span-7 lg:col-start-6 lg:h-full">
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

              <div
                className="uh-progress"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={total}
                aria-valuenow={index + 1}
                aria-label={`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
              >
                <span className="uh-progress-fill" />
              </div>

              <p className="uh-hint">
                <span className="hidden lg:inline">{copy.hint}</span>
                <span className="lg:hidden">{copy.hintTouch}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="uh-after px-5 pt-16 pb-24 md:px-10 md:pb-32">{cta}</div>
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
