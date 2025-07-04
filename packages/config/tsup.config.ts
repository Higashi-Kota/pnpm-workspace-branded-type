import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },

  // ESMのみ（tree shaking対応）
  format: ['esm'],

  // 型定義ファイルを生成（TSConfigを明示的に指定）
  dts: {
    resolve: true,
    compilerOptions: {
      composite: false,
      incremental: false,
    },
  },

  // ビルド前にdistディレクトリをクリーン
  clean: true,

  // コード分割を無効化（preserveModulesと類似効果）
  splitting: false,

  // ソースマップは不要（minifyしないため）
  sourcemap: false,

  // minifyしない（利用側で行う）
  minify: false,

  // 最新のESNext仕様
  target: 'esnext',

  // 外部依存関係を指定
  external: [],

  // バンドルを有効化
  bundle: true,

  // tree shakingを有効化
  treeshake: true,

  // プラットフォームをneutralに
  platform: 'neutral',

  // esbuildオプションでnamed exportを明示
  esbuildOptions(options) {
    options.conditions = ['import', 'module', 'default']
    options.format = 'esm'
    options.outExtension = {
      '.js': '.js',
    }
  },

  // ファイル出力設定でディレクトリ構造を保持
  outDir: 'dist',

  // 成功時のコールバック
  onSuccess: async () => {
    console.log('✅ @ecommerce/config built successfully!')
  },
})
