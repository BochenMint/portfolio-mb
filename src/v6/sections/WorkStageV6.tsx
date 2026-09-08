import { useCallback, useRef, useState, type CSSProperties } from 'react'
import type { Project } from '../../i18n/live'
import { showcaseShotsForProject } from '../../data/gallery'
import { projectLiveUrl, prefersReducedMotion } from '../utils'
import { useStageBeatScroll } from '../useWorkMotion'

type Interaction = 'wipe' | 'cartridge' | 'clip' | 'scan'

const INTERACTIONS: Record<string, Interaction> = {
  mint: 'wipe',
  plumm: 'cartridge',
  idrive: 'clip',
  agentic: 'scan',
}

type WorkStageV6Props = {
  project: Project
  index: number
  total: number
  variant?: 'desktop' | 'mobile'
}

export function WorkStageV6({ project, index, total, variant = 'desktop' }: WorkStageV6Props) {
  const shots = showcaseShotsForProject(project.id, 3)
  const [activeShot, setActiveShot] = useState(0)
  const [activeBeat, setActiveBeat] = useState(0)
  const [cartridgeIn, setCartridgeIn] = useState(false)
  const [clipPct, setClipPct] = useState(52)
  const [scanOn, setScanOn] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLElement>(null)

  const { url, live } = projectLiveUrl(project.id)
  const interaction = INTERACTIONS[project.id] ?? 'scan'
  const shot = shots[activeShot] ?? shots[0]
  const altShot = shots[1] ?? shots[0]

  const beats = [
    { key: 'pain', label: 'PROBLEM', text: project.pain },
    { key: 'shipped', label: 'WDROŻENIE', text: project.contribution },
    { key: 'outcome', label: 'EFEKT', text: project.outcome },
  ]

  const onBeatFromScroll = useCallback((idx: number) => {
    setActiveBeat(idx)
  }, [])

  useStageBeatScroll(stageRef, onBeatFromScroll, variant === 'desktop' && !prefersReducedMotion())

  const onClipMove = useCallback(
    (clientX: number) => {
      const el = viewportRef.current
      if (!el || interaction !== 'clip') return
      const rect = el.getBoundingClientRect()
      const pct = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width) * 100))
      setClipPct(pct)
    },
    [interaction],
  )

  const stageIndex = String(index + 1).padStart(2, '0')

  return (
    <article
      ref={stageRef}
      className="v6-work-stage"
      data-flagship={project.flagship ?? false}
      data-interaction={interaction}
      data-variant={variant}
      style={{ '--stage-i': index, '--stage-total': total } as CSSProperties}
      aria-labelledby={`v6-stage-title-${project.id}`}
    >
      <div className="v6-stage-shell">
        <header className="v6-stage-titlebar">
          <span className="v6-stage-cart-label">
            {project.flagship ? 'FLAGSHIP' : 'CARTRIDGE'} · {stageIndex}
          </span>
          <span className="v6-stage-cart-id">{project.id.toUpperCase()}.ROM</span>
          {live && url ? (
            <a
              href={url}
              className="v6-stage-live"
              target="_blank"
              rel="noopener noreferrer"
            >
              LIVE ↗
            </a>
          ) : (
            <span className="v6-stage-status">
              {project.id === 'idrive' ? 'PRE-LAUNCH' : 'INTERNAL'}
            </span>
          )}
        </header>

        <div
          ref={viewportRef}
          className="v6-stage-viewport"
          data-wipe={interaction === 'wipe' ? activeBeat >= 1 : undefined}
          data-cartridge={cartridgeIn || undefined}
          data-scan={scanOn || undefined}
          style={
            interaction === 'clip'
              ? ({ '--clip-pct': `${clipPct}%` } as CSSProperties)
              : undefined
          }
          onPointerMove={(e) => {
            if (interaction === 'clip' && e.pointerType !== 'touch') onClipMove(e.clientX)
          }}
          onPointerDown={(e) => {
            if (interaction === 'clip') onClipMove(e.clientX)
          }}
        >
          {shot ? (
            <img
              className="v6-stage-shot v6-stage-shot--primary"
              src={shot.src}
              srcSet={`${shot.srcSmall} 1200w, ${shot.src} 2400w`}
              sizes="(min-width: 1024px) 92vw, 100vw"
              width={shot.width}
              height={shot.height}
              alt={shot.alt}
              loading={index === 0 && activeShot === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          ) : null}

          {altShot && interaction !== 'clip' ? (
            <img
              className="v6-stage-shot v6-stage-shot--alt"
              src={altShot.src}
              srcSet={`${altShot.srcSmall} 1200w, ${altShot.src} 2400w`}
              sizes="(min-width: 1024px) 92vw, 100vw"
              width={altShot.width}
              height={altShot.height}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
            />
          ) : null}

          {interaction === 'clip' && altShot ? (
            <div className="v6-stage-clip-layer" aria-hidden>
              <img
                src={altShot.srcSmall}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div className="v6-stage-clip-pain">
                <p>{project.pain}</p>
              </div>
            </div>
          ) : null}

          <div className="v6-stage-scanlines" aria-hidden />

          <div className="v6-stage-hud">
            <div className="v6-stage-hud-head">
              <h3 id={`v6-stage-title-${project.id}`} className="v6-stage-title">
                {project.title}
              </h3>
              <p className="v6-stage-tagline">{project.tagline}</p>
            </div>

            <div className="v6-stage-beats" role="tablist" aria-label="Narracja projektu">
              {beats.map((beat, beatIndex) => (
                <button
                  key={beat.key}
                  type="button"
                  role="tab"
                  aria-selected={activeBeat === beatIndex}
                  className="v6-stage-beat"
                  data-active={activeBeat === beatIndex}
                  data-beat={beat.key}
                  onClick={() => setActiveBeat(beatIndex)}
                >
                  <span className="v6-stage-beat-label">{beat.label}</span>
                  <span className="v6-stage-beat-text">{beat.text}</span>
                </button>
              ))}
            </div>
          </div>

          {interaction === 'cartridge' ? (
            <button
              type="button"
              className="v6-stage-insert"
              aria-pressed={cartridgeIn}
              onClick={() => setCartridgeIn((v) => !v)}
            >
              {cartridgeIn ? '▮ EJECT' : '▶ INSERT'}
            </button>
          ) : null}

          {interaction === 'scan' ? (
            <button
              type="button"
              className="v6-stage-scan-btn"
              aria-pressed={scanOn}
              onClick={() => {
                setScanOn((v) => !v)
                if (shots.length > 1) setActiveShot((i) => (i + 1) % shots.length)
              }}
            >
              {scanOn ? '◧ SCAN B' : '◨ SCAN A'}
            </button>
          ) : null}

          {interaction === 'clip' ? (
            <p className="v6-stage-clip-hint">Przeciągnij · before → after</p>
          ) : null}
        </div>

        {shots.length > 1 ? (
          <div className="v6-stage-strip" role="tablist" aria-label="Kadry projektu">
            {shots.map((s, shotIndex) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={activeShot === shotIndex}
                className="v6-stage-strip-btn"
                data-active={activeShot === shotIndex}
                onClick={() => setActiveShot(shotIndex)}
              >
                <img src={s.srcSmall} alt="" loading="lazy" decoding="async" />
                <span>{String(shotIndex + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}
