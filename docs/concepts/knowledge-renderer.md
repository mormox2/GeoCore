# Knowledge Renderer

A **Knowledge Renderer** converts a [Knowledge Object](knowledge-object.md) into a concrete **output** without changing the object.

## Output formats

| Renderer | Output |
|----------|--------|
| HTML | Web page, FAQ layout, article layout |
| Markdown | Repo docs, exports |
| PDF | Printable document |
| API | JSON / GraphQL response |
| LLM | Prompt context, RAG chunk |
| Mobile | Native or hybrid UI |
| Voice | Spoken response |

## Rule

> The object stays identical. Only the renderer changes.

FAQ, guide, and article are **layout strategies**, not object types.

## Spec

See [`specs/rendering/`](../../specs/rendering/).

## Implementation

Renderer logic lives in [`packages/`](../../packages/). Applications in [`apps/`](../../apps/) configure channels.
