# GeoCore Sprint 7 — Schema.org / JSON-LD Generator

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 6 implemented the Search Index Generator.

This sprint must implement **Sprint 7 only**.

Do not start Sprint 8.

---

# Goal

Implement the **Schema.org / JSON-LD Generator** layer.

This engine transforms validated Knowledge Objects, resolved metadata, related entities, citations, and collections into valid Schema.org JSON-LD graph objects.

This sprint must focus only on:

* Schema.org typed builders:
  * `Article` (MedicalWebPage / TechArticle / ScholarlyArticle);
  * `FAQPage` / `Question` / `Answer`;
  * `DefinedTerm` / `DefinedTermSet` (Glossary & Ontology terms);
  * `CollectionPage` / `ItemList`;
  * `BreadcrumbList`;
  * `MediaObject` / `ImageObject`;
* Schema type mapping based on object category, entity types, and metadata;
* JSON-LD graph container formatting (`@context: "https://schema.org"`, `@graph`);
* Schema.org diagnostics and validation;
* Schema fixtures;
* comprehensive unit tests.

Do not implement LLMs.txt yet.

Do not implement Sitemap yet.

Do not implement CLI yet.

Do not implement filesystem access or disk writes.

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
│   ├── schema/
│   │   ├── schema-types.ts
│   │   ├── schema-mapper.ts
│   │   ├── schema-utils.ts
│   │   ├── article-schema.ts
│   │   ├── faq-schema.ts
│   │   ├── defined-term-schema.ts
│   │   ├── collection-schema.ts
│   │   ├── breadcrumb-schema.ts
│   │   ├── media-schema.ts
│   │   ├── json-ld-generator.ts
│   │   └── validate-json-ld.ts
│   ├── schemas/
│   │   ├── article-schema.schema.ts
│   │   ├── faq-schema.schema.ts
│   │   ├── defined-term-schema.schema.ts
│   │   ├── collection-schema.schema.ts
│   │   └── breadcrumb-schema.schema.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       └── schema.fixture.ts
├── tests/
│   ├── article-schema.test.ts
│   ├── faq-schema.test.ts
│   ├── defined-term-schema.test.ts
│   ├── collection-schema.test.ts
│   ├── breadcrumb-schema.test.ts
│   ├── schema-mapper.test.ts
│   ├── json-ld-generator.test.ts
│   ├── json-ld-validation.test.ts
│   └── schema-fixtures.test.ts
```

---

# Data Models & Schemas

### 1. `JsonLdDocument`

```ts
export interface JsonLdDocument {
  "@context": "https://schema.org";
  "@graph": Array<Record<string, unknown>>;
}
```

### 2. Supported Schema.org Types
* `Article`, `MedicalWebPage`, `TechArticle`
* `FAQPage`, `Question`, `Answer`
* `DefinedTerm`, `DefinedTermSet`
* `CollectionPage`, `ItemList`
* `BreadcrumbList`, `ListItem`
* `ImageObject`, `VideoObject`
* `Organization`, `Person`

---

# Core Functions

### 1. `generateJsonLd(input: { object: KnowledgeObject; metadata?: ResolvedMetadata; entities?: Entity[]; citations?: Citation[]; collections?: Collection[]; siteUrl?: string }): JsonLdDocument`

Builds the complete `@graph` structure with all relevant Schema.org entities linked together via `@id` references.

### 2. `mapSchemaType(object: KnowledgeObject): string`

Resolves the appropriate Schema.org `@type` according to content category, metadata hints, and entity domain.

### 3. `validateJsonLd(doc: JsonLdDocument | Record<string, unknown>): ValidationResult`

Validates that `@context` is present, `@type` is valid, required properties (`headline`/`name`, `author`, `datePublished`) exist, and nested structures comply with Schema.org standards.

---

# Validation Rules & Diagnostics

* `GC_SCHEMA_CONTEXT_MISSING`: Missing `@context: "https://schema.org"`.
* `GC_SCHEMA_TYPE_MISSING`: Missing `@type`.
* `GC_SCHEMA_HEADLINE_MISSING`: Article missing headline.
* `GC_SCHEMA_AUTHOR_MISSING`: Schema entity missing author/publisher.
* `GC_SCHEMA_CANONICAL_URL_MISSING`: Schema entity lacks canonical url.
* `GC_SCHEMA_INVALID_STRUCTURE`: JSON-LD syntax or structural failure.

---

# Acceptance Criteria

1. Builders generate valid Schema.org representations for articles, FAQs, glossaries, collections, and breadcrumbs.
2. Cross-references between entities use consistent `@id` identifiers.
3. Validation accurately catches malformed Schema.org objects.
4. RTimi Dental and Dawajin Pro fixtures generate valid JSON-LD graphs.
5. All schema test suites pass.
6. Exports are updated in `src/index.ts`.
