import * as THREE from 'three'
import { NOISE_GLSL, TONE_OUTPUT_GLSL } from '../../world/shaderChunks'

/**
 * Nozzle + glow-sprite + point-light + plasma-plume rig, parameterized over
 * an arbitrary list of nozzle attachment points instead of the fixed
 * boom-sign/y-offset loop in buildShip.ts. Visual language (colors, shader,
 * intensity curves) is carried over unchanged from buildShip.ts so the ship
 * silhouette can change without the engine FX reading as a different game —
 * this is a from-scratch reimplementation of that same look, not an import,
 * since buildShip.ts doesn't export these pieces individually.
 */

const ENGINE_IDLE_INTENSITY = 0.6
const ENGINE_FULL_INTENSITY = 3.5
const ENGINE_COLOR_IDLE = new THREE.Color(0x4db8ff)
const ENGINE_COLOR_FULL = new THREE.Color(0x9fd8ff)

const LIGHT_IDLE_INTENSITY = 6
const LIGHT_FULL_INTENSITY = 55

const PLUME_LENGTH_IDLE = 0.4
const PLUME_LENGTH_FULL = 5.2
const PLUME_RADIUS_IDLE = 0.16
const PLUME_RADIUS_FULL = 0.42
const PLUME_COLOR_CORE = new THREE.Color(0xeaf6ff)
const PLUME_COLOR_MID = new THREE.Color(0x39c9ff)

function createPlumeGeometry(): THREE.ConeGeometry {
  const geo = new THREE.ConeGeometry(1, 1, 20, 12, true)
  geo.translate(0, 0.5, 0)
  geo.rotateX(Math.PI / 2)
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
    float frac = clamp(vLocalPos.z, 0.0, 1.0);
    float ang = atan(vLocalPos.y, vLocalPos.x);

    float scrollSpeed = 3.0 + uThrust * 9.0;
    vec2 flowUv = vec2(ang * 1.6, frac * 5.0 - uTime * scrollSpeed - uPhase);
    float turb = fbm2(flowUv, 4);
    float turb2 = fbm2(flowUv * 2.3 + 7.1, 3);
    float turbMix = mix(turb, turb2, 0.4);

    float lengthFade = pow(1.0 - frac, 1.6);
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

export type EngineFx = {
  group: THREE.Group
  nozzleMat: THREE.MeshStandardMaterial
  updateThrust(thrust: number, elapsed: number): void
  dispose(): void
}

/** Builds the full FX rig at N nozzle attach points (local ship space, aft
 * direction = local +Z, matching the plume geometry's baked orientation). */
export function createEngineFx(attachPoints: THREE.Vector3[]): EngineFx {
  const group = new THREE.Group()
  group.name = 'engine-fx'

  const nozzleGeo = new THREE.CircleGeometry(0.34, 24)
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

  const glowSprites: THREE.Sprite[] = []
  const engineLights: THREE.PointLight[] = []
  const plumeGeo = createPlumeGeometry()
  const plumes: { mesh: THREE.Mesh; mat: THREE.ShaderMaterial }[] = []

  attachPoints.forEach((pos, idx) => {
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat)
    nozzle.position.copy(pos)
    nozzle.rotation.y = Math.PI
    group.add(nozzle)

    const sprite = new THREE.Sprite(glowMat)
    sprite.position.copy(pos).add(new THREE.Vector3(0, 0, 0.5))
    sprite.scale.set(1.4, 1.4, 1)
    group.add(sprite)
    glowSprites.push(sprite)

    const plumeMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uThrust: { value: 0 },
        uPhase: { value: (idx % 4) * 17.3 },
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
    plumeMesh.position.copy(pos).add(new THREE.Vector3(0, 0, 0.04))
    plumeMesh.scale.set(PLUME_RADIUS_IDLE, PLUME_RADIUS_IDLE, PLUME_LENGTH_IDLE)
    plumeMesh.renderOrder = 5
    group.add(plumeMesh)
    plumes.push({ mesh: plumeMesh, mat: plumeMat })

    const light = new THREE.PointLight(ENGINE_COLOR_IDLE.getHex(), LIGHT_IDLE_INTENSITY, 40, 2)
    light.position.copy(pos).add(new THREE.Vector3(0, 0, 1))
    group.add(light)
    engineLights.push(light)
  })

  const tmpColor = new THREE.Color()

  return {
    group,
    nozzleMat,

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
      nozzleGeo.dispose()
      nozzleMat.dispose()
      glowMat.dispose()
      glowTexture.dispose()
      plumeGeo.dispose()
      for (const plume of plumes) plume.mat.dispose()
    },
  }
}
