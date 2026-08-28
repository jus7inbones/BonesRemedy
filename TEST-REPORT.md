# MetaTruth v0.4.0 Test Report

## Passed
- Manifest V3 schema/version checks.
- Required extension-file checks.
- JavaScript syntax checks with Node.js.
- MV3 CSP checks: no inline scripts or inline event handlers.
- No `eval()` or `new Function()` in extension JavaScript.
- No remote JavaScript/CSS resources in extension pages.
- Manifest service-worker/content-script references resolve.
- Chrome ZIP integrity and root layout checked.
- Chromium headless smoke launch with the unpacked extension produced no extension or manifest load errors.

## Functional workflow implemented
1. Create a Bones case.
2. Open Google, Bing, and DuckDuckGo searches for the active case.
3. Inspect a result in the browser.
4. Capture the active page from the extension popup.
5. Store URL, title, excerpt, timestamp, and SHA-256 provenance hash.
6. Link the evidence to the active case.
7. Remedy reviews: Approve, Reject, or Need More Evidence.
8. Stage approved cases into a non-public deployment record.

## Deliberate constraints
- No automatic guilt verdict.
- No automatic public accusation/publication.
- Full-page evidence capture happens only on explicit user action.
- The browser audit hash chain is a prototype integrity mechanism, not a legally immutable archive.
