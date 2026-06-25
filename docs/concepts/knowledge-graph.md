# Knowledge Graph

The **Knowledge Graph** connects [Knowledge Objects](knowledge-object.md) through explicit, typed, validated relationships.

Defined normatively in [GC-SPEC-0003](../../specs/0003-knowledge-graph.md).

## Core principle

Knowledge is not isolated. Relationships are **first-class knowledge** — not HTML links, not tags pretending to be entities.

> A Knowledge Object gives knowledge identity. The Knowledge Graph gives knowledge meaning.

## Graph components

| Component | Role |
|-----------|------|
| Knowledge Object nodes | Canonical units (GC-SPEC-0002) |
| Entity nodes | Concepts — not articles |
| Relationships | Typed, directed, optionally weighted |
| Collections | Ordered groups with navigation logic |
| Taxonomy | Classification (related but distinct from graph edges) |

## Node types

Knowledge Object · Entity · Author · Source · Media Asset · Collection · Taxonomy Term · External Reference

## Relationship types (minimum)

`related_to` · `parent_of` · `child_of` · `part_of` · `requires` · `explains` · `cites` · `authored_by` · `mentions` · `uses_media` · `translation_of` · `alternative_to` · `contrasts_with` · `example_of`

Strength: `weak` | `medium` | `strong` | `canonical`

## Responsibilities

- Internal linking, traversal, search discovery
- AI context retrieval (object + entities + related + citations)
- GEO — canonical topics, authority, citeability

## Anti-patterns

- Relationships only in rendered HTML
- Graph logic inside renderers
- Categories or tags replacing typed relationships

## Spec

Authoritative: [GC-SPEC-0003](../../specs/0003-knowledge-graph.md)

Schemas: [`specs/entity-model/`](../../specs/entity-model/)

## Instances

[`knowledge/entities/`](../../knowledge/entities/) · [`knowledge/ontology/`](../../knowledge/ontology/)
