# TypeScript Brand 型とモノレポにおける型エラーの仕様と設計指針

## 概要

モノレポ構成において、同じシグニチャでパッケージ名が異なる Brand 型に対する型エラーの発生は**仕様上の正常な動作**である。この文書では、その理由と適切な設計指針について詳述する。

## Brand 型の基本仕様

### Brand 型とは

Brand 型（ブランド型）は、TypeScript で同じ構造を持つ型を意図的に区別するためのパターンです。

```typescript
// 基本的なBrand型の例
export const ProductIDSchema = z.string().brand("ProductID");
export type ProductID = z.infer<typeof ProductIDSchema>;
export const toProductID = (maybeID: unknown) => String(maybeID) as ProductID;
```

**参考資料:**

- [TypeScript: Branded Types 🔧 - Prosopo](https://prosopo.io/blog/typescript-branding/)
- [Improve Runtime Type Safety with Branded Types in TypeScript | egghead.io](https://egghead.io/blog/using-branded-types-in-typescript)

### TypeScript の構造的型システムとの関係

- TypeScript は**構造的型システム**を採用
- 同じ構造を持つ型は通常、互換性があるとみなされる
- Brand 型は同じ構造でも**異なる型として扱う**ためのメカニズム

**参考資料:**

- [TypeScript: Documentation - Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [Branded Types | Effect Documentation](https://effect.website/docs/code-style/branded-types/)

## モノレポにおける型エラーの発生理由

### 1. モジュール境界による型分離

```typescript
// パッケージA
export const ProductIDSchema = z.string().brand("OrderProductID");
export type ProductID = z.infer<typeof ProductIDSchema>;

// パッケージB
export const ProductIDSchema = z.string().brand("InventoryProductID");
export type ProductID = z.infer<typeof ProductIDSchema>;
```

上記の場合、**同じブランド名を使用していても**、TypeScript は各パッケージで定義された型を**独立した型**として認識します。

### 2. 実際の問題例

```typescript
// パッケージAから
import {
  ProductID as ProductID_A,
  toProductID as toProductID_A,
} from "@ecommerce/order-management";
// パッケージBから
import {
  ProductID as ProductID_B,
  toProductID as toProductID_B,
} from "@ecommerce/inventory-management";

const idA = toProductID_A("PROD-123");
const idB = toProductID_B("PROD-123");

// 型エラーが発生
const processId = (id: ProductID_A) => {
  /* ... */
};
processId(idB); // Type 'ProductID_B' is not assignable to type 'ProductID_A'
```

### 3. TypeScript プロジェクト参照の影響

モノレポで TypeScript プロジェクト参照を使用する場合：

- 各パッケージは**独立した TypeScript プログラム**として扱われる
- より強固な境界が作られ、型の分離が強化される
- パッケージ間での型の更新伝播に制限がある場合がある

**参考資料:**

- [Live types in a TypeScript monorepo](https://colinhacks.com/essays/live-types-typescript-monorepo)
- [The Ultimate Guide to TypeScript Monorepos - DEV Community](https://dev.to/mxro/the-ultimate-guide-to-typescript-monorepos-5ap7)

## ファクトチェック結果

### 確認された事実

1. **TypeScript の仕様による意図的な動作**

   - 構造的型システムと Brand 型の組み合わせにより発生
   - モジュール境界を越えた場合の型分離は正常な動作
   - 参考: [TypeScript: Documentation - Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
   - 参考: [Branded Types | Learning TypeScript](https://www.learningtypescript.com/articles/branded-types)

2. **モノレポでの既知の課題**

   - パッケージ境界を越えた型の更新伝播問題が報告されている
   - 参考: [TypeScript Issue #30946 - Type updates don't propagate in monorepo across package boundaries](https://github.com/Microsoft/TypeScript/issues/30946)
   - 参考: [TypeScript Issue #54653 - Types resolving to `any` across packages in monorepo](https://github.com/microsoft/TypeScript/issues/54653)

3. **設計上の意図**
   - 異なるパッケージの同名 Brand 型の混在を防ぐため
   - 型安全性の確保が目的
   - 参考: [TypeScript Branded Types: In-depth Overview](https://dev.to/themuneebh/typescript-branded-types-in-depth-overview-and-use-cases-60e)

## 解決策と設計指針

### 1. 共有したい場合：共通型定義パッケージ

```typescript
// @your-org/shared-types パッケージ
export const ProductIDSchema = z.string().brand("ProductID");
export type ProductID = z.infer<typeof ProductIDSchema>;
export const toProductID = (maybeID: unknown) => String(maybeID) as ProductID;

// 各パッケージで共通型を再エクスポート
export {
  ProductID,
  ProductIDSchema,
  toProductID,
} from "@your-org/shared-types";
```

**利点：**

- 全パッケージで同一の型定義を共有
- 型エラーを回避
- 一元的な型管理

### 2. 区別したい場合：各パッケージで独自定義

```typescript
// @ecommerce/order-management パッケージ
export const ProductIDSchema = z.string().brand("OrderProductID");
export type ProductID = z.infer<typeof ProductIDSchema>;

// @ecommerce/inventory-management パッケージ
export const ProductIDSchema = z.string().brand("InventoryProductID");
export type ProductID = z.infer<typeof ProductIDSchema>;
```

**利点：**

- 意図的な型分離
- パッケージの独立性確保
- 相互依存の回避

## pnpm Workspace とビルド順序

### トポロジカルソートの動作

- **pnpm はデフォルトでトポロジカルソート**を使用してスクリプトを実行
- 依存関係の順序に従ってビルドが行われる
- `--no-sort`オプションで無効化可能
- 参考: [pnpm run - Official Documentation](https://pnpm.io/cli/run)
- 参考: [Managing TypeScript Packages in Monorepos | Nx Blog](https://nx.dev/blog/managing-ts-packages-in-monorepos)

### 循環依存の扱い

### pnpm の動作

- **循環依存を許可**（yarn や lerna は失敗する場合でも動作）
- ただし、**トポロジカル順序での実行を保証できない**
- 循環依存検出時に警告を出力
- 参考: [pnpm Workspaces - Official Documentation](https://pnpm.io/workspaces)
- 参考: [pnpm Issue #3056 - prevent cyclic dependencies](https://github.com/pnpm/pnpm/issues/3056)

#### 循環依存を避けるべき理由（業界の暗黙知）

1. **ビルド順序の不確定性**

   - ビルド順序の計算が困難
   - 予期しない結果を招く可能性

2. **開発ツールの混乱**

   - IDE、リンター、テストツールへの悪影響
   - リファクタリング時の脆弱性

3. **モジュール解決の複雑化**

   - require/import 順序の問題
   - 実行時エラーのリスク

4. **保守性の低下**
   - 依存関係の理解困難
   - 変更影響の予測困難

**参考資料:**

- [Circular Dependencies | Modular](https://modular.js.org/concepts/circular-dependencies/)
- [Resolve Circular Dependencies | Nx](https://nx.dev/troubleshooting/resolve-circular-dependencies)
- [Monorepo: Typescript and issues with circular dependency - Stack Overflow](https://stackoverflow.com/questions/73514035/monorepo-typescript-and-issues-with-circular-dependency-while-importing-types)

### 循環依存の解決方法

1. **共通コードの抽出**

   ```
   A ←→ B  →  A → C ← B
   ```

2. **依存関係の再設計**

   - 一方向の依存関係になるよう再構成

3. **Interface 分離**
   - 型定義を独立したパッケージに分離

## 実践的な設計判断

### ケーススタディ：注文管理と在庫管理パッケージ

**要件：**

- 本質的には同じ ProductID 型
- パッケージ管理の都合上、相互依存を避けたい
- 型レベルでの混在を防ぎたい

**パッケージ構成：**

- `@ecommerce/order-management` - 注文処理、顧客対応
- `@ecommerce/inventory-management` - 在庫管理、物流最適化

**選択した解決策：**
各パッケージで独自の Brand 型定義

```typescript
// @ecommerce/order-management
export const ProductIDSchema = z.string().brand("OrderProductID");
export type ProductID = z.infer<typeof ProductIDSchema>;

// @ecommerce/inventory-management
export const ProductIDSchema = z.string().brand("InventoryProductID");
export type ProductID = z.infer<typeof ProductIDSchema>;
```

**メリット：**

1. **相互依存の回避**

   - pnpm workspace のトポロジカルソートが可能
   - 予測可能なビルド順序

2. **型安全性の確保**

   - 注文管理文脈と在庫管理文脈での型混在を防止
   - コンパイル時エラーで誤用をキャッチ

3. **パッケージの独立性**

   - 各パッケージが自己完結
   - 一方の変更が他方に影響しない

4. **ドメイン境界の明確化**
   - 注文管理：顧客体験、販売可能性に焦点
   - 在庫管理：物流効率、在庫最適化に焦点

## 結論

1. **型エラーは仕様上正常**

   - TypeScript の設計による意図的な動作
   - 型安全性確保のための機能

2. **設計指針**

   - 共有したい場合：共通型定義パッケージ
   - 区別したい場合：各パッケージで独自定義

3. **循環依存は避けるべき**

   - 業界でのベストプラクティス
   - ビルドツール、開発ツールの正常動作のため

4. **モノレポでの型管理**
   - パッケージ境界を活用した型分離
   - 依存関係の設計が重要

この理解に基づいて、プロジェクトの要件に応じた適切な型設計を選択することが重要です。
