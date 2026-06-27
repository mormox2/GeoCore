import { GraphRegistry } from "../types/graph.js";
import { rtimiDentalNodes, rtimiDentalRelationships } from "./rtimidental.fixture.js";
import { dawajinNodes, dawajinRelationships } from "./dawajinpro.fixture.js";

export const rtimiDentalGraphRegistry: GraphRegistry = {
  nodes: rtimiDentalNodes,
  relationships: rtimiDentalRelationships,
};

export const dawajinProGraphRegistry: GraphRegistry = {
  nodes: dawajinNodes,
  relationships: dawajinRelationships,
};

export const combinedGraphRegistry: GraphRegistry = {
  nodes: [...rtimiDentalNodes, ...dawajinNodes],
  relationships: [...rtimiDentalRelationships, ...dawajinRelationships],
};
