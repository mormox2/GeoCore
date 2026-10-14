# GeoCore — guide for Claude Code

@AGENTS.md
@.agents/rules/author_profile.md

Current state and open work: [docs/HANDOFF.md](docs/HANDOFF.md). Read it at the start of a session.

## Commands

Node.js 22 for development (`.nvmrc`; 20.19+ also works). npm workspaces, ESM, TypeScript strict.

```bash
npm ci                      # install (never `npm install` unless changing dependencies)
npm run build               # builds all workspaces in dependency order (scripts/build-workspaces.mjs)
npm test                    # every workspace (Vitest 5)
npm run test:server         # one package: test:core, test:ai, test:vector, test:db, test:next, test:cli, test:site, test:studio…
npm run check:any           # fails on any explicit `any` (also a CI step)
npm run verify              # check:any + build + test + both example validations — run before every PR
npm run preview:site        # landing page, http://127.0.0.1:4300
npm run preview:studio      # Studio through the CLI, http://127.0.0.1:4200
npm run serve:rtimidental   # REST API on 127.0.0.1:3000 with the dental example dataset
```

Package tests import the other packages through their built `dist/`: after changing
`packages/geocore` (or any dependency), run `npm run build` before testing dependents.

## Layout

| Path | Content |
| --- | --- |
| `packages/geocore` | Core: Zod schemas, loader, 10-stage validation pipeline, API functions (`getAiContext`, `searchKnowledge`…), llms.txt/sitemap/JSON-LD generators, `<geocore-widget>` |
| `packages/geocore-ai` | Grounding check (`verifyAnswerGrounding`), extractive answers, prompt context, chunking |
| `packages/geocore-vector` | Embeddings, vector store, hybrid search (RRF), `findGroundedAnswer` |
| `packages/geocore-server` | Standalone REST server (`/api/*`, OpenAPI, API keys) |
| `packages/geocore-db` | Repositories: memory and SQL (SQLite, PostgreSQL via `placeholders: "postgres"`) |
| `packages/geocore-next` | Next.js App Router handlers, metadata, JSON-LD |
| `packages/geocore-cli` | `geocore` binary (init, validate, export, inspect, serve, vectorize, studio) |
| `apps/geocore-site`, `apps/geocore-studio` | Static landing page and Studio, deployed to Vercel (`vercel.json`, `scripts/build-site.js`) |
| `examples/` | `rtimidental` and `dawajinpro` datasets (their `dist/geocore/` exports are committed on purpose), `nextjs-app` |
| `docs/api/README.md` | Public API reference (endpoints, auth, `/answer` contract, exports) |
| `docs/PROJECT_AUDIT_REPORT.md` | Audit history (§10) |

Dependency order: `geocore` → `geocore-ai` → `geocore-vector` → `geocore-server` / `geocore-db` / `geocore-next` → `geocore-cli`.

## Rules that are easy to break

- **Zero hallucination.** Answers are extracted from published objects and must pass
  `verifyAnswerGrounding`; never generate or "fill in" answer text. When nothing is grounded,
  return `no-answer`.
- **Visibility.** Public channels only expose objects that are `published` and public
  (`isPublicKnowledgeObject`); `private`/`hidden` are never exposed. Non-public resources answer
  `404` exactly like missing ones (never `403`, which would confirm the id exists).
- **No explicit `any`**, no `@ts-ignore`. At untyped boundaries use `unknown` and the helpers in
  `packages/geocore/src/internal/read-field.ts`.
- **Inline scripts and the CSP.** `vercel.json` allows the inline `<script>` of
  `apps/geocore-site/index.html` and `apps/geocore-studio/index.html` by SHA-256 hash. If you
  change one, update the hash in `vercel.json` (`apps/geocore-site/tests/site.test.ts` fails and
  prints which page). Files must stay LF (`.gitattributes`).
- **`dist/` is never committed** (except `examples/*/dist/geocore/`).
- **Every change to a published package needs a changeset**: `npx changeset` (patch for fixes,
  minor for new features or behavior changes). Private apps and examples need none.
- **Never skip or weaken a test** to get green; fix the cause.

## Git and release workflow

1. Branch from `main`, commit, push, open a PR (template: `.github/PULL_REQUEST_TEMPLATE.md`).
   CI runs on Node 22 (with `check:any` and validations), Node 20 and Windows.
2. After merge, the Release workflow opens a version PR (`changeset-release/main`, title
   "chore(release): version and publish packages"). It gets no CI: check it out and run
   `npm ci && npm run verify` before merging it.
3. Merging the version PR publishes to npm (`NPM_TOKEN` secret) and creates the git tags.
   Never run `npm publish` or `changeset publish` locally.

Merges into `main` happen only with the owner's explicit OK.
