import { resolve } from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: false,
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
      exclude: ['**/*.test.ts', '**/*.spec.ts'], // テストファイル除外
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      name: '@ecommerce/config',
      formats: ['es'], // ESMのみでtree shaking対応
      fileName: 'index',
    },
    rollupOptions: {
      // 🔑 外部依存関係を明示的に指定
      external: [
        /^@ecommerce\//, // @ecommerce/で始まる全てのパッケージを外部化
      ],
      output: {
        preserveModules: true, // 🔑 個別モジュールを保持
        preserveModulesRoot: 'src', // 🔑 srcディレクトリ構造を保持
        entryFileNames: '[name].js',
        exports: 'named', // 🔑 named exportを使用
      },
    },
    target: 'esnext', // 🔑 最新のES仕様を使用
    minify: false, // 🔑 minifyしない（利用側で行う）
    // 🔑 バンドルサイズ警告とレポート設定
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
  },
  // 🔑 エイリアス設定（必要に応じて）
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
