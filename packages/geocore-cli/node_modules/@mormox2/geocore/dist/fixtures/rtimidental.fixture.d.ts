import { KnowledgeObject } from "../types/knowledge-object.js";
import { GraphNode } from "../types/graph.js";
import { KnowledgeRelationship } from "../types/relationship.js";
/**
 * Canonical site URL for the RTimi Dental fixture. Used by the route resolver
 * to build absolute canonical URLs. Never invent a domain in callers.
 */
export declare const rtimiDentalSiteUrl = "https://rtimidental.tn";
/**
 * Expected route values for the RTimi Dental knowledge object, asserted by the
 * route fixture tests. Derived from slug + language via the default pattern.
 */
export declare const rtimiDentalExpectedRoute: {
    readonly path: "/fr/detartrage-abime-t-il-les-dents";
    readonly canonicalUrl: "https://rtimidental.tn/fr/detartrage-abime-t-il-les-dents";
    readonly language: "fr";
    readonly status: "published";
    readonly visibility: "public";
};
export declare const rtimidentalFixture: KnowledgeObject;
export declare const rtimiDentalNodes: GraphNode[];
export declare const rtimiDentalRelationships: KnowledgeRelationship[];
