import { GenerateSitemapInput } from "../types/sitemap.js";
import { KnowledgeObject } from "../types/knowledge-object.js";
/**
 * Filters knowledge objects to those eligible for sitemap inclusion.
 * Objects must be public and published. Optionally filtered by language.
 * Does not mutate the input object list.
 */
export declare function filterSitemapPublicObjects(input: GenerateSitemapInput): KnowledgeObject[];
/**
 * Returns objects that were excluded from the sitemap (non-public or draft).
 */
export declare function filterSitemapExcludedObjects(input: GenerateSitemapInput): KnowledgeObject[];
