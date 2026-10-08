---
"@mormo_mossaab/geocore": patch
"@mormo_mossaab/geocore-ai": patch
"@mormo_mossaab/geocore-cli": patch
"@mormo_mossaab/geocore-db": patch
"@mormo_mossaab/geocore-next": patch
"@mormo_mossaab/geocore-server": patch
"@mormo_mossaab/geocore-vector": patch
---

- The loader reports `GC_LOADER_TIMESTAMP_DEFAULTED` when a Knowledge Object has no `createdAt`/`updatedAt`, instead of silently using the load time (which changed sitemap `lastmod` on every export).
- Removed the unused `zod` dependency from every package except `@mormo_mossaab/geocore`.
