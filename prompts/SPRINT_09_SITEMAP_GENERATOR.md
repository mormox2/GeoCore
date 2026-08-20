# GeoCore Sprint 9 — Sitemap Generator

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 8 implemented the LLMs.txt Generator.

This sprint must implement **Sprint 9 only**.

Do not start Sprint 10.

---

# Goal

Implement the **Sitemap XML Generator** layer.

This engine transforms public Knowledge Objects and their resolved metadata into standard XML sitemaps adhering to the Sitemaps.org protocol, with support for multiregional alternate links (`hreflang`) and image extensions.

This sprint must focus only on:

* `SitemapEntry` and `SitemapOutput` data models;
* Zod validation schemas for sitemap entries;
* XML formatting according to the XML Sitemap standard;
* `lastmod`, `changefreq`, and `priority` calculation from object freshness and metadata;
* alternate language link generation (`xhtml:link rel="alternate"`);
* image sitemap extension generation (`image:image`, `image:loc`, `image:title`);
* public/published object filtering;
* sitemap diagnostics and validation;
* sitemap fixtures;
* comprehensive unit tests.

Do not implement Route Resolver yet.

Do not implement Static Exporter disk writing yet.

Do not implement CLI yet.

---

# Existing package

Work inside:

```txt
packages/geocore
```

---

# Required file structure

Add or update:

```txt
packages/geocore/
├── src/
│   ├── sitemap/
│   │   ├── sitemap-entry.ts
│   │   ├── sitemap-xml.ts
│   │   ├── sitemap-generator.ts
│   │   ├── sitemap-filter.ts
│   │   ├── sitemap-utils.ts
│   │   ├── validate-sitemap-entry.ts
│   │   └── validate-sitemap-output.ts
│   ├── schemas/
│   │   └── sitemap-entry.schema.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       └── sitemap.fixture.ts
├── tests/
│   ├── sitemap-entry-schema.test.ts
│   ├── sitemap-xml.test.ts
│   ├── sitemap-generator.test.ts
│   ├── sitemap-filter.test.ts
│   ├── sitemap-validation.test.ts
│   └── sitemap-fixtures.test.ts
```

---

# Data Models

### 1. `SitemapEntry`

```ts
export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  alternateLinks?: Array<{
    href: string;
    hreflang: string;
  }>;
  images?: Array<{
    loc: string;
    title?: string;
    caption?: string;
  }>;
}
```

### 2. `SitemapOutput`

```ts
export interface SitemapOutput {
  xml: string;
  totalEntries: number;
  generatedAt: string;
}
```

---

# Core Functions

### 1. `generateSitemap(input: { objects: KnowledgeObject[]; metadataMap?: Map<string, ResolvedMetadata>; siteUrl?: string; media?: Media[]; language?: string }): SitemapOutput`

Builds the list of valid `SitemapEntry` items and formats them into a single valid XML string.

### 2. `formatSitemapXml(entries: SitemapEntry[]): string`

Serializes entries into an XML document with proper XML declaration and namespace headers:
`xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`
`xmlns:xhtml="http://www.w3.org/1999/xhtml"`
`xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`

### 3. `validateSitemapOutput(output: SitemapOutput): ValidationResult`

Validates that XML is well-formed, URLs use HTTPS / valid scheme, and dates comply with ISO-8601 / W3C Datetime format.

---

# Validation Rules & Diagnostics

* `GC_SITEMAP_EMPTY`: Sitemap contains zero URLs.
* `GC_SITEMAP_INVALID_URL`: URL in `<loc>` is not a valid absolute URL.
* `GC_SITEMAP_INVALID_DATE`: Invalid ISO date format in `<lastmod>`.
* `GC_SITEMAP_INVALID_PRIORITY`: Priority value outside 0.0 - 1.0.
* `GC_SITEMAP_OBJECT_URL_MISSING`: Public object cannot be resolved to a public URL.

---

# Acceptance Criteria

1. Sitemap output adheres to official XML Sitemap schemas.
2. Alternate language links and image metadata serialize correctly.
3. Private and draft objects are filtered out.
4. Validation catches malformed URLs, invalid dates, and priority range errors.
5. All sitemap test suites pass.
6. All sitemap utilities are cleanly exported in `src/index.ts`.
