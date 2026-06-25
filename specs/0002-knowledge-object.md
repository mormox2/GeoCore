# GeoCore Specification 0002

**Document ID:** GC-SPEC-0002

**Title:** Knowledge Object

**Version:** 1.0.0

**Status:** Accepted

**Depends On:** GC-SPEC-0001 – GeoCore Foundation

---

# 1. Purpose

This specification defines the fundamental building block of GeoCore.

Every piece of knowledge managed by GeoCore MUST be represented as a **Knowledge Object**.

Articles, guides, FAQs, glossary entries, documentation pages, videos, tutorials, API documentation and future knowledge formats are **not** primary objects.

They are different representations of the same underlying Knowledge Object.

---

# 2. Definition

A Knowledge Object is the canonical representation of a unit of knowledge.

It is the smallest autonomous element that can:

* exist independently
* evolve independently
* be versioned
* be validated
* be linked
* be searched
* be rendered
* be translated
* be consumed by humans and machines

Knowledge Objects are immutable in identity but mutable in content.

---

# 3. Core Principle

One Knowledge.

Multiple Views.

Multiple Renderers.

Multiple Outputs.

Never multiple sources.

---

# 4. Conceptual Architecture

```text
                 Knowledge Object
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
Knowledge View    Knowledge View    Knowledge View
(Patient)         (Developer)       (AI)

        │               │               │
        └───────────────┼───────────────┘
                        ▼
                  Renderer Engine
                        │
        ┌───────────────┼────────────────────┐
        ▼               ▼                    ▼
      HTML          Markdown             JSON-LD
        ▼               ▼                    ▼
     Website       Documentation        AI Systems
```

---

# 5. Identity

Every Knowledge Object MUST have a globally unique identifier.

The identifier never changes.

Example

```text
ko_dental_implant

ko_customer_balance

ko_prf

ko_driver_route
```

Changing the title must never change the identity.

---

# 6. Mandatory Properties

Every Knowledge Object MUST contain at least the following fields.

| Field     | Required | Description                           |
| --------- | -------- | ------------------------------------- |
| id        | Yes      | Permanent unique identifier           |
| slug      | Yes      | Human-readable identifier             |
| title     | Yes      | Canonical title                       |
| summary   | Yes      | Short description                     |
| body      | Yes      | Canonical knowledge                   |
| language  | Yes      | Primary language                      |
| status    | Yes      | Draft / Review / Published / Archived |
| version   | Yes      | Semantic version                      |
| createdAt | Yes      | Creation date                         |
| updatedAt | Yes      | Last modification                     |
| author    | Yes      | Knowledge owner                       |

---

# 7. Optional Properties

Knowledge Objects may contain:

* aliases
* tags
* categories
* media
* citations
* attachments
* glossary references
* external resources
* translations
* related objects

Optional properties MUST NOT change the identity.

---

# 8. Knowledge Views

A Knowledge Object never renders itself directly.

It first produces one or more Knowledge Views.

A Knowledge View adapts knowledge to a particular audience.

Examples

Patient View

Developer View

Student View

Administrator View

Operator View

LLM View

API View

SEO View

The knowledge remains identical.

Only the presentation changes.

---

# 9. Renderers

A renderer transforms a Knowledge View into a deliverable.

Supported renderers include:

* HTML
* Markdown
* PDF
* JSON
* JSON-LD
* RSS
* XML
* Voice
* LLM Prompt
* API Response

New renderers may be added without modifying the Knowledge Object.

---

# 10. Relationships

Knowledge Objects may reference other Knowledge Objects.

Relationships are first-class citizens.

Supported relationships include:

* parent
* child
* prerequisite
* related
* alternative
* citation
* glossary
* example
* dependency

Relationships form the Knowledge Graph.

---

# 11. Lifecycle

Every Knowledge Object follows a lifecycle.

```text
Draft
   │
Review
   │
Approved
   │
Published
   │
Updated
   │
Archived
```

Objects must never bypass Review before first publication.

---

# 12. Versioning

Knowledge Objects follow Semantic Versioning.

Examples

1.0.0

1.1.0

2.0.0

Version history must be preserved.

No renderer owns versioning.

The Knowledge Object owns versioning.

---

# 13. Validation Rules

Before publication every object MUST pass validation.

Validation includes:

* required fields
* metadata
* links
* references
* schema integrity
* language
* duplicated knowledge detection

Objects failing validation MUST NOT be published.

---

# 14. Searchability

Knowledge Objects must be searchable independently of their renderers.

Search indexes must never index HTML only.

Search indexes should index the canonical object.

---

# 15. AI Compatibility

Knowledge Objects are designed for AI consumption.

Every object should expose:

* structured metadata
* concise summary
* canonical definition
* relationships
* citations
* machine-readable output

LLMs should consume the object rather than scraping rendered HTML whenever possible.

---

# 16. Renderer Independence

The following rule is absolute.

Renderers are disposable.

Knowledge is not.

Replacing HTML with another technology must never require rewriting knowledge.

---

# 17. Anti-Patterns

The following are prohibited.

❌ HTML as source of truth

❌ Duplicate articles

❌ Renderer-specific business logic

❌ Copy/paste knowledge

❌ Hardcoded metadata

❌ Manual schema generation

❌ Multiple canonical versions

---

# 18. Acceptance Criteria

This specification is considered implemented when:

* every content element is represented by a Knowledge Object;
* no renderer stores canonical knowledge;
* all renderers consume the same object;
* versioning belongs to the object;
* relationships are preserved independently of outputs.

---

# 19. Future Evolution

Future specifications will extend the Knowledge Object with:

* Entity Graph
* Knowledge Collections
* AI Enrichment
* Embeddings
* Knowledge Quality Score
* Trust Score
* Source Verification
* Collaborative Editing

These extensions must remain backward compatible.

---

# Final Statement

A website is not the product.

An article is not the product.

A PDF is not the product.

The Knowledge Object is the product.

Everything else is merely a projection of that knowledge.

---

**End of Specification**
