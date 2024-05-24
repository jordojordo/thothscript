// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_THOTHSCRIPT_API: string;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}