import { buildSourceMap, getCitationsForTarget, extractSourceIds } from "./citation-utils.js";
import { filterActiveCitations, filterPublicSources } from "./citation-filter.js";
/**
 * Extracts all citations and their resolved sources from a KnowledgeDataset.
 * Returns only active citations and publicly visible sources by default.
 */
export function extractCitationsFromDataset(dataset, options = {}) {
    const allCitations = dataset.citations ?? [];
    const allSources = dataset.sources ?? [];
    const citations = options.publicOnly
        ? filterActiveCitations(allCitations)
        : allCitations;
    const sources = options.publicOnly
        ? filterPublicSources(allSources)
        : allSources;
    const sourceMap = buildSourceMap(sources);
    // Group citations by targetId for fast access
    const citationsByTarget = new Map();
    for (const citation of citations) {
        if (!citationsByTarget.has(citation.targetId)) {
            citationsByTarget.set(citation.targetId, []);
        }
        citationsByTarget.get(citation.targetId).push(citation);
    }
    return { citations, sources, sourceMap, citationsByTarget };
}
/**
 * Extracts all citations for a specific targetId from a KnowledgeDataset.
 */
export function extractCitationsForTarget(dataset, targetId) {
    const allCitations = dataset.citations ?? [];
    return getCitationsForTarget(allCitations, targetId);
}
/**
 * Extracts all unique source IDs referenced by active citations in the dataset.
 */
export function extractReferencedSourceIds(dataset) {
    const activeCitations = filterActiveCitations(dataset.citations ?? []);
    return extractSourceIds(activeCitations);
}
/**
 * Returns all sources that are referenced by at least one active citation.
 */
export function extractUsedSources(dataset) {
    const referencedIds = new Set(extractReferencedSourceIds(dataset));
    const allSources = dataset.sources ?? [];
    return allSources.filter((s) => referencedIds.has(s.id));
}
