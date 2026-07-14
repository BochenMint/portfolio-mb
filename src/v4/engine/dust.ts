import * as THREE from 'three'

/** Shared recycling box — both dust layers wrap their world-space positions
 * into this cube centered on the camera (not translated rigidly with it),
 * so particles genuinely stream past as the ship flies through them rather
 * than sitting frozen in camera-relative space. */
const BOX_SIZE = 180
const HALF_BOX = BOX_SIZE / 2

const AMBIENT_COUNT_HIGH = 2600
const AMBIENT_COUNT_LOW = 1200
const STREAK_COUNT_HIGH = 900
const STREAK_COUNT_LOW = 400

/** Below this speed, streaks are fully invisible; at/above the top of the
 * range they read at full ~0.5 opacity. */
const STREAK_SPEED_MIN = 12
const STREAK_SPEED_MAX = 60
const STREAK_MAX_OPACITY = 0.5

/** Ambient-mote opacity range — faint but always present at rest, brighter
 * (space feels "full") the faster the ship moves. Ramp saturates at this
 * speed. */
const MOTE_SPEED_REF = 70
const MOTE_OPACITY_MIN = 0.1
const MOTE_OPACITY_MAX = 0.35

export type DustField = {
  object: THREE.Object3D
  /** Recenter both dust layers on the camera (true modulo-box recycling, not
   * a rigid translation) and drive opacity/streak length from velocity. */
  update(cameraPos: THREE.Vector3, velocity: THREE.Vector3): void
  dispose(): void
}

/** Soft round sprite — bez tego punkty renderują się jako KWADRATY (widoczne
 * przy większej prędkości jako „kwadratowe gwiazdy"). Shared by the ambient
 * motes' point sprites. */
function createRadialSpriteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 32
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.5)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 32, 32)
  return new THREE.CanvasTexture(canvas)
}

/** Wraps `value` into the box of width BOX_SIZE centered on `center` — true
 * modulo recycling (a particle that falls more than half a box-width behind
 * the camera teleports a full box-width ahead, and vice versa), not a rigid
 * translation of the whole cloud. The while-loops only ever run more than
 * once right after a large camera jump (e.g. debug teleport); per-frame
 * camera motion is far smaller than BOX_SIZE so they're normally a single
 * comparison. */
function wrapAxis(value: number, center: number): number {
  let d = value - center
  while (d > HALF_BOX) d -= BOX_SIZE
  while (d < -HALF_BOX) d += BOX_SIZE
  return center + d
}

const AMBIENT_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aTint;
  varying vec3 vTint;
  uniform float uSizeMul;
  void main() {
    vTint = aTint;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Perspective size falloff — approximation of THREE's built-in
    // sizeAttenuation (we need a custom shader here for per-vertex aSize,
    // which PointsMaterial can't drive).
    gl_PointSize = aSize * uSizeMul / max(-mvPosition.z, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const AMBIENT_FRAG = /* glsl */ `
  precision mediump float;
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec3 vTint;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(vTint * tex.rgb, tex.a * uOpacity);
  }
`

/**
 * Two-layer dust: soft always-visible ambient motes (faint at rest, fuller
 * at speed) plus a pool of additive speed-streak line segments that only
 * appear once the ship is moving fast, both recycled via true modulo
 * wrapping in a box centered on the camera — see wrapAxis() above.
 */
export function createDustField(lowPower: boolean): DustField {
  const ambientCount = lowPower ? AMBIENT_COUNT_LOW : AMBIENT_COUNT_HIGH
  const streakCount = lowPower ? STREAK_COUNT_LOW : STREAK_COUNT_HIGH

  const spriteTex = createRadialSpriteTexture()

  // ─── Ambient motes ─────────────────────────────────────────────────────
  const motePositions = new Float32Array(ambientCount * 3)
  const moteSizes = new Float32Array(ambientCount)
  const moteTints = new Float32Array(ambientCount * 3)
  for (let i = 0; i < ambientCount; i++) {
    const ix = i * 3
    motePositions[ix + 0] = (Math.random() - 0.5) * BOX_SIZE
    motePositions[ix + 1] = (Math.random() - 0.5) * BOX_SIZE
    motePositions[ix + 2] = (Math.random() - 0.5) * BOX_SIZE
    moteSizes[i] = 0.1 + Math.random() * 0.25 // 0.10–0.35

    const roll = Math.random()
    if (roll < 0.04) {
      // ~4% cool/blue tinted
      moteTints[ix + 0] = 0.72
      moteTints[ix + 1] = 0.83
      moteTints[ix + 2] = 1.0
    } else if (roll < 0.08) {
      // ~4% warm tinted
      moteTints[ix + 0] = 1.0
      moteTints[ix + 1] = 0.9
      moteTints[ix + 2] = 0.74
    } else {
      // neutral white — the bulk of the field
      moteTints[ix + 0] = 1.0
      moteTints[ix + 1] = 1.0
      moteTints[ix + 2] = 1.0
    }
  }

  const moteGeo = new THREE.BufferGeometry()
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3))
  moteGeo.setAttribute('aSize', new THREE.BufferAttribute(moteSizes, 1))
  moteGeo.setAttribute('aTint', new THREE.BufferAttribute(moteTints, 3))

  const moteMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: spriteTex },
      uOpacity: { value: MOTE_OPACITY_MIN },
      uSizeMul: { value: 260 },
    },
    vertexShader: AMBIENT_VERT,
    fragmentShader: AMBIENT_FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
  })

  const motes = new THREE.Points(moteGeo, moteMaterial)
  motes.frustumCulled = false
  motes.renderOrder = 2

  // ─── Speed streaks ─────────────────────────────────────────────────────
  // Persistent per-streak anchor point (world space, wrapped every frame
  // exactly like the motes); the trailing vertex of each segment is derived
  // from it each frame, so only the anchor needs to be stored/wrapped.
  const streakAnchors = new Float32Array(streakCount * 3)
  for (let i = 0; i < streakCount; i++) {
    const ix = i * 3
    streakAnchors[ix + 0] = (Math.random() - 0.5) * BOX_SIZE
    streakAnchors[ix + 1] = (Math.random() - 0.5) * BOX_SIZE
    streakAnchors[ix + 2] = (Math.random() - 0.5) * BOX_SIZE
  }
  const streakLinePositions = new Float32Array(streakCount * 2 * 3)
  const streakGeo = new THREE.BufferGeometry()
  const streakPosAttr = new THREE.BufferAttribute(streakLinePositions, 3)
  streakPosAttr.setUsage(THREE.DynamicDrawUsage)
  streakGeo.setAttribute('position', streakPosAttr)

  const streakMaterial = new THREE.LineBasicMaterial({
    color: 0xcfe0ff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const streaks = new THREE.LineSegments(streakGeo, streakMaterial)
  streaks.frustumCulled = false
  streaks.renderOrder = 2

  const object = new THREE.Group()
  object.name = 'dust-field'
  object.add(motes)
  object.add(streaks)

  return {
    object,
    update(cameraPos, velocity) {
      // Ambient motes — wrap each axis into the box around the camera, then
      // fade opacity in with speed.
      for (let i = 0; i < ambientCount; i++) {
        const ix = i * 3
        motePositions[ix + 0] = wrapAxis(motePositions[ix + 0], cameraPos.x)
        motePositions[ix + 1] = wrapAxis(motePositions[ix + 1], cameraPos.y)
        motePositions[ix + 2] = wrapAxis(motePositions[ix + 2], cameraPos.z)
      }
      moteGeo.attributes.position.needsUpdate = true

      const speed = velocity.length()
      const moteT = THREE.MathUtils.clamp(speed / MOTE_SPEED_REF, 0, 1)
      moteMaterial.uniforms.uOpacity.value = THREE.MathUtils.lerp(MOTE_OPACITY_MIN, MOTE_OPACITY_MAX, moteT)

      // Speed streaks — same wrap, then rebuild the trailing vertex of each
      // segment from the (normalized) velocity direction. Zero per-frame
      // allocations: everything reuses the typed arrays created above.
      let dirX = 0
      let dirY = 0
      let dirZ = -1
      if (speed > 1e-4) {
        const inv = 1 / speed
        dirX = velocity.x * inv
        dirY = velocity.y * inv
        dirZ = velocity.z * inv
      }
      const streakLen = THREE.MathUtils.clamp(speed * 0.06, 0.3, 4.5)

      for (let i = 0; i < streakCount; i++) {
        const ix = i * 3
        streakAnchors[ix + 0] = wrapAxis(streakAnchors[ix + 0], cameraPos.x)
        streakAnchors[ix + 1] = wrapAxis(streakAnchors[ix + 1], cameraPos.y)
        streakAnchors[ix + 2] = wrapAxis(streakAnchors[ix + 2], cameraPos.z)

        const ax = streakAnchors[ix + 0]
        const ay = streakAnchors[ix + 1]
        const az = streakAnchors[ix + 2]
        const lx = i * 6
        streakLinePositions[lx + 0] = ax
        streakLinePositions[lx + 1] = ay
        streakLinePositions[lx + 2] = az
        streakLinePositions[lx + 3] = ax - dirX * streakLen
        streakLinePositions[lx + 4] = ay - dirY * streakLen
        streakLinePositions[lx + 5] = az - dirZ * streakLen
      }
      streakGeo.attributes.position.needsUpdate = true

      const streakT = THREE.MathUtils.clamp(
        (speed - STREAK_SPEED_MIN) / (STREAK_SPEED_MAX - STREAK_SPEED_MIN),
        0,
        1,
      )
      streakMaterial.opacity = streakT * STREAK_MAX_OPACITY
    },
    dispose() {
      moteGeo.dispose()
      moteMaterial.dispose()
      streakGeo.dispose()
      streakMaterial.dispose()
      spriteTex.dispose()
    },
  }
}
