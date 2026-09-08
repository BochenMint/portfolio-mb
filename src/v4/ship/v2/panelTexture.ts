import * as THREE from 'three'

/**
 * Procedural hull-plating texture — irregular panel grid + seam darkening +
 * soft grime speckle, baked once to a canvas and reused (with different
 * `repeat`) across the steel materials. Doubles as a roughness map (seams
 * read slightly rougher than the polished plate centers) and a bump map
 * (shallow relief so seams catch specular highlights up close) — no
 * downloaded textures, matches the "generated canvas texture" spec.
 */
export function createPanelTexture(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Base plate tone — mid-gray; material.roughness is multiplied by this
  // texture's luminance, so keep it near white with seams pulled darker.
  ctx.fillStyle = '#c9c9c9'
  ctx.fillRect(0, 0, size, size)

  // Deterministic RNG so the texture is stable across rebuilds.
  let seed = 1337
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return (seed >>> 0) / 0x7fffffff
  }

  // Irregular panel grid: jittered column/row lines.
  const cols = 9
  const rows = 14
  const colXs: number[] = [0]
  for (let i = 1; i < cols; i++) colXs.push((i / cols) * size + (rand() - 0.5) * (size / cols) * 0.3)
  colXs.push(size)
  const rowYs: number[] = [0]
  for (let i = 1; i < rows; i++) rowYs.push((i / rows) * size + (rand() - 0.5) * (size / rows) * 0.3)
  rowYs.push(size)

  ctx.strokeStyle = 'rgba(40,42,46,0.55)'
  ctx.lineWidth = 2
  for (const x of colXs) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, size)
    ctx.stroke()
  }
  for (const y of rowYs) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(size, y)
    ctx.stroke()
  }

  // Per-panel subtle tone variance so plates don't read as one flat sheet.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const shade = 190 + Math.floor((rand() - 0.5) * 26)
      ctx.fillStyle = `rgba(${shade},${shade},${shade + 2},0.5)`
      ctx.fillRect(colXs[c] + 1, rowYs[r] + 1, colXs[c + 1] - colXs[c] - 2, rowYs[r + 1] - rowYs[r] - 2)
    }
  }

  // Rivet-like greeble dots along a subset of seams.
  ctx.fillStyle = 'rgba(60,62,66,0.5)'
  for (let i = 0; i < 260; i++) {
    const x = rand() * size
    const y = rand() * size
    ctx.beginPath()
    ctx.arc(x, y, 1.4, 0, Math.PI * 2)
    ctx.fill()
  }

  // Soft grime speckle for micro-contrast under close-up lighting.
  const imgData = ctx.getImageData(0, 0, size, size)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * 10
    d[i] = Math.min(255, Math.max(0, d[i] + n))
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n))
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n))
  }
  ctx.putImageData(imgData, 0, 0)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.NoColorSpace
  tex.needsUpdate = true
  return tex
}
