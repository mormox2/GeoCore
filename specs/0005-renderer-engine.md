# GeoCore Specification 0005

**Document ID:** GC-SPEC-0005
**Title:** Renderer Engine
**Version:** 1.0.0
**Status:** Accepted
**Depends On:** GC-SPEC-0001 — GeoCore Foundation
**Depends On:** GC-SPEC-0002 — Knowledge Object
**Depends On:** GC-SPEC-0003 — Knowledge Graph
**Depends On:** GC-SPEC-0004 — Metadata Engine
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Renderer Engine** of GeoCore.

The Renderer Engine is responsible for transforming Knowledge Views into usable outputs such as HTML, Markdown, JSON, JSON-LD, PDF, XML, RSS, API responses, and LLM-ready formats.

The Renderer Engine MUST NOT own knowledge.

The Renderer Engine consumes structured knowledge and produces output representations.

---

# 2. Definition

A renderer is a system component that transforms a Knowledge View into a specific output format.

A renderer does not create knowledge.

A renderer does not modify knowledge.

A renderer does not decide what is true.

A renderer only projects validated knowledge into a target format.

---

# 3. Core Principle

Knowledge is permanent.

Renderers are replaceable.

No renderer may become the source of truth.

---

# 4. Rendering Pipeline

GeoCore rendering follows this pipeline:

```text
Knowledge Object
    ↓
Knowledge View
    ↓
Resolved Metadata
    ↓
Renderer
    ↓
Output
```

Each stage has a strict responsibility.

The Knowledge Object contains canonical knowledge.

The Knowledge View adapts knowledge to an audience or use case.

The Metadata Engine resolves metadata.

The Renderer Engine produces the final output.

---

# 5. Renderer Responsibilities

The Renderer Engine is responsible for:

* converting Knowledge Views into output formats;
* applying layout rules;
* applying format-specific constraints;
* generating HTML pages;
* generating Markdown documents;
* generating JSON responses;
* generating JSON-LD structured data;
* generating RSS or XML feeds;
* generating LLM-friendly output;
* generating PDF-ready output;
* validating renderer compatibility;
* detecting rendering errors;
* exposing rendering diagnostics.

The Renderer Engine is NOT responsible for:

* creating canonical knowledge;
* editing knowledge;
* validating editorial truth;
* generating business logic;
* storing canonical metadata;
* replacing the Knowledge Graph;
* replacing the Metadata Engine.

---

# 6. Renderer Independence

Renderers MUST be independent from each other.

The HTML renderer must not depend on the Markdown renderer.

The JSON-LD renderer must not depend on the HTML renderer.

The LLM renderer must not scrape the HTML renderer.

All renderers MUST consume the same structured Knowledge View.

---

# 7. Supported Renderer Types

GeoCore SHOULD support the following renderer types.

| Renderer          | Purpose                              |
| ----------------- | ------------------------------------ |
| HTML Renderer     | Website pages                        |
| Markdown Renderer | Documentation and portable knowledge |
| JSON Renderer     | API output                           |
| JSON-LD Renderer  | Schema.org structured data           |
| XML Renderer      | Sitemap and feed output              |
| RSS Renderer      | Content feeds                        |
| PDF Renderer      | Printable documents                  |
| LLM Renderer      | AI-readable summaries and context    |
| Search Renderer   | Search indexing documents            |
| Voice Renderer    | Future voice assistant output        |

Additional renderers may be added through extension points.

---

# 8. HTML Renderer

The HTML Renderer produces human-readable website pages.

It may generate:

* article pages;
* guide pages;
* FAQ pages;
* glossary pages;
* documentation pages;
* author pages;
* entity pages;
* collection pages;
* landing pages.

The HTML Renderer MUST consume:

* Knowledge View;
* resolved metadata;
* Knowledge Graph relationships;
* rendering configuration;
* locale rules.

The HTML Renderer MUST NOT contain canonical content hardcoded inside components.

---

# 9. Markdown Renderer

The Markdown Renderer produces portable Markdown output.

Markdown output is useful for:

* documentation;
* GitHub repositories;
* LLM ingestion;
* static exports;
* backups;
* human review;
* versioning.

Markdown output SHOULD preserve:

* title;
* summary;
* headings;
* body;
* citations;
* related objects;
* metadata block;
* canonical URL;
* last updated date.

Markdown output MUST be generated from structured knowledge, not manually duplicated.

---

# 10. JSON Renderer

The JSON Renderer produces machine-readable API output.

It SHOULD expose:

```json
{
  "id": "ko_example",
  "slug": "example",
  "title": "Example",
  "summary": "Short summary",
  "body": "...",
  "metadata": {},
  "relationships": [],
  "entities": [],
  "citations": [],
  "version": "1.0.0"
}
```

JSON output is intended for:

* APIs;
* internal tools;
* AI systems;
* search systems;
* integrations;
* future applications.

The JSON Renderer MUST avoid leaking internal-only fields unless explicitly configured.

---

# 11. JSON-LD Renderer

The JSON-LD Renderer produces structured data for search engines and AI systems.

It may generate Schema.org types such as:

* Article
* FAQPage
* HowTo
* BreadcrumbList
* Person
* Organization
* MedicalClinic
* Dentist
* SoftwareApplication
* VideoObject
* WebPage
* CollectionPage
* DefinedTerm

JSON-LD MUST be generated from canonical metadata and graph relationships.

Manual JSON-LD disconnected from Knowledge Objects is prohibited.

---

# 12. LLM Renderer

The LLM Renderer produces AI-readable output.

It SHOULD generate:

* canonical answer;
* short summary;
* medium summary;
* long summary;
* key facts;
* entities;
* citations;
* related objects;
* freshness metadata;
* audience;
* confidence level;
* source references.

The LLM Renderer MUST NOT include hidden instructions intended to manipulate AI behavior.

The purpose of the LLM Renderer is clarity, structure, and reliability.

Not manipulation.

---

# 13. Search Renderer

The Search Renderer produces indexable search documents.

It SHOULD include:

* title;
* summary;
* body text;
* entities;
* tags;
* relationships;
* language;
* author;
* freshness;
* citations;
* collections;
* canonical URL.

Search documents MUST be generated from Knowledge Objects and not from scraped HTML.

---

# 14. PDF Renderer

The PDF Renderer produces printable and shareable documents.

It MAY be implemented later.

PDF output SHOULD preserve:

* title;
* author;
* date;
* version;
* table of contents;
* body;
* citations;
* disclaimers;
* related resources;
* canonical URL.

PDF output MUST remain a projection, not a separate content source.

---

# 15. XML and RSS Renderers

XML and RSS renderers are used for feeds and discovery.

They SHOULD support:

* sitemap generation;
* feed generation;
* update feeds;
* video feeds;
* image feeds;
* documentation feeds.

These renderers MUST consume resolved metadata and canonical URLs.

---

# 16. Knowledge View Requirement

Renderers MUST consume Knowledge Views, not raw Knowledge Objects, when an audience-specific adaptation is required.

Example:

A dental implant Knowledge Object may produce:

* Patient View;
* Dentist View;
* Student View;
* LLM View;
* SEO View.

Each view may then be rendered into:

* HTML;
* Markdown;
* JSON;
* LLM output.

This prevents renderers from embedding audience logic.

---

# 17. Renderer Configuration

Each renderer MAY have configuration.

Example:

```yaml
renderer: html
layout: article
includeToc: true
includeAuthor: true
includeRelatedObjects: true
includeJsonLd: true
```

Configuration must control presentation.

Configuration must not redefine knowledge.

---

# 18. Renderer Inputs

A renderer SHOULD receive a normalized input object.

Example TypeScript model:

```ts
type RendererInput = {
  viewId: string;
  objectId: string;
  viewType: string;
  language: string;
  content: unknown;
  metadata: ResolvedMetadata;
  relationships: KnowledgeRelationship[];
  entities: KnowledgeEntity[];
  citations: KnowledgeCitation[];
  options?: Record<string, unknown>;
};
```

The exact implementation may evolve, but renderers MUST receive structured data.

---

# 19. Renderer Output

A renderer SHOULD produce a standardized output object.

Example:

```ts
type RendererOutput = {
  renderer: string;
  format: string;
  content: string | object | Buffer;
  metadata: {
    generatedAt: string;
    sourceObjectId: string;
    sourceVersion: string;
    language: string;
  };
  diagnostics?: RendererDiagnostic[];
};
```

Renderer output MUST include traceability to the source Knowledge Object and version.

---

# 20. Diagnostics

Renderers SHOULD expose diagnostics.

Diagnostics may include:

* missing metadata;
* missing author;
* missing canonical URL;
* missing citations;
* broken internal links;
* unsupported media;
* incompatible schema type;
* invalid renderer configuration;
* incomplete translations;
* rendering warnings.

Critical renderer errors MUST block output generation.

Warnings MAY allow output generation.

---

# 21. Renderer Registry

GeoCore SHOULD maintain a Renderer Registry.

The registry maps renderer identifiers to renderer implementations.

Example:

```ts
type RendererRegistry = {
  html: KnowledgeRenderer;
  markdown: KnowledgeRenderer;
  json: KnowledgeRenderer;
  jsonLd: KnowledgeRenderer;
  llm: KnowledgeRenderer;
  search: KnowledgeRenderer;
};
```

Renderers SHOULD be replaceable without changing Knowledge Objects.

---

# 22. Extension Points

GeoCore SHOULD allow new renderers to be registered.

A custom renderer may support:

* mobile apps;
* voice assistants;
* chatbots;
* external documentation systems;
* custom APIs;
* domain-specific exports;
* third-party integrations.

Custom renderers MUST follow the same rules as core renderers.

---

# 23. Caching

Renderer outputs MAY be cached.

Cache keys SHOULD include:

* object ID;
* object version;
* view ID;
* renderer type;
* language;
* configuration hash.

Example:

```text
ko_dental_implant:v1.0.0:view_patient:html:fr
```

A renderer cache MUST be invalidated when the source Knowledge Object or relevant metadata changes.

---

# 24. Localization

Renderers MUST respect language and locale rules.

Localized rendering may affect:

* date format;
* text direction;
* typography;
* number formatting;
* URL paths;
* metadata;
* schema output.

For Arabic content, renderers MUST support right-to-left layout when producing visual outputs.

---

# 25. Accessibility

HTML and PDF renderers SHOULD support accessibility requirements.

Generated output SHOULD include:

* semantic headings;
* alt text for images;
* accessible links;
* readable structure;
* proper language attributes;
* correct text direction;
* keyboard-friendly navigation where applicable.

Accessibility is part of knowledge delivery quality.

---

# 26. High-Trust Content

For high-trust content such as medical, dental, legal, financial, or safety-related knowledge, renderers SHOULD expose:

* author;
* reviewer;
* reviewed date;
* citations;
* disclaimer;
* last updated date.

For RTimi Dental, medical HTML pages SHOULD display professional authorship and review metadata.

For AI output, medical content SHOULD include a short safety disclaimer when appropriate.

---

# 27. Product Documentation

For SaaS and product documentation, renderers SHOULD expose:

* product area;
* feature;
* user role;
* difficulty level;
* last verified version;
* related workflows;
* related help articles.

For Dawajin Pro, help content SHOULD clearly identify the relevant business workflow and user type.

---

# 28. Anti-Patterns

The following are prohibited:

* storing canonical content inside React components;
* generating JSON-LD manually without metadata;
* scraping HTML to generate LLM output;
* duplicating Markdown content manually;
* making renderer output the source of truth;
* embedding business logic inside renderers;
* hardcoding internal links instead of using graph relationships;
* creating one renderer per website instead of reusable renderers;
* using SEO metadata as canonical metadata;
* creating hidden AI manipulation prompts inside output.

---

# 29. Acceptance Criteria

This specification is considered implemented when:

* renderers consume Knowledge Views or structured Knowledge Objects;
* no renderer owns canonical knowledge;
* HTML, Markdown, JSON, JSON-LD, and LLM outputs can be generated from the same source;
* renderer outputs include source traceability;
* renderer diagnostics exist;
* renderer errors can block invalid output;
* renderer configuration affects presentation only;
* new renderers can be added without changing Knowledge Objects.

---

# 30. Out of Scope

This specification does not define:

* final React component implementation;
* final PDF rendering library;
* final styling system;
* final deployment strategy;
* final cache provider;
* final schema.org mapping logic;
* final UI rendering framework.

These will be defined in future specifications or implementation documents.

---

# 31. Future Evolution

Future versions may introduce:

* streaming renderers;
* partial rendering;
* incremental rendering;
* edge rendering;
* renderer plugin marketplace;
* visual renderer debugger;
* renderer performance profiling;
* renderer compatibility matrix;
* AI-assisted renderer selection;
* channel-specific output optimization.

---

# Final Statement

A renderer is a projection engine.

It transforms knowledge into a usable format.

It must never become the owner of knowledge.

In GeoCore, renderers are replaceable.

Knowledge is not.

---

**End of Specification**
