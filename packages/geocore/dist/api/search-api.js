import { createApiListResponse } from "./api-response.js";
import { createSearchDocumentFromKnowledgeObject } from "../search/search-document.js";
import { filterSearchDocuments } from "../search/search-filter.js";
import { resolveMetadata } from "../metadata/resolve-metadata.js";
/**
 * Searches the dataset for knowledge objects matching the query.
 * Only returns public, published knowledge when visibility is 'public'.
 */
export function searchKnowledge(dataset, request) {
    const visibility = request.visibility ?? "public";
    const normalizedQuery = request.query.toLowerCase().trim();
    // Build search documents from all public objects
    const documents = [];
    for (const object of dataset.objects) {
        // Resolve metadata for this object
        const metadata = resolveMetadata({
            object,
            entities: dataset.entities,
            collections: dataset.collections,
            defaults: {},
        });
        const doc = createSearchDocumentFromKnowledgeObject({
            object,
            metadata,
            relationships: dataset.relationships,
            entities: dataset.entities,
            collections: dataset.collections,
            citations: dataset.citations,
        });
        documents.push(doc);
    }
    // Apply visibility filter
    const visibilityFiltered = filterSearchDocuments(documents, { visibility });
    // Apply language filter
    const languageFiltered = request.language
        ? visibilityFiltered.filter((d) => d.language === request.language)
        : visibilityFiltered;
    // Apply text search
    const matched = languageFiltered.filter((doc) => {
        const text = doc.text.toLowerCase();
        const title = doc.title.toLowerCase();
        const summary = (doc.summary ?? "").toLowerCase();
        return (text.includes(normalizedQuery) ||
            title.includes(normalizedQuery) ||
            summary.includes(normalizedQuery));
    });
    const total = matched.length;
    const limited = request.limit !== undefined ? matched.slice(0, request.limit) : matched;
    return createApiListResponse(limited, { visibility, total });
}
