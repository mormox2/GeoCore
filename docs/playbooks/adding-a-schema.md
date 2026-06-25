# Playbook — Adding a Schema

Extend the GeoCore type system when a new kind of knowledge must be modeled.

## Steps

1. Write an [RFC](../rfcs/) if the change is cross-cutting.
2. Record product/UX/AI/GEO impact in [decisions](../decisions/) if applicable.
3. Record architecture impact in [ADR](../adr/) if applicable.
4. Update the relevant spec under [`specs/`](../../specs/):
   - `content-model/` — object shape
   - `entity-model/` — relations
   - `metadata/` — fields
   - `rendering/` — renderer contracts
   - `api/` — exposure rules
5. Update [taxonomy](../../knowledge/taxonomy/) and [glossary](../../knowledge/glossary/) if new terms appear.
6. Add a [concept](../concepts/) page if introducing a new public concept.
7. Add an example instance under [`knowledge/examples/`](../../knowledge/examples/).

## Done when

- Spec is normative and reviewed
- At least one example instance exists
- Codex can implement from spec alone
