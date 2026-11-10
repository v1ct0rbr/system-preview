/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SYSTEM_NAME?: string
  readonly VITE_SYSTEM_DESCRIPTION?: string
  readonly VITE_SYSTEM_START_DATE?: string
  readonly VITE_SYSTEM_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
