import { useCallback, useEffect, useRef, useState } from 'react'
import type { Face } from '../../data/faces'
import type { Locale } from '../i18n/types'
import './cube.css'

type Props = {
  projectId: string
  title: string
  faces: Face[]
  locale: Locale
  /** Load the front face eagerly (flagship, above-the-fold). */
  eagerFront?: boolean
}

type ThemeName = 'light' | 'dark'

const AUTO_ROTATE_MS = 4500
const DRAG_SENSITIVITY = 0.32
const FRICTION = 0.94
const MIN_VELOCITY = 0.02
const TWEEN_MS = 600
const TILT_MS = 320
const BASE_TILT_DEG = 0
const HOVER_TILT_RANGE = 6

function indexFromRot(rot: number) {
  const i = Math.round(-rot / 90) % 4
  return ((i % 4) + 4) % 4
}

function nearestRotForIndex(currentRot: number, index: number) {
  const target = -index * 90
  const currentMod = ((currentRot % 360) + 360) % 360
  const targetMod = ((target % 360) + 360) % 360
  let delta = targetMod - currentMod
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return currentRot + delta
}

function nearestSnap(rot: number) {
  return Math.round(rot / 90) * 90
}

function readTheme(): ThemeName {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    )
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------
// Three.js scene: built lazily, entirely isolated from React state. The
// component only ever calls the handle's imperative methods.
// ---------------------------------------------------------------------

type ScreenSlot = {
  material: import('three').MeshPhysicalMaterial
  texture: import('three').Texture | null
  face: Face
}

type SceneHandle = {
  setSize: (w: number, h: number) => void
  setRotationDeg: (rot: number) => void
  setTiltDeg: (tilt: number) => void
  setTheme: (theme: ThemeName) => void
  render: () => void
  dispose: () => void
}

function roundedRectShape(THREE: typeof import('three'), w: number, h: number, r: number) {
  const shape = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  shape.moveTo(x, y + r)
  shape.lineTo(x, y + h - r)
  shape.quadraticCurveTo(x, y + h, x + r, y + h)
  shape.lineTo(x + w - r, y + h)
  shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r)
  shape.lineTo(x + w, y + r)
  shape.quadraticCurveTo(x + w, y, x + w - r, y)
  shape.lineTo(x + r, y)
  shape.quadraticCurveTo(x, y, x, y + r)
  return shape
}

function fitTextureCover(texture: import('three').Texture, imgW: number, imgH: number) {
  if (!imgW || !imgH) return
  const ar = imgW / imgH
  if (Math.abs(ar - 1) < 0.01) {
    texture.repeat.set(1, 1)
    texture.offset.set(0, 0)
    return
  }
  if (ar > 1) {
    // wider than tall: crop the sides, keep full height
    const repeatX = 1 / ar
    texture.repeat.set(repeatX, 1)
    texture.offset.set((1 - repeatX) / 2, 0)
  } else {
    // taller than wide: crop the bottom, keep full width, top-aligned
    const repeatY = ar
    texture.repeat.set(1, repeatY)
    texture.offset.set(0, 1 - repeatY)
  }
}

function makeContactShadowTexture(THREE: typeof import('three')) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(0,0,0,0.9)')
    gradient.addColorStop(0.55, 'rgba(0,0,0,0.45)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

async function buildScene(
  canvas: HTMLCanvasElement,
  opts: {
    faces: Face[]
    projectId: string
    theme: ThemeName
    width: number
    height: number
  },
): Promise<SceneHandle> {
  const THREE = await import('three')
  const [{ RoundedBoxGeometry }, { RoomEnvironment }, { RectAreaLightUniformsLib }] = await Promise.all([
    import('three/examples/jsm/geometries/RoundedBoxGeometry.js'),
    import('three/examples/jsm/environments/RoomEnvironment.js'),
    import('three/examples/jsm/lights/RectAreaLightUniformsLib.js'),
  ])
  RectAreaLightUniformsLib.init()

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setSize(Math.max(1, opts.width), Math.max(1, opts.height), false)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(28, Math.max(opts.width, 1) / Math.max(opts.height, 1), 0.1, 20)
  const camTiltRad = THREE.MathUtils.degToRad(12)
  const camDist = 3.65
  camera.position.set(0, Math.sin(camTiltRad) * camDist, Math.cos(camTiltRad) * camDist)
  camera.lookAt(0, 0.02, 0)

  const pmrem = new THREE.PMREMGenerator(renderer)
  pmrem.compileEquirectangularShader()
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.035)
  scene.environment = envRT.texture
  pmrem.dispose()

  const tiltGroup = new THREE.Group()
  scene.add(tiltGroup)
  const spinGroup = new THREE.Group()
  tiltGroup.add(spinGroup)

  const bodyGeo = new RoundedBoxGeometry(1, 1, 1, 7, 0.17)
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xe8eaee,
    metalness: 1,
    roughness: 0.12,
    clearcoat: 0.6,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1,
  })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  spinGroup.add(body)

  // Studio lighting: two crisp key/fill bands plus a soft rim, fixed in
  // world space so highlights sweep across the chrome as the cube turns.
  const keyLight = new THREE.RectAreaLight(0xffffff, 9, 2.4, 0.3)
  keyLight.position.set(-1.6, 1.9, 2.1)
  keyLight.lookAt(0, 0, 0)
  const fillLight = new THREE.RectAreaLight(0xdfe6ef, 4, 1.8, 2.6)
  fillLight.position.set(2.1, 0.1, -1.1)
  fillLight.lookAt(0, 0, 0)
  const rimLight = new THREE.RectAreaLight(0xc8d0dc, 3, 1.6, 1.6)
  rimLight.position.set(0.2, -1.9, -1.7)
  rimLight.lookAt(0, 0, 0)
  const ambient = new THREE.AmbientLight(0xffffff, 0.16)
  scene.add(keyLight, fillLight, rimLight, ambient)

  // Contact shadow beneath the cube.
  const shadowTex = makeContactShadowTexture(THREE)
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.55,
  })
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7), shadowMat)
  shadowPlane.rotation.x = -Math.PI / 2
  shadowPlane.position.y = -0.56
  tiltGroup.add(shadowPlane)

  // Embedded screens on the four side faces.
  const sideDefs = [
    { pos: [0, 0, 0.504] as const, rot: [0, 0, 0] as const },
    { pos: [0.504, 0, 0] as const, rot: [0, Math.PI / 2, 0] as const },
    { pos: [0, 0, -0.504] as const, rot: [0, Math.PI, 0] as const },
    { pos: [-0.504, 0, 0] as const, rot: [0, -Math.PI / 2, 0] as const },
  ]
  const screenSize = 0.8
  const screenGeo = new THREE.ShapeGeometry(roundedRectShape(THREE, screenSize, screenSize, 0.09), 16)
  // ShapeGeometry writes raw shape-space coordinates into the uv attribute
  // (not normalized to the shape's bounding box) — remap into [0,1] so the
  // face texture's repeat/offset cover-crop lines up correctly.
  {
    const uv = screenGeo.getAttribute('uv')
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, uv.getX(i) / screenSize + 0.5, uv.getY(i) / screenSize + 0.5)
    }
    uv.needsUpdate = true
  }

  const four: Face[] = opts.faces.length >= 4 ? opts.faces.slice(0, 4) : []
  while (four.length < 4 && opts.faces.length > 0) four.push(opts.faces[four.length % opts.faces.length])

  const maxAniso = renderer.capabilities.getMaxAnisotropy()
  const textureLoader = new THREE.TextureLoader()
  const screens: ScreenSlot[] = []

  for (let i = 0; i < 4; i++) {
    const def = sideDefs[i]
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x0b0c0e,
      roughness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1,
    })
    const mesh = new THREE.Mesh(screenGeo, mat)
    mesh.position.set(def.pos[0], def.pos[1], def.pos[2])
    mesh.rotation.set(def.rot[0], def.rot[1], def.rot[2])
    spinGroup.add(mesh)
    screens.push({ material: mat, texture: null, face: four[i] })
  }

  function loadTexture(url: string) {
    return new Promise<import('three').Texture>((resolve, reject) => {
      textureLoader.load(
        url,
        (tex) => resolve(tex),
        undefined,
        (err) => reject(err instanceof Error ? err : new Error('texture load failed')),
      )
    })
  }

  async function applyFaceTextures(theme: ThemeName) {
    await Promise.all(
      screens.map(async (slot) => {
        if (!slot.face) return
        const src = theme === 'light' && slot.face.light ? slot.face.light : slot.face.file
        const url = `/projects/${opts.projectId}/${src}`
        try {
          const tex = await loadTexture(url)
          tex.colorSpace = THREE.SRGBColorSpace
          tex.anisotropy = maxAniso
          tex.minFilter = THREE.LinearMipmapLinearFilter
          tex.magFilter = THREE.LinearFilter
          tex.generateMipmaps = true
          tex.wrapS = THREE.ClampToEdgeWrapping
          tex.wrapT = THREE.ClampToEdgeWrapping
          const img = tex.image as { width?: number; height?: number } | undefined
          fitTextureCover(tex, img?.width ?? 1, img?.height ?? 1)
          if (slot.texture) slot.texture.dispose()
          slot.texture = tex
          slot.material.map = tex
          slot.material.color.set(0xffffff)
          slot.material.needsUpdate = true
          renderer.render(scene, camera)
        } catch {
          // Keep the dark placeholder material if a texture fails to load.
        }
      }),
    )
  }

  function applyTheme(theme: ThemeName) {
    const isLight = theme === 'light'
    bodyMat.envMapIntensity = isLight ? 1.35 : 1.0
    bodyMat.color.set(isLight ? 0xeef0f3 : 0xe3e5ea)
    screens.forEach((slot) => {
      slot.material.envMapIntensity = isLight ? 1.1 : 0.9
    })
    keyLight.intensity = isLight ? 11 : 9
    fillLight.intensity = isLight ? 5 : 4
    rimLight.intensity = isLight ? 3.4 : 3
    ambient.intensity = isLight ? 0.28 : 0.16
    shadowMat.opacity = isLight ? 0.32 : 0.6
    void applyFaceTextures(theme)
  }

  applyTheme(opts.theme)

  function setSize(w: number, h: number) {
    if (w <= 0 || h <= 0) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function setRotationDeg(rot: number) {
    spinGroup.rotation.y = THREE.MathUtils.degToRad(rot)
  }

  function setTiltDeg(tilt: number) {
    tiltGroup.rotation.x = THREE.MathUtils.degToRad(tilt)
  }

  function render() {
    renderer.render(scene, camera)
  }

  function dispose() {
    bodyGeo.dispose()
    bodyMat.dispose()
    screenGeo.dispose()
    screens.forEach((slot) => {
      slot.material.dispose()
      slot.texture?.dispose()
    })
    shadowMat.dispose()
    shadowTex.dispose()
    envRT.texture.dispose()
    renderer.dispose()
  }

  return { setSize, setRotationDeg, setTiltDeg, setTheme: applyTheme, render, dispose }
}

export function ProjectCube({ projectId, title, faces, locale, eagerFront }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const rotRef = useRef(0)
  const tiltRef = useRef(BASE_TILT_DEG)
  const velocityRef = useRef(0)
  const draggingRef = useRef(false)
  const pointerLastXRef = useRef(0)
  const pointerLastTRef = useRef(0)
  const momentumRafRef = useRef<number | null>(null)
  const tweenRafRef = useRef<number | null>(null)
  const tiltRafRef = useRef<number | null>(null)
  const hoveredRef = useRef(false)
  const focusedRef = useRef(false)
  const inViewRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const autoTimerRef = useRef<number | null>(null)

  const sceneRef = useRef<SceneHandle | null>(null)
  const buildingRef = useRef(false)
  const themeRef = useRef<ThemeName>(readTheme())

  const [activeIndex, setActiveIndex] = useState(0)
  const [theme, setThemeState] = useState<ThemeName>(() => readTheme())
  const [threeReady, setThreeReady] = useState(false)
  const [fallbackOnly, setFallbackOnly] = useState(false)

  const four = faces.length >= 4 ? faces.slice(0, 4) : [...faces, ...faces, ...faces, ...faces].slice(0, 4)

  const requestRender = useCallback(() => {
    sceneRef.current?.render()
  }, [])

  const setRot = useCallback(
    (rot: number) => {
      rotRef.current = rot
      sceneRef.current?.setRotationDeg(rot)
      requestRender()
      const idx = indexFromRot(rot)
      setActiveIndex((prev) => (prev === idx ? prev : idx))
    },
    [requestRender],
  )

  const stopMomentum = useCallback(() => {
    if (momentumRafRef.current !== null) {
      cancelAnimationFrame(momentumRafRef.current)
      momentumRafRef.current = null
    }
  }, [])

  const stopTween = useCallback(() => {
    if (tweenRafRef.current !== null) {
      cancelAnimationFrame(tweenRafRef.current)
      tweenRafRef.current = null
    }
  }, [])

  const snapTo = useCallback(
    (target: number, animate: boolean) => {
      stopTween()
      if (!animate || reducedMotionRef.current) {
        setRot(target)
        return
      }
      const from = rotRef.current
      const distance = target - from
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / TWEEN_MS)
        setRot(from + distance * easeOutCubic(t))
        if (t < 1) {
          tweenRafRef.current = requestAnimationFrame(tick)
        } else {
          tweenRafRef.current = null
        }
      }
      tweenRafRef.current = requestAnimationFrame(tick)
    },
    [setRot, stopTween],
  )

  const goToIndex = useCallback(
    (index: number) => {
      stopMomentum()
      if (sceneRef.current) {
        const target = nearestRotForIndex(rotRef.current, ((index % 4) + 4) % 4)
        snapTo(target, true)
      } else {
        setActiveIndex(((index % 4) + 4) % 4)
      }
    },
    [snapTo, stopMomentum],
  )

  const step = useCallback(
    (dir: 1 | -1) => {
      stopMomentum()
      if (sceneRef.current) {
        snapTo(rotRef.current - dir * 90, true)
      } else {
        setActiveIndex((prev) => ((prev + dir) % 4 + 4) % 4)
      }
    },
    [snapTo, stopMomentum],
  )

  const runMomentum = useCallback(() => {
    const tick = () => {
      velocityRef.current *= FRICTION
      if (Math.abs(velocityRef.current) < MIN_VELOCITY) {
        momentumRafRef.current = null
        snapTo(nearestSnap(rotRef.current), true)
        return
      }
      setRot(rotRef.current + velocityRef.current)
      momentumRafRef.current = requestAnimationFrame(tick)
    }
    momentumRafRef.current = requestAnimationFrame(tick)
  }, [setRot, snapTo])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!sceneRef.current) return
      const canvas = canvasRef.current
      if (!canvas) return
      stopMomentum()
      stopTween()
      draggingRef.current = true
      pointerLastXRef.current = e.clientX
      pointerLastTRef.current = performance.now()
      velocityRef.current = 0
      canvas.setPointerCapture(e.pointerId)
    },
    [stopMomentum, stopTween],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!draggingRef.current) return
      const now = performance.now()
      const dx = e.clientX - pointerLastXRef.current
      const dt = Math.max(1, now - pointerLastTRef.current)
      const delta = dx * DRAG_SENSITIVITY
      velocityRef.current = (delta / dt) * 16
      pointerLastXRef.current = e.clientX
      pointerLastTRef.current = now
      setRot(rotRef.current + delta)
    },
    [setRot],
  )

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!draggingRef.current) return
      draggingRef.current = false
      const canvas = canvasRef.current
      if (canvas) {
        try {
          canvas.releasePointerCapture(e.pointerId)
        } catch {
          // capture may already be released
        }
      }
      if (reducedMotionRef.current || Math.abs(velocityRef.current) < MIN_VELOCITY) {
        snapTo(nearestSnap(rotRef.current), true)
      } else {
        runMomentum()
      }
    },
    [runMomentum, snapTo],
  )

  // --- Hover tilt (fine pointer only) ------------------------------
  const setTilt = useCallback(
    (target: number, animate: boolean) => {
      if (tiltRafRef.current !== null) {
        cancelAnimationFrame(tiltRafRef.current)
        tiltRafRef.current = null
      }
      if (!animate || reducedMotionRef.current) {
        tiltRef.current = target
        sceneRef.current?.setTiltDeg(target)
        requestRender()
        return
      }
      const from = tiltRef.current
      const distance = target - from
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / TILT_MS)
        const value = from + distance * easeOutCubic(t)
        tiltRef.current = value
        sceneRef.current?.setTiltDeg(value)
        requestRender()
        if (t < 1) {
          tiltRafRef.current = requestAnimationFrame(tick)
        } else {
          tiltRafRef.current = null
        }
      }
      tiltRafRef.current = requestAnimationFrame(tick)
    },
    [requestRender],
  )

  const onStagePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (draggingRef.current) return
      const stage = stageRef.current
      if (!stage || !sceneRef.current) return
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
      const r = stage.getBoundingClientRect()
      const py = (e.clientY - r.top) / r.height
      const tilt = BASE_TILT_DEG + (0.5 - py) * HOVER_TILT_RANGE * 2
      setTilt(tilt, false)
    },
    [setTilt],
  )

  const resetTilt = useCallback(() => {
    setTilt(BASE_TILT_DEG, true)
  }, [setTilt])

  // --- Keyboard ------------------------------------------------------
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        step(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        step(-1)
      }
    },
    [step],
  )

  // --- Init: reduced motion + theme observer --------------------------
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mo = new MutationObserver(() => {
      const next = readTheme()
      themeRef.current = next
      setThemeState(next)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])

  // --- Determine once whether WebGL / motion allow the 3D scene at all -
  useEffect(() => {
    if (reducedMotionRef.current || !supportsWebGL()) {
      setFallbackOnly(true)
    }
  }, [])

  // --- Track in-view state for autorotate + dispose the scene when the
  //     cube has scrolled more than one screen away, rebuilding on return.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const activeObserver = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
      },
      { threshold: 0.35 },
    )
    activeObserver.observe(stage)

    let farObserver: IntersectionObserver | null = null
    const setupFarObserver = () => {
      farObserver?.disconnect()
      const margin = Math.round(window.innerHeight || 800)
      farObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) return
          // Fully out of the expanded bounds: more than one screen away.
          if (sceneRef.current) {
            sceneRef.current.dispose()
            sceneRef.current = null
            setThreeReady(false)
          }
        },
        { rootMargin: `${margin}px 0px ${margin}px 0px` },
      )
      farObserver.observe(stage)
    }
    setupFarObserver()
    const onResize = () => setupFarObserver()
    window.addEventListener('resize', onResize)

    return () => {
      activeObserver.disconnect()
      farObserver?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // --- Lazy-build the three.js scene once the cube nears the viewport,
  //     and rebuild it if it was disposed while still on/near screen.
  useEffect(() => {
    if (threeReady || fallbackOnly) return
    const stage = stageRef.current
    if (!stage) return
    if (reducedMotionRef.current || !supportsWebGL()) return
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || buildingRef.current || sceneRef.current) return
        buildingRef.current = true
        const canvas = canvasRef.current
        if (!canvas) {
          buildingRef.current = false
          return
        }
        const rect = stage.getBoundingClientRect()
        buildScene(canvas, {
          faces,
          projectId,
          theme: themeRef.current,
          width: rect.width,
          height: rect.height,
        })
          .then((handle) => {
            sceneRef.current = handle
            handle.setTiltDeg(tiltRef.current)
            handle.setRotationDeg(rotRef.current)
            handle.render()
            setThreeReady(true)
          })
          .catch(() => setFallbackOnly(true))
          .finally(() => {
            buildingRef.current = false
          })
      },
      { rootMargin: '200px' },
    )
    io.observe(stage)
    return () => io.disconnect()
  }, [threeReady, fallbackOnly, faces, projectId])

  // --- Resize the renderer/camera when the stage box changes ----------
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      sceneRef.current?.setSize(width, height)
      requestRender()
    })
    ro.observe(stage)
    return () => ro.disconnect()
  }, [requestRender])

  // --- Push theme changes into the live scene --------------------------
  useEffect(() => {
    themeRef.current = theme
    sceneRef.current?.setTheme(theme)
    requestRender()
  }, [theme, requestRender])

  // --- Dispose on unmount ----------------------------------------------
  useEffect(() => {
    return () => {
      stopMomentum()
      stopTween()
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [stopMomentum, stopTween])

  // --- Auto-rotate -------------------------------------------------------
  useEffect(() => {
    const tick = () => {
      autoTimerRef.current = window.setTimeout(() => {
        if (
          inViewRef.current &&
          !hoveredRef.current &&
          !focusedRef.current &&
          !draggingRef.current &&
          !reducedMotionRef.current &&
          momentumRafRef.current === null &&
          sceneRef.current
        ) {
          step(1)
        }
        tick()
      }, AUTO_ROTATE_MS)
    }
    tick()
    return () => {
      if (autoTimerRef.current !== null) window.clearTimeout(autoTimerRef.current)
    }
  }, [step])

  const onMouseEnter = () => {
    hoveredRef.current = true
  }
  const onMouseLeave = () => {
    hoveredRef.current = false
    resetTilt()
  }
  const onFocus = () => {
    focusedRef.current = true
  }
  const onBlur = () => {
    focusedRef.current = false
  }

  const activeFace = four[activeIndex]
  const showFallback = fallbackOnly || !threeReady
  const fallbackFace = four[activeIndex]
  const fallbackSrc =
    theme === 'light' && fallbackFace.light ? fallbackFace.light : fallbackFace.file
  const fallbackBase = `/projects/${projectId}/${fallbackSrc}`

  return (
    <div className="flex flex-col items-center">
      <div
        ref={stageRef}
        className="cube-stage"
        role="group"
        aria-roledescription="3D cube"
        aria-label={title}
        onPointerMove={onStagePointerMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <canvas
          ref={canvasRef}
          className="cube-canvas"
          hidden={showFallback}
          role="img"
          aria-label={`${title} — ${activeFace.label[locale]}`}
          tabIndex={showFallback ? -1 : 0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {showFallback && (
          <div
            className="cube-fallback"
            role="img"
            aria-label={`${title} — ${fallbackFace.label[locale]}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault()
                step(1)
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault()
                step(-1)
              }
            }}
          >
            <img
              key={fallbackFace.id}
              src={fallbackBase}
              sizes="(min-width: 1024px) 520px, 80vw"
              alt={fallbackFace.label[locale]}
              loading={eagerFront ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        )}
      </div>

      <div className="cube-dots" role="tablist" aria-label={title}>
        {four.map((face, i) => (
          <button
            key={face.id}
            type="button"
            className="cube-dot"
            aria-label={face.label[locale]}
            aria-current={activeIndex === i}
            onClick={() => goToIndex(i)}
          />
        ))}
      </div>

      <div className="cube-caption" key={activeIndex}>
        <p className="cube-caption__label">{activeFace.label[locale]}</p>
        <p className="cube-caption__text">{activeFace.caption[locale]}</p>
      </div>
    </div>
  )
}
