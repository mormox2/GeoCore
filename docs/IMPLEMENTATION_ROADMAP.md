# GeoCore Implementation Roadmap

**Project:** GeoCore  
**Status:** MVP Implementation Complete  
**Owner:** Dr Mossaab Rtimi  
**Scope:** Core package, CLI, validation, export, and real examples  
**Current Phase:** MVP Complete  

---

# 1. Goal

This roadmap defines the execution order for implementing GeoCore.

GeoCore must be implemented progressively.

Do not attempt to build all engines at once.

Each sprint must compile, pass tests, and preserve the architecture before moving to the next sprint.

---

# 2. Golden Rule

Implement one sprint at a time.

After each sprint:

1. run TypeScript checks;
2. run tests;
3. fix regressions;
4. verify exports from `src/index.ts`;
5. commit the sprint;
6. only then continue.

Do not skip validation.

Do not merge multiple sprints into one large change.

---

# 3. MVP Sprint List

## Sprint 1 — Core Package Foundation

Create:

```txt
packages/geocore
```

Implement:

* core TypeScript types;
* Zod schemas;
* validation primitives;
* RTimi Dental fixture;
* Dawajin Pro fixture;
* basic tests.

Status: completed

---

## Sprint 2 — Knowledge Graph & Relationship Validation

Implement:

* graph nodes;
* relationship types;
* relationship validation;
* orphan detection;
* parent-child cycle detection;
* graph fixtures;
* graph tests.

Status: completed

---

## Sprint 3 — Metadata Resolver

Implement:

* metadata defaults;
* metadata precedence;
* resolved metadata;
* metadata validation;
* entity-derived metadata;
* collection-derived metadata;
* metadata tests.

Status: completed

---

## Sprint 4 — Renderer Interface

Implement:

* renderer contract;
* renderer input;
* renderer output;
* renderer diagnostics;
* renderer registry;
* renderer validation;
* fake renderer fixtures.

Status: completed

---

## Sprint 5 — JSON & Markdown Renderers

Implement:

* JSON renderer;
* Markdown renderer;
* renderer presets;
* formatter helpers;
* fixture rendering tests.

Status: completed

---

## Sprint 6 — Search Index Generator

Implement:

* SearchDocument;
* SearchIndex;
* text extraction;
* search document generation;
* visibility filtering;
* search validation;
* fixture tests.

Status: completed

---

## Sprint 7 — Schema.org / JSON-LD Generator

Implement:

* JSON-LD types;
* Article schema;
* FAQ schema;
* DefinedTerm schema;
* Collection schema;
* Breadcrumb schema;
* Media schema;
* schema validation.

Status: completed

---

## Sprint 8 — LLMs.txt Generator

Implement:

* `llms.txt`;
* `llms-full.txt`;
* public filtering;
* entity extraction;
* citation extraction;
* LLMs validation.

Status: completed

---

## Sprint 9 — Sitemap Generator

Implement:

* SitemapEntry;
* SitemapOutput;
* XML generation;
* public filtering;
* alternate links;
* image entries;
* sitemap validation.

Status: completed

---

## Sprint 10 — Route Resolver

Implement:

* RouteEntry;
* RouteRegistry;
* route patterns;
* canonical URL resolution;
* route conflict detection;
* redirect loop detection;
* route validation.

Status: completed

---

## Sprint 11 — Static Exporter

Implement:

* in-memory export bundle;
* Markdown export;
* JSON export;
* JSON-LD export;
* search index export;
* LLMs export;
* sitemap export;
* manifest export.

Status: completed

---

## Sprint 12 — Knowledge Loader

Implement:

* raw knowledge inputs;
* Markdown frontmatter loader;
* JSON loader;
* dataset model;
* duplicate detection;
* dataset validation.

Status: completed

---

## Sprint 13 — Validation Pipeline

Implement:

* central validation pipeline;
* validation stages;
* unified report;
* severity aggregation;
* publishability calculation.

Status: completed

---

## Sprint 14 — CLI Tools

Create:

```txt
packages/geocore-cli
```

Implement:

* `geocore init`;
* `geocore validate`;
* `geocore export`;
* `geocore inspect`;
* config loading;
* file discovery;
* export writing.

Status: completed

---

## Sprint 15 — Example Integration: RTimi Dental

Create:

```txt
examples/rtimidental
```

Implement:

* dental Knowledge Objects;
* dental Entities;
* professional review citations;
* media metadata;
* expected outputs;
* example tests.

Status: completed

---

## Sprint 16 — Example Integration: Dawajin Pro

Create:

```txt
examples/dawajinpro
```

Implement:

* product Knowledge Objects;
* business Entities;
* glossary entries;
* product review citations;
* Konnect pre-production documentation;
* expected outputs;
* example tests.

Status: completed

---

# 4. MVP Completion Definition

The GeoCore MVP is complete when:

* `packages/geocore` builds;
* `packages/geocore-cli` builds;
* all tests pass;
* RTimi Dental example validates;
* Dawajin Pro example validates;
* RTimi Dental example exports;
* Dawajin Pro example exports;
* generated outputs include:

  * Markdown;
  * JSON;
  * JSON-LD;
  * search index;
  * `llms.txt`;
  * `llms-full.txt`;
  * `sitemap.xml`;
  * manifest.

---

# 5. Commands Expected After MVP

From RTimi Dental example:

```bash
cd examples/rtimidental
npm run inspect
npm run validate
npm run export
```

From Dawajin Pro example:

```bash
cd examples/dawajinpro
npm run inspect
npm run validate
npm run export
```

Expected result:

```txt
inspect: success
validate: success or documented warnings only
export: success
```

---

# 6. Do Not Implement Yet

Do not implement these before Sprint 16 is complete:

* dashboard;
* database;
* admin UI;
* React integration;
* Next.js integration;
* AI assistant;
* RAG;
* hosted API;
* SaaS multi-user system;
* CMS editor;
* visual graph editor;
* deployment automation.

These belong to Phase 2 or later.

---

# 7. Phase 2 After MVP

After Sprint 16, the next phase may include:

```txt
Phase 2.1 — RTimi Dental website integration
Phase 2.2 — Dawajin Pro website integration
Phase 2.3 — Next.js adapter
Phase 2.4 — API package
Phase 2.5 — Admin dashboard
Phase 2.6 — AI/RAG assistant
Phase 2.7 — Database persistence
```

Do not start Phase 2 until the MVP is stable.

---

# 8. Commit Strategy

Recommended commit pattern:

```txt
feat(core): implement sprint 1 core foundation
feat(graph): implement sprint 2 knowledge graph
feat(metadata): implement sprint 3 metadata resolver
feat(renderer): implement sprint 4 renderer interface
feat(renderers): implement sprint 5 json and markdown renderers
feat(search): implement sprint 6 search index generator
feat(schema): implement sprint 7 json-ld generator
feat(llms): implement sprint 8 llms generator
feat(sitemap): implement sprint 9 sitemap generator
feat(routes): implement sprint 10 route resolver
feat(export): implement sprint 11 static exporter
feat(loader): implement sprint 12 knowledge loader
feat(pipeline): implement sprint 13 validation pipeline
feat(cli): implement sprint 14 geocore cli
feat(example): add rtimidental integration
feat(example): add dawajinpro integration
```

---

# 9. Codex Execution Rule

When giving work to Codex, provide only one sprint at a time.

Do not ask Codex:

```txt
Implement all GeoCore sprints.
```

Instead ask:

```txt
Implement Sprint 1 only.
```

Then after validation:

```txt
Implement Sprint 2 only.
```

This prevents architecture drift and uncontrolled code generation.

---

# 10. Immediate Next Action

All MVP sprints (Sprint 1 through Sprint 16) are complete and validated!

The next phase is Phase 2 (Website Integrations, Next.js Adapters, API package, etc.).
