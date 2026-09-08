import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { supportsWebGL } from '../webgl'

type ThemeName = 'light' | 'dark'

function readTheme(): ThemeName {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/**
 * The hero's chrome object, as real geometry rather than a picture of one.
 *
 * It used to be `hero-torus.webp` nudged around with a 2D translate+rotate on
 * mousemove, which is why it read as a sliding sticker: the highlights never
 * moved across the surface, because they were painted into the file. Here the
 * torus is lit by a PMREM'd room environment, so turning it actually travels
 * the reflections around the tube.
 *
 * Falls back to the original still (identical framing) when WebGL is missing,
 * the context is lost, or the visitor asked for reduced motion.
 */
export function HeroObject() {
  const reduced = useReducedMotion()
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(true)

  useEffect(() => {
    // `fallback` already starts true, so the still is what shows until the
    // scene reports itself ready.
    if (reduced || !supportsWebGL()) return
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    let disposed = false
    let cleanup: (() => void) | null = null

    void (async () => {
      const THREE = await import('three')
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
      if (disposed) return

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
        // Same preference as the cubes and the headline shader: mixed
        // preferences make the browser move the page between GPUs and lose
        // every context created before the switch.
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
      camera.position.set(0, 0, 4.35)
      camera.lookAt(0, 0, 0)

      const pmrem = new THREE.PMREMGenerator(renderer)
      const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
      scene.environment = envRT.texture
      pmrem.dispose()

      // --- Geometry: a torus pushed off-round so the reflections break the
      // way molten metal does, instead of running in perfect parallel bands.
      const geo = new THREE.TorusGeometry(1, 0.42, 96, 240)
      const pos = geo.attributes.position
      const nor = geo.attributes.normal
      const uv = geo.attributes.uv
      const TAU = Math.PI * 2
      for (let i = 0; i < pos.count; i++) {
        const u = uv.getX(i)
        const v = uv.getY(i)
        const d =
          0.075 * Math.sin(3 * TAU * u + 0.6) +
          0.045 * Math.sin(2 * TAU * v + 1.9) +
          0.03 * Math.sin(2 * TAU * u + 3 * TAU * v)
        pos.setXYZ(
          i,
          pos.getX(i) + nor.getX(i) * d,
          pos.getY(i) + nor.getY(i) * d,
          pos.getZ(i) + nor.getZ(i) * d,
        )
      }
      pos.needsUpdate = true
      geo.computeVertexNormals()

      const material = new THREE.MeshPhysicalMaterial({
        color: 0xe4e7ec,
        metalness: 1,
        roughness: 0.055,
        envMapIntensity: 1.25,
      })
      const torus = new THREE.Mesh(geo, material)

      const spin = new THREE.Group()
      spin.add(torus)
      const tilt = new THREE.Group()
      tilt.add(spin)
      scene.add(tilt)
      torus.rotation.x = THREE.MathUtils.degToRad(-18)
      tilt.rotation.z = THREE.MathUtils.degToRad(-8)

      const key = new THREE.DirectionalLight(0xffffff, 3.2)
      key.position.set(2.4, 3, 3.2)
      const rim = new THREE.DirectionalLight(0xffffff, 2.1)
      rim.position.set(-3, -1.4, -2.4)
      const ambient = new THREE.AmbientLight(0xffffff, 0.25)
      scene.add(key, rim, ambient)

      function applyTheme(theme: ThemeName) {
        const isLight = theme === 'light'
        material.color.set(isLight ? 0xd8dbe1 : 0xe4e7ec)
        material.envMapIntensity = isLight ? 1.05 : 1.25
        renderer.toneMappingExposure = isLight ? 0.95 : 1.05
      }
      applyTheme(readTheme())
      const themeMo = new MutationObserver(() => applyTheme(readTheme()))
      themeMo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

      // Frame from the geometry's own bounding sphere: it is centred on the
      // torus and tight to the vertices, so it covers every orientation the
      // spin passes through without the camera ever needing to move. (A
      // Box3's bounding sphere is circumscribed on the *box* — corner to
      // corner — which here reads 2.18 against a true 1.5 and would push the
      // camera 45% too far back.)
      geo.computeBoundingSphere()
      const radius = geo.boundingSphere?.radius ?? 1.5
      const FRAME_MARGIN = 1.06

      const resize = () => {
        const r = host.getBoundingClientRect()
        const w = Math.max(1, Math.round(r.width))
        const h = Math.max(1, Math.round(r.height))
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        const vHalf = THREE.MathUtils.degToRad(camera.fov) / 2
        const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect)
        camera.position.z = (radius / Math.sin(Math.min(vHalf, hHalf))) * FRAME_MARGIN
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(host)

      // Pointer only leans the object; the constant slow turn is what makes
      // the surface read as metal.
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      let targetX = 0
      let targetY = 0
      let leanX = 0
      let leanY = 0
      const onMove = (e: MouseEvent) => {
        targetX = (e.clientY / window.innerHeight - 0.5) * -0.5
        targetY = (e.clientX / window.innerWidth - 0.5) * 0.7
      }
      if (fine) window.addEventListener('mousemove', onMove, { passive: true })

      let inView = true
      const io = new IntersectionObserver(([entry]) => (inView = entry?.isIntersecting ?? true), {
        threshold: 0,
      })
      io.observe(host)

      let raf = 0
      const start = performance.now()
      const loop = (ts: number) => {
        raf = requestAnimationFrame(loop)
        if (document.hidden || !inView) return
        const t = (ts - start) / 1000
        leanX += (targetX - leanX) * 0.045
        leanY += (targetY - leanY) * 0.045
        spin.rotation.y = t * 0.22 + leanY
        tilt.rotation.x = Math.sin(t * 0.31) * 0.07 + leanX
        renderer.render(scene, camera)
      }
      raf = requestAnimationFrame(loop)
      setFallback(false)

      const onLost = (e: Event) => {
        e.preventDefault()
        cancelAnimationFrame(raf)
        setFallback(true)
      }
      canvas.addEventListener('webglcontextlost', onLost)

      cleanup = () => {
        cancelAnimationFrame(raf)
        canvas.removeEventListener('webglcontextlost', onLost)
        io.disconnect()
        ro.disconnect()
        themeMo.disconnect()
        if (fine) window.removeEventListener('mousemove', onMove)
        geo.dispose()
        material.dispose()
        envRT.dispose()
        renderer.dispose()
      }
    })()

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [reduced])

  return (
    <div ref={hostRef} data-hero-object className="relative aspect-square">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="h-full w-full"
        style={{ display: fallback ? 'none' : 'block' }}
      />
      {fallback && (
        <img
          src="/chrome/hero-torus.webp"
          width={900}
          height={873}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
        />
      )}
    </div>
  )
}
