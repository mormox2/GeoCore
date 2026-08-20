# GeoCore Sprint 15 — Example Integration: RTimi Dental

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 14 implemented `packages/geocore-cli`.

This sprint must implement **Sprint 15 only**.

Do not start Sprint 16.

---

# Goal

Implement the complete **RTimi Dental** real-world example repository:

```txt
examples/rtimidental
```

RTimi Dental represents a specialized medical dental clinic knowledge base in French, covering oral health procedures (scaling, implants, gingivitis), dental practitioner entities, clinic locations, medical review citations, and high-trust medical Schema.org projections.

This sprint must focus only on:

* `geocore.config.json` configured for RTimi Dental (`https://rtimidental.tn`, language: `fr`);
* 3 dental procedure Knowledge Objects with full frontmatter, markdown content, FAQ sections, and medical details:
  * `detartrage-abime-t-il-les-dents.md`
  * `implant-dentaire-definition.md`
  * `gingivite-definition.md`
* 5 medical Entities (`entities/`):
  * `dr-mossaab-rtimi.json` (Practitioner / MedicalBusiness)
  * `clinique-rtimi-dental.json` (DentalClinic / MedicalClinic)
  * `detartrage-dentaire.json` (MedicalProcedure)
  * `implant-dentaire.json` (MedicalProcedure)
  * `gingivite.json` (MedicalCondition)
* 6 typed Graph Relationships (`relationships/relationships.json`);
* 1 authoritative medical Source (`sources/source-ordre-dentistes.json`);
* 3 medical review Citations (`citations/citations.json`);
* 1 clinic Media asset (`media/cabinet-dentaire.json`);
* expected static outputs snapshot (`expected-output/`);
* end-to-end integration tests (`tests/rtimidental-example.test.ts`).

---

# Required directory structure

```txt
examples/rtimidental/
├── geocore.config.json
├── package.json
├── README.md
├── knowledge/
│   ├── detartrage-abime-t-il-les-dents.md
│   ├── implant-dentaire-definition.md
│   ├── gingivite-definition.md
│   ├── entities/
│   │   ├── dr-mossaab-rtimi.json
│   │   ├── clinique-rtimi-dental.json
│   │   ├── detartrage-dentaire.json
│   │   ├── implant-dentaire.json
│   │   └── gingivite.json
│   ├── relationships/
│   │   └── relationships.json
│   ├── sources/
│   │   └── source-ordre-dentistes.json
│   ├── citations/
│   │   └── citations.json
│   └── media/
│       └── cabinet-dentaire.json
├── expected-output/
│   ├── fr/
│   │   ├── detartrage-abime-t-il-les-dents.md
│   │   ├── detartrage-abime-t-il-les-dents.json
│   │   ├── detartrage-abime-t-il-les-dents.schema.json
│   │   ├── gingivite-definition.md
│   │   ├── gingivite-definition.json
│   │   ├── gingivite-definition.schema.json
│   │   ├── implant-dentaire-definition.md
│   │   ├── implant-dentaire-definition.json
│   │   └── implant-dentaire-definition.schema.json
│   ├── search-index.json
│   ├── llms.txt
│   ├── llms-full.txt
│   ├── sitemap.xml
│   └── manifest.json
└── tests/
    └── rtimidental-example.test.ts
```

---

# Required CLI Scripts

In `examples/rtimidental/package.json`:

```json
{
  "scripts": {
    "validate": "geocore validate --config geocore.config.json",
    "export": "geocore export --config geocore.config.json",
    "inspect": "geocore inspect --config geocore.config.json",
    "test": "vitest run"
  }
}
```

---

# Acceptance Criteria

1. `geocore inspect` accurately counts 3 objects, 5 entities, 6 relationships, 3 citations, 1 source, 1 media.
2. `geocore validate` passes all 10 validation pipeline stages with zero errors and zero critical issues.
3. `geocore export` writes all 14 static assets matching the expected output specifications.
4. Schema.org outputs contain valid `MedicalWebPage`, `MedicalProcedure`, and `MedicalCondition` representations.
5. All integration tests pass in `tests/rtimidental-example.test.ts`.
