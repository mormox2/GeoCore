# GeoCore Specification 0018

**Document ID:** GC-SPEC-0018
**Title:** Media Engine
**Version:** 1.0.0
**Status:** Accepted
**Depends On:** GC-SPEC-0001 — GeoCore Foundation
**Depends On:** GC-SPEC-0002 — Knowledge Object
**Depends On:** GC-SPEC-0003 — Knowledge Graph
**Depends On:** GC-SPEC-0004 — Metadata Engine
**Depends On:** GC-SPEC-0005 — Renderer Engine
**Depends On:** GC-SPEC-0007 — Content Validation
**Depends On:** GC-SPEC-0011 — Schema Engine
**Depends On:** GC-SPEC-0013 — Sitemap Engine
**Depends On:** GC-SPEC-0017 — Citation Engine
**Author:** Dr Mossaab Rtimi
**Last Updated:** 2026-06-25

---

# 1. Purpose

This specification defines the **Media Engine** of GeoCore.

The Media Engine is responsible for managing images, videos, audio files, diagrams, documents, thumbnails, transcripts, captions, alt text, and media metadata across the Knowledge Graph.

Media in GeoCore is not decorative.

Media is part of knowledge delivery.

A diagram can explain a concept.

A video can teach a workflow.

A clinical image can support patient education.

A product screenshot can clarify software documentation.

The Media Engine ensures that media assets are structured, traceable, accessible, searchable, renderable, and AI-readable.

---

# 2. Definition

A Media Asset is any non-textual or file-based resource used to support, explain, illustrate, or deliver knowledge.

Media assets may include:

* images;
* videos;
* audio files;
* diagrams;
* screenshots;
* infographics;
* PDFs;
* downloadable files;
* thumbnails;
* transcripts;
* captions;
* subtitles;
* presentation files;
* source design files;
* exported visual assets.

A Media Asset is not the source of truth unless explicitly defined as a primary knowledge artifact.

Most media assets are supporting knowledge resources linked to Knowledge Objects, Entities, Collections, Citations, or Documentation.

---

# 3. Core Principle

Media supports knowledge.

Media must be structured.

Media must be accessible.

Media must be traceable.

Media must never become an unmanaged collection of files disconnected from the Knowledge Graph.

---

# 4. Media Engine Responsibilities

The Media Engine is responsible for:

* registering media assets;
* defining media metadata;
* linking media to Knowledge Objects;
* linking media to Entities;
* linking media to Citations when needed;
* validating media references;
* generating alt text requirements;
* managing captions;
* managing transcripts;
* supporting thumbnails;
* supporting responsive images;
* supporting video metadata;
* supporting media search;
* supporting media schema output;
* supporting image and video sitemaps;
* supporting accessibility requirements;
* supporting privacy and consent rules;
* preventing broken or unsafe media output.

The Media Engine is NOT responsible for:

* replacing Knowledge Objects;
* replacing the Citation Engine;
* replacing the Renderer Engine;
* storing private patient data without rules;
* generating unsupported claims from images;
* exposing internal files publicly by accident;
* managing business files unrelated to knowledge.

---

# 5. Media Asset Types

GeoCore SHOULD support the following media asset types:

```text
image
video
audio
diagram
screenshot
infographic
pdf
document
thumbnail
transcript
subtitle
presentation
download
source-file
```

Additional media types may be introduced when needed.

---

# 6. Media Asset Identity

Every Media Asset MUST have a stable identifier.

Examples:

```text
media_implant_diagram_001
media_scaling_before_after_001
media_dawajin_dashboard_screenshot_001
media_customer_balance_video_001
media_geocore_architecture_diagram_001
```

Changing a file name or URL must not change the media identifier.

The identifier represents the media asset inside GeoCore.

---

# 7. Mandatory Media Fields

Every Media Asset MUST include:

| Field        | Required | Description                                 |
| ------------ | -------- | ------------------------------------------- |
| `id`         | Yes      | Permanent media identifier                  |
| `type`       | Yes      | Media asset type                            |
| `title`      | Yes      | Human-readable title                        |
| `status`     | Yes      | Draft, Active, Deprecated, Archived         |
| `source`     | Yes      | Source file path, URL, or storage reference |
| `visibility` | Yes      | Public, Internal, Private, Hidden           |
| `createdAt`  | Yes      | Creation date                               |
| `updatedAt`  | Yes      | Last update date                            |

Public media SHOULD include a canonical public URL.

---

# 8. Recommended Media Fields

Media assets SHOULD include:

```yaml
description:
altText:
caption:
language:
author:
creator:
owner:
license:
copyright:
credit:
fileName:
mimeType:
fileSize:
width:
height:
duration:
transcript:
thumbnail:
canonicalUrl:
relatedObjectIds:
relatedEntityIds:
citations:
consentStatus:
privacyLevel:
```

Not every field applies to every media type.

However, public media should include enough metadata to be understandable, accessible, and traceable.

---

# 9. Media Status

Media assets follow this lifecycle:

```text
Draft
  ↓
Active
  ↓
Deprecated
  ↓
Archived
```

Draft media may be used internally.

Active media may be rendered according to visibility rules.

Deprecated media should be replaced when possible.

Archived media should not be used in new public outputs.

---

# 10. Media Visibility

Every Media Asset MUST define visibility.

Recommended values:

```text
public
internal
private
hidden
```

| Visibility | Meaning                              |
| ---------- | ------------------------------------ |
| `public`   | May be rendered publicly             |
| `internal` | Internal documentation or tools only |
| `private`  | Restricted access                    |
| `hidden`   | Not rendered or indexed              |

Public renderers MUST NOT expose internal, private, or hidden media.

---

# 11. Media and Knowledge Objects

Media assets may be linked to Knowledge Objects.

Example:

```text
ko_dental_implant_guide uses_media media_implant_diagram_001
ko_customer_balance_management uses_media media_dawajin_balance_screenshot_001
```

The relationship should explain the purpose of the media asset.

Examples:

```yaml
purpose: illustrates
purpose: demonstrates
purpose: supports
purpose: explains
purpose: example
```

---

# 12. Media and Entities

Media assets may be linked to Entities.

Example:

```text
media_implant_diagram_001 illustrates entity_dental_implant
media_delivery_route_screenshot_001 illustrates entity_delivery_route
```

Entity-linked media helps:

* entity pages;
* glossary pages;
* AI context packages;
* documentation;
* Schema.org output;
* image search;
* internal linking.

---

# 13. Media and Citations

Some media assets may require citations or source attribution.

Examples:

* externally sourced diagrams;
* licensed images;
* scientific figures;
* screenshots from third-party tools;
* quoted visuals;
* adapted charts.

The Citation Engine should support media citations when needed.

Public media must respect copyright and licensing rules.

---

# 14. Alt Text

Public images SHOULD include alt text.

Alt text should describe the meaningful content of the image.

Alt text should not be keyword-stuffed.

Example good alt text:

```text
Diagram showing the position of a dental implant inside the jawbone.
```

Example bad alt text:

```text
Best dental implant dentist Tunisia Gabes cheap implant SEO.
```

Alt text is for accessibility first.

SEO benefit is secondary.

---

# 15. Captions

Media assets MAY include captions.

A caption explains why the media is shown.

Example:

```text
Example dashboard view showing customer balance tracking in Dawajin Pro.
```

Captions should be factual and must not exaggerate claims.

---

# 16. Transcripts

Videos and audio files SHOULD include transcripts when possible.

Transcripts improve:

* accessibility;
* search;
* LLM understanding;
* documentation reuse;
* video schema;
* content validation;
* multilingual translation.

For RTimi Dental educational videos, transcripts are strongly recommended.

For Dawajin Pro product demo videos, transcripts help convert videos into documentation and help center articles.

---

# 17. Subtitles

Videos MAY include subtitles.

Subtitles should be language-specific.

Recommended formats:

```text
vtt
srt
```

Subtitles must preserve meaning.

Medical and product-related subtitles should be reviewed when accuracy matters.

---

# 18. Thumbnails

Videos and documents may require thumbnails.

Thumbnail metadata SHOULD include:

```yaml
thumbnailId:
source:
altText:
width:
height:
visibility:
```

Thumbnails must not be misleading.

A video thumbnail should represent the actual content.

---

# 19. Responsive Images

The Media Engine SHOULD support responsive image variants.

Image variants may include:

```text
original
large
medium
small
thumbnail
webp
avif
```

Variants are derived assets.

They are not separate canonical media assets unless intentionally registered.

---

# 20. Media Optimization

The Media Engine SHOULD support optimization rules.

Optimization may include:

* compression;
* format conversion;
* resizing;
* lazy loading metadata;
* responsive variants;
* thumbnail generation;
* metadata stripping when required;
* file size checks.

Optimization must not degrade meaning.

For clinical images, compression must not remove medically relevant details if the image is used for clinical explanation.

---

# 21. Privacy and Consent

Media privacy is critical.

For RTimi Dental, any patient-related media MUST respect:

* consent status;
* anonymization requirements;
* privacy level;
* intended use;
* public visibility approval.

Patient-identifiable media MUST NOT be exposed publicly unless explicit consent and legal/ethical requirements are satisfied.

For Dawajin Pro, screenshots must not expose:

* real customer data;
* private phone numbers;
* financial information;
* secrets;
* API keys;
* tenant-specific private information.

---

# 22. Media and High-Trust Content

High-trust media includes:

* clinical photos;
* medical diagrams;
* diagnostic images;
* legal documents;
* financial screenshots;
* safety-related diagrams;
* product-critical screenshots.

High-trust media SHOULD include:

* author or owner;
* source;
* review status;
* consent status when applicable;
* caption;
* alt text;
* citation when required;
* last reviewed date when relevant.

---

# 23. Media and Product Documentation

For product documentation, screenshots and videos must reflect actual product behavior.

For Dawajin Pro:

* screenshots should not show unavailable features;
* payment-related screenshots must not imply production readiness unless validated;
* Konnect production payment readiness must not be implied unless the merchant account and real payments are validated;
* demo data should be clearly synthetic when necessary;
* sensitive tenant data must be removed.

---

# 24. Media and Renderer Engine

Renderers consume media.

Renderers do not own media metadata.

Examples:

The HTML Renderer may display an image with alt text and caption.

The Markdown Renderer may export an image reference.

The JSON Renderer may expose media metadata.

The Schema Engine may generate ImageObject or VideoObject schema.

The LLM Renderer may expose transcript and summary.

---

# 25. Media and Search Engine

The Search Engine SHOULD index media metadata when visibility allows.

Searchable fields may include:

* title;
* description;
* alt text;
* caption;
* transcript;
* related entities;
* related objects;
* media type;
* language;
* updated date.

Private and internal media must not appear in public search.

---

# 26. Media and Schema Engine

The Schema Engine MAY generate:

```text
ImageObject
VideoObject
AudioObject
MediaObject
CreativeWork
```

Schema output should use:

* title;
* description;
* thumbnail;
* transcript;
* duration;
* upload date;
* creator;
* copyright;
* license;
* caption;
* content URL;
* embed URL.

Schema must not expose private media.

---

# 27. Media and Sitemap Engine

The Sitemap Engine MAY generate:

* image sitemap entries;
* video sitemap entries;
* document sitemap entries when appropriate.

Only public media assets may appear in public sitemaps.

Patient-private or internal product media must never appear in public sitemaps.

---

# 28. Media and LLMs Engine

The LLMs Engine MAY expose public media resources.

For AI-readable outputs, media may include:

```yaml
title:
description:
type:
transcript:
caption:
relatedObjectIds:
relatedEntityIds:
canonicalUrl:
```

AI systems should prefer transcripts and metadata over raw media interpretation when available.

---

# 29. Media Validation

Before publication, media references MUST be validated.

Validation checks include:

* media ID exists;
* media source exists;
* media type is valid;
* visibility is valid;
* public media has public URL when required;
* image alt text exists when required;
* video transcript exists when required by policy;
* captions are valid;
* related objects exist;
* related entities exist;
* private media is not used in public output;
* patient consent exists when required;
* product screenshots do not expose secrets;
* file type is allowed;
* file size is acceptable;
* broken media links are detected.

Critical errors MUST block publication.

---

# 30. Media Diagnostics

Media diagnostics SHOULD include:

```yaml
severity:
code:
message:
mediaId:
objectId:
field:
recommendation:
```

Example diagnostic codes:

```text
GC_MEDIA_SOURCE_MISSING
GC_MEDIA_PRIVATE_PUBLIC_OUTPUT
GC_MEDIA_ALT_TEXT_MISSING
GC_MEDIA_TRANSCRIPT_MISSING
GC_MEDIA_CONSENT_REQUIRED
GC_MEDIA_SECRET_EXPOSURE_RISK
GC_MEDIA_INVALID_MIME_TYPE
GC_MEDIA_BROKEN_URL
GC_MEDIA_UNVERIFIED_PRODUCT_SCREENSHOT
GC_MEDIA_LICENSE_MISSING
```

Diagnostics must be readable by humans and machines.

---

# 31. Minimal Media Asset Model

Illustrative TypeScript model:

```ts
type MediaStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "archived";

type MediaVisibility =
  | "public"
  | "internal"
  | "private"
  | "hidden";

type MediaType =
  | "image"
  | "video"
  | "audio"
  | "diagram"
  | "screenshot"
  | "infographic"
  | "pdf"
  | "document"
  | "thumbnail"
  | "transcript"
  | "subtitle"
  | "presentation"
  | "download"
  | "source-file";

type ConsentStatus =
  | "not-required"
  | "required"
  | "granted"
  | "denied"
  | "unknown";

type MediaAsset = {
  id: string;
  type: MediaType;
  title: string;
  status: MediaStatus;
  visibility: MediaVisibility;

  source: string;
  canonicalUrl?: string;

  description?: string;
  altText?: string;
  caption?: string;
  language?: string;

  fileName?: string;
  mimeType?: string;
  fileSize?: number;

  width?: number;
  height?: number;
  duration?: number;

  thumbnailId?: string;
  transcriptId?: string;
  subtitleIds?: string[];

  author?: string;
  creator?: string;
  owner?: string;

  license?: string;
  copyright?: string;
  credit?: string;

  relatedObjectIds?: string[];
  relatedEntityIds?: string[];
  citationIds?: string[];

  consentStatus?: ConsentStatus;
  privacyLevel?: "public" | "sensitive" | "confidential";

  createdAt: string;
  updatedAt: string;
};
```

The implementation may evolve while preserving the same concepts.

---

# 32. Example — RTimi Dental Media Asset

```yaml
id: media_scaling_illustration_001
type: diagram
title: Illustration du détartrage dentaire
status: active
visibility: public
source: /assets/rtimidental/scaling-illustration.webp
canonicalUrl: https://rtimidental.tn/assets/scaling-illustration.webp
description: Illustration pédagogique montrant le retrait du tartre autour des dents.
altText: Illustration montrant le tartre autour des dents et son retrait pendant un détartrage.
caption: Le détartrage retire le tartre accumulé près des gencives.
language: fr
relatedObjectIds:
  - ko_detartrage_abime_dents
relatedEntityIds:
  - entity_scaling
  - entity_tartar
consentStatus: not-required
privacyLevel: public
createdAt: 2026-06-25
updatedAt: 2026-06-25
```

---

# 33. Example — Dawajin Pro Media Asset

```yaml
id: media_dawajin_customer_balance_screenshot_001
type: screenshot
title: Customer balance dashboard screenshot
status: active
visibility: public
source: /assets/dawajinpro/customer-balance-dashboard.webp
canonicalUrl: https://dawajinpro.tn/assets/customer-balance-dashboard.webp
description: Screenshot showing a synthetic customer balance dashboard in Dawajin Pro.
altText: Dawajin Pro dashboard showing customer balances, payments, and outstanding amounts using demo data.
caption: Example dashboard for tracking customer balances in Dawajin Pro.
language: fr
relatedObjectIds:
  - ko_customer_balance_management
relatedEntityIds:
  - entity_customer_balance
  - entity_payment
  - entity_invoice
privacyLevel: public
createdAt: 2026-06-25
updatedAt: 2026-06-25
```

---

# 34. Anti-Patterns

The following are prohibited:

* storing media without metadata;
* using public images without alt text when required;
* exposing private media publicly;
* exposing patient-identifiable media without consent;
* exposing real customer data in product screenshots;
* using misleading thumbnails;
* using videos without transcripts when transcripts are required;
* duplicating media metadata inside renderers;
* hardcoding image references inside components without Media Asset registration;
* using externally sourced media without license or citation when required;
* allowing broken media URLs in published outputs;
* treating optimized variants as separate canonical assets without reason.

---

# 35. Acceptance Criteria

This specification is considered implemented when:

* Media Assets have stable identifiers;
* media metadata can be defined;
* media can link to Knowledge Objects;
* media can link to Entities;
* public media visibility is enforced;
* private media is not exposed publicly;
* image alt text can be validated;
* video transcripts can be supported;
* media can be consumed by renderers;
* media can be indexed when public;
* media can contribute to schema and sitemap outputs;
* privacy and consent rules can block publication.

---

# 36. Out of Scope

This specification does not define:

* final media storage provider;
* final image optimization library;
* final video hosting provider;
* final asset upload UI;
* final media CDN;
* final thumbnail generation implementation;
* final transcript generation workflow;
* final consent management legal workflow;
* final visual media library interface.

These will be defined in future specifications or implementation documents.

---

# 37. Future Evolution

Future versions may introduce:

* media library UI;
* AI-assisted alt text generation;
* AI-assisted transcript generation;
* automatic screenshot redaction;
* patient consent workflow;
* media duplicate detection;
* perceptual image hashing;
* video chapter generation;
* automatic thumbnail generation;
* media usage analytics;
* media license tracking;
* CDN integration;
* responsive image build pipeline;
* media quality scoring;
* visual knowledge graph explorer.

---

# Final Statement

Media is not decoration.

Media is a knowledge carrier.

In GeoCore, every media asset must be structured, accessible, traceable, searchable, and safe to render.

A Knowledge Operating System cannot manage only text.

It must manage every form through which knowledge is delivered.

---

**End of Specification**
