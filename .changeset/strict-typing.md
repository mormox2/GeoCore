---
"@mormo_mossaab/geocore": patch
"@mormo_mossaab/geocore-cli": patch
"@mormo_mossaab/geocore-db": patch
---

Removed every explicit `any` type (91) in favour of precise types or `unknown` with type guards; CI now fails if one is reintroduced (`npm run check:any`). Visible effects:

- A Markdown frontmatter `metadata:` with a scalar value is now reported as `GC_METADATA_INVALID` instead of being spread character by character into `{ 0: …, 1: … }`.
- `SqlKnowledgeRepository` rows written before `data_json` existed now return `""` instead of `null` for a missing `summary`/`author`, matching the `KnowledgeObject` type.
- A JSON knowledge file whose root is not an object now fails with a clear error.
