import { useCallback, useEffect, useRef, useState } from 'react'
import type { Face } from '../../data/faces'
import type { Locale } from '../i18n/types'
import './cube.css'

type Props = {
  projectId: string
  title: string
  faces: Face[]
  locale: Locale
  /** Load the front face eagerly (flagship, above-the-fold). */
  eagerFront?: boolean
}

const FACE_ORDER = ['front', 'right', 'back', 'left'] as const

const AUTO_ROTATE_MS = 4500
const DRAG_SENSITIVITY = 0.32
const FRICTION = 0.94
const MIN_VELOCITY = 0.02

function normalize180(deg: number) {
  let d = deg % 360
  if (d > 180) d -= 360
  if (d < -180) d += 360
  return d
}

function indexFromRot(rot: number) {
  const i = Math.round(-rot / 90) % 4
  return ((i % 4) + 4) % 4
}

function nearestRotForIndex(currentRot: number, index: number) {
  // Choose the target rotation congruent to -index*90 (mod 360) closest to currentRot.
  const target = -index * 90
  const currentMod = ((currentRot % 360) + 360) % 360
  const targetMod = ((target % 360) + 360) % 360
  let delta = targetMod - currentMod
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return currentRot + delta
}

function nearestSnap(rot: number) {
  return Math.round(rot / 90) * 90
}

function readTheme(): 'light' | 'dark' {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function ProjectCube({ projectId, title, faces, locale, eagerFront }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const cubeRef = useRef<HTMLDivElement>(null)
  const faceRefs = useRef<Array<HTMLDivElement | null>>([])

  const rotRef = useRef(0)
  const velocityRef = useRef(0)
  const draggingRef = useRef(false)
  const pointerLastXRef = useRef(0)
  const pointerLastTRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const hoveredRef = useRef(false)
  const focusedRef = useRef(false)
  const inViewRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const autoTimerRef = useRef<number | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => readTheme())

  const four = faces.length >= 4 ? faces.slice(0, 4) : [...faces, ...faces, ...faces, ...faces].slice(0, 4)

  const applyShading = useCallback((rot: number) => {
    faceRefs.current.forEach((el, i) => {
      if (!el) return
      const angle = normalize180(i * 90 + rot)
      const rad = (angle * Math.PI) / 180
      const shade = Math.min(0.85, Math.max(0.04, 0.05 + 0.6 * (1 - Math.cos(rad))))
      el.style.setProperty('--face-shade', shade.toFixed(3))
    })
  }, [])

  const setRot = useCallback(
    (rot: number) => {
      rotRef.current = rot
      const cube = cubeRef.current
      if (cube) cube.style.setProperty('--cube-rot', `${rot}deg`)
      applyShading(rot)
      const idx = indexFromRot(rot)
      setActiveIndex((prev) => (prev === idx ? prev : idx))
    },
    [applyShading],
  )

  const stopMomentum = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const snapTo = useCallback(
    (rot: number, animate: boolean) => {
      const cube = cubeRef.current
      if (!cube) return
      if (animate && !reducedMotionRef.current) {
        cube.classList.add('is-tweening')
        const onEnd = () => {
          cube.classList.remove('is-tweening')
          cube.removeEventListener('transitionend', onEnd)
        }
        cube.addEventListener('transitionend', onEnd)
      } else {
        cube.classList.remove('is-tweening')
      }
      setRot(rot)
    },
    [setRot],
  )

  const goToIndex = useCallback(
    (index: number) => {
      stopMomentum()
      const target = nearestRotForIndex(rotRef.current, ((index % 4) + 4) % 4)
      snapTo(target, true)
    },
    [snapTo, stopMomentum],
  )

  const step = useCallback(
    (dir: 1 | -1) => {
      stopMomentum()
      const target = rotRef.current - dir * 90
      snapTo(target, true)
    },
    [snapTo, stopMomentum],
  )

  // --- Pointer drag with inertia -----------------------------------
  const runMomentum = useCallback(() => {
    const tick = () => {
      velocityRef.current *= FRICTION
      if (Math.abs(velocityRef.current) < MIN_VELOCITY) {
        rafRef.current = null
        snapTo(nearestSnap(rotRef.current), true)
        return
      }
      setRot(rotRef.current + velocityRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [setRot, snapTo])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const cube = cubeRef.current
    if (!cube) return
    stopMomentum()
    cube.classList.remove('is-tweening')
    cube.classList.add('is-animating')
    draggingRef.current = true
    pointerLastXRef.current = e.clientX
    pointerLastTRef.current = performance.now()
    velocityRef.current = 0
    cube.setPointerCapture(e.pointerId)
  }, [stopMomentum])

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return
      const now = performance.now()
      const dx = e.clientX - pointerLastXRef.current
      const dt = Math.max(1, now - pointerLastTRef.current)
      const delta = dx * DRAG_SENSITIVITY
      velocityRef.current = (delta / dt) * 16
      pointerLastXRef.current = e.clientX
      pointerLastTRef.current = now
      setRot(rotRef.current + delta)
    },
    [setRot],
  )

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return
      draggingRef.current = false
      const cube = cubeRef.current
      if (cube) {
        cube.classList.remove('is-animating')
        try {
          cube.releasePointerCapture(e.pointerId)
        } catch {
          // capture may already be released
        }
      }
      if (reducedMotionRef.current || Math.abs(velocityRef.current) < MIN_VELOCITY) {
        snapTo(nearestSnap(rotRef.current), true)
      } else {
        runMomentum()
      }
    },
    [runMomentum, snapTo],
  )

  // --- Hover tilt (fine pointer only) --------------------------------
  const onStagePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) return
    const stage = stageRef.current
    const cube = cubeRef.current
    if (!stage || !cube) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const r = stage.getBoundingClientRect()
    const py = (e.clientY - r.top) / r.height
    const tilt = -10 + (0.5 - py) * 12
    cube.style.setProperty('--cube-tilt', `${tilt.toFixed(2)}deg`)
  }, [])

  const resetTilt = useCallback(() => {
    const cube = cubeRef.current
    if (cube) cube.style.setProperty('--cube-tilt', '-10deg')
  }, [])

  // --- Keyboard --------------------------------------------------------
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        step(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        step(-1)
      }
    },
    [step],
  )

  // --- Init: reduced motion, theme observer, viewport observer --------
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    applyShading(0)

    const mo = new MutationObserver(() => setTheme(readTheme()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const stage = stageRef.current
    let io: IntersectionObserver | null = null
    if (stage) {
      io = new IntersectionObserver(
        ([entry]) => {
          inViewRef.current = entry.isIntersecting
        },
        { threshold: 0.35 },
      )
      io.observe(stage)
    }

    return () => {
      mo.disconnect()
      io?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- Auto-rotate --------------------------------------------------
  useEffect(() => {
    const tick = () => {
      autoTimerRef.current = window.setTimeout(() => {
        if (
          inViewRef.current &&
          !hoveredRef.current &&
          !focusedRef.current &&
          !draggingRef.current &&
          !reducedMotionRef.current &&
          rafRef.current === null
        ) {
          step(1)
        }
        tick()
      }, AUTO_ROTATE_MS)
    }
    tick()
    return () => {
      if (autoTimerRef.current !== null) window.clearTimeout(autoTimerRef.current)
    }
  }, [step])

  const onMouseEnter = () => {
    hoveredRef.current = true
  }
  const onMouseLeave = () => {
    hoveredRef.current = false
    resetTilt()
  }
  const onFocus = () => {
    focusedRef.current = true
  }
  const onBlur = () => {
    focusedRef.current = false
  }

  const activeFace = four[activeIndex]

  return (
    <div className="flex flex-col items-center">
      <div
        ref={stageRef}
        className="cube-stage"
        onPointerMove={onStagePointerMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          ref={cubeRef}
          data-chrome
          className="cube"
          role="group"
          aria-roledescription="3D cube"
          aria-label={title}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <div className="cube-core" aria-hidden>
            <div className="cube-core__face cube-core__face--front" />
            <div className="cube-core__face cube-core__face--right" />
            <div className="cube-core__face cube-core__face--back" />
            <div className="cube-core__face cube-core__face--left" />
            <div className="cube-core__face cube-core__face--top" />
            <div className="cube-core__face cube-core__face--bottom" />
          </div>

          <div className="cube-face--brushed cube-face--top" aria-hidden />
          <div className="cube-face--brushed cube-face--bottom" aria-hidden />

          {FACE_ORDER.map((slot, i) => {
            const face = four[i]
            const isFront = slot === 'front'
            const src = theme === 'light' && face.light ? face.light : face.file
            const base = `/projects/${projectId}/${src}`
            const ext = base.slice(base.lastIndexOf('.'))
            const smBase = base.slice(0, -ext.length)
            const eager = Boolean(eagerFront) && isFront
            return (
              <div
                key={face.id}
                ref={(el) => {
                  faceRefs.current[i] = el
                }}
                className={`cube-face cube-face--${slot}`}
              >
                <div className="cube-face__inner">
                  <img
                    src={base}
                    srcSet={`${smBase}-sm${ext} 800w, ${base} 1600w`}
                    sizes="(min-width: 1024px) 520px, 80vw"
                    alt={face.label[locale]}
                    loading={eager ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="cube-dots" role="tablist" aria-label={title}>
        {four.map((face, i) => (
          <button
            key={face.id}
            type="button"
            className="cube-dot"
            aria-label={face.label[locale]}
            aria-current={activeIndex === i}
            onClick={() => goToIndex(i)}
          />
        ))}
      </div>

      <div className="cube-caption" key={activeIndex}>
        <p className="cube-caption__label">{activeFace.label[locale]}</p>
        <p className="cube-caption__text">{activeFace.caption[locale]}</p>
      </div>
    </div>
  )
}
