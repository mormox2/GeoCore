# Specs

Normative specifications for Codex and developers. **Implementation never overrides specifications.**

Authoritative foundation: [0001-geocore-foundation.md](0001-geocore-foundation.md) (GC-SPEC-0001, v1.0.0, Accepted).

## Accepted

| ID | Document | Status |
|----|----------|--------|
| GC-SPEC-0001 | [0001-geocore-foundation.md](0001-geocore-foundation.md) | Accepted |
| GC-SPEC-0002 | [0002-knowledge-object.md](0002-knowledge-object.md) | Accepted |
| GC-SPEC-0003 | [0003-knowledge-graph.md](0003-knowledge-graph.md) | Accepted |
| GC-SPEC-0004 | [0004-metadata-engine.md](0004-metadata-engine.md) | Accepted |
| GC-SPEC-0005 | [0005-renderer-engine.md](0005-renderer-engine.md) | Accepted |
| GC-SPEC-0006 | [0006-entity-engine.md](0006-entity-engine.md) | Accepted |
| GC-SPEC-0007 | [0007-content-validation.md](0007-content-validation.md) | Accepted |
| GC-SPEC-0008 | [0008-search-engine.md](0008-search-engine.md) | Accepted |
| GC-SPEC-0009 | [0009-ai-integration.md](0009-ai-integration.md) | Accepted |
| GC-SPEC-0010 | [0010-documentation-engine.md](0010-documentation-engine.md) | Accepted |
| GC-SPEC-0011 | [0011-schema-engine.md](0011-schema-engine.md) | Accepted |
| GC-SPEC-0012 | [0012-llms-engine.md](0012-llms-engine.md) | Accepted |
| GC-SPEC-0013 | [0013-sitemap-engine.md](0013-sitemap-engine.md) | Accepted |
| GC-SPEC-0014 | [0014-collection-engine.md](0014-collection-engine.md) | Accepted |
| GC-SPEC-0015 | [0015-taxonomy-engine.md](0015-taxonomy-engine.md) | Accepted |
| GC-SPEC-0016 | [0016-glossary-engine.md](0016-glossary-engine.md) | Accepted |
| GC-SPEC-0017 | [0017-citation-engine.md](0017-citation-engine.md) | Accepted |
| GC-SPEC-0018 | [0018-media-engine.md](0018-media-engine.md) | Accepted |
| GC-SPEC-0019 | [0019-api-engine.md](0019-api-engine.md) | Accepted |

Filename format: `NNNN-kebab-case-title.md` (see spec 0001 §11).

## Spec document template

Every specification MUST contain:

- Purpose
- Scope
- Requirements
- Acceptance Criteria
- Out of Scope
- Examples
- Future Evolution
- Open Questions

## Decision hierarchy

When documents conflict (spec 0001 §13):

1. Specifications
2. ADRs
3. Handbook
4. RFCs
5. Implementation

## Supporting directories

Schemas, examples, and split detail MAY live under:

| Path | Supports |
|------|----------|
| [content-model/](content-model/) | GC-SPEC-0002, GC-SPEC-0007 |
| [entity-model/](entity-model/) | GC-SPEC-0003, GC-SPEC-0006 |
| [rendering/](rendering/) | GC-SPEC-0005 |
| [metadata/](metadata/) | GC-SPEC-0004 |
| [api/](api/) | GC-SPEC-0019 |

## Change process

1. RFC for cross-cutting exploration → [`docs/rfcs/`](../docs/rfcs/)
2. Architecture → [`docs/adr/`](../docs/adr/)
3. Product / UX / AI / GEO → [`docs/decisions/`](../docs/decisions/)
4. Add or update numbered spec under `specs/`
5. Instance under [`knowledge/`](../knowledge/)
6. Implement in [`packages/`](../packages/) · [`apps/`](../apps/)

See [Adding a Schema](../docs/playbooks/adding-a-schema.md).
