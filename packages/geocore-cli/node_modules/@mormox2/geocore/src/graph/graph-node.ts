import { GraphNode, GraphNodeType } from "../types/graph.js";

export function createGraphNode<T = any>(
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
