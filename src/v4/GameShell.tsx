import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createEngine, type Engine } from './engine/core'
import { type Ship } from './ship/buildShip'
import { buildShipV2 } from './ship/buildShipV2'
import { createControls } from './ship/controls'
import { createTouchControls } from './ship/touchControls'
import { createCameraRig } from './ship/camera-rig'
import { createHud } from './ui/hud'
import { createWorld, type World } from './world'
import { BLACK_HOLE_POS, PLANET_SLOTS, type PlanetId } from './engine/world-anchors'
import { applyBlackHoleGravity, EVENT_HORIZON_R, gravityAccelAt } from './engine/gravity'
import { getLeaderboard, saveLeaderboardEntry } from './engine/leaderboard'
import { getPanelImages } from './engine/panelImages'
import { createCommPanel } from './ui/commPanel'
import { createProjectPanel } from './ui/projectPanel'
import { createDiscoveryToast } from './ui/discoveryToast'
import { createGameOverOverlay } from './ui/gameOverOverlay'
import { createCompletionOverlay } from './ui/completionOverlay'
import { projects } from '../i18n/live'

// Establishing shot: outside the black hole's disk (outer radius ~208u) and
// impostor (half-size 305u), offset sideways so the ship doesn't occlude the
// hole, and close to the (18°-tilted) disk plane so the accretion disk reads
// near-edge-on — thin front band + over-pole halo arcs, the Gargantua frame.
const START_POSITION = new THREE.Vector3(72, -32, 248)

/** The low-end heuristic used elsewhere in the codebase is "coarse pointer",
 * which doesn't apply here (v4 already requires a fine pointer + WebGL2 to
 * run at all) — so this checks hardware concurrency/memory instead. */
function detectLowPowerTier(): boolean {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency ?? 8
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory
  return cores <= 4 || (mem !== undefined && mem <= 4)
}

type V4Debug = {
  /** Dev/preview-only camera pin for visual verification screenshots — opt-in
   * via `?debug=1` so it never shows up as a real feature of the game. */
  teleport(pos: [number, number, number], lookAt: [number, number, number]): void
  /** Dev/preview-only — force a meteor/comet to spawn on the next tick, so a
   * verification screenshot doesn't have to wait out the real spawn timer. */
  spawnMeteor(kind?: 'meteor' | 'comet'): void
  /** Dev/preview-only — current ship position + velocity zeroing, so visual
   * verification can frame a camera on the ship even if stray desktop
   * keyboard input nudged it between steps. */
  getShipPos(): [number, number, number]
  haltShip(): void
  /** Dev/preview-only — procedural vs CC0 GLB hull source. */
  getHullSource(): string
}

declare global {
  interface Window {
    __v4?: V4Debug
  }
}

export function GameShell() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hudContainerRef = useRef<HTMLDivElement>(null)
  const loadingOverlayRef = useRef<HTMLDivElement>(null)
  const loadingLabelRef = useRef<HTMLDivElement>(null)
  const loadingBarFillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let engine: Engine | null = null
    let ship: Ship | null = null
    let world: World | null = null
    let controls: ReturnType<typeof createControls> | null = null
    let touchControls: ReturnType<typeof createTouchControls> | null = null
    let hud: ReturnType<typeof createHud> | null = null
    let commPanel: ReturnType<typeof createCommPanel> | null = null
    let projectPanel: ReturnType<typeof createProjectPanel> | null = null
    let discoveryToast: ReturnType<typeof createDiscoveryToast> | null = null
    let gameOverOverlay: ReturnType<typeof createGameOverOverlay> | null = null
    let completionOverlay: ReturnType<typeof createCompletionOverlay> | null = null
    let unsubscribeTick: (() => void) | null = null
    let onResize: (() => void) | null = null
    let onKeyDownRestart: ((e: KeyboardEvent) => void) | null = null

    async function init() {
      const root = rootRef.current
      const canvas = canvasRef.current
      const hudContainer = hudContainerRef.current
      if (!root || !canvas || !hudContainer) return

      // Keyboard flight controls listen on `window`, but focusing the canvas
      // helps first-time visitors discover input and keeps Space from scrolling.
      canvas.tabIndex = 0
      canvas.setAttribute('aria-label', 'Pole lotu — sterowanie statkiem')
      canvas.focus({ preventScroll: true })

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const lowPower = detectLowPowerTier()

      const manager = new THREE.LoadingManager()
      manager.onProgress = (_url, loaded, total) => {
        const pct = total > 0 ? Math.round((loaded / total) * 100) : 0
        if (loadingBarFillRef.current) loadingBarFillRef.current.style.width = `${pct}%`
        if (loadingLabelRef.current) loadingLabelRef.current.textContent = `WCZYTYWANIE MISJI… ${pct}%`
      }
      manager.onError = (url) => {
        // Optional Normandy GLB is probed via HEAD before load — anything else
        // that fails here is worth surfacing in devtools.
        if (url.includes('normandy-sr2-joshuas-cc0.glb')) return
        console.error('[v4] failed to load asset:', url)
      }

      const engineInstance = await createEngine(canvas, { lowPower, reducedMotion, manager })
      if (cancelled) {
        engineInstance.dispose()
        return
      }
      engine = engineInstance

      const shipInstance = await buildShipV2(manager, engineInstance.envMap)
      if (cancelled) {
        shipInstance.dispose()
        engineInstance.dispose()
        return
      }
      ship = shipInstance
      engineInstance.scene.add(shipInstance.group)

      const worldInstance = await createWorld(engineInstance.scene, {
        manager,
        skyTex: engineInstance.skyTex,
        envMap: engineInstance.envMap,
        lowPower,
        renderer: engineInstance.renderer,
      })
      if (cancelled) {
        worldInstance.dispose()
        shipInstance.dispose()
        engineInstance.dispose()
        return
      }
      world = worldInstance

      const touchControlsInstance = createTouchControls(root)
      touchControls = touchControlsInstance

      const controlsInstance = createControls(START_POSITION, touchControlsInstance.input)
      controls = controlsInstance

      const cameraRig = createCameraRig(engineInstance.camera)
      const hudInstance = createHud(hudContainer, { touchActive: touchControlsInstance.active })
      hud = hudInstance

      const commPanelInstance = createCommPanel(hudContainer, {
        reducedMotion,
        startCollapsed: touchControlsInstance.active,
      })
      commPanel = commPanelInstance
      const projectPanelInstance = createProjectPanel(hudContainer)
      projectPanel = projectPanelInstance
      const discoveryToastInstance = createDiscoveryToast(hudContainer)
      discoveryToast = discoveryToastInstance

      // ─── Run/mission state — reset in full by resetRun() below ───────────
      let missionStartElapsed: number | null = null
      let missionElapsedMs = 0
      let missionRunning = false
      let missionCompleted = false
      let gameOverTriggered = false
      const discovered = new Set<PlanetId>()
      let activePlanetId: PlanetId | null = null
      let prevHasThrusted = false

      function resetRun() {
        controlsInstance.state.position.copy(START_POSITION)
        controlsInstance.state.velocity.set(0, 0, 0)
        controlsInstance.state.angularVelocity.set(0, 0, 0)
        controlsInstance.state.bankAngle = 0
        controlsInstance.state.quaternion.identity()
        controlsInstance.state.thrustLevel = 0
        controlsInstance.state.brakeLevel = 0
        controlsInstance.state.speed = 0
        controlsInstance.state.hasThrusted = false
        prevHasThrusted = false

        missionStartElapsed = null
        missionElapsedMs = 0
        missionRunning = false
        missionCompleted = false
        gameOverTriggered = false
        discovered.clear()
        activePlanetId = null

        projectPanel?.hide()
        gameOverOverlay?.reset()
        completionOverlay?.reset()
        commPanel?.restart()
      }

      const gameOverOverlayInstance = createGameOverOverlay(hudContainer, {
        reducedMotion,
        onRestart: () => resetRun(),
      })
      gameOverOverlay = gameOverOverlayInstance
      const completionOverlayInstance = createCompletionOverlay(hudContainer, {
        onRestart: () => resetRun(),
        onSave: (nick) => {
          const top = saveLeaderboardEntry(nick, missionElapsedMs)
          completionOverlayInstance.updateBoard(top)
        },
      })
      completionOverlay = completionOverlayInstance

      onKeyDownRestart = (e: KeyboardEvent) => {
        if (e.code === 'KeyR' && (gameOverTriggered || missionCompleted)) {
          resetRun()
        }
      }
      window.addEventListener('keydown', onKeyDownRestart)

      onResize = () => {
        engineInstance.setSize(root.clientWidth, root.clientHeight)
      }
      window.addEventListener('resize', onResize)
      onResize()

      // Dev/preview-only free-camera pin for visual verification, opt-in via
      // `?debug=1` — never advertised, harmless if left in a shipped build.
      let debugFreeCam = false
      const debugCamPos = new THREE.Vector3()
      const debugLookAt = new THREE.Vector3()
      if (new URLSearchParams(window.location.search).has('debug')) {
        window.__v4 = {
          teleport(pos, lookAt) {
            debugFreeCam = true
            debugCamPos.set(pos[0], pos[1], pos[2])
            debugLookAt.set(lookAt[0], lookAt[1], lookAt[2])
            // Also relocates the actual ship (not just the pinned debug
            // camera) — needed so gravity/event-horizon/proximity checks,
            // which all key off controlsInstance.state.position, can be
            // exercised deterministically from a verification script.
            controlsInstance.state.position.set(pos[0], pos[1], pos[2])
            controlsInstance.state.velocity.set(0, 0, 0)
            controlsInstance.state.angularVelocity.set(0, 0, 0)
          },
          spawnMeteor(kind) {
            worldInstance.debugForceMeteor(kind)
          },
          getShipPos() {
            const p = controlsInstance.state.position
            return [p.x, p.y, p.z]
          },
          haltShip() {
            controlsInstance.state.velocity.set(0, 0, 0)
            controlsInstance.state.angularVelocity.set(0, 0, 0)
          },
          getHullSource() {
            return (shipInstance.group.userData.hullSource as string | undefined) ?? 'unknown'
          },
        }
      }

      const collisionNormal = new THREE.Vector3()

      unsubscribeTick = engineInstance.onTick((dt, elapsed) => {
        // Ukończenie misji NIE zatrzymuje lotu — completion to karta w rogu,
        // eksploracja (i panel czwartej planety) działają dalej.
        const flightActive = !gameOverTriggered

        if (flightActive) {
          // Gravity first, then the controls' own thrust/damping/position
          // integration — same semi-implicit-Euler convention controls.ts
          // already uses internally, so this frame's position update sees
          // the combined velocity.
          applyBlackHoleGravity(controlsInstance.state.position, controlsInstance.state.velocity, dt)
          controlsInstance.update(dt)
          shipInstance.group.position.copy(controlsInstance.state.position)
          shipInstance.group.quaternion.copy(controlsInstance.state.quaternion)
          shipInstance.updateThrust(controlsInstance.state.thrustLevel, elapsed)

          // First thrust of a run — starts the mission clock and dismisses
          // the crew comm intro.
          if (controlsInstance.state.hasThrusted && !prevHasThrusted) {
            prevHasThrusted = true
            if (!missionRunning) {
              missionRunning = true
              missionStartElapsed = elapsed
            }
            commPanel?.dismiss()
          }
          if (missionRunning && missionStartElapsed !== null) {
            missionElapsedMs = (elapsed - missionStartElapsed) * 1000
          }

          // ─── Event horizon — game over ────────────────────────────────
          const distToHole = controlsInstance.state.position.distanceTo(BLACK_HOLE_POS)
          if (distToHole < EVENT_HORIZON_R) {
            gameOverTriggered = true
            controlsInstance.state.velocity.set(0, 0, 0)
            controlsInstance.state.angularVelocity.set(0, 0, 0)
            gameOverOverlay?.trigger()
          }

          // ─── Planet proximity — discovery toast + project panel ──────
          for (const slot of PLANET_SLOTS) {
            const dist = controlsInstance.state.position.distanceTo(slot.position)
            const enterR = slot.radius * 2.5
            const exitR = slot.radius * 3.5

            if (dist < enterR && activePlanetId !== slot.id) {
              activePlanetId = slot.id
              const project = projects.find((p) => p.id === slot.id)
              if (project) {
                if (!discovered.has(slot.id)) {
                  discovered.add(slot.id)
                  discoveryToast?.show(project.title)
                  if (discovered.size === PLANET_SLOTS.length && !missionCompleted) {
                    missionCompleted = true
                    missionRunning = false
                    completionOverlay?.show(missionElapsedMs, getLeaderboard())
                  }
                }
                // Panel projektu pokazuje się też po ukończeniu misji —
                // karta completion w rogu mu nie przeszkadza.
                projectPanel?.show(project, getPanelImages(slot.id))
              }
            } else if (activePlanetId === slot.id && dist > exitR) {
              activePlanetId = null
              projectPanel?.hide()
            }
          }

          // ─── Miękkie kolizje z planetami — statek nie przelatuje przez
          // planetę; zsuwa się po sferze („zostaje na orbicie"), bez
          // zderzeń, odbić i game-over.
          for (const slot of PLANET_SLOTS) {
            collisionNormal.copy(controlsInstance.state.position).sub(slot.position)
            const surfaceDist = slot.radius * 1.12 + 2
            const d = collisionNormal.length()
            if (d < surfaceDist && d > 1e-4) {
              collisionNormal.multiplyScalar(1 / d)
              controlsInstance.state.position
                .copy(slot.position)
                .addScaledVector(collisionNormal, surfaceDist)
              const inward = controlsInstance.state.velocity.dot(collisionNormal)
              if (inward < 0) {
                controlsInstance.state.velocity.addScaledVector(collisionNormal, -inward)
              }
            }
          }
        }

        if (debugFreeCam) {
          engineInstance.camera.position.copy(debugCamPos)
          engineInstance.camera.lookAt(debugLookAt)
        } else if (flightActive) {
          cameraRig.update(
            dt,
            controlsInstance.state.position,
            controlsInstance.state.quaternion,
            controlsInstance.state.thrustLevel,
            controlsInstance.state.bankAngle,
            controlsInstance.state.angularVelocity,
          )
        }

        engineInstance.dust.update(engineInstance.camera.position, controlsInstance.state.velocity)
        worldInstance.update(dt, elapsed, engineInstance.camera)
        hudInstance.update({
          speed: controlsInstance.state.speed,
          thrust: controlsInstance.state.thrustLevel,
          hasThrusted: controlsInstance.state.hasThrusted,
          missionMs: missionElapsedMs,
          discovered,
          gravityAccel: flightActive ? gravityAccelAt(controlsInstance.state.position) : 0,
        })
      })

      engineInstance.start()

      if (loadingOverlayRef.current) loadingOverlayRef.current.classList.add('is-hidden')
    }

    init().catch((err) => {
      console.error('[v4] init failed', err)
    })

    return () => {
      cancelled = true
      if (onResize) window.removeEventListener('resize', onResize)
      if (onKeyDownRestart) window.removeEventListener('keydown', onKeyDownRestart)
      unsubscribeTick?.()
      delete window.__v4
      completionOverlay?.dispose()
      gameOverOverlay?.dispose()
      discoveryToast?.dispose()
      projectPanel?.dispose()
      commPanel?.dispose()
      hud?.dispose()
      controls?.dispose()
      touchControls?.dispose()
      world?.dispose()
      ship?.dispose()
      engine?.stop()
      engine?.dispose()
    }
  }, [])

  return (
    <div className="v4-root" ref={rootRef}>
      <canvas className="v4-canvas" ref={canvasRef} />
      <div className="v4-hud-container" ref={hudContainerRef} />
      <div className="v4-loading" ref={loadingOverlayRef}>
        <div className="v4-loading__label" ref={loadingLabelRef}>
          WCZYTYWANIE MISJI… 0%
        </div>
        <div className="v4-loading__bar">
          <div className="v4-loading__bar-fill" ref={loadingBarFillRef} />
        </div>
      </div>
    </div>
  )
}
