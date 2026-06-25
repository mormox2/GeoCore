# GeoCore Specification 0015

**Document ID:** GC-SPEC-0015
**Title:** Taxonomy Engine
**Version:** 1.0.0
**Status:** Accepted
**Depends On:** GC-SPEC-0001 — GeoCore Foundation
**Depends On:** GC-SPEC-0002 — Knowledge Object
**Depends On:** GC-SPEC-0003 — Knowledge Graph
**Depends On:** GC-SPEC-0004 — Metadata Engine
**Depends On:** GC-SPEC-0006 — Entity Engine
**Depends On:** GC-SPEC-0014 — Collection Engine
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Taxonomy Engine** of GeoCore.

The Taxonomy Engine is responsible for classifying Knowledge Objects, Entities, Collections, Documentation, Media, and other knowledge resources into stable organizational structures.

Taxonomy helps humans and machines understand where knowledge belongs.

The Taxonomy Engine provides classification.

The Entity Engine provides meaning.

The Collection Engine provides structure.

These three systems are related, but they must not be confused.

---

# 2. Definition

A Taxonomy is a controlled classification system used to organize knowledge.

A taxonomy may define:

* domains;
* categories;
* tags;
* topics;
* audiences;
* industries;
* languages;
* difficulty levels;
* product areas;
* content types;
* trust levels;
* freshness levels.

A Taxonomy is not a Knowledge Object.

A Taxonomy is not an Entity.

A Taxonomy is not a Collection.

A Taxonomy is a classification framework.

---

# 3. Core Principle

Taxonomy classifies knowledge.

It does not define knowledge.

The Knowledge Object remains the source of truth.

The Entity Engine defines semantic meaning.

The Collection Engine defines intentional grouping.

The Taxonomy Engine defines classification.

---

# 4. Taxonomy Engine Responsibilities

The Taxonomy Engine is responsible for:

* defining taxonomies;
* defining taxonomy terms;
* validating taxonomy usage;
* classifying Knowledge Objects;
* classifying Entities;
* classifying Collections;
* supporting hierarchical categories;
* supporting tags;
* supporting audiences;
* supporting domains;
* supporting multilingual taxonomy labels;
* supporting taxonomy-based filtering;
* supporting taxonomy-based navigation;
* exposing taxonomy metadata;
* preventing uncontrolled classification sprawl.

The Taxonomy Engine is NOT responsible for:

* replacing entities;
* replacing collections;
* replacing the Knowledge Graph;
* rendering final pages;
* storing canonical knowledge;
* defining editorial truth;
* storing application business logic.

---

# 5. Taxonomy vs Entity vs Collection

GeoCore MUST clearly distinguish Taxonomies, Entities, and Collections.

| Concept    | Role                            | Example                         |
| ---------- | ------------------------------- | ------------------------------- |
| Taxonomy   | Classifies knowledge            | `domain: dentistry`             |
| Entity     | Defines meaning                 | `entity_dental_implant`         |
| Collection | Organizes objects intentionally | `collection_implantology_guide` |

Example for RTimi Dental:

```text
Taxonomy:
domain = dentistry

Entity:
entity_dental_implant

Collection:
collection_implantology_guide
```

Example for Dawajin Pro:

```text
Taxonomy:
domain = poultry-distribution

Entity:
entity_customer_balance

Collection:
collection_dawajin_customer_balance
```

---

# 6. Taxonomy Types

GeoCore SHOULD support the following taxonomy types:

```text
domain
category
tag
topic
audience
industry
language
difficulty
product-area
content-type
trust-level
freshness-level
region
role
workflow
```

Additional taxonomy types may be introduced when justified.

---

# 7. Domain Taxonomy

A domain is a high-level field of knowledge.

Examples:

```text
dentistry
poultry-distribution
software-engineering
medical-education
product-documentation
business-operations
```

A Knowledge Object SHOULD belong to at least one domain when published.

Domains help:

* search;
* navigation;
* schema selection;
* LLM context;
* validation rules;
* high-trust classification.

---

# 8. Category Taxonomy

A category is a broad organizational classification inside a domain.

Examples for RTimi Dental:

```text
implantology
orthodontics
periodontology
prevention
esthetic-dentistry
digital-dentistry
oral-surgery
```

Examples for Dawajin Pro:

```text
sales-management
delivery-management
customer-balances
invoicing
stock-management
payment-tracking
user-management
```

Categories help group content but must not replace entities.

---

# 9. Tag Taxonomy

Tags are lightweight classification labels.

Tags may be used for:

* editorial filtering;
* search boosting;
* content grouping;
* UI filters;
* internal organization.

Tags are weaker than entities.

Tags MUST NOT be used as a replacement for entities.

Example:

```yaml
tags:
  - beginner
  - patient-question
  - common-problem
```

---

# 10. Audience Taxonomy

Audience classification helps adapt views, renderers, summaries, and search results.

Recommended audiences:

```text
patient
dentist
student
developer
business-owner
manager
driver
admin
operator
ai-system
public
internal-team
```

A Knowledge View SHOULD define its target audience when audience adaptation is required.

---

# 11. Product Area Taxonomy

Product documentation SHOULD support product area classification.

For Dawajin Pro, examples include:

```text
customers
sales
deliveries
invoices
payments
stock
reports
subscriptions
settings
users
security
offline-sync
```

Product area taxonomy helps:

* help center navigation;
* search filters;
* documentation ownership;
* release notes;
* product documentation validation.

---

# 12. Workflow Taxonomy

Workflow taxonomy classifies business or operational processes.

For Dawajin Pro, examples include:

```text
create-sale
deliver-order
track-customer-balance
record-payment
manage-stock
create-invoice
manage-driver
review-report
```

Workflow taxonomy is useful for product help, onboarding, and business education.

---

# 13. Trust-Level Taxonomy

Trust-level taxonomy helps apply stricter validation rules.

Recommended values:

```text
general
professional
medical
legal
financial
scientific
safety-critical
product-critical
```

For RTimi Dental, patient-facing dental content should usually be classified as:

```text
trust-level: medical
```

For Dawajin Pro, product documentation involving subscriptions, payments, or financial logic may be:

```text
trust-level: product-critical
```

---

# 14. Freshness-Level Taxonomy

Freshness taxonomy defines how often knowledge should be reviewed.

Recommended values:

```text
stable
periodic
frequent
live
```

Meaning:

| Value      | Meaning                         |
| ---------- | ------------------------------- |
| `stable`   | Rarely changes                  |
| `periodic` | Should be reviewed occasionally |
| `frequent` | Changes regularly               |
| `live`     | May change very often           |

Example:

```yaml
freshness: stable
```

for a basic dental hygiene explanation.

Example:

```yaml
freshness: frequent
```

for product documentation tied to active software features.

---

# 15. Difficulty Taxonomy

Difficulty helps organize learning experiences.

Recommended values:

```text
beginner
intermediate
advanced
expert
```

Difficulty should describe the expected reader level.

It should not be used for marketing exaggeration.

---

# 16. Taxonomy Identity

Every taxonomy term MUST have a stable identifier.

Example:

```text
taxonomy_domain_dentistry
taxonomy_category_implantology
taxonomy_audience_patient
taxonomy_product_area_deliveries
```

Changing a display label must not change the identifier.

The identifier represents the classification concept.

---

# 17. Mandatory Taxonomy Term Fields

Every taxonomy term MUST include:

| Field         | Required | Description                    |
| ------------- | -------- | ------------------------------ |
| `id`          | Yes      | Permanent identifier           |
| `type`        | Yes      | Taxonomy type                  |
| `slug`        | Yes      | URL-safe or machine-safe label |
| `label`       | Yes      | Human-readable label           |
| `description` | Yes      | Short explanation              |
| `status`      | Yes      | Draft, Published, Deprecated   |
| `createdAt`   | Yes      | Creation date                  |
| `updatedAt`   | Yes      | Last update date               |

---

# 18. Optional Taxonomy Term Fields

Taxonomy terms MAY include:

* parent term;
* child terms;
* aliases;
* translations;
* icon;
* color token;
* order;
* related entities;
* related collections;
* validation rules;
* visibility;
* replacement term.

Optional fields must not make taxonomy terms act as entities.

---

# 19. Hierarchical Taxonomies

Some taxonomies may be hierarchical.

Example:

```text
dentistry
├── implantology
├── orthodontics
├── prevention
└── periodontology
```

Example:

```text
poultry-distribution
├── sales-management
├── delivery-management
├── invoicing
└── stock-management
```

Parent-child taxonomy cycles are prohibited.

---

# 20. Flat Taxonomies

Some taxonomies should remain flat.

Examples:

```text
audience
difficulty
trust-level
freshness-level
language
```

Flat taxonomies are easier to validate and filter.

---

# 21. Taxonomy and Metadata

Taxonomy terms are usually exposed through metadata.

Example:

```yaml
domains:
  - dentistry

categories:
  - implantology

audiences:
  - patient

trustLevel: medical

freshness: stable
```

The Metadata Engine must validate taxonomy values against registered taxonomy terms.

---

# 22. Taxonomy and Knowledge Graph

Taxonomy terms may participate in the Knowledge Graph, but they are not entities.

Examples:

```text
ko_implant_dental_guide classified_as taxonomy_category_implantology
ko_customer_balance_management classified_as taxonomy_category_customer_balances
```

Taxonomy graph relationships help search, navigation, and filtering.

However, semantic meaning should remain with entities.

---

# 23. Taxonomy and Search

The Search Engine SHOULD use taxonomy for filtering and ranking.

Examples:

```text
domain:dentistry audience:patient
domain:poultry-distribution product-area:deliveries
trust-level:medical language:fr
```

Taxonomy-based filtering should be stable and predictable.

---

# 24. Taxonomy and Renderers

Renderers may use taxonomy to generate:

* section labels;
* filters;
* badges;
* navigation;
* sidebars;
* collection indexes;
* sitemap grouping;
* documentation categories.

Renderers must not create taxonomy terms.

---

# 25. Taxonomy and Schema

The Schema Engine may use taxonomy terms to select schema types.

Example:

```yaml
domain: dentistry
trustLevel: medical
```

may influence medical schema selection.

Example:

```yaml
contentType: api-reference
```

may influence TechArticle or APIReference schema.

Schema mapping must still use metadata, entities, and content type.

---

# 26. Taxonomy and LLM Outputs

LLM outputs may expose taxonomy classifications to help AI systems understand the knowledge map.

Example:

```yaml
domain: poultry-distribution
audience:
  - business-owner
  - manager
productArea:
  - customer-balances
```

Taxonomy helps AI systems route and contextualize knowledge.

It must not contain hidden instructions.

---

# 27. Multilingual Taxonomy

Taxonomy labels SHOULD support multiple languages.

Example:

```yaml
id: taxonomy_category_implantology
type: category
slug: implantology
label:
  fr: Implantologie
  ar: زراعة الأسنان
  en: Implantology
description:
  fr: Contenus liés aux implants dentaires.
  ar: محتوى متعلق بزراعة الأسنان.
  en: Content related to dental implants.
```

The taxonomy term ID remains stable across languages.

Translations are labels, not separate taxonomy concepts.

---

# 28. Taxonomy Validation

Before publication, taxonomy usage MUST be validated.

Validation checks include:

* taxonomy term exists;
* taxonomy type is valid;
* term status is valid;
* no duplicate term IDs;
* no duplicate slugs within a taxonomy type;
* no invalid parent-child cycles;
* no deprecated term used without replacement logic;
* object taxonomy values match registered terms;
* required taxonomy fields exist when publishing;
* public outputs do not expose internal-only taxonomy terms.

Critical errors MUST block publication.

---

# 29. Deprecated Taxonomy Terms

Taxonomy terms may be deprecated.

A deprecated term SHOULD include a replacement when applicable.

Example:

```yaml
id: taxonomy_category_client_debt
status: deprecated
replacedBy: taxonomy_category_customer_balances
```

Published objects using deprecated terms SHOULD trigger validation warnings.

---

# 30. Taxonomy Registry

GeoCore SHOULD maintain a Taxonomy Registry.

The registry defines:

* available taxonomy types;
* allowed terms;
* hierarchy rules;
* flat vs hierarchical behavior;
* required terms per domain;
* visibility rules;
* validation rules.

Example:

```ts
type TaxonomyRegistry = {
  types: TaxonomyTypeDefinition[];
  terms: TaxonomyTerm[];
};
```

---

# 31. Minimal Taxonomy Model

Illustrative TypeScript model:

```ts
type TaxonomyStatus =
  | "draft"
  | "published"
  | "deprecated";

type TaxonomyType =
  | "domain"
  | "category"
  | "tag"
  | "topic"
  | "audience"
  | "industry"
  | "language"
  | "difficulty"
  | "product-area"
  | "content-type"
  | "trust-level"
  | "freshness-level"
  | "region"
  | "role"
  | "workflow";

type TaxonomyTerm = {
  id: string;
  type: TaxonomyType;
  slug: string;
  label: string | Record<string, string>;
  description: string | Record<string, string>;
  status: TaxonomyStatus;

  parentId?: string;
  childIds?: string[];

  aliases?: string[];
  translations?: Record<string, {
    label: string;
    description?: string;
    aliases?: string[];
  }>;

  order?: number;
  visibility?: "public" | "internal" | "hidden";

  replacedBy?: string;

  createdAt: string;
  updatedAt: string;
};
```

The implementation may evolve while preserving the same concepts.

---

# 32. Example — RTimi Dental Taxonomy Terms

```yaml
- id: taxonomy_domain_dentistry
  type: domain
  slug: dentistry
  label:
    fr: Dentisterie
    ar: طب الأسنان
    en: Dentistry
  description:
    fr: Domaine lié aux soins dentaires, à la prévention, aux traitements et à la santé bucco-dentaire.
    ar: مجال متعلق بعلاج الأسنان والوقاية وصحة الفم.
    en: Domain related to dental care, prevention, treatment, and oral health.
  status: published
  createdAt: 2026-06-25
  updatedAt: 2026-06-25

- id: taxonomy_category_implantology
  type: category
  slug: implantology
  label:
    fr: Implantologie
    ar: زراعة الأسنان
    en: Implantology
  description:
    fr: Contenus liés aux implants dentaires, à leurs indications, étapes, limites et alternatives.
    ar: محتوى متعلق بزراعة الأسنان ودواعيها ومراحلها وحدودها وبدائلها.
    en: Content related to dental implants, indications, steps, limitations, and alternatives.
  status: published
  createdAt: 2026-06-25
  updatedAt: 2026-06-25
```

---

# 33. Example — Dawajin Pro Taxonomy Terms

```yaml
- id: taxonomy_domain_poultry_distribution
  type: domain
  slug: poultry-distribution
  label:
    fr: Distribution avicole
    ar: توزيع الدواجن
    en: Poultry distribution
  description:
    fr: Domaine lié à la gestion commerciale, logistique et financière de la distribution de volailles.
    ar: مجال متعلق بالإدارة التجارية واللوجستية والمالية لتوزيع الدواجن.
    en: Domain related to commercial, logistics, and financial management of poultry distribution.
  status: published
  createdAt: 2026-06-25
  updatedAt: 2026-06-25

- id: taxonomy_product_area_customer_balances
  type: product-area
  slug: customer-balances
  label:
    fr: Créances clients
    ar: ديون الحرفاء
    en: Customer balances
  description:
    fr: Fonctionnalités et contenus liés au suivi des soldes, dettes et paiements clients.
    ar: وظائف ومحتوى متعلق بمتابعة أرصدة الحرفاء وديونهم ودفعاتهم.
    en: Features and content related to customer balances, debts, and payments.
  status: published
  createdAt: 2026-06-25
  updatedAt: 2026-06-25
```

---

# 34. Anti-Patterns

The following are prohibited:

* using tags as entities;
* using categories as collections;
* using folders as taxonomy;
* creating uncontrolled tags without registry;
* creating duplicate taxonomy terms with similar meaning;
* translating taxonomy terms as separate concepts;
* using taxonomy to hide missing entities;
* hardcoding taxonomy labels inside renderers;
* allowing deprecated terms without warnings;
* exposing internal taxonomy terms publicly by accident.

---

# 35. Acceptance Criteria

This specification is considered implemented when:

* taxonomy types are defined;
* taxonomy terms have stable identifiers;
* Knowledge Objects can reference taxonomy terms;
* taxonomy usage is validated;
* duplicate taxonomy terms are detected;
* deprecated terms generate warnings;
* taxonomies support multilingual labels;
* taxonomy can support filtering and navigation;
* taxonomy does not replace entities or collections;
* renderers consume taxonomy but do not own it.

---

# 36. Out of Scope

This specification does not define:

* final taxonomy editor UI;
* final taxonomy storage backend;
* final taxonomy import/export format;
* final taxonomy analytics dashboard;
* final automated taxonomy suggestion engine;
* final taxonomy migration tooling;
* final visual taxonomy tree editor.

These will be defined in future specifications or implementation documents.

---

# 37. Future Evolution

Future versions may introduce:

* visual taxonomy editor;
* AI-assisted taxonomy suggestions;
* taxonomy merge workflows;
* taxonomy usage analytics;
* taxonomy quality scoring;
* taxonomy governance rules;
* multi-site shared taxonomy;
* domain-specific taxonomy packs;
* taxonomy version diffing;
* taxonomy import/export tools;
* taxonomy-driven routing presets.

---

# Final Statement

Taxonomy classifies knowledge.

Entities define meaning.

Collections organize structure.

The Knowledge Graph connects everything.

In GeoCore, taxonomy is a controlled classification system, not a substitute for semantic understanding.

A disciplined taxonomy keeps knowledge navigable, searchable, and maintainable.

---

**End of Specification**
