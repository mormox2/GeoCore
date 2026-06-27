import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
/**
 * Loads a KnowledgeObject from raw knowledge input.
 */
export declare function loadKnowledgeObject(input: RawKnowledgeInput): {
    object?: KnowledgeObject;
    diagnostics: LoaderDiagnostic[];
};
