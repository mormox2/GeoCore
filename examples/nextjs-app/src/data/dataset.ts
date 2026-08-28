import type { KnowledgeDataset } from "@mormo_mossaab/geocore";
import { rtimidentalFixture, dawajinproFixture } from "@mormo_mossaab/geocore";

/**
 * Combined reference KnowledgeDataset for the Next.js sample application.
 */
export const appDataset: KnowledgeDataset = {
  id: "dataset_nextjs_reference",
  name: "GeoCore Next.js Reference Knowledge Platform",
  objects: [
    rtimidentalFixture,
    dawajinproFixture,
    {
      id: "ko_blanchiment_dentaire",
      slug: "blanchiment-dentaire-securite",
      title: "Le blanchiment dentaire est-il sans danger ?",
      summary: "Tout savoir sur le blanchiment dentaire professionnel, les produits utilisés et la préservation de l'émail.",
      body: "## Blanchiment dentaire au fauteuil\n\nLe blanchiment dentaire médical utilise du peroxyde d'hydrogène sous contrôle strict.\nIl ne dégrade pas l'émail lorsqu'il respecte les concentrations légales recommandées par l'ADF et l'OMS.",
      language: "fr",
      status: "published",
      version: "1.0.0",
      author: "author_dr_mossaab_rtimi",
      tags: ["dentisterie", "esthetique", "blanchiment", "securite"],
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
  ],
  entities: [
    {
      id: "entity_scaling",
      type: "procedure",
      canonicalName: "Détartrage",
      definition: "Élimination mécanique ou ultrasonique de la plaque dentaire calcifiée.",
      language: "fr",
      status: "published",
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
    {
      id: "entity_whitening",
      type: "procedure",
      canonicalName: "Blanchiment Dentaire",
      definition: "Éclaircissement des teintes de l'émail dentaire via des agents oxydants contrôlés.",
      language: "fr",
      status: "published",
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
  ],
  relationships: [
    {
      id: "rel_detartrage_scaling",
      sourceId: "ko_detartrage_abime_dents",
      targetId: "entity_scaling",
      type: "explains",
      strength: "strong",
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
  ],
  collections: [],
  taxonomyTerms: [],
  glossaryEntries: [],
  sources: [
    {
      id: "src_who_oral_health",
      type: "clinical-guideline",
      title: "World Health Organization (WHO) — Oral Health Programme",
      url: "https://www.who.int/news-room/fact-sheets/detail/oral-health",
      trustLevel: "authoritative",
      status: "active",
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
  ],
  citations: [
    {
      id: "cit_who_scaling",
      sourceId: "src_who_oral_health",
      targetId: "ko_detartrage_abime_dents",
      purpose: "verifies",
      status: "active",
      confidence: "authoritative",
      quote: "Routine scaling and periodontal care effectively remove supra and subgingival calculus without harming sound enamel.",
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
  ],
  media: [
    {
      id: "media_scaling_infographic",
      type: "image",
      title: "Schéma anatomique du détartrage ultrasonique",
      source: "https://rtimidental.tn/images/detartrage-schema.webp",
      altText: "Illustration médicale montrant l'embout ultrasonique nettoyant le tartre sans toucher l'émail",
      visibility: "public",
      status: "active",
      relatedObjectIds: ["ko_detartrage_abime_dents"],
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
  ],
  loadedAt: new Date().toISOString(),
  diagnostics: [],
};
