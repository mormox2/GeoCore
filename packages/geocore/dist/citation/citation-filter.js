/**
 * Filters an array of KnowledgeCitation by status, targetId, sourceId, purpose, or confidence.
 */
export function filterCitations(citations, options) {
    return citations.filter((citation) => {
        if (options.status !== undefined && citation.status !== options.status) {
            return false;
        }
        if (options.targetId !== undefined && citation.targetId !== options.targetId) {
            return false;
        }
        if (options.sourceId !== undefined && citation.sourceId !== options.sourceId) {
            return false;
        }
        if (options.purpose !== undefined && citation.purpose !== options.purpose) {
            return false;
        }
        if (options.confidence !== undefined && citation.confidence !== options.confidence) {
            return false;
        }
        return true;
    });
}
/**
 * Returns only active, non-removed citations.
 */
export function filterActiveCitations(citations) {
    return citations.filter((c) => c.status === "active");
}
/**
 * Filters an array of KnowledgeSource by status, visibility, or trustLevel.
 */
export function filterSources(sources, options) {
    return sources.filter((source) => {
        if (options.status !== undefined && source.status !== options.status) {
            return false;
        }
        if (options.visibility !== undefined && source.visibility !== options.visibility) {
            return false;
        }
        if (options.trustLevel !== undefined && source.trustLevel !== options.trustLevel) {
            return false;
        }
        return true;
    });
}
/**
 * Returns only active, publicly visible sources.
 */
export function filterPublicSources(sources) {
    return sources.filter((s) => s.status === "active" && (s.visibility === "public" || s.visibility === undefined));
}
