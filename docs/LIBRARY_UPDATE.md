## PNPM 内蔵機能のみを使用したライブラリアップデート方法

### 1. PNPM update コマンドの基本パターン

```bash
# semver範囲内でのアップデート
pnpm -r update

# 最新バージョンへのアップデート（semver範囲を超える）
pnpm -r update --latest

# エイリアスの使用
pnpm -r up --latest
pnpm -r upgrade --latest
```

### 2. 依存関係タイプ別のアップデート

```bash
# 開発依存関係のみ
pnpm -r update --dev

# 本番依存関係のみ
pnpm -r update --prod

# optionalDependenciesを除外
pnpm -r update --no-optional
```

### 3. フィルター機能による選択的アップデート

```bash
# 特定のスコープのみ
pnpm --filter "@ecommerce/*" update --latest

# アプリケーションパッケージのみ
pnpm --filter "~app" update

# features配下のみ
pnpm --filter "./packages/features/*" update

# 特定のパッケージを除外
pnpm --filter "!~app" -r update
```

### 4. 特定パッケージの指定アップデート

```bash
# TypeScript関連のみ
pnpm -r update typescript

# 複数パッケージを指定
pnpm -r update typescript @types/node vite

# 特定バージョンに更新
pnpm -r update typescript@5.8.3
```

### 5. インタラクティブなアップデート

```bash
# インタラクティブモード（パッケージを選択して更新）
pnpm -r update --interactive

# エイリアスの使用
pnpm -r update -i

# 最新バージョンをインタラクティブに選択
pnpm -r update --interactive --latest
```

### 6. Outdated チェック機能

```bash
# 全ワークスペースの古いパッケージを表示
pnpm -r outdated

# 特定のワークスペースのみ
pnpm --filter "@ecommerce/config" outdated

# 詳細な情報を表示
pnpm -r outdated --long
```

### 7. 段階的アップデート戦略

```bash
# 1. パッチレベルのみ（最も安全）
pnpm -r update

# 2. 開発依存関係の最新化
pnpm -r update --dev --latest

# 3. 特定パッケージの最新化
pnpm -r update --latest typescript @biomejs/biome

# 4. 全体の最新化（最もリスクが高い）
pnpm -r update --latest
```

### 8. ワークスペース設定での管理

```json
{
  "pnpm": {
    "overrides": {
      "typescript": "5.8.3",
      "@biomejs/biome": "1.9.4"
    },
    "updateConfig": {
      "ignoreDependencies": ["react", "react-dom"]
    }
  }
}
```

### 9. ルート package.json でのスクリプト化

```json
{
  "scripts": {
    "update:check": "pnpm -r outdated",
    "update:patch": "pnpm -r update",
    "update:dev": "pnpm -r update --dev --latest",
    "update:tools": "pnpm -r update --latest typescript @biomejs/biome vite tsup",
    "update:safe": "pnpm -r update --latest --filter '!react*'",
    "update:interactive": "pnpm -r update -i --latest",
    "update:full": "pnpm -r update --latest"
  }
}
```

### 10. アップデート後の検証（個別実行）

```bash
# アップデート実行
pnpm -r update --latest

# 検証手順（個別に実行）
pnpm install
pnpm typecheck
pnpm format
pnpm build:dev
```

## 参考リンク

### 公式ドキュメント

- [pnpm update | pnpm](https://pnpm.io/cli/update)
- [pnpm outdated | pnpm](https://pnpm.io/cli/outdated)
- [Filtering | pnpm](https://pnpm.io/filtering)
- [pnpm -r, --recursive | pnpm](https://pnpm.io/cli/recursive)
- [Workspace | pnpm](https://pnpm.io/workspaces)
- [Settings (pnpm-workspace.yaml) | pnpm](https://pnpm.io/settings)

### コミュニティリソース

- [How to Use pnpm – Installation and Common Commands - freeCodeCamp](https://www.freecodecamp.org/news/how-to-use-pnpm/)
- [A Complete guide to pnpm | Refine](https://refine.dev/blog/how-to-use-pnpm/)
- [How to Use pnpm Filter for Package Management](https://www.squash.io/how-to-use-pnpm-filter-for-package-management/)

### GitHub Issues/Discussions

- [Better update interactive · pnpm · Discussion #4394](https://github.com/orgs/pnpm/discussions/4394)
- [interactive update: show link to changelog · Issue #6314](https://github.com/pnpm/pnpm/issues/6314)
- [How do I run a build for a single workspace using pnpm? - Stack Overflow](https://stackoverflow.com/questions/75901766/how-do-i-run-a-build-for-a-single-workspace-using-pnpm)

これらの PNPM 内蔵機能だけで、効率的かつ安全にモノレポ全体の依存関係管理が可能です。
