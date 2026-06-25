# GeoCore Specification 0007

**Document ID:** GC-SPEC-0007
**Title:** Content Validation
**Version:** 1.0.0
**Status:** Accepted
**Depends On:** GC-SPEC-0001 — GeoCore Foundation
**Depends On:** GC-SPEC-0002 — Knowledge Object
**Depends On:** GC-SPEC-0003 — Knowledge Graph
**Depends On:** GC-SPEC-0004 — Metadata Engine
**Depends On:** GC-SPEC-0005 — Renderer Engine
**Depends On:** GC-SPEC-0006 — Entity Engine
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Content Validation** system of GeoCore.

Content validation ensures that every Knowledge Object, Entity, Metadata block, Relationship, View, and Renderer Output respects the rules of the platform before it is published, indexed, rendered, or exposed to humans and machines.

Validation is not optional.

Validation is the safety layer that protects GeoCore from duplicated knowledge, broken structure, invalid metadata, weak AI outputs, missing citations, and unreliable publishing.

---

# 2. Definition

Content Validation is the process of checking whether a knowledge element is complete, consistent, structured, connected, safe, renderable, searchable, and trustworthy.

Validation applies to:

* Knowledge Objects
* Entities
* Relationships
* Metadata
* Knowledge Views
* Renderers
* Citations
* Media
* Translations
* Collections
* AI/GEO outputs

GeoCore MUST validate knowledge before publication.

---

# 3. Core Principle

Invalid knowledge must not become published knowledge.

A renderer may fail.

A draft may be incomplete.

A work-in-progress object may contain warnings.

But a published Knowledge Object MUST satisfy all critical validation rules.

---

# 4. Validation Philosophy

GeoCore validation is based on four levels:

```text
Informational
    ↓
Warning
    ↓
Error
    ↓
Critical
```

Each level has a different consequence.

| Level         | Meaning                    | Blocks Publication    |
| ------------- | -------------------------- | --------------------- |
| Informational | Useful note                | No                    |
| Warning       | Quality issue              | No, unless configured |
| Error         | Structural problem         | Yes                   |
| Critical      | Dangerous or invalid state | Yes                   |

---

# 5. Validation Scope

GeoCore validation MUST cover at least the following areas:

* identity validation
* metadata validation
* structure validation
* relationship validation
* entity validation
* citation validation
* language validation
* renderer validation
* AI/GEO validation
* high-trust content validation
* duplication validation
* publication readiness validation

---

# 6. Validation Pipeline

The validation pipeline follows this order:

```text
Knowledge Object
    ↓
Identity Validation
    ↓
Metadata Validation
    ↓
Body Validation
    ↓
Entity Validation
    ↓
Relationship Validation
    ↓
Citation Validation
    ↓
View Validation
    ↓
Renderer Validation
    ↓
Publication Validation
```

A later stage MUST NOT override the result of an earlier critical failure.

---

# 7. Identity Validation

Every Knowledge Object MUST have a valid identity.

Required checks:

* `id` exists
* `id` is unique
* `id` is stable
* `slug` exists
* `slug` is unique within its scope
* `title` exists
* `language` exists
* `version` exists
* `status` is valid

Invalid identity is a critical error.

Example error:

```text
CRITICAL: Knowledge Object "ko_implant_guide" has duplicate slug "implant-dentaire".
```

---

# 8. Metadata Validation

Every published Knowledge Object MUST expose valid metadata.

Required checks:

* author exists
* created date exists
* updated date exists
* language is valid
* status is valid
* canonical metadata is complete
* entities are valid
* canonical URL is valid when required
* SEO metadata is coherent
* AI/GEO metadata is coherent
* technical metadata is valid

Missing critical metadata MUST block publication.

---

# 9. Body Validation

The canonical body of a Knowledge Object MUST be valid.

Required checks:

* body exists
* body is not empty
* body matches declared language
* headings are valid
* links are valid
* media references are valid
* citations are correctly referenced
* unsupported raw HTML is rejected when configured
* unsafe content is rejected

For MDX or Markdown-based content, parsing errors MUST block publication.

---

# 10. Entity Validation

Entities referenced by a Knowledge Object MUST exist and be valid.

Required checks:

* referenced entity exists
* entity status is not invalid
* entity is not duplicated
* entity language alignment is valid
* entity type is valid
* entity definition exists
* entity domain is coherent with the Knowledge Object

Missing referenced entities MUST block publication.

Example:

```text
ERROR: Knowledge Object "ko_customer_balance_management" references unknown entity "entity_client_debt".
```

---

# 11. Relationship Validation

Relationships MUST be structured, typed, and valid.

Required checks:

* source object exists
* target object exists
* relationship type is allowed
* direction is valid
* relationship strength is valid
* parent-child cycles are rejected
* orphan published objects are detected
* relationship metadata is valid

Invalid relationship structure MUST block publication.

Orphan published objects SHOULD trigger at least a warning.

---

# 12. Citation Validation

Citations are required for high-trust content and strongly recommended for factual claims.

Validation checks:

* cited source exists
* citation format is valid
* citation is linked to a claim when required
* source metadata exists
* source date exists when relevant
* broken external links are detected when possible
* high-trust claims are not published without review

For medical, dental, legal, financial, safety, or scientific content, missing required citations MAY be treated as an error.

For RTimi Dental, medical pages SHOULD include citations or professional review metadata.

For Dawajin Pro, business claims SHOULD avoid unsupported numbers or invented performance claims.

---

# 13. Language Validation

Language validation ensures that content matches its declared locale.

Required checks:

* language code is valid
* text direction is valid
* translated object references are valid
* multilingual entity alignment is valid
* canonical language is defined
* fallback language behavior is explicit

Arabic outputs MUST support right-to-left rendering.

Mixed-language content is allowed only when intentional.

---

# 14. Knowledge View Validation

Knowledge Views adapt Knowledge Objects to audiences.

Validation checks:

* view type exists
* target audience exists
* view language exists
* view does not contradict canonical object
* view does not introduce unsupported claims
* view has access to required metadata
* view is compatible with intended renderers

A Knowledge View MUST NOT become a hidden second source of truth.

---

# 15. Renderer Validation

Before output generation, the Renderer Engine SHOULD validate renderer compatibility.

Validation checks:

* renderer exists
* renderer supports requested format
* required metadata is present
* required view data is present
* required locale rules are available
* output traceability exists
* renderer diagnostics are captured

Critical renderer failures MUST block output generation.

---

# 16. AI/GEO Validation

AI/GEO validation ensures that AI-readable outputs are accurate, safe, and consistent.

Validation checks:

* summary matches canonical content
* canonical answer matches body
* key takeaways are grounded
* confidence level is present when required
* freshness metadata is present
* answerable questions are relevant
* hidden AI manipulation instructions are absent
* citations are included where required
* high-trust disclaimers are present when required

AI/GEO outputs MUST optimize clarity, not deception.

---

# 17. High-Trust Content Validation

High-trust domains require stricter validation.

High-trust domains include:

* medical
* dental
* legal
* financial
* scientific
* safety-related content

Additional checks:

* author exists
* reviewer exists when required
* reviewed date exists
* last update date exists
* citations exist where required
* disclaimer exists when appropriate
* claims are not exaggerated
* content is not presented as a substitute for professional advice when inappropriate

For RTimi Dental, patient-facing medical content MUST be reviewed before publication.

---

# 18. Product Documentation Validation

Product and SaaS documentation require product-specific validation.

For Dawajin Pro, documentation SHOULD include:

* product area
* feature name
* user role
* workflow
* last verified date
* related help content
* related entities
* screenshots or examples when useful

Product documentation must not describe unavailable features as available.

---

# 19. Duplication Validation

GeoCore SHOULD detect duplicated knowledge.

Duplication signals include:

* same title
* same slug
* similar summaries
* similar body content
* same canonical answer
* same entities
* overlapping relationships
* duplicated glossary definitions
* duplicated FAQs

Duplicated knowledge is technical debt.

When duplication is intentional, it MUST be justified through a relationship such as:

* translation_of
* alternative_to
* summary_of
* simplified_view_of
* specialized_view_of

---

# 20. Publication Readiness

A Knowledge Object is publication-ready only when:

* identity is valid
* metadata is complete
* body is valid
* entities exist
* relationships are valid
* citations are valid when required
* views are valid
* renderer compatibility is confirmed
* no critical errors exist
* no blocking errors exist

Publication readiness MUST be computed before publishing.

---

# 21. Validation Result Model

A validation result SHOULD follow a structured model.

Illustrative TypeScript:

```ts
type ValidationSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

type ValidationIssue = {
  id: string;
  severity: ValidationSeverity;
  code: string;
  message: string;
  objectId?: string;
  field?: string;
  recommendation?: string;
};

type ValidationResult = {
  valid: boolean;
  publishable: boolean;
  issues: ValidationIssue[];
  checkedAt: string;
};
```

The final implementation may extend this model.

---

# 22. Validation Codes

GeoCore SHOULD use stable validation codes.

Examples:

```text
GC_ID_MISSING
GC_ID_DUPLICATE
GC_SLUG_DUPLICATE
GC_METADATA_MISSING_AUTHOR
GC_METADATA_MISSING_CANONICAL_URL
GC_ENTITY_UNKNOWN
GC_RELATIONSHIP_INVALID_TYPE
GC_RELATIONSHIP_PARENT_CYCLE
GC_CITATION_MISSING
GC_RENDERER_UNSUPPORTED_FORMAT
GC_AI_SUMMARY_UNGROUNDED
GC_HIGH_TRUST_REVIEW_MISSING
```

Stable codes help automation, CI checks, dashboards, and Codex-based development.

---

# 23. Validation Reports

GeoCore SHOULD generate validation reports.

Reports may include:

* object status
* blocking errors
* warnings
* recommendations
* missing metadata
* missing entities
* broken relationships
* quality score
* publishability status

Reports should be readable by humans and machines.

---

# 24. CI Validation

GeoCore SHOULD support validation in CI pipelines.

CI validation may check:

* malformed Knowledge Objects
* broken references
* invalid metadata
* duplicate slugs
* invalid entities
* invalid relationships
* renderer errors
* missing high-trust review data

CI MUST fail when critical validation errors are found.

---

# 25. Editorial Workflow

Validation supports editorial workflow.

Recommended lifecycle:

```text
Draft
    ↓
Validate
    ↓
Review
    ↓
Fix Issues
    ↓
Approve
    ↓
Publish
```

Validation should assist editors.

Validation should not replace human judgment.

---

# 26. Minimal Validation Requirements

The first implementation MUST support at least:

* required field validation
* duplicate ID validation
* duplicate slug validation
* metadata completeness validation
* entity reference validation
* relationship reference validation
* publication status validation

Advanced validation may be added later.

---

# 27. Examples

## Example — Missing Author

```text
ERROR GC_METADATA_MISSING_AUTHOR

Knowledge Object:
ko_detartrage_abime_dents

Message:
Published medical content must include an author.

Recommendation:
Add author_dr_mossaab_rtimi as the author.
```

## Example — Unknown Entity

```text
ERROR GC_ENTITY_UNKNOWN

Knowledge Object:
ko_customer_balance_management

Message:
Referenced entity "entity_client_debt" does not exist.

Recommendation:
Create the entity or replace it with "entity_customer_balance".
```

## Example — Orphan Object

```text
WARNING GC_GRAPH_ORPHAN_OBJECT

Knowledge Object:
ko_delivery_route_basics

Message:
Published object has no meaningful relationship to the Knowledge Graph.

Recommendation:
Connect it to entity_delivery_route or collection_dawajin_academy.
```

---

# 28. Anti-Patterns

The following are prohibited:

* publishing without validation
* treating validation as optional
* ignoring critical errors
* allowing renderers to bypass validation
* validating only HTML output
* validating only SEO metadata
* storing validation rules inside UI components
* allowing duplicated canonical knowledge
* using AI summaries without grounding checks
* publishing high-trust content without review metadata

---

# 29. Acceptance Criteria

This specification is considered implemented when:

* Knowledge Objects can be validated before publication;
* validation results are structured;
* critical errors block publication;
* validation covers identity, metadata, entities, relationships, and renderers;
* high-trust content has stricter validation rules;
* duplicate IDs and duplicate slugs are detected;
* unknown entity references are rejected;
* invalid relationships are rejected;
* CI can fail on critical validation errors.

---

# 30. Out of Scope

This specification does not define:

* final validation library;
* final UI for validation reports;
* final AI-based claim verification;
* final citation verification service;
* final duplicate detection algorithm;
* final quality scoring algorithm;
* final editorial approval system.

These will be defined in future specifications or implementation documents.

---

# 31. Future Evolution

Future versions may introduce:

* AI-assisted validation
* factual claim extraction
* citation-to-claim mapping
* automatic duplicate detection
* automated freshness monitoring
* trust scoring
* medical review workflows
* product documentation drift detection
* validation dashboards
* validation plugins
* domain-specific validators

---

# Final Statement

Validation protects knowledge quality.

Without validation, GeoCore becomes another content system.

With validation, GeoCore becomes a reliable Knowledge Operating System.

Invalid knowledge must not become published knowledge.

---

**End of Specification**
