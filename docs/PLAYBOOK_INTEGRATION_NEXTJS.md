# Playbook: Next.js 14+ App Router Integration

This playbook explains how to integrate **GeoCore** into any Next.js 14+ or Next.js 15+ App Router application to achieve:
1. **Dynamic Page Routing & 100% SEO Metadata** (`generateMetadata`, OpenGraph, Twitter, Canonical).
2. **Schema.org JSON-LD Structured Data** (`Article`, `DefinedTerm`, `MedicalWebPage`).
3. **Universal Route Handlers** (`/api/geocore/[...route]`).
4. **Conversational RAG Chatbot API** (`/api/chat`) with hybrid semantic search.
5. **Anti-XSS Component Helpers** (`CitationBadge`, `MediaView`).

---

## 1. Installation

```bash
npm install @mormo_mossaab/geocore @mormo_mossaab/geocore-next @mormo_mossaab/geocore-ai @mormo_mossaab/geocore-vector
```

---

## 2. Dynamic Knowledge Page (`src/app/[lang]/[slug]/page.tsx`)

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  generateNextMetadata,
  renderJsonLdTag,
  renderCitationBadgeHtml,
  renderMediaFigureHtml,
} from "@mormo_mossaab/geocore-next";
import { getKnowledgeObject, resolveMetadata } from "@mormo_mossaab/geocore";
import { dataset } from "@/data/dataset";

type Props = {
  params: { lang: string; slug: string };
};

// 1. Generate Authoritative SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const object = dataset.objects.find(
    (o) => o.slug === params.slug && o.language === params.lang && o.status === "published"
  );
  if (!object) return {};

  const metadata = resolveMetadata({ object, entities: dataset.entities, collections: dataset.collections });
  return generateNextMetadata({ object, metadata, siteName: "RTimi Dental", baseUrl: "https://rtimidental.tn" });
}

// 2. Render Page with Schema.org & Verified Citations
export default function KnowledgePage({ params }: Props) {
  const object = dataset.objects.find(
    (o) => o.slug === params.slug && o.language === params.lang && o.status === "published"
  );
  if (!object) notFound();

  const metadata = resolveMetadata({ object, entities: dataset.entities, collections: dataset.collections });
  const jsonLdScript = renderJsonLdTag({ object, metadata, siteUrl: "https://rtimidental.tn" });

  return (
    <article className="knowledge-article">
      {/* Schema.org JSON-LD tag */}
      <div dangerouslySetInnerHTML={{ __html: jsonLdScript }} />

      <h1>{object.title}</h1>
      <p className="summary">{object.summary}</p>

      <div className="content" dangerouslySetInnerHTML={{ __html: object.body }} />

      {/* Citations Section */}
      {dataset.citations.length > 0 && (
        <section className="citations">
          <h3>Références & Preuves Scientifiques</h3>
          {dataset.citations.map((c) => {
            const source = dataset.sources.find((s) => s.id === c.sourceId);
            return (
              <div key={c.id} dangerouslySetInnerHTML={{ __html: renderCitationBadgeHtml(c, source) }} />
            );
          })}
        </section>
      )}
    </article>
  );
}
```

---

## 3. Universal Catch-All Route Handler (`src/app/api/geocore/[...route]/route.ts`)

```ts
import {
  handleLlmsTxt,
  handleLlmsFullTxt,
  handleSitemapXml,
  handleSearchApi,
  handleContextApi,
} from "@mormo_mossaab/geocore-next";
import { dataset } from "@/data/dataset";

export async function GET(req: Request, { params }: { params: { route: string[] } }) {
  const path = params.route.join("/");

  if (path === "llms.txt") {
    return handleLlmsTxt(req, dataset, { siteUrl: "https://rtimidental.tn" });
  }
  if (path === "llms-full.txt") {
    return handleLlmsFullTxt(req, dataset, { siteUrl: "https://rtimidental.tn" });
  }
  if (path === "sitemap.xml") {
    return handleSitemapXml(req, dataset, { siteUrl: "https://rtimidental.tn" });
  }
  if (path === "search") {
    return handleSearchApi(req, dataset);
  }
  if (path.startsWith("context/")) {
    const objectId = path.replace("context/", "");
    return handleContextApi(req, dataset, objectId);
  }

  return new Response(JSON.stringify({ error: "Route not found" }), { status: 404 });
}
```

---

## 4. Conversational RAG Chat Handler (`src/app/api/chat/route.ts`)

```ts
import { getAiContext } from "@mormo_mossaab/geocore";
import { buildPromptContext, verifyAnswerGrounding } from "@mormo_mossaab/geocore-ai";
import { searchHybrid, vectorizeDataset, MemoryVectorStore, DeterministicEmbeddingProvider } from "@mormo_mossaab/geocore-vector";
import { dataset } from "@/data/dataset";

const store = new MemoryVectorStore();
const provider = new DeterministicEmbeddingProvider(64);
let initialized = false;

export async function POST(req: Request) {
  if (!initialized) {
    await vectorizeDataset(dataset, store, provider);
    initialized = true;
  }

  const { message } = await req.json();

  // 1. Hybrid Search
  const searchResults = await searchHybrid(message, dataset, store, provider, { limit: 1 });
  const targetId = searchResults.results[0]?.objectId || "ko_default";

  // 2. Fetch AI Context Package
  const contextRes = getAiContext(dataset, { objectId: targetId, visibility: "public" });
  const aiPackage = contextRes.data!;

  // 3. Assemble Prompt & Generate Answer
  const prompt = buildPromptContext(aiPackage);
  const generatedAnswer = `Clinical response based on ${aiPackage.object.title}...`;

  // 4. Validate Grounding & Guardrails
  const grounding = verifyAnswerGrounding(generatedAnswer, aiPackage);

  return Response.json({
    answer: generatedAnswer,
    groundingScore: grounding.score,
    hallucinationRisk: grounding.hallucinationRisk,
    sources: aiPackage.sources,
  });
}
```
