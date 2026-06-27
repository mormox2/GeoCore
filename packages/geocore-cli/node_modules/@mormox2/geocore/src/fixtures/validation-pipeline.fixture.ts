import { KnowledgeDataset } from "../types/knowledge-dataset.js";
import { rtimidentalFixture, rtimiDentalRelationships } from "./rtimidental.fixture.js";
import { dawajinproFixture, dawajinRelationships } from "./dawajinpro.fixture.js";
import { KnowledgeEntity } from "../types/entity.js";

const rtimiDentalEntities: KnowledgeEntity[] = [
  {
    id: "entity_scaling",
    type: "dental_concept",
    canonicalName: "Détartrage",
    definition: "Action d'éliminer le tartre des dents.",
    language: "fr",
    status: "published",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
  },
  {
    id: "entity_tartar",
    type: "dental_concept",
    canonicalName: "Tartre",
    definition: "Dépôt calcaire qui se forme sur les dents.",
    language: "fr",
    status: "published",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
  },
];

export const rtimiDentalDataset: KnowledgeDataset = {
  id: "rtimi-dental-dataset",
  name: "RTimi Dental Dataset",
  objects: [rtimidentalFixture],
  entities: rtimiDentalEntities,
  relationships: rtimiDentalRelationships,
  collections: [],
  taxonomyTerms: [],
  glossaryEntries: [],
  sources: [],
  citations: [],
  media: [],
  loadedAt: "2026-06-25T10:00:00Z",
  diagnostics: [],
};

const dawajinProEntities: KnowledgeEntity[] = [
  {
    id: "entity_customer_balance",
    type: "business_concept",
    canonicalName: "Solde client",
    definition: "Le montant net dû par un client.",
    language: "fr",
    status: "published",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
  },
  {
    id: "entity_invoice",
    type: "business_concept",
    canonicalName: "Facture",
    definition: "Un document commercial.",
    language: "fr",
    status: "published",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
  },
  {
    id: "entity_payment",
    type: "business_concept",
    canonicalName: "Paiement",
    definition: "Un transfert de fonds.",
    language: "fr",
    status: "published",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
  },
];

export const dawajinProDataset: KnowledgeDataset = {
  id: "dawajin-pro-dataset",
  name: "Dawajin Pro Dataset",
  objects: [dawajinproFixture],
  entities: dawajinProEntities,
  relationships: dawajinRelationships,
  collections: [],
  taxonomyTerms: [],
  glossaryEntries: [],
  sources: [],
  citations: [],
  media: [],
  loadedAt: "2026-06-25T10:00:00Z",
  diagnostics: [],
};
