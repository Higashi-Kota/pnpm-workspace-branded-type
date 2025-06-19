# パッケージとしてのコマンド設定

## Rslib

```json
{
  "scripts": {
    "clean": "rm -rf dist node_modules *.tsbuildinfo",
    "build:dev": "NODE_ENV=development rslib build",
    "build:test": "NODE_ENV=test rslib build",
    "build:stg": "NODE_ENV=staging rslib build",
    "build:prod": "NODE_ENV=production rslib build",
    "build:watch": "NODE_ENV=development rslib build --watch",
    "package:check": "taze",
    "knip": "knip --include dependencies,optionalPeerDependencies,unlisted,binaries,unresolved",
    "typecheck": "tsc --build",
    "format": "biome format --write .",
    "format:fix": "biome check . --fix --unsafe",
    "dev": "NODE_ENV=development rslib build --watch",
    "dev:tsc": "tsc --build --watch"
  }
}
```

## Tsup

```json
{
  "scripts": {
    "clean": "rm -rf dist node_modules *.tsbuildinfo",
    "build:dev": "tsup --env.NODE_ENV=development",
    "build:test": "tsup --env.NODE_ENV=test",
    "build:stg": "tsup --env.NODE_ENV=staging",
    "build:prod": "tsup --env.NODE_ENV=production",
    "build:watch": "tsup --watch --env.NODE_ENV=development",
    "package:check": "taze",
    "knip": "knip --include dependencies,optionalPeerDependencies,unlisted,binaries,unresolved",
    "typecheck": "tsc --build",
    "format": "biome format --write .",
    "format:fix": "biome check . --fix --unsafe",
    "dev": "tsup --watch --env.NODE_ENV=development",
    "dev:tsc": "tsc --build --watch"
  }
}
```

## Vite

```json
{
  "scripts": {
    "clean": "rm -rf dist node_modules *.tsbuildinfo",
    "build:dev": "tsc --build && vite build --mode development",
    "build:test": "tsc --build && vite build --mode test",
    "build:stg": "tsc --build && vite build --mode staging",
    "build:prod": "tsc --build && vite build --mode production",
    "build:watch": "tsc --build && vite build --mode development --watch",
    "package:check": "taze",
    "knip": "knip --include dependencies,optionalPeerDependencies,unlisted,binaries,unresolved",
    "typecheck": "tsc --build",
    "format": "biome format --write .",
    "format:fix": "biome check . --fix --unsafe",
    "dev": "tsc --build && vite build --mode development --watch",
    "dev:tsc": "tsc --build --watch"
  }
}
```
