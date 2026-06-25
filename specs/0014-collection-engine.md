# GeoCore Specification 0014

**Document ID:** GC-SPEC-0014
**Title:** Collection Engine
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
**Depends On:** GC-SPEC-0010 — Documentation Engine
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Collection Engine** of GeoCore.

The Collection Engine is responsible for grouping, ordering, organizing, validating, and rendering sets of Knowledge Objects.

A Knowledge Object represents one unit of knowledge.

A Collection represents an intentional structure made of multiple Knowledge Objects.

Collections are essential for:

* guides;
* courses;
* help centers;
* documentation sections;
* topic clusters;
* glossaries;
* academies;
* learning paths;
* product manuals;
* medical patient education hubs;
* SaaS knowledge bases.

Collections give knowledge structure, sequence, and navigational meaning.

---

# 2. Definition

A Collection is an ordered or logical group of Knowledge Objects with a shared purpose.

A Collection may represent:

* a guide;
* a documentation section;
* a topic cluster;
* a course;
* a glossary set;
* a help center category;
* an academy module;
* a knowledge hub;
* a product manual;
* a patient education pathway.

A Collection is not merely a folder.

A Collection is not merely a category.

A Collection is a structured knowledge container with metadata, intent, order, relationships, and rendering rules.

---

# 3. Core Principle

Collections organize knowledge.

They do not replace Knowledge Objects.

The Knowledge Object remains the source of truth.

The Collection defines how Knowledge Objects are grouped, ordered, and presented together.

---

# 4. Collection Responsibilities

The Collection Engine is responsible for:

* defining collections;
* ordering Knowledge Objects;
* grouping related objects;
* generating navigation;
* supporting topic clusters;
* supporting guide structures;
* supporting help center sections;
* supporting glossary sets;
* supporting documentation collections;
* supporting multilingual collection variants;
* validating collection completeness;
* exposing collection metadata;
* connecting collections to the Knowledge Graph;
* supporting collection rendering;
* supporting AI-readable collection summaries.

The Collection Engine is NOT responsible for:

* creating canonical knowledge;
* replacing Knowledge Objects;
* replacing the Knowledge Graph;
* replacing taxonomy;
* replacing renderer logic;
* replacing editorial validation;
* storing business application logic.

---

# 5. Collection Types

GeoCore SHOULD support the following collection types:

```text
guide
course
documentation
help-center
topic-cluster
glossary-set
faq-set
academy
manual
playbook
roadmap
specification-set
case-study-set
media-series
```

Additional collection types may be introduced when needed.

---

# 6. Collection vs Category

A Category classifies knowledge.

A Collection organizes knowledge.

Example:

```text
Category:
Dentistry

Collection:
Complete Guide to Dental Implants
```

Example:

```text
Category:
Poultry Distribution

Collection:
Dawajin Academy — Customer Balance Management
```

Categories are broad.

Collections are intentional structures.

---

# 7. Collection Identity

Every Collection MUST have a stable identifier.

Example:

```text
collection_implantology_guide
collection_dawajin_academy
collection_geocore_specs
collection_customer_balance_manual
```

Changing a Collection title must not change its identifier.

The identifier represents the collection concept, not its display name.

---

# 8. Mandatory Collection Fields

Every Collection MUST include:

| Field       | Required | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| `id`        | Yes      | Permanent collection identifier                |
| `slug`      | Yes      | URL-safe identifier                            |
| `title`     | Yes      | Collection title                               |
| `summary`   | Yes      | Short description                              |
| `type`      | Yes      | Collection type                                |
| `language`  | Yes      | Primary language                               |
| `status`    | Yes      | Draft, Review, Published, Archived             |
| `version`   | Yes      | Collection version                             |
| `items`     | Yes      | Ordered or grouped Knowledge Object references |
| `createdAt` | Yes      | Creation date                                  |
| `updatedAt` | Yes      | Last update date                               |

---

# 9. Optional Collection Fields

Collections MAY include:

* author;
* owner;
* reviewer;
* audience;
* domain;
* difficulty;
* prerequisites;
* estimatedCompletionTime;
* relatedEntities;
* relatedCollections;
* citations;
* media;
* coverImage;
* canonicalUrl;
* orderingStrategy;
* navigationRules;
* renderingRules;
* visibility;
* translations.

Optional fields must improve clarity, navigation, or machine understanding.

They must not duplicate canonical Knowledge Object content.

---

# 10. Collection Items

A Collection contains references to Knowledge Objects.

A collection item SHOULD include:

```yaml
objectId:
order:
required:
section:
label:
description:
```

Example:

```yaml
items:
  - objectId: ko_dental_implant_overview
    order: 1
    section: Introduction
    required: true

  - objectId: ko_implant_pain
    order: 2
    section: Patient Questions
    required: false
```

The Collection references objects.

It does not copy their content.

---

# 11. Ordered Collections

Some Collections require order.

Examples:

* courses;
* guides;
* tutorials;
* onboarding flows;
* manuals;
* documentation sequences.

Ordered Collections MUST define item order explicitly.

Example:

```text
1. Introduction
2. Concepts
3. Setup
4. Usage
5. Troubleshooting
```

Order must not be inferred only from file names unless explicitly configured.

---

# 12. Unordered Collections

Some Collections do not require strict order.

Examples:

* FAQ sets;
* glossary sets;
* topic clusters;
* media libraries;
* related resource lists.

Unordered Collections may still define priority or grouping rules.

---

# 13. Hierarchical Collections

Collections MAY contain nested sections.

Example:

```text
Collection
├── Section 1
│   ├── Object A
│   └── Object B
├── Section 2
│   ├── Object C
│   └── Object D
```

Nested structures must be explicit and validated.

---

# 14. Collection Navigation

The Collection Engine SHOULD generate navigation.

Navigation may include:

* table of contents;
* sidebar;
* previous item;
* next item;
* section index;
* collection overview;
* breadcrumbs;
* related collections;
* progress indicators.

Navigation must be generated from collection structure and relationships whenever possible.

Manual navigation is allowed only as an explicit override.

---

# 15. Collection Metadata

Collections MUST expose metadata.

Required metadata:

```yaml
id:
slug:
title:
summary:
type:
language:
status:
version:
updatedAt:
items:
```

Recommended metadata:

```yaml
audience:
domain:
owner:
author:
reviewer:
difficulty:
canonicalUrl:
relatedEntities:
relatedCollections:
```

Collection metadata must be available to:

* Renderer Engine;
* Search Engine;
* Schema Engine;
* Sitemap Engine;
* LLMs Engine;
* Documentation Engine.

---

# 16. Collection and Knowledge Graph

Collections participate in the Knowledge Graph.

Example:

```text
ko_implant_pain part_of collection_implantology_guide
ko_implant_duration part_of collection_implantology_guide
collection_implantology_guide explains entity_dental_implant
```

Example:

```text
ko_customer_balance_management part_of collection_dawajin_academy
collection_dawajin_academy explains entity_poultry_distribution
```

Collections help systems understand which objects belong together.

---

# 17. Collection and Search

Collections MUST be searchable when public.

Search documents for Collections SHOULD include:

* title;
* summary;
* type;
* language;
* items;
* entities;
* audience;
* domain;
* canonical URL;
* updated date.

Search results may return both:

* the Collection itself;
* individual Knowledge Objects inside the Collection.

---

# 18. Collection and Schema

Collections may generate structured data.

Possible schema types:

```text
CollectionPage
ItemList
Course
DefinedTermSet
CreativeWork
BreadcrumbList
```

Schema output must be generated from Collection metadata and item references.

The Schema Engine must not invent item order or item data.

---

# 19. Collection and LLM Outputs

The LLMs Engine SHOULD expose important public Collections.

LLM-readable Collection output may include:

* collection title;
* summary;
* purpose;
* audience;
* item list;
* important entities;
* canonical URL;
* last updated date.

Collections help AI systems understand content clusters.

---

# 20. Collection and Sitemap

Public renderable Collections SHOULD appear in sitemaps when appropriate.

Examples:

```text
/fr/guides/implantologie
/fr/help
/fr/glossaire
/fr/academy/customer-balances
```

Only public, published, renderable Collections may appear in public sitemaps.

---

# 21. Collection Visibility

Collections MUST support visibility.

Recommended values:

```text
public
private
internal
hidden
```

Public Collections may be rendered, indexed, and exposed in LLM files.

Internal Collections must not appear in public outputs.

---

# 22. Collection Validation

Before publication, Collections MUST be validated.

Validation checks include:

* collection ID exists;
* collection ID is unique;
* slug exists;
* title exists;
* summary exists;
* type is valid;
* language is valid;
* status is valid;
* referenced Knowledge Objects exist;
* no duplicate item references unless explicitly allowed;
* ordered collections have valid order;
* nested sections are valid;
* public collections contain only public or allowed items;
* canonical URL is valid when required;
* no broken related collections;
* no circular parent collection relationships.

Critical errors MUST block publication.

---

# 23. Collection Completeness Score

GeoCore SHOULD compute a Collection completeness score.

Possible criteria:

| Criterion                 | Importance                   |
| ------------------------- | ---------------------------- |
| Title and summary present | High                         |
| At least one valid item   | High                         |
| Clear audience            | Medium                       |
| Related entities          | Medium                       |
| Logical order             | High for ordered collections |
| Metadata completeness     | High                         |
| Public URL when published | High                         |
| Related objects           | Medium                       |
| LLM summary               | Medium                       |

The score helps improve quality.

It does not replace validation.

---

# 24. Collection Lifecycle

Collections follow a lifecycle.

```text
Draft
  ↓
Review
  ↓
Published
  ↓
Updated
  ↓
Archived
```

A published Collection should not include draft items unless explicitly configured for internal use.

---

# 25. Collection Versioning

Collections SHOULD support versioning.

Versioning matters when:

* item order changes;
* major items are added or removed;
* collection purpose changes;
* documentation versions change;
* product documentation changes;
* medical review structure changes.

Changing a Collection version does not necessarily change the version of each item.

Knowledge Object versioning and Collection versioning are related but independent.

---

# 26. Collection Rendering

Collections may be rendered as:

* landing pages;
* index pages;
* guide pages;
* course pages;
* help center sections;
* glossary indexes;
* documentation sidebars;
* API responses;
* Markdown documents;
* LLM-readable summaries.

Renderers consume Collection data.

Renderers do not own Collection structure.

---

# 27. Minimal Collection Model

Illustrative TypeScript model:

```ts
type CollectionStatus =
  | "draft"
  | "review"
  | "published"
  | "archived";

type CollectionVisibility =
  | "public"
  | "private"
  | "internal"
  | "hidden";

type CollectionType =
  | "guide"
  | "course"
  | "documentation"
  | "help-center"
  | "topic-cluster"
  | "glossary-set"
  | "faq-set"
  | "academy"
  | "manual"
  | "playbook"
  | "roadmap"
  | "specification-set"
  | "case-study-set"
  | "media-series";

type CollectionItem = {
  objectId: string;
  order?: number;
  section?: string;
  required?: boolean;
  label?: string;
  description?: string;
};

type KnowledgeCollection = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  type: CollectionType;
  language: string;
  status: CollectionStatus;
  visibility: CollectionVisibility;
  version: string;

  items: CollectionItem[];

  audience?: string[];
  domain?: string[];
  relatedEntities?: string[];
  relatedCollections?: string[];

  owner?: string;
  author?: string;
  reviewer?: string;

  canonicalUrl?: string;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  archivedAt?: string;
};
```

The implementation may evolve while preserving the same concepts.

---

# 28. Example — RTimi Dental Collection

```yaml
id: collection_rtimidental_implantology
slug: implantologie
title: Guide complet sur les implants dentaires
summary: Collection pédagogique destinée aux patients qui veulent comprendre les implants dentaires, leurs indications, leurs étapes et leurs limites.
type: guide
language: fr
status: draft
visibility: public
version: 1.0.0
audience:
  - patient
domain:
  - dentistry
relatedEntities:
  - entity_dental_implant
  - entity_bone_graft
  - entity_prf
items:
  - objectId: ko_implant_dentaire_definition
    order: 1
    section: Introduction
    required: true

  - objectId: ko_implant_dentaire_douleur
    order: 2
    section: Questions fréquentes
    required: true

  - objectId: ko_implant_dentaire_duree
    order: 3
    section: Questions fréquentes
    required: false
createdAt: 2026-06-25
updatedAt: 2026-06-25
```

---

# 29. Example — Dawajin Pro Collection

```yaml
id: collection_dawajin_customer_balance
slug: gestion-creances-clients
title: Gestion des créances clients
summary: Collection pour comprendre, suivre et améliorer la gestion des soldes clients dans la distribution avicole.
type: academy
language: fr
status: draft
visibility: public
version: 1.0.0
audience:
  - business-owner
  - manager
domain:
  - poultry-distribution
relatedEntities:
  - entity_customer_balance
  - entity_invoice
  - entity_payment
  - entity_delivery
items:
  - objectId: ko_customer_balance_definition
    order: 1
    section: Concepts
    required: true

  - objectId: ko_customer_balance_workflow
    order: 2
    section: Workflow métier
    required: true

  - objectId: ko_payment_tracking
    order: 3
    section: Paiements
    required: true
createdAt: 2026-06-25
updatedAt: 2026-06-25
```

---

# 30. Anti-Patterns

The following are prohibited:

* using folders as the only collection source of truth;
* duplicating Knowledge Object content inside Collections;
* using Collections as a replacement for entities;
* using Collections as a replacement for taxonomy;
* publishing Collections with missing item references;
* publishing public Collections containing private items unintentionally;
* manually maintaining navigation that contradicts Collection order;
* using arbitrary order without explicit reason;
* creating multiple Collections with the same purpose and overlapping items without explanation;
* allowing renderers to define Collection structure.

---

# 31. Acceptance Criteria

This specification is considered implemented when:

* Collections have stable identifiers;
* Collections can reference Knowledge Objects;
* ordered Collections support explicit ordering;
* Collections expose metadata;
* Collections participate in the Knowledge Graph;
* Collections can generate navigation;
* Collections can be searched;
* Collections can be rendered;
* invalid item references are rejected;
* public Collections do not leak private knowledge;
* Collection structure remains independent from renderers.

---

# 32. Out of Scope

This specification does not define:

* final database schema;
* final Collection editor UI;
* final Collection renderer design;
* final navigation component implementation;
* final Collection scoring algorithm;
* final routing implementation;
* final drag-and-drop ordering interface;
* final Collection analytics dashboard.

These will be defined in future specifications or implementation documents.

---

# 33. Future Evolution

Future versions may introduce:

* visual Collection editor;
* AI-assisted Collection building;
* automatic topic cluster generation;
* Collection dependency graph;
* personalized learning paths;
* collection progress tracking;
* collection analytics;
* multi-site Collection reuse;
* collection recommendation engine;
* collection version diffing;
* collection translation workflow.

---

# Final Statement

Knowledge Objects give knowledge identity.

The Knowledge Graph gives knowledge meaning.

Collections give knowledge structure.

In GeoCore, a Collection is not a folder and not a category.

A Collection is an intentional knowledge structure.

---

**End of Specification**
