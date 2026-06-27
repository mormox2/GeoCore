import { SearchDocument } from "../types/search-document.js";
/**
 * Deduplicates an array of strings while preserving the original order.
 * Does not mutate the input array.
 */
export declare function dedupeSearchValues(values?: string[]): string[];
/**
 * Normalizes text by collapsing all consecutive whitespace characters into a single space
 * and trimming the result.
 */
export declare function normalizeSearchText(value: string): string;
/**
 * Generates a deterministic SearchDocument ID based on sourceType and sourceId.
 */
export declare function createSearchDocumentId(sourceType: string, sourceId: string): string;
/**
 * Returns true if the SearchDocument is public.
 * A public document must have status 'published' and visibility 'public'.
 */
export declare function isPublicSearchDocument(document: SearchDocument): boolean;
/**
 * Returns true if the SearchDocument is internal.
 * An internal document must not have visibility 'private' or 'hidden'.
 */
export declare function isInternalSearchDocument(document: SearchDocument): boolean;
