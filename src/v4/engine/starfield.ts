import * as THREE from 'three'
import { mulberry32 } from '../world/shaderChunks'

/**
 * Twinkling near-field star layer — ~1500 points scattered on a large sphere
 * shell that FOLLOWS the camera position (but not its rotation), so it reads
 * as an infinitely-far layer with parallax-free shimmer the flat skybox JPEG
 * can't provide. Each star gets a phase-offset sinusoidal size/alpha shimmer
 * and a subtle color cast (most white, a few blue-white / warm) — the "sky is
 * alive" pass, together with the slow whole-sky yaw driven in core.ts.
 */

const STAR_COUNT = 1500
const SHELL_RADIUS = 1600
const SEED = 20260712

const VERT = /* glsl */ `
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aSize;
  attribute vec3 aColor;

  uniform float uTime;

  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // 0.62..1.0 — stars never blink fully off, they breathe.
    float tw = 0.81 + 0.19 * sin(uTime * aSpeed + aPhase);
    vTwinkle = tw;
    vColor = aColor;

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * tw * (1900.0 / max(-mv.z, 1.0));
  }
`

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    float alpha = smoothstep(1.0, 0.0, d);
    alpha = pow(alpha, 2.2) * vTwinkle;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor * alpha, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export type Starfield = {
  object: THREE.Points
  /** Follow the camera (position only) + advance the shimmer clock. */
  update(cameraPos: THREE.Vector3, elapsed: number, skyYaw: number): void
  dispose(): void
}

export function createStarfield(lowPower: boolean): Starfield {
  const count = lowPower ? 800 : STAR_COUNT
  const rng = mulberry32(SEED)

  const positions = new Float32Array(count * 3)
  const phases = new Float32Array(count)
  const speeds = new Float32Array(count)
  const sizes = new Float32Array(count)
  const colors = new Float32Array(count * 3)

  const white = new THREE.Color(0xffffff)
  const blueWhite = new THREE.Color(0xbfd4ff)
  const warm = new THREE.Color(0xffe0b8)
  const tmp = new THREE.Color()

  for (let i = 0; i < count; i++) {
    // Uniform-ish direction on the sphere (rejection-free: normalize a cube sample).
    let x: number
    let y: number
    let z: number
    let l2: number
    do {
      x = rng() * 2 - 1
      y = rng() * 2 - 1
      z = rng() * 2 - 1
      l2 = x * x + y * y + z * z
    } while (l2 < 0.01 || l2 > 1)
    const inv = SHELL_RADIUS / Math.sqrt(l2)
    positions[i * 3] = x * inv
    positions[i * 3 + 1] = y * inv
    positions[i * 3 + 2] = z * inv

    phases[i] = rng() * Math.PI * 2
    speeds[i] = 0.5 + rng() * 2.2
    sizes[i] = 0.5 + Math.pow(rng(), 2.4) * 1.9 // few big, many small

    const roll = rng()
    if (roll < 0.12) tmp.copy(blueWhite)
    else if (roll < 0.2) tmp.copy(warm)
    else tmp.copy(white)
    // slight per-star brightness spread
    tmp.multiplyScalar(0.55 + rng() * 0.45)
    colors[i * 3] = tmp.r
    colors[i * 3 + 1] = tmp.g
    colors[i * 3 + 2] = tmp.b
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), SHELL_RADIUS + 1)

  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  // Drawn before the black-hole impostor (renderOrder 1) so the impostor's
  // lensed background cleanly overdraws stars behind it.
  points.renderOrder = 0
  points.name = 'starfield-twinkle'

  return {
    object: points,
    update(cameraPos, elapsed, skyYaw) {
      points.position.copy(cameraPos)
      points.rotation.y = skyYaw // drift with the same slow yaw as the skybox
      mat.uniforms.uTime.value = elapsed
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
