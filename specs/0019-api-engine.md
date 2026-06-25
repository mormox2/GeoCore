# GeoCore Specification 0019

**Document ID:** GC-SPEC-0019
**Title:** API Engine
**Version:** 1.0.0
**Status:** Accepted
**Depends On:** GC-SPEC-0001 — GeoCore Foundation
**Depends On:** GC-SPEC-0002 — Knowledge Object
**Depends On:** GC-SPEC-0003 — Knowledge Graph
**Depends On:** GC-SPEC-0004 — Metadata Engine
**Depends On:** GC-SPEC-0005 — Renderer Engine
**Depends On:** GC-SPEC-0006 — Entity Engine
**Depends On:** GC-SPEC-0007 — Content Validation
**Depends On:** GC-SPEC-0008 — Search Engine
**Depends On:** GC-SPEC-0009 — AI Integration
**Depends On:** GC-SPEC-0010 — Documentation Engine
**Depends On:** GC-SPEC-0011 — Schema Engine
**Depends On:** GC-SPEC-0012 — LLMs Engine
**Depends On:** GC-SPEC-0013 — Sitemap Engine
**Depends On:** GC-SPEC-0014 — Collection Engine
**Depends On:** GC-SPEC-0015 — Taxonomy Engine
**Depends On:** GC-SPEC-0016 — Glossary Engine
**Depends On:** GC-SPEC-0017 — Citation Engine
**Depends On:** GC-SPEC-0018 — Media Engine
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **API Engine** of GeoCore.

The API Engine is responsible for exposing validated GeoCore knowledge through structured, typed, secure, versioned, and machine-readable interfaces.

The API Engine allows applications, websites, documentation systems, search systems, AI agents, internal tools, and future products to consume GeoCore knowledge without scraping rendered pages.

In GeoCore, APIs are not an afterthought.

APIs are first-class knowledge delivery channels.

---

# 2. Definition

The API Engine is the system responsible for exposing Knowledge Objects, Entities, Collections, Metadata, Relationships, Media, Citations, Glossary Entries, Search Results, LLM Context Packages, and Documentation through structured interfaces.

The API Engine may expose:

* REST endpoints;
* GraphQL endpoints;
* internal TypeScript APIs;
* SDK interfaces;
* static JSON exports;
* AI context endpoints;
* search endpoints;
* documentation endpoints;
* webhook-style future extensions.

The API Engine does not own knowledge.

It exposes knowledge.

---

# 3. Core Principle

The API is a delivery channel.

The Knowledge Object remains the source of truth.

No API response may create, override, or contradict canonical knowledge.

---

# 4. API Engine Responsibilities

The API Engine is responsible for:

* exposing Knowledge Objects;
* exposing Entities;
* exposing Collections;
* exposing Taxonomies;
* exposing Glossary Entries;
* exposing Citations;
* exposing Media metadata;
* exposing Documentation;
* exposing Search results;
* exposing AI Context Packages;
* exposing LLM-friendly resources;
* enforcing visibility rules;
* enforcing access rules;
* validating API responses;
* supporting versioned API contracts;
* supporting typed responses;
* supporting public and internal APIs;
* preventing leakage of private or internal knowledge.

The API Engine is NOT responsible for:

* replacing Knowledge Objects;
* storing canonical knowledge;
* replacing the Renderer Engine;
* replacing Content Validation;
* replacing the Search Engine;
* replacing access-control systems;
* exposing secrets;
* exposing private patient or customer data;
* exposing internal implementation details publicly.

---

# 5. API Design Philosophy

GeoCore APIs must be:

* structured;
* typed;
* predictable;
* versioned;
* secure;
* stable;
* documented;
* machine-readable;
* AI-friendly;
* human-debuggable.

API design should prioritize clarity over cleverness.

Every public API response should be understandable without inspecting frontend code.

---

# 6. API Categories

GeoCore SHOULD support the following API categories.

```text
Public API
Internal API
Admin API
Build-Time API
AI Context API
Search API
Static Export API
```

Each category has different visibility and access rules.

---

# 7. Public API

The Public API exposes published public knowledge.

It may expose:

* public Knowledge Objects;
* public Entities;
* public Collections;
* public Glossary Entries;
* public Documentation;
* public Media metadata;
* public Search results;
* public LLM context resources.

The Public API MUST NOT expose:

* drafts;
* review content;
* private content;
* internal metadata;
* hidden objects;
* validation internals;
* secrets;
* private media;
* patient-private data;
* tenant-specific product data.

---

# 8. Internal API

The Internal API may expose:

* draft Knowledge Objects;
* validation issues;
* internal metadata;
* editorial notes;
* private collections;
* diagnostic data;
* build-time data;
* admin-only information.

Internal APIs must be protected.

Internal APIs must not accidentally become public.

---

# 9. Admin API

The Admin API may support future editing, review, validation, and publishing workflows.

It may expose operations such as:

* create Knowledge Object;
* update Knowledge Object;
* validate object;
* publish object;
* archive object;
* create entity;
* merge entity;
* create collection;
* run validation;
* generate metadata;
* generate LLM output.

Admin APIs MUST enforce authorization.

Admin APIs MUST preserve auditability.

Admin APIs MUST NOT bypass validation.

---

# 10. Build-Time API

The Build-Time API supports static generation, site builds, exports, and deployment pipelines.

It may provide:

* all public routes;
* sitemap entries;
* schema outputs;
* LLM files;
* search index documents;
* rendered Markdown exports;
* documentation trees;
* glossary indexes.

Build-time APIs may be internal to the codebase.

They should still be typed and documented.

---

# 11. AI Context API

The AI Context API exposes structured knowledge for AI systems.

It may provide:

```text
/api/context/:objectId
/api/context/entity/:entityId
/api/context/search
/api/context/collection/:collectionId
```

AI context responses SHOULD include:

* Knowledge Object;
* resolved metadata;
* entities;
* relationships;
* related objects;
* citations;
* freshness;
* trust signals;
* language;
* audience;
* version.

The AI Context API MUST NOT expose hidden prompts, private notes, or internal-only data unless explicitly authorized.

---

# 12. Search API

The Search API exposes GeoCore search capabilities.

Example endpoints:

```text
/api/search
/api/search/knowledge
/api/search/entities
/api/search/glossary
/api/search/context
```

Search API responses must respect visibility and access rules.

Public search must only return public, published, valid knowledge.

---

# 13. API Versioning

Public APIs SHOULD be versioned.

Recommended format:

```text
/api/v1/knowledge
/api/v1/entities
/api/v1/collections
```

Versioning helps protect external consumers from breaking changes.

Breaking changes require a new version.

Non-breaking additions may remain within the same version.

---

# 14. API Stability Levels

API endpoints SHOULD declare stability.

Recommended values:

```text
experimental
beta
stable
deprecated
internal
```

Meaning:

| Stability      | Meaning                             |
| -------------- | ----------------------------------- |
| `experimental` | May change without notice           |
| `beta`         | Usable but still evolving           |
| `stable`       | Contract should be preserved        |
| `deprecated`   | Scheduled for removal               |
| `internal`     | Not intended for public consumption |

Public documentation must clearly identify API stability.

---

# 15. API Response Principles

API responses SHOULD be:

* explicit;
* consistent;
* traceable;
* minimal by default;
* expandable when needed;
* language-aware;
* version-aware.

Responses should include source object identifiers where useful.

Responses should avoid leaking implementation details.

---

# 16. Standard API Response Envelope

GeoCore MAY use a standard response envelope.

Illustrative model:

```ts
type ApiResponse<T> = {
  data: T;
  meta?: {
    requestId?: string;
    version?: string;
    generatedAt?: string;
    language?: string;
    visibility?: string;
  };
  diagnostics?: ApiDiagnostic[];
};
```

For errors:

```ts
type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    requestId?: string;
    generatedAt?: string;
  };
};
```

The final implementation may evolve while preserving consistency.

---

# 17. Knowledge Object API

The Knowledge Object API exposes canonical knowledge.

Possible endpoint:

```text
GET /api/v1/knowledge/:id
```

Example response:

```json
{
  "data": {
    "id": "ko_customer_balance_management",
    "slug": "gestion-creances-clients",
    "title": "Gestion des créances clients",
    "summary": "Guide for managing customer balances in poultry distribution.",
    "language": "fr",
    "version": "1.0.0",
    "status": "published",
    "metadata": {},
    "entities": [],
    "relationships": [],
    "canonicalUrl": "https://dawajinpro.tn/fr/help/gestion-creances-clients"
  }
}
```

Public responses MUST omit internal-only fields.

---

# 18. Entity API

The Entity API exposes semantic concepts.

Possible endpoint:

```text
GET /api/v1/entities/:id
```

Example response:

```json
{
  "data": {
    "id": "entity_customer_balance",
    "type": "business_concept",
    "canonicalName": "Créance client",
    "definition": "Amount still owed by a customer after sales, payments, returns, and adjustments.",
    "aliases": ["solde client", "dette client", "customer balance"],
    "relatedObjectIds": ["ko_customer_balance_management"]
  }
}
```

Entity API responses help AI systems and applications understand domain vocabulary.

---

# 19. Collection API

The Collection API exposes structured groups of Knowledge Objects.

Possible endpoint:

```text
GET /api/v1/collections/:id
```

Example response:

```json
{
  "data": {
    "id": "collection_dawajin_customer_balance",
    "title": "Gestion des créances clients",
    "summary": "Collection for understanding customer balance workflows.",
    "type": "academy",
    "items": [
      {
        "objectId": "ko_customer_balance_definition",
        "order": 1,
        "section": "Concepts"
      }
    ]
  }
}
```

Collection API responses must not duplicate Knowledge Object content unnecessarily.

---

# 20. Glossary API

The Glossary API exposes public glossary entries.

Possible endpoint:

```text
GET /api/v1/glossary/:slug
```

Glossary responses SHOULD include:

* term;
* definition;
* aliases;
* language;
* audience;
* entity ID;
* related objects;
* canonical URL.

---

# 21. Media API

The Media API exposes media metadata.

It MUST respect visibility rules.

Public responses may expose:

* public URL;
* title;
* description;
* alt text;
* caption;
* thumbnail;
* transcript link;
* related objects;
* related entities.

Public responses MUST NOT expose private storage paths, internal file paths, secrets, patient-private media, or private customer screenshots.

---

# 22. Citation API

The Citation API exposes source and citation metadata when visibility allows it.

Public responses may expose:

* citation ID;
* source title;
* source type;
* source URL;
* publisher;
* publication date;
* accessed date;
* citation purpose.

Private internal sources must not be exposed publicly unless explicitly approved.

---

# 23. Documentation API

The Documentation API exposes structured documentation.

Possible endpoints:

```text
GET /api/v1/docs
GET /api/v1/docs/:slug
GET /api/v1/docs/collections/:id
```

Documentation API responses should include:

* title;
* summary;
* body or rendered content when appropriate;
* collection;
* navigation;
* previous and next links;
* metadata;
* version.

---

# 24. Static Export API

The Static Export API may generate files such as:

* search index JSON;
* LLM index JSON;
* sitemap data;
* schema data;
* documentation tree;
* glossary index;
* entity index.

Static exports are useful for static sites, build pipelines, and offline documentation.

---

# 25. API Filtering

APIs SHOULD support filters where useful.

Examples:

```text
?language=fr
?audience=patient
?domain=dentistry
?visibility=public
?collection=collection_implantology
?entity=entity_dental_implant
```

Filters must be validated.

Invalid filters should return structured errors.

---

# 26. API Expansion

APIs MAY support controlled expansion.

Example:

```text
/api/v1/knowledge/ko_example?include=entities,relationships,citations
```

Expansion must be explicit.

Default responses should avoid returning excessive data.

Expansion must respect visibility rules.

---

# 27. API Pagination

List endpoints SHOULD support pagination.

Recommended parameters:

```text
limit
cursor
page
pageSize
```

Cursor pagination is preferred for large datasets.

Pagination metadata SHOULD be included in responses.

---

# 28. API Sorting

List endpoints MAY support sorting.

Examples:

```text
sort=updatedAt
sort=title
sort=priority
sort=publishedAt
```

Sorting must be deterministic.

Unsupported sorting fields should return structured errors.

---

# 29. API Errors

API errors MUST be structured.

Recommended error codes:

```text
GC_API_NOT_FOUND
GC_API_UNAUTHORIZED
GC_API_FORBIDDEN
GC_API_INVALID_FILTER
GC_API_INVALID_INCLUDE
GC_API_VALIDATION_FAILED
GC_API_INTERNAL_ERROR
GC_API_PRIVATE_RESOURCE
GC_API_UNPUBLISHED_RESOURCE
GC_API_UNSUPPORTED_VERSION
```

Error messages should be clear and safe.

Errors must not expose secrets or internal stack traces publicly.

---

# 30. API Diagnostics

API responses MAY include diagnostics for internal or development modes.

Diagnostics may include:

* validation warnings;
* stale metadata warnings;
* missing relationship warnings;
* renderer warnings;
* search index status;
* schema status;
* LLM output status.

Public APIs should not expose internal diagnostics unless intentionally configured.

---

# 31. Access Control

The API Engine MUST enforce visibility and access rules.

Access control should consider:

* object status;
* visibility;
* user role;
* environment;
* API category;
* deployment mode;
* domain rules.

Public endpoints must never expose private or internal content.

Admin endpoints must require authentication and authorization.

---

# 32. Security Requirements

The API Engine MUST follow secure defaults.

Requirements:

* no secrets in responses;
* no internal stack traces in public errors;
* no private file paths in public media responses;
* no draft content in public APIs;
* no patient-private media exposure;
* no tenant-private product data exposure;
* input validation for all query parameters;
* output sanitization where relevant;
* rate limiting where appropriate;
* audit logging for admin operations.

---

# 33. High-Trust Content Rules

For high-trust domains such as medical, dental, legal, financial, scientific, or safety-related content, public API responses SHOULD include:

* author;
* reviewer when required;
* reviewed date;
* citations when available;
* disclaimer when appropriate;
* last updated date.

For RTimi Dental, patient-facing dental API outputs must preserve professional authorship and review metadata when available.

---

# 34. Product Documentation Rules

For product and SaaS documentation, API responses SHOULD include:

* product area;
* feature;
* availability;
* last verified date;
* related workflows;
* limitations where relevant.

For Dawajin Pro, APIs must not expose product features as available unless the underlying documentation marks them as implemented and validated.

Payment or Konnect production readiness must not be implied unless actually validated.

---

# 35. AI-Friendly API Design

GeoCore APIs SHOULD be AI-friendly.

AI-friendly responses should include:

* stable identifiers;
* concise summaries;
* canonical URLs;
* language;
* version;
* entities;
* relationships;
* citations;
* freshness metadata;
* trust metadata.

AI systems should be able to consume APIs instead of scraping rendered HTML.

---

# 36. API Documentation

Every public API endpoint MUST be documented.

Documentation SHOULD include:

* endpoint path;
* method;
* stability level;
* authentication requirement;
* parameters;
* response schema;
* example responses;
* error codes;
* visibility rules;
* rate limits when applicable;
* version.

API documentation must not describe endpoints that do not exist.

---

# 37. API Validation

Before deployment, API contracts SHOULD be validated.

Validation checks include:

* route exists;
* response schema matches documentation;
* visibility rules are enforced;
* public endpoints exclude private data;
* errors are structured;
* pagination works when required;
* filters are validated;
* response includes required metadata;
* high-trust outputs preserve required metadata.

Critical API validation errors MUST block release.

---

# 38. Minimal API Route Model

Illustrative TypeScript model:

```ts
type ApiStability =
  | "experimental"
  | "beta"
  | "stable"
  | "deprecated"
  | "internal";

type ApiVisibility =
  | "public"
  | "internal"
  | "admin";

type ApiRouteDefinition = {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  version: string;
  visibility: ApiVisibility;
  stability: ApiStability;
  description: string;
  requiresAuth: boolean;
  allowedRoles?: string[];
  responseSchema?: unknown;
  errorCodes?: string[];
  createdAt: string;
  updatedAt: string;
};
```

The implementation may evolve while preserving the same concepts.

---

# 39. Minimal API Resource Model

Illustrative TypeScript model:

```ts
type ApiResourceType =
  | "knowledge-object"
  | "entity"
  | "collection"
  | "taxonomy"
  | "glossary-entry"
  | "citation"
  | "source"
  | "media"
  | "documentation"
  | "search-result"
  | "ai-context";

type ApiResource = {
  id: string;
  type: ApiResourceType;
  version: string;
  language?: string;
  visibility: "public" | "private" | "internal" | "hidden";
  canonicalUrl?: string;
  updatedAt: string;
  data: Record<string, unknown>;
};
```

---

# 40. Example — RTimi Dental AI Context API

```text
GET /api/v1/context/ko_detartrage_abime_dents
```

Expected response includes:

* patient-facing Knowledge Object;
* author metadata;
* reviewer metadata;
* entity_scaling;
* entity_tartar;
* related FAQ;
* citations or professional review;
* medical disclaimer where appropriate;
* canonical URL.

The response must not expose private clinic notes or patient information.

---

# 41. Example — Dawajin Pro Help API

```text
GET /api/v1/knowledge/ko_customer_balance_management
```

Expected response includes:

* Knowledge Object summary;
* entity_customer_balance;
* related documentation;
* product area;
* workflow;
* last verified date when available;
* limitations where relevant;
* canonical URL.

The response must not claim unvalidated Konnect production readiness.

---

# 42. Anti-Patterns

The following are prohibited:

* APIs returning rendered HTML as the only structured source;
* public APIs exposing drafts;
* public APIs exposing internal notes;
* public APIs exposing private media;
* APIs leaking secrets or file system paths;
* APIs bypassing Content Validation;
* APIs creating a second source of truth;
* APIs exposing unverified product features;
* APIs hiding missing metadata;
* APIs returning inconsistent shapes for similar resources;
* undocumented public endpoints;
* provider-specific AI logic inside core API responses.

---

# 43. Acceptance Criteria

This specification is considered implemented when:

* APIs can expose Knowledge Objects;
* APIs can expose Entities;
* APIs can expose Collections;
* APIs can expose Glossary Entries;
* APIs can expose Search results;
* APIs can expose AI Context Packages;
* public APIs exclude non-public knowledge;
* API responses are structured and typed;
* API errors are structured;
* API versioning is supported or planned;
* API documentation is generated or maintained;
* API outputs remain projections, not sources of truth.

---

# 44. Out of Scope

This specification does not define:

* final framework routing implementation;
* final authentication provider;
* final authorization system;
* final REST vs GraphQL decision;
* final API gateway;
* final rate-limiting provider;
* final SDK implementation;
* final OpenAPI generation;
* final admin interface;
* final external developer portal.

These will be defined in future specifications or implementation documents.

---

# 45. Future Evolution

Future versions may introduce:

* OpenAPI generation;
* GraphQL API;
* public SDK;
* TypeScript client;
* AI agent API;
* signed API responses;
* API usage analytics;
* rate limiting;
* API key management;
* webhook support;
* API playground;
* API documentation generator;
* access-control policy engine;
* multi-site API federation;
* API contract testing;
* API version migration tooling.

---

# Final Statement

APIs are knowledge delivery channels.

They allow humans, applications, AI systems, and future agents to consume structured knowledge directly.

In GeoCore, an API must never become a second source of truth.

The Knowledge Object remains the source.

The API only exposes it.

---

**End of Specification**
