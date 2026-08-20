# GeoCore Sprint 8 — LLMs.txt Generator

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 7 implemented the Schema.org / JSON-LD Generator.

This sprint must implement **Sprint 8 only**.

Do not start Sprint 9.

---

# Goal

Implement the **LLMs.txt and LLMs-full.txt Generator** layer.

This engine creates standardized markdown files (`llms.txt` and `llms-full.txt`) adhering to the `/llms.txt` standard to optimize AI discovery, retrieval, context ingestion, and citation accuracy for Large Language Models.

This sprint must focus only on:

* `llms.txt` generator (concise index with title, description, and structured links grouped by category/collection);
* `llms-full.txt` generator (comprehensive single-file text containing complete markdown content, metadata, entities, and citations);
* public/published object filtering;
* entity and citation extraction formatting for LLM prompt context;
* LLMs output formatting and section hierarchy;
* LLMs diagnostics and validation;
* LLMs fixtures;
* comprehensive unit tests.

Do not implement Sitemap yet.

Do not implement Static Exporter bundle packaging yet.

Do not implement CLI yet.

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
│   ├── llms/
│   │   ├── llms-generator.ts
│   │   ├── llms-full-generator.ts
│   │   ├── llms-formatters.ts
│   │   ├── llms-filter.ts
│   │   ├── llms-utils.ts
│   │   └── validate-llms-output.ts
│   ├── schemas/
│   │   └── llms-output.schema.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       └── llms.fixture.ts
├── tests/
│   ├── llms-generator.test.ts
│   ├── llms-full-generator.test.ts
│   ├── llms-formatters.test.ts
│   ├── llms-filter.test.ts
│   ├── llms-validation.test.ts
│   └── llms-fixtures.test.ts
```

---

# Output Specifications

### 1. `llms.txt` Structure
```markdown
# [Site Name]

> [Site Summary / Tagline]

## Documentation & Knowledge Base
- [Object Title](canonical-url): Summary description of the resource.
- [Object Title 2](canonical-url): Summary description.

## Optional Resources
- [Resource Title](canonical-url): Optional secondary link.
```

### 2. `llms-full.txt` Structure
Contains the full text of all publishable Knowledge Objects separated by markdown section dividers (`---`), with frontmatter or header summaries, entity links, citation lists, and author attribution.

---

# Core Functions

### 1. `generateLlmsTxt(input: { siteName: string; siteDescription?: string; objects: KnowledgeObject[]; metadataMap?: Map<string, ResolvedMetadata>; collections?: Collection[]; language?: string }): string`

Generates the concise `llms.txt` manifest.

### 2. `generateLlmsFullTxt(input: { siteName: string; siteDescription?: string; objects: KnowledgeObject[]; metadataMap?: Map<string, ResolvedMetadata>; entities?: Entity[]; citations?: Citation[]; language?: string }): string`

Generates the complete aggregated `llms-full.txt` knowledge dump.

### 3. `validateLlmsOutput(content: string, type: "summary" | "full"): ValidationResult`

Validates that H1 title exists, links are properly formatted markdown links, content is non-empty, and required sections are present.

---

# Validation Rules & Diagnostics

* `GC_LLMS_EMPTY`: Generated LLMs output is empty.
* `GC_LLMS_HEADER_MISSING`: Main title or summary block is missing.
* `GC_LLMS_NO_PUBLIC_OBJECTS`: No public objects available to generate LLMs manifest.
* `GC_LLMS_INVALID_LINK`: Malformed markdown link or missing URL.
* `GC_LLMS_CANONICAL_URL_MISSING`: Public object lacking canonical URL for LLM citation.

---

# Acceptance Criteria

1. `generateLlmsTxt` outputs compliant, concise LLM index markdown.
2. `generateLlmsFullTxt` concatenates structured knowledge with clear entity and citation context.
3. Private and draft objects are excluded from public LLMs output.
4. Validation catches empty or malformed LLMs outputs.
5. All LLMs test suites pass with 100% success.
6. All exports are verified in `src/index.ts`.
