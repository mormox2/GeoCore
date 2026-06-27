# GeoCore Sprint 5 — JSON & Markdown Renderers

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

This sprint must implement **Sprint 5 only**.

Do not start Sprint 6.

---

# Goal

Implement the first real GeoCore renderers:

```txt
JSON Renderer
Markdown Renderer
```

These renderers transform a validated Knowledge Object and its resolved metadata into output projections.

This sprint must focus only on:

* JSON renderer;
* Markdown renderer;
* renderer presets;
* formatting helpers;
* public/private filtering inside renderer output;
* diagnostics;
* validation;
* fixtures;
* tests.

Do not implement search index.

Do not implement Schema.org / JSON-LD.

Do not implement sitemap.

Do not implement LLMs.txt.

Do not implement CLI.

Do not implement filesystem access.

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
│   ├── renderers/
│   │   ├── json-renderer.ts
│   │   ├── markdown-renderer.ts
│   │   ├── renderer-presets.ts
│   │   ├── renderer-formatters.ts
│   │   ├── renderer-filters.ts
│   │   └── renderer-content-utils.ts
│   ├── schemas/
│   │   ├── json-renderer-output.schema.ts
│   │   └── markdown-renderer-output.schema.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       ├── json-renderer.fixture.ts
│       ├── markdown-renderer.fixture.ts
│       ├── rtimidental.fixture.ts
│       └── dawajinpro.fixture.ts
├── tests/
│   ├── json-renderer.test.ts
│   ├── markdown-renderer.test.ts
│   ├── renderer-presets.test.ts
│   ├── renderer-formatters.test.ts
│   ├── renderer-filters.test.ts
│   └── renderer-output-fixtures.test.ts
```

If files already exist, update them cleanly.

Do not duplicate logic.

---

# JSON Renderer

Create:

```ts
export const jsonRenderer: GeoCoreRenderer
```

Renderer properties:

```ts
{
  id: "json-renderer",
  target: "json",
  format: "object"
}
```

It must implement:

```ts
render(input: RendererInput): RendererOutput
```

The output content must be an object.

Recommended output shape:

```ts
type JsonRendererContent = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  language: string;
  status: string;
  version: string;

  body: string | Record<string, unknown>;

  metadata?: {
    canonicalUrl?: string;
    visibility?: string;
    trustLevel?: string;
    freshness?: string;
    seo?: Record<string, unknown>;
    ai?: Record<string, unknown>;
    technical?: Record<string, unknown>;
  };

  entities?: Array<{
    id: string;
    type?: string;
    canonicalName?: string;
    definition?: string;
  }>;

  relationships?: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    type: string;
    strength?: string;
  }>;

  citations?: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    purpose?: string;
    status?: string;
  }>;

  media?: Array<{
    id: string;
    type?: string;
    title?: string;
    altText?: string;
    canonicalUrl?: string;
  }>;

  generatedAt: string;
};
```

Rules:

* include object core fields;
* include metadata when `includeMetadata !== false`;
* include entities when `includeEntities !== false`;
* include relationships when `includeRelationships !== false`;
* include citations when `includeCitations !== false`;
* include media when `includeMedia !== false`;
* respect `publicOnly`;
* do not expose private or hidden content in public output;
* do not mutate input;
* return diagnostics instead of throwing.

---

# Markdown Renderer

Create:

```ts
export const markdownRenderer: GeoCoreRenderer
```

Renderer properties:

```ts
{
  id: "markdown-renderer",
  target: "markdown",
  format: "string"
}
```

It must implement:

```ts
render(input: RendererInput): RendererOutput
```

The output content must be a Markdown string.

Recommended Markdown output:

```md
# Title

Summary.

<main body>

---

## Metadata

- Language: fr
- Status: published
- Version: 1.0.0
- Canonical URL: https://example.com/page

## Entities

- Entity name — definition

## Citations

- Citation ID: sourceId

## Media

![Alt text](canonicalUrl)
```

Rules:

* first heading must be the object title;
* summary must appear after title;
* body must appear after summary;
* metadata section appears only when `includeMetadata !== false`;
* entities section appears only when `includeEntities !== false`;
* citations section appears only when `includeCitations !== false`;
* media section appears only when `includeMedia !== false`;
* relationships may be included only when `includeRelationships === true`;
* public mode must exclude private/hidden media;
* Markdown must be readable and deterministic;
* do not generate fake citations;
* do not generate fake medical claims;
* do not mutate input.

---

# Renderer Presets

Create:

```ts
export type RendererPreset =
  | "public"
  | "internal"
  | "minimal"
  | "full";
```

Implement:

```ts
export function getRendererPresetOptions(
  preset: RendererPreset
): RendererOptions
```

Preset behavior:

## public

```txt
publicOnly: true
includeMetadata: true
includeEntities: true
includeRelationships: false
includeCitations: true
includeMedia: true
includeDiagnostics: false
```

## internal

```txt
publicOnly: false
includeMetadata: true
includeEntities: true
includeRelationships: true
includeCitations: true
includeMedia: true
includeDiagnostics: true
```

## minimal

```txt
publicOnly: true
includeMetadata: false
includeEntities: false
includeRelationships: false
includeCitations: false
includeMedia: false
includeDiagnostics: false
```

## full

```txt
publicOnly: false
includeMetadata: true
includeEntities: true
includeRelationships: true
includeCitations: true
includeMedia: true
includeDiagnostics: true
```

Rules:

* presets must not mutate returned objects;
* unknown preset should default to public or produce a validation-safe fallback.

---

# Renderer Formatters

Create:

```txt
src/renderers/renderer-formatters.ts
```

Implement:

```ts
export function formatMarkdownHeading(
  text: string,
  level?: number
): string

export function formatMarkdownList(items: string[]): string

export function formatMarkdownMetadataTable(
  values: Record<string, string | undefined>
): string

export function stringifyRendererJsonContent(
  content: Record<string, unknown>
): string

export function normalizeMarkdownBody(
  body: string | Record<string, unknown>
): string
```

Rules:

* heading level defaults to 1;
* heading level must be between 1 and 6;
* empty list returns empty string;
* object body should be pretty JSON inside fenced block;
* string body should remain readable;
* do not use external Markdown libraries.

---

# Renderer Filters

Create:

```txt
src/renderers/renderer-filters.ts
```

Implement:

```ts
export function filterPublicEntities(
  entities?: KnowledgeEntity[]
): KnowledgeEntity[]

export function filterPublicRelationships(
  relationships?: KnowledgeRelationship[]
): KnowledgeRelationship[]

export function filterPublicCitations(
  citations?: KnowledgeCitation[]
): KnowledgeCitation[]

export function filterPublicSources(
  sources?: KnowledgeSource[]
): KnowledgeSource[]

export function filterPublicMedia(
  media?: MediaAsset[]
): MediaAsset[]
```

Rules:

* public filtering must exclude private and hidden visibility when such field exists;
* if no visibility exists, assume public unless status indicates draft/internal/private;
* never expose hidden media in public mode;
* functions must be pure;
* return empty arrays when input is missing.

---

# Renderer Content Utilities

Create:

```txt
src/renderers/renderer-content-utils.ts
```

Implement:

```ts
export function getRenderableEntities(input: RendererInput): KnowledgeEntity[]

export function getRenderableRelationships(input: RendererInput): KnowledgeRelationship[]

export function getRenderableCitations(input: RendererInput): KnowledgeCitation[]

export function getRenderableMedia(input: RendererInput): MediaAsset[]

export function shouldIncludeSection(
  value: boolean | undefined,
  defaultValue: boolean
): boolean

export function createRendererGeneratedMetadata(input: RendererInput): {
  title?: string;
  summary?: string;
  language?: string;
  canonicalUrl?: string;
  generatedAt: string;
}
```

Rules:

* respect renderer options;
* respect publicOnly;
* do not mutate input.

---

# JSON Renderer Diagnostics

The JSON renderer must return diagnostics when:

* renderer input is invalid;
* output validation fails;
* private/hidden content is excluded;
* content cannot be serialized safely.

Add diagnostics where appropriate.

Do not throw for normal validation issues.

---

# Markdown Renderer Diagnostics

The Markdown renderer must return diagnostics when:

* renderer input is invalid;
* output validation fails;
* private/hidden content is excluded;
* object body is empty;
* object body is non-string and has to be serialized as JSON.

Do not throw for normal validation issues.

---

# Validation codes

Add these codes to `src/validation/validation-codes.ts` if they do not already exist:

```ts
GC_JSON_RENDERER_INPUT_INVALID
GC_JSON_RENDERER_OUTPUT_INVALID
GC_JSON_RENDERER_CONTENT_MISSING
GC_JSON_RENDERER_SERIALIZATION_FAILED

GC_MARKDOWN_RENDERER_INPUT_INVALID
GC_MARKDOWN_RENDERER_OUTPUT_INVALID
GC_MARKDOWN_RENDERER_CONTENT_MISSING
GC_MARKDOWN_RENDERER_BODY_EMPTY
GC_MARKDOWN_RENDERER_BODY_SERIALIZED_AS_JSON

GC_RENDERER_PRIVATE_CONTENT_EXCLUDED
GC_RENDERER_HIDDEN_CONTENT_EXCLUDED
GC_RENDERER_PRESET_INVALID
```

Severity rules:

* invalid renderer input = error;
* invalid renderer output = error;
* serialization failure = critical;
* private content excluded = info;
* hidden content excluded = info;
* body serialized as JSON = info;
* empty body = warning;
* invalid preset = warning.

Any error or critical issue must make output validation non-publishable.

Warnings must not block publication.

---

# Zod schemas

Create Zod schemas for:

```txt
JsonRendererContent
MarkdownRendererContent
```

For Markdown output, schema may validate:

```ts
{
  content: string;
}
```

or directly validate renderer output using existing `RendererOutputSchema`.

Use Zod.

---

# RTimi Dental JSON fixture

Create:

```txt
src/fixtures/json-renderer.fixture.ts
```

Include JSON rendering fixture for:

```txt
ko_detartrage_abime_dents
```

Expected:

* rendererId: `json-renderer`;
* target: `json`;
* format: `object`;
* content includes object ID;
* content includes title;
* content includes summary;
* content includes metadata;
* content includes entities;
* no private patient data;
* no critical diagnostics.

---

# RTimi Dental Markdown fixture

Create:

```txt
src/fixtures/markdown-renderer.fixture.ts
```

Include Markdown rendering fixture for:

```txt
ko_detartrage_abime_dents
```

Expected Markdown includes:

```txt
# Le détartrage abîme-t-il les dents ?
```

Expected Markdown also includes:

```txt
Le détartrage n’abîme pas les dents
```

Rules:

* no private patient data;
* no diagnosis;
* no unsupported medical claim;
* no critical diagnostics.

---

# Dawajin Pro JSON fixture

Include JSON rendering fixture for:

```txt
ko_customer_balance_management
```

Expected:

* rendererId: `json-renderer`;
* target: `json`;
* format: `object`;
* content includes object ID;
* content includes title;
* content includes summary;
* content includes metadata;
* content includes entities;
* no Konnect production readiness claim;
* no critical diagnostics.

---

# Dawajin Pro Markdown fixture

Include Markdown rendering fixture for:

```txt
ko_customer_balance_management
```

Expected Markdown includes:

```txt
# Gestion des créances clients
```

Expected Markdown also includes:

```txt
Une créance client représente un montant encore dû par un client.
```

Rules:

* do not mention Konnect production readiness;
* no private tenant data;
* no critical diagnostics.

---

# Tests

Use Vitest.

Add tests for the following cases.

## JSON renderer tests

* JSON renderer has correct ID;
* JSON renderer has target `json`;
* JSON renderer has format `object`;
* renders valid RTimi Dental object;
* renders valid Dawajin Pro object;
* output validates;
* content includes object ID;
* content includes title;
* content includes summary;
* includes metadata by default;
* excludes metadata when option disabled;
* includes entities by default;
* excludes entities when option disabled;
* public mode excludes private media;
* renderer does not mutate input.

## Markdown renderer tests

* Markdown renderer has correct ID;
* Markdown renderer has target `markdown`;
* Markdown renderer has format `string`;
* renders valid RTimi Dental object;
* renders valid Dawajin Pro object;
* output validates;
* Markdown starts with title heading;
* Markdown includes summary;
* Markdown includes body;
* includes metadata by default;
* excludes metadata when option disabled;
* includes entities when enabled;
* excludes media when option disabled;
* object body as record is serialized in code block;
* empty body produces warning;
* renderer does not mutate input.

## Renderer preset tests

* public preset returns expected options;
* internal preset returns expected options;
* minimal preset returns expected options;
* full preset returns expected options;
* preset objects are not shared/mutated;
* invalid preset produces safe fallback or warning.

## Formatter tests

* heading formatter works;
* heading level is clamped between 1 and 6;
* list formatter works;
* empty list returns empty string;
* metadata table formatter works;
* object body becomes JSON code block;
* string body remains string.

## Filter tests

* public entities are preserved;
* private entities are excluded;
* hidden entities are excluded;
* public media are preserved;
* private media are excluded;
* hidden media are excluded;
* missing input returns empty array.

## Fixture tests

* RTimi Dental JSON fixture validates;
* RTimi Dental Markdown fixture validates;
* RTimi Dental Markdown contains expected title;
* Dawajin Pro JSON fixture validates;
* Dawajin Pro Markdown fixture validates;
* Dawajin Pro Markdown contains expected title;
* fixtures have no critical diagnostics.

---

# Expected exports

Update:

```txt
packages/geocore/src/index.ts
```

Export:

* `jsonRenderer`
* `markdownRenderer`
* `RendererPreset`
* `getRendererPresetOptions`
* renderer formatter functions
* renderer filter functions
* renderer content utility functions
* JSON renderer output schema
* Markdown renderer output schema
* JSON renderer fixtures
* Markdown renderer fixtures
* new validation codes

Ensure Sprint 1, Sprint 2, Sprint 3, and Sprint 4 exports remain intact.

No default export.

Use named exports only.

---

# Technical rules

Use:

* TypeScript
* Zod
* Vitest

Do not use:

* React
* Next.js
* DOM APIs
* browser APIs
* database clients
* AI SDKs
* filesystem APIs
* Markdown libraries
* JSON serialization libraries

Keep implementation pure and deterministic.

---

# Acceptance criteria

Sprint 5 is complete only when:

* JSON renderer exists;
* Markdown renderer exists;
* renderer presets exist;
* renderer formatters exist;
* renderer filters exist;
* renderer content utilities exist;
* JSON renderer output validates;
* Markdown renderer output validates;
* RTimi Dental JSON fixture validates;
* RTimi Dental Markdown fixture validates;
* Dawajin Pro JSON fixture validates;
* Dawajin Pro Markdown fixture validates;
* tests pass;
* TypeScript compiles;
* all public renderer APIs are exported from `src/index.ts`;
* Sprint 1, Sprint 2, Sprint 3, and Sprint 4 tests still pass;
* no framework-specific or filesystem code is introduced.

---

# Final instruction

Implement Sprint 5 only.

Do not start Sprint 6.

At the end, provide:

1. summary of created files;
2. summary of updated files;
3. summary of tests added;
4. commands run;
5. test/build result;
6. any known warnings or limitations.
