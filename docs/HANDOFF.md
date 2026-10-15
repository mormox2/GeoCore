# Handoff — state of the project (14 October 2026)

Written at the end of the cloud session that ran the audit and the correction lots A, B and C,
for the next session (local Claude Code on the owner's PC).

## Where things stand

- `main` is green (CI on Node 22 and Node 20), 870 tests, `npm audit`: 0 vulnerabilities.
- Merged: PRs #3–#10. No open PR.
- Published on npm:

| Package | Version |
| --- | --- |
| `@mormo_mossaab/geocore` | 1.1.2 |
| `@mormo_mossaab/geocore-ai` | 1.1.1 |
| `@mormo_mossaab/geocore-vector` | 1.1.1 |
| `@mormo_mossaab/geocore-server` | 1.2.0 |
| `@mormo_mossaab/geocore-db` | 1.1.1 |
| `@mormo_mossaab/geocore-next` | 1.1.1 |
| `@mormo_mossaab/geocore-cli` | 1.1.0 |

## What was done

The details are in `docs/PROJECT_AUDIT_REPORT.md` §10 and in each package's `CHANGELOG.md`:

- **Grounding check**: claim-level checks; answers are extractive.
- **Widget**: `<geocore-widget>` now queries the real `/api/answer`.
- **Visibility**: a single visibility rule applies on every channel.
- **SQL storage**: the adapter keeps every field, and PostgreSQL is supported.
- **Typing**: no explicit `any` remains.
- **CLI**: `geocore init [dir]`.
- **Next.js**: `handleAnswerApi`.
- **API hardening**: 404 instead of 403 for non-public resources, `?apiKey=` deprecated, `serve` binds `127.0.0.1` by default.
- **Vercel site**: CSP added.
- **Node**: `engines >=20`.
- **API reference**: `docs/api/README.md`.

## Open work

1. **Owner actions (not code):**
   - Tell API clients that non-public resources now answer `404` (not `403`) and that the
     key must move from `?apiKey=` to the `X-Api-Key` / `Authorization: Bearer` header.
   - Wherever `geocore serve` runs in a container, add `--host 0.0.0.0` (the default is now
     `127.0.0.1`).
   - Open the production site (`/` and `/studio`) once and check the browser console shows
     no CSP violation (it was verified in Chromium locally, not on the live domain).
2. **Future: semantic grounding.** `verifyAnswerGrounding` is lexical: it checks that each
   sentence's content words appear in the evidence. It cannot detect a negation or a changed
   number that reuses the same words. Since answers are extractive (copied from the source),
   the risk is low today; it matters if generated (LLM) answers are ever added. Possible
   approach: an optional embedding/NLI check behind an interface, keeping the lexical check
   as the default and as the zero-dependency fallback.
3. **Optional cleanups noticed during the audit:**
   - `exports` maps are deliberately absent (they would break deep imports such as
     `dist/widget/geocore-widget.js`); adding them is a major-version decision.
   - The Studio and the landing page are static; the Studio runs browser ports of the
     algorithms (`apps/geocore-studio/engine.js`), kept in sync by `tests/studio.test.ts`.

## Working locally

```bash
git clone https://github.com/mormox2/GeoCore.git && cd GeoCore   # or: git pull on main
npm ci
npm run verify
```

- Windows: the repo forces LF line endings (`.gitattributes`). If the clone was made before
  that file existed with `core.autocrlf=true`, run `git add --renormalize .` or re-clone,
  otherwise the CSP hash test in `apps/geocore-site/tests/site.test.ts` fails.
- The real-SQLite tests in `packages/geocore-db` need Node 22.5+ (`node:sqlite`); on older
  Node they are skipped.
- GitHub operations from a local session: use the `gh` CLI (`gh auth login` once).
