import * as THREE from 'three'
import { NOISE_GLSL, SKY_ROT_SPEED, TONE_OUTPUT_GLSL } from './shaderChunks'
import { BLACK_HOLE_HORIZON_R, BLACK_HOLE_POS } from '../engine/world-anchors'

/**
 * Black hole — camera-facing impostor plane at BLACK_HOLE_POS.
 *
 * Adapted (not ported) from the core ideas in
 * `src/v4/shaders/reference/raytracer.glsl` (oseiskar/black-hole, MIT license,
 * see public/v4/assets/ATTRIBUTION.md): a per-fragment ray from the camera is
 * marched past the hole using the standard Schwarzschild null-geodesic
 * central-force form  d²x/dλ² = -1.5·Rs·h²·x/r⁵  (h = |x×v| conserved per
 * ray, leapfrog integration) — strong bending only very near the photon
 * sphere, negligible at disk radii.
 *
 * P0-B composition (cheap Schwarzschild minimum, not a full geodesic
 * raymarch): the 3D horizon sphere IS the apparent shadow and fills the
 * optical aperture — no sky collar between silhouette and disk. Impostor
 * never paints that core (a billboard stamp ate the ship). It only adds a
 * thin photon-ring rim + far-side disk wrap. Near-side annulus is a real
 * 3D ring with depth.
 */

/** Occlusion sphere = gameplay Rs. Slightly inside the photon rim so the
 * ring stays visible; large enough that the inner disk hole cannot show sky. */
const HORIZON_R = BLACK_HOLE_HORIZON_R
const HORIZON_MESH_R = BLACK_HOLE_HORIZON_R
/** Thin rim hugging the silhouette — not a second decorative hoop. */
const PHOTON_RING_R = BLACK_HOLE_HORIZON_R * 1.012
const PHOTON_RING_WIDTH = 1.35
/** Inner edge kisses the shadow so the aperture is filled (gap < 2u). */
const DISK_INNER = BLACK_HOLE_HORIZON_R * 1.018
/** Narrow radial span — a plate this wide reads as Saturn, not accretion. */
const DISK_OUTER = BLACK_HOLE_HORIZON_R * 1.14
/** Degrees from a face-on XZ disk. Launch camera sits near the equatorial
 * plane, so a modest tilt keeps a thin crescent instead of a Saturn hoop. */
const DISK_TILT_DEG = 22
/** Unit CircleGeometry — JS scales to the disk, not the whole frustum. */
const IMPOSTOR_GEO_R = 1
const MARCH_START_R = DISK_OUTER * 1.12
/** Fill to the inner disk so the aperture cannot show sky. Depth comes from
 * a ray-sphere hit at this radius — not a billboard stamp. */
const SHADOW_CAPTURE_R = DISK_INNER
const BEND_K = 0.94
/** HARD CAP: the march loop below is `for (int i = 0; i < 48; i++)` — uSteps
 * must stay <= 47 or the step-budget early-out never fires. */
const STEPS_HIGH = 48
const STEPS_LOW = 24

const VERT = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec2 vLocalXY;
  void main() {
    vLocalXY = position.xy;
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
  uniform sampler2D uSky;
  uniform float uBendK;
  uniform int uSteps;
  uniform float uHalfSize;
  uniform float uMarchStartR;
  uniform float uShadowCaptureR;
  uniform float uSkyRot;

  varying vec3 vWorldPos;
  varying vec2 vLocalXY;

  // Vertex-only built-in in three.js — needed here for ray-sphere gl_FragDepth.
  uniform mat4 projectionMatrix;

  #define PI 3.14159265359
  // Tight safety margin — catches step-budget leaks without swallowing the
  // thin outer lens rim.
  #define HORIZON_SAFETY_R (uHorizonR * 1.02)

  ${NOISE_GLSL}

  // Matches three.js's own equirectUv() convention (ShaderChunk/common.glsl.js)
  // so the lensed sample lines up seamlessly with the untouched skybox at the
  // edge of this impostor.
  vec2 equirectUv(vec3 dir) {
    float u = atan(dir.z, dir.x) / (2.0 * PI) + 0.5;
    float v = asin(clamp(dir.y, -1.0, 1.0)) / PI + 0.5;
    return vec2(u, v);
  }

  // Single sky-sampling entry point — applies the same slow yaw the engine
  // applies to scene.backgroundRotation, so the lensed view stays continuous
  // with the rotating skybox at the impostor edge.
  vec3 sampleSky(vec3 dir) {
    float c = cos(uSkyRot);
    float s = sin(uSkyRot);
    vec3 rd2 = vec3(c * dir.x + s * dir.z, dir.y, -s * dir.x + c * dir.z);
    // Seam-free equirect (identyczny trick jak w SKY_FRAG kopuły — patrz
    // core.ts): druga próbka z u przesuniętym o 0.5, wybór po mniejszym
    // fwidth. Wymaga wrapS = RepeatWrapping na uSky.
    vec2 uvA = equirectUv(rd2);
    vec2 uvB = vec2(fract(uvA.x + 0.5) - 0.5, uvA.y);
    return (fwidth(uvA.x) <= fwidth(uvB.x)
      ? texture2D(uSky, uvA, -0.75)
      : texture2D(uSky, uvB, -0.75)).rgb;
  }

  // Spec palette "temperature" gradient (not a physical black-body LUT):
  // white-gold core #fff7e8 -> warm amber mid #ffc861 -> deep ember outer
  // edge #e8761a — deliberately NOT oversaturated orange.
  vec3 diskTemperatureColor(float t) {
    vec3 hot = vec3(1.0, 0.969, 0.91);
    vec3 amber = vec3(1.0, 0.784, 0.38);
    vec3 ember = vec3(0.91, 0.463, 0.102);
    vec3 c = mix(amber, ember, smoothstep(0.18, 0.82, t));
    c = mix(hot, c, smoothstep(0.0, 0.16, t));
    return c;
  }

  // Shared disk-plane shading — used for lensed far-side crossings.
  vec3 shadeDiskCrossing(vec3 crossP, vec3 d, float imageFalloff) {
    float cu = dot(crossP, uDiskU);
    float cv = dot(crossP, uDiskV);
    float rad = length(vec2(cu, cv));
    if (rad <= uDiskInner || rad >= uDiskOuter) return vec3(0.0);

    float tRad = (rad - uDiskInner) / (uDiskOuter - uDiskInner);
    float ang = atan(cv, cu);

    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    float flowAngle = ang - uTime * omega;
    // Seam-free streaks: sin/cos of the wrap so atan2's 2π cut cannot draw
    // a radial gold scratch across the disk.
    vec2 flow = vec2(sin(flowAngle), cos(flowAngle));

    float streak = fbm2(vec2(rad * 0.08, ang * 0.55) + flow * 3.1, 5);
    float streak2 = fbm2(vec2(rad * 0.18, ang * 1.1) + flow * 5.8, 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec3 tangent = normalize(-sin(ang) * uDiskU + cos(ang) * uDiskV);
    float approach = dot(tangent, -d);
    float beam = mix(0.42, 1.35, smoothstep(-0.55, 0.55, approach));
    float innerFade = smoothstep(0.0, 0.08, tRad);
    float outerFade = 1.0 - smoothstep(0.2, 1.0, tRad);
    float brightness = 0.7 * beam * innerFade * outerFade;
    return vec3(0.98, 0.82, 0.48) * brightness * imageFalloff;
  }

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize(vWorldPos - ro);
    vec3 w0 = ro - uBHPos;

    // Unit-circle mesh, world radius = uHalfSize (set from JS scale).
    // Circular clip only — never a world-radius fade (that was the vertical knife).
    float billboardR = length(vLocalXY);
    if (billboardR > 0.992) discard;

    // Periapsis / impact parameter — single source of truth for the shadow cone.
    float b2Early = dot(w0, w0) - pow(dot(w0, rd), 2.0);
    float closestREarly = sqrt(max(b2Early, 0.0));
    // Apparent shadow fills to the inner disk. Painted black below with the
    // real sphere depth so a closer hull still wins the depth test.
    bool inCore = closestREarly < uShadowCaptureR;

    vec3 oc = w0;
    float bIsec = dot(oc, rd);
    float cIsec = dot(oc, oc) - uMarchStartR * uMarchStartR;
    float discIsec = bIsec * bIsec - cIsec;

    if (discIsec < 0.0) discard;

    float tEntry = -bIsec - sqrt(discIsec);
    // Work in hole-relative coordinates from here on — the geodesic term and
    // the disk tests only care about the offset from the singularity.
    vec3 p = (tEntry > 0.0 ? ro + rd * tEntry : ro) - uBHPos;
    vec3 d = rd;
    // Conserved specific angular momentum h = |x×v| of this ray — the
    // Schwarzschild null geodesic in central-force form bends with
    // a = -1.5·Rs·h²·x/r⁵ (leapfrog below). Impact parameter b = h for a
    // unit-speed ray, so h² also encodes how close this ray will pass.
    vec3 hvec = cross(p, d);
    float h2 = dot(hvec, hvec);
    float bendScale = 1.5 * uHorizonR * h2 * uBendK;

    vec3 accum = vec3(0.0);
    float minDist = 1.0e9;
    bool captured = false;
    int diskHits = 0;

    for (int i = 0; i < 48; i++) {
      if (i >= uSteps) break;

      float r = length(p);
      minDist = min(minDist, r);

      if (r < uHorizonR) {
        captured = true;
        break;
      }
      if (r > uMarchStartR * 1.02 && dot(d, p) > 0.0) break;

      // Finer steps deep in the strong field (photon-ring region needs them),
      // coarser out at disk radii where curvature is already tiny.
      float ds = clamp(r * 0.16, 0.45, 6.0);
      float r2 = r * r;
      vec3 accel = p * (-bendScale / (r2 * r2 * r));
      vec3 newD = d + accel * ds;

      vec3 prevP = p;
      p += newD * ds;
      d = newD;

      // Tilted accretion-disk plane crossing test (basis uDiskU/uDiskV/uDiskN),
      // run DURING bending so rays that pass above/below the hole can still
      // hit the far side of the disk behind it — that is what paints the
      // over-pole wrap. Capped at two hits; the near-side face is the 3D
      // ring mesh so we skip crossings on the camera hemisphere.
      float prevZ = dot(prevP, uDiskN);
      float curZ = dot(p, uDiskN);
      if (diskHits < 1 && prevZ * curZ < 0.0) {
        float tt = prevZ / (prevZ - curZ);
        vec3 crossP = mix(prevP, p, tt);
        float cu = dot(crossP, uDiskU);
        float cv = dot(crossP, uDiskV);
        float rad = length(vec2(cu, cv));
        if (rad > uDiskInner && rad < uDiskOuter) {
          diskHits += 1;
          bool nearSide = dot(crossP, w0) > 0.0;
          if (!nearSide) {
            float imageFalloff = diskHits == 1 ? 0.92 : 0.38;
            accum += shadeDiskCrossing(crossP, d, imageFalloff);
          }
        }
      }
    }

    // Safety net: a ray that exhausts its step budget deep in the strong
    // field (i.e. never resolved to a clean escape or capture) reads as
    // captured rather than leaking a stray bright/ambiguous sample.
    if (!captured && minDist < HORIZON_SAFETY_R) captured = true;

    // Near-side annulus is the 3D ring mesh. Impostor fills the apparent
    // shadow (no sky collar) and adds far-side wrap + a disk-plane rim —
    // never a decorative gold hoop, never a dim-core discard that leaks sky.
    bool sealed = inCore || captured;
    vec3 peri = w0 - rd * dot(w0, rd);
    float periLen = length(peri);
    float polar = periLen > 1e-4 ? abs(dot(peri / periLen, uDiskN)) : 1.0;
    float ring = exp(-pow((minDist - uPhotonR) / uPhotonWidth, 2.0));
    ring *= 1.0 - smoothstep(0.08, 0.38, polar);
    ring *= 1.0 / (1.0 + dot(accum, vec3(0.6)));

    vec3 color;
    if (sealed) {
      // Captured rays terminate at ~Rs, so march minDist cannot drive the
      // photon rim — it would paint the whole interior. Use the straight
      // impact parameter (closestREarly) so only the silhouette limb glows.
      float rim = exp(-pow((closestREarly - uPhotonR) / uPhotonWidth, 2.0));
      rim *= 1.0 - smoothstep(0.08, 0.38, polar);
      color = vec3(1.0, 0.969, 0.91) * rim * 0.16;
    } else {
      float rim = exp(-pow((closestREarly - uPhotonR) / uPhotonWidth, 2.0));
      rim *= 1.0 - smoothstep(0.08, 0.38, polar);
      if (rim < 0.05) discard;
      color = vec3(1.0, 0.969, 0.91) * rim * 0.16;
    }

    float Rshadow = uShadowCaptureR;
    float cShadow = dot(w0, w0) - Rshadow * Rshadow;
    float discShadow = bIsec * bIsec - cShadow;
    if (sealed && discShadow >= 0.0) {
      float tHit = -bIsec - sqrt(discShadow);
      if (tHit < 0.0) tHit = -bIsec + sqrt(discShadow);
      if (tHit > 0.0) {
        vec4 clip = projectionMatrix * viewMatrix * vec4(ro + rd * tHit, 1.0);
        gl_FragDepth = 0.5 * (clip.z / clip.w) + 0.5;
      }
    }

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
    // Far side of the hole is the impostor's lensed wrap — a full 3D ring
    // here is a Saturn hoop.
    vec3 toCam = cameraPosition - uBHPos;
    if (dot(rel, toCam) < 0.0) discard;

    // Horizon owns the silhouette — a near-edge-on ring would otherwise
    // stamp concentric rims across the shadow.
    vec3 rdOc = normalize(vWorldPos - cameraPosition);
    vec3 oc = cameraPosition - uBHPos;
    float bOc = dot(oc, rdOc);
    float cOc = dot(oc, oc) - uHorizonR * uHorizonR;
    float discOc = bOc * bOc - cOc;
    if (discOc > 0.0) {
      float tSph = -bOc - sqrt(discOc);
      if (tSph < 0.0) tSph = -bOc + sqrt(discOc);
      float tFrag = length(vWorldPos - cameraPosition);
      if (tSph > 0.02 && tSph < tFrag - 0.02) discard;
    }

    vec3 tangent = normalize(-sin(ang) * uDiskU + cos(ang) * uDiskV);
    float beam = mix(0.38, 1.48, smoothstep(-0.55, 0.55, dot(tangent, -rd)));
    float innerFade = smoothstep(0.0, 0.05, tRad);
    float outerFade = 1.0 - smoothstep(0.34, 1.0, tRad);
    float brightness = (0.24 + streakMix * 0.62) * beam * innerFade * outerFade;

    gl_FragColor = vec4(diskTemperatureColor(tRad) * brightness, 1.0);
    ${TONE_OUTPUT_GLSL}
  }
`

export type BlackHole = {
  object: THREE.Group
  update(dt: number, elapsed: number, camera: THREE.PerspectiveCamera): void
  dispose(): void
}

export function createBlackHole(skyTex: THREE.Texture, lowPower: boolean): BlackHole {
  const tilt = THREE.MathUtils.degToRad(DISK_TILT_DEG)
  const diskN = new THREE.Vector3(0, Math.cos(tilt), Math.sin(tilt)).normalize()
  const diskU = new THREE.Vector3(1, 0, 0)
  const diskV = new THREE.Vector3().crossVectors(diskN, diskU).normalize()
  diskU.crossVectors(diskV, diskN).normalize()

  const geo = new THREE.CircleGeometry(IMPOSTOR_GEO_R, 96)
  const mat = new THREE.ShaderMaterial({
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
      uSky: { value: skyTex },
      uBendK: { value: BEND_K },
      uSteps: { value: lowPower ? STEPS_LOW : STEPS_HIGH },
      uHalfSize: { value: DISK_OUTER * 4 },
      uMarchStartR: { value: MARCH_START_R },
      uShadowCaptureR: { value: SHADOW_CAPTURE_R },
      uSkyRot: { value: 0 },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    depthTest: true,
    depthWrite: false,
    transparent: false,
    toneMapped: true,
    side: THREE.DoubleSide,
  })

  const impostor = new THREE.Mesh(geo, mat)
  impostor.frustumCulled = false
  // After the horizon sphere. depthWrite false — this cannot stamp a hole
  // on the ship. depthTest still loses to anything in front of the BH plane.
  impostor.renderOrder = 7
  impostor.name = 'black-hole-impostor'

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

  const diskGeo = new THREE.RingGeometry(DISK_INNER, DISK_OUTER, 128, 1)
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
  root.add(impostor)

  const rel = new THREE.Vector3()
  const camFwd = new THREE.Vector3()

  return {
    object: root,
    update(_dt, elapsed, camera) {
      impostor.quaternion.copy(camera.quaternion)
      mat.uniforms.uTime.value = elapsed
      mat.uniforms.uSkyRot.value = elapsed * SKY_ROT_SPEED
      diskMat.uniforms.uTime.value = elapsed

      rel.copy(BLACK_HOLE_POS).sub(camera.position)
      camFwd.set(0, 0, -1).applyQuaternion(camera.quaternion)
      const depth = rel.dot(camFwd)
      // Billboard sitting near the camera plane (BH beside/behind) would
      // depth-win against the ship. Hide the impostor; the sphere still
      // occludes in world space.
      if (depth < 20) {
        impostor.visible = false
        return
      }
      impostor.visible = true

      // Cover the disk + ring, with extra radius when the disk is edge-on
      // (foreshortening) — NOT the whole frustum (that was a 3800u stamp).
      const dist = Math.max(rel.length(), 1)
      const facing = THREE.MathUtils.clamp(Math.abs(depth) / dist, 0.38, 1)
      const cover = THREE.MathUtils.clamp(DISK_OUTER * 2.2 / facing, DISK_OUTER * 2.0, DISK_OUTER * 4.8)
      impostor.scale.setScalar(cover)
      mat.uniforms.uHalfSize.value = cover
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      horizonGeo.dispose()
      horizonMat.dispose()
      diskGeo.dispose()
      diskMat.dispose()
    },
  }
}
