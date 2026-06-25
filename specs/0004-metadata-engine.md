# GeoCore Specification 0004

**Document ID:** GC-SPEC-0004

**Title:** Metadata Engine

**Version:** 1.0.0

**Status:** Accepted

**Depends On:** GC-SPEC-0001 — GeoCore Foundation

**Depends On:** GC-SPEC-0002 — Knowledge Object

**Depends On:** GC-SPEC-0003 — Knowledge Graph

**Author:** Dr Mossaab Rtimi

**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Metadata Engine** of GeoCore.

The Metadata Engine is responsible for generating, validating, normalizing, and exposing metadata for every Knowledge Object, Knowledge View, Renderer, and Output.

Metadata is not decorative.

Metadata is part of knowledge.

Without metadata, knowledge cannot be reliably discovered, trusted, indexed, rendered, translated, cited, or consumed by AI systems.

---

# 2. Definition

Metadata is structured information that describes a Knowledge Object.

It answers questions such as:

* What is this knowledge about?
* Who created it?
* When was it created?
* When was it last updated?
* Which language is it written in?
* Which audience is it for?
* Which entities does it explain?
* Which sources support it?
* Which output channels can render it?
* How should AI systems interpret it?
* How should search engines index it?
* How trustworthy is it?

GeoCore MUST treat metadata as a first-class system component.

---

# 3. Core Principle

Metadata must be generated from the Knowledge Object.

Metadata must not be manually duplicated across outputs.

The Knowledge Object owns metadata.

Renderers consume metadata.

Outputs expose metadata.

---

# 4. Metadata Layers

GeoCore metadata is divided into six layers.

```text
Metadata
├── Identity Metadata
├── Editorial Metadata
├── Semantic Metadata
├── Technical Metadata
├── SEO Metadata
└── AI/GEO Metadata
```

Each layer has a distinct responsibility.

---

# 5. Identity Metadata

Identity metadata defines the stable identity of a Knowledge Object.

Required fields:

| Field      | Required | Description                           |
| ---------- | -------- | ------------------------------------- |
| `id`       | Yes      | Permanent Knowledge Object identifier |
| `slug`     | Yes      | Human-readable URL-safe identifier    |
| `type`     | Yes      | Knowledge Object type                 |
| `title`    | Yes      | Canonical title                       |
| `language` | Yes      | Primary language                      |
| `version`  | Yes      | Semantic version                      |
| `status`   | Yes      | Draft, Review, Published, Archived    |

Example:

```yaml
id: ko_dental_implant
slug: dental-implant
type: knowledge-object
title: Dental Implant
language: en
version: 1.0.0
status: published
```

Identity metadata MUST remain stable across renderers.

---

# 6. Editorial Metadata

Editorial metadata describes authorship, ownership, review, and publishing state.

Recommended fields:

```yaml
author:
reviewer:
owner:
createdAt:
updatedAt:
publishedAt:
reviewedAt:
archivedAt:
editorialStatus:
```

Editorial metadata is required for:

* medical content
* legal content
* financial content
* scientific content
* business-critical documentation
* public-facing authority content

For RTimi Dental, medical content MUST include an author and a last review date.

For Dawajin Pro, business and product documentation SHOULD include an owner and last update date.

---

# 7. Semantic Metadata

Semantic metadata describes meaning.

It connects a Knowledge Object to the Knowledge Graph.

Recommended fields:

```yaml
entities:
topics:
domains:
audiences:
relationships:
collections:
citations:
glossaryTerms:
```

Semantic metadata enables:

* internal linking
* AI context retrieval
* related content generation
* search ranking
* topic clustering
* entity pages
* knowledge graph traversal

Semantic metadata MUST NOT be replaced by tags alone.

Tags are weak signals.

Entities are strong signals.

---

# 8. Technical Metadata

Technical metadata describes how a Knowledge Object is processed.

Recommended fields:

```yaml
sourceFormat:
renderTargets:
canonicalUrl:
contentHash:
schemaVersion:
validationStatus:
indexingStatus:
renderingStatus:
```

Technical metadata helps GeoCore detect:

* outdated render outputs
* broken links
* duplicate content
* invalid schemas
* stale search indexes
* missing AI summaries

---

# 9. SEO Metadata

SEO metadata is generated from the Knowledge Object and its semantic context.

Recommended fields:

```yaml
seo:
  title:
  description:
  canonicalUrl:
  robots:
  keywords:
  openGraph:
  twitter:
  breadcrumbs:
```

SEO metadata MUST follow these rules:

* No manual duplication of title unless explicitly overridden.
* No keyword stuffing.
* Description must reflect actual content.
* Canonical URL must be stable.
* Robots directives must be explicit.
* OpenGraph metadata must be generated consistently.

SEO is an output concern, not the source of truth.

---

# 10. AI/GEO Metadata

AI/GEO metadata helps generative systems understand and reuse knowledge.

Recommended fields:

```yaml
ai:
  summaryShort:
  summaryMedium:
  summaryLong:
  canonicalAnswer:
  keyTakeaways:
  entitiesExplained:
  intendedAudience:
  confidence:
  citationsRequired:
  freshness:
  answerableQuestions:
```

AI/GEO metadata SHOULD help answer:

* What is the shortest reliable answer?
* What is the detailed explanation?
* Which entities are central?
* Which claims require citations?
* Which audience is this for?
* When should this content be refreshed?

AI metadata MUST NOT contain hidden manipulation instructions.

GeoCore optimizes clarity, not deception.

---

# 11. Metadata Generation

The Metadata Engine SHOULD generate metadata automatically whenever possible.

Sources for metadata generation include:

* Knowledge Object fields
* Knowledge Graph relationships
* Entity definitions
* Author profiles
* Citations
* Collections
* Taxonomies
* Render target rules
* Language settings

Manual overrides are allowed only when justified.

Overrides MUST be explicit and traceable.

---

# 12. Metadata Inheritance

Metadata may be inherited from parent structures.

Example:

A Knowledge Object inside an implantology collection may inherit:

```yaml
domain: dentistry
collection: implantology
author: author_dr_mossaab_rtimi
language: fr
```

Inheritance must be transparent.

The final resolved metadata SHOULD be inspectable.

---

# 13. Metadata Precedence

When metadata conflicts occur, this order applies:

1. Explicit Knowledge Object metadata
2. Knowledge View metadata
3. Collection metadata
4. Entity metadata
5. Global project defaults
6. Renderer defaults

Renderer metadata must never override canonical Knowledge Object metadata unless explicitly allowed.

---

# 14. Canonical Metadata

Every published Knowledge Object MUST expose canonical metadata.

Required canonical fields:

```yaml
id:
slug:
title:
summary:
language:
version:
status:
author:
updatedAt:
canonicalUrl:
entities:
```

If canonical metadata is incomplete, the object MUST NOT be published.

---

# 15. Metadata and Renderers

Renderers consume metadata to generate outputs.

Examples:

HTML renderer uses:

* title
* description
* canonical URL
* OpenGraph
* breadcrumbs

JSON-LD renderer uses:

* author
* entity
* citation
* publication date
* schema type

LLM renderer uses:

* summaries
* canonical answer
* relationships
* citations
* freshness

Search renderer uses:

* title
* summary
* entities
* body
* relationships
* keywords

No renderer may become the owner of metadata.

---

# 16. Metadata and Knowledge Graph

Metadata must integrate with the Knowledge Graph.

Example:

If a Knowledge Object has:

```yaml
entities:
  - entity_dental_implant
```

then the Knowledge Graph SHOULD contain a relationship:

```text
ko_dental_implant_guide explains entity_dental_implant
```

Metadata and graph relationships should remain consistent.

---

# 17. Metadata Validation

Before publication, the Metadata Engine MUST validate:

* required metadata fields
* valid language code
* valid status
* valid version
* valid canonical URL
* valid author reference
* valid entity references
* valid collection references
* valid dates
* duplicate slugs
* duplicate canonical URLs
* missing AI summaries where required
* missing citation metadata where required

Critical errors MUST block publication.

Warnings MAY allow publication.

---

# 18. Metadata Quality Score

GeoCore SHOULD compute a metadata quality score.

Example scoring criteria:

| Criterion                     | Weight |
| ----------------------------- | ------ |
| Required fields complete      | High   |
| Author present                | High   |
| Entities linked               | High   |
| Citations present when needed | High   |
| AI summaries present          | Medium |
| OpenGraph complete            | Medium |
| Breadcrumbs valid             | Medium |
| Keywords relevant             | Low    |

The score SHOULD help editors improve quality.

The score MUST NOT replace validation.

---

# 19. Medical and High-Trust Content

For high-trust domains, metadata requirements are stricter.

High-trust domains include:

* medical
* dental
* legal
* financial
* scientific
* safety-related content

Required additional fields:

```yaml
reviewer:
reviewedAt:
citations:
medicalDisclaimer:
lastMedicalReview:
```

For RTimi Dental, public medical pages SHOULD expose:

* author
* professional identity
* last reviewed date
* citations where appropriate
* disclaimer when needed

---

# 20. Product and SaaS Content

For product documentation and SaaS content, metadata SHOULD include:

```yaml
productArea:
feature:
releaseVersion:
platform:
audience:
difficulty:
lastVerifiedAt:
```

For Dawajin Pro, product documentation SHOULD identify:

* feature area
* user role
* business workflow
* last verified version
* related help content

---

# 21. Minimal Metadata Model

The following TypeScript model is illustrative.

```ts
type KnowledgeStatus = "draft" | "review" | "published" | "archived";

type MetadataConfidence = "low" | "medium" | "high";

type GeoCoreMetadata = {
  id: string;
  slug: string;
  type: string;
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
  archivedAt?: string;
  canonicalUrl?: string;
  entities: string[];
  topics?: string[];
  domains?: string[];
  audiences?: string[];
  collections?: string[];
  citations?: string[];
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
    confidence?: MetadataConfidence;
    answerableQuestions?: string[];
    freshness?: "stable" | "periodic" | "frequent";
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

This model may evolve.

Future implementations MUST preserve the conceptual separation between metadata layers.

---

# 22. Example — RTimi Dental

```yaml
id: ko_detartrage_abime_dents
slug: detartrage-abime-t-il-les-dents
type: patient-question
title: Le détartrage abîme-t-il les dents ?
summary: Réponse claire sur les effets du détartrage sur l'émail et les gencives.
language: fr
version: 1.0.0
status: published
author: author_dr_mossaab_rtimi
reviewer: author_dr_mossaab_rtimi
createdAt: 2026-06-25
updatedAt: 2026-06-25
reviewedAt: 2026-06-25
entities:
  - entity_detartrage
  - entity_tartre
  - entity_email_dentaire
domains:
  - dentistry
audiences:
  - patient
ai:
  summaryShort: Le détartrage n'abîme pas les dents lorsqu'il est réalisé correctement.
  canonicalAnswer: Le détartrage n'abîme pas l'émail. Il retire le tartre qui irrite les gencives et favorise les maladies parodontales.
  confidence: high
  freshness: stable
seo:
  title: Le détartrage abîme-t-il les dents ?
  description: Explication simple par Dr Rtimi Mossaab sur le détartrage, l'émail et la santé des gencives.
```

---

# 23. Example — Dawajin Pro

```yaml
id: ko_customer_balance_management
slug: gestion-creances-clients
type: business-guide
title: Gestion des créances clients dans la distribution avicole
summary: Guide pour comprendre et suivre les soldes clients dans une activité de distribution de volailles.
language: fr
version: 1.0.0
status: published
author: author_dawajin_team
createdAt: 2026-06-25
updatedAt: 2026-06-25
entities:
  - entity_customer_balance
  - entity_invoice
  - entity_payment
  - entity_delivery
domains:
  - poultry-distribution
audiences:
  - business-owner
  - manager
ai:
  summaryShort: Une bonne gestion des créances permet de suivre les dettes clients et d'éviter les pertes de trésorerie.
  canonicalAnswer: Dans la distribution avicole, la gestion des créances consiste à suivre les montants dus par chaque client après les ventes, paiements, retours et ajustements.
  confidence: high
  freshness: periodic
seo:
  title: Gestion des créances clients pour distributeurs de volailles
  description: Comprendre comment suivre les dettes clients, paiements et soldes dans une activité de distribution avicole.
```

---

# 24. Anti-Patterns

The following are prohibited:

* metadata hardcoded inside renderers
* different metadata for different outputs without reason
* duplicated SEO metadata
* missing canonical URLs on published objects
* missing author on public objects
* missing language field
* tags used instead of entities
* AI summaries unrelated to the actual content
* hidden prompts inside metadata
* metadata used to manipulate AI systems deceptively
* stale metadata after content updates
* manually written JSON-LD disconnected from object metadata

---

# 25. Acceptance Criteria

This specification is considered implemented when:

* every Knowledge Object exposes canonical metadata;
* metadata is validated before publication;
* renderers consume metadata instead of owning it;
* SEO metadata is generated from canonical metadata;
* AI/GEO metadata is structured and explicit;
* metadata can be inherited and resolved;
* missing critical metadata blocks publication;
* metadata remains connected to the Knowledge Graph;
* high-trust content supports stricter metadata rules.

---

# 26. Out of Scope

This specification does not define:

* final database schema
* final UI for metadata editing
* final scoring algorithm
* final JSON-LD implementation
* final SEO title generation algorithm
* final AI summary generation method

These will be defined in future specifications.

---

# 27. Future Evolution

Future versions may introduce:

* automated metadata generation with AI
* metadata confidence scoring
* freshness monitoring
* citation-based trust scoring
* reviewer workflows
* schema.org auto-selection
* multilingual metadata alignment
* metadata diffing
* metadata audit logs
* metadata observability dashboard

---

# Final Statement

Knowledge without metadata is invisible.

Metadata gives knowledge identity, meaning, context, trust, and discoverability.

In GeoCore, metadata is not an accessory.

Metadata is part of the knowledge itself.

---

**End of Specification**
