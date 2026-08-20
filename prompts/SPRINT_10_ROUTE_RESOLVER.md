# GeoCore Sprint 10 — Route Resolver

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 9 implemented the Sitemap Generator.

This sprint must implement **Sprint 10 only**.

Do not start Sprint 11.

---

# Goal

Implement the **Route Resolver and Route Registry** layer.

The Route Resolver calculates canonical paths, URL patterns, route hierarchies, and redirects for all Knowledge Objects and collections, while detecting collisions, conflicting paths, and circular redirects.

This sprint must focus only on:

* `RouteEntry` and `RouteRegistry` data models;
* Zod validation schemas for routes;
* URL pattern matching and slug parameter interpolation (e.g. `/{language}/{category}/{slug}`);
* canonical URL resolution from site base URL, language, and route patterns;
* route conflict detection (duplicate path detection);
* redirect loop and deep chain detection;
* route registry lookup and traversal utilities;
* route diagnostics and validation;
* route fixtures;
* comprehensive unit tests.

Do not implement Static Exporter bundle packaging yet.

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
│   ├── routing/
│   │   ├── route-entry.ts
│   │   ├── route-registry.ts
│   │   ├── route-resolver.ts
│   │   ├── route-patterns.ts
│   │   ├── route-conflicts.ts
│   │   ├── route-filter.ts
│   │   ├── route-utils.ts
│   │   ├── validate-route-entry.ts
│   │   └── validate-route-registry.ts
│   ├── schemas/
│   │   └── route-entry.schema.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       └── route.fixture.ts
├── tests/
│   ├── route-entry-schema.test.ts
│   ├── route-resolver.test.ts
│   ├── route-registry.test.ts
│   ├── route-conflicts.test.ts
│   ├── route-utils.test.ts
│   ├── route-validation.test.ts
│   └── route-fixtures.test.ts
```

---

# Data Models

### 1. `RouteEntry`

```ts
export interface RouteEntry {
  id: string;
  path: string;
  canonicalUrl: string;
  targetId: string;
  targetType: "knowledge-object" | "collection" | "entity" | "taxonomy" | "redirect";
  language: string;
  status: "published" | "draft" | "archived";
  visibility: "public" | "internal";
  redirectUrl?: string;
  redirectStatusCode?: 301 | 302 | 307 | 308;
}
```

### 2. `RouteRegistry`

```ts
export interface RouteRegistry {
  routes: Map<string, RouteEntry>;
  byTargetId: Map<string, RouteEntry>;
  byPath: Map<string, RouteEntry>;
}
```

---

# Core Functions

### 1. `resolveRoutes(input: { objects: KnowledgeObject[]; collections?: Collection[]; siteUrl?: string; defaultPattern?: string }): RouteRegistry`

Resolves and constructs the full route registry for all items.

### 2. `detectRouteConflicts(routes: RouteEntry[]): RouteConflictReport`

Identifies duplicate paths pointing to different targets.

### 3. `detectRedirectLoops(routes: RouteEntry[]): RouteLoopReport`

Detects circular redirects (e.g. A -> B -> A) and chained redirects exceeding safe depth thresholds.

### 4. `validateRouteRegistry(registry: RouteRegistry): ValidationResult`

Validates route formats (leading slash, valid slug characters, no un-interpolated tokens).

---

# Validation Rules & Diagnostics

* `GC_ROUTE_DUPLICATE_PATH`: Two distinct targets map to identical path.
* `GC_ROUTE_INVALID_PATH`: Path contains invalid characters, spaces, or missing leading `/`.
* `GC_ROUTE_REDIRECT_LOOP`: Circular redirect detected.
* `GC_ROUTE_CANONICAL_URL_INVALID`: Canonical URL is malformed or invalid scheme.

---

# Acceptance Criteria

1. Route resolution maps objects to clean, normalized URLs according to patterns.
2. Route conflict detection prevents colliding URLs.
3. Redirect loop detection catches circular references.
4. Route registry allows fast bidirectional lookup (`byTargetId`, `byPath`).
5. All route test suites pass with 100% success.
6. All exports are added to `src/index.ts`.
