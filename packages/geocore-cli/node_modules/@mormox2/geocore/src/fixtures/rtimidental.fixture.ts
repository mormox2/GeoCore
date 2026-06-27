import { KnowledgeObject } from "../types/knowledge-object.js";
import { GraphNode } from "../types/graph.js";
import { KnowledgeRelationship } from "../types/relationship.js";

/**
 * Canonical site URL for the RTimi Dental fixture. Used by the route resolver
 * to build absolute canonical URLs. Never invent a domain in callers.
 */
export const rtimiDentalSiteUrl = "https://rtimidental.tn";

/**
 * Expected route values for the RTimi Dental knowledge object, asserted by the
 * route fixture tests. Derived from slug + language via the default pattern.
 */
export const rtimiDentalExpectedRoute = {
  path: "/fr/detartrage-abime-t-il-les-dents",
  canonicalUrl: "https://rtimidental.tn/fr/detartrage-abime-t-il-les-dents",
  language: "fr",
  status: "published",
  visibility: "public",
} as const;

export const rtimidentalFixture: KnowledgeObject = {
  id: "ko_detartrage_abime_dents",
  slug: "detartrage-abime-t-il-les-dents",
  title: "Le détartrage abîme-t-il les dents ?",
  summary: "Réponse claire sur les effets du détartrage sur l'émail et les gencives.",
  body: "Non, le détartrage n'abîme pas les dents. Il permet d'éliminer le tartre accumulé.",
  language: "fr",
  status: "published",
  version: "1.0.0",
  createdAt: "2026-06-25T10:00:00Z",
  updatedAt: "2026-06-25T10:00:00Z",
  author: "author_dr_mossaab_rtimi",
};

export const rtimiDentalNodes: GraphNode[] = [
  { id: "ko_detartrage_abime_dents", type: "knowledge-object", label: "Le détartrage abîme-t-il les dents ?" },
  { id: "entity_scaling", type: "entity", label: "Detartrage" },
  { id: "entity_tartar", type: "entity", label: "Tartre" },
  { id: "author_dr_mossaab_rtimi", type: "author", label: "Dr Mossaab Rtimi" }
];

export const rtimiDentalRelationships: KnowledgeRelationship[] = [
  {
    id: "rel_rtimi_explains",
    sourceId: "ko_detartrage_abime_dents",
    targetId: "entity_scaling",
    type: "explains",
    strength: "canonical",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z"
  },
  {
    id: "rel_rtimi_mentions",
    sourceId: "ko_detartrage_abime_dents",
    targetId: "entity_tartar",
    type: "mentions",
    strength: "medium",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z"
  },
  {
    id: "rel_rtimi_authored_by",
    sourceId: "ko_detartrage_abime_dents",
    targetId: "author_dr_mossaab_rtimi",
    type: "authored_by",
    strength: "canonical",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z"
  }
];
