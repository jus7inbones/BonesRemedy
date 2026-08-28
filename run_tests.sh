#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 "$ROOT/tests/test_release.py"
for f in "$ROOT"/extension/*.js; do node --check "$f"; done
echo "All MetaTruth tests passed."
