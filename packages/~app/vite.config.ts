import { resolve } from 'node:path'

import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'

/**
 * @see https://vitejs.dev/config
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  /**
   * @see https://vitejs.dev/config/#using-environment-variables-in-config
   * @see https://github.com/vitejs/vite/issues/1149#issuecomment-857686209
   *
   * import.meta.envによる環境変数へのアクセスのフォールバック
   */
  const customEnv = Object.entries(env).reduce((prev, [key, val]) => {
    prev[key] = val
    return prev
  }, {})

  return {
    define: {
      'process.env': customEnv,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // React関連
            if (id.includes('react')) {
              return 'react-vendor'
            }
            // ワークスペース内のパッケージ
            if (id.includes('@ecommerce/')) {
              return 'workspace-packages'
            }
            // その他のnode_modules
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
        plugins: [
          mode === 'analyze' &&
            visualizer({
              open: true,
              filename: 'dist/stats.html',
              gzipSize: true,
              brotliSize: true,
            }),
        ],
      },
    },
  }
})
