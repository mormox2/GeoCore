# Knowledge Pipeline

A **Knowledge Pipeline** transforms raw input into valid [Knowledge Objects](knowledge-object.md).

Stages may include: ingest → normalize → validate → enrich → relate → persist.

## Examples

- Import research note → draft object
- Parse GeoJSON → geo entity object
- Extract schema from OpenAPI → API knowledge object

## Spec

See [`specs/content-model/`](../../specs/content-model/) and [`specs/entity-model/`](../../specs/entity-model/).

## Diagram

[`docs/diagrams/knowledge-pipeline.mmd`](../diagrams/knowledge-pipeline.mmd)
