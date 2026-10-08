---
"@mormo_mossaab/geocore": patch
"@mormo_mossaab/geocore-ai": patch
"@mormo_mossaab/geocore-server": patch
"@mormo_mossaab/geocore-cli": patch
"@mormo_mossaab/geocore-next": patch
---

Security and correctness fixes from the October 2026 audit:

- `getAiContext` no longer exposes private sources, draft entities or unpublished object ids to public callers.
- `verifyAnswerGrounding` checks every claim of the answer against the evidence and reports `unsupportedClaims`; answers with unsupported claims are no longer considered grounded.
- Server: vector stores are isolated per instance, `POST /api/vectorize` requires an admin key, `/api/validate` requires an API key, CORS origin lists and `origin: false` are honoured, invalid `limit`/`offset` return 400 and 500 responses no longer include internal error messages.
- CLI: the studio server rejects path traversal and no longer crashes on directory requests; `geocore serve` and `geocore studio` keep running after startup.
- HTML helpers (`formatImageHtml`, `formatVideoHtml`, `renderCitationBadgeHtml`, `renderMediaFigureHtml`) escape their output and drop `javascript:` URLs; new `escapeHtml` and `sanitizeUrl` exports.
