import { rtimidentalFixture, rtimiDentalRelationships } from "./rtimidental.fixture.js";
import { dawajinproFixture, dawajinRelationships } from "./dawajinpro.fixture.js";
import { entitiesFixture, collectionsFixture, citationsFixture } from "./metadata.fixture.js";
export const rtimiDentalResolvedMetadata = {
    id: "ko_detartrage_abime_dents",
    slug: "detartrage-abime-t-il-les-dents",
    title: "Le détartrage abîme-t-il les dents ?",
    summary: "Réponse claire sur les effets du détartrage sur l'émail et les gencives.",
    language: "fr",
    version: "1.0.0",
    status: "published",
    author: "author_dr_mossaab_rtimi",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    resolvedAt: "2026-06-25T10:05:00Z",
    resolvedFrom: {
        object: true,
        defaults: false,
        graph: true,
        collections: false,
        entities: true,
        citations: false,
    },
    entities: ["entity_scaling", "entity_tartar"],
    collections: ["col_rtimi_dental_faq"],
};
export const rtimiDentalSearchDocumentInput = {
    object: rtimidentalFixture,
    metadata: rtimiDentalResolvedMetadata,
    relationships: rtimiDentalRelationships,
    entities: entitiesFixture.filter((e) => ["entity_scaling", "entity_tartar"].includes(e.id)),
    collections: collectionsFixture.filter((c) => c.id === "col_rtimi_dental_faq"),
    citations: citationsFixture,
};
export const dawajinProResolvedMetadata = {
    id: "ko_customer_balance_management",
    slug: "gestion-creances-clients",
    title: "Gestion des créances clients",
    summary: "Guide pour comprendre et suivre les soldes clients dans Dawajin Pro.",
    language: "fr",
    version: "1.0.0",
    status: "published",
    author: "author_dawajin_team",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    resolvedAt: "2026-06-25T10:05:00Z",
    resolvedFrom: {
        object: true,
        defaults: false,
        graph: true,
        collections: false,
        entities: true,
        citations: false,
    },
    entities: ["entity_customer_balance", "entity_invoice", "entity_payment"],
    collections: ["col_dawajin_academy_balances"],
};
export const dawajinProSearchDocumentInput = {
    object: dawajinproFixture,
    metadata: dawajinProResolvedMetadata,
    relationships: dawajinRelationships,
    entities: entitiesFixture.filter((e) => ["entity_customer_balance", "entity_invoice", "entity_payment"].includes(e.id)),
    collections: collectionsFixture.filter((c) => c.id === "col_dawajin_academy_balances"),
    citations: citationsFixture,
};
