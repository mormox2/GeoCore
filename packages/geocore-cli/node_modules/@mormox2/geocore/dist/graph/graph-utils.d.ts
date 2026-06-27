import { GraphRegistry, GraphNode } from "../types/graph.js";
export declare function getNeighbors(registry: GraphRegistry, nodeId: string): GraphNode[];
export declare function hasPath(registry: GraphRegistry, startNodeId: string, endNodeId: string): boolean;
