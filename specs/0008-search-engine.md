# GeoCore Specification 0008

**Document ID:** GC-SPEC-0008
**Title:** Search Engine
**Version:** 1.0.0
**Status:** Accepted
**Depends On:** GC-SPEC-0001 — GeoCore Foundation
**Depends On:** GC-SPEC-0002 — Knowledge Object
**Depends On:** GC-SPEC-0003 — Knowledge Graph
**Depends On:** GC-SPEC-0004 — Metadata Engine
**Depends On:** GC-SPEC-0005 — Renderer Engine
**Depends On:** GC-SPEC-0006 — Entity Engine
**Depends On:** GC-SPEC-0007 — Content Validation
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Search Engine** of GeoCore.

The Search Engine is responsible for making Knowledge Objects discoverable by humans, applications, internal tools, and AI systems.

Search in GeoCore is not limited to keyword matching.

Search must understand:

* Knowledge Objects
* entities
* relationships
* metadata
* collections
* citations
* language
* audience
* freshness
* trust signals

The Search Engine MUST search structured knowledge, not only rendered HTML.

---

# 2. Definition

The Search Engine is the system responsible for indexing, querying, ranking, filtering, and returning Knowledge Objects and related knowledge structures.

It provides discovery across:

* Knowledge Objects
* Entities
* Collections
* Glossary entries
* FAQs
* Guides
* Documentation
* Media
* Sources
* Rendered outputs when useful

The Search Engine is a knowledge retrieval system.

It is not merely a website search box.

---

# 3. Core Principle

Search must operate on canonical knowledge.

Rendered HTML may be indexed as an additional output, but it must never become the primary search source.

The canonical search source is the validated Knowledge Object and its structured metadata.

---

# 4. Search Responsibilities

The Search Engine is responsible for:

* indexing Knowledge Objects;
* indexing entities;
* indexing metadata;
* indexing relationships;
* supporting keyword search;
* supporting filtered search;
* supporting entity-aware search;
* supporting multilingual search;
* supporting audience-aware search;
* supporting search result ranking;
* supporting search diagnostics;
* preparing future semantic and vector search;
* supporting AI context retrieval.

The Search Engine is NOT responsible for:

* validating canonical content;
* generating metadata;
* rendering final pages;
* replacing the Knowledge Graph;
* replacing the Entity Engine;
* creating business logic;
* deciding editorial truth.

---

# 5. Search Architecture

GeoCore search follows this conceptual pipeline.

```text
Knowledge Object
    ↓
Validation
    ↓
Metadata Resolution
    ↓
Graph Context Resolution
    ↓
Search Document Generation
    ↓
Search Index
    ↓
Query Processing
    ↓
Ranking
    ↓
Search Results
```

Search indexes are generated from validated knowledge.

Invalid or unpublished Knowledge Objects MUST NOT be indexed for public search.

---

# 6. Search Document

A Search Document is a normalized representation of a Knowledge Object prepared for indexing.

It SHOULD include:

```yaml
id:
objectId:
slug:
title:
summary:
bodyText:
language:
status:
version:
author:
updatedAt:
publishedAt:
canonicalUrl:
entities:
relationships:
collections:
citations:
audiences:
domains:
tags:
freshness:
trustSignals:
renderTargets:
```

A Search Document is not the source of truth.

It is a derived representation optimized for retrieval.

---

# 7. Indexable Sources

The Search Engine MAY index:

* Knowledge Objects
* Knowledge Views
* Entities
* Collections
* Glossary entries
* FAQ snippets
* Citations
* Media metadata
* Rendered Markdown
* Rendered plain text

The Search Engine SHOULD avoid indexing raw rendered HTML unless required for a specific use case.

---

# 8. Public vs Internal Search

GeoCore MUST distinguish between public and internal search.

Public search may expose:

* published Knowledge Objects
* published entities
* published collections
* public metadata
* public canonical URLs

Internal search may expose:

* drafts
* validation issues
* unpublished objects
* internal notes
* editor metadata
* diagnostics

Public search MUST NOT leak internal-only metadata.

---

# 9. Search Visibility

Each Knowledge Object SHOULD define search visibility.

Recommended values:

```text
public
private
internal
hidden
```

Meaning:

| Visibility | Meaning                     |
| ---------- | --------------------------- |
| `public`   | Can appear in public search |
| `private`  | Restricted access           |
| `internal` | Internal tools only         |
| `hidden`   | Not searchable              |

Search visibility must be resolved before indexing.

---

# 10. Query Types

GeoCore SHOULD support several query types.

## Keyword Query

Matches text terms.

Example:

```text
dental implant pain
```

## Entity Query

Searches by entity.

Example:

```text
entity_dental_implant
```

## Relationship Query

Finds objects connected by graph relationships.

Example:

```text
all Knowledge Objects explaining entity_customer_balance
```

## Filtered Query

Applies filters.

Example:

```text
language:fr audience:patient domain:dentistry
```

## Hybrid Query

Combines keyword, metadata, and graph signals.

Example:

```text
implant douleur audience:patient language:fr
```

---

# 11. Ranking Principles

Search ranking SHOULD consider:

* title match
* summary match
* body match
* entity match
* relationship strength
* collection membership
* freshness
* publication status
* trust metadata
* author authority
* citation quality
* language match
* audience match
* exact phrase match
* canonical relationship

Ranking MUST NOT rely only on keyword frequency.

---

# 12. Entity-Aware Search

The Search Engine SHOULD use entities to improve search quality.

Example:

A user searching for:

```text
dette client
```

should be able to find content related to:

```text
entity_customer_balance
```

because aliases may include:

```text
créance client
solde client
customer balance
client debt
```

Entity-aware search reduces fragmentation and improves multilingual retrieval.

---

# 13. Graph-Aware Search

The Search Engine SHOULD use the Knowledge Graph for discovery.

Example:

If a user searches for:

```text
implant dentaire
```

results may include:

* main implant guide
* implant pain FAQ
* implant duration FAQ
* bone graft entity
* PRF article
* related videos

Graph-aware search helps users and AI systems discover connected knowledge.

---

# 14. Multilingual Search

GeoCore MUST support multilingual search.

At minimum, the Search Engine SHOULD support:

* French
* Arabic
* English

Multilingual search SHOULD consider:

* localized titles
* translated summaries
* entity aliases
* language-specific slugs
* right-to-left language handling
* cross-language entity alignment

Arabic search MUST support Arabic text and right-to-left output handling.

---

# 15. Audience-Aware Search

Search results SHOULD be adapted to audience when audience context is known.

Examples of audiences:

```text
patient
dentist
developer
business-owner
manager
driver
admin
student
ai-system
```

Example:

The query:

```text
implant dentaire
```

may return different result ordering for:

* patient
* dentist
* student
* AI system

Audience changes ranking, not canonical knowledge.

---

# 16. AI Context Search

The Search Engine MUST support AI context retrieval.

An AI context query should return:

* canonical Knowledge Object
* related entities
* related objects
* citations
* summaries
* trust metadata
* freshness metadata
* version metadata

AI systems should retrieve structured context instead of scraping website pages.

---

# 17. Search Result Model

A search result SHOULD include:

```ts
type SearchResult = {
  id: string;
  objectId: string;
  title: string;
  summary: string;
  url?: string;
  language: string;
  score: number;
  resultType: "knowledge-object" | "entity" | "collection" | "media" | "source";
  matchedFields: string[];
  entities?: string[];
  relationships?: string[];
  updatedAt?: string;
  highlights?: string[];
};
```

The final implementation may extend this model.

---

# 18. Search Index Model

A minimal search index document MAY follow this model.

```ts
type SearchDocument = {
  id: string;
  objectId: string;
  title: string;
  summary: string;
  bodyText: string;
  language: string;
  status: "draft" | "review" | "published" | "archived";
  visibility: "public" | "private" | "internal" | "hidden";
  version: string;
  canonicalUrl?: string;

  entities: string[];
  collections?: string[];
  relationships?: string[];
  audiences?: string[];
  domains?: string[];
  tags?: string[];

  author?: string;
  updatedAt: string;
  publishedAt?: string;

  freshness?: "stable" | "periodic" | "frequent";
  trustScore?: number;
};
```

This model is illustrative.

The implementation may evolve while preserving the same concepts.

---

# 19. Search Indexing Rules

Before indexing a Knowledge Object, the Search Engine MUST verify:

* object exists
* object is valid
* object status allows indexing
* visibility allows indexing
* metadata is resolved
* body text is available
* language is known
* canonical URL is available when public
* entity references are valid

Public indexes MUST exclude draft, review, archived, private, internal, and hidden objects unless explicitly configured otherwise.

---

# 20. Incremental Indexing

GeoCore SHOULD support incremental indexing.

The system SHOULD re-index only affected documents when:

* Knowledge Object changes
* metadata changes
* entity changes
* relationships change
* citations change
* collection membership changes
* language version changes

Index invalidation SHOULD be traceable.

---

# 21. Search Diagnostics

The Search Engine SHOULD expose diagnostics.

Diagnostics may include:

* missing index document
* stale index document
* missing body text
* missing canonical URL
* invalid language
* unknown entity references
* poor metadata completeness
* low search quality score
* object excluded due to visibility

Diagnostics help editors and developers improve knowledge discovery.

---

# 22. Search Quality Score

GeoCore MAY compute a search quality score.

Possible criteria:

| Criterion             | Weight |
| --------------------- | ------ |
| Title clarity         | High   |
| Summary clarity       | High   |
| Entity coverage       | High   |
| Metadata completeness | High   |
| Body text quality     | Medium |
| Freshness             | Medium |
| Citation quality      | Medium |
| Relationship coverage | Medium |
| Keyword relevance     | Low    |

Search quality score is used for improvement, not as an absolute measure of truth.

---

# 23. Search and High-Trust Content

For high-trust content such as medical, dental, legal, financial, scientific, or safety-related knowledge, search results SHOULD expose:

* author
* reviewer when required
* last reviewed date
* citations when available
* disclaimer when appropriate

For RTimi Dental, search results involving patient-facing medical content SHOULD prefer reviewed and properly attributed content.

---

# 24. Search and Product Documentation

For product documentation, search results SHOULD expose:

* product area
* feature
* role
* workflow
* last verified date
* related help topics

For Dawajin Pro, search should support business workflows such as:

* customer balance
* delivery route
* gross weight
* net weight
* invoice
* payment
* stock movement

---

# 25. Local Search Implementation

The first implementation MAY use a local search engine.

Recommended initial approaches:

* Fuse.js
* MiniSearch
* Lunr
* static JSON index

Initial search does not need to use vectors.

The first version should prioritize correctness, structure, and maintainability.

---

# 26. Future Semantic Search

Future versions may introduce semantic search.

Semantic search may use:

* embeddings
* vector databases
* hybrid ranking
* query expansion
* entity-aware reranking
* AI-generated query interpretation

Semantic search must remain grounded in Knowledge Objects and the Knowledge Graph.

Embeddings must not become the source of truth.

---

# 27. Search API

GeoCore SHOULD expose a search API.

Example endpoints:

```text
/api/search
/api/search/entities
/api/search/knowledge
/api/search/context
```

The final API design will be defined in a future API specification.

---

# 28. Example — RTimi Dental Search

Query:

```text
détartrage abîme dents
```

Expected results:

```text
1. ko_detartrage_abime_dents
2. entity_scaling
3. entity_tartar
4. ko_gingivitis_prevention
5. ko_periodontal_health
```

The search engine should understand that "détartrage" relates to scaling and tartar removal.

---

# 29. Example — Dawajin Pro Search

Query:

```text
dette client
```

Expected results:

```text
1. ko_customer_balance_management
2. entity_customer_balance
3. ko_payment_tracking
4. ko_invoice_management
5. ko_delivery_payment_workflow
```

The search engine should understand that "dette client", "créance client", and "solde client" may refer to the same business entity.

---

# 30. Anti-Patterns

The following are prohibited:

* indexing only rendered HTML;
* exposing drafts in public search;
* leaking internal metadata;
* ignoring entity aliases;
* using tags as a replacement for entities;
* ranking only by keyword frequency;
* allowing stale indexes without diagnostics;
* making search results independent from validation;
* using embeddings as the source of truth;
* generating AI context without graph traversal;
* returning high-trust content without author metadata.

---

# 31. Acceptance Criteria

This specification is considered implemented when:

* Knowledge Objects can be indexed;
* public search excludes non-public objects;
* search documents are generated from canonical knowledge;
* metadata and entities are included in search documents;
* search supports at least keyword search;
* entity aliases improve search results;
* search diagnostics exist;
* stale index detection is possible;
* AI context retrieval can use search results;
* renderers are not used as the primary search source.

---

# 32. Out of Scope

This specification does not define:

* final search library;
* final ranking algorithm;
* final vector database;
* final embedding model;
* final UI search component;
* final API endpoint contract;
* final access-control implementation;
* final search analytics dashboard.

These will be defined in future specifications or implementation documents.

---

# 33. Future Evolution

Future versions may introduce:

* vector search;
* hybrid lexical-semantic search;
* query understanding;
* AI-assisted search suggestions;
* multilingual query expansion;
* typo tolerance;
* synonym management;
* entity-based reranking;
* graph traversal ranking;
* search analytics;
* zero-result diagnostics;
* personalization;
* voice search;
* domain-specific ranking profiles.

---

# Final Statement

Search is not an accessory.

Search is how knowledge becomes discoverable.

In GeoCore, search must retrieve knowledge, not pages.

A search engine that indexes only HTML cannot understand GeoCore.

A search engine that indexes Knowledge Objects, entities, metadata, and relationships can.

---

**End of Specification**
