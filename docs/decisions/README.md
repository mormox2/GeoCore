# Decisions

Non-architecture decisions live here — separate from [ADRs](../adr/), which are **architecture only**.

## Categories

| Folder | Decisions about |
|--------|-----------------|
| [product/](product/) | Scope, priorities, naming, release strategy |
| [ux/](ux/) | Interaction, layout, accessibility |
| [ai/](ai/) | Models, prompting, RAG, AI product policy |
| [geo/](geo/) | Geospatial conventions, CRS policy, data sourcing |

## Filename format

`NNNN-short-title.md`

## Template

```markdown
# Title

- Status: proposed | accepted | deprecated | superseded
- Category: product | ux | ai | geo
- Date: YYYY-MM-DD

## Context

## Decision

## Consequences
```

## When to use ADR instead

If the decision is about system structure, package boundaries, technology choice, or integration patterns → use [`docs/adr/`](../adr/).
