/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CALENDLY_URL: string
  readonly VITE_FORM_ENDPOINT: string
  readonly VITE_FORM_ACCESS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
