import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
/**
 * Loads a KnowledgeObject from raw Markdown knowledge input.
 */
export declare function loadMarkdownKnowledge(input: RawKnowledgeInput): {
    object?: KnowledgeObject;
    diagnostics: LoaderDiagnostic[];
};
