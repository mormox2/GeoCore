# Metadata Engine

The **Metadata Engine** generates, validates, normalizes, and exposes metadata for Knowledge Objects, Views, Renderers, and Outputs.

Defined in [GC-SPEC-0004](../../specs/0004-metadata-engine.md).

## Core principle

The Knowledge Object **owns** metadata. Renderers **consume** it. Outputs **expose** it. Metadata must not be duplicated manually across channels.

## Six layers

| Layer | Purpose |
|-------|---------|
| Identity | Stable id, slug, type, title, language, version, status |
| Editorial | Author, reviewer, owner, dates |
| Semantic | Entities, topics, domains, graph links |
| Technical | Hashes, validation, indexing, render targets |
| SEO | Title, description, canonical, OpenGraph |
| AI/GEO | Summaries, canonical answer, confidence, freshness |

## Precedence (on conflict)

1. Knowledge Object metadata
2. Knowledge View metadata
3. Collection metadata
4. Entity metadata
5. Global defaults
6. Renderer defaults

## High-trust domains

Medical, dental, legal, financial, and scientific content require stricter editorial and citation metadata (§19).

## Spec

[GC-SPEC-0004](../../specs/0004-metadata-engine.md) · [`specs/metadata/`](../../specs/metadata/)
