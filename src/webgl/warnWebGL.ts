export function warnWebGL(context: string, reason: string, detail?: unknown) {
  if (!import.meta.env.DEV) return
  console.warn(`[WebGL] ${context}: ${reason}`, detail ?? '')
}
