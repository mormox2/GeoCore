import { isLlmsPublicObject } from "./llms-utils.js";
/**
 * Filters and returns public published KnowledgeObjects matching the language option.
 * Does not mutate the input object list.
 */
export function filterLlmsPublicObjects(input) {
    const { objects, language } = input;
    return objects.filter((obj) => {
        // 1. Must be public and published
        if (!isLlmsPublicObject(obj)) {
            return false;
        }
        // 2. Language filter if provided
        if (language !== undefined && obj.language !== language) {
            return false;
        }
        return true;
    });
}
