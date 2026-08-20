import { createApiResponse, createNotFoundResponse, createForbiddenResponse } from "./api-response.js";
import { resolveMetadata } from "../metadata/resolve-metadata.js";
import { filterActiveCitations } from "../citation/citation-filter.js";
import { buildSourceMap } from "../citation/citation-utils.js";
/**
 * Builds an AI Context Package for a specific Knowledge Object.
 * This is the primary endpoint for AI/RAG consumption.
 */
export function getAiContext(dataset, request) {
    const visibility = request.visibility ?? "public";
    const object = dataset.objects.find((o) => o.id === request.objectId);
    if (!object) {
        return createNotFoundResponse(request.objectId, visibility);
    }
    // Enforce visibility for public contexts: must be published
    if (visibility === "public" && object.status !== "published") {
        return createForbiddenResponse(`Knowledge Object '${request.objectId}' is not published and not publicly available for AI context.`);
    }
    // Resolve metadata
    const metadata = resolveMetadata({
        object,
        entities: dataset.entities,
        collections: dataset.collections,
        defaults: {},
    });
    // Collect related relationships
    const relationships = dataset.relationships.filter((r) => r.sourceId === object.id || r.targetId === object.id);
    // Collect related entity IDs from relationships and metadata
    const entityIds = new Set([
        ...(metadata.entities ?? []),
        ...relationships
            .flatMap((r) => [r.sourceId, r.targetId])
            .filter((id) => dataset.entities.some((e) => e.id === id)),
    ]);
    const entities = dataset.entities.filter((e) => entityIds.has(e.id));
    // Collect active citations for this object
    const allCitations = dataset.citations ?? [];
    const activeCitations = filterActiveCitations(allCitations);
    const citations = activeCitations.filter((c) => c.targetId === object.id);
    // Resolve sources for citations
    const sourceMap = buildSourceMap(dataset.sources ?? []);
    const sources = citations
        .map((c) => sourceMap.get(c.sourceId))
        .filter((s) => s !== undefined);
    // Collect related object IDs from relationships
    const relatedObjectIds = [
        ...new Set(relationships.flatMap((r) => [r.sourceId, r.targetId]).filter((id) => id !== object.id)),
    ];
    const contextPackage = {
        object,
        metadata,
        entities,
        relationships,
        citations,
        sources,
        relatedObjectIds,
        generatedAt: new Date().toISOString(),
    };
    return createApiResponse(contextPackage, { visibility });
}
