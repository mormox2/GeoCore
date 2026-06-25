# Knowledge

GeoCore is the **first user of GeoCore**.

This tree holds live knowledge instances — not narrative docs, not research dumps, not application code. Everything here conforms to [`specs/`](../specs/).

## Structure

| Path | Purpose |
|------|---------|
| [entities/](entities/) | Knowledge objects and graph nodes |
| [glossary/](glossary/) | Term definitions and aliases |
| [ontology/](ontology/) | Classes, relations, and constraints |
| [taxonomy/](taxonomy/) | Categories, tags, and hierarchies |
| [examples/](examples/) | Reference instances for each object type |

## Rule #1

> Everything is Knowledge.

Handbook chapters, RFCs, ADRs, code modules, and diagrams all have or will have corresponding knowledge representations here.

## Workflow

1. Define shape in [`specs/`](../specs/)
2. Create or update instance here
3. Render via [`packages/`](../packages/) into [`apps/`](../apps/)

See [Building a Knowledge Object](../docs/playbooks/building-a-knowledge-object.md).
