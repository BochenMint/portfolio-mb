import * as THREE from 'three'

/**
 * Shared GLSL + constants for the Phase 2 "real world" — black hole + 4 project
 * planets. Every custom ShaderMaterial in this folder ends its fragment shader
 * with `#include <tonemapping_fragment>` + `#include <colorspace_fragment>` so
 * it goes through the exact same ACES + output-colorspace treatment the
 * built-in ship/dust materials get from this same EffectComposer — otherwise
 * custom shaders would look flat/mismatched next to the PBR objects. Three.js
 * resolves `#include` and auto-binds `cameraPosition` for ANY ShaderMaterial
 * (not just built-ins), so both are free to use here without extra uniforms.
 */

// ── Site palette (matches src/index.css tokens + v3 agentic swarm) ─────────
export const PALETTE = {
  ink: 0x080807,
  amber: 0xf5a524,
  amberBright: 0xffc861,
  amberDeep: 0xe8761a,
  coral: 0xff5e3a,
} as const

/** Fixed "sun" direction — matches the DirectionalLight in engine/core.ts so
 * hand-rolled per-fragment lambert shading on custom-shader planets reads
 * consistent with the PBR-lit ship. */
export const SUN_DIR = new THREE.Vector3(600, 400, 250).normalize()

/** Very slow whole-sky yaw (rad/s ≈ 0.1°/s) so the background never feels
 * frozen. Driven identically by engine/core.ts (scene.backgroundRotation)
 * and world/blackHole.ts (uSkyRot uniform) so the lensed sample inside the
 * impostor stays seamless against the rotating skybox outside it. */
export const SKY_ROT_SPEED = THREE.MathUtils.degToRad(0.1)

/** Same vector baked as a GLSL constant for the custom planet shaders (they
 * can't import the THREE.Vector3 above, only string chunks). */
export const SUN_DIR_GLSL = /* glsl */ `
  const vec3 SUN_DIR = vec3(${SUN_DIR.x.toFixed(6)}, ${SUN_DIR.y.toFixed(6)}, ${SUN_DIR.z.toFixed(6)});
`

export const TONE_OUTPUT_GLSL = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`

// ── Cheap hash-based value noise (own implementation of the standard
// "Book of Shaders" style technique — public algorithm class, not copied from
// any single author) — 2D for disk streaks / grid masks, 3D for planet
// surfaces & the agentic swarm shell (3D avoids UV-seam artifacts at poles). ─
export const NOISE_GLSL = /* glsl */ `
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm2(vec2 p, int octaves) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      sum += amp * vnoise2(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return sum;
  }

  float hash31(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float vnoise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    float n000 = hash31(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash31(i + vec3(1.0, 1.0, 1.0));
    float nx00 = mix(n000, n100, u.x);
    float nx10 = mix(n010, n110, u.x);
    float nx01 = mix(n001, n101, u.x);
    float nx11 = mix(n011, n111, u.x);
    float nxy0 = mix(nx00, nx10, u.y);
    float nxy1 = mix(nx01, nx11, u.y);
    return mix(nxy0, nxy1, u.z);
  }

  float fbm3(vec3 p, int octaves) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      sum += amp * vnoise3(p);
      p *= 2.03;
      amp *= 0.5;
    }
    return sum;
  }
`

/** Shared vertex shader for the three fully-custom-shaded planets (mint /
 * plumm / idrive) — plain sphere geometry, world position + normal + uv out. */
export const PLANET_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

/** Same as PLANET_VERT plus the un-transformed local direction (normalized
 * object-space position) — used wherever a procedural pattern must stay
 * pole-seam-free and rotate rigidly with the mesh (city-grid, basalt, clouds). */
export const PLANET_VERT_LOCAL = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  varying vec3 vLocalDir;

  void main() {
    vUv = uv;
    vLocalDir = normalize(position);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

/** Fresnel atmosphere rim — bright at the grazing silhouette edge, transparent
 * facing the camera dead-on. Standard front-facing additive rim-light trick. */
const RIM_VERT = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const RIM_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), uPower);
    float a = fres * uIntensity;
    gl_FragColor = vec4(uColor * a, a);
    ${TONE_OUTPUT_GLSL}
  }
`

export type AtmosphereRim = {
  mesh: THREE.Mesh
  dispose(): void
}

/** Slightly-larger glow shell around a planet — additive, depth-tested against
 * (but not writing to) the depth buffer so it never occludes anything else. */
export function createAtmosphereRim(
  radius: number,
  color: number,
  opts?: { power?: number; intensity?: number; segments?: number },
): AtmosphereRim {
  const { power = 2.6, intensity = 1.1, segments = 48 } = opts ?? {}
  const geo = new THREE.SphereGeometry(radius * 1.06, segments, Math.max(16, Math.floor(segments / 1.5)))
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uIntensity: { value: intensity },
    },
    vertexShader: RIM_VERT,
    fragmentShader: RIM_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.renderOrder = 3
  return {
    mesh,
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}

// ── Deterministic RNG (mulberry32) — reused across planet builders so layouts
// are stable across remounts (same convention as src/v3/agenticSwarmScene.ts). ─
export function mulberry32(seed: number) {
  let a = seed | 0
  return function rand() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
