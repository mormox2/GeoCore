# Rendering

Normative definition: [GC-SPEC-0005 — Renderer Engine](../0005-renderer-engine.md).

Concept overview: [Knowledge Renderer](../../docs/concepts/knowledge-renderer.md).

## Status

Accepted — implementation artifacts pending under [`packages/`](../../packages/).

## Must define (implementation)

- Renderer interface (`RendererInput` → `RendererOutput`)
- Renderer registry (`html`, `markdown`, `json`, `jsonLd`, `llm`, `search`, …)
- Layout profiles: FAQ, guide, article (renderer configs, not content types)
- Diagnostics and error blocking rules
- Cache key format and invalidation hooks
