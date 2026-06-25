# GeoCore Specification 0013

**Document ID:** GC-SPEC-0013
**Title:** Sitemap Engine
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
**Depends On:** GC-SPEC-0012 — LLMs Engine
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Sitemap Engine** of GeoCore.

The Sitemap Engine is responsible for generating, validating, maintaining, and exposing sitemap files from validated Knowledge Objects, metadata, renderers, collections, media assets, and public URLs.

Sitemaps help search engines, crawlers, and external systems discover public content.

The Sitemap Engine MUST generate sitemap files from canonical GeoCore knowledge and routing metadata.

It MUST NOT become a manually maintained parallel index.

---

# 2. Definition

A sitemap is a structured discovery file that lists public URLs and optional metadata about those URLs.

The Sitemap Engine generates sitemap outputs such as:

```text
sitemap.xml
sitemap-index.xml
sitemap-pages.xml
sitemap-articles.xml
sitemap-docs.xml
sitemap-faq.xml
sitemap-glossary.xml
sitemap-images.xml
sitemap-videos.xml
```

These files are derived outputs.

They are not the source of truth.

---

# 3. Core Principle

Sitemaps discover rendered public outputs.

They do not define knowledge.

Knowledge Objects define knowledge.

Renderers produce URLs.

The Sitemap Engine exposes those URLs.

---

# 4. Sitemap Engine Responsibilities

The Sitemap Engine is responsible for:

* generating sitemap files;
* generating sitemap index files;
* including only public and valid outputs;
* excluding drafts, private objects, internal objects, hidden objects, and archived objects;
* resolving canonical URLs;
* including last modification dates;
* supporting multilingual URLs;
* supporting image sitemaps;
* supporting video sitemaps;
* supporting documentation sitemaps;
* supporting FAQ and glossary sitemaps;
* validating sitemap output;
* detecting stale or broken sitemap entries;
* exposing sitemap diagnostics.

The Sitemap Engine is NOT responsible for:

* creating Knowledge Objects;
* deciding editorial truth;
* replacing the Metadata Engine;
* replacing the Renderer Engine;
* replacing the LLMs Engine;
* replacing the Search Engine;
* manually ranking pages;
* exposing private or internal knowledge.

---

# 5. Sitemap Generation Pipeline

The sitemap generation pipeline follows this order:

```text
Knowledge Objects
    ↓
Content Validation
    ↓
Metadata Resolution
    ↓
Visibility Filtering
    ↓
Renderer URL Resolution
    ↓
Sitemap Entry Generation
    ↓
Sitemap Validation
    ↓
Sitemap Output
```

Only valid, public, renderable outputs may appear in public sitemap files.

---

# 6. Public Visibility Rules

A Knowledge Object or rendered output may be included in a public sitemap only when all conditions are true:

* status is `published`;
* visibility is `public`;
* validation passes;
* canonical URL exists;
* output is renderable;
* no blocking metadata error exists;
* no access restriction applies.

Excluded statuses include:

```text
draft
review
archived
deprecated-private
private
internal
hidden
```

Deprecated public pages MAY appear only when intentionally preserved and clearly marked.

---

# 7. Canonical URL Requirement

Every sitemap entry MUST have a valid canonical URL.

The canonical URL must be resolved from:

1. explicit Knowledge Object metadata;
2. renderer routing configuration;
3. collection routing rules;
4. project-level URL configuration.

The Sitemap Engine MUST NOT invent URLs that are not renderable.

---

# 8. Sitemap Entry Model

A sitemap entry SHOULD include:

```yaml
url:
lastModified:
changeFrequency:
priority:
language:
alternateLanguages:
objectId:
objectVersion:
renderer:
type:
```

Only fields supported by sitemap standards should appear in XML output.

Internal traceability fields may be used for diagnostics but must not appear in public XML unless appropriate.

---

# 9. XML Sitemap Output

The Sitemap Engine SHOULD generate standard XML sitemap output.

Example:

```xml
<url>
  <loc>https://example.com/guides/dental-implant</loc>
  <lastmod>2026-06-25</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

XML output must be valid and escape special characters correctly.

---

# 10. Sitemap Index

Large projects SHOULD use a sitemap index.

Example:

```xml
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
    <lastmod>2026-06-25</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-docs.xml</loc>
    <lastmod>2026-06-25</lastmod>
  </sitemap>
</sitemapindex>
```

The sitemap index should reference all generated public sitemap files.

---

# 11. Sitemap Types

GeoCore SHOULD support multiple sitemap types.

## Page Sitemap

For general public pages.

```text
sitemap-pages.xml
```

## Article Sitemap

For article-like Knowledge Objects.

```text
sitemap-articles.xml
```

## Documentation Sitemap

For documentation, specifications, help centers, and guides.

```text
sitemap-docs.xml
```

## FAQ Sitemap

For FAQ-oriented public outputs.

```text
sitemap-faq.xml
```

## Glossary Sitemap

For entity and glossary pages.

```text
sitemap-glossary.xml
```

## Image Sitemap

For public image assets.

```text
sitemap-images.xml
```

## Video Sitemap

For public video assets.

```text
sitemap-videos.xml
```

---

# 12. Multilingual Sitemap Rules

GeoCore MUST support multilingual sitemap generation.

For multilingual pages, sitemap entries SHOULD include alternate language references when supported.

Example concept:

```text
/fr/implant-dentaire
/ar/ziraat-al-asnan
/en/dental-implant
```

Each language version must:

* have a valid canonical URL;
* reference the same conceptual Knowledge Object or translation relationship;
* preserve language metadata;
* avoid duplicate canonical conflicts.

Arabic URLs may use transliterated slugs or encoded Arabic slugs depending on project routing rules.

---

# 13. Last Modified Date

The `lastModified` value SHOULD be derived from the Knowledge Object `updatedAt` value or the rendered output update timestamp.

Priority order:

1. Knowledge Object `updatedAt`;
2. Knowledge View `updatedAt`;
3. renderer output `generatedAt`;
4. collection `updatedAt`;
5. fallback project build timestamp.

The Sitemap Engine MUST NOT use fake update dates to manipulate crawlers.

---

# 14. Change Frequency

`changeFrequency` is optional.

When used, it SHOULD be derived from freshness metadata.

Recommended mapping:

| Freshness Metadata | Sitemap Change Frequency |
| ------------------ | ------------------------ |
| `stable`           | yearly                   |
| `periodic`         | monthly                  |
| `frequent`         | weekly                   |
| `live`             | daily                    |

Change frequency should be realistic.

---

# 15. Priority

`priority` is optional.

When used, it SHOULD be derived from structured importance signals such as:

* homepage;
* canonical collection page;
* pillar guide;
* important entity page;
* high-value documentation entry point;
* business-critical product page;
* primary FAQ page.

Priority MUST NOT be used as a deceptive ranking trick.

Recommended default values:

```yaml
homepage: 1.0
main_collection: 0.9
pillar_guide: 0.8
standard_page: 0.6
supporting_page: 0.5
archive_page: 0.3
```

---

# 16. Image Sitemap

The Sitemap Engine MAY generate image sitemap entries for public images.

Image metadata SHOULD come from the Media Engine or Knowledge Object metadata.

Recommended data:

```yaml
imageUrl:
caption:
title:
license:
geoLocation:
sourceObjectId:
```

Images without public URLs should not appear in public image sitemaps.

For RTimi Dental, clinical or patient-related images must respect privacy and consent rules before being exposed.

---

# 17. Video Sitemap

The Sitemap Engine MAY generate video sitemap entries for public videos.

Recommended data:

```yaml
title:
description:
thumbnailUrl:
contentUrl:
embedUrl:
duration:
uploadDate:
transcriptUrl:
sourceObjectId:
```

For RTimi Dental, educational videos may be included when metadata and public URLs are available.

For Dawajin Pro, product demo videos may be included when they reflect actual product behavior.

---

# 18. Documentation Sitemap

Documentation sitemaps SHOULD include public documentation outputs such as:

* handbook pages;
* specifications;
* guides;
* API references;
* help center pages;
* playbooks;
* tutorials.

Internal documentation MUST NOT appear in public sitemaps.

---

# 19. FAQ Sitemap

FAQ sitemaps SHOULD include public FAQ pages or FAQ Knowledge Views.

FAQ pages should also be connected to the Schema Engine when appropriate.

The Sitemap Engine must not include hidden FAQ outputs.

---

# 20. Glossary and Entity Sitemap

Entity and glossary pages MAY be included in a dedicated sitemap.

Examples:

```text
/glossary/dental-implant
/glossary/customer-balance
/entities/prf
/entities/gross-weight
```

Only published and public entity pages should appear.

---

# 21. Relationship to Robots.txt

The Sitemap Engine SHOULD coordinate with `robots.txt`.

The project may expose:

```text
Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemap-index.xml
```

Robots rules and sitemap entries must not contradict each other.

A URL blocked by robots should not usually appear in a public sitemap.

---

# 22. Relationship to LLMs Engine

The Sitemap Engine and LLMs Engine are complementary.

Sitemaps help crawlers discover URLs.

LLM files help AI systems understand site knowledge structure.

Both must be generated from the same canonical knowledge and visibility rules.

They must not contradict each other.

---

# 23. Relationship to Schema Engine

Schema output describes page meaning.

Sitemap output lists page URLs.

Both should use the same canonical URLs.

If the Schema Engine generates `mainEntityOfPage`, that URL should match the sitemap entry where applicable.

---

# 24. Relationship to Search Engine

The Search Engine indexes Knowledge Objects and public outputs.

The Sitemap Engine lists public URLs.

The Search Engine may help identify stale sitemap entries.

The Sitemap Engine may help identify URLs that are public but not searchable.

---

# 25. Sitemap Validation

Before publication, sitemap files MUST be validated.

Validation checks include:

* valid XML;
* valid URLs;
* no duplicate URLs;
* no private URLs;
* no draft URLs;
* no internal URLs;
* no hidden URLs;
* valid last modification dates;
* valid alternate language links;
* valid sitemap size constraints;
* no broken canonical references;
* no contradiction with robots rules;
* no unsupported media references.

Critical errors MUST block sitemap publication.

---

# 26. Sitemap Size Rules

The Sitemap Engine SHOULD support splitting sitemaps when size limits are reached.

Common limits include:

* maximum number of URLs per sitemap;
* maximum file size per sitemap.

GeoCore should be designed to support large projects from the beginning, even if initial projects are small.

---

# 27. Sitemap Diagnostics

Sitemap diagnostics SHOULD include:

```yaml
severity:
code:
message:
url:
objectId:
recommendation:
```

Example diagnostic codes:

```text
GC_SITEMAP_DUPLICATE_URL
GC_SITEMAP_PRIVATE_URL_INCLUDED
GC_SITEMAP_DRAFT_INCLUDED
GC_SITEMAP_INVALID_LASTMOD
GC_SITEMAP_MISSING_CANONICAL_URL
GC_SITEMAP_ROBOTS_CONFLICT
GC_SITEMAP_INVALID_ALTERNATE_LANGUAGE
GC_SITEMAP_MEDIA_URL_INVALID
```

Diagnostics must be readable by humans and machines.

---

# 28. Minimal Sitemap Entry Model

Illustrative TypeScript model:

```ts
type SitemapChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency?: SitemapChangeFrequency;
  priority?: number;

  language?: string;
  alternateLanguages?: Record<string, string>;

  objectId: string;
  objectVersion: string;
  renderer: string;
  type:
    | "page"
    | "article"
    | "documentation"
    | "faq"
    | "glossary"
    | "entity"
    | "image"
    | "video"
    | "collection";
};
```

The implementation may evolve while preserving the same concepts.

---

# 29. Example — RTimi Dental Sitemap Entries

```yaml
- url: https://rtimidental.tn/fr/faq/detartrage-abime-t-il-les-dents
  lastModified: 2026-06-25
  changeFrequency: monthly
  priority: 0.8
  language: fr
  objectId: ko_detartrage_abime_dents
  type: faq

- url: https://rtimidental.tn/fr/guides/implant-dentaire
  lastModified: 2026-06-25
  changeFrequency: monthly
  priority: 0.9
  language: fr
  objectId: ko_dental_implant_guide
  type: article
```

---

# 30. Example — Dawajin Pro Sitemap Entries

```yaml
- url: https://dawajinpro.tn/fr/help/gestion-creances-clients
  lastModified: 2026-06-25
  changeFrequency: monthly
  priority: 0.8
  language: fr
  objectId: ko_customer_balance_management
  type: documentation

- url: https://dawajinpro.tn/fr/glossaire/poids-net
  lastModified: 2026-06-25
  changeFrequency: yearly
  priority: 0.6
  language: fr
  objectId: entity_net_weight
  type: glossary
```

---

# 31. Anti-Patterns

The following are prohibited:

* manually maintaining sitemap entries while GeoCore data exists;
* including draft URLs in public sitemaps;
* including private URLs in public sitemaps;
* including hidden URLs in public sitemaps;
* using fake last modified dates;
* listing non-renderable URLs;
* creating duplicate canonical URLs;
* contradicting robots.txt;
* exposing internal documentation;
* exposing patient-private media;
* exposing unverified product pages;
* treating sitemap files as the source of truth.

---

# 32. Acceptance Criteria

This specification is considered implemented when:

* sitemap entries can be generated from public renderable Knowledge Objects;
* sitemap XML can be generated;
* sitemap entries include canonical URLs;
* invalid or private objects are excluded;
* duplicate URLs are detected;
* sitemap diagnostics exist;
* multilingual URLs are supported or planned;
* image and video sitemap support is planned;
* sitemap files do not contradict robots rules;
* sitemap output remains a projection, not a source of truth.

---

# 33. Out of Scope

This specification does not define:

* final sitemap library;
* final Next.js integration;
* final routing implementation;
* final robots.txt generator;
* final media engine;
* final sitemap hosting strategy;
* final sitemap submission workflow;
* final crawler analytics dashboard.

These will be defined in future specifications or implementation documents.

---

# 34. Future Evolution

Future versions may introduce:

* automatic robots.txt generation;
* per-language sitemap indexes;
* per-domain sitemap generation;
* sitemap freshness monitoring;
* sitemap submission automation;
* sitemap crawl diagnostics;
* media sitemap enrichment;
* sitemap diffing;
* sitemap quality dashboard;
* search console integration;
* crawler behavior analytics;
* AI crawler discovery optimization.

---

# Final Statement

Sitemaps help the world discover public knowledge outputs.

They do not define knowledge.

In GeoCore, sitemaps are generated from validated Knowledge Objects, metadata, renderers, and public visibility rules.

A sitemap is a discovery layer.

The Knowledge Object remains the source of truth.

---

**End of Specification**
