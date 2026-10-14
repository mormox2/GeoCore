---
"@mormo_mossaab/geocore-vector": minor
"@mormo_mossaab/geocore-next": minor
"@mormo_mossaab/geocore-server": patch
---

Grounded answers are now available outside the standalone server:

- `geocore-vector` exports `findGroundedAnswer` (hybrid search → extractive answer → grounding check, `null` when nothing grounded matches), `ensureVectorized` and the `GroundedAnswer` type.
- `geocore-next` exports `handleAnswerApi(dataset, request)`, a route handler with the same contract as `GET /api/answer`, so `<geocore-widget>` works with a Next.js app (`data-api-url="/api/geocore"`).
- `geocore-server` uses the shared implementation; behaviour is unchanged.
