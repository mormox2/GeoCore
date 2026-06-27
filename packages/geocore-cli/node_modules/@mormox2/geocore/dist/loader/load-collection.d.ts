import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { KnowledgeCollection } from "../types/collection.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
/**
 * Loads a KnowledgeCollection from raw knowledge input.
 */
export declare function loadCollection(input: RawKnowledgeInput): {
    collection?: KnowledgeCollection;
    diagnostics: LoaderDiagnostic[];
};
