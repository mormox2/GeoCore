# Knowledge View

A **Knowledge View** adapts a [Knowledge Object](knowledge-object.md) to a particular audience before rendering.

Defined in [GC-SPEC-0002 §8](../../specs/0002-knowledge-object.md).

## Principle

The knowledge remains identical. Only the presentation changes.

## Examples

| View | Audience |
|------|----------|
| Patient View | End users, patients |
| Developer View | Engineers, integrators |
| Student View | Learners |
| Administrator View | Operators, admins |
| LLM View | AI systems, RAG |
| API View | Programmatic consumers |
| SEO View | Search indexing |

## Pipeline position

```text
Knowledge Object → Knowledge View → Renderer → Output
```

Objects never render directly; they produce one or more views first.

## Spec

[GC-SPEC-0002](../../specs/0002-knowledge-object.md) · Renderer behavior in GC-SPEC-0005 (planned)
