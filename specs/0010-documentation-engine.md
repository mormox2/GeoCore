# GeoCore Specification 0010

**Document ID:** GC-SPEC-0010
**Title:** Documentation Engine
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
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Documentation Engine** of GeoCore.

The Documentation Engine is responsible for organizing, generating, rendering, validating, and maintaining structured documentation from Knowledge Objects.

Documentation in GeoCore is not treated as static text.

Documentation is a structured projection of knowledge.

The Documentation Engine must support human readers, developers, editors, AI systems, and future applications that need reliable knowledge.

---

# 2. Definition

The Documentation Engine is the system responsible for transforming validated Knowledge Objects and Knowledge Collections into usable documentation experiences.

It may produce:

* handbook pages
* architecture documents
* specifications
* API documentation
* guides
* tutorials
* help centers
* playbooks
* product documentation
* internal manuals
* public documentation sites
* AI-readable documentation exports

The Documentation Engine does not own knowledge.

It organizes and renders knowledge for documentation purposes.

---

# 3. Core Principle

Documentation is a view of knowledge.

Documentation must be generated from structured Knowledge Objects, metadata, relationships, and collections.

Documentation must not become a parallel source of truth.

---

# 4. Documentation Responsibilities

The Documentation Engine is responsible for:

* organizing Knowledge Objects into documentation structures;
* generating navigation;
* generating tables of contents;
* generating breadcrumbs;
* rendering documentation pages;
* validating documentation completeness;
* exposing documentation metadata;
* supporting versioned documentation;
* supporting multilingual documentation;
* supporting AI-readable documentation exports;
* connecting documentation to the Knowledge Graph;
* supporting internal and public documentation modes.

The Documentation Engine is NOT responsible for:

* creating canonical knowledge;
* replacing the Knowledge Object;
* replacing the Metadata Engine;
* replacing the Renderer Engine;
* storing business logic;
* manually duplicating content;
* bypassing validation.

---

# 5. Documentation Types

GeoCore SHOULD support the following documentation types:

```text
handbook
specification
architecture
adr
rfc
standard
api-reference
developer-guide
user-guide
help-center
playbook
glossary
tutorial
release-note
```

Each documentation type may have specific structure and validation rules.

---

# 6. Documentation Collections

Documentation should be organized as Knowledge Collections.

A Documentation Collection is an ordered group of Knowledge Objects with a documentation purpose.

Examples:

```text
collection_geocore_specs
collection_geocore_handbook
collection_dawajin_help_center
collection_rtimidental_patient_guides
```

A collection may define:

* title
* description
* audience
* order
* navigation
* visibility
* version
* language
* related entities
* required sections

---

# 7. Documentation Structure

A documentation section SHOULD contain:

```yaml
id:
slug:
title:
summary:
type:
audience:
language:
version:
status:
order:
parent:
children:
relatedObjects:
```

Documentation hierarchy must be explicit.

The folder structure may reflect the hierarchy, but the folder structure must not be the only source of truth.

---

# 8. Navigation

The Documentation Engine SHOULD generate navigation from structured relationships and collection order.

Navigation may include:

* sidebar
* previous page
* next page
* breadcrumbs
* related pages
* section overview
* table of contents
* collection index

Manual navigation is allowed only as an override.

Manual overrides must remain traceable.

---

# 9. Table of Contents

The Documentation Engine SHOULD generate tables of contents automatically.

A table of contents may be generated from:

* headings
* collection structure
* section hierarchy
* Knowledge Object relationships

The table of contents must not be manually duplicated when it can be generated.

---

# 10. Documentation Metadata

Every documentation page MUST expose metadata.

Required metadata:

```yaml
id:
title:
summary:
language:
version:
status:
author:
updatedAt:
collection:
canonicalUrl:
```

Recommended metadata:

```yaml
audience:
difficulty:
estimatedReadingTime:
relatedEntities:
relatedObjects:
lastReviewedAt:
reviewer:
```

Documentation metadata must be resolved through the Metadata Engine.

---

# 11. Versioned Documentation

GeoCore SHOULD support versioned documentation.

Versioning is important for:

* software documentation
* API documentation
* product help centers
* specifications
* architecture documents

A documentation page may exist in multiple versions.

Example:

```text
v1.0
v1.1
v2.0
```

The current version must be clearly identified.

Archived versions should remain accessible when useful.

---

# 12. Documentation Status

Documentation objects SHOULD support status values:

```text
draft
review
published
deprecated
archived
```

Deprecated documentation must clearly indicate its replacement when applicable.

Example:

```yaml
status: deprecated
replacedBy: ko_new_api_reference
```

---

# 13. Public and Internal Documentation

GeoCore MUST distinguish public documentation from internal documentation.

Public documentation may be indexed and exposed.

Internal documentation may include:

* implementation notes
* private workflows
* internal decisions
* draft plans
* diagnostics
* non-public specifications

Public documentation MUST NOT leak internal-only content.

---

# 14. AI-Readable Documentation

The Documentation Engine SHOULD generate AI-readable documentation outputs.

AI-readable documentation may include:

* Markdown export
* JSON export
* LLM summary
* canonical answers
* structured relationships
* source metadata
* version metadata
* citations
* related pages

AI systems should consume structured documentation rather than scraping HTML whenever possible.

---

# 15. Documentation and Search

Documentation pages MUST be searchable when their visibility allows it.

Search documents should include:

* title
* summary
* body text
* collection
* section
* entities
* version
* language
* audience
* updated date
* canonical URL

The Search Engine must index documentation from canonical knowledge, not from rendered HTML only.

---

# 16. Documentation and Knowledge Graph

Documentation must participate in the Knowledge Graph.

Examples:

```text
ko_metadata_engine_spec part_of collection_geocore_specs
ko_metadata_engine_spec related_to entity_metadata
ko_renderer_engine_spec requires ko_knowledge_object_spec
```

Documentation relationships help:

* navigation
* search
* AI context retrieval
* dependency tracking
* internal linking
* documentation completeness checks

---

# 17. Documentation Validation

Before publication, documentation MUST pass validation.

Validation checks include:

* required metadata exists
* body exists
* language is valid
* status is valid
* collection references exist
* parent-child hierarchy is valid
* no broken links
* no invalid relationships
* no duplicate slugs
* no missing required sections
* no internal content leaks in public documentation
* no outdated replacement references

Critical errors MUST block publication.

---

# 18. Documentation Completeness

GeoCore SHOULD compute documentation completeness.

Completeness may consider:

| Criterion                   | Importance |
| --------------------------- | ---------- |
| Purpose present             | High       |
| Scope present               | High       |
| Requirements present        | High       |
| Examples present            | Medium     |
| Acceptance criteria present | High       |
| Out of scope present        | Medium     |
| Future evolution present    | Medium     |
| Related documents present   | Medium     |
| Metadata complete           | High       |

Completeness score helps improve documentation quality.

It does not replace validation.

---

# 19. Documentation Templates

GeoCore SHOULD support documentation templates.

Examples:

```text
specification-template
adr-template
rfc-template
api-reference-template
playbook-template
guide-template
help-center-template
```

Templates should define required sections.

Templates must not hardcode canonical knowledge.

---

# 20. Specification Documents

Specification documents define normative rules.

A specification SHOULD include:

* Purpose
* Definition
* Core Principle
* Responsibilities
* Requirements
* Validation Rules
* Examples
* Anti-Patterns
* Acceptance Criteria
* Out of Scope
* Future Evolution
* Final Statement

Specifications have higher authority than handbook pages, RFCs, and implementation details.

---

# 21. Handbook Documents

Handbook documents explain vision, philosophy, architecture, engineering practices, and product direction.

A handbook document may be more narrative than a specification.

Handbook documents help humans understand the reasoning behind GeoCore.

They must not contradict specifications.

---

# 22. ADR Documents

Architecture Decision Records document important architectural decisions.

An ADR SHOULD include:

```yaml
id:
title:
status:
date:
context:
decision:
consequences:
alternatives:
```

ADRs explain why a decision was made.

They do not replace specifications.

---

# 23. RFC Documents

Request For Comments documents propose new changes.

An RFC SHOULD include:

* problem
* motivation
* proposed solution
* alternatives
* risks
* migration plan
* open questions

Accepted RFCs may lead to new specifications or ADRs.

---

# 24. API Documentation

API documentation should be generated from structured API definitions whenever possible.

API documentation SHOULD include:

* endpoint
* method
* authentication requirement
* request parameters
* response schema
* examples
* errors
* rate limits when relevant
* version
* stability level

API documentation must not describe endpoints that do not exist.

---

# 25. Product Documentation

Product documentation should reflect actual product behavior.

For Dawajin Pro, product documentation MUST NOT describe a feature as production-ready unless it is actually implemented and validated.

Product documentation SHOULD include:

* feature area
* user role
* workflow
* screenshots when useful
* examples
* limitations
* last verified date
* related help articles

---

# 26. Medical and High-Trust Documentation

For RTimi Dental and other high-trust domains, documentation must be stricter.

Patient-facing documentation SHOULD include:

* author
* professional identity
* reviewed date
* citations when appropriate
* disclaimer when appropriate
* clear language
* no exaggerated claims

Medical documentation must not replace professional diagnosis or consultation.

---

# 27. Multilingual Documentation

GeoCore SHOULD support multilingual documentation.

Supported languages should include at least:

* French
* Arabic
* English

Multilingual documentation must preserve:

* meaning
* entity alignment
* metadata
* canonical relationships
* citations
* version references

Arabic documentation must support right-to-left rendering.

---

# 28. Documentation Output Formats

The Documentation Engine MAY produce:

* HTML
* Markdown
* JSON
* PDF
* LLM-ready text
* RSS or XML feeds
* API responses

All formats must be generated from the same canonical knowledge.

---

# 29. Minimal Documentation Model

Illustrative TypeScript model:

```ts
type DocumentationType =
  | "handbook"
  | "specification"
  | "architecture"
  | "adr"
  | "rfc"
  | "standard"
  | "api-reference"
  | "developer-guide"
  | "user-guide"
  | "help-center"
  | "playbook"
  | "tutorial"
  | "release-note";

type DocumentationStatus =
  | "draft"
  | "review"
  | "published"
  | "deprecated"
  | "archived";

type DocumentationObject = {
  id: string;
  objectId: string;
  type: DocumentationType;
  status: DocumentationStatus;
  title: string;
  summary: string;
  language: string;
  version: string;

  collectionId?: string;
  parentId?: string;
  childIds?: string[];
  order?: number;

  audience?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  canonicalUrl?: string;

  relatedObjectIds?: string[];
  relatedEntityIds?: string[];

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  deprecatedAt?: string;
  replacedBy?: string;
};
```

The final implementation may evolve, but the conceptual model must remain compatible.

---

# 30. Example — GeoCore Specification Collection

```yaml
id: collection_geocore_specs
title: GeoCore Specifications
type: specification
language: en
status: published
objects:
  - specs/0001-geocore-foundation.md
  - specs/0002-knowledge-object.md
  - specs/0003-knowledge-graph.md
  - specs/0004-metadata-engine.md
  - specs/0005-renderer-engine.md
  - specs/0006-entity-engine.md
  - specs/0007-content-validation.md
  - specs/0008-search-engine.md
  - specs/0009-ai-integration.md
  - specs/0010-documentation-engine.md
```

---

# 31. Example — Dawajin Pro Help Center

```yaml
id: collection_dawajin_help_center
title: Dawajin Pro Help Center
type: help-center
language: fr
status: draft
audience:
  - business-owner
  - manager
  - admin
objects:
  - ko_getting_started_dawajin
  - ko_customer_balance_management
  - ko_delivery_route_management
  - ko_invoice_management
  - ko_stock_movement_basics
```

---

# 32. Example — RTimi Dental Patient Guides

```yaml
id: collection_rtimidental_patient_guides
title: RTimi Dental Patient Guides
type: user-guide
language: fr
status: draft
audience:
  - patient
objects:
  - ko_detartrage_abime_dents
  - ko_implant_dentaire_douleur
  - ko_gingivite_que_faire
  - ko_aligneurs_invisibles
```

---

# 33. Anti-Patterns

The following are prohibited:

* documentation existing as disconnected static text;
* documentation duplicating canonical knowledge;
* public documentation leaking internal notes;
* product documentation describing unavailable features;
* medical documentation without review metadata;
* API documentation written manually when structured API definitions exist;
* navigation maintained only by hand;
* duplicated tables of contents;
* documentation not connected to the Knowledge Graph;
* AI-readable documentation generated from scraped HTML only;
* outdated documentation without status or replacement reference.

---

# 34. Acceptance Criteria

This specification is considered implemented when:

* documentation can be represented as Knowledge Objects or Knowledge Collections;
* documentation navigation can be generated from structure;
* documentation pages expose metadata;
* documentation participates in the Knowledge Graph;
* documentation can be searched;
* documentation can be rendered in at least HTML and Markdown;
* documentation validation blocks critical errors;
* public and internal documentation are separated;
* documentation outputs remain projections, not sources of truth.

---

# 35. Out of Scope

This specification does not define:

* final documentation UI;
* final documentation theme;
* final routing implementation;
* final Markdown/MDX parser;
* final API documentation generator;
* final PDF generator;
* final documentation hosting platform;
* final access-control system;
* final documentation analytics dashboard.

These will be defined in future specifications or implementation documents.

---

# 36. Future Evolution

Future versions may introduce:

* documentation version switcher;
* visual documentation editor;
* AI-assisted documentation maintenance;
* stale documentation detection;
* automatic API reference generation;
* documentation dependency graph;
* documentation coverage dashboard;
* interactive code examples;
* generated diagrams;
* voice-readable documentation;
* offline documentation bundles;
* documentation localization workflow.

---

# Final Statement

Documentation is not separate from knowledge.

Documentation is knowledge organized for understanding.

In GeoCore, documentation must be structured, validated, searchable, renderable, versioned, and AI-readable.

A documentation system that duplicates knowledge will eventually become outdated.

A documentation system generated from Knowledge Objects can remain reliable.

---

**End of Specification**
