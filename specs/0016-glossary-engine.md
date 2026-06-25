# GeoCore Specification 0016

**Document ID:** GC-SPEC-0016
**Title:** Glossary Engine
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
**Depends On:** GC-SPEC-0011 — Schema Engine
**Depends On:** GC-SPEC-0014 — Collection Engine
**Depends On:** GC-SPEC-0015 — Taxonomy Engine
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Glossary Engine** of GeoCore.

The Glossary Engine is responsible for generating, validating, organizing, rendering, and exposing glossary entries from structured entities, Knowledge Objects, metadata, and relationships.

A glossary helps humans and machines understand domain-specific terminology.

In GeoCore, glossary entries are not isolated static definitions.

They are structured knowledge views derived from canonical entities and connected Knowledge Objects.

---

# 2. Definition

A Glossary Entry is a human-readable explanation of a term.

A term may represent:

* a medical concept;
* a dental procedure;
* a business concept;
* a product feature;
* a workflow;
* a technical concept;
* a document type;
* a unit of measurement;
* an operational term;
* a local market expression.

A glossary entry explains terminology.

An entity defines meaning.

A Knowledge Object explains knowledge.

The Glossary Engine connects these layers.

---

# 3. Core Principle

Glossary entries explain terms.

Entities define concepts.

The Glossary Engine MUST NOT replace the Entity Engine.

A glossary entry SHOULD usually be derived from an Entity, but it may adapt the explanation to a specific audience, language, or context.

---

# 4. Glossary Engine Responsibilities

The Glossary Engine is responsible for:

* creating glossary entries from entities;
* rendering glossary pages;
* validating glossary definitions;
* supporting multilingual glossary entries;
* supporting audience-specific explanations;
* linking terms to Knowledge Objects;
* linking terms to related entities;
* generating glossary indexes;
* generating glossary collections;
* exposing glossary data to search;
* exposing glossary data to LLM outputs;
* generating schema for glossary terms;
* supporting internal linking from term mentions.

The Glossary Engine is NOT responsible for:

* replacing entities;
* replacing Knowledge Objects;
* replacing taxonomy;
* creating canonical truth independently;
* storing duplicated definitions;
* generating unsupported medical or product claims;
* managing business application logic.

---

# 5. Glossary Entry vs Entity

A Glossary Entry and an Entity are related but not identical.

| Concept          | Role                       |
| ---------------- | -------------------------- |
| Entity           | Represents the concept     |
| Glossary Entry   | Explains the term          |
| Knowledge Object | Provides deeper knowledge  |
| Collection       | Organizes multiple entries |
| Taxonomy         | Classifies the entry       |

Example:

```text
entity_dental_implant
```

represents the concept of a dental implant.

```text
glossary_dental_implant_patient_fr
```

explains the term “implant dentaire” for French-speaking patients.

```text
ko_dental_implant_guide
```

provides a full guide about dental implants.

---

# 6. Glossary Entry Identity

Every Glossary Entry MUST have a stable identifier.

Example:

```text
glossary_scaling_patient_fr
glossary_customer_balance_manager_fr
glossary_gross_weight_operator_fr
```

The identifier represents the glossary explanation, not necessarily the entity itself.

Changing the displayed title must not change the identifier.

---

# 7. Mandatory Glossary Entry Fields

Every Glossary Entry MUST include:

| Field        | Required     | Description                         |
| ------------ | ------------ | ----------------------------------- |
| `id`         | Yes          | Permanent glossary entry identifier |
| `term`       | Yes          | Displayed term                      |
| `slug`       | Yes          | URL-safe identifier                 |
| `definition` | Yes          | Clear explanation                   |
| `language`   | Yes          | Language of the entry               |
| `status`     | Yes          | Draft, Review, Published, Archived  |
| `entityId`   | Yes, usually | Linked canonical entity             |
| `audience`   | Yes          | Target audience                     |
| `createdAt`  | Yes          | Creation date                       |
| `updatedAt`  | Yes          | Last update date                    |

A glossary entry without an entity link must include a justification.

---

# 8. Optional Glossary Entry Fields

Glossary entries MAY include:

* short definition;
* long definition;
* examples;
* synonyms;
* aliases;
* translations;
* related terms;
* related Knowledge Objects;
* related collections;
* citations;
* media;
* pronunciation;
* local usage notes;
* technical notes;
* medical disclaimer;
* product availability note;
* canonical URL;
* schema type.

Optional fields must improve clarity.

They must not duplicate canonical knowledge unnecessarily.

---

# 9. Audience-Specific Glossary Entries

The same entity may have multiple glossary entries for different audiences.

Example:

```text
entity_dental_implant
  → glossary_dental_implant_patient_fr
  → glossary_dental_implant_student_fr
  → glossary_dental_implant_professional_fr
  → glossary_dental_implant_ai_en
```

The concept remains the same.

The explanation changes depending on the audience.

Example audiences:

```text
patient
dentist
student
developer
business-owner
manager
driver
operator
admin
ai-system
```

Audience-specific explanations must not contradict the canonical entity definition.

---

# 10. Multilingual Glossary Entries

Glossary entries SHOULD support multilingual output.

Supported languages SHOULD include:

```text
French
Arabic
English
```

Example:

```yaml
entityId: entity_customer_balance
entries:
  fr: Créance client
  ar: ديون الحرفاء
  en: Customer balance
```

Translations must preserve meaning.

Arabic glossary entries must support right-to-left rendering.

---

# 11. Glossary Entry Status

Glossary entries follow this lifecycle:

```text
Draft
  ↓
Review
  ↓
Published
  ↓
Archived
```

Published glossary entries must pass validation.

Archived glossary entries should not appear in public glossary indexes unless explicitly configured.

---

# 12. Glossary and Knowledge Graph

Glossary entries participate in the Knowledge Graph.

Example:

```text
glossary_scaling_patient_fr explains entity_scaling
glossary_scaling_patient_fr related_to ko_detartrage_abime_dents
glossary_scaling_patient_fr part_of collection_rtimidental_glossary
```

Example:

```text
glossary_customer_balance_fr explains entity_customer_balance
glossary_customer_balance_fr related_to ko_customer_balance_management
glossary_customer_balance_fr part_of collection_dawajin_glossary
```

Glossary relationships help:

* internal linking;
* search;
* AI context retrieval;
* related content blocks;
* glossary navigation;
* schema generation.

---

# 13. Glossary Collections

Glossary entries SHOULD be organized in Collections.

Examples:

```text
collection_rtimidental_glossary
collection_dawajin_glossary
collection_geocore_glossary
```

Glossary collections may be organized:

* alphabetically;
* by domain;
* by category;
* by audience;
* by product area;
* by workflow;
* by language.

The Collection Engine defines the structure.

The Glossary Engine defines glossary behavior.

---

# 14. Glossary Index

The Glossary Engine SHOULD generate glossary indexes.

A glossary index may include:

* alphabetical navigation;
* domain filters;
* category filters;
* audience filters;
* search box;
* language switcher;
* related collections;
* popular terms.

Example routes:

```text
/fr/glossaire
/fr/glossaire/implant-dentaire
/fr/glossaire/creance-client
/ar/glossary
/en/glossary
```

Routes are implementation details and may vary by project.

---

# 15. Term Mentions and Internal Linking

The Glossary Engine SHOULD support automatic or assisted internal linking.

When a known glossary term appears in a Knowledge Object, GeoCore may suggest a link to the canonical glossary entry or entity page.

Example:

If a Knowledge Object contains:

```text
créance client
```

and the glossary entry exists, GeoCore may suggest a link to:

```text
/fr/glossaire/creance-client
```

Automatic linking must avoid excessive links.

The first meaningful mention may be enough.

---

# 16. Synonyms and Aliases

Glossary entries SHOULD support synonyms and aliases.

Example for RTimi Dental:

```yaml
term: Détartrage
aliases:
  - nettoyage dentaire
  - élimination du tartre
  - dental scaling
```

Example for Dawajin Pro:

```yaml
term: Créance client
aliases:
  - dette client
  - solde client
  - customer balance
  - client debt
```

Aliases help:

* search;
* AI understanding;
* internal linking;
* multilingual matching;
* duplicate prevention.

Aliases must not create duplicate entries.

---

# 17. Glossary and Search

Glossary entries MUST be searchable when public.

Search documents for glossary entries SHOULD include:

* term;
* short definition;
* long definition;
* aliases;
* language;
* audience;
* entity ID;
* related Knowledge Objects;
* related entities;
* domain;
* category;
* canonical URL.

Entity aliases should improve glossary search.

---

# 18. Glossary and Schema

The Schema Engine MAY generate structured data for glossary entries.

Possible Schema.org types:

```text
DefinedTerm
DefinedTermSet
WebPage
BreadcrumbList
```

A glossary entry may generate:

```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": "Créance client",
  "description": "Amount still owed by a customer after sales, payments, returns, and adjustments."
}
```

Schema must be generated from validated glossary data and entities.

---

# 19. Glossary and LLM Outputs

The LLMs Engine SHOULD expose important glossary indexes and glossary entries.

LLM-readable glossary output may include:

* term;
* short definition;
* canonical entity;
* aliases;
* related concepts;
* related Knowledge Objects;
* language;
* audience;
* last updated date.

Glossary entries help AI systems understand domain-specific vocabulary.

---

# 20. Glossary and High-Trust Content

For high-trust domains such as medical, dental, legal, financial, scientific, or safety-related content, glossary entries require stricter rules.

For RTimi Dental, glossary entries involving dental procedures, conditions, or treatments SHOULD include:

* professional author or reviewer;
* reviewed date when required;
* cautious language;
* citations when appropriate;
* disclaimer when appropriate.

Glossary entries must not present themselves as personal medical diagnosis.

---

# 21. Glossary and Product Content

For product or SaaS documentation, glossary entries SHOULD reflect actual product terminology.

For Dawajin Pro, glossary entries involving features or workflows SHOULD include:

* product area;
* user role;
* workflow;
* related documentation;
* last verified date when relevant.

Glossary entries must not describe unavailable product features as available.

---

# 22. Glossary Validation

Before publication, glossary entries MUST be validated.

Validation checks include:

* glossary ID exists;
* glossary ID is unique;
* term exists;
* slug exists;
* definition exists;
* language is valid;
* audience is valid;
* status is valid;
* linked entity exists or missing entity is justified;
* aliases do not duplicate existing canonical terms;
* related objects exist;
* related entities exist;
* public entries have canonical URLs when required;
* high-trust entries include required review metadata;
* product entries do not include unverified product claims.

Critical errors MUST block publication.

---

# 23. Duplicate Glossary Detection

GeoCore SHOULD detect possible duplicate glossary entries.

Signals include:

* same term;
* same alias;
* same slug;
* same entity;
* similar definition;
* same language and audience;
* overlapping related objects.

Intentional duplicates must be justified.

Example allowed:

```text
glossary_dental_implant_patient_fr
glossary_dental_implant_student_fr
```

because they target different audiences.

Example discouraged:

```text
glossary_customer_balance_fr
glossary_client_debt_fr
```

if both explain the same term for the same audience.

---

# 24. Glossary Quality Score

GeoCore SHOULD compute a glossary quality score.

Possible criteria:

| Criterion                       | Importance |
| ------------------------------- | ---------- |
| Clear definition                | High       |
| Linked entity                   | High       |
| Aliases present when useful     | Medium     |
| Related objects                 | Medium     |
| Related entities                | Medium     |
| Audience defined                | High       |
| Language valid                  | High       |
| High-trust review when required | High       |
| Examples present                | Medium     |
| Schema-ready metadata           | Medium     |

The score helps improve glossary quality.

It does not replace validation.

---

# 25. Minimal Glossary Entry Model

Illustrative TypeScript model:

```ts
type GlossaryStatus =
  | "draft"
  | "review"
  | "published"
  | "archived";

type GlossaryAudience =
  | "patient"
  | "dentist"
  | "student"
  | "developer"
  | "business-owner"
  | "manager"
  | "driver"
  | "operator"
  | "admin"
  | "ai-system"
  | string;

type GlossaryEntry = {
  id: string;
  term: string;
  slug: string;
  definition: string;
  shortDefinition?: string;
  longDefinition?: string;

  language: string;
  audience: GlossaryAudience;
  status: GlossaryStatus;

  entityId?: string;
  missingEntityReason?: string;

  aliases?: string[];
  synonyms?: string[];

  examples?: string[];
  relatedObjectIds?: string[];
  relatedEntityIds?: string[];
  relatedCollectionIds?: string[];

  citations?: string[];
  media?: string[];

  canonicalUrl?: string;

  author?: string;
  reviewer?: string;
  reviewedAt?: string;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  archivedAt?: string;
};
```

The implementation may evolve while preserving the same concepts.

---

# 26. Example — RTimi Dental Glossary Entry

```yaml
id: glossary_scaling_patient_fr
term: Détartrage
slug: detartrage
definition: Le détartrage est un soin qui permet d’enlever le tartre accumulé sur les dents, surtout près des gencives.
shortDefinition: Soin dentaire destiné à retirer le tartre.
language: fr
audience: patient
status: draft
entityId: entity_scaling
aliases:
  - nettoyage dentaire
  - élimination du tartre
  - dental scaling
relatedObjectIds:
  - ko_detartrage_abime_dents
relatedEntityIds:
  - entity_tartar
  - entity_gingivitis
  - entity_periodontal_health
author: author_dr_mossaab_rtimi
reviewer: author_dr_mossaab_rtimi
createdAt: 2026-06-25
updatedAt: 2026-06-25
```

---

# 27. Example — Dawajin Pro Glossary Entry

```yaml
id: glossary_customer_balance_manager_fr
term: Créance client
slug: creance-client
definition: Une créance client est le montant qu’un client doit encore payer après une vente, un paiement partiel, un retour ou un ajustement.
shortDefinition: Montant encore dû par un client.
language: fr
audience: manager
status: draft
entityId: entity_customer_balance
aliases:
  - dette client
  - solde client
  - customer balance
  - client debt
relatedObjectIds:
  - ko_customer_balance_management
  - ko_payment_tracking
relatedEntityIds:
  - entity_invoice
  - entity_payment
  - entity_delivery
createdAt: 2026-06-25
updatedAt: 2026-06-25
```

---

# 28. Anti-Patterns

The following are prohibited:

* glossary definitions disconnected from entities;
* duplicated glossary entries for the same term, language, and audience;
* using glossary entries as a replacement for full Knowledge Objects;
* using glossary entries as a replacement for taxonomy;
* hardcoding glossary links inside renderers only;
* translating glossary terms as unrelated concepts;
* publishing high-trust glossary entries without review metadata when required;
* publishing product glossary entries with unverified features;
* keyword stuffing glossary entries for SEO;
* using glossary entries to manipulate AI systems.

---

# 29. Acceptance Criteria

This specification is considered implemented when:

* glossary entries have stable identifiers;
* glossary entries can link to entities;
* glossary entries can link to Knowledge Objects;
* glossary entries support language and audience;
* glossary entries can be validated;
* glossary entries can be rendered;
* glossary indexes can be generated;
* glossary entries can participate in search;
* glossary entries can support Schema.org DefinedTerm output;
* duplicate glossary entries can be detected;
* glossary entries remain projections of knowledge, not independent truth.

---

# 30. Out of Scope

This specification does not define:

* final glossary editor UI;
* final routing implementation;
* final automatic link insertion algorithm;
* final glossary styling;
* final pronunciation system;
* final glossary import/export format;
* final glossary analytics dashboard;
* final AI glossary generation workflow.

These will be defined in future specifications or implementation documents.

---

# 31. Future Evolution

Future versions may introduce:

* AI-assisted glossary generation;
* automatic term extraction;
* multilingual glossary alignment;
* pronunciation support;
* glossary usage analytics;
* glossary quality dashboard;
* duplicate glossary merge workflow;
* glossary-to-entity sync tools;
* domain-specific glossary packs;
* glossary API endpoints;
* glossary hover cards;
* glossary inline explanations;
* glossary learning paths.

---

# Final Statement

Glossaries make specialized knowledge accessible.

Entities define meaning.

Glossary entries explain terms.

Knowledge Objects provide depth.

In GeoCore, the Glossary Engine turns domain vocabulary into structured, searchable, renderable, and AI-readable knowledge.

A glossary is not a list of words.

A glossary is a doorway into the Knowledge Graph.

---

**End of Specification**
