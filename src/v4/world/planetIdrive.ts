import * as THREE from 'three'
import {
  NOISE_GLSL,
  PLANET_VERT_LOCAL,
  SUN_DIR_GLSL,
  TONE_OUTPUT_GLSL,
  createAtmosphereRim,
  mulberry32,
} from './shaderChunks'

/**
 * iDrive Cars — racetrack planet. Dark basalt/asphalt sphere (procedural fbm
 * brightness variation faking surface relief) wrapped by a single continuous
 * glowing race circuit — straights, sweeping corners, a chicane and two real
 * hairpins — with a field of tiny instanced cars driving on the track:
 * readable vehicles (body + white front / red rear light dots) up close,
 * moving amber glow points from afar.
 */

/**
 * Circuit seed — picked by a scratchpad sweep (200 candidates) for the best
 * combination of: no self-intersection at tube scale (min pairwise distance
 * between samples ≥ 2% of a lap apart = 3.94u ≈ 7.8× tube radius) and a
 * post-relaxation minimum turning radius of 1.67u ≈ 3.3× tube radius, so the
 * tube never pinches at hairpin apexes. Both metrics are scale-invariant
 * (every length in the build derives from `radius`), so the seed stays valid
 * if the planet slot radius changes.
 */
const SEED = 1056

const BASALT_FRAG = /* glsl */ `
  precision highp float;

  uniform float uRadius;
  varying vec3 vNormalW;
  varying vec3 vLocalDir;
  varying vec3 vWorldPos;

  ${SUN_DIR_GLSL}
  ${NOISE_GLSL}

  void main() {
    float macro = fbm3(vLocalDir * 3.4, 4);
    float micro = fbm3(vLocalDir * 14.0 + 5.2, 4);
    float relief = macro * 0.7 + micro * 0.3;

    vec3 darkBasalt = vec3(0.035, 0.033, 0.038);
    vec3 lightBasalt = vec3(0.12, 0.11, 0.115);
    vec3 base = mix(darkBasalt, lightBasalt, smoothstep(0.25, 0.85, relief));

    // Close-up rock detail: a much finer fbm octave faded in only near the
    // camera, so the far view keeps the same clean basalt gradient as before.
    float camDist = length(cameraPosition - vWorldPos);
    float detailFade = 1.0 - smoothstep(uRadius * 2.0, uRadius * 8.0, camDist);
    vec3 fineWobble = vec3(0.0);
    float fineLum = 0.0;
    if (detailFade > 0.003) {
      float fineA = fbm3(vLocalDir * uRadius * 1.6, 4);
      float fineB = fbm3(vLocalDir * uRadius * 1.6 + 9.4, 3);
      float fineC = fbm3(vLocalDir * uRadius * 1.6 + 21.8, 3);
      fineLum = fineA - 0.5;
      fineWobble = (vec3(fineA, fineB, fineC) - 0.5) * detailFade;
      base *= mix(1.0, 1.0 + fineLum * 0.5, detailFade);
    }

    // Fake relief shading: perturb the normal slightly by the noise gradient
    // direction so cratered/ridged patches catch a bit of extra light.
    vec3 n = normalize(vNormalW + (vec3(micro, macro, relief) - 0.5) * 0.12 + fineWobble * 0.1);
    float diffuse = max(dot(n, SUN_DIR), 0.0);
    vec3 color = base * (0.55 + diffuse * 0.95);

    gl_FragColor = vec4(color, 1.0);
    ${TONE_OUTPUT_GLSL}
  }
`

const TRACK_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const TRACK_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  #define PI 3.14159265359
  void main() {
    // vUv.y wraps around the tube's circular cross-section — a bright band
    // along the outward-facing side, darker asphalt-grey border elsewhere.
    // Anti-alias the core/border edge with fwidth-derived smoothstep width
    // (rather than a fixed constant) so it stays crisp at any screen size —
    // close flybys don't get a jagged edge, distant views don't shimmer/moire.
    float rim = cos(vUv.y * 2.0 * PI - 1.2);
    float edgeAA = max(fwidth(rim), 0.001);
    float core = smoothstep(-0.15 - edgeAA, -0.15 + edgeAA, rim);
    vec3 border = vec3(0.05, 0.045, 0.05);
    vec3 hot = vec3(1.0, 0.87, 0.55);
    vec3 color = mix(border, hot, core);
    gl_FragColor = vec4(color, 1.0);
    ${TONE_OUTPUT_GLSL}
  }
`

// One additive Points layer carries ALL car light effects: per car one soft
// long-range glow sprite (fades out when the camera gets close, so it never
// blobs over the readable body) plus two persistent light dots — white front,
// red rear — that survive at every distance and bloom slightly.
const LIGHTS_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;
  attribute float aFadeNear;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float dist = max(-mv.z, 1.0);
    // Glow sprites (aFadeNear=1) dissolve within ~10-34u of the camera so the
    // body + light-dot read takes over; light dots (aFadeNear=0) persist.
    float nearFade = mix(1.0, smoothstep(10.0, 34.0, dist), aFadeNear);
    vAlpha = aAlpha * nearFade;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (2600.0 / dist);
  }
`

const LIGHTS_FRAG = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    float core = smoothstep(1.0, 0.0, d);
    core = pow(core, 1.6) * vAlpha;
    if (core < 0.03) discard;
    gl_FragColor = vec4(vColor * core * 1.6, core);
    ${TONE_OUTPUT_GLSL}
  }
`

/** Closed centripetal Catmull-Rom whose every evaluated point is re-projected
 * onto a constant-altitude sphere shell, so the track hugs the surface no
 * matter how the control net bends. */
class ShellProjectedCurve extends THREE.CatmullRomCurve3 {
  shellRadius: number

  constructor(points: THREE.Vector3[], shellRadius: number) {
    super(points, true, 'centripetal')
    this.shellRadius = shellRadius
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    super.getPoint(t, optionalTarget)
    return optionalTarget.setLength(this.shellRadius)
  }
}

// Circuit layout grammar: a lap alternates longer "straight" arcs with corner
// features. Hairpins are 3-waypoint clusters (entry/apex/exit) so the spline
// genuinely doubles back; the chicane is a 2-waypoint S-flick; plain corners
// are single offset waypoints. Weights are relative shares of the full 2π of
// longitude, `sign` picks which hemisphere the feature swings into. Latitude
// stays within ±~35°.
const CIRCUIT_PATTERN: ReadonlyArray<{
  kind: 'straight' | 'corner' | 'chicane' | 'hairpin'
  weight: number
  sign?: 1 | -1
}> = [
  { kind: 'straight', weight: 1.7 },
  { kind: 'hairpin', weight: 0.6, sign: 1 },
  { kind: 'straight', weight: 1.3 },
  { kind: 'corner', weight: 0.8, sign: -1 },
  { kind: 'chicane', weight: 0.8, sign: 1 },
  { kind: 'straight', weight: 1.6 },
  { kind: 'hairpin', weight: 0.6, sign: -1 },
  { kind: 'straight', weight: 1.2 },
  { kind: 'corner', weight: 0.8, sign: 1 },
  { kind: 'straight', weight: 1.5 },
]

function buildTrackCurve(radius: number): ShellProjectedCurve {
  const trackR = radius * 1.02
  const tubeR = radius * 0.018
  const rng = mulberry32(SEED)

  // 1) Waypoints (15 total for this pattern) on the shell, circuit-style:
  //    irregular longitude spacing from the weight table, features clustered.
  const total = CIRCUIT_PATTERN.reduce((s, p) => s + p.weight, 0)
  let cursor = rng() * Math.PI * 2
  const waypoints: { theta: number; lat: number }[] = []
  for (const seg of CIRCUIT_PATTERN) {
    const span = (seg.weight / total) * Math.PI * 2
    const mid = cursor + span / 2
    const sign = seg.sign ?? 1
    if (seg.kind === 'straight') {
      waypoints.push({ theta: mid + (rng() - 0.5) * span * 0.3, lat: (rng() - 0.5) * 0.24 })
    } else if (seg.kind === 'corner') {
      const mag = 0.38 + rng() * 0.14
      waypoints.push({ theta: mid, lat: sign * mag })
    } else if (seg.kind === 'chicane') {
      const half = span * 0.26
      const mag = 0.34 + rng() * 0.1
      waypoints.push({ theta: mid - half, lat: sign * mag })
      waypoints.push({ theta: mid + half, lat: -sign * mag })
    } else {
      // hairpin: entry / apex / exit
      const half = span * 0.38
      const mag = 0.46 + rng() * 0.08
      waypoints.push({ theta: mid - half, lat: sign * mag * 0.6 })
      waypoints.push({ theta: mid, lat: sign * (mag + 0.08) })
      waypoints.push({ theta: mid + half, lat: sign * mag * 0.6 })
    }
    cursor += span
  }

  const pts = waypoints.map(({ theta, lat }) => {
    const phi = Math.PI / 2 - lat
    return new THREE.Vector3(
      trackR * Math.sin(phi) * Math.cos(theta),
      trackR * Math.cos(phi),
      trackR * Math.sin(phi) * Math.sin(theta),
    )
  })

  // 2) Densely sample the raw spline, then adaptively relax ONLY the points
  //    turning tighter than the curvature budget (pull toward the neighbour
  //    midpoint, re-project to the shell). Straights and the chicane shape
  //    survive untouched while hairpin apexes acquire a real turning radius
  //    instead of a tube-pinching cusp.
  const raw = new ShellProjectedCurve(pts, trackR)
  const M = 256
  const dense: THREE.Vector3[] = []
  for (let i = 0; i < M; i++) dense.push(raw.getPointAt(i / M, new THREE.Vector3()))

  const minCurvBudget = tubeR * 5.2
  const lambda = 0.6
  const va = new THREE.Vector3()
  const vb = new THREE.Vector3()
  for (let iter = 0; iter < 80; iter++) {
    let ok = true
    const prev = dense.map((v) => v.clone())
    for (let i = 0; i < M; i++) {
      const a = prev[(i - 1 + M) % M]
      const b = prev[i]
      const c = prev[(i + 1) % M]
      va.subVectors(b, a)
      vb.subVectors(c, b)
      const step = (va.length() + vb.length()) / 2
      const turn = va.normalize().angleTo(vb.normalize())
      if (turn < 1e-5 || step / turn >= minCurvBudget) continue
      ok = false
      dense[i].copy(a).add(c).multiplyScalar(0.5).sub(b).multiplyScalar(lambda).add(b).setLength(trackR)
    }
    if (ok) break
  }
  // Two light global fairing passes remove residual micro-wiggle before the
  // final spline interpolates the samples.
  for (let iter = 0; iter < 2; iter++) {
    const prev = dense.map((v) => v.clone())
    for (let i = 0; i < M; i++) {
      const a = prev[(i - 1 + M) % M]
      const b = prev[i]
      const c = prev[(i + 1) % M]
      dense[i].copy(a).add(c).multiplyScalar(0.5).sub(b).multiplyScalar(0.25).add(b).setLength(trackR)
    }
  }

  // 3) Final curve interpolates ALL relaxed samples (no subsampling, so the
  //    spline cannot re-sharpen between control points). Higher arc-length
  //    resolution keeps getPointAt's u→t mapping smooth for car motion.
  const curve = new ShellProjectedCurve(dense, trackR)
  curve.arcLengthDivisions = 800
  return curve
}

export type Planet = {
  group: THREE.Group
  update(dt: number, elapsed: number): void
  dispose(): void
}

export function createPlanetIdrive(radius: number, lowPower: boolean): Planet {
  const group = new THREE.Group()
  group.name = 'planet-idrive'

  const [wSeg, hSeg] = lowPower ? [96, 64] : [128, 96]
  const geo = new THREE.SphereGeometry(radius, wSeg, hSeg)
  const mat = new THREE.ShaderMaterial({
    uniforms: { uRadius: { value: radius } },
    vertexShader: PLANET_VERT_LOCAL,
    fragmentShader: BASALT_FRAG,
  })
  const mesh = new THREE.Mesh(geo, mat)
  group.add(mesh)

  const tubeR = radius * 0.018
  const curve = buildTrackCurve(radius)
  // More tubular segments than the old smooth ring: hairpin apexes now turn
  // at ~3.3 tube radii, so 280 segments would facet visibly at the apex.
  const tubularSegments = lowPower ? 220 : 400
  const trackGeo = new THREE.TubeGeometry(curve, tubularSegments, tubeR, 14, true)
  const trackMat = new THREE.ShaderMaterial({
    vertexShader: TRACK_VERT,
    fragmentShader: TRACK_FRAG,
  })
  const track = new THREE.Mesh(trackGeo, trackMat)
  group.add(track)

  const rim = createAtmosphereRim(radius, 0x9aa0a8, { power: 3.2, intensity: 0.55 })
  group.add(rim.mesh)

  // ── Tiny cars — ONE InstancedMesh of elongated boxes riding the track ──────
  const CAR_COUNT = lowPower ? 16 : 28
  const rng = mulberry32(SEED + 1)

  // ~1/32 of the planet radius nose-to-tail (≈0.87u on the r=28 slot), with
  // the 0.5 / 0.2 width/height proportions of a low race car.
  const carLen = radius * 0.031
  const carWidth = carLen * 0.5
  const carHeight = carLen * 0.2

  const carState = Array.from({ length: CAR_COUNT }, (_, i) => {
    const lane = (i % 2 === 0 ? -1 : 1) * (0.55 + rng() * 0.45) * 0.4 * tubeR
    return {
      t: rng(),
      speed: 0.028 + rng() * 0.05,
      lane,
      // Cars sit wheels-down ON the curved tube surface: radial lift is the
      // tube's height at the lane offset plus half the body, plus a hair of
      // clearance so the emissive core still peeks out under the car.
      lift: Math.sqrt(Math.max(tubeR * tubeR - lane * lane, 0)) + carHeight * 0.5 + tubeR * 0.04,
    }
  })

  const bodyGeo = new THREE.BoxGeometry(carWidth, carHeight, carLen)
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // multiplied by the per-instance color below
    roughness: 0.45,
    metalness: 0.55,
    // Faint warm self-glow so bodies never go fully black on the night side.
    emissive: 0x241505,
    emissiveIntensity: 0.9,
  })
  const carMesh = new THREE.InstancedMesh(bodyGeo, bodyMat, CAR_COUNT)
  carMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  carMesh.frustumCulled = false
  const CAR_COLORS = [0xb8bcc4, 0x4a4e58, 0x9c3b32, 0x33567d, 0xb98a2e, 0x3d6b4f]
  const tmpColor = new THREE.Color()
  for (let i = 0; i < CAR_COUNT; i++) {
    tmpColor.setHex(CAR_COLORS[i % CAR_COLORS.length])
    carMesh.setColorAt(i, tmpColor)
  }
  group.add(carMesh)

  // ── Light layer: 3 additive points per car (glow / front white / rear red) ─
  const PTS_PER_CAR = 3
  const POINT_COUNT = CAR_COUNT * PTS_PER_CAR
  const lightPositions = new Float32Array(POINT_COUNT * 3)
  const lightColors = new Float32Array(POINT_COUNT * 3)
  const lightSizes = new Float32Array(POINT_COUNT)
  const lightAlphas = new Float32Array(POINT_COUNT)
  const lightFadeNear = new Float32Array(POINT_COUNT)
  const glowHot = new THREE.Color(0xffdca0)
  const glowWhite = new THREE.Color(0xffffff)
  const frontColor = new THREE.Color(0xfff6e0)
  const rearColor = new THREE.Color(0xff2d18)
  for (let i = 0; i < CAR_COUNT; i++) {
    const base = i * PTS_PER_CAR
    // 0: long-range glow — the "moving lights around the planet" far read.
    tmpColor.copy(glowHot).lerp(glowWhite, rng() * 0.5)
    lightColors.set([tmpColor.r, tmpColor.g, tmpColor.b], base * 3)
    lightSizes[base] = radius * (0.1 + rng() * 0.05)
    lightAlphas[base] = 0.9
    lightFadeNear[base] = 1
    // 1: front white light dot.
    lightColors.set([frontColor.r, frontColor.g, frontColor.b], (base + 1) * 3)
    lightSizes[base + 1] = carLen * 0.5
    lightAlphas[base + 1] = 1
    lightFadeNear[base + 1] = 0
    // 2: rear red light dot.
    lightColors.set([rearColor.r, rearColor.g, rearColor.b], (base + 2) * 3)
    lightSizes[base + 2] = carLen * 0.55
    lightAlphas[base + 2] = 1
    lightFadeNear[base + 2] = 0
  }
  const lightsGeo = new THREE.BufferGeometry()
  lightsGeo.setAttribute('position', new THREE.BufferAttribute(lightPositions, 3))
  lightsGeo.setAttribute('aColor', new THREE.BufferAttribute(lightColors, 3))
  lightsGeo.setAttribute('aSize', new THREE.BufferAttribute(lightSizes, 1))
  lightsGeo.setAttribute('aAlpha', new THREE.BufferAttribute(lightAlphas, 1))
  lightsGeo.setAttribute('aFadeNear', new THREE.BufferAttribute(lightFadeNear, 1))
  const lightsMat = new THREE.ShaderMaterial({
    vertexShader: LIGHTS_VERT,
    fragmentShader: LIGHTS_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const lights = new THREE.Points(lightsGeo, lightsMat)
  lights.frustumCulled = false
  lights.renderOrder = 3
  group.add(lights)

  // Reused per-frame temps — zero allocations inside update().
  const posAttr = lightsGeo.attributes.position as THREE.BufferAttribute
  const tmpPos = new THREE.Vector3()
  const tmpAhead = new THREE.Vector3()
  const tmpUp = new THREE.Vector3()
  const tmpFwd = new THREE.Vector3()
  const tmpRight = new THREE.Vector3()
  const tmpCarPos = new THREE.Vector3()
  const tmpLight = new THREE.Vector3()
  const tmpMatrix = new THREE.Matrix4()
  const AHEAD_DU = 0.0015 // ≈0.37u of arc — tangent estimation lookahead

  function placeCar(i: number) {
    const car = carState[i]
    curve.getPointAt(car.t, tmpPos)
    curve.getPointAt((car.t + AHEAD_DU) % 1, tmpAhead)
    // Orthonormal frame: up = sphere normal, forward = travel direction
    // projected into the tangent plane, right completes it — cars sit
    // wheels-down with the nose along the direction of travel.
    tmpUp.copy(tmpPos).normalize()
    tmpFwd.subVectors(tmpAhead, tmpPos)
    tmpFwd.addScaledVector(tmpUp, -tmpFwd.dot(tmpUp)).normalize()
    tmpRight.crossVectors(tmpUp, tmpFwd)
    tmpCarPos.copy(tmpPos).addScaledVector(tmpRight, car.lane).addScaledVector(tmpUp, car.lift)
    tmpMatrix.makeBasis(tmpRight, tmpUp, tmpFwd)
    tmpMatrix.setPosition(tmpCarPos)
    carMesh.setMatrixAt(i, tmpMatrix)

    const base = i * PTS_PER_CAR
    posAttr.setXYZ(base, tmpCarPos.x, tmpCarPos.y, tmpCarPos.z)
    tmpLight.copy(tmpCarPos).addScaledVector(tmpFwd, carLen * 0.58)
    posAttr.setXYZ(base + 1, tmpLight.x, tmpLight.y, tmpLight.z)
    tmpLight.copy(tmpCarPos).addScaledVector(tmpFwd, -carLen * 0.58)
    posAttr.setXYZ(base + 2, tmpLight.x, tmpLight.y, tmpLight.z)
  }

  // Prime initial transforms so the first frame doesn't show cars at origin.
  for (let i = 0; i < CAR_COUNT; i++) placeCar(i)
  carMesh.instanceMatrix.needsUpdate = true
  if (carMesh.instanceColor) carMesh.instanceColor.needsUpdate = true
  posAttr.needsUpdate = true

  const ROTATION_SPEED = 0.01

  return {
    group,
    update(dt) {
      mesh.rotation.y += dt * ROTATION_SPEED
      for (let i = 0; i < CAR_COUNT; i++) {
        const car = carState[i]
        car.t = (car.t + car.speed * dt) % 1
        placeCar(i)
      }
      carMesh.instanceMatrix.needsUpdate = true
      posAttr.needsUpdate = true
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      trackGeo.dispose()
      trackMat.dispose()
      rim.dispose()
      carMesh.dispose()
      bodyGeo.dispose()
      bodyMat.dispose()
      lightsGeo.dispose()
      lightsMat.dispose()
    },
  }
}
