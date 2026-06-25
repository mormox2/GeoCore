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

## Planned

| ID | Title |
|----|-------|
| GC-SPEC-0005 | Renderer Engine |
| GC-SPEC-0006 | Entity Engine |
| GC-SPEC-0007 | Content Validation |
| GC-SPEC-0008 | Search Engine |
| GC-SPEC-0009 | AI Integration |
| GC-SPEC-0010 | Documentation Engine |

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
| [api/](api/) | GC-SPEC-0009, GC-SPEC-0010 |

## Change process

1. RFC for cross-cutting exploration → [`docs/rfcs/`](../docs/rfcs/)
2. Architecture → [`docs/adr/`](../docs/adr/)
3. Product / UX / AI / GEO → [`docs/decisions/`](../docs/decisions/)
4. Add or update numbered spec under `specs/`
5. Instance under [`knowledge/`](../knowledge/)
6. Implement in [`packages/`](../packages/) · [`apps/`](../apps/)

See [Adding a Schema](../docs/playbooks/adding-a-schema.md).
