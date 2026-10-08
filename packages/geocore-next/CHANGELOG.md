# @mormo_mossaab/geocore-next

## 1.0.2

### Patch Changes

- 46595f4: Security and correctness fixes from the October 2026 audit:

  - `getAiContext` no longer exposes private sources, draft entities or unpublished object ids to public callers.
  - `verifyAnswerGrounding` checks every claim of the answer against the evidence and reports `unsupportedClaims`; answers with unsupported claims are no longer considered grounded.
  - Server: vector stores are isolated per instance, `POST /api/vectorize` requires an admin key, `/api/validate` requires an API key, CORS origin lists and `origin: false` are honoured, invalid `limit`/`offset` return 400 and 500 responses no longer include internal error messages.
  - CLI: the studio server rejects path traversal and no longer crashes on directory requests; `geocore serve` and `geocore studio` keep running after startup.
  - HTML helpers (`formatImageHtml`, `formatVideoHtml`, `renderCitationBadgeHtml`, `renderMediaFigureHtml`) escape their output and drop `javascript:` URLs; new `escapeHtml` and `sanitizeUrl` exports.

- 278c68d: - The loader reports `GC_LOADER_TIMESTAMP_DEFAULTED` when a Knowledge Object has no `createdAt`/`updatedAt`, instead of silently using the load time (which changed sitemap `lastmod` on every export).
  - Removed the unused `zod` dependency from every package except `@mormo_mossaab/geocore`.
- Updated dependencies [08c84e6]
- Updated dependencies [46595f4]
- Updated dependencies [278c68d]
  - @mormo_mossaab/geocore@1.1.0

## 1.0.1

### Patch Changes

- 19786db: # GeoCore 1.0.0 — Authoritative AI-Native Knowledge Operating System

  - **`@mormo_mossaab/geocore`**: 10-stage validation pipeline, knowledge graph, citations, media, static exporter, and in-process APIs.
  - **`@mormo_mossaab/geocore-cli`**: Extended CLI commands (`init`, `validate`, `export`, `inspect`, `serve`, `vectorize`, `studio`).
  - **`@mormo_mossaab/geocore-server`**: Standalone HTTP REST server with dynamic OpenAPI 3.1.0 generator and hybrid search.
  - **`@mormo_mossaab/geocore-db`**: Universal persistence layer with In-Memory and SQLite adapters.
  - **`@mormo_mossaab/geocore-vector`**: Semantic embeddings, vector store, and Reciprocal Rank Fusion (RRF) hybrid search.
  - **`@mormo_mossaab/geocore-next`**: Next.js 14+ App Router metadata, route handlers, and UI components.
  - **`@mormo_mossaab/geocore-ai`**: AI/RAG prompt context builder, semantic chunking, and citation grounding guardrails.

- Updated dependencies [19786db]
  - @mormo_mossaab/geocore@1.0.1
