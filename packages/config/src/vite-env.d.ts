/// <reference types="vite/client" />

// biome-ignore lint/correctness/noUnusedVariables: Type augmentation for vite env
interface ImportMetaEnv {
  readonly VITE_MODE: 'production' | 'staging' | 'development' | 'test'
}
