# GeoCore Specification 0017

**Document ID:** GC-SPEC-0017
**Title:** Citation Engine
**Version:** 1.0.0
**Status:** Accepted
**Depends On:** GC-SPEC-0001 — GeoCore Foundation
**Depends On:** GC-SPEC-0002 — Knowledge Object
**Depends On:** GC-SPEC-0003 — Knowledge Graph
**Depends On:** GC-SPEC-0004 — Metadata Engine
**Depends On:** GC-SPEC-0006 — Entity Engine
**Depends On:** GC-SPEC-0007 — Content Validation
**Depends On:** GC-SPEC-0009 — AI Integration
**Depends On:** GC-SPEC-0011 — Schema Engine
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Citation Engine** of GeoCore.

The Citation Engine is responsible for managing sources, citations, references, claim support, trust signals, and citation validation across the Knowledge Graph.

In GeoCore, citations are not decorative footnotes.

Citations are structured trust links between knowledge claims and supporting sources.

This is especially important for:

* medical content;
* dental content;
* scientific content;
* legal content;
* financial content;
* safety-related content;
* product claims;
* benchmark claims;
* technical documentation;
* AI-generated or AI-assisted content.

The Citation Engine ensures that knowledge can be trusted, audited, reviewed, and reused by humans and AI systems.

---

# 2. Definition

A Citation is a structured reference connecting a Knowledge Object, claim, entity, glossary entry, documentation page, or AI output to a supporting Source.

A Source is an external or internal reference that supports, explains, verifies, or contextualizes a piece of knowledge.

A Citation is the link.

A Source is the supporting material.

A Claim is the statement being supported.

---

# 3. Core Principle

Claims require support.

High-trust claims require stronger support.

AI-generated claims require validation.

Citations must support knowledge.

They must not be invented, decorative, misleading, or disconnected from the claim they are meant to support.

---

# 4. Citation Engine Responsibilities

The Citation Engine is responsible for:

* defining sources;
* defining citations;
* linking citations to Knowledge Objects;
* linking citations to specific claims when required;
* validating source metadata;
* validating citation integrity;
* detecting missing citations;
* detecting broken citation links;
* supporting citation rendering;
* supporting citation export;
* supporting Schema.org citation output;
* supporting AI context retrieval;
* supporting high-trust content validation;
* supporting source freshness checks;
* preventing fabricated citations.

The Citation Engine is NOT responsible for:

* replacing professional judgment;
* deciding medical diagnosis;
* deciding legal interpretation;
* deciding financial advice;
* generating unsupported claims;
* creating fake sources;
* hiding uncertainty;
* bypassing Content Validation.

---

# 5. Citation vs Source vs Claim

GeoCore MUST distinguish between Source, Citation, and Claim.

| Concept  | Role                              |
| -------- | --------------------------------- |
| Source   | Supporting material               |
| Citation | Link between knowledge and source |
| Claim    | Statement that needs support      |

Example:

```text
Claim:
Dental scaling removes tartar deposits from tooth surfaces.

Source:
A clinical dentistry reference or reviewed professional source.

Citation:
The structured link between the claim and the source.
```

---

# 6. Source Types

GeoCore SHOULD support the following source types:

```text
research-paper
clinical-guideline
book
official-documentation
official-website
technical-documentation
product-documentation
internal-document
regulatory-source
news-source
dataset
standard
manual
expert-review
professional-review
user-provided-source
```

Additional source types may be introduced when needed.

---

# 7. Source Identity

Every Source MUST have a stable identifier.

Examples:

```text
source_who_oral_health_2024
source_supabase_rls_docs
source_schema_org_article
source_dawajin_internal_release_notes_001
source_dr_mossaab_professional_review_001
```

Changing a title or URL must not change the source identifier.

The identifier represents the source record inside GeoCore.

---

# 8. Mandatory Source Fields

Every Source MUST include:

| Field       | Required | Description                         |
| ----------- | -------- | ----------------------------------- |
| `id`        | Yes      | Permanent source identifier         |
| `type`      | Yes      | Source type                         |
| `title`     | Yes      | Source title                        |
| `status`    | Yes      | Draft, Active, Deprecated, Archived |
| `createdAt` | Yes      | Source record creation date         |
| `updatedAt` | Yes      | Last source record update date      |

A public citation should not reference an incomplete source.

---

# 9. Recommended Source Fields

Sources SHOULD include:

```yaml
authors:
publisher:
url:
doi:
isbn:
publicationDate:
accessedAt:
language:
version:
summary:
trustLevel:
domain:
notes:
```

High-trust sources SHOULD include publication date, publisher, and access date when available.

---

# 10. Citation Identity

Every Citation SHOULD have a stable identifier.

Example:

```text
citation_implant_guide_001
citation_scaling_safety_001
citation_customer_balance_workflow_001
```

Citation identifiers allow traceability, validation, rendering, and auditing.

---

# 11. Mandatory Citation Fields

Every Citation MUST include:

| Field       | Required | Description                                                |
| ----------- | -------- | ---------------------------------------------------------- |
| `id`        | Yes      | Permanent citation identifier                              |
| `sourceId`  | Yes      | Referenced source                                          |
| `targetId`  | Yes      | Knowledge Object, claim, entity, or output being supported |
| `purpose`   | Yes      | Why the citation is used                                   |
| `status`    | Yes      | Draft, Active, Deprecated, Removed                         |
| `createdAt` | Yes      | Citation creation date                                     |
| `updatedAt` | Yes      | Last citation update date                                  |

---

# 12. Recommended Citation Fields

Citations SHOULD include:

```yaml
claimId:
quote:
paraphrase:
page:
section:
url:
confidence:
relevance:
addedBy:
reviewedBy:
reviewedAt:
notes:
```

The `quote` field should be used carefully and must respect copyright and fair-use constraints.

The `paraphrase` field is preferred for most cases.

---

# 13. Claim-Level Citations

GeoCore SHOULD support claim-level citation.

A claim-level citation links a source to a specific statement, not only to the entire Knowledge Object.

Example:

```yaml
claimId: claim_scaling_removes_tartar
claim: Dental scaling removes tartar deposits from tooth surfaces.
citationId: citation_scaling_reference_001
```

Claim-level citation is strongly recommended for:

* medical claims;
* scientific claims;
* legal claims;
* financial claims;
* product availability claims;
* performance claims;
* numerical claims;
* safety claims.

---

# 14. Citation Purpose

Every citation MUST define its purpose.

Recommended values:

```text
supports
explains
defines
contrasts
updates
corrects
reviews
verifies
credits
references
```

Example:

```yaml
purpose: supports
```

A citation used for background context should not be presented as proof of a specific claim.

---

# 15. Citation Confidence

Citations MAY include confidence.

Recommended values:

```text
low
medium
high
authoritative
```

Meaning:

| Confidence      | Meaning                                 |
| --------------- | --------------------------------------- |
| `low`           | Weak or indirect support                |
| `medium`        | Useful but not definitive               |
| `high`          | Strong direct support                   |
| `authoritative` | Official or highly authoritative source |

Confidence helps validation and AI context generation.

---

# 16. Source Trust Level

Sources SHOULD include trust level.

Recommended values:

```text
unknown
low
medium
high
authoritative
```

Examples:

```yaml
trustLevel: authoritative
```

for official documentation, clinical guidelines, standards, or official regulatory sources.

```yaml
trustLevel: medium
```

for general educational sources or non-official but reputable sources.

Trust level must be assigned carefully and must not be used for marketing manipulation.

---

# 17. High-Trust Content Rules

High-trust domains include:

```text
medical
dental
legal
financial
scientific
safety-related
product-critical
```

High-trust Knowledge Objects SHOULD include citations or professional review metadata.

For RTimi Dental, dental and medical content should include at least one of:

* professional review metadata;
* relevant citations;
* clinical or educational source references;
* clear disclaimer when appropriate.

For Dawajin Pro, product-critical content should include one of:

* release notes;
* implementation reference;
* product documentation;
* verified product state;
* internal review.

---

# 18. Professional Review as Source

A professional review may act as a source when appropriate.

Example for RTimi Dental:

```yaml
id: source_dr_mossaab_review_001
type: professional-review
title: Professional review by Dr Mossaab Rtimi
publisher: RTimi Dental
trustLevel: high
```

Professional review does not replace external scientific sources in all cases, but it may satisfy authorship and review requirements for patient-facing educational content.

---

# 19. Internal Sources

GeoCore MAY support internal sources.

Examples:

```text
internal release notes
internal design documents
internal product specs
internal validation reports
internal audit reports
```

Internal sources must respect visibility rules.

A public citation must not expose private internal sources unless explicitly approved.

For Dawajin Pro, internal product notes may support documentation but should not leak secrets, implementation details, credentials, or private business data.

---

# 20. Citation and Knowledge Graph

Citations participate in the Knowledge Graph.

Example:

```text
ko_detartrage_abime_dents cites source_scaling_reference
citation_scaling_safety_001 supports claim_scaling_does_not_damage_enamel_when_performed_correctly
```

Example:

```text
ko_customer_balance_management cites source_dawajin_product_spec_customer_balances
citation_customer_balance_001 verifies feature_customer_balance_tracking
```

Citation relationships help:

* trust scoring;
* AI retrieval;
* schema generation;
* review workflows;
* auditability;
* content validation.

---

# 21. Citation and Metadata

The Metadata Engine SHOULD expose citation metadata.

Example:

```yaml
citations:
  - citation_scaling_safety_001
  - citation_tartar_gum_health_001
```

Citation metadata helps:

* renderers display references;
* Schema Engine generate structured data;
* Search Engine rank trusted content;
* LLMs Engine expose trustworthy resources;
* AI Integration ground responses.

---

# 22. Citation and Renderer Engine

Renderers may display citations differently.

Examples:

* inline citations;
* footnotes;
* reference lists;
* source cards;
* bibliography blocks;
* AI context references;
* JSON citation arrays;
* Schema.org citation fields.

Renderers consume citations.

Renderers must not create citation truth.

---

# 23. Citation and Schema Engine

The Schema Engine MAY map citations to Schema.org fields.

Possible fields:

```text
citation
isBasedOn
sameAs
about
mentions
author
publisher
```

Schema output must not include fabricated sources.

If a source URL is missing, the Schema Engine should either omit the URL or generate diagnostics.

---

# 24. Citation and AI Integration

AI systems must receive citations when required.

AI Context Packages SHOULD include:

* citation IDs;
* source metadata;
* claim associations;
* confidence level;
* source freshness;
* review status.

AI-generated outputs must not invent citations.

AI-generated citation suggestions must be validated before becoming canonical.

---

# 25. Citation and LLM Outputs

The LLMs Engine SHOULD expose citation information for high-value and high-trust Knowledge Objects.

LLM-readable outputs may include:

```yaml
citations:
  - title:
    sourceType:
    url:
    publicationDate:
    accessedAt:
    supports:
```

LLM outputs should distinguish between supported facts and general educational explanations.

---

# 26. Citation and Search

The Search Engine SHOULD use citation signals.

Search ranking may consider:

* source trust level;
* citation relevance;
* review status;
* source freshness;
* authoritative sources;
* number of supporting citations;
* claim-level citation coverage.

Citation count alone must not be treated as proof of quality.

---

# 27. Citation Freshness

Some sources become outdated.

Sources SHOULD include freshness metadata.

Recommended values:

```text
stable
periodic
time-sensitive
outdated
```

Examples:

* A basic anatomy reference may be `stable`.
* Product documentation may be `time-sensitive`.
* Software API documentation may be `time-sensitive`.
* Medical guidelines may require periodic review.

Outdated sources SHOULD trigger warnings.

---

# 28. Link Validation

The Citation Engine SHOULD validate external source links when possible.

Validation may check:

* URL exists;
* URL is reachable;
* URL uses HTTPS when available;
* redirects are acceptable;
* source has not disappeared;
* source title still matches;
* access date is recorded.

Broken links SHOULD generate diagnostics.

Critical citations with broken links may block publication depending on domain rules.

---

# 29. Citation Validation

Before publication, citations MUST be validated.

Validation checks include:

* citation ID exists;
* citation ID is unique;
* source exists;
* target exists;
* purpose exists;
* status is valid;
* source status is valid;
* source metadata is sufficient;
* citation relevance is defined when required;
* high-trust claims have sufficient support;
* no fabricated citation is present;
* no private source leaks into public output;
* broken critical source links are detected when possible.

Critical errors MUST block publication.

---

# 30. Citation Diagnostics

Citation diagnostics SHOULD include:

```yaml
severity:
code:
message:
citationId:
sourceId:
targetId:
recommendation:
```

Example diagnostic codes:

```text
GC_CITATION_SOURCE_MISSING
GC_CITATION_TARGET_MISSING
GC_CITATION_PURPOSE_MISSING
GC_CITATION_PRIVATE_SOURCE_PUBLIC_OUTPUT
GC_CITATION_BROKEN_URL
GC_CITATION_HIGH_TRUST_SUPPORT_MISSING
GC_CITATION_AI_FABRICATED_SOURCE
GC_CITATION_OUTDATED_SOURCE
GC_CITATION_LOW_RELEVANCE
```

Diagnostics must be readable by humans and machines.

---

# 31. Citation Quality Score

GeoCore SHOULD compute a citation quality score.

Possible criteria:

| Criterion                             | Importance                  |
| ------------------------------------- | --------------------------- |
| Source exists                         | Critical                    |
| Source trust level                    | High                        |
| Citation relevance                    | High                        |
| Claim-level association               | High                        |
| Source freshness                      | Medium                      |
| Source metadata completeness          | Medium                      |
| Link validity                         | Medium                      |
| Reviewer approval                     | High for high-trust content |
| Public/private visibility correctness | Critical                    |

The score helps improve trust quality.

It does not replace validation.

---

# 32. Minimal Source Model

Illustrative TypeScript model:

```ts
type SourceStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "archived";

type SourceType =
  | "research-paper"
  | "clinical-guideline"
  | "book"
  | "official-documentation"
  | "official-website"
  | "technical-documentation"
  | "product-documentation"
  | "internal-document"
  | "regulatory-source"
  | "news-source"
  | "dataset"
  | "standard"
  | "manual"
  | "expert-review"
  | "professional-review"
  | "user-provided-source";

type SourceTrustLevel =
  | "unknown"
  | "low"
  | "medium"
  | "high"
  | "authoritative";

type KnowledgeSource = {
  id: string;
  type: SourceType;
  title: string;
  status: SourceStatus;

  authors?: string[];
  publisher?: string;
  url?: string;
  doi?: string;
  isbn?: string;

  publicationDate?: string;
  accessedAt?: string;
  language?: string;
  version?: string;

  summary?: string;
  trustLevel?: SourceTrustLevel;
  freshness?: "stable" | "periodic" | "time-sensitive" | "outdated";

  visibility?: "public" | "internal" | "private";

  createdAt: string;
  updatedAt: string;
};
```

---

# 33. Minimal Citation Model

Illustrative TypeScript model:

```ts
type CitationStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "removed";

type CitationPurpose =
  | "supports"
  | "explains"
  | "defines"
  | "contrasts"
  | "updates"
  | "corrects"
  | "reviews"
  | "verifies"
  | "credits"
  | "references";

type CitationConfidence =
  | "low"
  | "medium"
  | "high"
  | "authoritative";

type KnowledgeCitation = {
  id: string;
  sourceId: string;
  targetId: string;
  claimId?: string;

  purpose: CitationPurpose;
  status: CitationStatus;

  quote?: string;
  paraphrase?: string;
  page?: string;
  section?: string;
  url?: string;

  confidence?: CitationConfidence;
  relevance?: "low" | "medium" | "high";

  addedBy?: string;
  reviewedBy?: string;
  reviewedAt?: string;

  notes?: string;

  createdAt: string;
  updatedAt: string;
};
```

The implementation may evolve while preserving traceability and validation.

---

# 34. Example — RTimi Dental Citation

```yaml
source:
  id: source_dr_mossaab_review_scaling_001
  type: professional-review
  title: Professional review of dental scaling educational content
  publisher: RTimi Dental
  trustLevel: high
  visibility: public
  status: active
  createdAt: 2026-06-25
  updatedAt: 2026-06-25

citation:
  id: citation_scaling_safety_review_001
  sourceId: source_dr_mossaab_review_scaling_001
  targetId: ko_detartrage_abime_dents
  purpose: reviews
  status: active
  confidence: high
  reviewedBy: author_dr_mossaab_rtimi
  reviewedAt: 2026-06-25
  createdAt: 2026-06-25
  updatedAt: 2026-06-25
```

---

# 35. Example — Dawajin Pro Citation

```yaml
source:
  id: source_dawajin_customer_balance_spec_001
  type: internal-document
  title: Dawajin Pro customer balance workflow specification
  publisher: Dawajin Pro
  trustLevel: high
  visibility: internal
  status: active
  createdAt: 2026-06-25
  updatedAt: 2026-06-25

citation:
  id: citation_customer_balance_workflow_001
  sourceId: source_dawajin_customer_balance_spec_001
  targetId: ko_customer_balance_management
  purpose: verifies
  status: active
  confidence: high
  createdAt: 2026-06-25
  updatedAt: 2026-06-25
```

Public outputs must not expose private internal source details unless explicitly approved.

---

# 36. Anti-Patterns

The following are prohibited:

* invented citations;
* fake sources;
* citations that do not support the claim;
* citation stuffing;
* using citations as decoration;
* citing inaccessible private sources in public output without approval;
* AI-generated citations without validation;
* hiding outdated sources;
* using old product documentation to describe current features;
* using citations to imply unsupported authority;
* using professional review to justify claims outside professional scope;
* treating citation count as truth.

---

# 37. Acceptance Criteria

This specification is considered implemented when:

* sources can be defined with stable identifiers;
* citations can link sources to Knowledge Objects;
* citations can support specific claims when required;
* high-trust content can require citations or professional review metadata;
* citation validation exists;
* fabricated citations are prohibited;
* private sources are not leaked into public outputs;
* renderers can display citations;
* Schema Engine can consume citation metadata;
* AI Context Packages can include citation data;
* citation diagnostics can be generated.

---

# 38. Out of Scope

This specification does not define:

* final citation UI;
* final source management UI;
* final bibliography style;
* final external link checker implementation;
* final DOI lookup integration;
* final citation import/export format;
* final automated claim extraction system;
* final automated source quality scoring algorithm;
* final plagiarism or copyright analysis workflow.

These will be defined in future specifications or implementation documents.

---

# 39. Future Evolution

Future versions may introduce:

* claim extraction engine;
* AI-assisted citation suggestions;
* citation-to-claim mapping UI;
* source trust scoring;
* citation freshness monitoring;
* bibliography style presets;
* DOI and PubMed integrations;
* source archive snapshots;
* citation graph explorer;
* citation coverage dashboard;
* automated broken link monitoring;
* citation diffing;
* medical evidence hierarchy support;
* product documentation verification workflows.

---

# Final Statement

Knowledge needs structure.

Trust needs evidence.

Citations connect knowledge to evidence.

In GeoCore, citations are not decoration.

They are structured trust relationships inside the Knowledge Graph.

A Knowledge Operating System must not only organize knowledge.

It must make knowledge auditable.

---

**End of Specification**
