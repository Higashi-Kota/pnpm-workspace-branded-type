# TreeShaking 実装ガイド：規模別サブパスディレクトリ戦略

## 目次

1. [TreeShaking の一般的手法](#treeshakingの一般的手法)
2. [全体バレルの問題点と IDE 補完への影響](#全体バレルの問題点とide補完への影響)
3. [規模別サブパスディレクトリ戦略](#規模別サブパスディレクトリ戦略)
4. [実装パターン集](#実装パターン集)
5. [ベストプラクティス](#ベストプラクティス)

## TreeShaking の一般的手法

### 1. **TreeShaking の基本原理**

Tree Shaking は、ECMAScript module (ESM) の静的構造に依存して、未使用のコードを削除する技術です。この概念は Rollup チームによって JavaScript コミュニティに広められ、Webpack 2 以降でも標準サポートされています。

#### ESModule + sideEffects 設定

```json
{
  "type": "module",
  "sideEffects": false,
  "exports": {
    "./feature": {
      "import": "./dist/feature/index.js",
      "types": "./dist/feature/index.d.ts"
    }
  }
}
```

#### ビルドツール設定

```typescript
// tsup.config.ts
export default defineConfig({
  format: ["esm"], // ESMのみ
  treeshake: true, // Tree Shaking有効
  splitting: false, // 機能別分割
  external: [/^@scope\//], // 外部パッケージ
  bundle: true, // バンドル有効
  target: "esnext", // 最新ターゲット
});
```

### 2. **エクスポート戦略と Tree Shaking**

#### A. 名前付きエクスポート（推奨）

```typescript
// ✅ Tree Shakingフレンドリー
export const utilityFunction = () => {};
export const anotherFunction = () => {};
```

#### B. 再エクスポート（`*` を含む）

Webpack と Rollup は `export *` に対して Tree Shaking をサポートしていますが、esbuild では star-export の Tree Shaking サポートが限定的です。

```typescript
// ✅ 選択的エクスポート（全バンドラーで対応）
export { specificFunction } from "./module";
export { anotherFunction } from "./another-module";

// ✅ ワイルドカード再エクスポート（Webpack/Rollupで対応）
export * from "./string-module"; // 必要な関数のみがバンドル
export * from "./number-module"; // 未使用分は除去される
```

#### C. 避けるべきパターン

```typescript
// ❌ デフォルトエクスポートのオブジェクト（Tree Shaking困難）
export default { utility1, utility2, utility3 };

// ❌ 副作用のあるコード
import "./side-effect-module"; // 常にバンドルされる
```

### 3. **ツール別 Tree Shaking 対応状況**

| バンドラー        | ESM Tree Shaking | `export *` 対応 | `sideEffects` 対応 | 参考リンク                                                                             |
| ----------------- | ---------------- | --------------- | ------------------ | -------------------------------------------------------------------------------------- |
| **Webpack**       | ✅ v2+           | ✅ 完全対応     | ✅ 完全対応        | [Webpack Tree Shaking](https://webpack.js.org/guides/tree-shaking/)                    |
| **Rollup**        | ✅ デフォルト    | ✅ 完全対応     | ✅ 対応            | [Rollup Tree Shaking](https://rollupjs.org/introduction/#tree-shaking)                 |
| **esbuild**       | ✅ デフォルト    | ⚠️ 既知の制限   | ✅ 対応            | [esbuild Issues #1420](https://github.com/evanw/esbuild/issues/1420)                   |
| **Vite (Rollup)** | ✅ デフォルト    | ✅ 完全対応     | ✅ 完全対応        | [Vite Build Optimizations](https://vitejs.dev/guide/features.html#build-optimizations) |
| **Rslib**         | ✅ デフォルト    | ✅ 完全対応     | ✅ 完全対応        | [Rslib Build](https://rslib.rs/guide/start/)                                           |

## 全体バレルの問題点と IDE 補完への影響

### 問題 1: IDE 補完での非効率なパス提案

```typescript
// IDEで `Button` と入力時の補完候補
// ❌ 最短パスとして表示（非効率）
import { Button } from "@ecommerce/components"; // 全体バレル

// ✅ より長いが効率的（本来推奨したいパス）
import { Button } from "@ecommerce/components/core"; // 機能別サブパス
```

### 問題 2: 意図しない依存関係の導入

```typescript
// ❌ 全体バレル経由で重い依存関係も含む可能性
import { Button } from "@ecommerce/components";
// → Button以外のDataGrid, Chart等も評価される可能性

// ✅ 必要最小限の依存関係
import { Button } from "@ecommerce/components/core";
// → coreの機能のみ
```

### 問題 3: sideEffects の影響

package.json の sideEffects プロパティは、バンドラーがモジュールの「純粋性」を判断するためのヒントです。全体バレルがあると、この最適化が効果的に働かない場合があります。

### 解決策: 全体バレルの廃止

```json
{
  "exports": {
    // ❌ 全体バレルは提供しない
    // ".": "./dist/index.js",

    // ✅ 機能別のみ提供
    "./core": "./dist/core/index.js",
    "./layout": "./dist/layout/index.js",
    "./advanced": "./dist/advanced/index.js"
  }
}
```

## 規模別サブパスディレクトリ戦略

### 小規模パッケージ（5-15 個の機能）

#### 設計方針

- **サブパス数**: 2-4 個
- **粒度**: 使用頻度・機能系統別
- **全体バレル**: 提供しない

#### 実装例: Utils パッケージ

```
packages/utils/
├── src/
│   ├── string/          # 文字列操作（5-7個の関数）
│   ├── number/          # 数値操作（4-6個の関数）
│   └── validation/      # バリデーション（3-5個の関数）
└── package.json
```

```json
{
  "exports": {
    "./string": "./dist/string/index.js",
    "./number": "./dist/number/index.js",
    "./validation": "./dist/validation/index.js"
  }
}
```

```typescript
// 使用例（IDEで適切なパスが提案される）
import { capitalize, slugify } from "@ecommerce/utils/string";
import { formatCurrency } from "@ecommerce/utils/number";
```

### 中規模パッケージ（15-50 個の機能）

#### 設計方針

- **サブパス数**: 4-8 個
- **粒度**: 機能別 + 複雑度別
- **階層**: 最大 2 階層まで

#### 実装例: Components パッケージ

```
packages/components/
├── src/
│   ├── core/           # 基本UI（Button, Input等）
│   ├── layout/         # レイアウト（Container, Grid等）
│   ├── form/           # フォーム（Form, Field等）
│   ├── data/           # データ表示（Table, List等）
│   └── advanced/       # 高機能（DataGrid, Chart等）
└── package.json
```

```json
{
  "exports": {
    "./core": "./dist/core/index.js",
    "./layout": "./dist/layout/index.js",
    "./form": "./dist/form/index.js",
    "./data": "./dist/data/index.js",
    "./advanced": "./dist/advanced/index.js"
  }
}
```

### 大規模パッケージ（50 個以上の機能）

#### 設計方針

- **サブパス数**: 8-15 個
- **粒度**: ドメイン別 + 技術別
- **階層**: ワイルドカードサブパス（2-3 階層）

#### 実装例: 大規模 UI ライブラリ

```json
{
  "exports": {
    "./core/*": "./dist/core/*/index.js",
    "./layout/*": "./dist/layout/*/index.js",
    "./feedback/*": "./dist/feedback/*/index.js",
    "./data-display/*": "./dist/data-display/*/index.js"
  }
}
```

```typescript
// ワイルドカードサブパス
import { Button } from "@ecommerce/ui-system/core/button";
import { Alert } from "@ecommerce/ui-system/feedback/alert";
import { Table } from "@ecommerce/ui-system/data-display/table";
```

## 実装パターン集

### パターン 1: 機能別分離（推奨）

```typescript
// packages/utils/src/string/index.ts
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
export const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, "-");
export const truncate = (str: string, length: number) =>
  str.length > length ? str.slice(0, length) + "..." : str;
```

### パターン 2: 複雑度別分離

```typescript
// packages/components/src/core/index.ts - 軽量コンポーネント
export { Button } from "./button";
export { Input } from "./input";

// packages/components/src/advanced/index.ts - 重いコンポーネント
export { DataGrid } from "./data-grid";
export { Chart } from "./chart";
```

### パターン 3: 条件付きエクスポート

```typescript
// packages/logger/package.json
{
  "exports": {
    ".": {
      "development": "./dist/dev/index.js",
      "production": "./dist/prod/index.js",
      "default": "./dist/index.js"
    }
  }
}
```

## ベストプラクティス

### 1. **sideEffects の適切な設定**

sideEffects は副作用のないコードをバンドラーに知らせる重要なプロパティです。

```json
{
  "sideEffects": false,
  // または特定のファイルのみ指定
  "sideEffects": ["**/*.css", "**/*.scss"]
}
```

### 2. **ESM フォーマットの使用**

Tree Shaking を確実に動作させるためには、ESM フォーマットでコードを配布する必要があります。

```typescript
// tsup.config.ts
export default defineConfig({
  format: ["esm"], // CommonJS ではなく ESM を使用
  // ...
});
```

### 3. **TypeScript 設定の最適化**

TypeScript や Babel コンパイラーが CommonJS を出力しないよう注意が必要です。

```json
{
  "compilerOptions": {
    "module": "ESNext", // CommonJS ではなく ESNext
    "moduleResolution": "bundler",
    "target": "ESNext"
  }
}
```

### 4. **ビルド設定テンプレート（tsup）**

tsup は esbuild をベースとした高速なバンドラーで、Tree Shaking をデフォルトでサポートしています。

```typescript
// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "core/index": "src/core/index.ts",
    "utils/index": "src/utils/index.ts",
    "advanced/index": "src/advanced/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: [/^@ecommerce\//],
  target: "esnext",
  platform: "neutral",
});
```

### 5. **検証・監視**

#### Bundle Analyzer 設定

```typescript
// vite.config.ts
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    visualizer({
      filename: "dist/bundle-analysis.html",
      template: "treemap",
      gzipSize: true,
    }),
  ],
});
```

## 重要な注意事項

### 1. **`export *` の使用について**

- Webpack と Rollup では `export *` も適切に Tree Shaking されます
- esbuild では star-export の Tree Shaking サポートが限定的なため、より具体的なエクスポートを推奨

### 2. **バンドラー別の対応状況**

- Rollup では ESM を使用するだけで自動的に Tree Shaking が有効
- Webpack では production モードで自動的に Tree Shaking が有効
- tsup（esbuild ベース）では treeshake オプションで制御可能

### 3. **開発体験の最適化**

- 全体バレルを避けることで、IDE 補完が適切な（効率的な）パスを提案
- サブパス別のアプローチにより、開発者の意図が明確になる

## まとめ

### 規模別推奨戦略

| パッケージ規模       | サブパス数 | 全体バレル | 階層     | `export *` 使用   |
| -------------------- | ---------- | ---------- | -------- | ----------------- |
| 小規模（5-15 機能）  | 2-4 個     | ❌ なし    | 1 階層   | ✅ 適切           |
| 中規模（15-50 機能） | 4-8 個     | ❌ なし    | 1-2 階層 | ✅ 適切           |
| 大規模（50+機能）    | 8-15 個    | ❌ なし    | 2-3 階層 | ⚠️ バンドラー依存 |

### 重要な原則

1. **全体バレルは避ける** - IDE 補完で非効率なパスが提案される
2. **ESM フォーマットを使用** - Tree Shaking の前提条件
3. **sideEffects を適切に設定** - バンドラーの最適化を支援
4. **バンドラーの特性を理解** - ツール別の対応状況を把握
5. **段階的な最適化** - 既存コードへの影響を最小化

## 参考リンク

- [Webpack Tree Shaking Guide](https://webpack.js.org/guides/tree-shaking/)
- [Rollup Tree Shaking](https://rollupjs.org/introduction/#tree-shaking)
- [Smashing Magazine: Tree-Shaking Reference Guide](https://www.smashingmagazine.com/2021/05/tree-shaking-reference-guide/)
- [Creating a tree-shakable library with tsup](https://dorshinar.me/posts/treeshaking-with-tsup)
- [esbuild Tree Shaking Issues](https://github.com/evanw/esbuild/issues/1420)
- [Tree-Shaking React Component Libraries in Rollup](https://www.codefeetime.com/post/tree-shaking-a-react-component-library-in-rollup/)

この戦略により、使い勝手を保ちながら最適な Tree Shaking を実現できます。
