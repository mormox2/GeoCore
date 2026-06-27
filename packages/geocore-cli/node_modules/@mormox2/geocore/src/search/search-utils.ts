import { SearchDocument } from "../types/search-document.js";

/**
 * Deduplicates an array of strings while preserving the original order.
 * Does not mutate the input array.
 */
export function dedupeSearchValues(values?: string[]): string[] {
  if (!values) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const val of values) {
    if (!seen.has(val)) {
      seen.add(val);
      result.push(val);
    }
  }
  return result;
}

/**
 * Normalizes text by collapsing all consecutive whitespace characters into a single space
 * and trimming the result.
 */
export function normalizeSearchText(value: string): string {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Generates a deterministic SearchDocument ID based on sourceType and sourceId.
 */
export function createSearchDocumentId(sourceType: string, sourceId: string): string {
  return `searchdoc_${sourceType}_${sourceId}`;
}

/**
 * Returns true if the SearchDocument is public.
 * A public document must have status 'published' and visibility 'public'.
 */
export function isPublicSearchDocument(document: SearchDocument): boolean {
  return document.status === "published" && document.visibility === "public";
}

/**
 * Returns true if the SearchDocument is internal.
 * An internal document must not have visibility 'private' or 'hidden'.
 */
export function isInternalSearchDocument(document: SearchDocument): boolean {
  return document.visibility !== "private" && document.visibility !== "hidden";
}
