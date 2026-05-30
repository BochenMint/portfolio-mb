import { useEffect, useRef } from 'react'

const SIZE = 256

function paintGrain(ctx: CanvasRenderingContext2D) {
  const imageData = ctx.createImageData(SIZE, SIZE)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
    data[i + 3] = 28 + Math.random() * 40
  }
  ctx.putImageData(imageData, 0, 0)
}

export function RetroGrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    paintGrain(ctx)

    let frame = 0
    let raf = 0
    const tick = () => {
      frame += 1
      if (frame % 4 === 0) paintGrain(ctx)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      className="hero-retro-grain-canvas absolute inset-0 h-full w-full"
    />
  )
}
