# Playbook: Domain Knowledge Authoring Guide

This guide is intended for **clinical practitioners, agricultural engineers, and domain editors** writing structured knowledge files for GeoCore repositories (e.g. *RTimi Dental*, *Dawajin Pro*).

---

## 1. Directory Structure

A GeoCore repository is organized in clear markdown and JSON directories:

```txt
my-knowledge-repo/
├── geocore.config.json           Repository configuration
└── knowledge/
    ├── fr/
    │   ├── detartrage-abime-dents.md
    │   └── gingivite-causes.md
    └── ar/
        └── detartrage-abime-dents.md
```

---

## 2. Anatomy of a Knowledge Object File (`.md`)

Each file consists of **YAML Frontmatter** followed by standard **Markdown Content**:

```markdown
---
id: "ko_detartrage_abime_dents"
title: "Le détartrage abîme-t-il les dents ? Vérité scientifique"
summary: "Non, le détartrage n'abîme pas l'émail dentaire lorsqu'il est réalisé avec des instruments à ultrasons professionnels."
slug: "detartrage-abime-les-dents"
language: "fr"
status: "published"
visibility: "public"
author: "Dr Mossaab Rtimi"
reviewer: "Conseil Scientifique RTimi Dental"
entities:
  - "entity_scaling"
  - "entity_enamel"
  - "entity_tartar"
citations:
  - "cit_who_oral_health_2023"
  - "cit_has_parodontologie_2018"
media:
  - "media_ultrasonic_scaler_diagram"
relationships:
  - type: "explains"
    targetId: "entity_scaling"
  - type: "prevents"
    targetId: "entity_periodontitis"
---

# Le détartrage abîme-t-il les dents ?

Le détartrage dentaire est une procédure prophylactique fondamentale...

## Pourquoi cette fausse idée persiste-t-elle ?
Lorsque le tartre est éliminé, les collets dentaires peuvent être temporairement exposés...

## Les recommandations de l'OMS
Un détartrage annuel ou semestriel prévient le déchaussement et la gingivite.
```

---

## 3. Mandatory Frontmatter Fields

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g., `ko_<domain>_<topic>`). |
| `title` | `string` | Clear, authoritative title. |
| `summary` | `string` | 1-2 sentence executive summary used in snippets & RAG context. |
| `slug` | `string` | URL-safe slug for web routing. |
| `language` | `string` | ISO 639-1 code (`fr`, `ar`, `en`). |
| `status` | `enum` | `"draft"`, `"review"`, `"published"`, `"deprecated"`. |
| `visibility`| `enum` | `"public"` (visible on site/search), `"internal"`, `"private"`. |
| `author` | `string` | Verified domain author or clinician name. |

---

## 4. Attaching Citations & Sources

To guarantee scientific authority and zero-hallucination compliance, cite official sources in `geocore.config.json` or manifest:

```json
{
  "sources": [
    {
      "id": "src_who_oral_health",
      "title": "WHO Global Oral Health Status Report",
      "url": "https://www.who.int/publications/i/item/9789240061484",
      "type": "institutional",
      "trustLevel": "authoritative"
    }
  ],
  "citations": [
    {
      "id": "cit_who_oral_health_2023",
      "sourceId": "src_who_oral_health",
      "targetId": "ko_detartrage_abime_dents",
      "purpose": "evidence",
      "quote": "Regular scaling prevents periodontal disease without damaging sound enamel."
    }
  ]
}
```

---

## 5. Local Validation & Preview

Before committing your changes, test them locally using the GeoCore CLI:

```bash
# 1. Run the 10-stage diagnostic validation
npx geocore validate --config ./geocore.config.json

# 2. Inspect graph connectivity & check for orphan topics
npx geocore inspect --config ./geocore.config.json

# 3. Preview your content in the interactive visual studio
npx geocore studio --port 4200
```
