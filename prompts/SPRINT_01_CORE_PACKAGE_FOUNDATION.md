# GeoCore Sprint 1 — Core Package Foundation

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

The repository structure is:

```txt
GeoCore/
├── docs/
├── knowledge/
├── specs/
├── packages/
├── apps/
├── examples/
├── scripts/
└── assets/
```

The normative specifications are located in:

```txt
specs/0001-geocore-foundation.md
specs/0002-knowledge-object.md
specs/0003-knowledge-graph.md
specs/0004-metadata-engine.md
specs/0005-renderer-engine.md
specs/0006-entity-engine.md
specs/0007-content-validation.md
specs/0008-search-engine.md
specs/0009-ai-integration.md
specs/0010-documentation-engine.md
specs/0011-schema-engine.md
specs/0012-llms-engine.md
specs/0013-sitemap-engine.md
specs/0014-collection-engine.md
specs/0015-taxonomy-engine.md
specs/0016-glossary-engine.md
specs/0017-citation-engine.md
specs/0018-media-engine.md
specs/0019-api-engine.md
```

## Goal

Implement Sprint 1 only.

Create the first implementation package:

```txt
packages/geocore
```

This sprint must only implement the pure core domain foundation.

Do not implement engines yet.

Do not implement renderers yet.

Do not implement search.

Do not implement sitemap.

Do not implement APIs.

Do not implement CLI.

Do not implement React.

Do not implement Next.js.

Do not implement database persistence.

Do not implement file system access.

Focus only on:

* TypeScript package setup;
* core domain types;
* Zod schemas;
* validation primitives;
* minimal fixtures;
* unit tests.

---

# Required package structure

Create:

```txt
packages/geocore/
├── src/
│   ├── index.ts
│   ├── types/
│   │   ├── knowledge-object.ts
│   │   ├── entity.ts
│   │   ├── relationship.ts
│   │   ├── metadata.ts
│   │   ├── collection.ts
│   │   ├── taxonomy.ts
│   │   ├── glossary.ts
│   │   ├── citation.ts
│   │   └── media.ts
│   ├── schemas/
│   │   ├── knowledge-object.schema.ts
│   │   ├── entity.schema.ts
│   │   ├── relationship.schema.ts
│   │   └── metadata.schema.ts
│   ├── validation/
│   │   ├── validate-knowledge-object.ts
│   │   ├── validation-result.ts
│   │   └── validation-codes.ts
│   └── fixtures/
│       ├── rtimidental.fixture.ts
│       └── dawajinpro.fixture.ts
├── tests/
│   ├── knowledge-object.test.ts
│   ├── entity.test.ts
│   └── validation.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

If some folders already exist, update them cleanly.

Do not duplicate logic.

---

# Technical requirements

Use:

```txt
TypeScript
Zod
Vitest
```

The package must be framework-agnostic.

Do not use:

```txt
React
Next.js
DOM APIs
browser APIs
database clients
AI SDKs
file system APIs
external CMS libraries
```

---

# Core types to implement

Implement and export these types:

```txt
KnowledgeObject
KnowledgeEntity
KnowledgeRelationship
GeoCoreMetadata
KnowledgeCollection
TaxonomyTerm
GlossaryEntry
KnowledgeSource
KnowledgeCitation
MediaAsset
ValidationResult
ValidationIssue
```

All public types must be exported from:

```txt
packages/geocore/src/index.ts
```

---

# Knowledge Object type

Implement a minimal `KnowledgeObject` type.

Required fields:

```txt
id
slug
title
summary
body
language
status
version
createdAt
updatedAt
author
```

Recommended shape:

```ts
export type KnowledgeStatus =
  | "draft"
  | "review"
  | "published"
  | "archived";

export type KnowledgeObject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string | Record<string, unknown>;
  language: string;
  status: KnowledgeStatus;
  version: string;
  createdAt: string;
  updatedAt: string;
  author: string;

  reviewer?: string;
  owner?: string;
  canonicalUrl?: string;

  metadata?: GeoCoreMetadata;

  entities?: string[];
  collections?: string[];
  citations?: string[];
  media?: string[];

  visibility?: "public" | "internal" | "private" | "hidden";
};
```

Keep the model minimal.

Do not overbuild.

---

# Entity type

Implement a minimal `KnowledgeEntity` type.

```ts
export type KnowledgeEntity = {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;

  aliases?: string[];
  language?: string;
  status?: string;

  relatedObjectIds?: string[];
  relatedEntityIds?: string[];

  createdAt?: string;
  updatedAt?: string;
};
```

---

# Relationship type

Implement a minimal `KnowledgeRelationship` type.

```ts
export type KnowledgeRelationshipType =
  | "related_to"
  | "parent_of"
  | "child_of"
  | "part_of"
  | "requires"
  | "explains"
  | "cites"
  | "authored_by"
  | "mentions"
  | "uses_media"
  | "translation_of"
  | "alternative_to"
  | "contrasts_with"
  | "example_of"
  | "classified_as"
  | "reviewed_by"
  | "supports"
  | "verifies";

export type KnowledgeRelationshipStrength =
  | "weak"
  | "medium"
  | "strong"
  | "canonical";

export type KnowledgeRelationshipConfidence =
  | "low"
  | "medium"
  | "high";

export type KnowledgeRelationship = {
  id: string;
  sourceId: string;
  targetId: string;
  type: KnowledgeRelationshipType;
  strength: KnowledgeRelationshipStrength;
  confidence?: KnowledgeRelationshipConfidence;
  reason?: string;
  createdAt: string;
  updatedAt: string;
};
```

Only define the type in Sprint 1.

Do not implement graph validation yet.

That belongs to Sprint 2.

---

# Metadata type

Implement a minimal `GeoCoreMetadata` type.

```ts
export type GeoCoreMetadata = {
  id?: string;
  slug?: string;
  title?: string;
  summary?: string;
  language?: string;
  version?: string;
  status?: string;

  author?: string;
  reviewer?: string;
  owner?: string;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  reviewedAt?: string;

  canonicalUrl?: string;

  entities?: string[];
  topics?: string[];
  domains?: string[];
  audiences?: string[];
  collections?: string[];
  citations?: string[];

  trustLevel?: string;
  freshness?: "stable" | "periodic" | "frequent" | "live";

  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    robots?: string;
    keywords?: string[];
  };

  ai?: {
    summaryShort?: string;
    summaryMedium?: string;
    summaryLong?: string;
    canonicalAnswer?: string;
    keyTakeaways?: string[];
    confidence?: "low" | "medium" | "high";
    answerableQuestions?: string[];
    freshness?: "stable" | "periodic" | "frequent" | "live";
  };

  technical?: {
    sourceFormat?: string;
    renderTargets?: string[];
    contentHash?: string;
    schemaVersion?: string;
    validationStatus?: string;
    indexingStatus?: string;
  };
};
```

---

# Other minimal types

Implement basic minimal versions of:

```txt
KnowledgeCollection
TaxonomyTerm
GlossaryEntry
KnowledgeSource
KnowledgeCitation
MediaAsset
```

Keep them close to the specs, but do not overbuild.

They only need enough structure to compile and support future sprints.

---

# Zod schemas

Create Zod schemas for:

```txt
KnowledgeObject
KnowledgeEntity
KnowledgeRelationship
GeoCoreMetadata
```

Required fields:

```txt
src/schemas/knowledge-object.schema.ts
src/schemas/entity.schema.ts
src/schemas/relationship.schema.ts
src/schemas/metadata.schema.ts
```

Schema requirements:

* validate required fields;
* validate status values;
* validate arrays when present;
* validate body as string or record;
* reject invalid status;
* reject missing required fields.

Use Zod.

---

# Validation primitives

Create:

```txt
src/validation/validation-result.ts
```

Define:

```ts
export type ValidationSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export type ValidationIssue = {
  severity: ValidationSeverity;
  code: string;
  message: string;
  field?: string;
  objectId?: string;
  recommendation?: string;
};

export type ValidationResult = {
  valid: boolean;
  publishable: boolean;
  issues: ValidationIssue[];
};
```

Rules:

* `valid` is false if there is at least one `error` or `critical`.
* `publishable` is false if there is at least one `error` or `critical`.
* warnings do not block publishability.

---

# Validation codes

Create:

```txt
src/validation/validation-codes.ts
```

Export stable codes:

```ts
export const VALIDATION_CODES = {
  GC_ID_MISSING: "GC_ID_MISSING",
  GC_SLUG_MISSING: "GC_SLUG_MISSING",
  GC_TITLE_MISSING: "GC_TITLE_MISSING",
  GC_SUMMARY_MISSING: "GC_SUMMARY_MISSING",
  GC_BODY_MISSING: "GC_BODY_MISSING",
  GC_LANGUAGE_MISSING: "GC_LANGUAGE_MISSING",
  GC_STATUS_INVALID: "GC_STATUS_INVALID",
  GC_VERSION_MISSING: "GC_VERSION_MISSING",
  GC_AUTHOR_MISSING: "GC_AUTHOR_MISSING",
  GC_CREATED_AT_MISSING: "GC_CREATED_AT_MISSING",
  GC_UPDATED_AT_MISSING: "GC_UPDATED_AT_MISSING",
  GC_METADATA_INVALID: "GC_METADATA_INVALID"
} as const;
```

---

# Knowledge Object validation

Create:

```txt
src/validation/validate-knowledge-object.ts
```

Implement:

```ts
export function validateKnowledgeObject(
  object: Partial<KnowledgeObject>
): ValidationResult
```

Validation must check:

```txt
id
slug
title
summary
body
language
status
version
createdAt
updatedAt
author
```

Rules:

* missing required field = error;
* invalid status = error;
* metadata invalid = error or warning depending schema result;
* valid object returns `valid: true`;
* valid object returns `publishable: true`;
* warnings do not block publishability.

---

# Fixtures

Create:

```txt
src/fixtures/rtimidental.fixture.ts
```

Export a valid Knowledge Object:

```ts
export const rtimidentalDetartrageObject = {
  id: "ko_detartrage_abime_dents",
  slug: "detartrage-abime-t-il-les-dents",
  title: "Le détartrage abîme-t-il les dents ?",
  summary: "Réponse claire pour les patients sur le détartrage dentaire.",
  body: "Le détartrage n’abîme pas les dents lorsqu’il est réalisé correctement par un professionnel.",
  language: "fr",
  status: "published",
  version: "1.0.0",
  createdAt: "2026-06-25",
  updatedAt: "2026-06-25",
  author: "author_dr_mossaab_rtimi",
  reviewer: "author_dr_mossaab_rtimi",
  trustLevel: "medical",
  entities: [
    "entity_scaling",
    "entity_tartar"
  ]
};
```

Create:

```txt
src/fixtures/dawajinpro.fixture.ts
```

Export a valid Knowledge Object:

```ts
export const dawajinCustomerBalanceObject = {
  id: "ko_customer_balance_management",
  slug: "gestion-creances-clients",
  title: "Gestion des créances clients",
  summary: "Comprendre et suivre les créances clients dans une activité de distribution avicole.",
  body: "Une créance client représente un montant encore dû par un client.",
  language: "fr",
  status: "published",
  version: "1.0.0",
  createdAt: "2026-06-25",
  updatedAt: "2026-06-25",
  author: "author_dawajin_team",
  reviewer: "author_dawajin_team",
  trustLevel: "product-critical",
  entities: [
    "entity_customer_balance",
    "entity_invoice",
    "entity_payment"
  ]
};
```

If TypeScript complains about extra fields such as `trustLevel`, place them under `metadata`.

Fixtures must pass validation.

---

# Tests

Use Vitest.

Create tests for:

## Knowledge Object tests

* valid Knowledge Object passes schema validation;
* missing ID fails schema validation;
* missing title fails schema validation;
* invalid status fails schema validation;
* string body is accepted;
* object body is accepted.

## Validation tests

* valid Knowledge Object passes validation;
* missing ID produces `GC_ID_MISSING`;
* missing slug produces `GC_SLUG_MISSING`;
* missing title produces `GC_TITLE_MISSING`;
* missing summary produces `GC_SUMMARY_MISSING`;
* missing body produces `GC_BODY_MISSING`;
* missing language produces `GC_LANGUAGE_MISSING`;
* invalid status produces `GC_STATUS_INVALID`;
* missing version produces `GC_VERSION_MISSING`;
* missing author produces `GC_AUTHOR_MISSING`;
* error issue makes `valid: false`;
* error issue makes `publishable: false`.

## Fixture tests

* RTimi Dental fixture passes validation;
* Dawajin Pro fixture passes validation.

---

# Package configuration

Create:

```txt
packages/geocore/package.json
```

Recommended scripts:

```json
{
  "name": "@geocore/core",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^2.0.0"
  }
}
```

Adapt versions to the existing repository if needed.

Do not break root workspace configuration.

---

# TypeScript config

Create:

```txt
packages/geocore/tsconfig.json
```

Recommended:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true
  },
  "include": [
    "src",
    "tests"
  ]
}
```

Adjust only if the repository already has a shared TypeScript config.

---

# README

Create:

```txt
packages/geocore/README.md
```

Include:

```md
# GeoCore Core

GeoCore Core is the framework-agnostic domain package for GeoCore.

It contains:

- Knowledge Object types
- Entity types
- Relationship types
- Metadata types
- Zod schemas
- Validation primitives
- Fixtures

This package must remain pure.

It must not depend on React, Next.js, browser APIs, database clients, or file system APIs.
```

---

# Expected exports

Update:

```txt
packages/geocore/src/index.ts
```

Export:

```txt
all core types
all schemas
validateKnowledgeObject
ValidationResult
ValidationIssue
VALIDATION_CODES
fixtures
```

No default export.

Use named exports only.

---

# Acceptance criteria

Sprint 1 is complete only when:

* `packages/geocore` exists;
* TypeScript compiles;
* tests pass;
* Zod schemas exist;
* validation primitives exist;
* `validateKnowledgeObject` works;
* RTimi Dental fixture passes validation;
* Dawajin Pro fixture passes validation;
* all public APIs are exported from `src/index.ts`;
* no React, Next.js, browser, database, AI, or filesystem dependency is introduced.

---

# Final instruction

Implement Sprint 1 only.

Do not start Sprint 2.

At the end, provide:

1. summary of created files;
2. summary of tests added;
3. commands run;
4. test/build result;
5. any known warnings or limitations.
