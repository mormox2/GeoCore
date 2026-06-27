import { KnowledgeRelationship } from "./relationship.js";
export type GraphNodeType = "knowledge-object" | "entity" | "author" | "source" | "citation" | "media" | "collection" | "taxonomy-term" | "glossary-entry" | "external-reference";
export type GraphNode<T = any> = {
    id: string;
    type: GraphNodeType;
    label?: string;
    data?: T;
};
export type GraphRegistry = {
    nodes: GraphNode[];
    relationships: KnowledgeRelationship[];
};
