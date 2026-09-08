/** Map a pointer into an element's local CSS pixels and 0–1 UV. */
export function pointerOnElement(
  clientX: number,
  clientY: number,
  el: Element,
): { x: number; y: number; nx: number; ny: number; width: number; height: number } {
  const rect = el.getBoundingClientRect()
  const width = Math.max(rect.width, 1)
  const height = Math.max(rect.height, 1)
  const x = clientX - rect.left
  const y = clientY - rect.top
  return { x, y, nx: x / width, ny: y / height, width, height }
}

/** Size a 2D canvas to its CSS box and draw in CSS pixels. */
export function fit2dCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  maxDpr: number,
): { w: number; h: number } {
  const rect = canvas.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
  const w = Math.max(1, Math.round(rect.width))
  const h = Math.max(1, Math.round(rect.height))
  const bw = Math.round(w * dpr)
  const bh = Math.round(h * dpr)
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw
    canvas.height = bh
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { w, h }
}
