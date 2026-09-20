import * as THREE from 'three'

/**
 * Local studio PMREM for hull chrome/graphite — soft room, no starfield.
 * Key window + cool rim + dark floor. Independent of the sky/post stack.
 */
export type HullStudioEnv = {
  map: THREE.Texture | null
  dispose(): void
}

function bakeStudioEquirect(): THREE.CanvasTexture | null {
  const w = 256
  const h = 128
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#a8b0bc')
  sky.addColorStop(0.18, '#5a6370')
  sky.addColorStop(0.42, '#2a3038')
  sky.addColorStop(0.68, '#161a20')
  sky.addColorStop(1, '#0a0c10')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)

  const key = ctx.createLinearGradient(0, h * 0.08, 0, h * 0.46)
  key.addColorStop(0, 'rgba(248, 244, 236, 0.72)')
  key.addColorStop(0.4, 'rgba(226, 214, 196, 0.4)')
  key.addColorStop(1, 'rgba(226, 214, 196, 0)')
  ctx.fillStyle = key
  ctx.fillRect(w * 0.08, h * 0.06, w * 0.38, h * 0.4)

  const fill = ctx.createRadialGradient(w * 0.78, h * 0.3, 4, w * 0.78, h * 0.3, w * 0.36)
  fill.addColorStop(0, 'rgba(186, 210, 232, 0.5)')
  fill.addColorStop(1, 'rgba(186, 210, 232, 0)')
  ctx.fillStyle = fill
  ctx.fillRect(0, 0, w, h)

  const rim = ctx.createRadialGradient(w * 0.12, h * 0.62, 2, w * 0.12, h * 0.62, w * 0.28)
  rim.addColorStop(0, 'rgba(168, 196, 220, 0.42)')
  rim.addColorStop(1, 'rgba(168, 196, 220, 0)')
  ctx.fillStyle = rim
  ctx.fillRect(0, 0, w, h)

  const floor = ctx.createLinearGradient(0, h * 0.72, 0, h)
  floor.addColorStop(0, 'rgba(18, 20, 24, 0)')
  floor.addColorStop(1, 'rgba(8, 9, 11, 0.85)')
  ctx.fillStyle = floor
  ctx.fillRect(0, h * 0.7, w, h * 0.3)

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
