import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { GlossaryEntry } from "../types/glossary.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
/**
 * Loads a GlossaryEntry from raw knowledge input.
 */
export declare function loadGlossaryEntry(input: RawKnowledgeInput): {
    glossaryEntry?: GlossaryEntry;
    diagnostics: LoaderDiagnostic[];
};
