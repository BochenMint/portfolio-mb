import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { NOISE_GLSL, TONE_OUTPUT_GLSL } from '../world/shaderChunks'

/**
 * Original kit-bash — NOT a copy of any franchise ship. Starts from a CC0
 * Quaternius interceptor hull (see public/v4/assets/ATTRIBUTION.md), stretched
 * into an elongated needle-nose fuselage, then dressed with primitive-built
 * twin engine booms on angled pylons, slim swept wing blades and a raised aft
 * superstructure — evoking a sleek frigate silhouette without reusing any
 * protected design.
 */

const SHIP_GLB_URL = '/v4/assets/ships/ship-interceptor-htfBk9vPfw.glb'

// ─── Tunable proportions (adjust here between look iterations) ──────────────
const FINAL_HULL_LENGTH = 22 // world units, nose to tail after stretch
const STRETCH_Z = 1.8 // 1.6–2.0 per spec — drooping needle-nose elongation
const TOTAL_SPAN = FINAL_HULL_LENGTH / 5 // ~length:width 5:1 (wingtip to wingtip)
const NOSE_FLIP = true // 180° yaw flip if the raw hull's nose points the wrong way

const BOOM_RADIUS = 0.5
const BOOM_LENGTH = FINAL_HULL_LENGTH * 0.42
const BOOM_X = TOTAL_SPAN * 0.42
const BOOM_Y = -0.35
const BOOM_Z_CENTER = FINAL_HULL_LENGTH * 0.16 // slightly aft of hull center

const ENGINE_IDLE_INTENSITY = 0.6
const ENGINE_FULL_INTENSITY = 3.5
const ENGINE_COLOR_IDLE = new THREE.Color(0x4db8ff)
const ENGINE_COLOR_FULL = new THREE.Color(0x9fd8ff)

const LIGHT_IDLE_INTENSITY = 6
const LIGHT_FULL_INTENSITY = 55

// Plasma plume — idle is a short shimmer, full thrust a long turbulent tongue.
const PLUME_LENGTH_IDLE = 0.4
const PLUME_LENGTH_FULL = 5.2
const PLUME_RADIUS_IDLE = 0.16
const PLUME_RADIUS_FULL = 0.42
const PLUME_COLOR_CORE = new THREE.Color(0xeaf6ff) // blue-white
const PLUME_COLOR_MID = new THREE.Color(0x39c9ff) // cyan

export type Ship = {
  group: THREE.Group
  /** 0..1 smoothed thrust — drives emissive color/intensity, glow sprites,
   * point lights, and the per-nozzle plume shaders. `elapsed` drives the
   * plume's scrolling turbulence and per-nozzle flicker phase. */
  updateThrust(thrust: number, elapsed: number): void
  dispose(): void
}

// ─── Per-nozzle plasma plume — cone mesh, additive turbulent shader ─────────
// Geometry: a unit cone pre-baked so its apex sits at the local origin and its
// (open, cap-less) wide end trails along local +Z — i.e. already oriented to
// sit at a nozzle position and flare backward along the ship's aft axis with
// zero extra per-instance rotation. Rendered double-sided so the near/far
// shell surfaces overlap additively — the same "fake volumetric beam" trick
// used for laser-core shaders — giving a bright dense-looking core instead of
// a visibly hollow cone.
function createPlumeGeometry(): THREE.ConeGeometry {
  const geo = new THREE.ConeGeometry(1, 1, 20, 12, true)
  geo.translate(0, 0.5, 0) // apex -> y=0, base -> y=1
  geo.rotateX(Math.PI / 2) // apex -> z=0, base -> z=+1 (matches nozzle "aft" = +Z)
  return geo
}

const PLUME_VERT = /* glsl */ `
  varying vec3 vLocalPos;
  void main() {
    vLocalPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`

const PLUME_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uThrust;
  uniform float uPhase;
  uniform vec3 uColorCore;
  uniform vec3 uColorMid;
  varying vec3 vLocalPos;

  ${NOISE_GLSL}

  void main() {
    float frac = clamp(vLocalPos.z, 0.0, 1.0); // 0 = nozzle, 1 = plume tip
    float ang = atan(vLocalPos.y, vLocalPos.x);

    // Turbulence sampled in (angle, length-minus-time) space so the pattern
    // reads as continuously scrolling backward, away from the nozzle.
    float scrollSpeed = 3.0 + uThrust * 9.0;
    vec2 flowUv = vec2(ang * 1.6, frac * 5.0 - uTime * scrollSpeed - uPhase);
    float turb = fbm2(flowUv, 4);
    float turb2 = fbm2(flowUv * 2.3 + 7.1, 3);
    float turbMix = mix(turb, turb2, 0.4);

    // Hottest at the nozzle, fully gone by the tip — fast-then-slow taper so
    // the plume reads as soft plasma, not a hard-edged cone.
    float lengthFade = pow(1.0 - frac, 1.6);

    // Flicker amplitude scales with thrust: idle is a gentle shimmer, full
    // burn breaks the tongue up into visible turbulent streaks.
    float amp = mix(0.16, 0.55, uThrust);
    float density = clamp(lengthFade * (1.0 - amp + amp * turbMix * 1.4), 0.0, 1.0);

    vec3 color = mix(uColorMid, uColorCore, smoothstep(0.55, 0.0, frac));

    float alpha = density * smoothstep(1.0, 0.05, frac);
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(color * (0.6 + density * 1.2), alpha);
    ${TONE_OUTPUT_GLSL}
  }
`

function createGlowTexture(): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.35, 'rgba(150,210,255,0.65)')
  gradient.addColorStop(1, 'rgba(80,160,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

/** Flat swept wing blade as an extruded planform: root at hull, tip swept aft. */
function buildWingGeometry(span: number, rootChord: number, tipChord: number, sweep: number, thickness: number) {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(0, -rootChord)
  shape.lineTo(span, -sweep - tipChord)
  shape.lineTo(span, -sweep)
  shape.closePath()

  const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 1 })
  geo.rotateX(-Math.PI / 2)
  geo.translate(0, -thickness / 2, 0)
  return geo
}

function orientAndNormalize(root: THREE.Object3D): THREE.Group {
  const raw = root
  const box = new THREE.Box3().setFromObject(raw)
  const center = new THREE.Vector3()
  box.getCenter(center)
  raw.position.sub(center)

  const size = new THREE.Vector3()
  box.getSize(size)

  const rotationGroup = new THREE.Group()
  rotationGroup.add(raw)

  // Reorient so the model's longest axis becomes local Z (our forward/aft axis).
  if (size.x >= size.y && size.x >= size.z) {
    rotationGroup.rotation.y = Math.PI / 2
  } else if (size.y > size.x && size.y >= size.z) {
    rotationGroup.rotation.x = Math.PI / 2
  }
  if (NOSE_FLIP) rotationGroup.rotation.y += Math.PI

  const orientedBox = new THREE.Box3().setFromObject(rotationGroup)
  const orientedSize = new THREE.Vector3()
  orientedBox.getSize(orientedSize)
  const orientedLength = Math.max(orientedSize.z, 0.0001)

  const baseScale = FINAL_HULL_LENGTH / STRETCH_Z / orientedLength

  const hullGroup = new THREE.Group()
  hullGroup.add(rotationGroup)
  hullGroup.scale.set(baseScale, baseScale, baseScale * STRETCH_Z)

  return hullGroup
}

export async function buildShip(manager: THREE.LoadingManager, envMap: THREE.Texture | null): Promise<Ship> {
  const loader = new GLTFLoader(manager)
  const gltf = await loader.loadAsync(SHIP_GLB_URL)

  const shipRoot = new THREE.Group()
  shipRoot.name = 'ship-root'

  // ─── Hull — loaded model, reoriented + stretched, polished steel skin ──────
  const hullGroup = orientAndNormalize(gltf.scene)
  shipRoot.add(hullGroup)

  const steelMat = new THREE.MeshPhysicalMaterial({
    color: 0xd7dde3,
    metalness: 1.0,
    roughness: 0.15,
    envMapIntensity: 1.5,
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
  })
  const steelAccentMat = new THREE.MeshPhysicalMaterial({
    color: 0x2c3036,
    metalness: 0.9,
    roughness: 0.35,
    envMapIntensity: 1.2,
  })
  if (envMap) {
    steelMat.envMap = envMap
    steelAccentMat.envMap = envMap
  }

  let meshIndex = 0
  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = meshIndex % 3 === 0 ? steelAccentMat : steelMat
      child.castShadow = false
      child.receiveShadow = false
      meshIndex += 1
    }
  })

  // ─── Kit-bash additions — sized off FINAL_HULL_LENGTH / TOTAL_SPAN, ─────────
  // siblings of hullGroup so the STRETCH_Z above doesn't distort their shape.
  const kitbash = new THREE.Group()
  kitbash.name = 'ship-kitbash'
  shipRoot.add(kitbash)

  // Raised aft superstructure
  const superstructureGeo = new THREE.BoxGeometry(TOTAL_SPAN * 0.32, TOTAL_SPAN * 0.34, FINAL_HULL_LENGTH * 0.22)
  const superstructure = new THREE.Mesh(superstructureGeo, steelAccentMat)
  superstructure.position.set(0, TOTAL_SPAN * 0.3, FINAL_HULL_LENGTH * 0.14)
  kitbash.add(superstructure)

  // Slim swept wing blades (mirrored left/right) — shiny steel so they catch
  // highlights and read distinctly against the dark-accent hull/superstructure.
  const wingGeo = buildWingGeometry(
    TOTAL_SPAN * 0.95, // span from hull — extends past the boom width for silhouette
    FINAL_HULL_LENGTH * 0.19, // root chord
    FINAL_HULL_LENGTH * 0.08, // tip chord
    FINAL_HULL_LENGTH * 0.2, // sweep
    0.16, // thickness
  )
  const wingMat = steelMat
  const rightWing = new THREE.Mesh(wingGeo, wingMat)
  rightWing.position.set(TOTAL_SPAN * 0.16, 0.25, -FINAL_HULL_LENGTH * 0.015)
  rightWing.material = wingMat
  ;(rightWing.material as THREE.MeshPhysicalMaterial).side = THREE.DoubleSide
  kitbash.add(rightWing)

  const leftWing = rightWing.clone()
  leftWing.scale.x = -1
  kitbash.add(leftWing)

  // ─── Hull paneling — raised strakes + a dorsal spine plate. Dark accent
  // material against the bright hull skin reads as panel lines/plating up
  // close, without any UV work on the loaded hull mesh itself. ──────────────
  const strakeGeos: THREE.BoxGeometry[] = []
  const strakeConfigs = [
    { side: 1, y: 0.16, z: -0.05, len: 0.5, w: 0.05, h: 0.028 },
    { side: -1, y: 0.16, z: -0.02, len: 0.44, w: 0.05, h: 0.028 },
    { side: 1, y: -0.1, z: 0.06, len: 0.34, w: 0.045, h: 0.024 },
    { side: -1, y: -0.1, z: 0.04, len: 0.3, w: 0.045, h: 0.024 },
    { side: 0, y: 0.22, z: -0.08, len: 0.4, w: 0.08, h: 0.02 }, // dorsal spine, centered
  ]
  for (const cfg of strakeConfigs) {
    const geo = new THREE.BoxGeometry(TOTAL_SPAN * cfg.w, TOTAL_SPAN * cfg.h, FINAL_HULL_LENGTH * cfg.len)
    strakeGeos.push(geo)
    const strake = new THREE.Mesh(geo, steelAccentMat)
    strake.position.set(cfg.side * TOTAL_SPAN * 0.2, TOTAL_SPAN * cfg.y, FINAL_HULL_LENGTH * cfg.z)
    kitbash.add(strake)
  }

  // Low glazed bridge/canopy block, forward of the superstructure.
  const canopyGeo = new THREE.BoxGeometry(TOTAL_SPAN * 0.24, TOTAL_SPAN * 0.16, FINAL_HULL_LENGTH * 0.14)
  const canopyMat = new THREE.MeshPhysicalMaterial({
    color: 0x0c1a24,
    metalness: 0.05,
    roughness: 0.08,
    transmission: 0.6,
    thickness: 0.4,
    ior: 1.4,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    emissive: new THREE.Color(0x1c3a52),
    emissiveIntensity: 0.5,
    envMapIntensity: 1.3,
  })
  if (envMap) canopyMat.envMap = envMap
  const canopy = new THREE.Mesh(canopyGeo, canopyMat)
  canopy.position.set(0, TOTAL_SPAN * 0.2, -FINAL_HULL_LENGTH * 0.24)
  kitbash.add(canopy)

  // Slim antenna/sensor spines, splayed off the dorsal spine.
  const antennaGeo = new THREE.CylinderGeometry(TOTAL_SPAN * 0.012, TOTAL_SPAN * 0.02, FINAL_HULL_LENGTH * 0.2, 6)
  const antennaRight = new THREE.Mesh(antennaGeo, steelAccentMat)
  antennaRight.position.set(TOTAL_SPAN * 0.1, TOTAL_SPAN * 0.55, FINAL_HULL_LENGTH * 0.1)
  antennaRight.rotation.z = -0.12
  antennaRight.rotation.x = 0.08
  kitbash.add(antennaRight)
  const antennaLeft = antennaRight.clone()
  antennaLeft.position.x *= -1
  antennaLeft.rotation.z *= -1
  kitbash.add(antennaLeft)

  // RCS thruster nubs — small greeble bumps near the nose and tail corners.
  const nubGeo = new THREE.CylinderGeometry(TOTAL_SPAN * 0.035, TOTAL_SPAN * 0.05, TOTAL_SPAN * 0.06, 8)
  const nubConfigs: Array<[number, number, number]> = [
    [1, 0.18, -0.34],
    [-1, 0.18, -0.34],
    [1, -0.12, 0.26],
    [-1, -0.12, 0.26],
  ]
  for (const [sx, syFrac, zFrac] of nubConfigs) {
    const nub = new THREE.Mesh(nubGeo, steelAccentMat)
    nub.position.set(sx * TOTAL_SPAN * 0.42, syFrac * TOTAL_SPAN, zFrac * FINAL_HULL_LENGTH)
    nub.rotation.x = Math.PI / 2
    kitbash.add(nub)
  }

  // Twin engine booms on angled pylons
  const boomGeo = new THREE.CylinderGeometry(BOOM_RADIUS, BOOM_RADIUS * 0.85, BOOM_LENGTH, 16)
  boomGeo.rotateX(Math.PI / 2)

  const nozzleGeo = new THREE.CircleGeometry(BOOM_RADIUS * 0.82, 24)
  const nozzleMat = new THREE.MeshStandardMaterial({
    color: 0x18232e,
    emissive: ENGINE_COLOR_IDLE.clone(),
    emissiveIntensity: ENGINE_IDLE_INTENSITY,
    metalness: 0.6,
    roughness: 0.3,
  })

  const glowTexture = createGlowTexture()
  const glowMat = new THREE.SpriteMaterial({
    map: glowTexture,
    color: ENGINE_COLOR_IDLE.clone(),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.55,
  })

  const nozzles: THREE.Mesh[] = []
  const glowSprites: THREE.Sprite[] = []
  const engineLights: THREE.PointLight[] = []
  const plumeGeo = createPlumeGeometry()
  const plumes: { mesh: THREE.Mesh; mat: THREE.ShaderMaterial }[] = []

  const boomSign = [-1, 1]
  for (const sign of boomSign) {
    const pylon = new THREE.Mesh(
      new THREE.BoxGeometry(TOTAL_SPAN * 0.14, TOTAL_SPAN * 0.1, FINAL_HULL_LENGTH * 0.16),
      steelAccentMat,
    )
    pylon.position.set(sign * BOOM_X * 0.55, BOOM_Y * 0.4, BOOM_Z_CENTER * 0.3)
    pylon.rotation.z = sign * -0.18
    kitbash.add(pylon)

    const boom = new THREE.Mesh(boomGeo, steelMat)
    boom.position.set(sign * BOOM_X, BOOM_Y, BOOM_Z_CENTER)
    kitbash.add(boom)

    const boomAftZ = BOOM_Z_CENTER + BOOM_LENGTH / 2

    for (const yOff of [-0.32, 0.32]) {
      const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat)
      nozzle.position.set(sign * BOOM_X, BOOM_Y + yOff, boomAftZ + 0.02)
      nozzle.rotation.y = Math.PI
      kitbash.add(nozzle)
      nozzles.push(nozzle)

      const sprite = new THREE.Sprite(glowMat)
      sprite.position.set(sign * BOOM_X, BOOM_Y + yOff, boomAftZ + 0.5)
      sprite.scale.set(1.4, 1.4, 1)
      kitbash.add(sprite)
      glowSprites.push(sprite)

      // Animated plasma plume — own ShaderMaterial per nozzle so each gets an
      // independent flicker phase (they must not pulse in sync).
      const plumeMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uThrust: { value: 0 },
          uPhase: { value: (nozzles.length % 4) * 17.3 },
          uColorCore: { value: PLUME_COLOR_CORE.clone() },
          uColorMid: { value: PLUME_COLOR_MID.clone() },
        },
        vertexShader: PLUME_VERT,
        fragmentShader: PLUME_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      })
      const plumeMesh = new THREE.Mesh(plumeGeo, plumeMat)
      plumeMesh.position.set(sign * BOOM_X, BOOM_Y + yOff, boomAftZ + 0.04)
      plumeMesh.scale.set(PLUME_RADIUS_IDLE, PLUME_RADIUS_IDLE, PLUME_LENGTH_IDLE)
      plumeMesh.renderOrder = 5
      kitbash.add(plumeMesh)
      plumes.push({ mesh: plumeMesh, mat: plumeMat })
    }

    const light = new THREE.PointLight(ENGINE_COLOR_IDLE.getHex(), LIGHT_IDLE_INTENSITY, 40, 2)
    light.position.set(sign * BOOM_X, BOOM_Y, boomAftZ + 1)
    kitbash.add(light)
    engineLights.push(light)
  }

  const tmpColor = new THREE.Color()

  return {
    group: shipRoot,

    updateThrust(thrust, elapsed) {
      const t = THREE.MathUtils.clamp(thrust, 0, 1)
      tmpColor.copy(ENGINE_COLOR_IDLE).lerp(ENGINE_COLOR_FULL, t)
      const intensity = THREE.MathUtils.lerp(ENGINE_IDLE_INTENSITY, ENGINE_FULL_INTENSITY, t)

      nozzleMat.emissive.copy(tmpColor)
      nozzleMat.emissiveIntensity = intensity
      glowMat.color.copy(tmpColor)
      glowMat.opacity = THREE.MathUtils.lerp(0.45, 1, t)

      const spriteScale = THREE.MathUtils.lerp(1.2, 3.0, t)
      for (const sprite of glowSprites) sprite.scale.set(spriteScale, spriteScale, 1)

      const lightIntensity = THREE.MathUtils.lerp(LIGHT_IDLE_INTENSITY, LIGHT_FULL_INTENSITY, t)
      for (const light of engineLights) {
        light.color.copy(tmpColor)
        light.intensity = lightIntensity
      }

      const plumeLength = THREE.MathUtils.lerp(PLUME_LENGTH_IDLE, PLUME_LENGTH_FULL, t)
      const plumeRadius = THREE.MathUtils.lerp(PLUME_RADIUS_IDLE, PLUME_RADIUS_FULL, t)
      for (const plume of plumes) {
        plume.mesh.scale.set(plumeRadius, plumeRadius, plumeLength)
        plume.mat.uniforms.uTime.value = elapsed
        plume.mat.uniforms.uThrust.value = t
      }
    },

    dispose() {
      steelMat.dispose()
      steelAccentMat.dispose()
      nozzleMat.dispose()
      glowMat.dispose()
      glowTexture.dispose()
      canopyMat.dispose()
      superstructureGeo.dispose()
      wingGeo.dispose()
      boomGeo.dispose()
      nozzleGeo.dispose()
      canopyGeo.dispose()
      antennaGeo.dispose()
      nubGeo.dispose()
      for (const geo of strakeGeos) geo.dispose()
      plumeGeo.dispose()
      for (const plume of plumes) plume.mat.dispose()
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) child.geometry.dispose()
      })
      for (const n of nozzles) void n
      for (const g of glowSprites) void g
    },
  }
}
