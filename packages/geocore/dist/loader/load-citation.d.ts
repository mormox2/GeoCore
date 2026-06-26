import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { KnowledgeSource, KnowledgeCitation } from "../types/citation.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
/**
 * Loads a KnowledgeSource from raw knowledge input.
 */
export declare function loadSource(input: RawKnowledgeInput): {
    source?: KnowledgeSource;
    diagnostics: LoaderDiagnostic[];
};
/**
 * Loads a KnowledgeCitation from raw knowledge input.
 */
export declare function loadCitation(input: RawKnowledgeInput): {
    citation?: KnowledgeCitation;
    diagnostics: LoaderDiagnostic[];
};
