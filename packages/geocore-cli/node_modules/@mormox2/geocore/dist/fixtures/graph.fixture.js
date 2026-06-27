import { rtimiDentalNodes, rtimiDentalRelationships } from "./rtimidental.fixture.js";
import { dawajinNodes, dawajinRelationships } from "./dawajinpro.fixture.js";
export const rtimiDentalGraphRegistry = {
    nodes: rtimiDentalNodes,
    relationships: rtimiDentalRelationships,
};
export const dawajinProGraphRegistry = {
    nodes: dawajinNodes,
    relationships: dawajinRelationships,
};
export const combinedGraphRegistry = {
    nodes: [...rtimiDentalNodes, ...dawajinNodes],
    relationships: [...rtimiDentalRelationships, ...dawajinRelationships],
};
