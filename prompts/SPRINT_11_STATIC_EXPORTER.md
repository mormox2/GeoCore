# GeoCore Sprint 11 — Static Exporter

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 10 implemented the Route Resolver.

This sprint must implement **Sprint 11 only**.

Do not start Sprint 12.

---

# Goal

Implement the **Static Exporter Engine** layer.

The Static Exporter coordinates all renderers and generators (Markdown, JSON, Schema.org, Search Index, LLMs, Sitemap) into an in-memory `StaticExportBundle` containing structured export assets, relative output paths, content payloads, and an overarching cryptographic/timestamped `manifest.json`.

This sprint must focus only on:

* `StaticExportAsset`, `StaticExportBundle`, and `ExportManifest` data models;
* Zod validation schemas for export assets and bundles;
* file path resolution algorithms for static multi-format projections (`.md`, `.json`, `.schema.json`, `search-index.json`, `llms.txt`, `llms-full.txt`, `sitemap.xml`, `manifest.json`);
* bundle compilation pipeline orchestrating all renderers and generators;
* public / internal export modes and visibility filtering;
* manifest generation with asset counts, hashes, timestamps, and metadata;
* static export diagnostics and bundle validation;
* export fixtures;
* comprehensive unit tests.

Do not implement disk file I/O yet (disk writes belong to CLI fs layer).

Do not implement Knowledge Loader from disk yet.

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
│   ├── export/
│   │   ├── static-exporter.ts
│   │   ├── export-paths.ts
│   │   ├── export-manifest.ts
│   │   ├── export-utils.ts
│   │   ├── validate-static-export-asset.ts
│   │   └── validate-static-export-bundle.ts
│   ├── schemas/
│   │   └── static-export-asset.schema.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       └── static-export.fixture.ts
├── tests/
│   ├── static-export-asset-schema.test.ts
│   ├── export-paths.test.ts
│   ├── export-manifest.test.ts
│   ├── static-exporter.test.ts
│   ├── static-export-validation.test.ts
│   └── static-export-fixtures.test.ts
```

---

# Data Models

### 1. `StaticExportAsset`

```ts
export interface StaticExportAsset {
  path: string;
  target: "markdown" | "json" | "schema" | "search" | "llms" | "llms-full" | "sitemap" | "manifest";
  format: "string" | "object";
  content: string | Record<string, unknown>;
  objectId?: string;
  language?: string;
}
```

### 2. `StaticExportBundle`

```ts
export interface StaticExportBundle {
  id: string;
  siteName: string;
  siteUrl?: string;
  language?: string;
  generatedAt: string;
  assets: StaticExportAsset[];
  manifest: ExportManifest;
}
```

---

# Core Functions

### 1. `generateStaticExport(input: StaticExportInput): StaticExportBundle`

Orchestrates all generators and produces the complete in-memory export bundle.

### 2. `resolveExportPath(object: KnowledgeObject, target: string, extension: string): string`

Calculates relative output file paths (e.g. `fr/implant-dentaire-definition.md`, `fr/implant-dentaire-definition.schema.json`).

### 3. `generateExportManifest(bundleInfo: Partial<StaticExportBundle>): ExportManifest`

Creates the integrity manifest detailing all generated assets and execution metadata.

### 4. `validateStaticExportBundle(bundle: StaticExportBundle): ValidationResult`

Validates that assets have unique paths, valid formats, non-empty contents, and a complete manifest.

---

# Validation Rules & Diagnostics

* `GC_EXPORT_NO_OBJECTS`: Export called with no objects.
* `GC_EXPORT_DUPLICATE_PATH`: Multiple assets targeting identical file path.
* `GC_EXPORT_INVALID_PATH`: File path contains forbidden characters or outside destination sandbox.
* `GC_EXPORT_MANIFEST_MISSING`: Bundle lacks manifest asset.

---

# Acceptance Criteria

1. Bundle contains all requested projections (.md, .json, .schema.json, search index, llms, sitemap, manifest).
2. Relative paths are standardized, lowercase, and URL-safe.
3. Integrity checks ensure zero path collisions.
4. Validation catches malformed bundle payloads.
5. All static export test suites pass.
6. All exports are verified in `src/index.ts`.
