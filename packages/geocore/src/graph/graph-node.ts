import { GraphNode, GraphNodeType } from "../types/graph.js";

export function createGraphNode<T = unknown>(
  id: string,
  type: GraphNodeType,
  label?: string,
  data?: T
): GraphNode<T> {
  return {
    id,
    type,
    label,
    data,
  };
}
