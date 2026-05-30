/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CALENDLY_URL: string
  readonly VITE_FORM_ENDPOINT: string
  readonly VITE_FORM_ACCESS_KEY: string
  readonly VITE_SPLINE_RETRO_URL?: string
  readonly VITE_SPLINE_TYPE_URL?: string
  readonly VITE_SPLINE_ORBIT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
