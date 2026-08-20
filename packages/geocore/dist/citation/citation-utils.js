/**
 * Returns true if the source has an active status.
 */
export function isActiveSource(source) {
    return source.status === "active";
}
/**
 * Returns true if the source is publicly visible.
 */
export function isPublicSource(source) {
    return source.visibility === "public" || source.visibility === undefined;
}
/**
 * Returns true if the citation is active.
 */
export function isActiveCitation(citation) {
    return citation.status === "active";
}
/**
 * Returns true if the citation has a high or authoritative confidence level.
 */
export function isHighConfidenceCitation(citation) {
    return citation.confidence === "high" || citation.confidence === "authoritative";
}
/**
 * Returns true if the citation references a valid source in the given source map.
 */
export function hasResolvedSource(citation, sourceMap) {
    return sourceMap.has(citation.sourceId);
}
/**
 * Builds a Map<sourceId, KnowledgeSource> from an array of sources for fast lookups.
 */
export function buildSourceMap(sources) {
    const map = new Map();
    for (const source of sources) {
        map.set(source.id, source);
    }
    return map;
}
/**
 * Returns all citations that reference a specific targetId.
 */
export function getCitationsForTarget(citations, targetId) {
    return citations.filter((c) => c.targetId === targetId);
}
/**
 * Returns all citations that reference a specific sourceId.
 */
export function getCitationsForSource(citations, sourceId) {
    return citations.filter((c) => c.sourceId === sourceId);
}
/**
 * Returns the unique set of sourceIds referenced by a citation array.
 */
export function extractSourceIds(citations) {
    const seen = new Set();
    const result = [];
    for (const citation of citations) {
        if (!seen.has(citation.sourceId)) {
            seen.add(citation.sourceId);
            result.push(citation.sourceId);
        }
    }
    return result;
}
/**
 * Returns the unique set of targetIds referenced by a citation array.
 */
export function extractTargetIds(citations) {
    const seen = new Set();
    const result = [];
    for (const citation of citations) {
        if (!seen.has(citation.targetId)) {
            seen.add(citation.targetId);
            result.push(citation.targetId);
        }
    }
    return result;
}
/**
 * Creates a deterministic citation ID from a sourceId and targetId.
 */
export function createCitationId(sourceId, targetId) {
    return `citation_${sourceId}_to_${targetId}`;
}
