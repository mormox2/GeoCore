# GeoCore Specification 0006

**Document ID:** GC-SPEC-0006
**Title:** Entity Engine
**Version:** 1.0.0
**Status:** Accepted
**Depends On:** GC-SPEC-0001 — GeoCore Foundation
**Depends On:** GC-SPEC-0002 — Knowledge Object
**Depends On:** GC-SPEC-0003 — Knowledge Graph
**Depends On:** GC-SPEC-0004 — Metadata Engine
**Depends On:** GC-SPEC-0005 — Renderer Engine
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Entity Engine** of GeoCore.

The Entity Engine is responsible for identifying, defining, normalizing, validating, connecting, and exposing entities across the Knowledge Graph.

Entities are one of the most important foundations of GeoCore because they allow knowledge to be understood as concepts, not only as documents.

Without entities, GeoCore would only manage structured content.

With entities, GeoCore manages meaning.

---

# 2. Definition

An Entity is a stable representation of a real or conceptual thing.

An entity may represent:

* a medical concept
* a business concept
* a product
* a person
* an organization
* a place
* a workflow
* a feature
* a technical concept
* a disease
* a treatment
* a document type
* a unit of measurement
* an abstract idea

Examples for RTimi Dental:

```text
entity_dental_implant
entity_scaling
entity_gingivitis
entity_prf
entity_cad_cam
entity_zirconia_crown
entity_orthodontic_aligner
```

Examples for Dawajin Pro:

```text
entity_customer_balance
entity_gross_weight
entity_net_weight
entity_delivery_route
entity_invoice
entity_payment
entity_poultry_distribution
entity_stock_movement
```

An entity is not a page.

An entity is not a tag.

An entity is not a category.

An entity is a semantic anchor.

---

# 3. Core Principle

Entities give knowledge semantic stability.

A Knowledge Object explains, mentions, compares, or uses entities.

The Entity Engine ensures that the same concept is always represented consistently across all outputs.

---

# 4. Entity vs Knowledge Object

Entities and Knowledge Objects are related but not identical.

| Concept          | Role                                       |
| ---------------- | ------------------------------------------ |
| Entity           | Represents a concept                       |
| Knowledge Object | Explains or uses knowledge about a concept |

Example:

```text
entity_dental_implant
```

represents the concept of a dental implant.

```text
ko_dental_implant_guide
```

is a Knowledge Object that explains dental implants.

One entity may be connected to many Knowledge Objects.

One Knowledge Object may reference many entities.

---

# 5. Entity Responsibilities

The Entity Engine is responsible for:

* defining canonical entities;
* preventing duplicated entities;
* managing aliases and synonyms;
* connecting entities to Knowledge Objects;
* supporting multilingual entity alignment;
* powering entity pages;
* improving internal linking;
* improving search relevance;
* improving LLM context retrieval;
* improving Schema.org generation;
* supporting glossary and dictionary systems;
* supporting domain-specific ontologies.

The Entity Engine is NOT responsible for:

* writing full articles;
* rendering final pages;
* replacing Knowledge Objects;
* replacing taxonomies;
* storing application business logic;
* deciding business workflows;
* generating medical, legal, or financial advice.

---

# 6. Entity Identity

Every entity MUST have a stable identifier.

Entity identifiers MUST be unique and permanent.

Example:

```text
entity_dental_implant
entity_customer_balance
entity_delivery_route
```

Changing an entity label must not change the entity identifier.

The identifier represents the concept, not the display name.

---

# 7. Mandatory Entity Fields

Every entity MUST contain the following fields.

| Field           | Required | Description                          |
| --------------- | -------- | ------------------------------------ |
| `id`            | Yes      | Permanent entity identifier          |
| `type`          | Yes      | Entity type                          |
| `canonicalName` | Yes      | Main display name                    |
| `definition`    | Yes      | Clear definition                     |
| `language`      | Yes      | Primary language                     |
| `status`        | Yes      | Draft, Review, Published, Deprecated |
| `createdAt`     | Yes      | Creation date                        |
| `updatedAt`     | Yes      | Last update date                     |

---

# 8. Optional Entity Fields

Entities MAY contain:

* aliases
* synonyms
* translations
* related entities
* parent entity
* child entities
* external identifiers
* Schema.org type
* Wikipedia or Wikidata reference
* domain
* audience
* citations
* media
* examples
* disambiguation notes
* usage notes
* deprecated names

Optional fields must support clarity.

They must not create ambiguity.

---

# 9. Entity Types

GeoCore SHOULD support the following entity types.

```text
concept
person
organization
place
product
feature
workflow
medical_concept
dental_concept
business_concept
technical_concept
document_type
unit
metric
condition
treatment
procedure
tool
material
role
```

Additional entity types may be introduced when required.

Entity type names MUST remain stable.

---

# 10. Entity Status

Entities follow a lifecycle.

```text
Draft
  ↓
Review
  ↓
Published
  ↓
Deprecated
```

A deprecated entity must not be deleted if it has been used by published Knowledge Objects.

Deprecated entities SHOULD point to the replacement entity when applicable.

Example:

```yaml
id: entity_old_customer_debt
status: deprecated
replacedBy: entity_customer_balance
```

---

# 11. Aliases and Synonyms

Entities SHOULD support aliases and synonyms.

Example for RTimi Dental:

```yaml
id: entity_scaling
canonicalName: Détartrage
aliases:
  - nettoyage dentaire
  - tartar removal
  - dental scaling
```

Example for Dawajin Pro:

```yaml
id: entity_customer_balance
canonicalName: Créance client
aliases:
  - solde client
  - dette client
  - customer balance
  - client debt
```

Aliases improve:

* search
* internal linking
* AI understanding
* multilingual matching
* content normalization

Aliases MUST NOT create duplicate entities.

---

# 12. Entity Disambiguation

If two concepts have similar names, the Entity Engine MUST support disambiguation.

Example:

```text
entity_scaling_dental
entity_scaling_software
```

Each entity should include a disambiguation note when needed.

```yaml
disambiguation: This entity refers to dental scaling, not software scaling.
```

Disambiguation prevents false relationships and incorrect AI context.

---

# 13. Entity Relationships

Entities may be related to:

* Knowledge Objects
* other entities
* authors
* collections
* citations
* media
* external references

Common relationships include:

```text
explained_by
mentioned_by
related_to
broader_than
narrower_than
alternative_to
part_of
used_in
measured_by
treated_by
caused_by
prevents
```

Entity relationships must be structured, typed, and validated.

---

# 14. Entity and Knowledge Graph

The Entity Engine operates inside the Knowledge Graph.

Example:

```text
ko_dental_scaling_article explains entity_scaling
ko_dental_scaling_article mentions entity_tartar
entity_scaling related_to entity_periodontal_health
entity_scaling related_to entity_gingivitis
```

Example:

```text
ko_customer_balance_management explains entity_customer_balance
ko_customer_balance_management mentions entity_invoice
entity_customer_balance related_to entity_payment
entity_customer_balance related_to entity_delivery
```

Entities help the graph become understandable.

---

# 15. Entity Pages

GeoCore MAY generate entity pages.

An entity page is a rendered representation of an entity.

It may include:

* canonical name
* definition
* aliases
* related Knowledge Objects
* related entities
* citations
* media
* frequently asked questions
* glossary entries
* examples
* last updated date

Entity pages are useful for:

* GEO
* SEO
* internal navigation
* documentation
* knowledge discovery
* LLM interpretation

Entity pages must be generated from entity data and graph relationships.

They must not be manually duplicated pages.

---

# 16. Entity and Glossary

An entity may be used as a glossary entry, but the two concepts are not identical.

An entity defines meaning.

A glossary entry explains terminology.

In simple cases, one entity may generate one glossary entry.

In complex cases, one entity may have multiple glossary explanations for different audiences.

Example:

```text
entity_dental_implant
  → glossary_patient_dental_implant
  → glossary_student_dental_implant
  → glossary_ai_dental_implant
```

---

# 17. Entity and Metadata

Entities must be available to the Metadata Engine.

If a Knowledge Object references an entity, metadata should include that relationship.

Example:

```yaml
entities:
  - entity_dental_implant
  - entity_bone_graft
```

This enables:

* JSON-LD generation
* AI context generation
* search indexing
* related content
* breadcrumbs
* internal linking

---

# 18. Entity and Renderers

Renderers consume entities.

Renderers do not create entities.

Examples:

The HTML renderer may use entities to generate internal links.

The JSON-LD renderer may use entities to generate structured data.

The LLM renderer may use entities to provide context.

The Search renderer may use entities to improve indexing.

No renderer may define entity identity.

---

# 19. Entity and AI

The Entity Engine is critical for AI systems.

When an AI system requests context, GeoCore SHOULD provide:

* canonical entity name
* definition
* aliases
* relationships
* related Knowledge Objects
* citations
* freshness metadata
* domain metadata
* audience metadata

This helps AI systems understand the domain without relying only on page text.

---

# 20. Entity Quality Rules

A published entity SHOULD have:

* a precise canonical name
* a clear definition
* at least one domain
* at least one relationship or justification for being standalone
* aliases when common synonyms exist
* citations when required
* disambiguation when ambiguity exists

High-trust entities SHOULD include citations.

Medical entities SHOULD be reviewed before publication.

---

# 21. Entity Validation

Before publication, the Entity Engine MUST validate:

* unique entity ID;
* valid entity type;
* canonical name present;
* definition present;
* valid language;
* valid status;
* duplicate aliases;
* possible duplicate entities;
* invalid relationships;
* missing required citations for high-trust entities;
* deprecated entity replacement when applicable.

Critical errors MUST block publication.

Warnings MAY allow publication.

---

# 22. Duplicate Entity Detection

GeoCore SHOULD detect possible duplicate entities.

Signals may include:

* same canonical name
* same aliases
* highly similar definitions
* same external references
* same domain and same meaning
* overlapping relationships

Example warning:

```text
Possible duplicate entities:
- entity_customer_balance
- entity_client_debt
```

Duplicate entities create graph fragmentation and must be avoided.

---

# 23. Multilingual Entity Alignment

Entities SHOULD support multilingual alignment.

Example:

```yaml
id: entity_dental_implant
canonicalName:
  fr: Implant dentaire
  ar: زرعة الأسنان
  en: Dental implant
aliases:
  fr:
    - implant
  ar:
    - زراعة الأسنان
  en:
    - tooth implant
```

The concept remains the same across languages.

Translations are views of the entity, not separate concepts.

Separate entities should only exist when concepts are culturally, legally, medically, or operationally different.

---

# 24. External Identifiers

Entities MAY include external identifiers.

Examples:

```yaml
external:
  wikidata: Q123456
  schemaOrg: MedicalProcedure
  wikipedia: https://example.com
```

External identifiers improve:

* interoperability
* trust
* AI interpretation
* data alignment

External identifiers must be used carefully and verified.

---

# 25. Domain-Specific Entity Rules

GeoCore SHOULD allow domain-specific entity rules.

For RTimi Dental:

* dental procedures should identify treatment type;
* medical concepts should include review metadata;
* patient-facing entities should use simple definitions;
* high-trust content should avoid unsupported claims.

For Dawajin Pro:

* business workflow entities should identify user role;
* financial entities should define calculation logic when applicable;
* operational entities should relate to product features;
* local market terminology should support French and Arabic aliases.

---

# 26. Minimal Entity Model

The following TypeScript model is illustrative.

```ts
type EntityStatus = "draft" | "review" | "published" | "deprecated";

type EntityType =
  | "concept"
  | "person"
  | "organization"
  | "place"
  | "product"
  | "feature"
  | "workflow"
  | "medical_concept"
  | "dental_concept"
  | "business_concept"
  | "technical_concept"
  | "document_type"
  | "unit"
  | "metric"
  | "condition"
  | "treatment"
  | "procedure"
  | "tool"
  | "material"
  | "role";

type KnowledgeEntity = {
  id: string;
  type: EntityType;
  canonicalName: string;
  definition: string;
  language: string;
  status: EntityStatus;

  aliases?: string[];
  synonyms?: string[];
  translations?: Record<string, {
    canonicalName: string;
    aliases?: string[];
    definition?: string;
  }>;

  domain?: string[];
  audience?: string[];

  parentId?: string;
  childIds?: string[];
  relatedEntityIds?: string[];

  externalIds?: Record<string, string>;

  citations?: string[];
  media?: string[];

  disambiguation?: string;
  usageNotes?: string;

  createdAt: string;
  updatedAt: string;
};
```

The implementation may evolve, but the conceptual model MUST remain compatible.

---

# 27. Example — RTimi Dental Entity

```yaml
id: entity_scaling
type: dental_concept
canonicalName: Détartrage
definition: Procedure that removes tartar and plaque deposits from teeth, especially around the gum line.
language: fr
status: published
aliases:
  - nettoyage dentaire
  - dental scaling
  - tartar removal
domain:
  - dentistry
audience:
  - patient
relatedEntityIds:
  - entity_tartar
  - entity_gingivitis
  - entity_periodontal_health
createdAt: 2026-06-25
updatedAt: 2026-06-25
```

---

# 28. Example — Dawajin Pro Entity

```yaml
id: entity_customer_balance
type: business_concept
canonicalName: Créance client
definition: Amount still owed by a customer after sales, payments, returns, and adjustments.
language: fr
status: published
aliases:
  - solde client
  - dette client
  - customer balance
  - client debt
domain:
  - poultry-distribution
audience:
  - business-owner
  - manager
relatedEntityIds:
  - entity_invoice
  - entity_payment
  - entity_delivery
createdAt: 2026-06-25
updatedAt: 2026-06-25
```

---

# 29. Anti-Patterns

The following are prohibited:

* using tags as entities;
* creating duplicate entities for synonyms;
* storing entity definitions only inside articles;
* allowing renderers to create entities;
* using categories instead of semantic relationships;
* creating entity pages manually without entity data;
* translating entities as unrelated concepts;
* deleting published entities used by Knowledge Objects;
* ignoring ambiguity between similar entity names;
* using entities for keyword stuffing;
* using entities to deceive AI systems.

---

# 30. Acceptance Criteria

This specification is considered implemented when:

* entities have stable identifiers;
* entities have canonical definitions;
* entities can connect Knowledge Objects;
* entities support aliases and synonyms;
* possible duplicate entities are detected;
* entities participate in the Knowledge Graph;
* entity metadata is available to renderers;
* entity pages can be generated from structured data;
* multilingual entity alignment is supported;
* renderers consume entities but do not own them.

---

# 31. Out of Scope

This specification does not define:

* final database schema;
* final visual entity editor;
* final entity search algorithm;
* final entity deduplication algorithm;
* final ontology management UI;
* final external knowledge base integrations;
* final AI-based entity extraction pipeline.

These will be defined in future specifications or implementation documents.

---

# 32. Future Evolution

Future versions may introduce:

* AI-assisted entity extraction;
* automatic entity linking;
* ontology editor;
* multilingual entity alignment engine;
* entity trust scoring;
* external knowledge base synchronization;
* Wikidata integration;
* Schema.org type mapping;
* domain-specific entity validators;
* visual entity graph explorer;
* entity usage analytics.

---

# Final Statement

Knowledge Objects store knowledge.

The Knowledge Graph connects knowledge.

Entities give knowledge meaning.

Without entities, GeoCore can publish content.

With entities, GeoCore can understand knowledge.

---

**End of Specification**
