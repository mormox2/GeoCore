# Knowledge Object

The **Knowledge Object** is the canonical unit in GeoCore — defined normatively in [GC-SPEC-0002](../../specs/0002-knowledge-object.md).

Everything — FAQ, video, API schema, diagram, code module, RFC — is modeled as a knowledge object when it enters the GeoCore system.

## Core principle

One Knowledge. Multiple Views. Multiple Renderers. Multiple Outputs. **Never multiple sources.**

## Pipeline

```text
Knowledge Object → Knowledge View(s) → Renderer → Output
```

A Knowledge Object never renders itself directly. It first produces one or more **Knowledge Views** (Patient, Developer, LLM, API, SEO, etc.), then renderers transform views into deliverables.

## Mandatory fields

| Field | Role |
|-------|------|
| `id` | Permanent unique identifier (never changes) |
| `slug` | Human-readable identifier |
| `title` | Canonical title |
| `summary` | Short description |
| `body` | Canonical knowledge |
| `language` | Primary language |
| `status` | Draft / Review / Published / Archived |
| `version` | Semantic version |
| `createdAt` / `updatedAt` | Timestamps |
| `author` | Knowledge owner |

## What it is not

A Knowledge Object is not HTML, not a PDF, not a React page. Those are **outputs** produced by a [Knowledge Renderer](knowledge-renderer.md).

## Anti-patterns

- HTML as source of truth
- Duplicate articles
- Renderer-specific business logic
- Multiple canonical versions

## Spec

Authoritative: [GC-SPEC-0002](../../specs/0002-knowledge-object.md)

Schemas and examples: [`specs/content-model/`](../../specs/content-model/)

## Diagram

[`docs/diagrams/knowledge-pipeline.mmd`](../diagrams/knowledge-pipeline.mmd)
