# GeoCore Specification 0003

**Document ID:** GC-SPEC-0003

**Title:** Knowledge Graph

**Version:** 1.0.0

**Status:** Accepted

**Depends On:** GC-SPEC-0001 — GeoCore Foundation

**Depends On:** GC-SPEC-0002 — Knowledge Object

**Author:** Dr Mossaab Rtimi

**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Knowledge Graph** model of GeoCore.

The Knowledge Graph is responsible for connecting Knowledge Objects together through explicit, typed, and validated relationships.

A Knowledge Object alone is useful.

A Knowledge Object connected to other Knowledge Objects becomes part of a structured knowledge system.

GeoCore MUST treat relationships as first-class knowledge.

---

# 2. Definition

The Knowledge Graph is the structured network formed by:

* Knowledge Objects
* Entities
* Relationships
* Collections
* Taxonomies
* Citations
* Media
* Sources
* Renderable views

The Knowledge Graph defines how knowledge is connected, traversed, indexed, rendered, and understood by humans and machines.

---

# 3. Core Principle

Knowledge is not isolated.

Every Knowledge Object SHOULD be connected to other Knowledge Objects whenever a meaningful relationship exists.

Disconnected knowledge is allowed during draft creation but SHOULD NOT remain disconnected after publication unless explicitly justified.

---

# 4. Conceptual Model

```text
Knowledge Graph
│
├── Knowledge Object
│   ├── Metadata
│   ├── Views
│   ├── Renderers
│   └── Relationships
│
├── Entity
│   ├── Name
│   ├── Definition
│   ├── Aliases
│   └── Related Objects
│
├── Relationship
│   ├── Source Object
│   ├── Target Object
│   ├── Type
│   └── Strength
│
├── Collection
│   ├── Ordered Objects
│   └── Navigation Rules
│
└── Taxonomy
    ├── Categories
    ├── Tags
    └── Domains
```

---

# 5. Graph Responsibility

The Knowledge Graph is responsible for:

* connecting related knowledge
* enabling internal linking
* powering search and discovery
* supporting AI-readable context
* generating related content blocks
* creating breadcrumbs
* supporting entity pages
* enabling knowledge traversal
* reducing duplicated content
* improving GEO and LLM comprehension

The Knowledge Graph is NOT responsible for:

* rendering final pages
* storing visual layout
* replacing Knowledge Objects
* replacing validation rules
* storing application business logic

---

# 6. Nodes

A node is any object that can participate in the graph.

GeoCore supports the following node types:

* Knowledge Object
* Entity
* Author
* Source
* Media Asset
* Collection
* Taxonomy Term
* External Reference

Each node MUST have a stable identifier.

Example:

```text
ko_dental_implant
entity_implantology
author_dr_mossaab_rtimi
source_who_oral_health
media_implant_diagram_001
collection_implant_guide
taxonomy_dentistry
```

---

# 7. Knowledge Object Nodes

Every Knowledge Object MUST be represented as a graph node.

A Knowledge Object node may have relationships to:

* parent objects
* child objects
* related objects
* prerequisite objects
* glossary entries
* citations
* entities
* authors
* media assets
* translations
* collections

---

# 8. Entity Nodes

An Entity represents a real concept, person, organization, place, product, medical concept, business concept, or technical concept.

Examples for RTimi Dental:

```text
entity_dental_implant
entity_prf
entity_gingivitis
entity_orthodontic_aligner
entity_cad_cam
```

Examples for Dawajin Pro:

```text
entity_customer_balance
entity_gross_weight
entity_net_weight
entity_delivery_route
entity_poultry_distribution
entity_invoice
```

Entities are not articles.

Entities are concepts.

One entity may be referenced by many Knowledge Objects.

---

# 9. Relationship Types

GeoCore supports typed relationships.

The minimum required relationship types are:

| Type             | Meaning                                          |
| ---------------- | ------------------------------------------------ |
| `related_to`     | General semantic relationship                    |
| `parent_of`      | Hierarchical parent relationship                 |
| `child_of`       | Hierarchical child relationship                  |
| `part_of`        | Object belongs to a larger object                |
| `requires`       | Object requires another object as prerequisite   |
| `explains`       | Object explains an entity or concept             |
| `cites`          | Object cites a source                            |
| `authored_by`    | Object is authored by an author                  |
| `mentions`       | Object mentions an entity                        |
| `uses_media`     | Object uses a media asset                        |
| `translation_of` | Object is a translation of another object        |
| `alternative_to` | Object provides an alternative explanation       |
| `contrasts_with` | Object compares or contrasts with another object |
| `example_of`     | Object is an example of another object           |

Additional relationship types may be introduced in future specifications.

---

# 10. Relationship Direction

Relationships MUST define direction.

Example:

```text
ko_implant_pain_after_surgery explains entity_dental_implant
entity_dental_implant mentioned_by ko_implant_pain_after_surgery
```

Direction matters because it affects:

* breadcrumbs
* related content
* graph traversal
* AI context retrieval
* internal linking
* semantic interpretation

---

# 11. Relationship Strength

Each relationship MAY include a strength score.

```text
weak
medium
strong
canonical
```

Meaning:

* `weak`: loose association
* `medium`: useful association
* `strong`: highly relevant association
* `canonical`: primary relationship

Example:

```text
ko_dental_implant_guide explains entity_dental_implant with strength canonical
```

The system SHOULD prefer canonical and strong relationships when generating internal links or AI context.

---

# 12. Relationship Metadata

A relationship MAY include metadata.

Recommended fields:

```yaml
source:
target:
type:
strength:
createdAt:
updatedAt:
createdBy:
reason:
confidence:
```

Example:

```yaml
source: ko_implant_guide
target: entity_dental_implant
type: explains
strength: canonical
confidence: high
reason: Main guide explaining dental implants
```

---

# 13. Collections

A Collection is an ordered group of Knowledge Objects.

Collections are used for:

* guides
* courses
* documentation sections
* help centers
* topic clusters
* learning paths

Example:

```text
collection_implantology_guide
collection_dawajin_delivery_management
collection_customer_balance_documentation
```

A Collection is not merely a category.

A Collection has order, purpose, and navigation logic.

---

# 14. Taxonomy

A Taxonomy organizes knowledge into broad classification systems.

GeoCore supports:

* domains
* categories
* tags
* topics
* audiences
* industries
* languages

Taxonomy helps organize knowledge.

The Knowledge Graph helps connect knowledge.

They are related but not identical.

---

# 15. Graph Traversal

GeoCore MUST support traversal from one node to related nodes.

Examples:

From a dental implant article, the system should be able to find:

* related FAQs
* implant glossary definition
* author
* sources
* videos
* related conditions
* alternative treatments

From a Dawajin Pro article about customer balances, the system should be able to find:

* related help articles
* glossary definitions
* feature documentation
* business use cases
* invoice-related objects
* payment-related objects

---

# 16. Internal Linking

The Knowledge Graph SHOULD power internal linking.

Manual links are allowed.

However, critical internal links SHOULD be generated or validated through graph relationships.

Example:

If an object mentions `dental implant`, and the entity `entity_dental_implant` exists, GeoCore SHOULD be able to suggest or generate a link to the canonical dental implant Knowledge Object.

---

# 17. AI Context Retrieval

The Knowledge Graph MUST support AI context retrieval.

When an AI system requests context for a Knowledge Object, GeoCore SHOULD provide:

* the object itself
* canonical entity definitions
* related objects
* citations
* glossary entries
* author information
* version metadata
* trust metadata

This prevents AI systems from relying only on rendered HTML.

---

# 18. GEO Role

The Knowledge Graph improves GEO by helping generative engines understand:

* what the site is about
* which topics are canonical
* which pages explain which entities
* which content is authoritative
* which content is related
* which author owns which expertise
* which sources support which claims

A strong Knowledge Graph makes the website easier to cite, summarize, and trust.

---

# 19. Validation Rules

Before publication, graph validation SHOULD check:

* missing canonical entity relationships
* broken object references
* circular parent-child relationships
* orphan published objects
* missing author relationships
* missing citation relationships where citations are required
* duplicated entities
* invalid relationship types
* invalid relationship direction
* invalid collection ordering

Critical validation errors MUST block publication.

Warnings SHOULD be displayed but MAY allow publication.

---

# 20. Orphan Objects

An orphan object is a published Knowledge Object with no meaningful relationship to the graph.

Published orphan objects are discouraged.

Allowed exceptions:

* root objects
* landing objects
* temporary migration objects
* intentionally standalone reference objects

Every exception SHOULD include a reason.

---

# 21. Circular Relationships

Circular relationships are allowed only when semantically valid.

Example allowed:

```text
entity_gingivitis related_to entity_periodontitis
entity_periodontitis related_to entity_gingivitis
```

Example not allowed:

```text
ko_a parent_of ko_b
ko_b parent_of ko_a
```

Parent-child cycles MUST be rejected.

---

# 22. Source of Truth

Relationships MUST be stored as structured data.

Relationships MUST NOT exist only inside rendered HTML.

HTML links may reflect graph relationships, but they must not be the only source of relationship truth.

---

# 23. Minimal Graph Data Model

A minimal relationship object should follow this structure:

```ts
type KnowledgeRelationshipType =
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
  | "example_of";

type KnowledgeRelationshipStrength =
  | "weak"
  | "medium"
  | "strong"
  | "canonical";

type KnowledgeRelationship = {
  id: string;
  sourceId: string;
  targetId: string;
  type: KnowledgeRelationshipType;
  strength: KnowledgeRelationshipStrength;
  reason?: string;
  confidence?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
};
```

This model is illustrative.

The final implementation may extend it but MUST preserve the concepts.

---

# 24. Examples

## RTimi Dental Example

```text
ko_dental_implant_guide
  explains entity_dental_implant
  authored_by author_dr_mossaab_rtimi
  cites source_medical_reference_001
  related_to ko_implant_pain
  related_to ko_implant_duration
  uses_media media_implant_diagram
  part_of collection_implantology
```

## Dawajin Pro Example

```text
ko_customer_balance_management
  explains entity_customer_balance
  related_to ko_invoice_management
  related_to ko_payment_tracking
  related_to ko_delivery_management
  part_of collection_dawajin_academy
  mentions entity_client
  mentions entity_payment
```

---

# 25. Anti-Patterns

The following are prohibited:

* relationships existing only as HTML links
* duplicated entities with different names
* untyped relationships
* graph logic inside renderers
* renderer-specific graph behavior
* categories used as replacement for relationships
* tags used as replacement for entities
* manual related articles without graph validation
* AI context generated without graph traversal

---

# 26. Acceptance Criteria

This specification is considered implemented when:

* every published Knowledge Object can participate in the graph;
* relationships are structured, typed, and validated;
* entities can connect multiple Knowledge Objects;
* internal linking can use graph relationships;
* AI context retrieval can traverse related knowledge;
* orphan published objects are detected;
* invalid relationship types are rejected;
* graph data remains independent from renderers.

---

# 27. Out of Scope

This specification does not define:

* the full Entity Engine implementation
* the final database schema
* the rendering system
* the search ranking algorithm
* the AI embedding system
* the user interface for graph editing

These will be defined in future specifications.

---

# 28. Future Evolution

Future versions may introduce:

* weighted graph traversal
* vector-enhanced graph search
* trust scoring
* citation scoring
* AI-assisted relationship suggestions
* visual graph explorer
* ontology management
* automatic duplicate entity detection
* domain-specific graph rules
* multilingual graph alignment

---

# Final Statement

A Knowledge Object gives knowledge identity.

The Knowledge Graph gives knowledge meaning.

Without relationships, GeoCore is only a structured content system.

With the Knowledge Graph, GeoCore becomes a true Knowledge Operating System.

---

**End of Specification**
