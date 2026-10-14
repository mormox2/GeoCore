# API Reference

Stable public interfaces of the GeoCore packages: the REST API served by `geocore serve`
(`@mormo_mossaab/geocore-server`), the grounded-answer contract used by `<geocore-widget>`,
and the main exports of each npm package. The machine-readable REST specification is served
at `GET /api/openapi.json`.

All packages require **Node.js 20 or later** (`engines.node: ">=20"`, tested in CI on
Node 20 and 22).

---

## 1. REST API (`geocore serve` / `createGeoCoreServer`)

```bash
npx @mormo_mossaab/geocore-cli serve --config ./geocore.config.json --api-key "$GEOCORE_API_KEY"
```

The server listens on `127.0.0.1:3000` by default. Pass `--host 0.0.0.0` to expose it on
the network (for example in a container behind a reverse proxy that terminates TLS).

### Authentication

| Level | How | Grants |
| --- | --- | --- |
| Public | no key | published, public content only |
| API key | `X-Api-Key: <key>` or `Authorization: Bearer <key>` | `?visibility=internal`, `/api/validate` |
| Admin key | same headers, key listed in `auth.adminKeys` | everything above + `POST /api/vectorize` |

- Keys are compared in constant time.
- `?apiKey=<key>` in the URL still works but is **deprecated**: URLs end up in access logs,
  proxies and browser history. The server logs a one-time warning when it is used, and
  `auth: { allowQueryApiKey: false }` accepts header keys only.
- A request with `?visibility=internal` but no valid key is served as public.

### Visibility and status codes

Public callers only ever see objects that are `published` and public. A draft or internal
object answers **`404`**, exactly like a missing one, so its id cannot be probed. Objects
marked `private` or `hidden` are never exposed, even with an API key.

| Status | Meaning |
| --- | --- |
| `200` | Success. JSON bodies follow `{ status: "ok", meta, data }` (lists add `pagination`). |
| `400` | Invalid parameter (`limit`/`offset` not a non-negative integer, missing or too long `q`). |
| `401` | A key is required (`/api/validate`, `POST /api/vectorize`). |
| `403` | Valid API key that is not an admin key on `POST /api/vectorize`. |
| `404` | Unknown route, missing resource, or resource not visible to the caller. |
| `500` | Internal error. The body never contains internal details. |

### Endpoints

| Method & path | Auth | Description |
| --- | --- | --- |
| `GET /api/health` (alias `/health`) | — | Status, dataset id and object count. |
| `GET /api/openapi.json` | — | OpenAPI 3.1 specification. |
| `GET /api/llms.txt`, `/api/llms-full.txt` (aliases at the root) | — | LLM-oriented summaries of the public dataset. |
| `GET /api/sitemap.xml` (alias `/sitemap.xml`) | — | XML sitemap (uses `siteUrl`). |
| `GET /api/search?q=&language=&limit=` | — | Lexical full-text search. |
| `GET /api/search/hybrid?q=&language=&limit=` | — | Lexical + vector search fused with Reciprocal Rank Fusion. Public objects only. |
| `GET /api/answer?q=&language=` | — | Grounded answer for `<geocore-widget>` (see §2). `q` is limited to 500 characters. |
| `POST /api/vectorize` | admin | Re-indexes the vector store and returns a report. |
| `GET /api/objects?limit=&offset=` · `GET /api/objects/:id` | — / key for internal | Knowledge objects. |
| `GET /api/entities?limit=&offset=` · `GET /api/entities/:id` | — / key for internal | Knowledge-graph entities. |
| `GET /api/context/:id` | — / key for internal | AI context package (object, entities, citations, trust-scored sources) for RAG. |
| `GET /api/prompt-context/:id` | — / key for internal | The same context formatted as a Markdown prompt (`text/plain`). |
| `GET /api/citations?targetId=&sourceId=` · `GET /api/citations/:id` | — / key for internal | Citations. |
| `GET /api/sources` · `GET /api/sources/:id` | — / key for internal | Bibliographic sources. |
| `GET /api/media` · `GET /api/media/:id` | — / key for internal | Media assets. |
| `GET /api/validate?mode=public\|internal` | key | Full validation report (lists drafts, so never public). |

### CORS

`createGeoCoreServer({ cors: { origin } })` accepts `"*"` (default), a single origin, a list
of allowed origins (the request origin is echoed only when listed), `true` (echo any origin)
or `false` (no CORS headers). `OPTIONS` preflights answer `204`.

---

## 2. Grounded-answer contract (`/answer`)

Implemented identically by `GET /api/answer` (geocore-server) and `handleAnswerApi`
(geocore-next), and consumed by `<geocore-widget>` and `fetchWidgetAnswer`.

**Request:** `GET {apiUrl}/answer?q=<question>&language=<optional>`

**Answer found** (`200`):

```json
{
  "status": "ok",
  "data": {
    "query": "…",
    "answer": "Sentences copied verbatim from the published knowledge object.",
    "objectId": "ko_…",
    "title": "…",
    "slug": "…",
    "language": "fr",
    "matchType": "both",
    "grounding": {
      "score": 0.92,
      "hallucinationRisk": "low",
      "isGrounded": true,
      "unsupportedClaims": [],
      "matchedEntities": ["ent_…"]
    },
    "sources": [{ "id": "src_…", "title": "…", "url": "https://…", "publisher": "…", "trustLevel": "high" }]
  }
}
```

**No verified answer** (`200`): `{ "status": "no-answer", "data": null, "message": "…" }`

Nothing is generated: the answer is extracted from the best matching public object and only
returned when every sentence passes `verifyAnswerGrounding`. When no candidate passes, the
endpoint says so instead of guessing. The widget additionally rejects any answer whose
`grounding.isGrounded` is not `true`.

### `<geocore-widget>`

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@mormo_mossaab/geocore/dist/widget/geocore-widget.js"></script>
<geocore-widget data-api-url="https://your-geocore-server.example/api" data-language="fr"></geocore-widget>
```

| Attribute | Default | Purpose |
| --- | --- | --- |
| `data-api-url` | `/api` | Base URL; the widget calls `{data-api-url}/answer`. |
| `data-language` | — | Forwarded as `language`. |
| `data-title`, `data-subtitle`, `data-placeholder` | `GeoCore Assistant`, `Knowledge OS & RAG`, `Posez une question...` | Texts. |
| `data-theme` | `dark` | `dark` or `light`. |
| `data-primary-color` | `#38bdf8` | Accent color. |
| `data-auto-open` | off | Opens the panel on load. |

The widget renders answers in a Shadow DOM with HTML escaping and URL filtering.

---

## 3. Package exports

Only the main entry points are listed; each package also exports its TypeScript types.

| Package | Main exports |
| --- | --- |
| `@mormo_mossaab/geocore` | `loadKnowledgeDataset`, `runValidationPipeline`, `getKnowledgeObject`, `getAiContext`, `searchKnowledge`, `isPublicKnowledgeObject`, `generateLlmsTxt`, `generateLlmsFullTxt`, `generateSitemap`, `generateJsonLd`, `fetchWidgetAnswer` |
| `@mormo_mossaab/geocore-ai` | `verifyAnswerGrounding`, `buildExtractiveAnswer`, `buildPromptContext`, `chunkKnowledgeObject` |
| `@mormo_mossaab/geocore-vector` | `findGroundedAnswer`, `ensureVectorized`, `vectorizeDataset`, `searchHybrid`, `MemoryVectorStore`, `DeterministicEmbeddingProvider` |
| `@mormo_mossaab/geocore-server` | `createGeoCoreServer`, `routeRequest`, `authenticateRequest`, `handleCors`, `generateOpenApiSpec` |
| `@mormo_mossaab/geocore-db` | `SqlKnowledgeRepository`, `MemoryKnowledgeRepository`, `syncDatasetToRepository` |
| `@mormo_mossaab/geocore-next` | `handleAnswerApi`, `handleSearchApi`, `handleContextApi`, `handleLlmsTxt`, `handleLlmsFullTxt`, `handleSitemapXml`, `generateNextMetadata`, `formatJsonLdScript` |
| `@mormo_mossaab/geocore-cli` | `geocore` binary: `init`, `validate`, `export`, `inspect`, `serve`, `vectorize`, `studio` |

### SQL storage (`geocore-db`)

`new SqlKnowledgeRepository(driver, { placeholders })` works with any driver implementing
`exec(sql)`, `query(sql, params)` and `run(sql, params)`. Use `placeholders: "sqlite"`
(default, `?`) for SQLite or MySQL and `"postgres"` (`$1, $2, …`) for `pg` or PGlite.
Writes are portable upserts (`ON CONFLICT (id) DO UPDATE`), and `init()` creates or migrates
the schema.

### Next.js (`geocore-next`)

```ts
// app/api/geocore/answer/route.ts
import { handleAnswerApi } from "@mormo_mossaab/geocore-next";
export const GET = (req: Request) => handleAnswerApi(dataset, req);
```

`handleContextApi` follows the same visibility rule as the server: drafts and internal
objects answer `404`.

### Module resolution

The packages declare `main`/`types` but no `exports` map, so files under `dist/` (such as
`dist/widget/geocore-widget.js` loaded from a CDN) stay importable. Treat deep imports other
than the widget bundle as internal: they may change without a major version.
