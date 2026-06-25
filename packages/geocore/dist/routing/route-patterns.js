/**
 * Default route patterns. Patterns support the :language, :slug and :type
 * placeholders. There is intentionally no complex pattern engine — patterns
 * are a thin projection from validated knowledge to predictable paths.
 */
export const DEFAULT_ROUTE_PATTERNS = {
    knowledgeObject: "/:language/:slug",
    collection: "/:language/collections/:slug",
    glossaryEntry: "/:language/glossary/:slug",
    documentation: "/:language/docs/:slug",
    media: "/:language/media/:slug",
};
/**
 * Merge a caller-provided pattern config over the defaults without mutating
 * either side.
 */
export function resolveRoutePatterns(override) {
    return {
        knowledgeObject: override?.knowledgeObject ?? DEFAULT_ROUTE_PATTERNS.knowledgeObject,
        collection: override?.collection ?? DEFAULT_ROUTE_PATTERNS.collection,
        glossaryEntry: override?.glossaryEntry ?? DEFAULT_ROUTE_PATTERNS.glossaryEntry,
        documentation: override?.documentation ?? DEFAULT_ROUTE_PATTERNS.documentation,
        media: override?.media ?? DEFAULT_ROUTE_PATTERNS.media,
    };
}
