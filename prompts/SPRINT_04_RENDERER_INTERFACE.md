# GeoCore Sprint 4 — Renderer Interface

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

This sprint must implement **Sprint 4 only**.

Do not start Sprint 5.

---

# Goal

Implement the first **Renderer Interface** layer.

The Renderer Interface defines how GeoCore Knowledge Objects are transformed into output projections.

This sprint creates contracts and validation only.

It must not implement real JSON or Markdown renderers yet.

Those belong to Sprint 5.

This sprint must focus only on:

* renderer types;
* renderer input model;
* renderer output model;
* renderer diagnostics;
* renderer options;
* renderer registry;
* fake test renderer;
* renderer validation;
* tests.

Do not implement JSON renderer.

Do not implement Markdown renderer.

Do not implement search.

Do not implement Schema.org.

Do not implement sitemap.

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
│   ├── types/
│   │   ├── renderer.ts
│   │   ├── renderer-input.ts
│   │   ├── renderer-output.ts
│   │   └── renderer-diagnostic.ts
│   ├── schemas/
│   │   ├── renderer-input.schema.ts
│   │   ├── renderer-output.schema.ts
│   │   └── renderer-diagnostic.schema.ts
│   ├── renderer/
│   │   ├── renderer-interface.ts
│   │   ├── renderer-registry.ts
│   │   ├── renderer-utils.ts
│   │   ├── validate-renderer-input.ts
│   │   ├── validate-renderer-output.ts
│   │   └── fake-renderer.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       ├── renderer.fixture.ts
│       ├── rtimidental.fixture.ts
│       └── dawajinpro.fixture.ts
├── tests/
│   ├── renderer-input.test.ts
│   ├── renderer-output.test.ts
│   ├── renderer-registry.test.ts
│   ├── fake-renderer.test.ts
│   ├── renderer-validation.test.ts
│   └── renderer-fixtures.test.ts
```

If files already exist, update them cleanly.

Do not duplicate logic.

---

# Renderer target

Create:

```ts
export type RendererTarget =
  | "json"
  | "markdown"
  | "html"
  | "text"
  | "schema"
  | "search"
  | "llms"
  | "sitemap"
  | "custom";
```

---

# Renderer output format

Create:

```ts
export type RendererOutputFormat =
  | "string"
  | "json"
  | "object"
  | "array";
```

---

# Renderer diagnostic

Create:

```ts
export type RendererDiagnosticSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export type RendererDiagnostic = {
  id: string;
  severity: RendererDiagnosticSeverity;
  code: string;
  message: string;
  rendererId?: string;
  objectId?: string;
  field?: string;
  recommendation?: string;
};
```

Diagnostics must be readable by humans and machines.

---

# Renderer Input

Create:

```ts
export type RendererInput = {
  object: KnowledgeObject;

  metadata?: ResolvedMetadata;

  entities?: KnowledgeEntity[];
  relationships?: KnowledgeRelationship[];
  collections?: KnowledgeCollection[];
  citations?: KnowledgeCitation[];
  sources?: KnowledgeSource[];
  media?: MediaAsset[];

  options?: RendererOptions;
};
```

Rules:

* `object` is required;
* all other arrays are optional;
* renderers must never mutate input.

---

# Renderer Options

Create:

```ts
export type RendererOptions = {
  target?: RendererTarget;
  language?: string;
  includeMetadata?: boolean;
  includeRelationships?: boolean;
  includeEntities?: boolean;
  includeCitations?: boolean;
  includeMedia?: boolean;
  includeDiagnostics?: boolean;
  publicOnly?: boolean;
  custom?: Record<string, unknown>;
};
```

Default behavior:

```txt
includeMetadata: true
includeRelationships: true
includeEntities: true
includeCitations: true
includeMedia: true
includeDiagnostics: true
publicOnly: true
```

---

# Renderer Output

Create:

```ts
export type RendererOutput = {
  rendererId: string;
  target: RendererTarget;
  format: RendererOutputFormat;

  objectId: string;

  content: string | Record<string, unknown> | unknown[];

  metadata?: {
    title?: string;
    summary?: string;
    language?: string;
    canonicalUrl?: string;
    generatedAt: string;
  };

  diagnostics: RendererDiagnostic[];
};
```

Rules:

* `rendererId` is required;
* `target` is required;
* `format` is required;
* `objectId` is required;
* `content` is required;
* diagnostics must always exist as an array;
* generatedAt must be ISO string when metadata exists.

---

# Renderer interface

Create:

```ts
export type GeoCoreRenderer = {
  id: string;
  target: RendererTarget;
  format: RendererOutputFormat;

  render(input: RendererInput): RendererOutput;
};
```

Rules:

* renderers must be synchronous in this sprint;
* async rendering is out of scope;
* renderers must not throw for normal validation errors;
* renderers should return diagnostics.

---

# Renderer Registry

Create:

```ts
export type RendererRegistry = {
  renderers: GeoCoreRenderer[];
};
```

Implement:

```ts
export function createRendererRegistry(
  renderers?: GeoCoreRenderer[]
): RendererRegistry

export function registerRenderer(
  registry: RendererRegistry,
  renderer: GeoCoreRenderer
): RendererRegistry

export function getRendererById(
  registry: RendererRegistry,
  id: string
): GeoCoreRenderer | undefined

export function getRenderersByTarget(
  registry: RendererRegistry,
  target: RendererTarget
): GeoCoreRenderer[]

export function renderWithRenderer(
  renderer: GeoCoreRenderer,
  input: RendererInput
): RendererOutput

export function renderWithRegistry(input: {
  registry: RendererRegistry;
  rendererId: string;
  input: RendererInput;
}): RendererOutput
```

Rules:

* registry functions must not mutate input;
* duplicate renderer IDs are not allowed;
* unknown renderer ID should return an error output, not throw;
* renderer exceptions should be caught and converted to critical diagnostics.

---

# Fake Renderer

Create a fake renderer for tests:

```ts
export const fakeRenderer: GeoCoreRenderer = {
  id: "fake-renderer",
  target: "custom",
  format: "object",
  render(input) {
    return {
      rendererId: "fake-renderer",
      target: "custom",
      format: "object",
      objectId: input.object.id,
      content: {
        id: input.object.id,
        title: input.object.title
      },
      metadata: {
        title: input.object.title,
        summary: input.object.summary,
        language: input.object.language,
        canonicalUrl: input.metadata?.canonicalUrl,
        generatedAt: new Date().toISOString()
      },
      diagnostics: []
    };
  }
};
```

Use this only for interface and registry tests.

---

# Renderer Input Validation

Implement:

```ts
export function validateRendererInput(
  input: Partial<RendererInput>
): ValidationResult
```

Validation checks:

* object exists;
* object ID exists;
* object title exists;
* object body exists;
* object language exists;
* metadata objectId matches object ID when metadata exists;
* entities array is valid when present;
* relationships array is valid when present;
* citations array is valid when present;
* media array is valid when present.

---

# Renderer Output Validation

Implement:

```ts
export function validateRendererOutput(
  output: Partial<RendererOutput>
): ValidationResult
```

Validation checks:

* rendererId exists;
* target is valid;
* format is valid;
* objectId exists;
* content exists;
* diagnostics is array;
* metadata generatedAt exists when metadata exists;
* metadata language is valid when present.

---

# Renderer Utilities

Create:

```txt
src/renderer/renderer-utils.ts
```

Implement:

```ts
export function createRendererDiagnostic(input: {
  severity: RendererDiagnosticSeverity;
  code: string;
  message: string;
  rendererId?: string;
  objectId?: string;
  field?: string;
  recommendation?: string;
}): RendererDiagnostic

export function getDefaultRendererOptions(
  options?: RendererOptions
): Required<Omit<RendererOptions, "target" | "language" | "custom">> & {
  target?: RendererTarget;
  language?: string;
  custom?: Record<string, unknown>;
}

export function isValidRendererTarget(value: string): value is RendererTarget

export function isValidRendererOutputFormat(
  value: string
): value is RendererOutputFormat

export function createRendererErrorOutput(input: {
  rendererId: string;
  target: RendererTarget;
  format: RendererOutputFormat;
  objectId?: string;
  code: string;
  message: string;
}): RendererOutput
```

Rules:

* helpers must be pure except timestamp generation where necessary;
* diagnostic IDs should be stable enough for tests;
* do not use external libraries.

---

# Validation codes

Add these codes to `src/validation/validation-codes.ts` if they do not already exist:

```ts
GC_RENDERER_ID_MISSING
GC_RENDERER_TARGET_INVALID
GC_RENDERER_FORMAT_INVALID
GC_RENDERER_OBJECT_MISSING
GC_RENDERER_OBJECT_ID_MISSING
GC_RENDERER_OBJECT_TITLE_MISSING
GC_RENDERER_OBJECT_BODY_MISSING
GC_RENDERER_OBJECT_LANGUAGE_MISSING
GC_RENDERER_METADATA_OBJECT_ID_MISMATCH
GC_RENDERER_ENTITIES_INVALID
GC_RENDERER_RELATIONSHIPS_INVALID
GC_RENDERER_CITATIONS_INVALID
GC_RENDERER_MEDIA_INVALID

GC_RENDERER_OUTPUT_RENDERER_ID_MISSING
GC_RENDERER_OUTPUT_TARGET_INVALID
GC_RENDERER_OUTPUT_FORMAT_INVALID
GC_RENDERER_OUTPUT_OBJECT_ID_MISSING
GC_RENDERER_OUTPUT_CONTENT_MISSING
GC_RENDERER_OUTPUT_DIAGNOSTICS_INVALID
GC_RENDERER_OUTPUT_METADATA_GENERATED_AT_MISSING
GC_RENDERER_OUTPUT_METADATA_LANGUAGE_INVALID

GC_RENDERER_REGISTRY_DUPLICATE_ID
GC_RENDERER_REGISTRY_RENDERER_NOT_FOUND
GC_RENDERER_EXECUTION_FAILED
```

Severity rules:

* missing input object = error;
* missing object ID = error;
* metadata objectId mismatch = error;
* invalid target = error;
* invalid format = error;
* missing output content = error;
* duplicate renderer ID = error;
* renderer not found = error;
* renderer execution failed = critical.

Any error or critical issue must make:

```txt
valid: false
publishable: false
```

Warnings must not block publication.

---

# Zod schemas

Create Zod schemas for:

* RendererInput
* RendererOutput
* RendererDiagnostic

Schema requirements:

* validate required object;
* validate target;
* validate format;
* validate objectId;
* validate content;
* validate diagnostics array;
* validate optional metadata.

Use Zod.

---

# Renderer fixtures

Create:

```txt
src/fixtures/renderer.fixture.ts
```

Include:

* RTimi Dental renderer input using `ko_detartrage_abime_dents`;
* Dawajin Pro renderer input using `ko_customer_balance_management`;
* fake renderer output for each.

Expected:

* both inputs validate;
* fake renderer output validates;
* no critical diagnostics.

Do not add any claim that Konnect is production-ready.

---

# Tests

Use Vitest.

Add tests for the following cases.

## Renderer input tests

* valid renderer input passes validation;
* missing object fails validation;
* missing object ID fails validation;
* missing object title fails validation;
* missing object body fails validation;
* missing object language fails validation;
* metadata objectId mismatch fails validation;
* valid optional arrays pass validation.

## Renderer output tests

* valid renderer output passes validation;
* missing rendererId fails validation;
* invalid target fails validation;
* invalid format fails validation;
* missing objectId fails validation;
* missing content fails validation;
* diagnostics must be array;
* metadata generatedAt is required when metadata exists.

## Renderer registry tests

* creates empty registry;
* registers renderer;
* does not mutate original registry;
* prevents duplicate renderer IDs;
* gets renderer by ID;
* gets renderers by target;
* unknown renderer ID returns error output;
* renderer exception returns critical diagnostic.

## Fake renderer tests

* fake renderer renders RTimi Dental object;
* fake renderer renders Dawajin Pro object;
* fake renderer output includes object ID;
* fake renderer output includes title;
* fake renderer output validates.

## Renderer validation tests

* error issue blocks validity;
* warning issue does not block publishability;
* critical renderer execution issue blocks publishability.

## Fixture tests

* RTimi Dental renderer fixture validates;
* Dawajin Pro renderer fixture validates;
* fixture outputs validate;
* fixtures have no critical diagnostics.

---

# Expected exports

Update:

```txt
packages/geocore/src/index.ts
```

Export:

* RendererTarget
* RendererOutputFormat
* RendererDiagnosticSeverity
* RendererDiagnostic
* RendererInput
* RendererOptions
* RendererOutput
* GeoCoreRenderer
* RendererRegistry
* renderer Zod schemas
* createRendererRegistry
* registerRenderer
* getRendererById
* getRenderersByTarget
* renderWithRenderer
* renderWithRegistry
* fakeRenderer
* validateRendererInput
* validateRendererOutput
* renderer utilities
* renderer fixtures
* new validation codes

Ensure Sprint 1, Sprint 2, and Sprint 3 exports remain intact.

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
* external renderer libraries

Keep implementation pure and deterministic.

---

# Acceptance criteria

Sprint 4 is complete only when:

* RendererInput type exists;
* RendererOutput type exists;
* RendererDiagnostic type exists;
* GeoCoreRenderer interface exists;
* RendererRegistry exists;
* renderer Zod schemas exist;
* renderer validation works;
* fake renderer works;
* renderer registry works;
* renderer execution errors are captured as diagnostics;
* RTimi Dental renderer fixture validates;
* Dawajin Pro renderer fixture validates;
* tests pass;
* TypeScript compiles;
* all public renderer APIs are exported from `src/index.ts`;
* Sprint 1, Sprint 2, and Sprint 3 tests still pass;
* no framework-specific or filesystem code is introduced.

---

# Final instruction

Implement Sprint 4 only.

Do not start Sprint 5.

At the end, provide:

1. summary of created files;
2. summary of updated files;
3. summary of tests added;
4. commands run;
5. test/build result;
6. any known warnings or limitations.
