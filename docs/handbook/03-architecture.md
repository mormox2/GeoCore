# Architecture

GeoCore is organized in three layers: **Documentation → Knowledge → Software**.

```text
GeoCore
│
├── docs/           Documentation
│   ├── handbook/   Explain (you are here)
│   ├── concepts/   Define
│   ├── playbooks/  Procedurize
│   ├── adr/        Architecture decisions only
│   ├── decisions/  Product · UX · AI · GEO decisions
│   ├── research/   Explore (never in handbook)
│   ├── diagrams/   Mermaid assets (linked from chapters)
│   └── …
│
├── knowledge/      Knowledge (first user of GeoCore)
│   ├── entities/
│   ├── glossary/
│   ├── ontology/
│   ├── taxonomy/
│   └── examples/
│
├── specs/          Normative specifications
│   ├── content-model/
│   ├── entity-model/
│   ├── rendering/
│   ├── metadata/
│   └── api/
│
├── packages/       Software — libraries, renderers, core
└── apps/           Software — applications
```

Supporting paths: [`examples/`](../../examples/), [`scripts/`](../../scripts/), [`assets/`](../../assets/).

## Documentation layers

| Layer | Location | Purpose |
|-------|----------|---------|
| Handbook | `docs/handbook/` | Narrative overview |
| Concepts | `docs/concepts/` | One page per concept |
| Playbooks | `docs/playbooks/` | Step-by-step procedures |
| Diagrams | `docs/diagrams/` | Mermaid diagrams linked from docs |
| ADR | `docs/adr/` | **Architecture** decisions only |
| Decisions | `docs/decisions/` | Product, UX, AI, GEO decisions |
| Research | `docs/research/` | Notes, benchmarks, explorations |
| Architecture | `docs/architecture/` | Deep dives |
| RFC | `docs/rfcs/` | Proposed major changes |
| Standards | `docs/standards/` | Conventions and checklists |
| API docs | `docs/api/` | Human-readable API reference |

## Software boundaries

- **`packages/`** — Domain logic, knowledge model, renderers, public library APIs.
- **`apps/`** — UX, orchestration, deployment, app-specific adapters.
- **`knowledge/`** — Data conforming to specs; not application code.
- **`specs/`** — Source of truth for implementers (including Codex).

Packages must not depend on apps. Shared logic moves into `packages/`.

## Decision flow

1. Explore in [`research/`](../research/) or propose via [RFC](../rfcs/).
2. Decide: architecture → [ADR](../adr/); product/UX/AI/GEO → [decisions](../decisions/).
3. Specify in [`specs/`](../../specs/).
4. Instantiate in [`knowledge/`](../../knowledge/).
5. Implement in `packages/` and `apps/`.

## Diagrams

All Mermaid diagrams live in [`docs/diagrams/`](../diagrams/). Handbook and concept pages link to them — they are not embedded inline in narrative docs when reuse matters.
