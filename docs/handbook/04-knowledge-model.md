# Knowledge model

GeoCore treats all artifacts as knowledge. The core pipeline is renderer-agnostic.

## Pipeline

See diagram: [`docs/diagrams/knowledge-pipeline.mmd`](../diagrams/knowledge-pipeline.mmd)

```text
Knowledge
    ↓
Knowledge Object      ← canonical, spec-defined instance
    ↓
Renderer              ← HTML, Markdown, PDF, API, LLM, Mobile, Voice
    ↓
Output                ← FAQ, article, guide, endpoint, prompt context…
```

## What is not the model

| Legacy framing | GeoCore framing |
|----------------|-----------------|
| "An FAQ page" | A knowledge object rendered as FAQ |
| "A guide" | A knowledge object rendered as guide |
| "An article" | A knowledge object rendered as article |
| "Content types" | Render targets |

The **object stays identical**. Only the renderer changes.

## Core concepts

Each concept has its own page under [`docs/concepts/`](../concepts/):

- [Knowledge Object](../concepts/knowledge-object.md)
- [Knowledge Graph](../concepts/knowledge-graph.md)
- [Knowledge Channel](../concepts/knowledge-channel.md)
- [Knowledge Collection](../concepts/knowledge-collection.md)
- [Knowledge Dictionary](../concepts/knowledge-dictionary.md)
- [Knowledge Pipeline](../concepts/knowledge-pipeline.md)
- [Knowledge Renderer](../concepts/knowledge-renderer.md)

## Specs and instances

| Layer | Role |
|-------|------|
| [`specs/`](../../specs/) | Defines shapes, constraints, and behavior |
| [`knowledge/`](../../knowledge/) | Holds real instances — GeoCore documents itself here |
| [`packages/`](../../packages/) | Validates, transforms, renders |
| [`apps/`](../../apps/) | Delivers outputs to users |

## First user principle

GeoCore must be the first user of GeoCore. Every handbook chapter, concept, decision, and spec should eventually have a corresponding knowledge instance under [`knowledge/`](../../knowledge/).
