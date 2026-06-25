# Philosophy

## Rule #1 — Everything is Knowledge

Not *Everything is Content.*

**Everything is Knowledge.**

This rule guides every decision in GeoCore.

| Artifact | It is knowledge |
|----------|-----------------|
| FAQ | ✓ |
| Video | ✓ |
| API | ✓ |
| Image | ✓ |
| Diagram | ✓ |
| React component | ✓ |
| Documentation | ✓ |
| RFC | ✓ |
| ADR | ✓ |
| Code | ✓ |

Articles, FAQs, and guides are **implementations** — outputs of a renderer applied to a knowledge object. They are not the model.

```text
Knowledge → Knowledge Object → Renderer → Output
```

Outputs include HTML, Markdown, PDF, API responses, LLM context, mobile UI, and voice.

## Correctness before convenience

Geospatial bugs are often silent: wrong CRS, axis order, or unit conversion produce plausible but wrong results. Validate assumptions, document invariants, and test edge cases.

## Explicit over implicit

Prefer named coordinate reference systems, typed entity models, and clear error messages over implicit defaults.

## Separation of concerns

| Layer | Holds |
|-------|-------|
| Handbook | Narrative explanation |
| Concepts | Definitions (like React docs for Hooks) |
| Playbooks | Procedures — how to do something |
| Research | Exploratory notes — never pollutes the handbook |
| Specs | Normative truth for implementers |
| Knowledge | Live instances of the model |
| Software | Packages and apps that implement specs |

## Spec-driven development

Implementation follows [`specs/`](../../specs/), starting with [GC-SPEC-0001](../../specs/0001-geocore-foundation.md). If it is not specified, it is not stable.

## Small, reviewable changes

Large changes go through RFCs. Architecture decisions go to ADRs. Product, UX, IA, and GEO decisions go to [`decisions/`](../decisions/). Pull requests stay focused.

## Open evolution

Public APIs and knowledge schemas evolve deliberately. Breaking changes require migration notes and, when appropriate, a deprecation period.
