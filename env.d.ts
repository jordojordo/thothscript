// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_THOTHSCRIPT_API: string;
  readonly VITE_WS_SECURE: boolean;
  readonly VITE_WS_HOST: string;
  readonly VITE_WS_PORT: string;
  readonly VITE_WS_PATH: string;
  readonly BASE_URL: string;
  readonly PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}