#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROFILE="${TMPDIR:-/tmp}/metatruth-chromium-smoke-$$"
LOG="$ROOT/dist/chromium-smoke.log"
mkdir -p "$ROOT/dist" "$PROFILE"
trap 'rm -rf "$PROFILE"' EXIT
set +e
timeout 10s chromium --headless=new --no-sandbox --disable-gpu \
  --user-data-dir="$PROFILE" \
  --disable-extensions-except="$ROOT/extension" \
  --load-extension="$ROOT/extension" \
  about:blank >"$LOG" 2>&1
set -e
if grep -Eqi 'Failed to load extension|manifest.*(error|invalid)|extension.*(failed|invalid)' "$LOG"; then
  echo "Chrome extension smoke test failed"
  grep -Ei 'Failed to load extension|manifest.*(error|invalid)|extension.*(failed|invalid)' "$LOG" || true
  exit 1
fi
echo "Chromium smoke test passed: no extension/manifest load errors detected."
