---
"@mormo_mossaab/geocore": minor
"@mormo_mossaab/geocore-ai": minor
"@mormo_mossaab/geocore-server": minor
"@mormo_mossaab/geocore-vector": patch
"@mormo_mossaab/geocore-db": patch
"@mormo_mossaab/geocore-cli": patch
---

Grounded widget, unified visibility and persistence fixes:

- New `GET /api/answer?q=` endpoint: hybrid search, answer extracted verbatim from the best published object (`buildExtractiveAnswer` in geocore-ai), returned only when it passes `verifyAnswerGrounding`; otherwise `status: "no-answer"`.
- `<geocore-widget>` now queries `{data-api-url}/answer` and shows the server's real grounding score and sources (new `fetchWidgetAnswer`, `buildAnswerUrl`, `formatGroundingLabel` exports, `data-language` attribute). It no longer displays a simulated answer.
- `KnowledgeObject.visibility` is a typed field; `isPublicKnowledgeObject` is applied consistently by the API, search, AI context, vectorization, hybrid search, routes, static export, llms.txt and sitemaps. Private/hidden objects are hidden from internal callers too.
- `SqlKnowledgeRepository` stores full records (`data_json`, migrated automatically by `init()`), so no object or relationship field is lost.
- `geocore studio` works from an npm install (the Studio is bundled in the CLI package).
