import { isSitemapPublicObject } from "./sitemap-utils.js";
/**
 * Filters knowledge objects to those eligible for sitemap inclusion.
 * Objects must be public and published. Optionally filtered by language.
 * Does not mutate the input object list.
 */
export function filterSitemapPublicObjects(input) {
    const { objects, language } = input;
    return objects.filter((obj) => {
        // 1. Must be public and published
        if (!isSitemapPublicObject(obj)) {
            return false;
        }
        // 2. Language filter if provided
        if (language !== undefined && obj.language !== language) {
            return false;
        }
        return true;
    });
}
/**
 * Returns objects that were excluded from the sitemap (non-public or draft).
 */
export function filterSitemapExcludedObjects(input) {
    const { objects, language } = input;
    return objects.filter((obj) => {
        if (!isSitemapPublicObject(obj))
            return true;
        if (language !== undefined && obj.language !== language)
            return true;
        return false;
    });
}
