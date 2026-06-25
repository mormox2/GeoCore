# Contributing to GeoCore

Thank you for your interest in contributing.

## Rule #1

**Everything is Knowledge.** When you add docs, code, or decisions, consider how it maps to a [Knowledge Object](docs/concepts/knowledge-object.md) in [`knowledge/`](knowledge/).

## Getting started

1. Fork the repository and clone your fork.
2. Create a branch from `main` for your change.
3. Make focused changes with clear commit messages.
4. Open a pull request using the PR template.

## Where to put work

| Kind of change | Location |
|----------------|----------|
| Explain (narrative) | `docs/handbook/` |
| Define (concept) | `docs/concepts/` |
| Procedure | `docs/playbooks/` |
| Research notes | `docs/research/` |
| Architecture decision | `docs/adr/` |
| Product / UX / AI / GEO decision | `docs/decisions/` |
| Normative spec | `specs/` |
| Knowledge instance | `knowledge/` |
| Software | `packages/` · `apps/` |
| Diagrams | `docs/diagrams/` |

## Documentation

- Propose cross-cutting changes via [RFCs](docs/rfcs/) before large implementations.
- Record architecture decisions in [ADRs](docs/adr/) only.
- Record other decisions in [decisions](docs/decisions/).
- Implement from [specs](specs/) — update specs before code when behavior is normative.

## Pull requests

- Keep PRs small and reviewable when possible.
- Link related issues, RFCs, or decisions.
- Update specs and knowledge instances when public behavior changes.

## Code of conduct

Be respectful, constructive, and collaborative. Report unacceptable behavior to the maintainers.
