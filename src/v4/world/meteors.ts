import * as THREE from 'three'
import { mulberry32 } from './shaderChunks'

/**
 * "The cosmos should feel alive" — a cheap pool of camera-facing streak
 * sprites standing in for shooting stars, plus a rare slow comet. Each
 * instance is a single additively-blended THREE.Sprite: sprites are
 * inherently camera-facing, and `SpriteMaterial.rotation` lets the elongated
 * head+tail texture be spun in screen space to line up with the streak's
 * projected direction of travel — no per-frame 3D billboard math needed.
 */

const SEED = 7331
const MAX_METEORS = 3
const METEOR_SPAWN_MIN = 4
const METEOR_SPAWN_MAX = 10
const COMET_SPAWN_MIN = 60
const COMET_SPAWN_MAX = 90

const METEOR_RADIUS_MIN = 240
const METEOR_RADIUS_MAX = 420
const METEOR_ARC_MIN = 0.55 // radians of great-circle travel over the streak's life
const METEOR_ARC_MAX = 1.5
const METEOR_LIFE_MIN = 0.7
const METEOR_LIFE_MAX = 1.5
const METEOR_LENGTH_MIN = 16
const METEOR_LENGTH_MAX = 34
const METEOR_WIDTH = 2.6

const COMET_RADIUS_MIN = 480
const COMET_RADIUS_MAX = 680
const COMET_ARC = 0.4
const COMET_LIFE_MIN = 3.5
const COMET_LIFE_MAX = 5.5
const COMET_LENGTH = 70
const COMET_WIDTH = 5.5

/** Elongated additive streak: bright head near one end, long tapering tail —
 * drawn once to a CanvasTexture (same house convention as buildShip.ts's
 * engine-glow texture / planetAgentic.ts's circuit map). Canvas-top ends up
 * at the sprite's local +Y ("up" in texture-UV terms), so the head sits at
 * local +Y and the tail trails toward local -Y. */
function createStreakTexture(): THREE.CanvasTexture {
  const w = 48
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, w, h)

  const headCy = h * 0.13

  // Long tapering tail: stacked horizontal bands, power-law brightness
  // falloff from head to tail so most of the streak reads as a faint whisper
  // behind a hot point.
  const bands = 56
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < bands; i++) {
    const t = i / (bands - 1) // 0 at head, 1 at tail tip
    const y = headCy + t * (h - headCy)
    const alpha = Math.pow(1 - t, 2.4) * 0.85
    const width = w * (0.55 + 0.45 * (1 - t))
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(w / 2 - width / 2, y, width, (h - headCy) / bands + 1.5)
  }
  ctx.globalAlpha = 1

  // Bright core blob at the head, on top of the tail bands.
  const headGrad = ctx.createRadialGradient(w / 2, headCy, 0, w / 2, headCy, w * 0.6)
  headGrad.addColorStop(0, 'rgba(255,255,255,1)')
  headGrad.addColorStop(0.45, 'rgba(255,255,255,0.85)')
  headGrad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = headGrad
  ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'source-over'

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

type StreakInstance = {
  sprite: THREE.Sprite
  active: boolean
  age: number
  life: number
  startPos: THREE.Vector3
  velocity: THREE.Vector3
  length: number
  width: number
  isComet: boolean
}

export type MeteorField = {
  object: THREE.Group
  update(dt: number, camera: THREE.PerspectiveCamera): void
  /** Dev/preview-only — force a meteor to spawn immediately (used for the
   * `?debug=1` verification hook so a wide screenshot can always catch one). */
  debugForceSpawn(kind?: 'meteor' | 'comet'): void
  dispose(): void
}

export function createMeteorField(): MeteorField {
  const rng = mulberry32(SEED)
  const group = new THREE.Group()
  group.name = 'meteor-field'

  const streakTex = createStreakTexture()

  function makeSprite(isComet: boolean): StreakInstance {
    const mat = new THREE.SpriteMaterial({
      map: streakTex,
      color: isComet ? 0xcfefff : 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
    })
    const sprite = new THREE.Sprite(mat)
    sprite.visible = false
    sprite.renderOrder = 4
    group.add(sprite)
    return {
      sprite,
      active: false,
      age: 0,
      life: 1,
      startPos: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      length: METEOR_LENGTH_MIN,
      width: METEOR_WIDTH,
      isComet,
    }
  }

  const meteors: StreakInstance[] = Array.from({ length: MAX_METEORS }, () => makeSprite(false))
  const comet = makeSprite(true)

  let meteorTimer = METEOR_SPAWN_MIN + rng() * (METEOR_SPAWN_MAX - METEOR_SPAWN_MIN)
  let cometTimer = COMET_SPAWN_MIN + rng() * (COMET_SPAWN_MAX - COMET_SPAWN_MIN)
  /** Dev-only (set via debugForceSpawn): aim the next spawn into the camera's
   * view cone so a verification screenshot reliably catches the streak.
   * Normal timed spawns stay uniformly random over the whole sky. */
  let forceInView: THREE.PerspectiveCamera | null = null
  let forcePending = false

  const tmpDir = new THREE.Vector3()
  const tmpTangent = new THREE.Vector3()
  const tmpArbitrary = new THREE.Vector3()

  /** Random point on a sphere of `radius` centered on `center`, plus a random
   * tangent (great-circle) direction at that point. When a camera is given,
   * the point is drawn from a narrow cone around the camera's forward axis
   * instead of the full sphere. */
  function randomGreatCircle(
    center: THREE.Vector3,
    radius: number,
    out: { pos: THREE.Vector3; dir: THREE.Vector3 },
    inViewOf?: THREE.PerspectiveCamera | null,
  ) {
    if (inViewOf) {
      inViewOf.getWorldDirection(tmpDir)
      tmpArbitrary.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).multiplyScalar(0.3)
      tmpDir.add(tmpArbitrary)
    } else {
      tmpDir.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1)
    }
    if (tmpDir.lengthSq() < 1e-6) tmpDir.set(0, 1, 0)
    tmpDir.normalize()
    out.pos.copy(center).addScaledVector(tmpDir, radius)

    tmpArbitrary.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).normalize()
    tmpTangent.crossVectors(tmpDir, tmpArbitrary)
    if (tmpTangent.lengthSq() < 1e-6) tmpTangent.set(1, 0, 0)
    tmpTangent.normalize()
    out.dir.copy(tmpTangent)
  }

  const spawnScratch = { pos: new THREE.Vector3(), dir: new THREE.Vector3() }

  function spawnMeteor(inst: StreakInstance, cameraPos: THREE.Vector3) {
    randomGreatCircle(
      cameraPos,
      METEOR_RADIUS_MIN + rng() * (METEOR_RADIUS_MAX - METEOR_RADIUS_MIN),
      spawnScratch,
      forceInView,
    )
    forceInView = null
    const arc = METEOR_ARC_MIN + rng() * (METEOR_ARC_MAX - METEOR_ARC_MIN)
    const life = METEOR_LIFE_MIN + rng() * (METEOR_LIFE_MAX - METEOR_LIFE_MIN)
    const radius = spawnScratch.pos.distanceTo(cameraPos)
    const travelDist = radius * arc
    inst.startPos.copy(spawnScratch.pos)
    inst.velocity.copy(spawnScratch.dir).multiplyScalar(travelDist / life)
    inst.life = life
    inst.age = 0
    inst.length = METEOR_LENGTH_MIN + rng() * (METEOR_LENGTH_MAX - METEOR_LENGTH_MIN)
    inst.width = METEOR_WIDTH * (0.85 + rng() * 0.3)
    inst.active = true
    inst.sprite.visible = true
  }

  function spawnComet(cameraPos: THREE.Vector3) {
    randomGreatCircle(cameraPos, COMET_RADIUS_MIN + rng() * (COMET_RADIUS_MAX - COMET_RADIUS_MIN), spawnScratch)
    const life = COMET_LIFE_MIN + rng() * (COMET_LIFE_MAX - COMET_LIFE_MIN)
    const radius = spawnScratch.pos.distanceTo(cameraPos)
    const travelDist = radius * COMET_ARC
    comet.startPos.copy(spawnScratch.pos)
    comet.velocity.copy(spawnScratch.dir).multiplyScalar(travelDist / life)
    comet.life = life
    comet.age = 0
    comet.length = COMET_LENGTH
    comet.width = COMET_WIDTH
    comet.active = true
    comet.sprite.visible = true
  }

  const camRight = new THREE.Vector3()
  const camUp = new THREE.Vector3()
  const camForwardScratch = new THREE.Vector3()
  const posDelta = new THREE.Vector3()

  function updateInstance(inst: StreakInstance, dt: number, camera: THREE.PerspectiveCamera) {
    if (!inst.active) return
    inst.age += dt
    if (inst.age >= inst.life) {
      inst.active = false
      inst.sprite.visible = false
      return
    }

    posDelta.copy(inst.velocity).multiplyScalar(inst.age)
    inst.sprite.position.copy(inst.startPos).add(posDelta)

    const t = inst.age / inst.life
    const fadeIn = THREE.MathUtils.smoothstep(t, 0, 0.12)
    const fadeOut = 1 - THREE.MathUtils.smoothstep(t, 0.65, 1)
    const mat = inst.sprite.material as THREE.SpriteMaterial
    mat.opacity = fadeIn * fadeOut * (inst.isComet ? 0.85 : 1)

    camera.matrixWorld.extractBasis(camRight, camUp, camForwardScratch)
    const dx = inst.velocity.dot(camRight)
    const dy = inst.velocity.dot(camUp)
    mat.rotation = Math.atan2(-dx, dy)

    inst.sprite.scale.set(inst.width, inst.length, 1)
  }

  return {
    object: group,

    update(dt, camera) {
      if (forcePending) {
        forcePending = false
        forceInView = camera
      }
      meteorTimer -= dt
      if (meteorTimer <= 0) {
        meteorTimer = METEOR_SPAWN_MIN + rng() * (METEOR_SPAWN_MAX - METEOR_SPAWN_MIN)
        const free = meteors.find((m) => !m.active)
        const activeCount = meteors.filter((m) => m.active).length
        if (free && activeCount < MAX_METEORS) spawnMeteor(free, camera.position)
      }
      forceInView = null

      cometTimer -= dt
      if (cometTimer <= 0) {
        cometTimer = COMET_SPAWN_MIN + rng() * (COMET_SPAWN_MAX - COMET_SPAWN_MIN)
        if (!comet.active) spawnComet(camera.position)
      }

      for (const m of meteors) updateInstance(m, dt, camera)
      updateInstance(comet, dt, camera)
    },

    debugForceSpawn(kind = 'meteor') {
      // The real camera arrives with the next update() call — this only flips
      // the timer to fire on the very next frame and asks that that spawn be
      // aimed into the camera's view cone.
      if (kind === 'comet') {
        cometTimer = -1
      } else {
        meteorTimer = -1
        forcePending = true
      }
    },

    dispose() {
      streakTex.dispose()
      for (const m of meteors) (m.sprite.material as THREE.SpriteMaterial).dispose()
      ;(comet.sprite.material as THREE.SpriteMaterial).dispose()
    },
  }
}
