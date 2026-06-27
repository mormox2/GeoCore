import { rtimidentalFixture, rtimiDentalRelationships } from "./rtimidental.fixture.js";
import { dawajinproFixture, dawajinRelationships } from "./dawajinpro.fixture.js";
import { rtimiDentalResolvedMetadata, dawajinProResolvedMetadata } from "./search.fixture.js";
import { entitiesFixture, collectionsFixture, citationsFixture } from "./metadata.fixture.js";
export const rtimiDentalSchemaInput = {
    object: rtimidentalFixture,
    metadata: rtimiDentalResolvedMetadata,
    relationships: rtimiDentalRelationships,
    entities: entitiesFixture.filter((e) => ["entity_scaling", "entity_tartar"].includes(e.id)),
    collections: collectionsFixture.filter((c) => c.id === "col_rtimi_dental_faq"),
    citations: citationsFixture,
};
export const dawajinProSchemaInput = {
    object: dawajinproFixture,
    metadata: dawajinProResolvedMetadata,
    relationships: dawajinRelationships,
    entities: entitiesFixture.filter((e) => ["entity_customer_balance", "entity_invoice", "entity_payment"].includes(e.id)),
    collections: collectionsFixture.filter((c) => c.id === "col_dawajin_academy_balances"),
    citations: citationsFixture,
};
