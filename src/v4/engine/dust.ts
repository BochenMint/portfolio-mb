import * as THREE from 'three'

const DUST_COUNT = 800
const BOX_SIZE = 140

export type DustField = {
  object: THREE.Points
  /** Recenter the dust box on the camera and fade opacity by speed. */
  update(cameraPos: THREE.Vector3, speed: number): void
  dispose(): void
}

/**
 * ~800 tiny points recycled in a box around the camera. Because the box is
 * re-centered on the camera every frame, points continuously "appear" at the
 * leading edge and vanish behind — cheap stand-in for true particle recycling
 * that reads as streaking dust once the ship is moving.
 */
export function createDustField(): DustField {
  const positions = new Float32Array(DUST_COUNT * 3)
  for (let i = 0; i < DUST_COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * BOX_SIZE
    positions[i * 3 + 1] = (Math.random() - 0.5) * BOX_SIZE
    positions[i * 3 + 2] = (Math.random() - 0.5) * BOX_SIZE
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  // Round soft sprite — bez tego punkty renderują się jako KWADRATY
  // (widoczne przy większej prędkości jako „kwadratowe gwiazdy").
  const spriteCanvas = document.createElement('canvas')
  spriteCanvas.width = spriteCanvas.height = 32
  const ctx = spriteCanvas.getContext('2d')!
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.5)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 32, 32)
  const spriteTex = new THREE.CanvasTexture(spriteCanvas)

  const material = new THREE.PointsMaterial({
    color: 0xcfe0ff,
    size: 0.22,
    sizeAttenuation: true,
    map: spriteTex,
    alphaMap: spriteTex,
    transparent: true,
    opacity: 0.05,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const object = new THREE.Points(geometry, material)
  object.frustumCulled = false
  object.renderOrder = 2

  return {
    object,
    update(cameraPos, speed) {
      object.position.copy(cameraPos)
      const t = THREE.MathUtils.clamp(speed / 80, 0, 1)
      material.opacity = 0.05 + t * 0.5
    },
    dispose() {
      geometry.dispose()
      material.dispose()
    },
  }
}
