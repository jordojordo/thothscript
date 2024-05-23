// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KUBESCRIPT_API: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}