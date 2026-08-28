# v0.5 Evidence Adapter Architecture

Browser page / manual source
→ canonical URL normalization
→ duplicate suppression
→ evidence provenance record
→ source-quality heuristic
→ claim/evidence relevance heuristic
→ case provenance matrix
→ Remedy human review
→ audit chain
→ staging deployment

Production adapters should be server-side or use explicitly authorized APIs. Search-engine scraping is intentionally not embedded as a stealth background collector.
