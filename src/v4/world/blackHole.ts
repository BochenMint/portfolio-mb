import * as THREE from 'three'
import { NOISE_GLSL, SKY_ROT_SPEED, TONE_OUTPUT_GLSL } from './shaderChunks'
import { BLACK_HOLE_POS } from '../engine/world-anchors'

/**
 * Black hole — camera-facing impostor plane at BLACK_HOLE_POS.
 *
 * Adapted (not ported) from the core ideas in
 * `src/v4/shaders/reference/raytracer.glsl` (oseiskar/black-hole, MIT license,
 * see public/v4/assets/ATTRIBUTION.md): a per-fragment ray from the camera is
 * marched past the hole using the standard Schwarzschild null-geodesic
 * central-force form  d²x/dλ² = -1.5·Rs·h²·x/r⁵  (h = |x×v| conserved per
 * ray, leapfrog integration) — strong bending only very near the photon
 * sphere, negligible at disk radii, which is exactly what produces the
 * iconic Gargantua anatomy: a small crisp shadow, a THIN photon ring at
 * b≈b_crit, and the accretion disk lensed into halo arcs ABOVE and BELOW the
 * horizon (far-side disk light bent over the poles). Crossings of the tilted
 * disk plane are tested DURING bending and shaded with a white-gold→amber→
 * ember temperature gradient + doppler beaming; rays that escape sample the
 * real skybox equirect texture along their final (bent) direction — so the
 * lensing distorts the actual Milky Way background, not a stand-in.
 */

/** Gargantua-proportion pass, take 2 — "cień dominuje": the shadow must
 * DOMINATE the composition even harder than before, so every extent below
 * was scaled up together. Shadow radius ≈ b_crit ≈ 2.6·Rs ≈ 94 here (Rs =
 * HORIZON_R = 36), lensing band ≈ the remaining ~76 units out to the march
 * sphere (170) — narrower than the shadow diameter (188), same "small crisp
 * shadow, thin lensed band" silhouette as before, just markedly larger on
 * screen. */
const HORIZON_R = 36
/** Photon sphere sits at 1.5·Rs in Schwarzschild — near-critical escaping
 * rays hug it, so the thin bright ring is centered here. */
const PHOTON_RING_R = HORIZON_R * 1.5 // = 54
const PHOTON_RING_WIDTH = 1.0
const DISK_INNER = 56 // just outside the photon sphere (54)
const DISK_OUTER = 150
const DISK_TILT_DEG = 18
const IMPOSTOR_HALF_SIZE = 240
/** Radius of the sphere the march actually starts at — the 1/r⁵ geodesic
 * term is negligible outside it, so the far-field approach is skipped
 * analytically (ray-sphere intersection) instead of burning march steps on a
 * straight line where nothing interesting happens. */
const MARCH_START_R = 170
/** Multiplier on the physical Schwarzschild bending term — 1.0 is the real
 * geodesic strength; kept tunable for art direction. */
const BEND_K = 1.0
/** HARD CAP: the march loop below is `for (int i = 0; i < 128; i++)` — uSteps
 * must stay <= 127 or the step-budget early-out (`if (i >= uSteps) break`)
 * never fires and the loop silently runs one iteration short of intent. */
const STEPS_HIGH = 126
const STEPS_LOW = 64

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
  uniform sampler2D uSky;
  uniform float uBendK;
  uniform int uSteps;
  uniform float uHalfSize;
  uniform float uMarchStartR;
  uniform float uSkyRot;

  varying vec3 vWorldPos;

  #define PI 3.14159265359
  // Escaping rays never dip below the photon sphere (1.5·Rs) in Schwarzschild
  // — any ray whose periapsis lands under ~1.3·Rs is doomed, so treating it
  // as captured keeps the shadow edge crisp when the step budget runs out.
  #define HORIZON_SAFETY_R (uHorizonR * 1.3)

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
      ? texture2D(uSky, uvA)
      : texture2D(uSky, uvB)).rgb;
  }

  // Spec palette "temperature" gradient (not a physical black-body LUT):
  // white-gold core #fff7e8 -> warm amber mid #ffc861 -> deep ember outer
  // edge #e8761a — deliberately NOT oversaturated orange.
  vec3 diskTemperatureColor(float t) {
    vec3 hot = vec3(1.0, 0.969, 0.91);
    vec3 amber = vec3(1.0, 0.784, 0.38);
    vec3 ember = vec3(0.91, 0.463, 0.102);
    vec3 c = mix(amber, ember, smoothstep(0.25, 0.9, t));
    c = mix(hot, c, smoothstep(0.0, 0.22, t));
    return c;
  }

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize(vWorldPos - ro);

    // Impostor jest teraz PRZEZROCZYSTY poza strefą efektu — wcześniej malował
    // nieprzezroczyste niebo na całym kwadracie i planety ZA nim ucinały się
    // prostą krawędzią quada. discard = kopuła nieba i planety prześwitują.
    float quadR = length(vWorldPos - uBHPos);
    if (quadR > uHalfSize) {
      discard;
    }

    // Far-field deflection is negligible — analytically fast-forward to
    // where the ray first enters the march sphere instead of burning the
    // step budget on a straight line where nothing happens. Rays that never
    // enter it at all get an (unbent) direct background sample.
    vec3 oc = ro - uBHPos;
    float bIsec = dot(oc, rd);
    float cIsec = dot(oc, oc) - uMarchStartR * uMarchStartR;
    float discIsec = bIsec * bIsec - cIsec;

    if (discIsec < 0.0) {
      discard;
    }

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

    for (int i = 0; i < 128; i++) {
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
      float ds = clamp(r * 0.14, 0.35, 5.0);
      float r2 = r * r;
      vec3 accel = p * (-bendScale / (r2 * r2 * r));
      vec3 newD = d + accel * ds;

      vec3 prevP = p;
      p += newD * ds;
      d = newD;

      // Tilted accretion-disk plane crossing test (basis uDiskU/uDiskV/uDiskN),
      // run DURING bending so rays that pass above/below the hole can still
      // hit the far side of the disk behind it — that is what paints the
      // over-pole halo arcs. Capped at three hits (direct + two lensed
      // images) so a ray orbiting the photon sphere can't rack up unbounded
      // brightness.
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
          float tRad = (rad - uDiskInner) / (uDiskOuter - uDiskInner);
          float ang = atan(cv, cu);

          // Keplerian-ish angular speed falling off with radius.
          float omega = 2.0 / pow(rad / uDiskInner, 1.5);
          float flowAngle = ang - uTime * omega;

          // Subtle turbulence streaks, elongated along the flow direction —
          // radial frequency kept LOW so the noise doesn't collapse into
          // concentric "vinyl groove" moire rings.
          float streak = fbm2(vec2(rad * 0.16, flowAngle * 2.2), 4);
          float streak2 = fbm2(vec2(rad * 0.45, flowAngle * 4.6 + 4.1), 3);
          float streakMix = mix(streak, streak2, 0.3);

          vec3 tempColor = diskTemperatureColor(tRad);

          // Tangential (rotation) direction at this point, for doppler
          // beaming — approaching side clearly brighter, but tasteful (no
          // hard black/white split).
          vec3 tangent = normalize(-sin(ang) * uDiskU + cos(ang) * uDiskV);
          float approach = dot(tangent, -d);
          float beam = mix(0.32, 2.1, smoothstep(-0.75, 0.75, approach));

          float edgeFade = smoothstep(0.0, 0.06, tRad) * (1.0 - smoothstep(0.62, 1.0, tRad));
          float brightness = (0.5 + streakMix * 0.9) * beam * edgeFade;

          // Successive lensed images read progressively dimmer, as expected —
          // their light has been bent through much longer paths.
          float imageFalloff = diskHits == 1 ? 1.0 : (diskHits == 2 ? 0.55 : 0.3);
          accum += tempColor * brightness * imageFalloff * 1.35;
        }
      }
    }

    // Safety net: a ray that exhausts its step budget deep in the strong
    // field (i.e. never resolved to a clean escape or capture) reads as
    // captured rather than leaking a stray bright/ambiguous sample.
    if (!captured && minDist < HORIZON_SAFETY_R) captured = true;

    vec3 color;
    if (captured) {
      // Disk light emitted at crossings in FRONT of the horizon still reaches
      // the camera at full strength — this paints the bright band across the
      // shadow face, Gargantua's most recognizable feature.
      color = accum;
    } else {
      vec3 bg = sampleSky(normalize(d));
      color = bg + accum;

      // Photon ring — thin crisp white-gold rim for near-critical grazing
      // rays that still escape (stand-in for the many-orbits brightening at
      // b≈b_crit that the finite step budget can't fully resolve). Where the
      // near-side disk already painted this pixel, the ring is damped so the
      // front band reads as passing IN FRONT of the ring, not under it.
      float ring = exp(-pow((minDist - uPhotonR) / uPhotonWidth, 2.0));
      ring *= 1.0 / (1.0 + dot(accum, vec3(0.6)));
      color += vec3(1.0, 0.969, 0.91) * ring * 1.2;
    }

    // WĄSKI pierścień wygaszania przy samej krawędzi quada. Szeroki pas
    // (0.62→0.98) dawał „przezroczyste planety": planeta ZA quadem prześwitywała
    // półprzezroczyście przez lensowane niebo na dużej powierzchni. Teraz:
    // rdzeń w pełni kryjący (planeta za strefą soczewki jest po prostu
    // zasłonięta — czytelne wizualnie), cienki rym 90–98.5% domyka szew nieba.
    float fadeOut = 1.0 - smoothstep(uHalfSize * 0.90, uHalfSize * 0.985, quadR);
    float alpha = captured ? 1.0 : fadeOut;

    gl_FragColor = vec4(color, alpha);
    ${TONE_OUTPUT_GLSL}
  }
`

export type BlackHole = {
  object: THREE.Mesh
  update(dt: number, elapsed: number, camera: THREE.PerspectiveCamera): void
  dispose(): void
}

export function createBlackHole(skyTex: THREE.Texture, lowPower: boolean): BlackHole {
  const tilt = THREE.MathUtils.degToRad(DISK_TILT_DEG)
  const diskN = new THREE.Vector3(0, Math.cos(tilt), Math.sin(tilt)).normalize()
  const diskU = new THREE.Vector3(1, 0, 0)
  const diskV = new THREE.Vector3().crossVectors(diskN, diskU).normalize()
  diskU.crossVectors(diskV, diskN).normalize()

  const geo = new THREE.PlaneGeometry(IMPOSTOR_HALF_SIZE * 2, IMPOSTOR_HALF_SIZE * 2)
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
      uHalfSize: { value: IMPOSTOR_HALF_SIZE },
      uMarchStartR: { value: MARCH_START_R },
      uSkyRot: { value: 0 },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    depthTest: true,
    depthWrite: false,
    transparent: true,
  })

  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.copy(BLACK_HOLE_POS)
  mesh.frustumCulled = false
  mesh.renderOrder = 1
  mesh.name = 'black-hole-impostor'

  return {
    object: mesh,
    update(_dt, elapsed, camera) {
      mesh.quaternion.copy(camera.quaternion)
      mat.uniforms.uTime.value = elapsed
      mat.uniforms.uSkyRot.value = elapsed * SKY_ROT_SPEED
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}
