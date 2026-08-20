# GeoCore Sprint 6 — Search Index Generator

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 1 created:

* core domain types;
* Zod schemas;
* validation primitives;
* KnowledgeObject validation;
* RTimi Dental fixture;
* Dawajin Pro fixture.

Sprint 2 created:

* graph node types;
* graph registry;
* relationship validation;
* orphan detection;
* parent-child cycle detection;
* graph fixtures.

Sprint 3 created:

* resolved metadata;
* metadata defaults;
* metadata precedence;
* metadata resolver;
* SEO metadata resolution;
* AI metadata resolution;
* metadata validation.

Sprint 4 created:

* RendererInput;
* RendererOutput;
* RendererDiagnostic;
* GeoCoreRenderer interface;
* RendererRegistry;
* fake renderer;
* renderer validation.

Sprint 5 created:

* JSON renderer;
* Markdown renderer;
* renderer presets;
* renderer formatters;
* fixture rendering tests.

This sprint must implement **Sprint 6 only**.

Do not start Sprint 7.

---

# Goal

Implement the **Search Index Generator** layer.

The Search Index Generator transforms validated Knowledge Objects and their resolved metadata into lightweight, optimized search documents and aggregates them into a comprehensive `SearchIndex`.

This sprint must focus only on:

* `SearchDocument` and `SearchIndex` data models;
* Zod validation schemas for search documents;
* plaintext text extraction from Markdown and structured content;
* search document generation from Knowledge Objects;
* keyword, entity tag, and citation term collection;
* visibility and language filtering;
* search index diagnostics and validation;
* search fixtures;
* comprehensive unit tests.

Do not implement Schema.org / JSON-LD yet.

Do not implement LLMs.txt yet.

Do not implement Sitemap yet.

Do not implement CLI yet.

Do not implement filesystem access or disk writes yet.

Do not implement database persistence.

Do not implement React or Next.js.

The core package must remain pure and framework-agnostic.

---

# Existing package

Work inside:

```txt
packages/geocore
```

---

# Required file structure

Add or update:

```txt
packages/geocore/
├── src/
│   ├── search/
│   │   ├── search-document.ts
│   │   ├── search-text-extractor.ts
│   │   ├── search-index-generator.ts
│   │   ├── search-filter.ts
│   │   ├── search-utils.ts
│   │   └── validate-search-document.ts
│   ├── schemas/
│   │   └── search-document.schema.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       └── search.fixture.ts
├── tests/
│   ├── search-document-schema.test.ts
│   ├── search-text-extractor.test.ts
│   ├── search-document-generation.test.ts
│   ├── search-index-generator.test.ts
│   ├── search-filter.test.ts
│   └── search-fixtures.test.ts
```

---

# Data Models

### 1. `SearchDocument`

```ts
export interface SearchDocument {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  language: string;
  status: string;
  visibility: "public" | "internal" | "draft";
  canonicalUrl?: string;
  tags: string[];
  entities: string[];
  citations: string[];
  keywords: string[];
  publishedAt?: string;
  updatedAt?: string;
  score?: number;
}
```

### 2. `SearchIndex`

```ts
export interface SearchIndex {
  version: string;
  generatedAt: string;
  totalDocuments: number;
  language?: string;
  documents: SearchDocument[];
}
```

---

# Core Functions

### 1. `extractSearchText(body: string | Record<string, unknown>): string`

Strips markdown syntax (headings, bold, italics, links, images, tables, code blocks) and extracts clean normalized plain text suitable for indexing.

### 2. `generateSearchDocument(input: { object: KnowledgeObject; metadata?: ResolvedMetadata; entities?: Entity[]; citations?: Citation[] }): SearchDocument`

Transforms a single Knowledge Object and its associated graph context into a `SearchDocument`.

### 3. `generateSearchIndex(input: { objects: KnowledgeObject[]; metadataMap?: Map<string, ResolvedMetadata>; language?: string; visibility?: "public" | "internal" }): SearchIndex`

Generates the complete search index with filtering by language and visibility.

### 4. `validateSearchDocument(doc: SearchDocument): ValidationResult`

Validates search document structure, required fields, text lengths, and consistency.

---

# Validation Rules & Diagnostics

* `GC_SEARCH_DOCUMENT_INVALID`: Schema validation failure.
* `GC_SEARCH_TITLE_MISSING`: Search document lacks title.
* `GC_SEARCH_CONTENT_EMPTY`: Content extracted is empty.
* `GC_SEARCH_SLUG_MISSING`: Search document missing slug.
* `GC_SEARCH_INDEX_EMPTY`: Generated index contains zero documents.
* `GC_SEARCH_DOCUMENT_CANONICAL_URL_MISSING`: Public document missing canonical URL.

---

# Acceptance Criteria

1. `SearchDocument` and `SearchIndex` Zod schemas validate correctly.
2. Text extraction cleanly strips Markdown tokens and handles structured bodies.
3. Search index generation filters private/draft objects when generating public indices.
4. RTimi Dental and Dawajin Pro fixtures generate valid search indices.
5. All search test suites pass with 100% success.
6. All search functions and types are cleanly exported from `src/index.ts`.
