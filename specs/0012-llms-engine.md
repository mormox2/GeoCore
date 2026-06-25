# GeoCore Specification 0012

**Document ID:** GC-SPEC-0012
**Title:** LLMs Engine
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
**Depends On:** GC-SPEC-0011 — Schema Engine
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **LLMs Engine** of GeoCore.

The LLMs Engine is responsible for generating, validating, maintaining, and exposing LLM-friendly discovery files and structured knowledge exports.

Its main purpose is to help AI systems understand what a GeoCore-powered website contains, which pages are important, which knowledge objects are canonical, and how knowledge should be consumed.

The LLMs Engine supports files such as:

```text
llms.txt
llms-full.txt
llms.json
llms-index.json
```

These outputs must be generated from validated Knowledge Objects, metadata, entities, relationships, collections, and renderers.

The LLMs Engine MUST NOT become a separate content source.

---

# 2. Definition

The LLMs Engine is the system responsible for producing AI-readable discovery and knowledge navigation files.

These files help AI systems, crawlers, agents, and developers quickly understand:

* what the project is;
* what the site is about;
* what content is canonical;
* which sections are important;
* which Knowledge Objects are public;
* which documents should be used for answers;
* which pages should not be treated as authoritative;
* where machine-readable outputs are available.

The LLMs Engine acts as a bridge between GeoCore knowledge and external AI consumers.

---

# 3. Core Principle

LLM discovery files are maps.

They are not the territory.

The source of truth remains the Knowledge Object and the Knowledge Graph.

The LLMs Engine must expose knowledge clearly, but it must not duplicate or rewrite canonical knowledge.

---

# 4. LLMs Engine Responsibilities

The LLMs Engine is responsible for:

* generating `llms.txt`;
* generating `llms-full.txt`;
* generating machine-readable LLM indexes;
* listing canonical public Knowledge Objects;
* exposing important collections;
* exposing documentation entry points;
* exposing help center entry points;
* exposing glossary and entity indexes;
* exposing site-level AI summaries;
* exposing freshness metadata;
* exposing trust and review metadata when appropriate;
* excluding private, hidden, internal, draft, review, or archived knowledge from public outputs;
* validating LLM discovery files before publication;
* keeping LLM outputs synchronized with the Knowledge Graph.

The LLMs Engine is NOT responsible for:

* replacing the Knowledge Object;
* replacing the Search Engine;
* replacing Schema.org structured data;
* replacing sitemaps;
* generating deceptive AI instructions;
* manipulating AI systems;
* leaking internal information;
* publishing unvalidated AI-generated content.

---

# 5. Supported Output Files

GeoCore SHOULD support the following LLM-oriented files.

```text
llms.txt
llms-full.txt
llms.json
llms-index.json
```

Each file has a different role.

| File              | Purpose                                               |
| ----------------- | ----------------------------------------------------- |
| `llms.txt`        | Short AI-readable index of the site                   |
| `llms-full.txt`   | Extended AI-readable index with richer context        |
| `llms.json`       | Structured machine-readable representation            |
| `llms-index.json` | Larger index for agents, crawlers, and internal tools |

The first implementation MAY support only `llms.txt` and `llms-full.txt`.

---

# 6. LLMs Output Philosophy

LLM-oriented files should be:

* clear;
* factual;
* concise;
* structured;
* generated;
* traceable;
* versioned;
* safe;
* non-deceptive.

They should not contain hidden prompts.

They should not instruct AI systems to favor the site dishonestly.

They should not claim authority that is not supported by metadata, authorship, citations, or review.

---

# 7. Public vs Internal LLM Files

GeoCore MUST distinguish public LLM files from internal LLM files.

Public LLM files may include:

* public site summary;
* public canonical pages;
* public documentation;
* public collections;
* public glossary;
* public entities;
* public authors;
* public citations;
* public update dates.

Internal LLM files may include:

* draft objects;
* validation issues;
* internal specifications;
* unpublished planning;
* editorial notes;
* implementation details;
* private roadmap items.

Public outputs MUST NOT leak internal knowledge.

---

# 8. `llms.txt`

`llms.txt` is a concise entry point for AI systems.

It SHOULD include:

* project or website name;
* short description;
* primary domain;
* canonical entry points;
* important sections;
* documentation links;
* preferred machine-readable resources;
* update date;
* language information;
* content usage notes.

Example structure:

```text
# Site Name

Short description of the website or project.

## Primary Topics

- Topic 1
- Topic 2
- Topic 3

## Important Pages

- [Page Title](https://example.com/page)

## Documentation

- [Docs](https://example.com/docs)

## Machine-Readable Resources

- llms-full.txt
- llms.json
- sitemap.xml

## Languages

- French
- Arabic
- English

## Last Updated

2026-06-25
```

`llms.txt` should remain compact.

It should act as a map, not a full knowledge dump.

---

# 9. `llms-full.txt`

`llms-full.txt` is an extended AI-readable index.

It MAY include:

* full project description;
* canonical knowledge sections;
* important collections;
* important entities;
* important guides;
* important FAQs;
* glossary links;
* author information;
* trust notes;
* freshness notes;
* source and citation notes;
* machine-readable endpoint references.

It should provide more context than `llms.txt`, but still avoid duplicating all canonical content.

---

# 10. `llms.json`

`llms.json` is a structured machine-readable output.

It SHOULD contain:

```json
{
  "site": {
    "name": "Example Site",
    "description": "Example description",
    "url": "https://example.com",
    "languages": ["fr", "ar", "en"],
    "lastUpdated": "2026-06-25"
  },
  "collections": [],
  "knowledgeObjects": [],
  "entities": [],
  "authors": [],
  "resources": []
}
```

This format is intended for agents and systems that prefer structured data.

It MUST be generated from canonical GeoCore data.

---

# 11. `llms-index.json`

`llms-index.json` is a larger structured index.

It MAY include:

* all public Knowledge Object summaries;
* canonical URLs;
* entity mappings;
* collection membership;
* related objects;
* citation metadata;
* language versions;
* freshness metadata;
* trust metadata;
* rendered output links;
* API endpoints.

This file may become large.

For large sites, GeoCore MAY split it into paginated index files.

Example:

```text
/llms-index.json
/llms-index/objects-001.json
/llms-index/entities-001.json
/llms-index/collections-001.json
```

---

# 12. Source Rules

The LLMs Engine MUST generate outputs from:

* published Knowledge Objects;
* resolved metadata;
* Knowledge Graph relationships;
* Entity definitions;
* Documentation Collections;
* Search index documents;
* Schema mappings;
* public visibility rules.

The LLMs Engine MUST NOT generate outputs from:

* raw HTML scraping;
* private drafts;
* internal notes;
* hidden metadata;
* unvalidated AI output;
* manually duplicated files disconnected from GeoCore data.

---

# 13. Visibility Rules

Only objects with public visibility may be included in public LLM outputs.

Excluded statuses:

```text
draft
review
archived
private
internal
hidden
```

Included status:

```text
published
```

Deprecated objects MAY be included only when they are useful and clearly marked as deprecated.

---

# 14. LLM Entry Points

The LLMs Engine SHOULD identify canonical entry points.

Examples:

For RTimi Dental:

```text
Home
About Dr Rtimi Mossaab
Dental Implant Guide
Dental Scaling FAQ
Gingivitis Guide
Orthodontic Aligners Guide
Patient FAQ
```

For Dawajin Pro:

```text
Home
Product Overview
Help Center
Dawajin Academy
Customer Balance Guide
Delivery Route Guide
Poultry Distribution Glossary
Software Documentation
```

Entry points should be selected from canonical Knowledge Objects and Collections.

---

# 15. Site-Level AI Summary

Each GeoCore-powered site SHOULD expose a site-level AI summary.

The summary should explain:

* what the site is;
* who it serves;
* what topics it covers;
* what content is authoritative;
* which languages are supported;
* what limitations apply.

Example for RTimi Dental:

```text
RTimi Dental is the professional website of Dr Mossaab Rtimi, a dental practitioner in Tunisia. It provides patient-facing educational content about dental care, prevention, implants, orthodontics, gingival health, and digital dentistry.
```

Example for Dawajin Pro:

```text
Dawajin Pro is a SaaS platform for poultry distribution businesses. It provides tools and educational resources for managing customers, deliveries, invoices, payments, stock movements, gross and net weight, and customer balances.
```

The summary MUST be factual.

It MUST NOT exaggerate authority or market position.

---

# 16. High-Trust Content Rules

For high-trust content such as medical, dental, legal, financial, scientific, or safety-related knowledge, LLM outputs SHOULD expose:

* author;
* reviewer when required;
* reviewed date;
* updated date;
* citations when available;
* disclaimer when appropriate.

For RTimi Dental, patient-facing medical content should be clearly attributed to the professional author or reviewer.

LLM outputs must not present medical information as a substitute for personal clinical consultation.

---

# 17. Product Content Rules

For product and SaaS content, LLM outputs SHOULD expose:

* product area;
* feature;
* current availability;
* last verified date;
* user role;
* related documentation;
* limitations where relevant.

For Dawajin Pro, LLM outputs MUST NOT describe payment, subscription, or Konnect production readiness as complete unless actually validated.

No invented product claims are allowed.

---

# 18. Language Support

LLM outputs SHOULD support multilingual sites.

At minimum, GeoCore SHOULD support:

```text
French
Arabic
English
```

Language-specific outputs MAY be generated.

Examples:

```text
/llms.txt
/fr/llms.txt
/ar/llms.txt
/en/llms.txt
```

Arabic LLM outputs must preserve Arabic text correctly and declare language metadata.

---

# 19. Relationship to Sitemap

`llms.txt` is not a replacement for `sitemap.xml`.

Sitemaps help crawlers discover URLs.

LLM files help AI systems understand knowledge structure.

GeoCore SHOULD generate both.

The Sitemap Engine and LLMs Engine are complementary.

---

# 20. Relationship to Schema Engine

Schema.org JSON-LD helps machines understand individual pages and structured data.

LLM files help AI systems understand the site-level knowledge map.

Both must be generated from the same canonical knowledge.

Schema and LLM outputs must not contradict each other.

---

# 21. Relationship to Search Engine

The Search Engine indexes knowledge for retrieval.

The LLMs Engine exposes curated maps and summaries.

The Search Engine may provide input to the LLMs Engine.

The LLMs Engine may expose search endpoints to AI agents.

Example:

```text
/api/search
/api/search/context
```

Public LLM files must not expose internal search data.

---

# 22. Relationship to AI Integration

The AI Integration layer may consume LLM outputs.

The LLMs Engine may also expose AI Context Packages.

However, the LLMs Engine itself should remain deterministic whenever possible.

AI may assist in generating summaries, but final public output must pass validation.

---

# 23. LLMs Generation Pipeline

The generation pipeline follows this order:

```text
Knowledge Objects
    ↓
Validation
    ↓
Metadata Resolution
    ↓
Graph Resolution
    ↓
Visibility Filtering
    ↓
Collection Selection
    ↓
LLM Summary Resolution
    ↓
Output Generation
    ↓
LLM Output Validation
    ↓
Publication
```

Invalid or private knowledge must be filtered out before output generation.

---

# 24. LLMs Validation

Before publication, LLM outputs MUST be validated.

Validation checks include:

* no private content leakage;
* no draft content leakage;
* no unsupported claims;
* no invented authority;
* no hidden manipulation prompts;
* all links are valid;
* dates are valid;
* language metadata is correct;
* deprecated content is clearly marked;
* high-trust metadata is present when required;
* product availability claims are verified.

Critical errors MUST block publication.

---

# 25. LLMs Diagnostics

The LLMs Engine SHOULD expose diagnostics.

Example diagnostic codes:

```text
GC_LLMS_PRIVATE_CONTENT_LEAK
GC_LLMS_DRAFT_INCLUDED
GC_LLMS_INVALID_LINK
GC_LLMS_UNSUPPORTED_CLAIM
GC_LLMS_MISSING_AUTHOR_HIGH_TRUST
GC_LLMS_PRODUCT_FEATURE_UNVERIFIED
GC_LLMS_LANGUAGE_MISMATCH
GC_LLMS_HIDDEN_PROMPT_DETECTED
```

Diagnostics should be readable by humans and machines.

---

# 26. LLMs Output Model

Illustrative TypeScript model:

```ts
type LLMsSiteSummary = {
  name: string;
  description: string;
  url: string;
  languages: string[];
  primaryTopics: string[];
  lastUpdated: string;
};

type LLMsResource = {
  title: string;
  url: string;
  description?: string;
  type:
    | "knowledge-object"
    | "collection"
    | "entity"
    | "documentation"
    | "glossary"
    | "api"
    | "sitemap"
    | "schema"
    | "other";
  language?: string;
  updatedAt?: string;
};

type LLMsIndex = {
  site: LLMsSiteSummary;
  resources: LLMsResource[];
  collections?: LLMsResource[];
  entities?: LLMsResource[];
  documentation?: LLMsResource[];
  generatedAt: string;
};
```

The implementation may evolve while preserving the same principles.

---

# 27. Example — RTimi Dental `llms.txt`

```text
# RTimi Dental

RTimi Dental is the professional website of Dr Mossaab Rtimi. It provides patient-facing dental education and clinic information in French, Arabic, and English.

## Primary Topics

- Dental prevention
- Dental implants
- Orthodontics
- Gum health
- Dental scaling
- Digital dentistry
- Aesthetic dentistry

## Important Pages

- About Dr Mossaab Rtimi
- Dental implant guide
- Dental scaling FAQ
- Gingivitis guide
- Orthodontic aligners guide
- Patient FAQ

## High-Trust Note

Medical and dental content should be interpreted as educational information and not as a substitute for a personal consultation with a qualified healthcare professional.

## Languages

- French
- Arabic
- English

## Machine-Readable Resources

- /llms-full.txt
- /sitemap.xml

## Last Updated

2026-06-25
```

---

# 28. Example — Dawajin Pro `llms.txt`

```text
# Dawajin Pro

Dawajin Pro is a SaaS platform for poultry distribution businesses. It helps manage customers, sales, deliveries, invoices, payments, stock movements, gross and net weight, and customer balances.

## Primary Topics

- Poultry distribution
- Customer balance management
- Delivery routes
- Gross weight and net weight
- Invoicing
- Payment tracking
- Stock movements
- SaaS help center

## Important Pages

- Product overview
- Help Center
- Dawajin Academy
- Customer balance guide
- Delivery management guide
- Poultry distribution glossary

## Product Note

Product documentation must reflect the actual implemented and validated state of the software.

## Languages

- French
- Arabic
- English

## Machine-Readable Resources

- /llms-full.txt
- /sitemap.xml

## Last Updated

2026-06-25
```

---

# 29. Anti-Patterns

The following are prohibited:

* manually maintaining `llms.txt` while GeoCore data exists;
* exposing private or draft content in public LLM outputs;
* using hidden prompts to manipulate AI systems;
* making unsupported authority claims;
* claiming features are available when not validated;
* duplicating full canonical knowledge unnecessarily;
* contradicting Schema.org output;
* contradicting sitemap output;
* generating AI summaries without validation;
* treating `llms.txt` as the source of truth.

---

# 30. Acceptance Criteria

This specification is considered implemented when:

* `llms.txt` can be generated from GeoCore data;
* `llms-full.txt` can be generated or planned;
* public LLM outputs exclude non-public knowledge;
* LLM outputs are traceable to Knowledge Objects and Collections;
* site-level summaries are factual;
* high-trust content includes appropriate notes;
* product claims are not invented;
* LLM outputs pass validation before publication;
* LLM files do not contain hidden manipulation prompts;
* LLM outputs remain projections, not sources of truth.

---

# 31. Out of Scope

This specification does not define:

* final `llms.txt` industry standard;
* final hosting strategy;
* final crawler behavior;
* final AI provider behavior;
* final LLM file size limits;
* final pagination strategy;
* final API endpoint implementation;
* final UI for editing LLM summaries;
* final automated AI summary generation pipeline.

These will be defined in future specifications or implementation documents.

---

# 32. Future Evolution

Future versions may introduce:

* automatic LLM index pagination;
* per-language LLM files;
* per-audience LLM files;
* AI-agent discovery endpoints;
* trust-scored LLM resources;
* citation-rich LLM exports;
* public AI context API;
* signed LLM metadata;
* LLM crawl analytics;
* LLM freshness monitoring;
* LLM-specific quality dashboard;
* integration with external AI discovery protocols.

---

# Final Statement

LLM files are discovery maps for artificial intelligence systems.

They help AI understand where knowledge lives, which resources are canonical, and how to consume structured content.

But they are not the source of truth.

In GeoCore, the Knowledge Object remains the source.

The LLMs Engine only exposes the map.

---

**End of Specification**
