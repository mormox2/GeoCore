import { KnowledgeObject } from "../types/knowledge-object.js";
import { GraphNode } from "../types/graph.js";
import { KnowledgeRelationship } from "../types/relationship.js";

export const dawajinproFixture: KnowledgeObject = {
  id: "ko_customer_balance_management",
  slug: "gestion-creances-clients",
  title: "Gestion des créances clients",
  summary: "Guide pour comprendre et suivre les soldes clients dans Dawajin Pro.",
  body: "La gestion des créances clients permet de suivre les dettes et les paiements des clients.",
  language: "fr",
  status: "published",
  version: "1.0.0",
  createdAt: "2026-06-25T10:00:00Z",
  updatedAt: "2026-06-25T10:00:00Z",
  author: "author_dawajin_team",
};

export const dawajinNodes: GraphNode[] = [
  { id: "ko_customer_balance_management", type: "knowledge-object", label: "Gestion des créances clients" },
  { id: "entity_customer_balance", type: "entity", label: "Solde client" },
  { id: "entity_invoice", type: "entity", label: "Facture" },
  { id: "entity_payment", type: "entity", label: "Paiement" },
  { id: "author_dawajin_team", type: "author", label: "Dawajin Team" }
];

export const dawajinRelationships: KnowledgeRelationship[] = [
  {
    id: "rel_dawajin_explains",
    sourceId: "ko_customer_balance_management",
    targetId: "entity_customer_balance",
    type: "explains",
    strength: "canonical",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z"
  },
  {
    id: "rel_dawajin_mentions_invoice",
    sourceId: "ko_customer_balance_management",
    targetId: "entity_invoice",
    type: "mentions",
    strength: "medium",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z"
  },
  {
    id: "rel_dawajin_mentions_payment",
    sourceId: "ko_customer_balance_management",
    targetId: "entity_payment",
    type: "mentions",
    strength: "medium",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z"
  },
  {
    id: "rel_dawajin_authored_by",
    sourceId: "ko_customer_balance_management",
    targetId: "author_dawajin_team",
    type: "authored_by",
    strength: "canonical",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z"
  }
];
