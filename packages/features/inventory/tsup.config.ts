import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'components/index': 'src/components/index.ts',
  },

  // ESMのみ（tree shaking対応）
  format: ['esm'],

  // 型定義ファイルを生成
  dts: {
    resolve: true,
    compilerOptions: {
      composite: false, // TypeScriptの複合プロジェクト機能を無効化
      incremental: false, // TypeScriptの増分コンパイルを無効化
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
  external: [
    /^@ecommerce\//, // @ecommerce/で始まる全てのパッケージを外部化
    'react',
    'react-dom',
    'react/jsx-runtime',
  ],

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

  // ファイル出力設定でディレクトリ構造を保持s
  outDir: 'dist',

  // 成功時のコールバック
  onSuccess: async () => {
    console.log('✅ @ecommerce/inventory built successfully!')
  },
})
