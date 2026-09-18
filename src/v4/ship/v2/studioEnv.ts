import * as THREE from 'three'

/**
 * Local studio PMREM for hull chrome — soft room, no starfield sparkle.
 * Independent of the sky/post stack; caller must dispose.
 */
export type HullStudioEnv = {
  map: THREE.Texture | null
  dispose(): void
}

function bakeStudioEquirect(): THREE.CanvasTexture | null {
  const w = 128
  const h = 64
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#8b929c')
  sky.addColorStop(0.22, '#4a515c')
  sky.addColorStop(0.48, '#2a2f38')
  sky.addColorStop(0.72, '#1a1d22')
  sky.addColorStop(1, '#101114')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)

  const window = ctx.createLinearGradient(0, h * 0.12, 0, h * 0.5)
  window.addColorStop(0, 'rgba(228, 231, 236, 0.55)')
  window.addColorStop(0.45, 'rgba(196, 202, 212, 0.32)')
  window.addColorStop(1, 'rgba(196, 202, 212, 0)')
  ctx.fillStyle = window
  ctx.fillRect(w * 0.18, h * 0.1, w * 0.64, h * 0.38)

  const fill = ctx.createRadialGradient(w * 0.72, h * 0.28, 2, w * 0.72, h * 0.28, w * 0.34)
  fill.addColorStop(0, 'rgba(210, 216, 224, 0.42)')
  fill.addColorStop(1, 'rgba(210, 216, 224, 0)')
  ctx.fillStyle = fill
  ctx.fillRect(0, 0, w, h)

  const tex = new THREE.CanvasTexture(canvas)
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

export function createHullStudioEnv(renderer: THREE.WebGLRenderer | null | undefined): HullStudioEnv {
  const src = bakeStudioEquirect()
  if (!src) return { map: null, dispose() {} }

  if (!renderer) {
    return {
      map: src,
      dispose() {
        src.dispose()
      },
    }
  }

  const pmrem = new THREE.PMREMGenerator(renderer)
  pmrem.compileEquirectangularShader()
  const rt = pmrem.fromEquirectangular(src)
  src.dispose()
  pmrem.dispose()
  return {
    map: rt.texture,
    dispose() {
      rt.dispose()
    },
  }
}
