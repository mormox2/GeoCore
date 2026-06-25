# GeoCore Specification 0011

**Document ID:** GC-SPEC-0011
**Title:** Schema Engine
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
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Schema Engine** of GeoCore.

The Schema Engine is responsible for generating structured data from validated Knowledge Objects, metadata, entities, relationships, authors, citations, media, and collections.

Structured data helps search engines, generative engines, AI assistants, crawlers, and external systems understand the meaning, authorship, context, hierarchy, and trust signals of GeoCore knowledge.

The Schema Engine MUST generate schemas from canonical knowledge.

It MUST NOT rely on manually duplicated schema definitions disconnected from Knowledge Objects.

---

# 2. Definition

The Schema Engine is the system responsible for transforming GeoCore knowledge into machine-readable structured data.

The primary output format is JSON-LD.

The primary vocabulary is Schema.org.

Future versions may support additional vocabularies, ontologies, or domain-specific schemas.

The Schema Engine is not a renderer of visual pages.

It is a semantic projection engine.

---

# 3. Core Principle

Schema is a projection of knowledge.

Schema is not the source of truth.

All schema output MUST be generated from:

* Knowledge Objects
* resolved metadata
* Knowledge Graph relationships
* Entity definitions
* Author profiles
* Citations
* Media metadata
* Documentation collections
* Domain rules

Manual schema disconnected from canonical knowledge is prohibited.

---

# 4. Schema Engine Responsibilities

The Schema Engine is responsible for:

* selecting the correct schema type;
* generating JSON-LD;
* mapping Knowledge Objects to Schema.org entities;
* generating author schema;
* generating organization schema;
* generating breadcrumb schema;
* generating FAQ schema;
* generating article schema;
* generating documentation schema;
* generating video schema;
* generating software schema;
* generating medical and dental schema when appropriate;
* validating schema completeness;
* validating schema consistency;
* preventing duplicated or contradictory schema output;
* exposing schema diagnostics.

The Schema Engine is NOT responsible for:

* writing canonical content;
* replacing the Metadata Engine;
* replacing the Entity Engine;
* replacing the Renderer Engine;
* manually injecting SEO tricks;
* generating deceptive structured data;
* describing unavailable products or features.

---

# 5. Schema Generation Pipeline

Schema generation follows this pipeline:

```text
Knowledge Object
    ↓
Content Validation
    ↓
Metadata Resolution
    ↓
Entity Resolution
    ↓
Graph Context Resolution
    ↓
Schema Type Selection
    ↓
Schema Mapping
    ↓
Schema Validation
    ↓
JSON-LD Output
```

Invalid Knowledge Objects MUST NOT produce public schema output.

---

# 6. Supported Output Format

The first supported schema output format is JSON-LD.

Example output format:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Example Article",
  "author": {
    "@type": "Person",
    "name": "Example Author"
  }
}
```

JSON-LD output MUST be traceable to the source Knowledge Object.

---

# 7. Schema Source Rules

The Schema Engine MUST resolve schema data from structured sources.

| Schema Field    | Source                             |
| --------------- | ---------------------------------- |
| `headline`      | Knowledge Object title             |
| `description`   | Knowledge Object summary           |
| `author`        | Author metadata                    |
| `datePublished` | Publication metadata               |
| `dateModified`  | Update metadata                    |
| `mainEntity`    | Entity relationships               |
| `citation`      | Citation relationships             |
| `breadcrumb`    | Collection and graph relationships |
| `image`         | Media metadata                     |
| `url`           | Canonical URL                      |

The Schema Engine MUST NOT invent missing data.

If required schema data is missing, the engine must generate diagnostics.

---

# 8. Supported Schema Types

GeoCore SHOULD support the following Schema.org types.

```text
WebSite
WebPage
Article
BlogPosting
FAQPage
Question
Answer
HowTo
BreadcrumbList
Person
Organization
LocalBusiness
MedicalClinic
Dentist
MedicalProcedure
MedicalCondition
SoftwareApplication
Product
VideoObject
ImageObject
DefinedTerm
DefinedTermSet
CollectionPage
ItemList
TechArticle
APIReference
CreativeWork
```

Additional schema types may be added through extension points.

---

# 9. Schema Type Selection

The Schema Engine SHOULD select schema types automatically based on:

* Knowledge Object type;
* documentation type;
* metadata;
* entities;
* domain;
* audience;
* collection;
* renderer target;
* explicit schema override when valid.

Example:

A patient-facing dental FAQ may generate:

```text
FAQPage
Question
Answer
MedicalWebPage
Dentist
MedicalClinic
```

A Dawajin Pro help article may generate:

```text
Article
TechArticle
SoftwareApplication
BreadcrumbList
```

A glossary entity may generate:

```text
DefinedTerm
DefinedTermSet
```

---

# 10. Schema Precedence

When multiple schema types are possible, this precedence applies:

1. Explicit valid Knowledge Object schema preference
2. Domain-specific schema rules
3. Documentation type
4. Entity type
5. Collection type
6. Default generic schema

Explicit schema preferences MUST still pass validation.

---

# 11. WebSite Schema

GeoCore SHOULD generate WebSite schema for each public site using GeoCore.

Recommended fields:

```yaml
name:
url:
description:
publisher:
inLanguage:
potentialAction:
```

For RTimi Dental, WebSite schema should identify the dental clinic site.

For Dawajin Pro, WebSite schema should identify the SaaS product site.

---

# 12. WebPage Schema

Every public page SHOULD generate WebPage schema.

Recommended fields:

```yaml
@type: WebPage
name:
description:
url:
inLanguage:
datePublished:
dateModified:
isPartOf:
about:
author:
publisher:
breadcrumb:
```

WebPage schema should be generated from resolved metadata and graph relationships.

---

# 13. Article Schema

Knowledge Objects rendered as articles SHOULD generate Article schema.

Recommended fields:

```yaml
@type: Article
headline:
description:
author:
publisher:
datePublished:
dateModified:
mainEntityOfPage:
image:
articleSection:
keywords:
inLanguage:
citation:
```

Article schema MUST reflect the actual content.

It must not include unsupported claims.

---

# 14. FAQPage Schema

Knowledge Objects or Knowledge Views containing structured questions and answers MAY generate FAQPage schema.

FAQPage schema MUST only include visible or accessible FAQ content.

The Schema Engine MUST NOT generate FAQ schema for hidden or unrelated questions.

Example structure:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does dental scaling damage teeth?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dental scaling does not damage enamel when performed correctly."
      }
    }
  ]
}
```

---

# 15. Breadcrumb Schema

The Schema Engine SHOULD generate BreadcrumbList schema from:

* collection hierarchy;
* parent-child relationships;
* documentation structure;
* route metadata.

Breadcrumb schema MUST match the visible or logical navigation.

Manual breadcrumbs disconnected from the Knowledge Graph are prohibited.

---

# 16. Person Schema

Author profiles SHOULD generate Person schema.

Recommended fields:

```yaml
@type: Person
name:
url:
jobTitle:
worksFor:
sameAs:
knowsAbout:
```

For RTimi Dental, Dr Mossaab Rtimi should be represented with professional identity metadata when used as an author or medical reviewer.

The Schema Engine MUST NOT invent credentials, certifications, publications, or affiliations.

---

# 17. Organization Schema

Organizations SHOULD generate Organization schema.

Recommended fields:

```yaml
@type: Organization
name:
url:
logo:
sameAs:
contactPoint:
founder:
```

For Dawajin Pro, Organization schema should represent the software/business entity when available.

For RTimi Dental, clinic identity may be represented through LocalBusiness, MedicalClinic, or Dentist schema as appropriate.

---

# 18. LocalBusiness, MedicalClinic, and Dentist Schema

RTimi Dental SHOULD support local and medical structured data.

Possible schema types:

```text
LocalBusiness
MedicalBusiness
MedicalClinic
Dentist
```

Recommended fields:

```yaml
name:
url:
address:
telephone:
openingHours:
priceRange:
medicalSpecialty:
founder:
employee:
areaServed:
geo:
sameAs:
```

Only verified clinic information may be included.

The Schema Engine MUST NOT invent opening hours, addresses, prices, or medical specialties.

---

# 19. Medical Schema Rules

Medical and dental schema require stricter rules.

For medical or dental content, schema SHOULD include:

* author;
* reviewer when available;
* date modified;
* medical specialty;
* relevant medical entities;
* citations when appropriate;
* disclaimer where appropriate.

Medical schema must not imply diagnosis, guaranteed outcome, or emergency advice unless explicitly supported by the content and professionally reviewed.

---

# 20. SoftwareApplication Schema

Dawajin Pro SHOULD support SoftwareApplication schema.

Recommended fields:

```yaml
@type: SoftwareApplication
name:
applicationCategory:
operatingSystem:
description:
url:
offers:
featureList:
softwareVersion:
publisher:
```

The Schema Engine MUST NOT describe features as available unless they are actually implemented and validated.

Payment or subscription functionality must not be described as production-ready unless actually validated.

---

# 21. Product Schema

Product schema MAY be used when a software product, service, or package is represented.

Product schema MUST NOT include fake ratings, fake reviews, fake prices, or invented availability.

If pricing is not public or stable, pricing schema should be omitted or marked carefully according to actual data.

---

# 22. VideoObject Schema

Video Knowledge Objects or media assets SHOULD generate VideoObject schema when sufficient metadata exists.

Recommended fields:

```yaml
@type: VideoObject
name:
description:
thumbnailUrl:
uploadDate:
duration:
contentUrl:
embedUrl:
transcript:
publisher:
```

For RTimi Dental, HeyGen-style educational videos may generate VideoObject schema if transcript and metadata are available.

The transcript should come from actual video content.

---

# 23. ImageObject Schema

Image assets MAY generate ImageObject schema.

Recommended fields:

```yaml
@type: ImageObject
contentUrl:
caption:
creator:
license:
representativeOfPage:
```

Images should include alt text and meaningful captions where appropriate.

---

# 24. DefinedTerm and Glossary Schema

Entities and glossary entries MAY generate DefinedTerm schema.

Recommended fields:

```yaml
@type: DefinedTerm
name:
description:
termCode:
inDefinedTermSet:
```

For Dawajin Pro, terms such as gross weight, net weight, customer balance, and delivery route may be represented as DefinedTerm.

For RTimi Dental, terms such as scaling, gingivitis, implant, PRF, and zirconia crown may be represented as DefinedTerm.

---

# 25. Documentation Schema

Technical documentation may use:

```text
TechArticle
Article
CreativeWork
APIReference
```

Documentation schema SHOULD include:

* title;
* description;
* author;
* version;
* date modified;
* dependencies when relevant;
* related specifications;
* programming language when relevant;
* product area when relevant.

---

# 26. Citation Mapping

Citations referenced by Knowledge Objects SHOULD be mapped to schema where appropriate.

Citation data may include:

```yaml
name:
url:
author:
publisher:
datePublished:
dateAccessed:
```

The Schema Engine MUST NOT fabricate citations.

If a citation is missing required metadata, diagnostics SHOULD be generated.

---

# 27. Entity Mapping

Entities SHOULD help populate schema fields such as:

* `about`
* `mentions`
* `mainEntity`
* `knowsAbout`
* `medicalSpecialty`
* `applicationCategory`
* `keywords`

Entities improve semantic clarity.

Tags alone are insufficient.

---

# 28. Schema Validation

The Schema Engine MUST validate generated schema.

Validation should check:

* valid JSON-LD;
* required fields;
* valid URLs;
* valid date format;
* valid schema type;
* no duplicated conflicting schema;
* no unsupported claims;
* no fake reviews;
* no fake ratings;
* no invented organization data;
* no invented medical credentials;
* no unavailable product features;
* consistency with canonical metadata.

Critical schema errors MUST block public output when schema is required.

Warnings MAY allow output generation.

---

# 29. Schema Diagnostics

Schema diagnostics SHOULD include:

```yaml
severity:
code:
message:
objectId:
schemaType:
field:
recommendation:
```

Example codes:

```text
GC_SCHEMA_MISSING_AUTHOR
GC_SCHEMA_INVALID_URL
GC_SCHEMA_MISSING_DATE_MODIFIED
GC_SCHEMA_FAKE_REVIEW_FORBIDDEN
GC_SCHEMA_UNSUPPORTED_MEDICAL_CLAIM
GC_SCHEMA_PRODUCT_FEATURE_UNVERIFIED
GC_SCHEMA_FAQ_HIDDEN_CONTENT
```

Diagnostics must be readable by humans and machines.

---

# 30. Schema Registry

GeoCore SHOULD maintain a Schema Registry.

The registry maps:

* Knowledge Object types to schema types;
* entity types to schema types;
* documentation types to schema types;
* domain rules to schema rules;
* renderer targets to schema outputs.

Example:

```ts
type SchemaRegistryEntry = {
  id: string;
  knowledgeType: string;
  schemaTypes: string[];
  requiredFields: string[];
  optionalFields?: string[];
  domain?: string;
};
```

---

# 31. Schema Renderer

The Schema Engine MAY be implemented as a specialized renderer.

If implemented as a renderer, it MUST still obey Schema Engine rules.

It must consume structured knowledge.

It must not scrape HTML.

It must not own metadata.

It must not invent missing information.

---

# 32. Schema and LLM Systems

Structured schema helps AI systems understand content context.

However, Schema.org output is not enough for AI-native knowledge.

GeoCore SHOULD provide both:

* public JSON-LD structured data;
* internal or public LLM-ready structured outputs.

Schema improves machine understanding.

LLM-ready output improves AI context retrieval.

They are complementary.

---

# 33. Minimal Schema Output Model

Illustrative TypeScript model:

```ts
type SchemaOutput = {
  objectId: string;
  objectVersion: string;
  schemaTypes: string[];
  jsonLd: Record<string, unknown> | Record<string, unknown>[];
  generatedAt: string;
  diagnostics?: SchemaDiagnostic[];
};

type SchemaDiagnostic = {
  severity: "info" | "warning" | "error" | "critical";
  code: string;
  message: string;
  objectId?: string;
  schemaType?: string;
  field?: string;
  recommendation?: string;
};
```

The implementation may evolve while preserving traceability and validation.

---

# 34. Example — RTimi Dental FAQ Schema

```yaml
Knowledge Object:
  id: ko_detartrage_abime_dents
  title: Le détartrage abîme-t-il les dents ?
  type: patient-question
  author: author_dr_mossaab_rtimi
  entities:
    - entity_scaling
    - entity_tartar
    - entity_enamel

Generated Schema:
  - WebPage
  - FAQPage
  - Person
  - Dentist
  - BreadcrumbList
```

The schema should not claim that dental scaling is universally risk-free.

It should reflect the actual reviewed content.

---

# 35. Example — Dawajin Pro Software Schema

```yaml
Knowledge Object:
  id: ko_dawajin_pro_overview
  title: Dawajin Pro
  type: software-overview
  entities:
    - entity_poultry_distribution
    - entity_customer_balance
    - entity_delivery_route
    - entity_invoice

Generated Schema:
  - WebPage
  - SoftwareApplication
  - Organization
  - BreadcrumbList
```

The schema must not claim production-ready payment automation unless validated.

---

# 36. Anti-Patterns

The following are prohibited:

* manually duplicated JSON-LD;
* schema generated from scraped HTML;
* schema disconnected from Knowledge Objects;
* fake ratings;
* fake reviews;
* invented author credentials;
* invented clinic data;
* invented software features;
* using schema to mislead search engines;
* generating FAQ schema for hidden content;
* generating medical schema without professional review metadata when required;
* describing unavailable Dawajin Pro features as available;
* allowing schema conflicts across outputs.

---

# 37. Acceptance Criteria

This specification is considered implemented when:

* JSON-LD can be generated from Knowledge Objects;
* schema output is traceable to source object and version;
* schema generation uses resolved metadata;
* entities contribute to schema mapping;
* authors and organizations can generate schema;
* FAQPage, Article, WebPage, BreadcrumbList, Person, Organization, Dentist, MedicalClinic, SoftwareApplication, VideoObject, and DefinedTerm are supported or planned;
* invalid schema produces diagnostics;
* fake ratings, fake reviews, and invented claims are prohibited;
* renderers do not own schema data;
* schema remains a projection, not a source of truth.

---

# 38. Out of Scope

This specification does not define:

* final Schema.org mapping implementation;
* final validation library;
* final JSON-LD injection method;
* final frontend integration;
* final schema testing pipeline;
* final schema visual debugger;
* final external structured data validation service;
* final domain-specific schema presets.

These will be defined in future specifications or implementation documents.

---

# 39. Future Evolution

Future versions may introduce:

* schema presets per domain;
* visual schema debugger;
* schema diffing;
* schema validation CI;
* schema.org version tracking;
* Wikidata alignment;
* external ontology mapping;
* medical schema profiles;
* SaaS schema profiles;
* automatic schema recommendations;
* schema quality score;
* multi-site schema governance.

---

# Final Statement

Schema helps machines understand knowledge.

But schema must never become a parallel truth.

In GeoCore, structured data is generated from validated knowledge, metadata, entities, and relationships.

The Schema Engine exists to make knowledge understandable without making it deceptive.

---

**End of Specification**
