# MetaTruth — Bones × Remedy v0.4.0

## Install
1. Extract `MetaTruth-Bones-Remedy-Chrome-v0.4.0.zip`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click **Load unpacked** and select the extracted extension folder.

## Functional workflow
Create a case, open three search engines, inspect results, capture relevant active pages through the extension popup, review provenance hashes in Remedy Admin, then stage approved cases.

## Dev tools
`tools/run_tests.sh` validates Manifest V3 constraints, JavaScript syntax, missing files, remote resources, inline scripts/events, and unsafe eval patterns. `tools/build_release.py` creates a clean Chrome ZIP with SHA-256.
