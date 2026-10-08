const NEVER_EXPOSED = new Set(["private", "hidden"]);
/**
 * Returns the declared visibility of a Knowledge Object, from the top-level `visibility`
 * field (e.g. set in Markdown frontmatter) or, for older datasets, `metadata.visibility`.
 */
export function readObjectVisibility(object) {
    return object.visibility ?? object.metadata?.visibility;
}
/**
 * Single source of truth for public exposure: the object is published and either declares
 * no visibility or declares it "public". Used by the API, search, vectorization, llms.txt,
 * sitemaps, routes and static exports.
 */
export function isPublicKnowledgeObject(object) {
    if (object.status !== "published")
        return false;
    const visibility = readObjectVisibility(object);
    return visibility === undefined || visibility === "public";
}
/** True when the object must not be exposed even to internal callers ("private" / "hidden"). */
export function isNeverExposedObject(object) {
    const visibility = readObjectVisibility(object);
    return visibility !== undefined && NEVER_EXPOSED.has(visibility);
}
