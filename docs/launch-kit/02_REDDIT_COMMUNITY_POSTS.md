# 🤖 Reddit Developer Communities Launch Kit

> **Target Subreddits**:
> 1. `r/LocalLLaMA` (150k+ AI engineers & RAG builders)
> 2. `r/typescript` & `r/javascript` (Frontend & Fullstack developers)
> 3. `r/nextjs` (Modern web & doc platform builders)

---

## 📌 Post 1: For `r/LocalLLaMA` / `r/MachineLearning`

**Post Title**:  
`We built a zero-dependency TypeScript Hybrid Search (BM25 + Dense RRF) and Clinical Anti-Hallucination Guardrail system`

**Flair**: `Project / Software Update` or `Discussion`

**Post Body**:
```markdown
Hey r/LocalLLaMA,

Most RAG setups suffer from two major problems when deployed in production:
1. **Vector search blind spots**: Cosine similarity on dense embeddings frequently misses exact acronyms, dosage numbers, or domain product codes (e.g. "ISO 22000", "5% NaF", "D3300").
2. **Hallucination verification latency**: Re-prompting an LLM to "grade its own output" adds massive latency and still fails on subtle clinical/legal inaccuracies.

To address this without adding Python microservices, we built and open-sourced **GeoCore** (https://github.com/mormox2/GeoCore) — a pure TypeScript Knowledge OS and RAG engine.

### How we solved it:

#### 1. Pure TS Reciprocal Rank Fusion (RRF)
Instead of relying on Python backend services or managed vector DBs for standard docsets, we implemented in-memory BM25 + Dense vector ranking fused with RRF:
$$RRF(d) = \frac{w_{\text{lexical}}}{60 + \text{rank}_{\text{lexical}}(d)} + \frac{w_{\text{vector}}}{60 + \text{rank}_{\text{vector}}(d)}$$

Benchmarked at `< 2ms` query latency in pure Node.js/Edge environments.

#### 2. Deterministic Grounding Guardrails (`verifyAnswerGrounding`)
We built a deterministic evaluator that scores synthesized LLM answers against verified source citations (e.g. PubMed/WHO/HAS standards) before showing them to the user. It assigns a clear risk rating (`low`, `medium`, `high`) based on entity overlap and evidence bounds.

#### 3. Automatic `llms.txt` & Schema.org Export
Markdown knowledge bases are validated across 10 stages (broken graph relations, orphan concepts, missing sources) and exported to standard `llms.txt` formats so Perplexity and AI engines can accurately crawl them.

The project is 100% open-source under MIT, fully typed, with 747 tests passing (100% coverage).

- **GitHub**: https://github.com/mormox2/GeoCore
- **CLI Quickstart**:
  ```bash
  npx @mormox2/geocore-cli init my-kb
  npx @mormox2/geocore-cli studio
  ```

Curious to hear your thoughts on purely TypeScript-based RAG architectures versus Python-centric pipelines!
```

---

## 📌 Post 2: For `r/typescript`

**Post Title**:  
`I built an open-source AI Knowledge OS monorepo with 7 strictly-typed packages and 747 automated tests`

**Post Body**:
```markdown
Hi r/typescript!

I wanted to share the architectural patterns behind **GeoCore** (https://github.com/mormox2/GeoCore), an AI-Native Knowledge Operating System monorepo built in 100% strict TypeScript.

### Monorepo Architecture:
- `@mormox2/geocore`: Core domain, Zod schemas, 10-stage AST/graph validator, static exporter.
- `@mormox2/geocore-cli`: CLI tooling (`init`, `validate`, `export`, `serve`, `vectorize`, `studio`).
- `@mormox2/geocore-vector`: Pure TS cosine similarity, local/OpenAI embedding providers, RRF hybrid search.
- `@mormox2/geocore-ai`: RAG context synthesizer, semantic chunking, and hallucination guardrails.
- `@mormox2/geocore-server`: Standalone Node REST server with dynamic OpenAPI 3.1 specification generation.
- `@mormox2/geocore-next`: Next.js 14/15 App Router dynamic metadata, JSON-LD, and route handler utilities.
- `@mormox2/geocore-db`: Storage adapters (In-Memory + SQLite) with full dataset reconciliation.

### Highlights:
- **Zero Circular Dependencies**: Enforced via clear domain-driven package boundaries.
- **Strict Zod & Invariant Validation**: Every knowledge object is validated at compile-time and runtime.
- **105 Test Suites / 747 Tests**: 100% pass rate using Vitest.

Check out the code here: https://github.com/mormox2/GeoCore
Feedback and contributions are very welcome!
```

---

## 📌 Post 3: For `r/nextjs`

**Post Title**:  
`How to make your Next.js docs indexable by Perplexity & ChatGPT Search using automatic llms.txt & Schema.org`

**Post Body**:
```markdown
Hey everyone!

With AI search engines (ChatGPT Search, Perplexity, Google AI Overviews) changing how users discover documentation, standard HTML sitemaps are no longer enough. AI crawlers perform significantly better when provided with:
1. `llms.txt` and `llms-full.txt` (the emerging standard for LLM ingest).
2. Deep `Schema.org` JSON-LD microdata (`MedicalWebPage`, `TechArticle`, `FAQPage`).

We built an open-source integration for Next.js 14/15 App Router inside **GeoCore** (`@mormox2/geocore-next`):

```typescript
// app/api/geocore/[...route]/route.ts
import { createGeoCoreRouteHandlers } from "@mormox2/geocore-next";
import { myDataset } from "@/lib/dataset";

export const { GET, OPTIONS } = createGeoCoreRouteHandlers({
  dataset: myDataset,
  siteUrl: "https://yourdomain.com",
});
```

This single route handler automatically serves:
- `/api/geocore/llms.txt`
- `/api/geocore/sitemap.xml`
- `/api/geocore/search-index.json`
- Dynamic JSON-LD injection for your pages.

Check out the repo: https://github.com/mormox2/GeoCore
```
