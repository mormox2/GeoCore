import type { LoadKnowledgeInput } from "../types/knowledge-loader.js";

export const rtimiDentalMarkdownContent = `---
id: ko_detartrage_abime_dents_markdown
slug: detartrage-abime-t-il-les-dents
title: Le détartrage abîme-t-il les dents ?
summary: Réponse claire pour les patients sur le détartrage dentaire.
language: fr
status: published
version: 1.0.0
author: author_dr_mossaab_rtimi
entities: entity_scaling, entity_tartar
---

Le détartrage n’abîme pas les dents lorsqu’il est réalisé correctement.`;

export const rtimiDentalLoaderInput: LoadKnowledgeInput = {
  id: "load_rtimidental",
  name: "RTimi Dental",
  inputs: [
    {
      id: "raw_ko_rtimi_md",
      type: "markdown",
      sourcePath: "content/detartrage-abime-t-il-les-dents.md",
      content: rtimiDentalMarkdownContent,
    },
    {
      id: "entity_scaling",
      type: "entity",
      content: {
        id: "entity_scaling",
        type: "dental_concept",
        canonicalName: "Détartrage",
        definition: "Action d'éliminer le tartre des dents.",
        language: "fr",
        status: "published",
      },
    },
    {
      id: "entity_tartar",
      type: "entity",
      content: {
        id: "entity_tartar",
        type: "dental_concept",
        canonicalName: "Tartre",
        definition: "Dépôt calcaire qui se forme sur les dents.",
        language: "fr",
        status: "published",
      },
    },
  ],
};

export const dawajinProObjectContent = {
  id: "ko_customer_balance_management_loaded",
  slug: "gestion-creances-clients",
  title: "Gestion des créances clients",
  summary: "Comprendre et suivre les créances clients dans une activité de distribution avicole.",
  body: "Une créance client représente un montant encore dû by un client.",
  language: "fr",
  status: "published",
  version: "1.0.0",
  author: "author_dawajin_team",
  metadata: {
    entities: [
      "entity_customer_balance",
      "entity_invoice",
      "entity_payment",
    ],
  },
};

export const dawajinProLoaderInput: LoadKnowledgeInput = {
  id: "load_dawajinpro",
  name: "Dawajin Pro",
  inputs: [
    {
      id: "raw_ko_dawajin_obj",
      type: "knowledge-object",
      content: dawajinProObjectContent,
    },
    {
      id: "entity_customer_balance",
      type: "entity",
      content: {
        id: "entity_customer_balance",
        type: "business_concept",
        canonicalName: "Solde client",
        definition: "Le montant net dû par un client.",
        language: "fr",
        status: "published",
      },
    },
  ],
};
