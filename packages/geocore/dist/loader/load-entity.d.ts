import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { KnowledgeEntity } from "../types/entity.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
/**
 * Loads a KnowledgeEntity from raw knowledge input.
 */
export declare function loadEntity(input: RawKnowledgeInput): {
    entity?: KnowledgeEntity;
    diagnostics: LoaderDiagnostic[];
};
