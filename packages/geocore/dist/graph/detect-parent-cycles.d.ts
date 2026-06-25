import { GraphRegistry } from "../types/graph.js";
import { ValidationIssue } from "../validation/validation-result.js";
export declare function detectParentCycles(registry: GraphRegistry): ValidationIssue[];
