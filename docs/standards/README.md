# Standards

Derived from [GC-SPEC-0001](../specs/0001-geocore-foundation.md). Where this file and a spec conflict, the spec wins.

## Core principle

**Everything is Knowledge.** Pages are not first-class citizens. Knowledge is.

## Decision hierarchy

1. Specifications
2. ADRs
3. Handbook
4. RFCs
5. Implementation

## Naming

| Target | Convention |
|--------|------------|
| Directories | lowercase, kebab-case |
| Files | kebab-case |
| Spec documents | `NNNN-title.md` |
| TypeScript types | PascalCase |
| TypeScript functions | camelCase |
| Constants | SCREAMING_SNAKE_CASE |

## Repository layers

| Layer | Path |
|-------|------|
| Documentation | `docs/` |
| Knowledge | `knowledge/` |
| Specs | `specs/` |
| Software | `packages/` · `apps/` |

No new top-level directories without architectural review (spec 0001 §9).

## Engineering

Every package MUST: single responsibility, typed public APIs, documentation, no duplicated logic, framework-agnostic where possible, independently testable.

## Documentation split

| Location | Holds |
|----------|-------|
| `docs/handbook/` | Narrative explanation |
| `docs/concepts/` | Definitions |
| `docs/playbooks/` | Procedures |
| `docs/research/` | Exploratory notes |
| `docs/diagrams/` | Mermaid (`.mmd`) |
| `docs/adr/` | Architecture decisions |
| `docs/decisions/` | Product, UX, AI, GEO decisions |
| `specs/` | Normative truth |
| `knowledge/` | Live instances |
