import { GraphNode, GraphRegistry } from "../types/graph.js";
import { KnowledgeRelationship } from "../types/relationship.js";
export declare function createGraphRegistry(nodes?: GraphNode[], relationships?: KnowledgeRelationship[]): GraphRegistry;
export declare function findNodeById(registry: GraphRegistry, id: string): GraphNode | undefined;
export declare function hasNode(registry: GraphRegistry, id: string): boolean;
export declare function getOutgoingRelationships(registry: GraphRegistry, nodeId: string): KnowledgeRelationship[];
export declare function getIncomingRelationships(registry: GraphRegistry, nodeId: string): KnowledgeRelationship[];
export declare function getRelationshipsForNode(registry: GraphRegistry, nodeId: string): KnowledgeRelationship[];
