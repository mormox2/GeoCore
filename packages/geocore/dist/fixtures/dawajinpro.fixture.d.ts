import { KnowledgeObject } from "../types/knowledge-object.js";
import { GraphNode } from "../types/graph.js";
import { KnowledgeRelationship } from "../types/relationship.js";
/**
 * Canonical site URL for the Dawajin Pro fixture. Used by the route resolver
 * to build absolute canonical URLs. Never invent a domain in callers.
 */
export declare const dawajinProSiteUrl = "https://dawajinpro.tn";
/**
 * Expected route values for the Dawajin Pro knowledge object, asserted by the
 * route fixture tests. Derived from slug + language via the default pattern.
 */
export declare const dawajinProExpectedRoute: {
    readonly path: "/fr/gestion-creances-clients";
    readonly canonicalUrl: "https://dawajinpro.tn/fr/gestion-creances-clients";
    readonly language: "fr";
    readonly status: "published";
    readonly visibility: "public";
};
export declare const dawajinproFixture: KnowledgeObject;
export declare const dawajinNodes: GraphNode[];
export declare const dawajinRelationships: KnowledgeRelationship[];
