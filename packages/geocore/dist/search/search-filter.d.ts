import { SearchDocument } from "../types/search-document.js";
import { SearchDocumentStatus } from "../types/search.js";
export type SearchFilterOptions = {
    visibility?: "public" | "internal";
    language?: string;
    status?: SearchDocumentStatus;
};
/**
 * Filters a list of SearchDocuments based on visibility, language, and status options.
 */
export declare function filterSearchDocuments(documents: SearchDocument[], options: SearchFilterOptions): SearchDocument[];
