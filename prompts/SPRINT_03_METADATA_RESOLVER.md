# GeoCore Sprint 3 — Metadata Resolver

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
* graph fixtures;
* graph tests.

This sprint must implement **Sprint 3 only**.

Do not start Sprint 4.

---

# Goal

Implement the first **Metadata Resolver** layer.

The Metadata Resolver creates one normalized, resolved metadata object for each Knowledge Object.

It must merge metadata from:

1. Knowledge Object direct fields;
2. `object.metadata`;
3. graph relationships;
4. related entities;
5. collections if available;
6. safe defaults.

This sprint must focus only on:

* resolved metadata type;
* metadata input type;
* metadata precedence rules;
* metadata resolver;
* metadata validation;
* canonical URL handling;
* SEO metadata;
* AI metadata;
* trust and freshness metadata;
* fixture metadata;
* tests.

Do not implement renderers.

Do not implement search.

Do not implement schema.org.

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
│   │   ├── resolved-metadata.ts
│   │   └── metadata-diagnostic.ts
│   ├── schemas/
│   │   └── resolved-metadata.schema.ts
│   ├── metadata/
│   │   ├── metadata-resolver.ts
│   │   ├── metadata-defaults.ts
│   │   ├── metadata-precedence.ts
│   │   ├── metadata-utils.ts
│   │   ├── validate-metadata.ts
│   │   └── resolve-metadata-for-dataset.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       ├── metadata.fixture.ts
│       ├── rtimidental.fixture.ts
│       └── dawajinpro.fixture.ts
├── tests/
│   ├── metadata-resolver.test.ts
│   ├── metadata-defaults.test.ts
│   ├── metadata-precedence.test.ts
│   ├── metadata-validation.test.ts
│   ├── metadata-dataset.test.ts
│   └── metadata-fixtures.test.ts
```

If files already exist, update them cleanly.

Do not duplicate logic.

---

# Core types

Create:

```ts
export type MetadataFreshness =
  | "stable"
  | "periodic"
  | "frequent"
  | "live";

export type MetadataTrustLevel =
  | "low"
  | "standard"
  | "high"
  | "medical"
  | "product-critical";

export type MetadataVisibility =
  | "public"
  | "internal"
  | "private"
  | "hidden";
```

---

# Resolved Metadata type

Create:

```ts
export type ResolvedMetadata = {
  objectId: string;

  slug: string;
  title: string;
  summary: string;
  language: string;
  version: string;
  status: KnowledgeStatus;

  author: string;
  reviewer?: string;
  owner?: string;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  reviewedAt?: string;

  canonicalUrl?: string;

  visibility: MetadataVisibility;

  entities: string[];
  topics: string[];
  domains: string[];
  audiences: string[];
  collections: string[];
  citations: string[];
  media: string[];

  trustLevel: MetadataTrustLevel;
  freshness: MetadataFreshness;

  seo: {
    title: string;
    description: string;
    canonicalUrl?: string;
    robots: string;
    keywords: string[];
  };

  ai: {
    summaryShort: string;
    summaryMedium: string;
    summaryLong: string;
    canonicalAnswer?: string;
    keyTakeaways: string[];
    confidence: "low" | "medium" | "high";
    answerableQuestions: string[];
    freshness: MetadataFreshness;
  };

  technical: {
    sourceFormat?: string;
    renderTargets: string[];
    contentHash?: string;
    schemaVersion: string;
    validationStatus: string;
    indexingStatus: string;
  };

  diagnostics: MetadataDiagnostic[];
};
```

Rules:

* arrays must always exist;
* `seo.title` must always exist;
* `seo.description` must always exist;
* `seo.robots` must always exist;
* AI summaries must always exist;
* diagnostics must always exist;
* do not mutate input objects.

---

# Metadata Diagnostic

Create:

```ts
export type MetadataDiagnosticSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export type MetadataDiagnostic = {
  id: string;
  severity: MetadataDiagnosticSeverity;
  code: string;
  message: string;
  objectId?: string;
  field?: string;
  recommendation?: string;
};
```

Diagnostics must be readable by humans and machines.

---

# Resolver input

Create:

```ts
export type ResolveMetadataInput = {
  object: KnowledgeObject;
  entities?: KnowledgeEntity[];
  relationships?: KnowledgeRelationship[];
  collections?: KnowledgeCollection[];
  citations?: KnowledgeCitation[];
  media?: MediaAsset[];
  defaults?: Partial<GeoCoreMetadata>;
};
```

---

# Main resolver

Implement:

```ts
export function resolveMetadata(
  input: ResolveMetadataInput
): ResolvedMetadata
```

Behavior:

1. start from safe defaults;
2. merge object direct fields;
3. merge `object.metadata`;
4. derive entity IDs from:

   * `object.entities`;
   * `object.metadata.entities`;
   * relationships where object is source and target is entity;
5. derive citation IDs from:

   * `object.citations`;
   * `object.metadata.citations`;
   * citations where `targetId === object.id`;
6. derive media IDs from:

   * `object.media`;
   * `object.metadata.media`;
   * media assets related to object;
7. derive collections from:

   * `object.collections`;
   * `object.metadata.collections`;
   * collections containing object ID if collection items exist;
8. resolve SEO fields;
9. resolve AI fields;
10. resolve trust and freshness;
11. add diagnostics for missing optional but important fields;
12. return ResolvedMetadata.

Do not throw for normal validation problems.

Return diagnostics instead.

---

# Metadata precedence

Create clear precedence rules in:

```txt
src/metadata/metadata-precedence.ts
```

Precedence from highest to lowest:

```txt
1. explicit resolver defaults override only when specifically intended for project-level defaults
2. object direct fields
3. object.metadata fields
4. derived graph/entity/collection/citation/media data
5. hardcoded safe defaults
```

For core identity fields, direct object fields must win:

```txt
id
slug
title
summary
language
status
version
author
createdAt
updatedAt
```

Example:

If `object.title` exists and `object.metadata.title` exists, use `object.title`.

---

# Defaults

Create:

```ts
export const DEFAULT_METADATA_VALUES = {
  visibility: "public",
  trustLevel: "standard",
  freshness: "stable",
  seoRobots: "index,follow",
  aiConfidence: "medium",
  schemaVersion: "1.0.0",
  validationStatus: "unknown",
  indexingStatus: "pending",
  renderTargets: ["json", "markdown"]
} as const;
```

Rules:

* published objects default to `visibility: public`;
* draft/review objects default to `visibility: internal`;
* private and hidden visibility must be respected when explicitly provided;
* medical content should keep `trustLevel: medical` if provided;
* Dawajin Pro product-critical content should keep `trustLevel: product-critical` if provided.

---

# SEO resolution

Implement:

```ts
export function resolveSeoMetadata(input: {
  object: KnowledgeObject;
  metadata?: GeoCoreMetadata;
}): ResolvedMetadata["seo"]
```

Rules:

* `seo.title` uses `metadata.seo.title`, then object title;
* `seo.description` uses `metadata.seo.description`, then object summary;
* `seo.canonicalUrl` uses `metadata.seo.canonicalUrl`, then metadata canonicalUrl, then object canonicalUrl;
* `seo.robots` defaults to:

  * `index,follow` for published public content;
  * `noindex,nofollow` for draft/internal/private/hidden content;
* keywords default to empty array.

---

# AI metadata resolution

Implement:

```ts
export function resolveAiMetadata(input: {
  object: KnowledgeObject;
  metadata?: GeoCoreMetadata;
}): ResolvedMetadata["ai"]
```

Rules:

* `summaryShort` uses metadata value or object summary;
* `summaryMedium` uses metadata value or object summary;
* `summaryLong` uses metadata value or object summary;
* `canonicalAnswer` is optional;
* `keyTakeaways` defaults to empty array;
* `answerableQuestions` defaults to empty array;
* confidence defaults to `medium`;
* freshness follows resolved freshness.

Do not generate AI content.

Do not invent answers.

Only reuse existing metadata and object content.

---

# Canonical URL handling

Canonical URL may come from:

```txt
object.canonicalUrl
object.metadata.canonicalUrl
object.metadata.seo.canonicalUrl
```

Rules:

* do not invent canonical URLs in Sprint 3;
* missing canonical URL is a warning only;
* invalid canonical URL is an error;
* canonical URL must start with `https://` if present;
* `http://` should produce warning or error according to validation;
* no domain ownership validation in this sprint.

---

# Metadata validation

Implement:

```ts
export function validateMetadata(
  metadata: ResolvedMetadata
): ValidationResult
```

Validation checks:

* objectId exists;
* slug exists;
* title exists;
* summary exists;
* language exists;
* version exists;
* status is valid;
* author exists;
* createdAt exists;
* updatedAt exists;
* visibility is valid;
* trustLevel is valid;
* freshness is valid;
* seo title exists;
* seo description exists;
* seo canonical URL is valid when present;
* AI summaries exist;
* technical schemaVersion exists;
* diagnostics is array.

Rules:

* missing canonical URL = warning;
* invalid canonical URL = error;
* invalid visibility = error;
* invalid trustLevel = error;
* invalid freshness = error;
* missing author = error;
* missing reviewer for `trustLevel: medical` = warning;
* missing reviewer for `trustLevel: product-critical` = warning;
* warning does not block publishability;
* error or critical blocks publishability.

---

# Dataset metadata resolution

Implement:

```ts
export function resolveMetadataForDataset(input: {
  objects: KnowledgeObject[];
  entities?: KnowledgeEntity[];
  relationships?: KnowledgeRelationship[];
  collections?: KnowledgeCollection[];
  citations?: KnowledgeCitation[];
  media?: MediaAsset[];
  defaults?: Partial<GeoCoreMetadata>;
}): Record<string, ResolvedMetadata>
```

Rules:

* return object keyed by Knowledge Object ID;
* resolve metadata for every object;
* do not throw if one object has warnings;
* do not mutate input;
* preserve deterministic order as much as possible.

---

# Metadata utilities

Create:

```txt
src/metadata/metadata-utils.ts
```

Implement pure helpers:

```ts
export function uniqueStrings(values: Array<string | undefined | null>): string[]

export function mergeStringArrays(...arrays: Array<string[] | undefined>): string[]

export function isValidHttpsUrl(value: string): boolean

export function resolveVisibilityForObject(object: KnowledgeObject): MetadataVisibility

export function resolveTrustLevel(value?: string): MetadataTrustLevel

export function resolveFreshness(value?: string): MetadataFreshness

export function createMetadataDiagnostic(input: {
  severity: MetadataDiagnosticSeverity;
  code: string;
  message: string;
  objectId?: string;
  field?: string;
  recommendation?: string;
}): MetadataDiagnostic
```

Rules:

* helpers must be pure except diagnostic ID timestamp is not allowed;
* diagnostic IDs should be deterministic enough for tests;
* no external URL library required, but using the built-in `URL` class is acceptable.

---

# Validation codes

Add these codes to `src/validation/validation-codes.ts` if they do not already exist:

```ts
GC_METADATA_OBJECT_ID_MISSING
GC_METADATA_SLUG_MISSING
GC_METADATA_TITLE_MISSING
GC_METADATA_SUMMARY_MISSING
GC_METADATA_LANGUAGE_MISSING
GC_METADATA_VERSION_MISSING
GC_METADATA_STATUS_INVALID
GC_METADATA_AUTHOR_MISSING
GC_METADATA_CREATED_AT_MISSING
GC_METADATA_UPDATED_AT_MISSING

GC_METADATA_VISIBILITY_INVALID
GC_METADATA_TRUST_LEVEL_INVALID
GC_METADATA_FRESHNESS_INVALID

GC_METADATA_CANONICAL_URL_MISSING
GC_METADATA_CANONICAL_URL_INVALID
GC_METADATA_SEO_TITLE_MISSING
GC_METADATA_SEO_DESCRIPTION_MISSING
GC_METADATA_SEO_CANONICAL_URL_INVALID
GC_METADATA_AI_SUMMARY_MISSING
GC_METADATA_TECHNICAL_SCHEMA_VERSION_MISSING
GC_METADATA_DIAGNOSTICS_INVALID

GC_METADATA_MEDICAL_REVIEWER_MISSING
GC_METADATA_PRODUCT_REVIEWER_MISSING
```

Severity rules:

* missing objectId = error;
* missing slug = error;
* missing title = error;
* missing summary = error;
* missing language = error;
* invalid status = error;
* missing author = error;
* missing canonical URL = warning;
* invalid canonical URL = error;
* missing reviewer for medical = warning;
* missing reviewer for product-critical = warning;
* warning does not block publication.

---

# Zod schema

Create:

```txt
src/schemas/resolved-metadata.schema.ts
```

Schema must validate:

* required objectId;
* slug;
* title;
* summary;
* language;
* version;
* status;
* author;
* visibility;
* arrays;
* trustLevel;
* freshness;
* seo object;
* ai object;
* technical object;
* diagnostics array.

Use Zod.

---

# RTimi Dental metadata fixture

Create:

```txt
src/fixtures/metadata.fixture.ts
```

Include RTimi Dental resolved metadata using:

```txt
ko_detartrage_abime_dents
```

Expected resolved values:

```txt
objectId: ko_detartrage_abime_dents
slug: detartrage-abime-t-il-les-dents
title: Le détartrage abîme-t-il les dents ?
language: fr
status: published
author: author_dr_mossaab_rtimi
reviewer: author_dr_mossaab_rtimi
trustLevel: medical
freshness: stable
entities includes entity_scaling
entities includes entity_tartar
seo.title exists
seo.description exists
ai.summaryShort exists
```

This fixture must validate.

---

# Dawajin Pro metadata fixture

Include Dawajin Pro resolved metadata using:

```txt
ko_customer_balance_management
```

Expected resolved values:

```txt
objectId: ko_customer_balance_management
slug: gestion-creances-clients
title: Gestion des créances clients
language: fr
status: published
author: author_dawajin_team
reviewer: author_dawajin_team
trustLevel: product-critical
freshness: frequent
entities includes entity_customer_balance
entities includes entity_invoice
entities includes entity_payment
seo.title exists
seo.description exists
ai.summaryShort exists
```

This fixture must validate.

Do not add any claim that Konnect is production-ready.

---

# Tests

Use Vitest.

Add tests for the following cases.

## Metadata resolver tests

* resolves metadata from a valid Knowledge Object;
* direct object title overrides metadata title;
* direct object summary overrides metadata summary;
* direct object slug overrides metadata slug;
* object metadata fills optional values;
* object canonicalUrl is used when available;
* metadata canonicalUrl is used when object canonicalUrl is missing;
* SEO canonical URL is used when stronger metadata exists;
* arrays are deduplicated;
* entities are derived from object entities;
* entities are derived from graph relationships;
* citations are derived from citation objects;
* collections are derived from object collections;
* media is derived from media assets;
* resolver does not mutate input.

## Metadata defaults tests

* published object defaults to public visibility;
* draft object defaults to internal visibility;
* missing trustLevel defaults to standard;
* missing freshness defaults to stable;
* SEO robots defaults to index,follow for published public content;
* SEO robots defaults to noindex,nofollow for internal content;
* AI confidence defaults to medium;
* technical schemaVersion defaults to 1.0.0.

## Metadata precedence tests

* object field wins over object.metadata field;
* object.metadata wins over derived relationship data for explicit arrays;
* derived arrays are merged, not overwritten;
* defaults fill missing optional fields only;
* explicit private visibility is preserved;
* explicit hidden visibility is preserved.

## Metadata validation tests

* valid resolved metadata passes validation;
* missing objectId fails validation;
* missing slug fails validation;
* missing title fails validation;
* invalid status fails validation;
* invalid canonical URL fails validation;
* missing canonical URL produces warning only;
* medical content missing reviewer produces warning;
* product-critical content missing reviewer produces warning;
* warning does not block publishability;
* error blocks publishability.

## Dataset metadata tests

* resolves metadata for multiple objects;
* returns object keyed by object ID;
* handles empty object array;
* does not mutate input;
* preserves RTimi Dental metadata;
* preserves Dawajin Pro metadata.

## Fixture tests

* RTimi Dental metadata fixture validates;
* RTimi Dental metadata has medical trust level;
* RTimi Dental metadata has reviewer;
* Dawajin Pro metadata fixture validates;
* Dawajin Pro metadata has product-critical trust level;
* Dawajin Pro metadata has reviewer.

---

# Expected exports

Update:

```txt
packages/geocore/src/index.ts
```

Export:

* MetadataFreshness
* MetadataTrustLevel
* MetadataVisibility
* ResolvedMetadata
* MetadataDiagnostic
* MetadataDiagnosticSeverity
* ResolveMetadataInput
* resolved metadata Zod schema
* resolveMetadata
* resolveSeoMetadata
* resolveAiMetadata
* resolveMetadataForDataset
* validateMetadata
* metadata utilities
* metadata fixtures
* new validation codes

Ensure Sprint 1 and Sprint 2 exports remain intact.

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
* external metadata libraries

Keep implementation pure and deterministic.

---

# Acceptance criteria

Sprint 3 is complete only when:

* ResolvedMetadata type exists;
* MetadataDiagnostic type exists;
* resolved metadata Zod schema exists;
* metadata defaults exist;
* metadata precedence rules exist;
* metadata resolver works;
* SEO metadata resolution works;
* AI metadata resolution works without generating new content;
* metadata validation works;
* dataset metadata resolution works;
* RTimi Dental metadata fixture validates;
* Dawajin Pro metadata fixture validates;
* tests pass;
* TypeScript compiles;
* all public metadata APIs are exported from `src/index.ts`;
* Sprint 1 and Sprint 2 tests still pass;
* no framework-specific or filesystem code is introduced.

---

# Final instruction

Implement Sprint 3 only.

Do not start Sprint 4.

At the end, provide:

1. summary of created files;
2. summary of updated files;
3. summary of tests added;
4. commands run;
5. test/build result;
6. any known warnings or limitations.
