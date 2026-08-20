# GeoCore Sprint 16 — Example Integration: Dawajin Pro

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 15 implemented the RTimi Dental example.

This sprint must implement **Sprint 16 only**.

---

# Goal

Implement the complete **Dawajin Pro** real-world example repository:

```txt
examples/dawajinpro
```

Dawajin Pro represents a comprehensive enterprise Poultry ERP and farm management SaaS knowledge graph in French, covering credit risk management, stock control, logistics/delivery tracking, driver roles, Konnect pre-production payment integrations, domain glossaries, and technical software Schema.org projections.

This sprint must focus only on:

* `geocore.config.json` configured for Dawajin Pro (`https://dawajinpro.tn`, language: `fr`);
* 5 SaaS product Knowledge Objects with frontmatter, markdown bodies, and technical workflows:
  * `gestion-creances-clients.md`
  * `gestion-stock-volaille-oeufs.md`
  * `suivi-livraisons.md`
  * `role-chauffeur.md`
  * `konnect-preproduction.md`
* 9 business and software Entities (`entities/`):
  * `dawajin-pro-saas.json` (SoftwareApplication / Organization)
  * `creance-client.json` (Intangible / FinancialConcept)
  * `stock-volaille-oeufs.json` (Product / Commodity)
  * `suivi-livraisons.json` (Service / Logistics)
  * `role-chauffeur.json` (Role / Occupation)
  * `konnect-payment-gateway.json` (Service / FinancialService)
  * `konnect-sandbox-account.json` (Service / TechService)
  * `dawajin-mobile-app.json` (SoftwareApplication / MobileApp)
  * `dawajin-admin-portal.json` (SoftwareApplication / WebApp)
* 11 typed Graph Relationships (`relationships/relationships.json`);
* 3 domain Glossary entries (`glossary/`):
  * `creance-client.json` (DefinedTerm)
  * `stock-volaille.json` (DefinedTerm)
  * `bon-de-livraison.json` (DefinedTerm)
* 1 software documentation Source (`sources/source-dawajin-docs.json`);
* 5 review & technical Citations (`citations/citations.json`);
* 1 application screenshot Media asset (`media/dashboard-creances.json`);
* expected static outputs snapshot (`expected-output/`);
* end-to-end integration tests (`tests/dawajinpro-example.test.ts`).

---

# Required directory structure

```txt
examples/dawajinpro/
├── geocore.config.json
├── package.json
├── README.md
├── knowledge/
│   ├── gestion-creances-clients.md
│   ├── gestion-stock-volaille-oeufs.md
│   ├── suivi-livraisons.md
│   ├── role-chauffeur.md
│   ├── konnect-preproduction.md
│   ├── entities/
│   │   ├── dawajin-pro-saas.json
│   │   ├── creance-client.json
│   │   ├── stock-volaille-oeufs.json
│   │   ├── suivi-livraisons.json
│   │   ├── role-chauffeur.json
│   │   ├── konnect-payment-gateway.json
│   │   ├── konnect-sandbox-account.json
│   │   ├── dawajin-mobile-app.json
│   │   └── dawajin-admin-portal.json
│   ├── glossary/
│   │   ├── creance-client.json
│   │   ├── stock-volaille.json
│   │   └── bon-de-livraison.json
│   ├── relationships/
│   │   └── relationships.json
│   ├── sources/
│   │   └── source-dawajin-docs.json
│   ├── citations/
│   │   └── citations.json
│   └── media/
│       └── dashboard-creances.json
├── expected-output/
│   ├── fr/
│   │   ├── gestion-creances-clients.md
│   │   ├── gestion-creances-clients.json
│   │   ├── gestion-creances-clients.schema.json
│   │   ├── gestion-stock-volaille-oeufs.md
│   │   ├── gestion-stock-volaille-oeufs.json
│   │   ├── gestion-stock-volaille-oeufs.schema.json
│   │   ├── konnect-preproduction.md
│   │   ├── konnect-preproduction.json
│   │   ├── konnect-preproduction.schema.json
│   │   ├── role-chauffeur.md
│   │   ├── role-chauffeur.json
│   │   ├── role-chauffeur.schema.json
│   │   ├── suivi-livraisons.md
│   │   ├── suivi-livraisons.json
│   │   └── suivi-livraisons.schema.json
│   ├── search-index.json
│   ├── llms.txt
│   ├── llms-full.txt
│   ├── sitemap.xml
│   └── manifest.json
└── tests/
    └── dawajinpro-example.test.ts
```

---

# Acceptance Criteria

1. `geocore inspect` accurately counts 5 objects, 9 entities, 11 relationships, 3 glossary entries, 5 citations, 1 source, 1 media.
2. `geocore validate` passes all 10 validation pipeline stages with zero errors and zero critical issues.
3. `geocore export` writes all 20 static assets matching the expected output specifications.
4. Schema.org outputs contain valid `SoftwareApplication`, `TechArticle`, and `DefinedTerm` representations.
5. All integration tests pass in `tests/dawajinpro-example.test.ts`.
