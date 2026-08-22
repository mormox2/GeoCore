# GeoCore — AI-Native Knowledge Operating System

**GeoCore** is an authoritative, AI-native Knowledge Operating System designed to structure, validate, persist, render, and distribute domain knowledge across websites, REST APIs, search engines, and AI/RAG systems.

> **Mission**: Build knowledge once. Deliver it everywhere.  
> **Core Principle**: Everything is Knowledge.

---

## 📦 Monorepo Architecture

```txt
GeoCore/
├── packages/
│   ├── geocore/          @mormox2/geocore         Domain Core, Schemas, Graph, Renderers, LLMs, Citations & Media
│   ├── geocore-cli/      @mormox2/geocore-cli     Command-line tool (validate, export, inspect)
│   ├── geocore-next/     @mormox2/geocore-next    Next.js 14+ App Router metadata, route handlers & UI components
│   ├── geocore-ai/       @mormox2/geocore-ai      AI / RAG engine, semantic chunking & citation grounding guardrails
│   ├── geocore-server/   @mormox2/geocore-server  Standalone HTTP/REST API server with OpenAPI 3.1 & auth middleware
│   ├── geocore-db/       @mormox2/geocore-db      Persistence & repository layer (In-Memory & SQLite/SQL adapters)
│   └── geocore-vector/   @mormox2/geocore-vector  Semantic embeddings, vector store & hybrid search engine (RRF)
├── apps/
│   └── geocore-studio/   @geocore/studio          Interactive Visual Studio (2D/3D Graph, Live Editor & RAG Playground)
├── examples/
│   ├── nextjs-app/       @geocore/example-nextjs-app    Next.js 14+ App Router reference integration & RAG chat
│   ├── rtimidental/      @geocore/example-rtimidental   RTimi Dental (Medical / Dental domain integration)
│   └── dawajinpro/       @geocore/example-dawajinpro    Dawajin Pro (AgriTech / Poultry ERP integration)
├── specs/                Normative specifications (GC-SPEC-0001 through GC-SPEC-0019)
├── docs/                 Architecture, playbooks, guidelines, and roadmaps
└── .github/workflows/    Automated CI/CD build, test & validation pipelines
```


---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/mormox2/GeoCore.git
cd GeoCore

# Install monorepo dependencies
npm install

# Build all packages
npm run build

# Run the complete test suite (100% passing across 103 test suites)
npm test
```

### 2. CLI Usage

```bash
# Validate a knowledge repository across 10 validation stages
node ./packages/geocore-cli/dist/bin.js validate --config ./examples/rtimidental/geocore.config.json

# Export static SEO and AI assets (HTML/MD, JSON-LD, search-index, llms.txt, sitemap.xml)
node ./packages/geocore-cli/dist/bin.js export --config ./examples/rtimidental/geocore.config.json

# Inspect repository statistics and graph connectivity
node ./packages/geocore-cli/dist/bin.js inspect --config ./examples/rtimidental/geocore.config.json
```

### 3. Standalone HTTP Server

```typescript
import { createGeoCoreServer } from "@mormox2/geocore-server";
import { apiDatasetFixture } from "@mormox2/geocore";

const server = createGeoCoreServer({
  dataset: apiDatasetFixture,
  port: 3000,
  siteUrl: "https://rtimidental.tn",
  auth: { apiKeys: ["your-api-key"] }
});

await server.listen(3000);
console.log("GeoCore REST API running at http://localhost:3000 (OpenAPI: /api/openapi.json)");
```

### 4. Next.js 14+ App Router Integration

```typescript
import { createGeoCoreMetadata, createGeoCoreRouteHandlers } from "@mormox2/geocore-next";

// Route handlers for /api/geocore/[...route]
export const { GET, OPTIONS } = createGeoCoreRouteHandlers({ dataset, siteUrl });
```

---

## 🛡️ 10-Stage Validation Pipeline

Every Knowledge Object is validated across 10 rigorous safety and semantic stages:
1. **Dataset Integrity** (schema conformance, no duplicate IDs)
2. **Knowledge Object Rules** (frontmatter, required fields, visibility invariants)
3. **Graph Connectivity** (entities, relationships, no orphan objects)
4. **Metadata Resolution** (canonical URL, open graph, alternates)
5. **Route Mapping** (clean pathing, canonical resolution)
6. **Search Indexing** (full-text index documents, weighting)
7. **Schema.org JSON-LD** (Article, FAQ, DefinedTerm, MedicalWebPage)
8. **AI Readability** (`llms.txt` and `llms-full.txt` standard generation)
9. **Sitemap Generation** (XML sitemaps with `<image:image>` extensions)
10. **Static Export Bundle** (atomic multi-target packaging)

---

## 🧪 Test Suite Status

- **Total Test Suites**: 103 test files
- **Total Unit & Integration Tests**: 725 tests
- **Success Rate**: **100% passing (0 failures, 0 warnings)**

---

## 📄 License

MIT © [Dr Mossaab Rtimi](https://github.com/mormox2)
