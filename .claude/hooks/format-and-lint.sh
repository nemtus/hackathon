#!/usr/bin/env bash
# PostToolUse hook: 編集されたファイルを自動整形（Prettier）し、ESLint で検査する。
# モノレポ対応: functions/ 配下のファイルは functions/ を cwd にして実行する
#   （functions/.eslintrc.js の parserOptions.project が cwd 依存のため）。
# 整形は副作用として行い、lint は情報提供のみ。何があってもブロックしない（exit 0）。
set -uo pipefail

# リポジトリルート（このスクリプトは <repo>/.claude/hooks/ にある）
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# stdin の JSON から編集対象ファイルパスを取得
input="$(cat)"
file="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null)"
[ -z "$file" ] && exit 0
[ -f "$file" ] || exit 0

# 絶対パスへ正規化
case "$file" in
  /*) abs="$file" ;;
  *)  abs="$REPO_ROOT/$file" ;;
esac

# 拡張子で処理を振り分け
run_eslint=0
case "$file" in
  *.ts|*.tsx|*.js|*.jsx) run_eslint=1 ;;
  *.json|*.css|*.scss|*.md|*.html|*.yml|*.yaml) run_eslint=0 ;;
  *) exit 0 ;;  # 対象外は何もしない
esac

# functions/ 配下かどうかで作業ディレクトリを切り替える
case "$abs" in
  "$REPO_ROOT"/functions/*) workdir="$REPO_ROOT/functions" ;;
  *)                        workdir="$REPO_ROOT" ;;
esac

cd "$workdir" || exit 0

# 自動整形（失敗してもブロックしない）
npx --no-install prettier --write "$abs" >/dev/null 2>&1 || true

# Lint は警告表示のみ。エラーがあれば stderr に出して Claude にフィードバックするが
# exit 2 ではなく exit 0 でブロックしない（整形済みコードはそのまま採用させる）。
if [ "$run_eslint" -eq 1 ]; then
  if ! eslint_out="$(npx --no-install eslint "$abs" 2>&1)"; then
    printf 'ESLint の警告/エラー (%s):\n%s\n' "$file" "$eslint_out" >&2
  fi
fi

exit 0
