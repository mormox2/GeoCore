import type { KnowledgeObject, KnowledgeObjectVisibility } from "../types/knowledge-object.js";
/**
 * Returns the declared visibility of a Knowledge Object, from the top-level `visibility`
 * field (e.g. set in Markdown frontmatter) or, for older datasets, `metadata.visibility`.
 */
export declare function readObjectVisibility(object: KnowledgeObject): KnowledgeObjectVisibility | string | undefined;
/**
 * Single source of truth for public exposure: the object is published and either declares
 * no visibility or declares it "public". Used by the API, search, vectorization, llms.txt,
 * sitemaps, routes and static exports.
 */
export declare function isPublicKnowledgeObject(object: KnowledgeObject): boolean;
/** True when the object must not be exposed even to internal callers ("private" / "hidden"). */
export declare function isNeverExposedObject(object: KnowledgeObject): boolean;
