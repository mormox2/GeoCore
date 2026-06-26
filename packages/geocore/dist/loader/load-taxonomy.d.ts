import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { TaxonomyTerm } from "../types/taxonomy.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
/**
 * Loads a TaxonomyTerm from raw knowledge input.
 */
export declare function loadTaxonomyTerm(input: RawKnowledgeInput): {
    taxonomyTerm?: TaxonomyTerm;
    diagnostics: LoaderDiagnostic[];
};
