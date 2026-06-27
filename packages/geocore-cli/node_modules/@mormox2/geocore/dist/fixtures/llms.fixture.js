import { rtimidentalFixture, rtimiDentalRelationships } from "./rtimidental.fixture.js";
import { dawajinproFixture, dawajinRelationships } from "./dawajinpro.fixture.js";
import { rtimiDentalResolvedMetadata, dawajinProResolvedMetadata } from "./search.fixture.js";
import { entitiesFixture, collectionsFixture, citationsFixture } from "./metadata.fixture.js";
export const rtimiDentalLlmsInput = {
    id: "llms_rtimi",
    siteName: "RTimi Dental",
    siteDescription: "Public dental health repository.",
    siteUrl: "https://rtimidental.example.com",
    objects: [rtimidentalFixture],
    metadata: {
        ko_detartrage_abime_dents: rtimiDentalResolvedMetadata,
    },
    relationships: rtimiDentalRelationships,
    entities: entitiesFixture.filter((e) => ["entity_scaling", "entity_tartar"].includes(e.id)),
    collections: collectionsFixture.filter((c) => c.id === "col_rtimi_dental_faq"),
    citations: citationsFixture,
};
export const dawajinProLlmsInput = {
    id: "llms_dawajin",
    siteName: "Dawajin Pro",
    siteDescription: "AI-native SME balance and poultry guides.",
    siteUrl: "https://dawajinpro.example.com",
    objects: [dawajinproFixture],
    metadata: {
        ko_customer_balance_management: dawajinProResolvedMetadata,
    },
    relationships: dawajinRelationships,
    entities: entitiesFixture.filter((e) => ["entity_customer_balance", "entity_invoice", "entity_payment"].includes(e.id)),
    collections: collectionsFixture.filter((c) => c.id === "col_dawajin_academy_balances"),
    citations: citationsFixture,
};
