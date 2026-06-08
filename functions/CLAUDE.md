# CLAUDE.md（functions）

Firebase Cloud Functions パッケージのガイド。ルートとは独立したパッケージなので、**必ず `cd functions` してからコマンドを実行する**。

## 概要

- Firebase Cloud Functions（TypeScript → CommonJS）
- Symbol SDK / firebase-admin / Slack Web API などを利用したバックエンド処理
- ビルド成果物は `lib/`（gitignore 対象。`main` は `lib/index.js`）

## 規約

- **Node**: 22（`engines.node`）
- **TypeScript**: `module: commonjs`、`target: es2017`、`strict: true`、`noUnusedLocals: true`、`noImplicitReturns: true`
- **Lint**: Google スタイル（`.eslintrc.js`、`root: true`、`eslint-config-google` + `@typescript-eslint` + import）
- **整形**: ルートと同じ Prettier 設定（設定ファイルは親ディレクトリから解決される）

## 主要コマンド（`functions/` 内で実行）

```bash
cd functions
npm run lint          # ESLint（--ext .js,.ts）
npm run format        # Prettier で整形
npm run build         # tsc → lib/ に出力
npm run build:watch   # tsc --watch
npm run serve         # エミュレータ起動（auth/firestore/storage/functions）
npm run shell         # functions:shell
npm run deploy        # firebase deploy --only functions（本番反映・要注意）
npm run logs          # functions のログ表示
```

## 注意

- `npm run deploy` は本番環境へ反映されるため、実行前に必ず確認する（権限設定で ask 対象）
- ローカル検証はエミュレータ（`npm run serve`）を使う
- 型チェックは `npm run build`（= `tsc`）で行う
