import * as THREE from 'three'
import { NOISE_GLSL, PALETTE, TONE_OUTPUT_GLSL, createAtmosphereRim, mulberry32 } from './shaderChunks'

/**
 * Agentic OS — machine planet. Near-black metal sphere (real PBR reflections
 * via the scene's PMREM env, same technique as the ship hull in
 * ship/buildShip.ts) with a procedurally-generated circuit/greeble emissive
 * map (sparse amber traces + node dots — no text/logos, drawn once to a
 * CanvasTexture, same convention as buildShip.ts's engine-glow texture), plus
 * an orbiting agent-swarm shell: fine amber points flowing around a tilted
 * torus with curl-noise jitter, matching the v3 Agentic swarm's visual
 * language (EMBER -> AMBER -> BRIGHT, additive, fine grain — not blobs) via a
 * fresh, self-contained implementation.
 */

const SEED = 9001

function createCircuitTexture(seed: number): THREE.CanvasTexture {
  const w = 1024
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, w, h)

  const rng = mulberry32(seed)
  const traceCount = 52

  for (let i = 0; i < traceCount; i++) {
    let x = rng() * w
    let y = rng() * h
    ctx.beginPath()
    ctx.moveTo(x, y)
    const steps = 3 + Math.floor(rng() * 5)
    for (let s = 0; s < steps; s++) {
      const horizontal = rng() < 0.5
      const len = 18 + rng() * 65
      if (horizontal) x += (rng() < 0.5 ? -1 : 1) * len
      else y += (rng() < 0.5 ? -1 : 1) * len
      x = Math.max(3, Math.min(w - 3, x))
      y = Math.max(3, Math.min(h - 3, y))
      ctx.lineTo(x, y)
    }
    ctx.lineWidth = 1 + rng() * 1.2
    ctx.strokeStyle = `rgba(245, 165, 36, ${(0.5 + rng() * 0.5).toFixed(2)})`
    ctx.stroke()

    ctx.fillStyle = `rgba(255, 200, 97, ${(0.7 + rng() * 0.3).toFixed(2)})`
    const nodeSize = 2 + rng() * 2
    ctx.fillRect(x - nodeSize / 2, y - nodeSize / 2, nodeSize, nodeSize)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}

const SWARM_VERT = /* glsl */ `
  attribute float aTheta0;
  attribute float aPhi;
  attribute float aTubeFrac;
  attribute float aSpeed;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAlpha;

  uniform float uTime;
  uniform float uMajorR;
  uniform float uTubeR;
  uniform float uJitterAmp;
  uniform float uBasePx;

  varying vec3 vColor;
  varying float vAlpha;

  ${NOISE_GLSL}

  // Three decorrelated noise channels (fixed offsets) whose curl gives a
  // divergence-free-ish flow field — cheap "living shell" jitter, same
  // construction as src/v3/agenticSwarmScene.ts's curlNoise() but built on
  // this file's own value-noise primitive.
  float nX(vec3 p) { return vnoise3(p); }
  float nY(vec3 p) { return vnoise3(p + vec3(37.2, 91.1, 13.7)); }
  float nZ(vec3 p) { return vnoise3(p + vec3(-71.4, 5.3, 47.9)); }

  vec3 curlNoise(vec3 p) {
    float e = 0.12;
    float dFz_dy = (nZ(p + vec3(0.0, e, 0.0)) - nZ(p - vec3(0.0, e, 0.0))) / (2.0 * e);
    float dFy_dz = (nY(p + vec3(0.0, 0.0, e)) - nY(p - vec3(0.0, 0.0, e))) / (2.0 * e);
    float dFx_dz = (nX(p + vec3(0.0, 0.0, e)) - nX(p - vec3(0.0, 0.0, e))) / (2.0 * e);
    float dFz_dx = (nZ(p + vec3(e, 0.0, 0.0)) - nZ(p - vec3(e, 0.0, 0.0))) / (2.0 * e);
    float dFy_dx = (nY(p + vec3(e, 0.0, 0.0)) - nY(p - vec3(e, 0.0, 0.0))) / (2.0 * e);
    float dFx_dy = (nX(p + vec3(0.0, e, 0.0)) - nX(p - vec3(0.0, e, 0.0))) / (2.0 * e);
    return vec3(dFz_dy - dFy_dz, dFx_dz - dFz_dx, dFy_dx - dFx_dy);
  }

  void main() {
    float theta = aTheta0 + uTime * aSpeed;
    vec3 outward = vec3(cos(theta), 0.0, sin(theta));
    vec3 ringCenter = outward * uMajorR;
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 tubeOffset = (outward * cos(aPhi) + up * sin(aPhi)) * uTubeR * aTubeFrac;
    vec3 basePos = ringCenter + tubeOffset;

    vec3 jitter = curlNoise(basePos * 0.045 + uTime * 0.025) * uJitterAmp;
    vec3 finalPos = basePos + jitter;

    vColor = aColor;
    vAlpha = aAlpha;

    vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uBasePx * (420.0 / max(-mv.z, 1.0));
  }
`

const SWARM_FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    float alpha = smoothstep(1.0, 0.0, d);
    alpha = pow(alpha, 1.4);
    if (alpha < 0.02) discard;
    float a = alpha * vAlpha;
    gl_FragColor = vec4(vColor * a, a);
    ${TONE_OUTPUT_GLSL}
  }
`

export type Planet = {
  group: THREE.Group
  update(dt: number, elapsed: number): void
  dispose(): void
}

export function createPlanetAgentic(
  radius: number,
  envMap: THREE.Texture | null,
  lowPower: boolean,
  maxAnisotropy = 1,
): Planet {
  const group = new THREE.Group()
  group.name = 'planet-agentic'

  const circuitTex = createCircuitTexture(SEED)
  circuitTex.anisotropy = maxAnisotropy

  const [wSeg, hSeg] = lowPower ? [96, 64] : [128, 96]
  const geo = new THREE.SphereGeometry(radius, wSeg, hSeg)
  const mat = new THREE.MeshStandardMaterial({
    color: 0x1a1c24,
    metalness: 1,
    // 0.3 dawało z bliska przepalony biały blob specularu ze słońca
    // kierunkowego (z widocznym fasetażem siatki) — wyższa szorstkość go
    // gasi, odbicia env pozostają czytelne.
    roughness: 0.48,
    emissive: new THREE.Color(PALETTE.amber),
    emissiveMap: circuitTex,
    emissiveIntensity: 1.6,
    envMapIntensity: 0.9,
  })
  if (envMap) mat.envMap = envMap

  // Close-up detail: fine raised-panel micro-seams, faded in only near the
  // camera via onBeforeCompile (this is a stock MeshStandardMaterial for real
  // PBR metal reflections, so the detail octave is injected into its
  // generated shader rather than hand-rolled like the other three planets').
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRadius = { value: radius }
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\nuniform float uRadius;\nvarying vec3 vDetailDir;\nvarying vec3 vDetailWorldPos;\n${NOISE_GLSL}`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        {
          float camDist = length(cameraPosition - vDetailWorldPos);
          float detailFade = 1.0 - smoothstep(uRadius * 2.0, uRadius * 7.0, camDist);
          if (detailFade > 0.003) {
            float seamA = fbm3(vDetailDir * uRadius * 2.2, 3);
            float seam = smoothstep(0.46, 0.49, seamA) * (1.0 - smoothstep(0.5, 0.53, seamA));
            diffuseColor.rgb *= mix(1.0, 1.0 - seam * 0.45, detailFade);
            float panel = fbm3(vDetailDir * uRadius * 0.7 + 5.1, 3);
            diffuseColor.rgb *= mix(1.0, 0.9 + panel * 0.2, detailFade);
          }
        }`,
      )
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vDetailDir;\nvarying vec3 vDetailWorldPos;`)
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n  vDetailDir = normalize(position);\n  vDetailWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;',
      )
  }

  const mesh = new THREE.Mesh(geo, mat)
  group.add(mesh)

  const rim = createAtmosphereRim(radius, PALETTE.amber, { power: 2.9, intensity: 0.9 })
  group.add(rim.mesh)

  const COUNT = lowPower ? 8000 : 17000
  const majorR = radius * 2.3
  const tubeR = radius * 0.55
  const tilt = THREE.MathUtils.degToRad(25)

  const rng = mulberry32(SEED + 7)
  const theta0 = new Float32Array(COUNT)
  const phi = new Float32Array(COUNT)
  const tubeFrac = new Float32Array(COUNT)
  const speed = new Float32Array(COUNT)
  const colors = new Float32Array(COUNT * 3)
  const sizes = new Float32Array(COUNT)
  const alphas = new Float32Array(COUNT)

  const ember = new THREE.Color(PALETTE.amberDeep)
  const amber = new THREE.Color(PALETTE.amber)
  const hilite = new THREE.Color(PALETTE.amberBright)
  const tmpColor = new THREE.Color()

  for (let i = 0; i < COUNT; i++) {
    theta0[i] = rng() * Math.PI * 2
    phi[i] = rng() * Math.PI * 2
    const frac = 0.55 + Math.pow(rng(), 1.6) * 0.45
    tubeFrac[i] = frac
    speed[i] = 0.09 + rng() * 0.14

    const densityT = THREE.MathUtils.clamp((frac - 0.55) / 0.45, 0, 1)
    if (densityT > 0.6) tmpColor.copy(amber).lerp(hilite, (densityT - 0.6) / 0.4)
    else tmpColor.copy(ember).lerp(amber, densityT / 0.6)
    colors[i * 3] = tmpColor.r
    colors[i * 3 + 1] = tmpColor.g
    colors[i * 3 + 2] = tmpColor.b

    sizes[i] = 0.85 + rng() * 1.1
    alphas[i] = 0.5 + rng() * 0.48
  }

  const swarmGeo = new THREE.BufferGeometry()
  swarmGeo.setAttribute('aTheta0', new THREE.BufferAttribute(theta0, 1))
  swarmGeo.setAttribute('aPhi', new THREE.BufferAttribute(phi, 1))
  swarmGeo.setAttribute('aTubeFrac', new THREE.BufferAttribute(tubeFrac, 1))
  swarmGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1))
  swarmGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  swarmGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  swarmGeo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
  // Position attribute required by three's draw-range bookkeeping even though
  // the vertex shader recomputes the point position analytically every frame.
  swarmGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3))
  swarmGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), majorR + tubeR + 6)

  const swarmMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMajorR: { value: majorR },
      uTubeR: { value: tubeR },
      uJitterAmp: { value: radius * 0.12 },
      uBasePx: { value: 2.6 },
    },
    vertexShader: SWARM_VERT,
    fragmentShader: SWARM_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const swarm = new THREE.Points(swarmGeo, swarmMat)
  swarm.frustumCulled = false
  swarm.rotation.x = tilt
  swarm.renderOrder = 2
  group.add(swarm)

  const ROTATION_SPEED = 0.012

  return {
    group,
    update(dt, elapsed) {
      mesh.rotation.y += dt * ROTATION_SPEED
      swarmMat.uniforms.uTime.value = elapsed
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      circuitTex.dispose()
      rim.dispose()
      swarmGeo.dispose()
      swarmMat.dispose()
    },
  }
}
