/**
 * Creates a deterministic LLMs output ID.
 */
export function createLlmsOutputId(type, siteName, language) {
    const cleanName = siteName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const langSuffix = language ? `_${language.toLowerCase()}` : "";
    const typeClean = type.replace(".", "_");
    return `llms_${typeClean}_${cleanName}${langSuffix}`;
}
/**
 * Checks if the KnowledgeObject is public and published.
 */
export function isLlmsPublicObject(object) {
    if (object.status !== "published") {
        return false;
    }
    const visibility = object.visibility || object.metadata?.visibility;
    if (visibility !== undefined && visibility !== "public") {
        return false;
    }
    return true;
}
/**
 * Deduplicates string arrays while preserving order.
 */
export function dedupeLlmsValues(values) {
    if (!values)
        return [];
    const seen = new Set();
    const result = [];
    for (const v of values) {
        if (!seen.has(v)) {
            seen.add(v);
            result.push(v);
        }
    }
    return result;
}
/**
 * Extracts entities from object metadata and graph relationships.
 */
export function extractLlmsEntities(object, metadata, relationships) {
    const entityIds = [];
    if (metadata?.entities) {
        entityIds.push(...metadata.entities);
    }
    if (relationships) {
        for (const rel of relationships) {
            if (rel.sourceId === object.id) {
                if (rel.type === "explains" || rel.type === "mentions" || rel.targetId.startsWith("entity_")) {
                    entityIds.push(rel.targetId);
                }
            }
        }
    }
    return dedupeLlmsValues(entityIds);
}
/**
 * Extracts citations from object metadata and graph relationships.
 */
export function extractLlmsCitations(object, metadata, relationships) {
    const citationIds = [];
    if (metadata?.citations) {
        citationIds.push(...metadata.citations);
    }
    if (relationships) {
        for (const rel of relationships) {
            if (rel.sourceId === object.id) {
                if (rel.type === "cites" || rel.targetId.startsWith("source_") || rel.targetId.startsWith("citation_")) {
                    citationIds.push(rel.targetId);
                }
            }
        }
    }
    return dedupeLlmsValues(citationIds);
}
