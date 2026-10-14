# @mormo_mossaab/geocore-db

## 1.1.1

### Patch Changes

- a12a2f7: Declare the supported Node.js versions (`engines.node: ">=20"`), now tested in CI on Node 20 and Node 22.
- Updated dependencies [a12a2f7]
  - @mormo_mossaab/geocore@1.1.2

## 1.1.0

### Minor Changes

- 8dbf0fe: `SqlKnowledgeRepository` now works on PostgreSQL as well as SQLite: saves use a portable upsert (`INSERT … ON CONFLICT (id) DO UPDATE`, SQLite ≥ 3.24 / PostgreSQL ≥ 9.5) instead of the SQLite-only `INSERT OR REPLACE`, and a new `placeholders: "postgres"` option rewrites `?` bind parameters to `$1, $2, …` for `pg`/PGlite drivers. Covered by tests on a real PostgreSQL engine (PGlite).

### Patch Changes

- 70c25ce: Removed every explicit `any` type (91) in favour of precise types or `unknown` with type guards; CI now fails if one is reintroduced (`npm run check:any`). Visible effects:
  
  - A Markdown frontmatter `metadata:` with a scalar value is now reported as `GC_METADATA_INVALID` instead of being spread character by character into `{ 0: …, 1: … }`.
  - `SqlKnowledgeRepository` rows written before `data_json` existed now return `""` instead of `null` for a missing `summary`/`author`, matching the `KnowledgeObject` type.
  - A JSON knowledge file whose root is not an object now fails with a clear error.
- Updated dependencies [70c25ce]
  - @mormo_mossaab/geocore@1.1.1

## 1.0.2

### Patch Changes

- 08c84e6: Grounded widget, unified visibility and persistence fixes:

  - New `GET /api/answer?q=` endpoint: hybrid search, answer extracted verbatim from the best published object (`buildExtractiveAnswer` in geocore-ai), returned only when it passes `verifyAnswerGrounding`; otherwise `status: "no-answer"`.
  - `<geocore-widget>` now queries `{data-api-url}/answer` and shows the server's real grounding score and sources (new `fetchWidgetAnswer`, `buildAnswerUrl`, `formatGroundingLabel` exports, `data-language` attribute). It no longer displays a simulated answer.
  - `KnowledgeObject.visibility` is a typed field; `isPublicKnowledgeObject` is applied consistently by the API, search, AI context, vectorization, hybrid search, routes, static export, llms.txt and sitemaps. Private/hidden objects are hidden from internal callers too.
  - `SqlKnowledgeRepository` stores full records (`data_json`, migrated automatically by `init()`), so no object or relationship field is lost.
  - `geocore studio` works from an npm install (the Studio is bundled in the CLI package).

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
