import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { KnowledgeRelationship } from "../types/relationship.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
/**
 * Loads a KnowledgeRelationship from raw knowledge input.
 */
export declare function loadRelationship(input: RawKnowledgeInput): {
    relationship?: KnowledgeRelationship;
    diagnostics: LoaderDiagnostic[];
};
