let supported: boolean | null = null

/**
 * A page may only hold ~16 live WebGL contexts and the browser drops the
 * OLDEST one when a new context pushes past that limit. A probe that keeps
 * its context is therefore not a free question to ask — it evicts whatever
 * was created first, which on this page is the hero headline's shader. Ask
 * once, cache the answer, and hand the probe's context straight back.
 */
export function supportsWebGL(): boolean {
  if (supported !== null) return supported
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    supported = Boolean(window.WebGLRenderingContext && gl)
  } catch {
    supported = false
  }
  return supported
}
