#!/usr/bin/env bash
# Stop hook: 作業終了時に両パッケージの型チェック（tsc --noEmit）を実行する。
# 型エラーがあれば exit 2 + stderr で Claude にフィードバックし、修正を促す。
# build は重いため hook では実行しない（必要時に手動で `npm run build`）。
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

status=0
report=""

# ルート（フロントエンド）の型チェック
if [ -f "$REPO_ROOT/tsconfig.json" ]; then
  if ! out="$(cd "$REPO_ROOT" && npx --no-install tsc --noEmit 2>&1)"; then
    status=2
    report+=$'\n[root] tsc --noEmit に失敗:\n'"$out"$'\n'
  fi
fi

# functions（バックエンド）の型チェック
if [ -f "$REPO_ROOT/functions/tsconfig.json" ]; then
  if ! out="$(cd "$REPO_ROOT/functions" && npx --no-install tsc --noEmit 2>&1)"; then
    status=2
    report+=$'\n[functions] tsc --noEmit に失敗:\n'"$out"$'\n'
  fi
fi

if [ "$status" -ne 0 ]; then
  printf '型チェック (typecheck) でエラーがあります。修正してください。%s' "$report" >&2
  exit 2
fi

exit 0
