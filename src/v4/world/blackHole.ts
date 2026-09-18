import * as THREE from 'three'
import { NOISE_GLSL, SKY_ROT_SPEED, TONE_OUTPUT_GLSL } from './shaderChunks'
import { BLACK_HOLE_HORIZON_R, BLACK_HOLE_POS } from '../engine/world-anchors'

/**
 * Black hole — 3D occlusion sphere + aperture seal + additive lensing + disk.
 *
 * Adapted (not ported) from the core ideas in
 * `src/v4/shaders/reference/raytracer.glsl` (oseiskar/black-hole, MIT license,
 * see public/v4/assets/ATTRIBUTION.md): a per-fragment ray from the camera is
 * marched past the hole using the standard Schwarzschild null-geodesic
 * central-force form  d²x/dλ² = -1.5·Rs·h²·x/r⁵  (h = |x×v| conserved per
 * ray, leapfrog integration).
 *
 * Compositing (proven, not a renderOrder-only hack):
 *  1. Opaque horizon sphere (RO 0, depthWrite ON) — real-Z vs the ship.
 *  2. Near-side disk — RingGeometry far away; ray-plane proxy sphere when
 *     the camera is inside the disk bounding sphere (a paper-thin ring
 *     would be sliced by the near plane into a straight board edge).
 *     NEVER discard the far hemisphere with dot(rel,toCam): that cut a
 *     wide disk in half through the hole. Far-side occultation is the
 *     shadow-sphere ray test only. Radiance fades to 0 before DISK_OUTER;
 *     the mesh continues to DISK_GEO_OUTER as a guard band.
 *  3. Transparent dust / starfield / meteors (RO 0–4, depthWrite OFF).
 *     Dust lives in a 180u box around the camera, so it ALWAYS passes the
 *     horizon depth test and paints streaks onto the silhouette. Starfield
 *     is a 1600u shell (behind the hole) and is mostly depth-rejected.
 *  4. Aperture SEAL (RO 6, transparent queue, depthTest LessEqual,
 *     depthWrite OFF, NormalBlending opacity 1, black). Overwrites any
 *     particle that lost to “absolutely black”, but FAILS where the ship
 *     (or disk) already wrote a closer depth. This is the mathematical
 *     occlusion test — renderOrder only picks the queue slot after dust
 *     and before additive lensing.
 *  5. Additive lensing shell (RO 7) — photon ring + far-side wrap. Interior
 *     of the apparent shadow is discarded (no sky, no polar fill).
 *
 * Radii: the visible mesh stays at physical Rs. Growing the black sphere
 * was rejected. Scale comes from a wide, optically thin disk.
 */

const PHYSICAL_RS = BLACK_HOLE_HORIZON_R
/** Visible silhouette = physical Rs. Do not inflate this to the GR 2.6× b_c. */
const APPARENT_SHADOW_R = PHYSICAL_RS
const HORIZON_R = PHYSICAL_RS
const HORIZON_MESH_R = APPARENT_SHADOW_R
/** Thin rim hugging the shadow — not a white hoop. */
const PHOTON_RING_R = APPARENT_SHADOW_R * 1.012
const PHOTON_RING_WIDTH = 0.92
/** Inner edge kisses the photon ring; no sky collar on the aperture. */
const DISK_INNER = APPARENT_SHADOW_R * 1.08
/** Wide disk: 3.05× shadow radius (band 2.6–3.4). Extends both sides of the hole. */
const DISK_OUTER = APPARENT_SHADOW_R * 3.05
/** Support mesh larger than the visible outer radius so the tessellated
 * rim is never in frame. Visible radiance hits 0 before this. */
const DISK_GEO_OUTER = DISK_OUTER * 1.38
/** Near edge-on from the equatorial launch camera — thin optical thickness. */
const DISK_TILT_DEG = 7.5
const MARCH_START_R = DISK_OUTER * 1.04
const BEND_K = 0.94
/** HARD CAP: the march loop below is `for (int i = 0; i < 48; i++)` — uSteps
 * must stay <= 47 or the step-budget early-out never fires. */
const STEPS_HIGH = 48
const STEPS_LOW = 24
/** Modest shell: limb wrap + photon ring. Must not fill the frame. */
const LENS_SHELL_R = APPARENT_SHADOW_R * 1.72

const VERT = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const FRAG = /* glsl */ `
  precision highp float;

  uniform vec3 uBHPos;
  uniform float uHorizonR;
  uniform float uShadowR;
  uniform float uPhotonR;
  uniform float uPhotonWidth;
  uniform float uDiskInner;
  uniform float uDiskOuter;
  uniform vec3 uDiskU;
  uniform vec3 uDiskV;
  uniform vec3 uDiskN;
  uniform float uTime;
  uniform float uBendK;
  uniform int uSteps;
  uniform float uMarchStartR;
  uniform sampler2D uSky;
  uniform float uSkyRot;

  varying vec3 vWorldPos;

  ${NOISE_GLSL}

  const float PI = 3.141592653589793;

  vec2 equirectUv(vec3 dir) {
    float u = atan(dir.z, dir.x) / (2.0 * PI) + 0.5;
    float v = asin(clamp(dir.y, -1.0, 1.0)) / PI + 0.5;
    return vec2(u, v);
  }

  vec3 sampleSky(vec3 dir) {
    vec3 d = normalize(dir);
    float c = cos(uSkyRot);
    float s = sin(uSkyRot);
    vec3 rd = vec3(c * d.x + s * d.z, d.y, -s * d.x + c * d.z);
    vec2 uvA = equirectUv(rd);
    vec2 uvB = vec2(fract(uvA.x + 0.5) - 0.5, uvA.y);
    return (fwidth(uvA.x) <= fwidth(uvB.x)
      ? texture2D(uSky, uvA).rgb
      : texture2D(uSky, uvB).rgb);
  }

  vec3 diskTemperatureColor(float t) {
    vec3 hot = vec3(1.0, 0.969, 0.91);
    vec3 amber = vec3(1.0, 0.784, 0.38);
    vec3 ember = vec3(0.91, 0.463, 0.102);
    vec3 c = mix(amber, ember, smoothstep(0.18, 0.82, t));
    c = mix(hot, c, smoothstep(0.0, 0.16, t));
    return c;
  }

  vec3 shadeDiskCrossing(vec3 crossP, vec3 d, float imageFalloff) {
    float cu = dot(crossP, uDiskU);
    float cv = dot(crossP, uDiskV);
    float rad = length(vec2(cu, cv));
    if (rad <= uDiskInner || rad >= uDiskOuter) return vec3(0.0);

    float tRad = (rad - uDiskInner) / (uDiskOuter - uDiskInner);
    float ang = atan(cv, cu);

    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    float flowAngle = ang - uTime * omega;
    vec2 flow = vec2(sin(flowAngle), cos(flowAngle));

    float streak = fbm2(vec2(rad * 0.08, ang * 0.55) + flow * 3.1, 5);
    float streak2 = fbm2(vec2(rad * 0.18, ang * 1.1) + flow * 5.8, 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec3 tangent = normalize(-sin(ang) * uDiskU + cos(ang) * uDiskV);
    float approach = dot(tangent, -d);
    float beam = mix(0.36, 1.58, smoothstep(-0.55, 0.55, approach));
    vec3 temp = diskTemperatureColor(tRad);
    temp = mix(temp * vec3(0.42, 0.55, 1.08), temp * vec3(1.18, 0.9, 0.62), smoothstep(-0.5, 0.5, approach));

    float bandA = smoothstep(0.0, 0.05, tRad) * (1.0 - smoothstep(0.12, 0.22, tRad));
    float bandB = smoothstep(0.18, 0.28, tRad) * (1.0 - smoothstep(0.38, 0.50, tRad));
    float bandC = smoothstep(0.42, 0.54, tRad) * (1.0 - smoothstep(0.66, 0.78, tRad));
    float bandD = smoothstep(0.72, 0.82, tRad) * (1.0 - smoothstep(0.92, 1.0, tRad));
    float bands = bandA * 1.05 + bandB * 0.82 + bandC * 0.62 + bandD * 0.42;
    float innerFade = smoothstep(0.0, 0.04, tRad);
    float outerFade = 1.0 - smoothstep(0.72, 0.98, tRad);
    float brightness = (0.22 + streakMix * 0.58) * beam * (0.22 + bands) * innerFade * outerFade;
    return temp * brightness * imageFalloff;
  }

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize(vWorldPos - ro);
    vec3 w0 = ro - uBHPos;

    float b2Early = dot(w0, w0) - pow(dot(w0, rd), 2.0);
    float closestREarly = sqrt(max(b2Early, 0.0));

    // Apparent shadow interior: zero emissive. Seal already painted black.
    // Photon ring lives just outside this cutoff.
    if (closestREarly < uShadowR * 0.995) discard;

    vec3 oc = w0;
    float bIsec = dot(oc, rd);
    float cIsec = dot(oc, oc) - uMarchStartR * uMarchStartR;
    float discIsec = bIsec * bIsec - cIsec;

    if (discIsec < 0.0) discard;

    float tEntry = -bIsec - sqrt(discIsec);
    vec3 p = (tEntry > 0.0 ? ro + rd * tEntry : ro) - uBHPos;
    vec3 d = rd;
    vec3 hvec = cross(p, d);
    float h2 = dot(hvec, hvec);
    float bendScale = 1.5 * uHorizonR * h2 * uBendK;

    vec3 accum = vec3(0.0);
    int diskHits = 0;

    for (int i = 0; i < 48; i++) {
      if (i >= uSteps) break;

      float r = length(p);

      if (r < uHorizonR) break;
      if (r > uMarchStartR * 1.02 && dot(d, p) > 0.0) break;

      float ds = clamp(r * 0.16, 0.45, 6.0);
      float r2 = r * r;
      vec3 accel = p * (-bendScale / (r2 * r2 * r));
      vec3 newD = d + accel * ds;

      vec3 prevP = p;
      p += newD * ds;
      d = newD;

      float prevZ = dot(prevP, uDiskN);
      float curZ = dot(p, uDiskN);
      if (diskHits < 3 && prevZ * curZ < 0.0) {
        float tt = prevZ / (prevZ - curZ);
        vec3 crossP = mix(prevP, p, tt);
        float cu = dot(crossP, uDiskU);
        float cv = dot(crossP, uDiskV);
        float rad = length(vec2(cu, cv));
        if (rad > uDiskInner && rad < uDiskOuter) {
          diskHits += 1;
          bool nearSide = dot(crossP, w0) > 0.0;
          if (!nearSide) {
            float imageFalloff = diskHits == 1 ? 0.95 : (diskHits == 2 ? 0.48 : 0.22);
            accum += shadeDiskCrossing(crossP, d, imageFalloff);
          }
        }
      }
    }

    vec3 peri = w0 - rd * dot(w0, rd);
    float periLen = length(peri);
    float polar = periLen > 1e-4 ? abs(dot(peri / periLen, uDiskN)) : 1.0;

    float rim = exp(-pow((closestREarly - uPhotonR) / uPhotonWidth, 2.0));
    // Side-on Doppler: approaching limb hotter, receding quieter. Polar
    // boosts the ring but never fills the interior (already discarded).
    vec3 az = periLen > 1e-4 ? normalize(peri - uDiskN * dot(peri, uDiskN)) : uDiskU;
    vec3 tangent = normalize(cross(uDiskN, az));
    float approach = dot(tangent, -rd);
    rim *= mix(0.28, 1.0, smoothstep(-0.45, 0.45, approach));
    rim *= 0.72 + 0.28 * (1.0 - smoothstep(0.15, 0.8, polar));

    // Far-side secondary image sitting ON the limb, above/below the shadow —
    // not a concentric hoop and not a fill inside the aperture.
    float polarCap = smoothstep(0.28, 0.7, polar);
    float limb = exp(-pow((closestREarly - uPhotonR) / (uPhotonWidth * 2.4), 2.0));
    float capW = polarCap * limb;
    if (capW > 0.05) {
      vec3 farP = az * (uDiskInner * 1.35);
      if (dot(farP, w0) > 0.0) farP = -farP;
      accum += shadeDiskCrossing(farP, d, capW * 0.7);
    }

    // Bent sky only in a polar annulus outside the shadow. Additive and
    // polar-gated so it cannot paint the aperture or a Saturn hoop.
    float warpW = polarCap
      * (1.0 - smoothstep(uPhotonR * 1.08, uPhotonR * 1.55, closestREarly))
      * smoothstep(uShadowR * 0.995, uPhotonR, closestREarly);
    if (warpW > 0.02) {
      accum += sampleSky(d) * warpW * 0.42;
    }

    vec3 color = accum + vec3(1.0, 0.969, 0.91) * rim * 0.48;
    if (dot(color, vec3(0.3, 0.55, 0.15)) < 0.01) discard;

    gl_FragColor = vec4(color, 1.0);
    ${TONE_OUTPUT_GLSL}
  }
`

const DISK_VERT = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const DISK_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uBHPos;
  uniform float uDiskInner;
  uniform float uDiskOuter;
  uniform float uShadowR;
  uniform vec3 uDiskU;
  uniform vec3 uDiskV;
  uniform vec3 uDiskN;
  uniform float uTime;
  uniform float uCamNear;
  uniform float uRayPlane;
  uniform mat4 uViewProj;
  varying vec3 vWorldPos;

  ${NOISE_GLSL}

  vec3 diskTemperatureColor(float t) {
    vec3 hot = vec3(0.99, 0.94, 0.84);
    vec3 amber = vec3(0.94, 0.66, 0.28);
    vec3 ember = vec3(0.62, 0.28, 0.08);
    vec3 c = mix(amber, ember, smoothstep(0.18, 0.8, t));
    c = mix(hot, c, smoothstep(0.0, 0.14, t));
    return c;
  }

  vec3 shadeDiskHit(vec3 hit, vec3 rd) {
    vec3 rel = hit - uBHPos;
    float cu = dot(rel, uDiskU);
    float cv = dot(rel, uDiskV);
    float rad = length(vec2(cu, cv));
    if (rad <= uDiskInner || rad >= uDiskOuter) return vec3(0.0);

    float tRad = (rad - uDiskInner) / (uDiskOuter - uDiskInner);
    float ang = atan(cv, cu);
    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    float flowAngle = ang - uTime * omega;
    vec2 flow = vec2(sin(flowAngle), cos(flowAngle));
    float streak = fbm2(vec2(rad * 0.055, ang * 0.55) + flow * 3.1, 5);
    float streak2 = fbm2(vec2(rad * 0.14, ang * 1.1) + flow * 5.8, 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec3 tangent = normalize(-sin(ang) * uDiskU + cos(ang) * uDiskV);
    float approach = dot(tangent, -rd);
    float beam = mix(0.36, 1.55, smoothstep(-0.55, 0.55, approach));
    vec3 temp = diskTemperatureColor(tRad);
    temp = mix(temp * vec3(0.4, 0.52, 1.06), temp * vec3(1.16, 0.88, 0.58), smoothstep(-0.5, 0.5, approach));

    float bandA = smoothstep(0.0, 0.05, tRad) * (1.0 - smoothstep(0.12, 0.22, tRad));
    float bandB = smoothstep(0.18, 0.28, tRad) * (1.0 - smoothstep(0.38, 0.50, tRad));
    float bandC = smoothstep(0.42, 0.54, tRad) * (1.0 - smoothstep(0.66, 0.78, tRad));
    float bandD = smoothstep(0.72, 0.82, tRad) * (1.0 - smoothstep(0.92, 1.0, tRad));
    float bands = bandA * 1.05 + bandB * 0.82 + bandC * 0.62 + bandD * 0.42;
    float innerFade = smoothstep(0.0, 0.04, tRad);
    // Radiance dies before the visible outer radius; the mesh continues to
    // DISK_GEO_OUTER so a tessellated rim cannot appear as a hard board edge.
    float outerFade = 1.0 - smoothstep(0.72, 0.98, tRad);
    float brightness = (0.2 + streakMix * 0.6) * beam * (0.24 + bands) * innerFade * outerFade;
    return temp * brightness;
  }

  void main() {
    vec3 rd = normalize(vWorldPos - cameraPosition);
    vec3 hit;
    float tHit;

    if (uRayPlane > 0.5) {
      // Proxy sphere: intersect the disk plane along this ray so a camera
      // sitting inside the disk radius cannot near-clip a paper-thin ring.
      float denom = dot(rd, uDiskN);
      if (abs(denom) < 1.0e-5) discard;
      tHit = dot(uBHPos - cameraPosition, uDiskN) / denom;
      if (tHit < uCamNear * 1.8) discard;
      hit = cameraPosition + rd * tHit;
    } else {
      hit = vWorldPos;
      tHit = length(vWorldPos - cameraPosition);
    }

    vec3 rel = hit - uBHPos;
    float cu = dot(rel, uDiskU);
    float cv = dot(rel, uDiskV);
    float rad = length(vec2(cu, cv));
    if (rad <= uDiskInner || rad >= uDiskOuter) discard;

    vec3 oc = cameraPosition - uBHPos;
    float bOc = dot(oc, rd);
    float cOc = dot(oc, oc) - uShadowR * uShadowR;
    float discOc = bOc * bOc - cOc;
    if (discOc > 0.0) {
      float tSph = -bOc - sqrt(discOc);
      if (tSph < 0.0) tSph = -bOc + sqrt(discOc);
      if (tSph > 0.02 && tSph < tHit - 0.02) discard;
    }

    float nearFade = smoothstep(uCamNear * 3.0, uCamNear * 14.0, tHit);
    vec3 color = shadeDiskHit(hit, rd) * nearFade;
    if (dot(color, vec3(0.3, 0.55, 0.15)) < 0.008) discard;

    gl_FragColor = vec4(color, 1.0);
    ${TONE_OUTPUT_GLSL}

    if (uRayPlane > 0.5) {
      vec4 clipHit = uViewProj * vec4(hit, 1.0);
      gl_FragDepth = clipHit.z / clipHit.w * 0.5 + 0.5;
    } else {
      gl_FragDepth = gl_FragCoord.z;
    }
  }
`

export type BlackHoleLayer = 'horizon' | 'lensing' | 'disk' | 'seal'

export type BlackHoleLayerState = {
  name: string
  visible: boolean
  renderOrder: number
  depthTest: boolean
  depthWrite: boolean
  transparent: boolean
  blending: number
  side: number
}

export type BlackHoleRadii = {
  physicalRs: number
  apparentShadow: number
  photonRing: number
  diskInner: number
  diskOuter: number
  diskGeoOuter: number
  lensShell: number
}

export type BlackHoleDiskFrame = {
  u: THREE.Vector3
  v: THREE.Vector3
  n: THREE.Vector3
  inner: number
  outer: number
}

export type BlackHole = {
  object: THREE.Group
  update(dt: number, elapsed: number, camera: THREE.PerspectiveCamera): void
  setLayerVisible(layer: BlackHoleLayer, visible: boolean): void
  getLayerState(): Record<BlackHoleLayer, BlackHoleLayerState>
  getRadii(): BlackHoleRadii
  getDiskFrame(): BlackHoleDiskFrame
  setDebugBounds(on: boolean): void
  dispose(): void
}

function layerState(mesh: THREE.Mesh, name: string): BlackHoleLayerState {
  const mat = mesh.material as THREE.Material
  return {
    name,
    visible: mesh.visible,
    renderOrder: mesh.renderOrder,
    depthTest: mat.depthTest,
    depthWrite: mat.depthWrite,
    transparent: mat.transparent,
    blending: mat.blending,
    side: mat.side,
  }
}

export function createBlackHole(skyTex: THREE.Texture, lowPower: boolean): BlackHole {
  const tilt = THREE.MathUtils.degToRad(DISK_TILT_DEG)
  const diskN = new THREE.Vector3(0, Math.cos(tilt), Math.sin(tilt)).normalize()
  const diskU = new THREE.Vector3(1, 0, 0)
  const diskV = new THREE.Vector3().crossVectors(diskN, diskU).normalize()
  diskU.crossVectors(diskV, diskN).normalize()

  const lensGeo = new THREE.SphereGeometry(LENS_SHELL_R, 64, 48)
  const lensMat = new THREE.ShaderMaterial({
    uniforms: {
      uBHPos: { value: BLACK_HOLE_POS.clone() },
      uHorizonR: { value: HORIZON_R },
      uShadowR: { value: APPARENT_SHADOW_R },
      uPhotonR: { value: PHOTON_RING_R },
      uPhotonWidth: { value: PHOTON_RING_WIDTH },
      uDiskInner: { value: DISK_INNER },
      uDiskOuter: { value: DISK_OUTER },
      uDiskU: { value: diskU },
      uDiskV: { value: diskV },
      uDiskN: { value: diskN },
      uTime: { value: 0 },
      uBendK: { value: BEND_K },
      uSteps: { value: lowPower ? STEPS_LOW : STEPS_HIGH },
      uMarchStartR: { value: MARCH_START_R },
      uSky: { value: skyTex },
      uSkyRot: { value: 0 },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    depthTest: true,
    depthWrite: false,
    transparent: true,
    blending: THREE.AdditiveBlending,
    toneMapped: true,
    side: THREE.FrontSide,
  })

  const lensing = new THREE.Mesh(lensGeo, lensMat)
  lensing.frustumCulled = false
  // After the seal. Additive — cannot stamp black on a closer hull.
  lensing.renderOrder = 7
  lensing.name = 'black-hole-lensing'

  const horizonGeo = new THREE.SphereGeometry(HORIZON_MESH_R, 64, 48)
  const horizonMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    toneMapped: false,
    depthWrite: true,
    depthTest: true,
    transparent: false,
    fog: false,
  })
  horizonMat.colorWrite = true
  const horizon = new THREE.Mesh(horizonGeo, horizonMat)
  horizon.name = 'black-hole-horizon'
  horizon.renderOrder = 0
  horizon.frustumCulled = false

  // Post-particle seal: same sphere, transparent queue, depth-tested black.
  // Overwrites dust/starfield/meteors inside the silhouette; loses to the
  // ship wherever the hull wrote closer depth. depthWrite stays OFF so we
  // never restore the opaque-billboard stamp.
  const sealMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    toneMapped: false,
    depthTest: true,
    depthWrite: false,
    depthFunc: THREE.LessEqualDepth,
    transparent: true,
    opacity: 1,
    blending: THREE.NormalBlending,
    fog: false,
    side: THREE.FrontSide,
  })
  const seal = new THREE.Mesh(horizonGeo, sealMat)
  seal.name = 'black-hole-aperture-seal'
  seal.renderOrder = 6
  seal.frustumCulled = false

  const diskGeo = new THREE.RingGeometry(DISK_INNER, DISK_GEO_OUTER, 160, 10)
  const diskMat = new THREE.ShaderMaterial({
    uniforms: {
      uBHPos: { value: BLACK_HOLE_POS.clone() },
      uDiskInner: { value: DISK_INNER },
      uDiskOuter: { value: DISK_OUTER },
      uShadowR: { value: APPARENT_SHADOW_R },
      uDiskU: { value: diskU },
      uDiskV: { value: diskV },
      uDiskN: { value: diskN },
      uTime: { value: 0 },
      uCamNear: { value: 0.8 },
      uRayPlane: { value: 0 },
      uViewProj: { value: new THREE.Matrix4() },
    },
    vertexShader: DISK_VERT,
    fragmentShader: DISK_FRAG,
    depthTest: true,
    depthWrite: true,
    transparent: false,
    toneMapped: true,
    side: THREE.DoubleSide,
  })
  const diskMesh = new THREE.Mesh(diskGeo, diskMat)
  diskMesh.name = 'black-hole-disk'
  diskMesh.renderOrder = 1
  diskMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), diskN)
  diskMesh.frustumCulled = false

  // Bounding sphere for close-in flight: the paper-thin ring would cross the
  // camera near plane (straight knife edge). Ray-plane on this sphere keeps
  // rasterized faces away from the clip, with depth written at the real hit.
  const diskProxyGeo = new THREE.SphereGeometry(DISK_GEO_OUTER, 64, 48)
  const diskProxy = new THREE.Mesh(diskProxyGeo, diskMat)
  diskProxy.name = 'black-hole-disk-proxy'
  diskProxy.renderOrder = 1
  diskProxy.visible = false
  diskProxy.frustumCulled = false

  const root = new THREE.Group()
  root.name = 'black-hole'
  root.position.copy(BLACK_HOLE_POS)
  root.add(horizon)
  root.add(diskMesh)
  root.add(diskProxy)
  root.add(seal)
  root.add(lensing)

  const boundsGroup = new THREE.Group()
  boundsGroup.name = 'black-hole-debug-bounds'
  boundsGroup.visible = false
  const horizonHelper = new THREE.Mesh(
    new THREE.SphereGeometry(HORIZON_MESH_R, 32, 24),
    new THREE.MeshBasicMaterial({ color: 0x44ffcc, wireframe: true, depthTest: false, toneMapped: false }),
  )
  horizonHelper.name = 'black-hole-horizon-wire'
  const axes = new THREE.AxesHelper(HORIZON_MESH_R * 1.6)
  axes.name = 'black-hole-axes'
  boundsGroup.add(horizonHelper)
  boundsGroup.add(axes)
  root.add(boundsGroup)

  const rel = new THREE.Vector3()
  const camFwd = new THREE.Vector3()

  return {
    object: root,
    update(_dt, elapsed, camera) {
      lensMat.uniforms.uTime.value = elapsed
      lensMat.uniforms.uSkyRot.value = elapsed * SKY_ROT_SPEED
      camera.updateMatrixWorld()
      diskMat.uniforms.uTime.value = elapsed
      diskMat.uniforms.uCamNear.value = camera.near
      ;(diskMat.uniforms.uViewProj.value as THREE.Matrix4).multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse,
      )

      rel.copy(BLACK_HOLE_POS).sub(camera.position)
      camFwd.set(0, 0, -1).applyQuaternion(camera.quaternion)
      const depth = rel.dot(camFwd)
      const camDist = rel.length()
      const tooClose = camDist < HORIZON_MESH_R + 4
      const shellAroundCam = depth < LENS_SHELL_R + 8 || camDist < LENS_SHELL_R + 4
      if (!lensing.userData.forceHidden) lensing.visible = !shellAroundCam
      if (!seal.userData.forceHidden) seal.visible = !tooClose

      const diskHidden = Boolean(diskMesh.userData.forceHidden)
      // Camera inside the disk bounding sphere ⇒ ring triangles can cross the
      // near plane. Switch to the ray-plane proxy (BackSide if we're inside).
      const diskClipRisk = camDist < DISK_GEO_OUTER + 16
      if (diskHidden) {
        diskMesh.visible = false
        diskProxy.visible = false
      } else if (diskClipRisk) {
        diskMat.uniforms.uRayPlane.value = 1
        diskMesh.visible = false
        diskProxy.visible = true
        diskMat.side = camDist < DISK_GEO_OUTER - 1 ? THREE.BackSide : THREE.FrontSide
      } else {
        diskMat.uniforms.uRayPlane.value = 0
        diskMesh.visible = true
        diskProxy.visible = false
        diskMat.side = THREE.DoubleSide
      }
    },
    setLayerVisible(layer, visible) {
      if (layer === 'horizon') {
        horizon.visible = visible
        if (!seal.userData.forceHidden) seal.visible = visible
      } else if (layer === 'lensing') {
        lensing.userData.forceHidden = !visible
        lensing.visible = visible
      } else if (layer === 'seal') {
        seal.userData.forceHidden = !visible
        seal.visible = visible
      } else {
        diskMesh.userData.forceHidden = !visible
        diskMesh.visible = visible
        diskProxy.visible = false
      }
    },
    getLayerState() {
      return {
        horizon: layerState(horizon, horizon.name),
        seal: layerState(seal, seal.name),
        lensing: layerState(lensing, lensing.name),
        disk: layerState(diskMesh, diskMesh.name),
      }
    },
    getRadii() {
      return {
        physicalRs: PHYSICAL_RS,
        apparentShadow: APPARENT_SHADOW_R,
        photonRing: PHOTON_RING_R,
        diskInner: DISK_INNER,
        diskOuter: DISK_OUTER,
        diskGeoOuter: DISK_GEO_OUTER,
        lensShell: LENS_SHELL_R,
      }
    },
    getDiskFrame() {
      return {
        u: diskU.clone(),
        v: diskV.clone(),
        n: diskN.clone(),
        inner: DISK_INNER,
        outer: DISK_OUTER,
      }
    },
    setDebugBounds(on) {
      boundsGroup.visible = on
    },
    dispose() {
      lensGeo.dispose()
      lensMat.dispose()
      horizonGeo.dispose()
      horizonMat.dispose()
      sealMat.dispose()
      diskGeo.dispose()
      diskProxyGeo.dispose()
      diskMat.dispose()
      horizonHelper.geometry.dispose()
      ;(horizonHelper.material as THREE.Material).dispose()
      axes.geometry.dispose()
      ;(axes.material as THREE.Material).dispose()
    },
  }
}
