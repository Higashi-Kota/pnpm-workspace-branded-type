export type RuntimeMode = 'production' | 'staging' | 'development' | 'test'

export const env = {
  VITE_MODE: {
    /**
     * @see https://vitejs.dev/guide/env-and-mode.html#modes
     */
    description: '実行時のモードになります',
    value: import.meta.env.MODE as RuntimeMode,
  },
} as const
