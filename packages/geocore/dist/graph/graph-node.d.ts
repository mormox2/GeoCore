import { GraphNode, GraphNodeType } from "../types/graph.js";
export declare function createGraphNode<T = any>(id: string, type: GraphNodeType, label?: string, data?: T): GraphNode<T>;
