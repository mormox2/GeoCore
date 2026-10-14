---
"@mormo_mossaab/geocore-db": minor
---

`SqlKnowledgeRepository` now works on PostgreSQL as well as SQLite: saves use a portable upsert (`INSERT … ON CONFLICT (id) DO UPDATE`, SQLite ≥ 3.24 / PostgreSQL ≥ 9.5) instead of the SQLite-only `INSERT OR REPLACE`, and a new `placeholders: "postgres"` option rewrites `?` bind parameters to `$1, $2, …` for `pg`/PGlite drivers. Covered by tests on a real PostgreSQL engine (PGlite).
