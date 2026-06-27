# GeoCore Sprint 2 — Knowledge Graph & Relationship Validation

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 1 created the pure core package:

```txt
packages/geocore
```

Sprint 1 implemented:

* core domain types;
* Zod schemas;
* validation primitives;
* KnowledgeObject validation;
* RTimi Dental fixture;
* Dawajin Pro fixture;
* tests.

This sprint must implement **Sprint 2 only**.

Do not start Sprint 3.

---

# Goal

Implement the first Knowledge Graph layer.

This sprint must focus only on:

* graph node types;
* graph registry;
* relationship validation;
* relationship lookup utilities;
* orphan detection;
* parent-child cycle detection;
* graph diagnostics;
* graph fixtures;
* tests.

Do not implement metadata resolution.

Do not implement renderers.

Do not implement search.

Do not implement sitemap.

Do not implement CLI.

Do not implement filesystem access.

Do not implement database persistence.

Do not implement React or Next.js.

The core package must remain pure and framework-agnostic.

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
│   ├── types/
│   │   ├── graph.ts
│   │   └── graph-diagnostic.ts
│   ├── schemas/
│   │   ├── graph-node.schema.ts
│   │   └── graph-registry.schema.ts
│   ├── graph/
│   │   ├── graph-registry.ts
│   │   ├── graph-utils.ts
│   │   ├── relationship-utils.ts
│   │   ├── validate-relationship.ts
│   │   ├── validate-relationships.ts
│   │   ├── detect-orphans.ts
│   │   ├── detect-parent-cycles.ts
│   │   └── validate-graph-registry.ts
│   ├── validation/
│   │   ├── validation-codes.ts
│   │   └── validation-result.ts
│   └── fixtures/
│       ├── graph.fixture.ts
│       ├── rtimidental.fixture.ts
│       └── dawajinpro.fixture.ts
├── tests/
│   ├── graph-node.test.ts
│   ├── graph-registry.test.ts
│   ├── relationship-validation.test.ts
│   ├── orphan-detection.test.ts
│   ├── parent-cycle-detection.test.ts
│   └── graph-fixtures.test.ts
```

If files already exist, update them cleanly.

Do not duplicate logic.

---

# Core graph types

Create:

```ts
export type GraphNodeType =
  | "knowledge-object"
  | "entity"
  | "author"
  | "source"
  | "citation"
  | "collection"
  | "taxonomy-term"
  | "glossary-entry"
  | "media"
  | "custom";

export type GraphNode = {
  id: string;
  type: GraphNodeType;
  label?: string;
  sourceId?: string;
  metadata?: Record<string, unknown>;
};

export type GraphRegistry = {
  id: string;
  nodes: GraphNode[];
  relationships: KnowledgeRelationship[];
  generatedAt: string;
  diagnostics: GraphDiagnostic[];
};
```

---

# Graph diagnostic

Create:

```ts
export type GraphDiagnosticSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export type GraphDiagnostic = {
  id: string;
  severity: GraphDiagnosticSeverity;
  code: string;
  message: string;
  nodeId?: string;
  relationshipId?: string;
  field?: string;
  recommendation?: string;
};
```

Diagnostics must be readable by humans and machines.

---

# Graph registry creation

Implement:

```ts
export function createGraphRegistry(input: {
  id: string;
  nodes?: GraphNode[];
  relationships?: KnowledgeRelationship[];
}): GraphRegistry
```

Rules:

* `id` is required;
* missing nodes defaults to empty array;
* missing relationships defaults to empty array;
* `generatedAt` must be ISO string;
* diagnostics defaults to empty array;
* do not mutate input.

---

# Graph node helpers

Implement:

```ts
export function createGraphNode(input: {
  id: string;
  type: GraphNodeType;
  label?: string;
  sourceId?: string;
  metadata?: Record<string, unknown>;
}): GraphNode

export function createKnowledgeObjectNode(object: KnowledgeObject): GraphNode

export function createEntityNode(entity: KnowledgeEntity): GraphNode

export function createSourceNode(source: KnowledgeSource): GraphNode

export function createCitationNode(citation: KnowledgeCitation): GraphNode

export function createCollectionNode(collection: KnowledgeCollection): GraphNode

export function createMediaNode(media: MediaAsset): GraphNode
```

Rules:

* node IDs must match the source object IDs;
* do not invent missing IDs;
* preserve labels when available;
* do not mutate input.

---

# Relationship validation

Implement:

```ts
export function validateRelationship(
  relationship: Partial<KnowledgeRelationship>,
  nodes?: GraphNode[]
): ValidationResult
```

Validation checks:

* relationship ID exists;
* sourceId exists;
* targetId exists;
* relationship type is valid;
* strength is valid;
* confidence is valid when present;
* createdAt exists;
* updatedAt exists;
* source node exists when nodes are provided;
* target node exists when nodes are provided;
* self-reference should produce warning unless relationship type explicitly supports it later.

For this sprint, self-reference should produce a warning.

---

# Validate multiple relationships

Implement:

```ts
export function validateRelationships(input: {
  relationships: KnowledgeRelationship[];
  nodes?: GraphNode[];
}): ValidationResult
```

Behavior:

* validate every relationship;
* aggregate issues;
* detect duplicate relationship IDs;
* detect missing source nodes;
* detect missing target nodes;
* do not throw;
* return `ValidationResult`.

---

# Relationship utilities

Implement:

```ts
export function getRelationshipsForSource(
  relationships: KnowledgeRelationship[],
  sourceId: string
): KnowledgeRelationship[]

export function getRelationshipsForTarget(
  relationships: KnowledgeRelationship[],
  targetId: string
): KnowledgeRelationship[]

export function getRelationshipsBetween(
  relationships: KnowledgeRelationship[],
  sourceId: string,
  targetId: string
): KnowledgeRelationship[]

export function getOutgoingNodeIds(
  relationships: KnowledgeRelationship[],
  sourceId: string
): string[]

export function getIncomingNodeIds(
  relationships: KnowledgeRelationship[],
  targetId: string
): string[]
```

Rules:

* functions must be pure;
* return empty arrays when nothing is found;
* do not mutate input.

---

# Orphan detection

Implement:

```ts
export function detectOrphans(input: {
  nodes: GraphNode[];
  relationships: KnowledgeRelationship[];
  ignoreNodeTypes?: GraphNodeType[];
}): GraphDiagnostic[]
```

Definition:

A node is orphaned when it has:

* no incoming relationship;
* no outgoing relationship.

Rules:

* by default, do not treat isolated `author` nodes as errors;
* orphan Knowledge Objects should produce warnings;
* orphan Entities should produce warnings;
* ignored node types should not produce diagnostics;
* diagnostics should use stable codes.

---

# Parent-child cycle detection

Implement:

```ts
export function detectParentCycles(input: {
  relationships: KnowledgeRelationship[];
}): GraphDiagnostic[]
```

Cycle detection applies only to relationships of type:

```txt
parent_of
child_of
part_of
```

Rules:

* detect simple cycles;
* detect multi-node cycles;
* return critical diagnostics for cycles;
* do not throw;
* do not mutate input.

Example cycle:

```txt
A parent_of B
B parent_of C
C parent_of A
```

must produce a critical diagnostic.

---

# Graph registry validation

Implement:

```ts
export function validateGraphRegistry(
  registry: GraphRegistry
): ValidationResult
```

Validation checks:

* registry ID exists;
* nodes array exists;
* relationships array exists;
* generatedAt exists;
* diagnostics array exists;
* duplicate node IDs produce error;
* duplicate relationship IDs produce error;
* invalid relationships produce errors;
* missing source node produces error;
* missing target node produces error;
* parent-child cycles produce critical issues;
* orphan nodes produce warnings.

---

# Validation codes

Add these codes to `src/validation/validation-codes.ts` if they do not already exist:

```ts
GC_GRAPH_REGISTRY_ID_MISSING
GC_GRAPH_NODES_INVALID
GC_GRAPH_RELATIONSHIPS_INVALID
GC_GRAPH_GENERATED_AT_MISSING
GC_GRAPH_DIAGNOSTICS_INVALID

GC_GRAPH_NODE_ID_MISSING
GC_GRAPH_NODE_TYPE_INVALID
GC_GRAPH_NODE_ID_DUPLICATE

GC_RELATIONSHIP_ID_MISSING
GC_RELATIONSHIP_SOURCE_ID_MISSING
GC_RELATIONSHIP_TARGET_ID_MISSING
GC_RELATIONSHIP_TYPE_INVALID
GC_RELATIONSHIP_STRENGTH_INVALID
GC_RELATIONSHIP_CONFIDENCE_INVALID
GC_RELATIONSHIP_CREATED_AT_MISSING
GC_RELATIONSHIP_UPDATED_AT_MISSING
GC_RELATIONSHIP_ID_DUPLICATE
GC_RELATIONSHIP_SOURCE_NODE_MISSING
GC_RELATIONSHIP_TARGET_NODE_MISSING
GC_RELATIONSHIP_SELF_REFERENCE

GC_GRAPH_ORPHAN_NODE
GC_GRAPH_PARENT_CYCLE
```

Severity rules:

* missing registry ID = error;
* invalid node type = error;
* duplicate node ID = error;
* duplicate relationship ID = error;
* missing relationship source or target = error;
* missing source node = error;
* missing target node = error;
* self-reference = warning;
* orphan node = warning;
* parent-child cycle = critical.

Any error or critical issue must make:

```txt
valid: false
publishable: false
```

Warnings must not block publication.

---

# Zod schemas

Create Zod schemas for:

* GraphNode
* GraphRegistry
* GraphDiagnostic

Schema requirements:

* validate node ID;
* validate node type;
* validate registry ID;
* validate arrays;
* validate generatedAt;
* validate diagnostics array.

Use Zod.

---

# RTimi Dental graph fixture

Update or create:

```txt
packages/geocore/src/fixtures/graph.fixture.ts
```

Include a valid RTimi Dental graph using:

```txt
ko_detartrage_abime_dents
entity_scaling
entity_tartar
author_dr_mossaab_rtimi
```

Relationships:

```ts
{
  id: "rel_detartrage_explains_scaling",
  sourceId: "ko_detartrage_abime_dents",
  targetId: "entity_scaling",
  type: "explains",
  strength: "canonical",
  confidence: "high",
  reason: "The article explains dental scaling.",
  createdAt: "2026-06-25",
  updatedAt: "2026-06-25"
}

{
  id: "rel_detartrage_mentions_tartar",
  sourceId: "ko_detartrage_abime_dents",
  targetId: "entity_tartar",
  type: "mentions",
  strength: "strong",
  confidence: "high",
  reason: "The article mentions tartar.",
  createdAt: "2026-06-25",
  updatedAt: "2026-06-25"
}

{
  id: "rel_detartrage_authored_by_dr",
  sourceId: "ko_detartrage_abime_dents",
  targetId: "author_dr_mossaab_rtimi",
  type: "authored_by",
  strength: "canonical",
  confidence: "high",
  reason: "The article is authored by Dr Mossaab Rtimi.",
  createdAt: "2026-06-25",
  updatedAt: "2026-06-25"
}
```

This fixture must validate.

---

# Dawajin Pro graph fixture

Include a valid Dawajin Pro graph using:

```txt
ko_customer_balance_management
entity_customer_balance
entity_invoice
entity_payment
author_dawajin_team
```

Relationships:

```ts
{
  id: "rel_customer_balance_explains_balance",
  sourceId: "ko_customer_balance_management",
  targetId: "entity_customer_balance",
  type: "explains",
  strength: "canonical",
  confidence: "high",
  reason: "The article explains customer balances.",
  createdAt: "2026-06-25",
  updatedAt: "2026-06-25"
}

{
  id: "rel_customer_balance_mentions_invoice",
  sourceId: "ko_customer_balance_management",
  targetId: "entity_invoice",
  type: "mentions",
  strength: "strong",
  confidence: "high",
  reason: "Customer balance is related to invoices.",
  createdAt: "2026-06-25",
  updatedAt: "2026-06-25"
}

{
  id: "rel_customer_balance_mentions_payment",
  sourceId: "ko_customer_balance_management",
  targetId: "entity_payment",
  type: "mentions",
  strength: "strong",
  confidence: "high",
  reason: "Customer balance is affected by payments.",
  createdAt: "2026-06-25",
  updatedAt: "2026-06-25"
}

{
  id: "rel_customer_balance_authored_by_team",
  sourceId: "ko_customer_balance_management",
  targetId: "author_dawajin_team",
  type: "authored_by",
  strength: "canonical",
  confidence: "high",
  reason: "The article is authored by the Dawajin Pro team.",
  createdAt: "2026-06-25",
  updatedAt: "2026-06-25"
}
```

This fixture must validate.

Do not add any claim that Konnect is production-ready.

---

# Tests

Use Vitest.

Add tests for the following cases.

## Graph node tests

* valid graph node passes schema validation;
* missing node ID fails schema validation;
* invalid node type fails schema validation;
* Knowledge Object node is created from object;
* Entity node is created from entity.

## Graph registry tests

* valid graph registry passes schema validation;
* registry creation defaults arrays;
* registry creation adds generatedAt;
* duplicate node IDs fail validation;
* duplicate relationship IDs fail validation;
* empty graph is valid with warnings only if applicable.

## Relationship validation tests

* valid relationship passes validation;
* missing relationship ID produces `GC_RELATIONSHIP_ID_MISSING`;
* missing source ID produces `GC_RELATIONSHIP_SOURCE_ID_MISSING`;
* missing target ID produces `GC_RELATIONSHIP_TARGET_ID_MISSING`;
* invalid type produces `GC_RELATIONSHIP_TYPE_INVALID`;
* invalid strength produces `GC_RELATIONSHIP_STRENGTH_INVALID`;
* invalid confidence produces `GC_RELATIONSHIP_CONFIDENCE_INVALID`;
* missing source node produces `GC_RELATIONSHIP_SOURCE_NODE_MISSING`;
* missing target node produces `GC_RELATIONSHIP_TARGET_NODE_MISSING`;
* self-reference produces warning only.

## Relationship utility tests

* get relationships for source;
* get relationships for target;
* get relationships between two nodes;
* get outgoing node IDs;
* get incoming node IDs;
* empty results return empty arrays.

## Orphan detection tests

* orphan Knowledge Object produces warning;
* orphan Entity produces warning;
* connected node does not produce orphan warning;
* ignored node type does not produce warning;
* author node can be ignored by default.

## Parent cycle detection tests

* no cycle returns no diagnostics;
* simple parent cycle is detected;
* multi-node parent cycle is detected;
* non-parent relationships do not trigger cycle detection;
* detected cycle has critical severity.

## Fixture tests

* RTimi Dental graph fixture validates;
* Dawajin Pro graph fixture validates;
* fixtures have no critical diagnostics.

---

# Expected exports

Update:

```txt
packages/geocore/src/index.ts
```

Export:

* GraphNodeType
* GraphNode
* GraphRegistry
* GraphDiagnostic
* GraphDiagnosticSeverity
* graph Zod schemas
* createGraphRegistry
* createGraphNode
* createKnowledgeObjectNode
* createEntityNode
* createSourceNode
* createCitationNode
* createCollectionNode
* createMediaNode
* validateRelationship
* validateRelationships
* validateGraphRegistry
* detectOrphans
* detectParentCycles
* relationship utility functions
* graph fixtures
* new validation codes

Ensure Sprint 1 exports remain intact.

No default export.

Use named exports only.

---

# Technical rules

Use:

* TypeScript
* Zod
* Vitest

Do not use:

* React
* Next.js
* DOM APIs
* browser APIs
* database clients
* AI SDKs
* filesystem APIs
* external graph libraries

Keep implementation pure and deterministic.

---

# Acceptance criteria

Sprint 2 is complete only when:

* graph node types exist;
* graph registry exists;
* graph diagnostics exist;
* graph Zod schemas exist;
* relationship validation works;
* duplicate relationship detection works;
* orphan detection works;
* parent-child cycle detection works;
* RTimi Dental graph fixture validates;
* Dawajin Pro graph fixture validates;
* tests pass;
* TypeScript compiles;
* all public graph APIs are exported from `src/index.ts`;
* Sprint 1 tests still pass;
* no framework-specific or filesystem code is introduced.

---

# Final instruction

Implement Sprint 2 only.

Do not start Sprint 3.

At the end, provide:

1. summary of created files;
2. summary of updated files;
3. summary of tests added;
4. commands run;
5. test/build result;
6. any known warnings or limitations.
