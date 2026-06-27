import { GraphNode, GraphRegistry } from "../types/graph.js";
import { KnowledgeRelationship } from "../types/relationship.js";

export function createGraphRegistry(
  nodes: GraphNode[] = [],
  relationships: KnowledgeRelationship[] = []
): GraphRegistry {
  return { nodes, relationships };
}

export function findNodeById(registry: GraphRegistry, id: string): GraphNode | undefined {
  return registry.nodes.find((n) => n.id === id);
}

export function hasNode(registry: GraphRegistry, id: string): boolean {
  return registry.nodes.some((n) => n.id === id);
}

export function getOutgoingRelationships(
  registry: GraphRegistry,
  nodeId: string
): KnowledgeRelationship[] {
  return registry.relationships.filter((r) => r.sourceId === nodeId);
}

export function getIncomingRelationships(
  registry: GraphRegistry,
  nodeId: string
): KnowledgeRelationship[] {
  return registry.relationships.filter((r) => r.targetId === nodeId);
}

export function getRelationshipsForNode(
  registry: GraphRegistry,
  nodeId: string
): KnowledgeRelationship[] {
  return registry.relationships.filter((r) => r.sourceId === nodeId || r.targetId === nodeId);
}
