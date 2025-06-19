import { resolve } from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'
const isStaging = process.env.NODE_ENV === 'staging'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: false, // 複数エントリでは不要
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
      exclude: ['**/*.test.ts', '**/*.spec.ts'], // テストファイル除外
    }),
  ],
  build: {
    lib: {
      entry: {
        'components/index': resolve(__dirname, 'src/components/index.ts'),
      },
      // name: '@ecommerce/inventory', // 複数エントリでは不要
      formats: ['es'], // ESMのみでtree shaking対応
      fileName: 'index',
    },
    rollupOptions: {
      // 🔑 外部依存関係を明示的に指定
      external: [
        /^@ecommerce\//, // @ecommerce/で始まる全てのパッケージを外部化
        'react',
        'react-dom',
      ],
      output: {
        preserveModules: true, // 🔑 個別モジュールを保持
        preserveModulesRoot: 'src', // 🔑 srcディレクトリ構造を保持
        entryFileNames: '[name].js',
        exports: 'named', // 🔑 named exportを使用
        // 🔑 外部依存関係のグローバル変数指定（必要に応じて）
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    target: 'esnext', // 🔑 最新のES仕様を使用
    minify: isProduction, // 環境に応じてminify設定
    // バンドルサイズ警告とレポート設定
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
    // ソースマップ設定（本番以外で有効）
    sourcemap: isDevelopment || isTest || isStaging,
  },
  // 🔑 エイリアス設定（必要に応じて）
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 成功時のコールバック
  define: {
    // 必要に応じて環境変数を定義
  },
})
