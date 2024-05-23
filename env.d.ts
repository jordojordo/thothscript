// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KUBESCRIPT_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}