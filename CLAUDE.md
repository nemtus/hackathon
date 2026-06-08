# CLAUDE.md

このリポジトリで作業する際の Claude Code 向けガイドです。

## プロジェクト概要

NEMTUS ハッカソン用の Web アプリケーション。React + Firebase + Symbol ブロックチェーンのテンプレートをベースにしている。

- **フロントエンド**（リポジトリルート）: React 18 + Vite + TypeScript + TailwindCSS / daisyUI
- **バックエンド**（`functions/`）: Firebase Cloud Functions（TypeScript）。詳細は [functions/CLAUDE.md](functions/CLAUDE.md) を参照
- **インフラ**: Firebase（Authentication / Firestore / Storage / Functions / Hosting）
- **ブロックチェーン**: Symbol SDK

> 注: `README.md` には Create React App と書かれているが、実体は **Vite** ベース。README は古いので CLAUDE.md を正とする。

## モノレポ構成

```
.                     # フロントエンド（Vite/React）パッケージ
├── src/              # React アプリ本体（components / models / utils / images）
├── public/           # 静的アセット
├── functions/        # Firebase Functions（独立した package.json / tsconfig / eslint）
├── firebase.json     # Firebase サービス設定（hosting / functions / emulators など）
├── firestore.rules   # Firestore セキュリティルール
├── firestore.indexes.json
├── storage.rules     # Storage セキュリティルール
└── .firebaserc       # Firebase プロジェクトのエイリアス
```

ルートと `functions/` は **別パッケージ**。依存もコマンドも独立しているため、`functions/` を触るときは `cd functions` してから作業する。

## 主要コマンド（ルート）

```bash
npm run dev         # 開発サーバ起動（Vite）
npm run lint        # ESLint（src/**/*.{js,jsx,ts,tsx}）
npm run format      # Prettier で全体整形
npm run typecheck   # tsc --noEmit（型チェックのみ）
npm run build       # 型チェック + 本番ビルド（dist 出力）
npm run build:testnet   # testnet モードでビルド
npm run build:mainnet   # mainnet モードでビルド
npm run preview     # ビルド結果のプレビュー
```

## 規約

- **Node**: ルートは Node 24（`.nvmrc`）。`functions/` は Node 22（`engines.node`）
- **整形**: Prettier（`singleQuote: true`、`printWidth: 80`、`semi: true`、`tabWidth: 2`、`endOfLine: lf`）
- **Lint**: ESLint（`eslint:recommended` + React + `@typescript-eslint`）
- **npm**（`.npmrc`）:
  - `ignore-scripts=true` — 依存のライフサイクルスクリプトを無効化（サプライチェーン対策）。ネイティブビルドが必要な依存は `npm rebuild <pkg>` で明示的に実行する
  - `save-exact=true` — 新規依存はバージョン固定で追加される
  - `audit-level=high` — 監査閾値は high

## セキュリティ（重要）

- `.env` 系ファイル（`.env` / `.env.mainnet` / `.env.testnet` / `*.encoded` / `*.decoded`）には**秘密情報が含まれる**。**絶対にコミット・標準出力・チャットへ出力しない**（`.gitignore` 済み）。これらは Claude Code の権限設定で読み取りを deny している
- 環境変数は base64 で encode/decode して受け渡す運用:
  ```bash
  npm run encode-env --from=.env --to=.env.encoded
  npm run decode-env --from=.env.encoded --to=.env
  ```
- Firebase の `firestore.rules` / `storage.rules` を変更したら、セキュリティ上の影響を必ず確認する

## CI

- `.github/workflows/ci-react.yml` — PR ごとに `npm audit` → `npm ci` → `npm run build`
- `.github/workflows/ci-functions.yml` — 同上を `functions/` で実行
- いずれも Node 24 環境。コミット前に `npm run typecheck` / `npm run build` が通ることを確認する
