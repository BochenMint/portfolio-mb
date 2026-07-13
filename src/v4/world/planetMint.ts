import * as THREE from 'three'
import { NOISE_GLSL, PLANET_VERT, SUN_DIR_GLSL, TONE_OUTPUT_GLSL, createAtmosphereRim } from './shaderChunks'

/**
 * Mint Apartments — "tropikalne wakacje" vacation planet. Earth day-map
 * texture is recolored in-shader (oceans -> turquoise/mint, land -> lush
 * green with a sandy coastline band) rather than used photoreal, plus an
 * independently-rotating fbm cloud shell and a warm bright atmosphere rim.
 */

const FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uEarthTex;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  ${SUN_DIR_GLSL}
  ${NOISE_GLSL}

  void main() {
    vec4 tex = texture2D(uEarthTex, vUv);

    // Ocean discriminant: earth day-map oceans read strongly blue relative to
    // red/green; land is closer to balanced RGB.
    float wet = clamp(tex.b - max(tex.r, tex.g) * 0.62, 0.0, 1.0);
    float oceanMask = smoothstep(0.02, 0.24, wet);

    vec3 deepOcean = vec3(0.02, 0.24, 0.34);
    vec3 shallowOcean = vec3(0.15, 0.83, 0.73);
    vec3 oceanColor = mix(deepOcean, shallowOcean, smoothstep(0.22, 0.8, tex.b));

    vec3 darkLand = vec3(0.07, 0.26, 0.12);
    vec3 lushLand = vec3(0.30, 0.58, 0.24);
    vec3 landColor = mix(darkLand, lushLand, smoothstep(0.15, 0.55, tex.g));

    vec3 base = mix(landColor, oceanColor, oceanMask);

    // Sandy coastline accent — a narrow band right where the mask crosses 0.5.
    float coast = smoothstep(0.38, 0.5, oceanMask) * (1.0 - smoothstep(0.5, 0.62, oceanMask));
    vec3 sand = vec3(0.96, 0.87, 0.70);
    base = mix(base, sand, coast * 0.9);

    // Faint polar ice caps where the source map reads near-white in all channels.
    float ice = smoothstep(0.78, 0.92, min(tex.r, min(tex.g, tex.b)));
    base = mix(base, vec3(0.94, 0.97, 0.98), ice * 0.55);

    // Close-up detail: fine surface grain (coastline texture / terrain
    // stippling) that fades out at range so the far establishing view stays
    // clean and reads as the earlier flat-shaded planet.
    vec3 n = normalize(vNormalW);
    float camDist = length(cameraPosition - vWorldPos);
    float detailFade = 1.0 - smoothstep(uRadius * 2.2, uRadius * 9.0, camDist);
    if (detailFade > 0.003) {
      float grain = fbm3(normalize(vWorldPos) * uRadius * 0.9, 5);
      float grain2 = fbm3(normalize(vWorldPos) * uRadius * 2.6 + 4.7, 3);
      float grainMix = grain * 0.7 + grain2 * 0.3;
      base *= mix(1.0, 0.82 + grainMix * 0.36, detailFade);
    }

    float diffuse = max(dot(n, SUN_DIR), 0.0);
    vec3 color = base * (0.28 + diffuse * 0.85);

    gl_FragColor = vec4(color, 1.0);
    ${TONE_OUTPUT_GLSL}
  }
`

const CLOUD_VERT = /* glsl */ `
  varying vec3 vLocalDir;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  void main() {
    vLocalDir = normalize(position);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const CLOUD_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uRadius;
  varying vec3 vLocalDir;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  ${SUN_DIR_GLSL}
  ${NOISE_GLSL}

  void main() {
    vec3 p = vLocalDir * 3.1 + vec3(uTime * 0.014, uTime * 0.007, -uTime * 0.01);
    float n = fbm3(p, 5);
    float alpha = smoothstep(0.5, 0.74, n);
    if (alpha < 0.02) discard;

    // Close-up wisp detail — a finer, faster-drifting fbm layer folded in only
    // near the camera so distant views keep the clean broad cloud shapes.
    float camDist = length(cameraPosition - vWorldPos);
    float detailFade = 1.0 - smoothstep(uRadius * 2.2, uRadius * 9.0, camDist);
    if (detailFade > 0.003) {
      float wisp = fbm3(vLocalDir * 11.0 + vec3(-uTime * 0.05, uTime * 0.03, 0.0), 4);
      alpha = mix(alpha, clamp(alpha + (wisp - 0.5) * 0.5, 0.0, 1.0), detailFade);
    }

    vec3 nrm = normalize(vNormalW);
    float diffuse = max(dot(nrm, SUN_DIR), 0.0);
    vec3 color = vec3(1.0) * (0.4 + diffuse * 0.7);

    gl_FragColor = vec4(color, alpha * 0.8);
    ${TONE_OUTPUT_GLSL}
  }
`

export type Planet = {
  group: THREE.Group
  update(dt: number, elapsed: number): void
  dispose(): void
}

export function createPlanetMint(radius: number, earthTex: THREE.Texture, lowPower = false): Planet {
  const group = new THREE.Group()
  group.name = 'planet-mint'

  const [wSeg, hSeg] = lowPower ? [96, 64] : [128, 96]
  const geo = new THREE.SphereGeometry(radius, wSeg, hSeg)
  const mat = new THREE.ShaderMaterial({
    uniforms: { uEarthTex: { value: earthTex }, uRadius: { value: radius } },
    vertexShader: PLANET_VERT,
    fragmentShader: FRAG,
  })
  const mesh = new THREE.Mesh(geo, mat)
  group.add(mesh)

  const cloudGeo = new THREE.SphereGeometry(radius * 1.025, lowPower ? 64 : 84, lowPower ? 44 : 60)
  const cloudMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uRadius: { value: radius } },
    vertexShader: CLOUD_VERT,
    fragmentShader: CLOUD_FRAG,
    transparent: true,
    depthWrite: false,
  })
  const clouds = new THREE.Mesh(cloudGeo, cloudMat)
  clouds.renderOrder = 2
  group.add(clouds)

  const rim = createAtmosphereRim(radius, 0xffd9a0, { power: 2.3, intensity: 1.25 })
  group.add(rim.mesh)

  const ROTATION_SPEED = 0.018
  const CLOUD_SPEED = 0.026

  return {
    group,
    update(dt) {
      mesh.rotation.y += dt * ROTATION_SPEED
      clouds.rotation.y += dt * CLOUD_SPEED
      cloudMat.uniforms.uTime.value += dt
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      cloudGeo.dispose()
      cloudMat.dispose()
      rim.dispose()
    },
  }
}
