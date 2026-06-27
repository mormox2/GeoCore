/**
 * Deduplicates an array of strings while preserving the original order.
 * Does not mutate the input array.
 */
export function dedupeSearchValues(values) {
    if (!values)
        return [];
    const seen = new Set();
    const result = [];
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
export function normalizeSearchText(value) {
    if (!value)
        return "";
    return value.replace(/\s+/g, " ").trim();
}
/**
 * Generates a deterministic SearchDocument ID based on sourceType and sourceId.
 */
export function createSearchDocumentId(sourceType, sourceId) {
    return `searchdoc_${sourceType}_${sourceId}`;
}
/**
 * Returns true if the SearchDocument is public.
 * A public document must have status 'published' and visibility 'public'.
 */
export function isPublicSearchDocument(document) {
    return document.status === "published" && document.visibility === "public";
}
/**
 * Returns true if the SearchDocument is internal.
 * An internal document must not have visibility 'private' or 'hidden'.
 */
export function isInternalSearchDocument(document) {
    return document.visibility !== "private" && document.visibility !== "hidden";
}
