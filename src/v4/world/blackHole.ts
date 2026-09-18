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
 *     Far-side Euclidean continuation (Saturn hoop behind the hole) is
 *     faded in the disk plane toward the camera, not by a world-space
 *     hemisphere discard (that cut a chord / chopped the offset-camera
 *     arm). Far-side light is the analytical polar arcs on the impostor.
 *     Radiance fades to 0 before DISK_OUTER; the mesh continues to
 *     DISK_GEO_OUTER as a guard band.
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
 *  5. Additive lensing IMPOSTOR (RO 7) — camera-facing quad, coverage only.
 *     Per-pixel rays come from camera basis + gl_FragCoord, NEVER from
 *     interpolated vWorldPos on a tessellated sphere (that filled triangles
 *     — the hard-block "łopaty"). Interior of the apparent shadow is
 *     discarded. Additive, depthTest on, no gl_FragDepth, no opaque core.
 *     Quad edge sits outside the influence radius; alpha hits 0 before it.
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
/** Sky-warp amplitude. Analytical, not a marched geodesic. */
const BEND_K = 0.94
/** High/low sample counts for the far-side radial integral (not a march). */
const ARC_SAMPLES_HIGH = 4
const ARC_SAMPLES_LOW = 2
/** Influence radius of the camera-facing impostor. Photon ring + local sky
 * warp live inside this; the Euclidean disk is larger and is a separate mesh.
 * Geometry is a quad of half-size INFLUENCE — edge is outside the falloff. */
const LENS_INFLUENCE_R = APPARENT_SHADOW_R * 1.78
/** Keep the exported radius name so debug probes do not break. */
const LENS_SHELL_R = LENS_INFLUENCE_R

/** Polar-periodic disk noise: never feed linear atan() into value noise.
 * Domain is (radius, cos(θ−ωt), sin(θ−ωt)) so fbm is C∞ in angle. */
const DISK_PERIODIC_GLSL = /* glsl */ `
  vec2 diskSpun(float cu, float cv, float rad, float omega, float time) {
    vec2 dir = vec2(cu, cv) / max(rad, 1.0e-4);
    float ca = cos(time * omega);
    float sa = sin(time * omega);
    return vec2(dir.x * ca + dir.y * sa, -dir.x * sa + dir.y * ca);
  }
`

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
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
  uniform float uInfluenceR;
  uniform vec3 uDiskU;
  uniform vec3 uDiskV;
  uniform vec3 uDiskN;
  uniform float uTime;
  uniform float uBendK;
  uniform int uArcSamples;
  uniform sampler2D uSky;
  uniform float uSkyRot;
  uniform vec3 uCamPos;
  uniform vec3 uCamRight;
  uniform vec3 uCamUp;
  uniform vec3 uCamFwd;
  uniform vec2 uResolution;
  uniform float uTanHalfFov;
  uniform float uAspect;

  varying vec2 vUv;

  ${NOISE_GLSL}
  ${DISK_PERIODIC_GLSL}

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
    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    vec2 spun = diskSpun(cu, cv, rad, omega, uTime);
    float streak = fbm3(vec3(rad * 0.08, spun * 3.4), 5);
    float streak2 = fbm3(vec3(rad * 0.18, spun * 6.2), 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec2 dir = vec2(cu, cv) / max(rad, 1.0e-4);
    vec3 tangent = normalize(-dir.y * uDiskU + dir.x * uDiskV);
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

  vec3 cameraRay() {
    vec2 ndc = (gl_FragCoord.xy / max(uResolution, vec2(1.0))) * 2.0 - 1.0;
    return normalize(
      uCamFwd
      + ndc.x * uTanHalfFov * uAspect * uCamRight
      + ndc.y * uTanHalfFov * uCamUp
    );
  }

  void main() {
    vec2 q = vUv * 2.0 - 1.0;
    float qR = length(q);
    if (qR > 0.98) discard;
    float qFade = 1.0 - smoothstep(0.84, 0.96, qR);

    vec3 rd = cameraRay();
    vec3 w0 = uCamPos - uBHPos;

    float b2 = dot(w0, w0) - pow(dot(w0, rd), 2.0);
    float b = sqrt(max(b2, 0.0));

    // Apparent shadow interior: additive never paints the core.
    if (b < uShadowR * 0.995) discard;
    if (b > uInfluenceR * 0.92) discard;

    float inflFade = 1.0 - smoothstep(uInfluenceR * 0.70, uInfluenceR * 0.88, b);

    vec3 peri = w0 - rd * dot(w0, rd);
    float periLen = length(peri);
    vec3 periN = periLen > 1e-4 ? peri / periLen : uDiskN;
    float polar = abs(dot(periN, uDiskN));

    vec3 inPlane = peri - uDiskN * dot(peri, uDiskN);
    vec3 camPlane = w0 - uDiskN * dot(w0, uDiskN);
    vec3 az = length(inPlane) > 1e-3
      ? normalize(inPlane)
      : (length(camPlane) > 1e-3 ? normalize(camPlane) : uDiskU);
    vec3 farAz = az;
    if (dot(farAz, w0) > 0.0) farAz = -farAz;

    vec3 tangent = normalize(cross(uDiskN, az));
    float approach = dot(tangent, -rd);

    vec3 accum = vec3(0.0);

    // Thin photon rim around the whole silhouette — not a decorative hoop.
    float rim = exp(-pow((b - uPhotonR) / uPhotonWidth, 2.0));
    rim *= mix(0.28, 1.0, smoothstep(-0.45, 0.45, approach));
    rim *= 0.62 + 0.38 * (1.0 - smoothstep(0.18, 0.82, polar));

    // Far-side Einstein arcs: Gaussian in impact-parameter (analytic, planar
    // coverage so this CAN be wider than a sphere-triangle without filling
    // fans) gated to high polar so it cannot become a gold ring.
    float polarCap = smoothstep(0.18, 0.56, polar);
    float limb = exp(-pow((b - uPhotonR) / (uPhotonWidth * 5.4), 2.0));
    float capW = polarCap * limb * inflFade;
    if (capW > 0.04) {
      float sampleW = capW * (1.15 / float(max(uArcSamples, 1)));
      for (int i = 0; i < 4; i++) {
        if (i >= uArcSamples) break;
        float tRad = 0.07 + float(i) * 0.14;
        vec3 farP = farAz * mix(uDiskInner, uDiskOuter, tRad);
        accum += shadeDiskCrossing(farP, rd, sampleW);
      }
    }

    // Local radial sky warp around the photon sphere. Signed (bent − unbent)
    // so it cannot stamp a halo. Falloff hits 0 before the impostor edge.
    float warpW = smoothstep(uShadowR * 1.002, uPhotonR * 1.05, b)
      * (1.0 - smoothstep(uPhotonR * 1.18, uInfluenceR * 0.82, b));
    if (warpW > 0.02) {
      float defl = uBendK * 0.20 * (uHorizonR / max(b, uPhotonR));
      vec3 bent = normalize(rd - periN * defl * warpW);
      accum += (sampleSky(bent) - sampleSky(rd)) * warpW * 0.62;
    }

    vec3 color = (accum + vec3(1.0, 0.969, 0.91) * rim * 0.40) * qFade * inflFade;
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
  uniform float uHideFar;
  uniform mat4 uViewProj;
  varying vec3 vWorldPos;

  ${NOISE_GLSL}
  ${DISK_PERIODIC_GLSL}

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
    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    vec2 spun = diskSpun(cu, cv, rad, omega, uTime);
    float streak = fbm3(vec3(rad * 0.055, spun * 3.4), 5);
    float streak2 = fbm3(vec3(rad * 0.14, spun * 6.2), 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec2 dir = vec2(cu, cv) / max(rad, 1.0e-4);
    vec3 tangent = normalize(-dir.y * uDiskU + dir.x * uDiskV);
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

    // Hide the Euclidean FAR half of the ring (Saturn continuation behind
    // the hole) so analytical polar arcs own that light. Split is in the
    // DISK PLANE toward the camera — not a world hemisphere (that chopped
    // the left arm when the camera was offset, and cut a chord in close
    // flight). Degenerate when looking face-on (top-down keeps the full ring).
    if (uHideFar > 0.5) {
      vec3 camRel = cameraPosition - uBHPos;
      float camDist = length(camRel);
      float faceOn = camDist > 1.0 ? abs(dot(camRel / camDist, uDiskN)) : 1.0;
      vec3 camInDisk = camRel - uDiskN * dot(camRel, uDiskN);
      float cil = length(camInDisk);
      // Face-on (top/down): keep the full ring. Edge-on: hide the Euclidean
      // far half so polar arcs own that light. Threshold is on camera vs
      // disk normal — in-plane leftover from a 7.5° tilt must not cut a
      // semicircle.
      if (faceOn < 0.68 && cil > uShadowR * 0.5) {
        float alongN = dot(rel, camInDisk / cil) / max(rad, 1.0);
        color *= smoothstep(-0.42, -0.04, alongN);
      }
    }

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

export function createBlackHole(
  skyTex: THREE.Texture,
  lowPower: boolean,
  renderer: THREE.WebGLRenderer,
): BlackHole {
  const tilt = THREE.MathUtils.degToRad(DISK_TILT_DEG)
  const diskN = new THREE.Vector3(0, Math.cos(tilt), Math.sin(tilt)).normalize()
  const diskU = new THREE.Vector3(1, 0, 0)
  const diskV = new THREE.Vector3().crossVectors(diskN, diskU).normalize()
  diskU.crossVectors(diskV, diskN).normalize()

  const lensGeo = new THREE.PlaneGeometry(2, 2)
  const lensMat = new THREE.ShaderMaterial({
    uniforms: {
      uBHPos: { value: BLACK_HOLE_POS.clone() },
      uHorizonR: { value: HORIZON_R },
      uShadowR: { value: APPARENT_SHADOW_R },
      uPhotonR: { value: PHOTON_RING_R },
      uPhotonWidth: { value: PHOTON_RING_WIDTH },
      uDiskInner: { value: DISK_INNER },
      uDiskOuter: { value: DISK_OUTER },
      uInfluenceR: { value: LENS_INFLUENCE_R },
      uDiskU: { value: diskU },
      uDiskV: { value: diskV },
      uDiskN: { value: diskN },
      uTime: { value: 0 },
      uBendK: { value: BEND_K },
      uArcSamples: { value: lowPower ? ARC_SAMPLES_LOW : ARC_SAMPLES_HIGH },
      uSky: { value: skyTex },
      uSkyRot: { value: 0 },
      uCamPos: { value: new THREE.Vector3() },
      uCamRight: { value: new THREE.Vector3() },
      uCamUp: { value: new THREE.Vector3() },
      uCamFwd: { value: new THREE.Vector3() },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTanHalfFov: { value: 1 },
      uAspect: { value: 1 },
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
  lensing.scale.setScalar(LENS_INFLUENCE_R)

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

  const diskGeo = new THREE.RingGeometry(DISK_INNER, DISK_GEO_OUTER, 192, 12)
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
      uHideFar: { value: 1 },
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
  const camRight = new THREE.Vector3()
  const camUp = new THREE.Vector3()
  const drawSize = new THREE.Vector2()

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
      camRight.set(1, 0, 0).applyQuaternion(camera.quaternion)
      camUp.set(0, 1, 0).applyQuaternion(camera.quaternion)
      const depth = rel.dot(camFwd)
      const camDist = rel.length()
      const tooClose = camDist < HORIZON_MESH_R + 4

      ;(lensMat.uniforms.uCamPos.value as THREE.Vector3).copy(camera.position)
      ;(lensMat.uniforms.uCamFwd.value as THREE.Vector3).copy(camFwd)
      ;(lensMat.uniforms.uCamRight.value as THREE.Vector3).copy(camRight)
      ;(lensMat.uniforms.uCamUp.value as THREE.Vector3).copy(camUp)
      lensMat.uniforms.uTanHalfFov.value = Math.tan(THREE.MathUtils.degToRad(camera.fov) * 0.5)
      lensMat.uniforms.uAspect.value = camera.aspect
      renderer.getDrawingBufferSize(drawSize)
      ;(lensMat.uniforms.uResolution.value as THREE.Vector2).copy(drawSize)

      // Billboard faces the camera. Coverage mesh only — lighting is per-pixel
      // from gl_FragCoord, so two triangles cannot fill fans.
      lensing.lookAt(camera.position)

      if (!lensing.userData.forceHidden) lensing.visible = !tooClose && depth > 4
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
      // Far-side Euclidean hide stays on in proxy mode: the split is in the
      // disk plane through the hole, so it does not board-cut the near half.
      diskMat.uniforms.uHideFar.value = 1
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
