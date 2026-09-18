import * as THREE from 'three'
import { NOISE_GLSL, TONE_OUTPUT_GLSL } from './shaderChunks'
import { BLACK_HOLE_HORIZON_R, BLACK_HOLE_POS } from '../engine/world-anchors'

/**
 * Black hole — 3D occlusion sphere + additive lensing shell + near-side disk.
 *
 * Adapted (not ported) from the core ideas in
 * `src/v4/shaders/reference/raytracer.glsl` (oseiskar/black-hole, MIT license,
 * see public/v4/assets/ATTRIBUTION.md): a per-fragment ray from the camera is
 * marched past the hole using the standard Schwarzschild null-geodesic
 * central-force form  d²x/dλ² = -1.5·Rs·h²·x/r⁵  (h = |x×v| conserved per
 * ray, leapfrog integration).
 *
 * P0-C compositing: the opaque black aperture is ONLY the 3D horizon sphere
 * (real mesh depth). A camera-facing impostor that painted sealed-core black
 * with custom gl_FragDepth stamped over the ship along any screen overlap —
 * even when the hull was closer than Rs. Lensing (photon ring + far-side
 * disk wrap) lives on a slightly larger sphere shell: additive, no opaque
 * black, no gl_FragDepth, depthTest against the hull.
 */

const HORIZON_R = BLACK_HOLE_HORIZON_R
const HORIZON_MESH_R = BLACK_HOLE_HORIZON_R
/** Thin rim hugging the silhouette — not a second decorative hoop. */
const PHOTON_RING_R = BLACK_HOLE_HORIZON_R * 1.012
const PHOTON_RING_WIDTH = 1.55
/** Inner edge kisses the shadow so the aperture is filled (gap < 2u). */
const DISK_INNER = BLACK_HOLE_HORIZON_R * 1.018
/** Thin but wide enough for two temperature bands — not a Saturn plate. */
const DISK_OUTER = BLACK_HOLE_HORIZON_R * 1.26
/** Degrees from a face-on XZ disk. Launch camera is near-equatorial, so a
 * modest tilt keeps a thin crescent + over-pole wrap instead of a Saturn hoop. */
const DISK_TILT_DEG = 12
const MARCH_START_R = DISK_OUTER * 1.18
const BEND_K = 0.94
/** HARD CAP: the march loop below is `for (int i = 0; i < 48; i++)` — uSteps
 * must stay <= 47 or the step-budget early-out never fires. */
const STEPS_HIGH = 48
const STEPS_LOW = 24
/** Shell sits just outside the photon rim so additive light can cover the
 * limb + a sliver of over-pole wrap without a giant billboard. */
const LENS_SHELL_R = DISK_OUTER * 1.06

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

  varying vec3 vWorldPos;

  ${NOISE_GLSL}

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

    float bandA = smoothstep(0.0, 0.1, tRad) * (1.0 - smoothstep(0.26, 0.46, tRad));
    float bandB = smoothstep(0.4, 0.56, tRad) * (1.0 - smoothstep(0.78, 1.0, tRad));
    float bands = bandA + bandB * 0.7;
    float innerFade = smoothstep(0.0, 0.07, tRad);
    float outerFade = 1.0 - smoothstep(0.84, 1.0, tRad);
    float brightness = (0.22 + streakMix * 0.58) * beam * (0.28 + bands) * innerFade * outerFade;
    return temp * brightness * imageFalloff;
  }

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize(vWorldPos - ro);
    vec3 w0 = ro - uBHPos;

    float b2Early = dot(w0, w0) - pow(dot(w0, rd), 2.0);
    float closestREarly = sqrt(max(b2Early, 0.0));

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
      if (diskHits < 2 && prevZ * curZ < 0.0) {
        float tt = prevZ / (prevZ - curZ);
        vec3 crossP = mix(prevP, p, tt);
        float cu = dot(crossP, uDiskU);
        float cv = dot(crossP, uDiskV);
        float rad = length(vec2(cu, cv));
        if (rad > uDiskInner && rad < uDiskOuter) {
          diskHits += 1;
          bool nearSide = dot(crossP, w0) > 0.0;
          if (!nearSide) {
            float imageFalloff = diskHits == 1 ? 0.95 : 0.42;
            accum += shadeDiskCrossing(crossP, d, imageFalloff);
          }
        }
      }
    }

    vec3 peri = w0 - rd * dot(w0, rd);
    float periLen = length(peri);
    float polar = periLen > 1e-4 ? abs(dot(peri / periLen, uDiskN)) : 1.0;
    // Continuous photon ring at the shadow limb — polar only boosts, never
    // kills, or the rim collapses to a Saturn scratch.
    float rim = exp(-pow((closestREarly - uPhotonR) / uPhotonWidth, 2.0));
    rim *= 0.78 + 0.22 * (1.0 - smoothstep(0.2, 0.85, polar));

    // Far-side secondary image: a polar cap at the limb, not a concentric hoop.
    // Rays skimming the shadow off the disk plane pick up the far disk.
    float polarCap = smoothstep(0.32, 0.72, polar);
    float limb = exp(-pow((closestREarly - uPhotonR) / (uPhotonWidth * 2.6), 2.0));
    float capW = polarCap * limb;
    if (capW > 0.04) {
      vec3 az = periLen > 1e-4 ? normalize(peri - uDiskN * dot(peri, uDiskN)) : uDiskU;
      vec3 farP = az * (uDiskInner * 1.1);
      if (dot(farP, w0) > 0.0) farP = -farP;
      accum += shadeDiskCrossing(farP, d, capW * 0.95);
    }

    vec3 color = accum + vec3(1.0, 0.969, 0.91) * rim * 0.62;
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
  uniform float uHorizonR;
  uniform vec3 uDiskU;
  uniform vec3 uDiskV;
  uniform float uTime;
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

  void main() {
    vec3 rel = vWorldPos - uBHPos;
    float cu = dot(rel, uDiskU);
    float cv = dot(rel, uDiskV);
    float rad = length(vec2(cu, cv));
    if (rad <= uDiskInner || rad >= uDiskOuter) discard;

    float tRad = (rad - uDiskInner) / (uDiskOuter - uDiskInner);
    float ang = atan(cv, cu);
    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    float flowAngle = ang - uTime * omega;
    vec2 flow = vec2(sin(flowAngle), cos(flowAngle));
    float streak = fbm2(vec2(rad * 0.08, ang * 0.55) + flow * 3.1, 5);
    float streak2 = fbm2(vec2(rad * 0.18, ang * 1.1) + flow * 5.8, 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec3 rd = normalize(vWorldPos - cameraPosition);
    vec3 toCam = cameraPosition - uBHPos;
    if (dot(rel, toCam) < 0.0) discard;

    vec3 oc = cameraPosition - uBHPos;
    float bOc = dot(oc, rd);
    float cOc = dot(oc, oc) - uHorizonR * uHorizonR;
    float discOc = bOc * bOc - cOc;
    if (discOc > 0.0) {
      float tSph = -bOc - sqrt(discOc);
      if (tSph < 0.0) tSph = -bOc + sqrt(discOc);
      float tFrag = length(vWorldPos - cameraPosition);
      if (tSph > 0.02 && tSph < tFrag - 0.02) discard;
    }

    vec3 tangent = normalize(-sin(ang) * uDiskU + cos(ang) * uDiskV);
    float approach = dot(tangent, -rd);
    float beam = mix(0.36, 1.55, smoothstep(-0.55, 0.55, approach));
    vec3 temp = diskTemperatureColor(tRad);
    temp = mix(temp * vec3(0.4, 0.52, 1.06), temp * vec3(1.16, 0.88, 0.58), smoothstep(-0.5, 0.5, approach));

    float bandA = smoothstep(0.0, 0.08, tRad) * (1.0 - smoothstep(0.24, 0.44, tRad));
    float bandB = smoothstep(0.38, 0.54, tRad) * (1.0 - smoothstep(0.76, 1.0, tRad));
    float bands = bandA + bandB * 0.68;
    float innerFade = smoothstep(0.0, 0.05, tRad);
    float outerFade = 1.0 - smoothstep(0.86, 1.0, tRad);
    float brightness = (0.2 + streakMix * 0.6) * beam * (0.3 + bands) * innerFade * outerFade;

    gl_FragColor = vec4(temp * brightness, 1.0);
    ${TONE_OUTPUT_GLSL}
  }
`

export type BlackHoleLayer = 'horizon' | 'lensing' | 'disk'

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

export type BlackHole = {
  object: THREE.Group
  update(dt: number, elapsed: number, camera: THREE.PerspectiveCamera): void
  setLayerVisible(layer: BlackHoleLayer, visible: boolean): void
  getLayerState(): Record<BlackHoleLayer, BlackHoleLayerState>
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

export function createBlackHole(_skyTex: THREE.Texture, lowPower: boolean): BlackHole {
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
  // After the opaque horizon and the 3D disk. Additive — cannot stamp black
  // on a closer hull because there is no opaque core and depthTest stays on.
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
  // Same bucket as the ship (0) so later-forced order cannot overlay a
  // closer hull. Real depth vs the ship is the only occlusion test.
  horizon.renderOrder = 0
  horizon.frustumCulled = false

  const diskGeo = new THREE.RingGeometry(DISK_INNER, DISK_OUTER, 128, 4)
  const diskMat = new THREE.ShaderMaterial({
    uniforms: {
      uBHPos: { value: BLACK_HOLE_POS.clone() },
      uDiskInner: { value: DISK_INNER },
      uDiskOuter: { value: DISK_OUTER },
      uHorizonR: { value: HORIZON_R },
      uDiskU: { value: diskU },
      uDiskV: { value: diskV },
      uTime: { value: 0 },
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

  const root = new THREE.Group()
  root.name = 'black-hole'
  root.position.copy(BLACK_HOLE_POS)
  root.add(horizon)
  root.add(diskMesh)
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
      diskMat.uniforms.uTime.value = elapsed

      rel.copy(BLACK_HOLE_POS).sub(camera.position)
      camFwd.set(0, 0, -1).applyQuaternion(camera.quaternion)
      const depth = rel.dot(camFwd)
      // Shell sitting around the camera (BH beside/behind, or camera inside
      // Rs) would depth-fight. Hide lensing; the sphere still occludes.
      if (depth < LENS_SHELL_R + 8 || rel.length() < LENS_SHELL_R + 4) {
        lensing.visible = false
        return
      }
      if (lensing.userData.forceHidden) return
      lensing.visible = true
    },
    setLayerVisible(layer, visible) {
      if (layer === 'horizon') horizon.visible = visible
      else if (layer === 'lensing') {
        lensing.userData.forceHidden = !visible
        lensing.visible = visible
      } else diskMesh.visible = visible
    },
    getLayerState() {
      return {
        horizon: layerState(horizon, horizon.name),
        lensing: layerState(lensing, lensing.name),
        disk: layerState(diskMesh, diskMesh.name),
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
      diskGeo.dispose()
      diskMat.dispose()
      horizonHelper.geometry.dispose()
      ;(horizonHelper.material as THREE.Material).dispose()
      axes.geometry.dispose()
      ;(axes.material as THREE.Material).dispose()
    },
  }
}
