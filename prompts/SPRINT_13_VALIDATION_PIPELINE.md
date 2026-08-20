# GeoCore Sprint 13 — Validation Pipeline

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 12 implemented the Knowledge Loader.

This sprint must implement **Sprint 13 only**.

Do not start Sprint 14.

---

# Goal

Implement the **Central Validation Pipeline** layer.

The Validation Pipeline executes multi-stage validation checks across the complete knowledge dataset (Dataset, Knowledge Objects, Relationships, Metadata, Routes, Search, Schema, LLMs, Sitemap, Static Export) and produces a unified, structured `PipelineReport` with issue aggregation, severity counts, and publishability status.

This sprint must focus only on:

* `ValidationPipelineConfig`, `ValidationStageReport`, and `PipelineReport` data models;
* Zod validation schemas for pipeline configurations and reports;
* staged execution runner (10 standardized pipeline stages);
* severity levels (`info`, `warning`, `error`, `critical`);
* publishability gate evaluation (`valid: boolean`, `publishable: boolean`);
* fail-fast execution mode support;
* pipeline report formatting and diagnostic normalization;
* pipeline fixtures;
* comprehensive unit tests.

Do not implement CLI commands yet.

Do not implement filesystem discovery yet.

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
│   ├── pipeline/
│   │   ├── validation-pipeline.ts
│   │   ├── pipeline-stages.ts
│   │   ├── pipeline-report.ts
│   │   ├── pipeline-config.ts
│   │   ├── pipeline-utils.ts
│   │   ├── normalize-validation-issues.ts
│   │   └── validate-pipeline-report.ts
│   ├── schemas/
│   │   ├── pipeline-config.schema.ts
│   │   └── pipeline-report.schema.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       └── pipeline.fixture.ts
├── tests/
│   ├── validation-pipeline.test.ts
│   ├── validation-stage.test.ts
│   ├── validation-pipeline-config.test.ts
│   ├── validation-report.test.ts
│   ├── validation-normalization.test.ts
│   └── validation-pipeline-fixtures.test.ts
```

---

# 10 Standardized Pipeline Stages

1. `dataset`: Raw input integrity and unique IDs.
2. `knowledge-objects`: Frontmatter attributes, titles, summaries, language tags.
3. `relationships`: Target existence, valid relationship types, cycles, orphans.
4. `metadata`: Precedence resolution, canonical URLs, SEO & AI fields.
5. `routes`: Path patterns, slug interpolation, conflict detection, redirect loops.
6. `search`: Plaintext extraction, keyword presence, search document validity.
7. `schema`: Schema.org `@graph` generation and structural correctness.
8. `llms`: Markdown structure, headers, citations, LLM readability.
9. `sitemap`: Sitemaps.org XML compliance, alternate links, URL correctness.
10. `static-export`: Asset path safety, collision prevention, manifest integrity.

---

# Core Functions

### 1. `runValidationPipeline(input: { dataset: KnowledgeDataset; config?: ValidationPipelineConfig }): PipelineReport`

Executes all active validation stages sequentially and compiles the unified report.

### 2. `evaluatePublishability(stages: ValidationStageReport[], mode: "public" | "internal"): { valid: boolean; publishable: boolean }`

Determines whether the dataset meets strict publication safety criteria (errors = 0, critical = 0).

### 3. `normalizeValidationIssues(issues: Issue[]): Issue[]`

Normalizes codes, messages, field paths, and recommendations for downstream consumers.

---

# Validation Rules & Diagnostics

* `GC_PIPELINE_EMPTY_DATASET`: Validation pipeline executed on empty dataset.
* `GC_PIPELINE_STAGE_FAILED`: Critical stage execution failure.
* `GC_PIPELINE_UNPUBLISHABLE`: Dataset contains unresolved validation errors preventing export.

---

# Acceptance Criteria

1. Pipeline runs all 10 stages and compiles summary counts (`info`, `warnings`, `errors`, `critical`).
2. `failFast: true` stops execution at first critical error stage.
3. Publishability flag accurately reflects readiness for static generation.
4. All pipeline test suites pass with 100% success.
5. All pipeline exports are verified in `src/index.ts`.
