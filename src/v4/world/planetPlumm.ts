import * as THREE from 'three'
import { NOISE_GLSL, PLANET_VERT_LOCAL, SUN_DIR_GLSL, TONE_OUTPUT_GLSL, createAtmosphereRim } from './shaderChunks'

/**
 * Plumm — purple metropolis ("Coruscant vibe"). The Earth night-lights map
 * gives real city clustering, but a lone city-lights texture reads too much
 * like "Earth at night"; this is meant to be a fully built-up city-planet, so
 * a procedural grid-noise mask is combined in to push coverage to ~70% of the
 * surface, all tinted violet. Thin emissive "traffic lane" rings orbit at low
 * altitude, rotating at different speeds.
 */

const FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uCityTex;
  uniform float uTime;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vLocalDir;
  varying vec3 vWorldPos;

  ${SUN_DIR_GLSL}
  ${NOISE_GLSL}

  void main() {
    vec4 tex = texture2D(uCityTex, vUv);
    float cityLum = clamp(dot(tex.rgb, vec3(0.299, 0.587, 0.114)) * 1.4, 0.0, 1.0);

    // Two separate procedural layers, kept deliberately unequal in brightness
    // so ~70% surface "coverage" doesn't read as a uniform pale wash:
    //  - district: a broad ~70%-area mask, but only a DIM ambient violet lift
    //  - network: a much sparser mask within it, the actual bright light veins
    float cellsA = fbm3(vLocalDir * 13.0, 4);
    float cellsB = fbm3(vLocalDir * 34.0 + 11.3, 3);
    float district = smoothstep(0.28, 0.5, cellsA);
    float network = smoothstep(0.58, 0.7, cellsB) * district;

    vec3 baseDark = vec3(0.03, 0.024, 0.055);
    vec3 districtGlow = vec3(0.15, 0.07, 0.3);
    vec3 networkColor = vec3(0.56, 0.38, 0.92);
    vec3 hotspot = vec3(0.88, 0.7, 1.0);

    vec3 color = baseDark + districtGlow * district;
    color += networkColor * network * 0.95;
    color += hotspot * cityLum * 1.1;

    // Faint day-side lift so the lit hemisphere doesn't look flat black.
    vec3 n = normalize(vNormalW);
    float diffuse = max(dot(n, SUN_DIR), 0.0);
    color += baseDark * diffuse * 1.4;

    // Slow twinkle so the city grid doesn't look static from orbit.
    float coverage = clamp(district * 0.6 + network + cityLum, 0.0, 1.0);
    float twinkle = 0.92 + 0.08 * sin(uTime * 1.3 + cellsA * 40.0);
    color *= mix(1.0, twinkle, coverage);

    // Close-up block-granularity: a much higher-frequency cell layer, only
    // blended in near the camera — individual "city blocks" resolve up close
    // while the distant view keeps the same broad glow pattern as before.
    float camDist = length(cameraPosition - vWorldPos);
    float detailFade = 1.0 - smoothstep(uRadius * 2.0, uRadius * 8.0, camDist);
    if (detailFade > 0.003) {
      float blocksA = fbm3(vLocalDir * 90.0 + 3.3, 3);
      float blocks = smoothstep(0.4, 0.46, blocksA) * (1.0 - smoothstep(0.5, 0.58, blocksA));
      color += networkColor * blocks * coverage * 0.6 * detailFade;
      color *= mix(1.0, 0.88 + blocksA * 0.24, detailFade * coverage);
    }

    gl_FragColor = vec4(color, 1.0);
    ${TONE_OUTPUT_GLSL}
  }
`

export type Planet = {
  group: THREE.Group
  update(dt: number, elapsed: number): void
  dispose(): void
}

export function createPlanetPlumm(radius: number, cityTex: THREE.Texture, lowPower: boolean): Planet {
  const group = new THREE.Group()
  group.name = 'planet-plumm'

  const [wSeg, hSeg] = lowPower ? [96, 64] : [128, 96]
  const geo = new THREE.SphereGeometry(radius, wSeg, hSeg)
  const mat = new THREE.ShaderMaterial({
    uniforms: { uCityTex: { value: cityTex }, uTime: { value: 0 }, uRadius: { value: radius } },
    vertexShader: PLANET_VERT_LOCAL,
    fragmentShader: FRAG,
  })
  const mesh = new THREE.Mesh(geo, mat)
  group.add(mesh)

  const rim = createAtmosphereRim(radius, 0x8a6bff, { power: 2.8, intensity: 1.35 })
  group.add(rim.mesh)

  const rings: { mesh: THREE.Mesh; speed: number }[] = []
  const ringDisposables: { geo: THREE.BufferGeometry; mat: THREE.Material }[] = []

  if (!lowPower) {
    const ringConfigs = [
      { r: radius * 1.28, speed: 0.22, tilt: 0.06, opacity: 0.55 },
      { r: radius * 1.48, speed: -0.16, tilt: -0.09, opacity: 0.4 },
      { r: radius * 1.7, speed: 0.12, tilt: 0.14, opacity: 0.3 },
    ]
    for (const cfg of ringConfigs) {
      const ringGeo = new THREE.TorusGeometry(cfg.r, radius * 0.006, 8, 160)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xab9bdd,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.rotation.x = Math.PI / 2 + cfg.tilt
      ringMesh.renderOrder = 2
      group.add(ringMesh)
      rings.push({ mesh: ringMesh, speed: cfg.speed })
      ringDisposables.push({ geo: ringGeo, mat: ringMat })
    }
  }

  const ROTATION_SPEED = 0.014

  // ── Papierowe samoloty (brand Plumm) — malutkie białe darty krążące na
  // niskich orbitach nad metropolią, każdy po własnym pochylonym okręgu.
  const PLANE_COUNT = lowPower ? 20 : 48
  const planeGeo = new THREE.BufferGeometry()
  {
    // Dart z dwóch trójkątów ze wznosem skrzydeł (dziób w -Z).
    const L = 1.8
    const verts = new Float32Array([
      // left wing: nose, tail-left(up), keel(down)
      0, 0, -L * 0.55, -0.62, 0.12, L * 0.45, 0, -0.1, L * 0.38,
      // right wing: nose, keel(down), tail-right(up)
      0, 0, -L * 0.55, 0, -0.1, L * 0.38, 0.62, 0.12, L * 0.45,
    ])
    planeGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3))
    planeGeo.computeVertexNormals()
  }
  const planeMat = new THREE.MeshBasicMaterial({ color: 0xf1ecff, side: THREE.DoubleSide })
  const planes = new THREE.InstancedMesh(planeGeo, planeMat, PLANE_COUNT)
  planes.frustumCulled = false
  group.add(planes)

  type PlaneOrbit = { quat: THREE.Quaternion; r: number; speed: number; phase: number; bank: number }
  const planeOrbits: PlaneOrbit[] = []
  {
    const rng = (() => {
      let s = 0x9d2c5681
      return () => ((s = Math.imul(s ^ (s >>> 15), s | 1)), ((s >>> 16) & 0xffff) / 0xffff)
    })()
    const axis = new THREE.Vector3()
    for (let i = 0; i < PLANE_COUNT; i++) {
      axis.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).normalize()
      planeOrbits.push({
        quat: new THREE.Quaternion().setFromAxisAngle(axis, rng() * Math.PI * 2),
        r: radius * (1.16 + rng() * 0.42),
        speed: (0.1 + rng() * 0.22) * (rng() < 0.5 ? 1 : -1),
        phase: rng() * Math.PI * 2,
        bank: (rng() - 0.5) * 0.9,
      })
    }
  }
  const pPos = new THREE.Vector3()
  const pTan = new THREE.Vector3()
  const pUp = new THREE.Vector3()
  const pRight = new THREE.Vector3()
  const pZ = new THREE.Vector3()
  const pScale = new THREE.Vector3(1, 1, 1)
  const pBasis = new THREE.Matrix4()
  const pQuat = new THREE.Quaternion()
  const pQuatBank = new THREE.Quaternion()
  const pMat4 = new THREE.Matrix4()
  const Z_LOCAL = new THREE.Vector3(0, 0, 1)

  function updatePlanes(elapsed: number) {
    for (let i = 0; i < PLANE_COUNT; i++) {
      const o = planeOrbits[i]
      const a = o.phase + elapsed * o.speed
      const dir = Math.sign(o.speed) || 1
      pPos.set(Math.cos(a) * o.r, 0, Math.sin(a) * o.r).applyQuaternion(o.quat)
      // tangent = kierunek lotu; up = radialnie od centrum planety
      pTan.set(-Math.sin(a) * dir, 0, Math.cos(a) * dir).applyQuaternion(o.quat).normalize()
      pUp.copy(pPos).normalize()
      // Baza: dziób darta w lokalnym -Z → oś Z bazy = -kierunek lotu.
      pZ.copy(pTan).multiplyScalar(-1)
      pRight.crossVectors(pUp, pZ).normalize()
      pUp.crossVectors(pZ, pRight)
      pBasis.makeBasis(pRight, pUp, pZ)
      pQuat.setFromRotationMatrix(pBasis)
      // delikatny stały przechył wzdłuż osi lotu
      pQuatBank.setFromAxisAngle(Z_LOCAL, o.bank)
      pQuat.multiply(pQuatBank)
      pMat4.compose(pPos, pQuat, pScale)
      planes.setMatrixAt(i, pMat4)
    }
    planes.instanceMatrix.needsUpdate = true
  }
  updatePlanes(0)

  return {
    group,
    update(dt, elapsed) {
      mesh.rotation.y += dt * ROTATION_SPEED
      mat.uniforms.uTime.value = elapsed
      for (const ring of rings) ring.mesh.rotation.z += dt * ring.speed
      updatePlanes(elapsed)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      rim.dispose()
      planeGeo.dispose()
      planeMat.dispose()
      planes.dispose()
      for (const d of ringDisposables) {
        d.geo.dispose()
        d.mat.dispose()
      }
    },
  }
}
