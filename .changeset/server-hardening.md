---
"@mormo_mossaab/geocore-server": minor
"@mormo_mossaab/geocore-next": patch
"@mormo_mossaab/geocore-cli": minor
---

Harden the REST API:

- `/api/objects/:id`, `/api/entities/:id`, `/api/context/:id` and `/api/prompt-context/:id` (and `handleContextApi` in geocore-next) answer `404` instead of `403` for drafts and internal objects, so their ids cannot be probed. `/api/citations/:id`, `/api/sources/:id` and `/api/media/:id` already answered `404` and now also return a plain not-found body.
- The `?apiKey=` query parameter is deprecated: a one-time warning is logged when it is used, and `auth.allowQueryApiKey: false` accepts header keys only (`X-Api-Key` or `Authorization: Bearer`).
- `geocore serve` listens on `127.0.0.1` by default. Pass `--host 0.0.0.0` to expose it on the network.
