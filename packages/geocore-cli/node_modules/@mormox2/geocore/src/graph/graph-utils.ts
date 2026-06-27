import { GraphRegistry, GraphNode } from "../types/graph.js";

export function getNeighbors(registry: GraphRegistry, nodeId: string): GraphNode[] {
  const neighborIds = new Set<string>();

  for (const rel of registry.relationships) {
    if (rel.sourceId === nodeId && rel.targetId) {
      neighborIds.add(rel.targetId);
    } else if (rel.targetId === nodeId && rel.sourceId) {
      neighborIds.add(rel.sourceId);
    }
  }

  return registry.nodes.filter((node) => neighborIds.has(node.id));
}

export function hasPath(registry: GraphRegistry, startNodeId: string, endNodeId: string): boolean {
  const visited = new Set<string>();

  function dfs(currentId: string): boolean {
    if (currentId === endNodeId) {
      return true;
    }
    visited.add(currentId);

    const outgoing = registry.relationships.filter((r) => r.sourceId === currentId);
    for (const rel of outgoing) {
      if (rel.targetId && !visited.has(rel.targetId)) {
        if (dfs(rel.targetId)) {
          return true;
        }
      }
    }
    return false;
  }

  return dfs(startNodeId);
}
