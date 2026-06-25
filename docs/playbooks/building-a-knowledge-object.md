# Playbook — Building a Knowledge Object

## Prerequisites

- Read [Knowledge Object](../concepts/knowledge-object.md)
- Read [`specs/content-model/`](../../specs/content-model/) and [`specs/metadata/`](../../specs/metadata/)

## Steps

1. Choose or define the object type in specs (if new).
2. Assign a stable ID.
3. Fill required metadata (title, status, relations, tags).
4. Write structured payload — no presentation markup in the canonical body.
5. Validate against spec (schema / CLI when available).
6. Place instance under [`knowledge/`](../../knowledge/) in the appropriate folder.
7. Link related objects in the knowledge graph.
8. Choose renderers and channels when publishing output.

## Done when

- Object validates against spec
- Instance exists under `knowledge/`
- Relations are documented
