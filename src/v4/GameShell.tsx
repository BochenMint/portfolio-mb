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
import { BLACK_HOLE_HORIZON_R, BLACK_HOLE_POS, PLANET_SLOTS, type PlanetId } from './engine/world-anchors'
import { type BlackHoleLayer } from './world/blackHole'
import { applyBlackHoleGravity, EVENT_HORIZON_R, gravityAccelAt } from './engine/gravity'
import { getLeaderboard, saveLeaderboardEntry } from './engine/leaderboard'
import { getPanelImages } from './engine/panelImages'
import { createCommPanel } from './ui/commPanel'
import { createProjectPanel } from './ui/projectPanel'
import { createDiscoveryToast } from './ui/discoveryToast'
import { createGameOverOverlay } from './ui/gameOverOverlay'
import { createCompletionOverlay } from './ui/completionOverlay'
import { projects } from '../i18n/live'

// Establishing shot: r≈730 so Rs ~31% of the desktop short axis at FOV 50.
// Nose mostly at the hole so a ship-local aft camera is 3/4 rear, not a
// tangent side-on pencil. Slight yaw keeps one gondola closer.
const START_POSITION = new THREE.Vector3(205, -36, 700)
const START_QUATERNION = (() => {
  const radial = START_POSITION.clone().normalize()
  const tangent = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), radial).normalize()
  const toHole = radial.clone().negate()
  const forward = tangent.clone().multiplyScalar(0.18).addScaledVector(toHole, 0.82)
  forward.normalize()
  // PerspectiveCamera.lookAt aims -Z (the ship's nose). Object3D.lookAt aims +Z
  // and previously parked the 3/4 "aft" camera in front of the hammerhead.
  const dummy = new THREE.PerspectiveCamera()
  dummy.up.set(0, 1, 0)
  dummy.lookAt(forward)
  return dummy.quaternion.clone()
})()

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
  getHullStats(): { tris: number; drawCalls: number; length: number; span: number; height: number } | null
  frameHull(kind: 'rear' | 'top' | 'threeQuarter' | 'side'): void
  releaseDebugCam(): void
  getRenderInfo(): { triangles: number; calls: number }
  /** Dev/preview-only — hide the hull so BH/planet probes aren't blocked by it. */
  setShipVisible(visible: boolean): void
  getChaseInfo(): { heightDot: number; backDot: number; dist: number; upDot: number }
  /** Dev/preview-only — screen-space AABBs for overlap QA. */
  getScreenAabbs(): {
    ship: { left: number; top: number; right: number; bottom: number }
    bh: { left: number; top: number; right: number; bottom: number }
    disk: { left: number; top: number; right: number; bottom: number }
    prompt: { left: number; top: number; right: number; bottom: number } | null
    viewport: { w: number; h: number }
  }
  getComposition(): Record<string, unknown>
  /** Dev/preview-only — move the hull without pinning the chase camera. */
  setShipPos(pos: [number, number, number]): void
  getCameraPhase(): 'launch' | 'blend' | 'chase' | 'debug-teleport'
  getProbe(): {
    phase: 'launch' | 'blend' | 'chase' | 'debug-teleport'
    hasThrusted: boolean
    camera: { pos: [number, number, number]; fwd: [number, number, number] }
    ship: [number, number, number]
    bh: [number, number, number]
    distShipBh: number
    distCamShip: number
    distCamBh: number
    camSpace: { shipFwd: number; bhFwd: number; closer: 'ship' | 'bh' | 'equal' }
    rayThroughShip: {
      tShip: number
      tHorizon: number | null
      sphereHitsBeforeShip: boolean
    }
    layers: ReturnType<World['getBlackHoleLayerState']>
    radii: ReturnType<World['getBlackHoleRadii']>
  }
  setBhLayer(layer: BlackHoleLayer, visible: boolean): void
  getBhLayers(): ReturnType<World['getBlackHoleLayerState']>
  showBounds(on: boolean): void
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
    let onPrelaunchPointer: ((e: PointerEvent) => void) | null = null
    let boundRoot: HTMLDivElement | null = null

    async function init() {
      const root = rootRef.current
      const canvas = canvasRef.current
      const hudContainer = hudContainerRef.current
      if (!root || !canvas || !hudContainer) return
      const rootEl = root
      boundRoot = rootEl

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

      const shipInstance = await buildShipV2(manager, engineInstance.envMap, engineInstance.renderer)
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
      controlsInstance.state.quaternion.copy(START_QUATERNION)
      controls = controlsInstance

      const cameraRig = createCameraRig(engineInstance.camera)
      const launchByTap =
        touchControlsInstance.active || window.matchMedia('(max-width: 480px), (hover: none)').matches
      const hudInstance = createHud(hudContainer, {
        touchActive: touchControlsInstance.active,
        launchByTap,
        onLaunch: () => {
          controlsInstance.state.hasThrusted = true
        },
      })
      hud = hudInstance

      function setPrelaunch(pre: boolean) {
        rootEl.classList.toggle('is-prelaunch', pre)
        touchControlsInstance.setArmed(!pre)
      }
      setPrelaunch(true)

      onPrelaunchPointer = (e: PointerEvent) => {
        if (!launchByTap) return
        if (!rootEl.classList.contains('is-prelaunch')) return
        const target = e.target
        if (!(target instanceof Element)) return
        if (target.closest('a, .v4-loading, .v4-overlay, input, textarea, button.v4-comm__collapse, button.v4-comm__icon')) {
          return
        }
        e.preventDefault()
        controlsInstance.state.hasThrusted = true
      }
      rootEl.addEventListener('pointerdown', onPrelaunchPointer)

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
        controlsInstance.state.quaternion.copy(START_QUATERNION)
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
        hudInstance.reset()
        cameraRig.holdLaunch(START_POSITION, START_QUATERNION)
        setPrelaunch(true)
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
        if (e.code !== 'KeyR') return
        const target = e.target
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
        resetRun()
      }
      window.addEventListener('keydown', onKeyDownRestart)

      onResize = () => {
        engineInstance.setSize(rootEl.clientWidth, rootEl.clientHeight)
        if (!controlsInstance.state.hasThrusted) {
          cameraRig.holdLaunch(START_POSITION, START_QUATERNION)
        }
      }
      window.addEventListener('resize', onResize)
      onResize()
      cameraRig.holdLaunch(START_POSITION, START_QUATERNION)

      // Dev/preview-only free-camera pin for visual verification, opt-in via
      // `?debug=1` — never advertised, harmless if left in a shipped build.
      let debugFreeCam = false
      const debugCamPos = new THREE.Vector3()
      const debugLookAt = new THREE.Vector3()
      let shipBoxHelper: THREE.BoxHelper | null = null
      if (new URLSearchParams(window.location.search).has('debug')) {
        shipBoxHelper = new THREE.BoxHelper(shipInstance.group, 0xffcc44)
        shipBoxHelper.name = 'ship-debug-bounds'
        shipBoxHelper.visible = false
        engineInstance.scene.add(shipBoxHelper)
        window.__v4 = {
          teleport(pos, lookAt) {
            debugFreeCam = true
            debugCamPos.set(pos[0], pos[1], pos[2])
            debugLookAt.set(lookAt[0], lookAt[1], lookAt[2])
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
          getHullStats() {
            const stats = shipInstance.group.userData.hullStats as
              | { tris: number; drawCalls: number; length: number; span: number; height: number }
              | undefined
            return stats ?? null
          },
          frameHull(kind) {
            debugFreeCam = true
            const shipPos = shipInstance.group.position
            const q = shipInstance.group.quaternion
            const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(q)
            const up = new THREE.Vector3(0, 1, 0).applyQuaternion(q)
            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(q)
            const look = shipPos.clone()
            if (kind === 'rear') {
              debugCamPos.copy(shipPos).addScaledVector(fwd, -38).addScaledVector(up, 7)
            } else if (kind === 'top') {
              debugCamPos.copy(shipPos).addScaledVector(up, 32).addScaledVector(fwd, 1)
            } else if (kind === 'side') {
              debugCamPos.copy(shipPos).addScaledVector(right, 36).addScaledVector(up, 4)
            } else {
              debugCamPos.copy(shipPos).addScaledVector(fwd, -26).addScaledVector(up, 11).addScaledVector(right, 16)
            }
            debugLookAt.copy(look)
          },
          releaseDebugCam() {
            debugFreeCam = false
          },
          getRenderInfo() {
            const r = engineInstance.renderer.info.render
            return { triangles: r.triangles, calls: r.calls }
          },
          setShipVisible(visible) {
            shipInstance.group.visible = visible
          },
          getChaseInfo() {
            const cam = engineInstance.camera
            const rel = cam.position.clone().sub(shipInstance.group.position)
            const shipUp = new THREE.Vector3(0, 1, 0).applyQuaternion(shipInstance.group.quaternion)
            const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(shipInstance.group.quaternion)
            return {
              heightDot: rel.dot(shipUp),
              backDot: -rel.dot(fwd),
              dist: rel.length(),
              upDot: shipUp.dot(new THREE.Vector3(0, 1, 0)),
            }
          },
          getScreenAabbs() {
            return window.__v4!.getComposition().aabbs as ReturnType<V4Debug['getScreenAabbs']>
          },
          getComposition() {
            const cam = engineInstance.camera
            cam.updateMatrixWorld()
            cam.updateProjectionMatrix()
            const canvas = engineInstance.renderer.domElement
            const w = canvas.clientWidth
            const h = canvas.clientHeight
            const short = Math.min(w, h)
            const marginNeed = 0.07 * short
            type Rect = { left: number; top: number; right: number; bottom: number }
            const emptyRect = (): Rect => ({ left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity })
            const include = (rect: Rect, sx: number, sy: number) => {
              rect.left = Math.min(rect.left, sx)
              rect.right = Math.max(rect.right, sx)
              rect.top = Math.min(rect.top, sy)
              rect.bottom = Math.max(rect.bottom, sy)
            }
            const projectPoint = (p: THREE.Vector3, rect: Rect) => {
              const c = p.clone().project(cam)
              if (!Number.isFinite(c.x + c.y)) return
              include(rect, (c.x * 0.5 + 0.5) * w, (-c.y * 0.5 + 0.5) * h)
            }
            const projectBox = (box: THREE.Box3): Rect => {
              const rect = emptyRect()
              const corners = [
                new THREE.Vector3(box.min.x, box.min.y, box.min.z),
                new THREE.Vector3(box.min.x, box.min.y, box.max.z),
                new THREE.Vector3(box.min.x, box.max.y, box.min.z),
                new THREE.Vector3(box.min.x, box.max.y, box.max.z),
                new THREE.Vector3(box.max.x, box.min.y, box.min.z),
                new THREE.Vector3(box.max.x, box.min.y, box.max.z),
                new THREE.Vector3(box.max.x, box.max.y, box.min.z),
                new THREE.Vector3(box.max.x, box.max.y, box.max.z),
              ]
              for (const c of corners) projectPoint(c, rect)
              return rect
            }
            const marginsOf = (rect: Rect) => ({
              left: rect.left,
              top: rect.top,
              right: w - rect.right,
              bottom: h - rect.bottom,
            })
            const overlap = (a: Rect, b: Rect) =>
              a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1
            const inflate = (rect: Rect, px: number): Rect => ({
              left: rect.left - px,
              top: rect.top - px,
              right: rect.right + px,
              bottom: rect.bottom + px,
            })

            const shipBox = new THREE.Box3().setFromObject(shipInstance.group)
            const ship = projectBox(shipBox)

            const radii = worldInstance.getBlackHoleRadii()
            const diskFrame = worldInstance.getBlackHoleDiskFrame()
            const distBh = cam.position.distanceTo(BLACK_HOLE_POS)
            const ndcBh = BLACK_HOLE_POS.clone().project(cam)
            const shadowCx = (ndcBh.x * 0.5 + 0.5) * w
            const shadowCy = (-ndcBh.y * 0.5 + 0.5) * h
            const fovRad = THREE.MathUtils.degToRad(cam.fov)
            const denom = Math.sqrt(Math.max(distBh * distBh - radii.apparentShadow * radii.apparentShadow, 1))
            const shadowR = (radii.apparentShadow / denom) / Math.tan(fovRad / 2) * (h * 0.5)
            const shadow: Rect = {
              left: shadowCx - shadowR,
              top: shadowCy - shadowR,
              right: shadowCx + shadowR,
              bottom: shadowCy + shadowR,
            }

            const disk = emptyRect()
            for (let i = 0; i < 48; i++) {
              const a = (i / 48) * Math.PI * 2
              const p = BLACK_HOLE_POS.clone()
                .addScaledVector(diskFrame.u, Math.cos(a) * diskFrame.outer)
                .addScaledVector(diskFrame.v, Math.sin(a) * diskFrame.outer)
              projectPoint(p, disk)
            }

            const canvasRect = canvas.getBoundingClientRect()
            const promptEl = hudContainer.querySelector<HTMLElement>('.v4-hud__start-prompt')
            let prompt: Rect | null = null
            if (promptEl && !promptEl.classList.contains('is-hidden')) {
              const pr = promptEl.getBoundingClientRect()
              prompt = {
                left: pr.left - canvasRect.left,
                top: pr.top - canvasRect.top,
                right: pr.right - canvasRect.left,
                bottom: pr.bottom - canvasRect.top,
              }
            }

            const shipMargins = marginsOf(ship)
            const shadowMargins = marginsOf(shadow)
            const diskMargins = marginsOf(disk)
            const shipWidthFrac = (ship.right - ship.left) / w
            const shipCy = (ship.top + ship.bottom) * 0.5 / h
            const shadowCyNorm = shadowCy / h
            const pad = 6
            const overlaps = {
              shipPrompt: prompt ? overlap(inflate(ship, pad), prompt) : false,
              promptShadow: prompt ? overlap(inflate(shadow, pad), prompt) : false,
              promptDisk: prompt ? overlap(inflate(disk, pad), prompt) : false,
            }
            const desktop = w >= 900
            const marginFloor = desktop ? marginNeed : 0.05 * short
            const pass = {
              shadowInFrame:
                shadowMargins.left >= marginFloor &&
                shadowMargins.right >= marginFloor &&
                shadowMargins.top >= marginFloor &&
                shadowMargins.bottom >= marginFloor,
              diskSignificantWidth: disk.right - disk.left > shadowR * 3.6 && diskMargins.left > 4 && diskMargins.right > 4,
              shipWidth: shipWidthFrac >= 0.3 && shipWidthFrac <= 0.45,
              shipLower: shipCy > 0.55,
              bhUpper: shadowCyNorm < 0.42,
              noPromptOverlap: !overlaps.shipPrompt && !overlaps.promptShadow && !overlaps.promptDisk,
            }

            return {
              viewport: { w, h, short, marginNeed, aspect: w / h },
              aabbs: { ship, bh: shadow, disk, prompt, viewport: { w, h } },
              shadow: { cx: shadowCx, cy: shadowCy, r: shadowR, rect: shadow, margins: shadowMargins, fracShort: (shadowR * 2) / short },
              disk: { rect: disk, margins: diskMargins, widthFrac: (disk.right - disk.left) / w },
              ship: { rect: ship, margins: shipMargins, widthFrac: shipWidthFrac, cy: shipCy },
              prompt,
              overlaps,
              pass,
            }
          },
          setShipPos(pos) {
            controlsInstance.state.position.set(pos[0], pos[1], pos[2])
            controlsInstance.state.velocity.set(0, 0, 0)
            controlsInstance.state.angularVelocity.set(0, 0, 0)
          },
          getCameraPhase() {
            return debugFreeCam ? 'debug-teleport' : cameraRig.getPhase()
          },
          getProbe() {
            const cam = engineInstance.camera
            const shipPos = controlsInstance.state.position
            const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion)
            const toShip = shipPos.clone().sub(cam.position)
            const toBh = BLACK_HOLE_POS.clone().sub(cam.position)
            const distCamShip = toShip.length()
            const distCamBh = toBh.length()
            const shipFwd = toShip.dot(fwd)
            const bhFwd = toBh.dot(fwd)
            const closer = Math.abs(shipFwd - bhFwd) < 0.5 ? 'equal' : shipFwd < bhFwd ? 'ship' : 'bh'
            const rd = toShip.clone().normalize()
            const oc = cam.position.clone().sub(BLACK_HOLE_POS)
            const b = oc.dot(rd)
            const c = oc.lengthSq() - BLACK_HOLE_HORIZON_R * BLACK_HOLE_HORIZON_R
            const disc = b * b - c
            let tHorizon: number | null = null
            if (disc >= 0) {
              const tNear = -b - Math.sqrt(disc)
              const tFar = -b + Math.sqrt(disc)
              tHorizon = tNear > 0.02 ? tNear : tFar > 0.02 ? tFar : null
            }
            return {
              phase: debugFreeCam ? 'debug-teleport' : cameraRig.getPhase(),
              hasThrusted: controlsInstance.state.hasThrusted,
              camera: {
                pos: [cam.position.x, cam.position.y, cam.position.z],
                fwd: [fwd.x, fwd.y, fwd.z],
              },
              ship: [shipPos.x, shipPos.y, shipPos.z],
              bh: [BLACK_HOLE_POS.x, BLACK_HOLE_POS.y, BLACK_HOLE_POS.z],
              distShipBh: shipPos.distanceTo(BLACK_HOLE_POS),
              distCamShip,
              distCamBh,
              camSpace: { shipFwd, bhFwd, closer },
              rayThroughShip: {
                tShip: distCamShip,
                tHorizon,
                sphereHitsBeforeShip: tHorizon !== null && tHorizon < distCamShip - 0.05,
              },
              layers: worldInstance.getBlackHoleLayerState(),
              radii: worldInstance.getBlackHoleRadii(),
            }
          },
          setBhLayer(layer, visible) {
            worldInstance.setBlackHoleLayerVisible(layer, visible)
          },
          getBhLayers() {
            return worldInstance.getBlackHoleLayerState()
          },
          showBounds(on) {
            worldInstance.setBlackHoleDebugBounds(on)
            if (shipBoxHelper) {
              shipBoxHelper.visible = on
              if (on) shipBoxHelper.update()
            }
          },
        }
      }

      const collisionNormal = new THREE.Vector3()
      const visualBankQ = new THREE.Quaternion()
      const visualBankAxis = new THREE.Vector3(0, 0, 1)

      unsubscribeTick = engineInstance.onTick((dt, elapsed) => {
        // Ukończenie misji NIE zatrzymuje lotu — completion to karta w rogu,
        // eksploracja (i panel czwartej planety) działają dalej.
        const flightActive = !gameOverTriggered

        if (flightActive) {
          const launched = controlsInstance.state.hasThrusted
          if (launched) {
            applyBlackHoleGravity(controlsInstance.state.position, controlsInstance.state.velocity, dt)
          }
          controlsInstance.update(dt)
          if (!controlsInstance.state.hasThrusted && !debugFreeCam) {
            // Establishing shot stays put until the first thrust — otherwise
            // the well pulls the ship into the horizon while the player is
            // still reading the start prompt.
            controlsInstance.state.position.copy(START_POSITION)
            controlsInstance.state.velocity.set(0, 0, 0)
            controlsInstance.state.angularVelocity.set(0, 0, 0)
            controlsInstance.state.quaternion.copy(START_QUATERNION)
            controlsInstance.state.bankAngle = 0
          }
          shipInstance.group.position.copy(controlsInstance.state.position)
          if (shipBoxHelper?.visible) shipBoxHelper.update()
          // Physics quat is roll-free; cosmetic bank is mesh-only so the
          // chase cam cannot inherit a leftover twist.
          visualBankQ.setFromAxisAngle(visualBankAxis, controlsInstance.state.bankAngle)
          shipInstance.group.quaternion.copy(controlsInstance.state.quaternion).multiply(visualBankQ)
          shipInstance.updateThrust(controlsInstance.state.thrustLevel, elapsed)

          // First thrust of a run — starts the mission clock and dismisses
          // the crew comm intro.
          if (controlsInstance.state.hasThrusted && !prevHasThrusted) {
            prevHasThrusted = true
            setPrelaunch(false)
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
          worldInstance.forEachMoonCollider((moonPos, moonRadius) => {
            collisionNormal.copy(controlsInstance.state.position).sub(moonPos)
            const surfaceDist = moonRadius * 1.2 + 1.4
            const d = collisionNormal.length()
            if (d < surfaceDist && d > 1e-4) {
              collisionNormal.multiplyScalar(1 / d)
              controlsInstance.state.position.copy(moonPos).addScaledVector(collisionNormal, surfaceDist)
              const inward = controlsInstance.state.velocity.dot(collisionNormal)
              if (inward < 0) {
                controlsInstance.state.velocity.addScaledVector(collisionNormal, -inward)
              }
            }
          })
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
            {
              hasThrusted: controlsInstance.state.hasThrusted,
              reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            },
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

      if (loadingOverlayRef.current) {
        loadingOverlayRef.current.classList.add('is-hidden')
        loadingOverlayRef.current.setAttribute('aria-busy', 'false')
        loadingOverlayRef.current.setAttribute('aria-hidden', 'true')
      }
    }

    init().catch((err) => {
      console.error('[v4] init failed', err)
      const overlay = loadingOverlayRef.current
      if (overlay) {
        overlay.classList.add('is-error')
        overlay.setAttribute('aria-busy', 'false')
      }
      if (loadingLabelRef.current) {
        loadingLabelRef.current.textContent = 'Nie udało się wczytać misji. Odśwież stronę.'
      }
    })

    return () => {
      cancelled = true
      if (onResize) window.removeEventListener('resize', onResize)
      if (onKeyDownRestart) window.removeEventListener('keydown', onKeyDownRestart)
      if (onPrelaunchPointer && boundRoot) boundRoot.removeEventListener('pointerdown', onPrelaunchPointer)
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
    <div className="v4-root is-prelaunch" ref={rootRef}>
      <canvas className="v4-canvas" ref={canvasRef} />
      <div className="v4-hud-container" ref={hudContainerRef} />
      <div
        className="v4-loading"
        ref={loadingOverlayRef}
        aria-live="polite"
        aria-busy="true"
        role="status"
      >
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
