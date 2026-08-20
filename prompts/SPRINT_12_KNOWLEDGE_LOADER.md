# GeoCore Sprint 12 — Knowledge Loader

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 11 implemented the Static Exporter.

This sprint must implement **Sprint 12 only**.

Do not start Sprint 13.

---

# Goal

Implement the **Knowledge Loader & Raw Input Parser** layer.

The Knowledge Loader ingests raw in-memory inputs (parsed frontmatter markdown strings, JSON data files), detects content types, validates raw structures, parses relationships/entities/taxonomies/glossaries/citations/sources/media, and constructs a unified `KnowledgeDataset`.

This sprint must focus only on:

* `RawKnowledgeInput` and `KnowledgeDataset` data models;
* Zod validation schemas for raw inputs and datasets;
* Markdown YAML frontmatter parser and body extractor;
* JSON payload typed loaders (KnowledgeObject, Entity, Relationship, Collection, Taxonomy, Glossary, Citation, Source, Media);
* ID collision detection across loaded items;
* dataset aggregation and cross-item relationship integrity verification;
* loader diagnostics and dataset validation;
* loader fixtures;
* comprehensive unit tests.

Do not implement disk file traversal yet (CLI handles file discovery).

Do not implement Validation Pipeline runner yet.

Do not implement CLI commands yet.

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
│   ├── loader/
│   │   ├── frontmatter-parser.ts
│   │   ├── load-knowledge-object.ts
│   │   ├── load-markdown-knowledge.ts
│   │   ├── load-entity.ts
│   │   ├── load-relationship.ts
│   │   ├── load-collection.ts
│   │   ├── load-taxonomy.ts
│   │   ├── load-glossary.ts
│   │   ├── load-citation.ts
│   │   ├── load-media.ts
│   │   ├── knowledge-loader.ts
│   │   ├── dataset-utils.ts
│   │   ├── loader-utils.ts
│   │   └── validate-knowledge-dataset.ts
│   ├── schemas/
│   │   ├── raw-knowledge-input.schema.ts
│   │   └── knowledge-dataset.schema.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       └── loader.fixture.ts
├── tests/
│   ├── loader-frontmatter.test.ts
│   ├── load-knowledge-object.test.ts
│   ├── load-markdown-knowledge.test.ts
│   ├── knowledge-loader.test.ts
│   ├── loader-utils.test.ts
│   ├── knowledge-dataset-validation.test.ts
│   └── loader-fixtures.test.ts
```

---

# Data Models

### 1. `RawKnowledgeInput`

```ts
export interface RawKnowledgeInput {
  filePath?: string;
  format: "markdown" | "json";
  content: string | Record<string, unknown>;
  typeHint?: "knowledge-object" | "entity" | "relationship" | "collection" | "taxonomy" | "glossary" | "citation" | "source" | "media";
}
```

### 2. `KnowledgeDataset`

```ts
export interface KnowledgeDataset {
  id: string;
  name: string;
  objects: KnowledgeObject[];
  entities: Entity[];
  relationships: Relationship[];
  collections: Collection[];
  taxonomyTerms: TaxonomyTerm[];
  glossaryEntries: GlossaryEntry[];
  citations: Citation[];
  sources: Source[];
  media: Media[];
  diagnostics: Diagnostic[];
}
```

---

# Core Functions

### 1. `parseFrontmatter(markdownText: string): { attributes: Record<string, unknown>; body: string }`

Extracts YAML frontmatter delimiters (`---`) and parses attributes safely without external dependencies.

### 2. `loadKnowledgeDataset(input: { id: string; name: string; inputs: RawKnowledgeInput[] }): KnowledgeDataset`

Ingests all raw inputs, detects content types, and returns the unified typed dataset.

### 3. `validateKnowledgeDataset(dataset: KnowledgeDataset): ValidationResult`

Validates that object and entity IDs are unique, relationship targets exist, and required fields are populated.

---

# Validation Rules & Diagnostics

* `GC_LOADER_FRONTMATTER_MISSING`: Markdown file missing frontmatter header.
* `GC_LOADER_INVALID_JSON`: Malformed JSON input payload.
* `GC_LOADER_DUPLICATE_ID`: Two or more items share the same primary ID.
* `GC_LOADER_UNKNOWN_TYPE`: Input format could not be determined.
* `GC_LOADER_OBJECT_MISSING_TITLE`: Object missing title attribute.

---

# Acceptance Criteria

1. Frontmatter parser accurately extracts attributes and isolates body text.
2. Loader accepts heterogeneous JSON and Markdown inputs and populates all dataset arrays.
3. Duplicate IDs and broken relationship targets are flagged in diagnostics.
4. RTimi Dental and Dawajin Pro raw fixtures load completely without errors.
5. All loader test suites pass.
6. All exports are verified in `src/index.ts`.
