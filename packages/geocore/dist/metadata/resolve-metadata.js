import { DEFAULT_METADATA } from "./metadata-defaults.js";
import { mergeMetadataArrays, dedupeMetadataArray } from "./metadata-utils.js";
export function resolveMetadata(input) {
    const { object, graph, collections = [], entities = [], citations = [], defaults } = input;
    const resolvedAt = new Date().toISOString();
    // Find collections the object belongs to
    const matchingCollections = collections.filter((c) => {
        const inItems = c.items?.some((item) => item.objectId === object.id);
        const inObjectCols = object.metadata?.collections?.includes(c.id);
        return inItems || inObjectCols;
    });
    // Determine referenced entity IDs
    const graphEntityIds = [];
    if (graph) {
        const relationships = graph.relationships || [];
        for (const rel of relationships) {
            if (rel.sourceId === object.id && (rel.type === "explains" || rel.type === "mentions")) {
                const targetNode = graph.nodes?.find((n) => n.id === rel.targetId);
                if (targetNode?.type === "entity") {
                    graphEntityIds.push(rel.targetId);
                }
                else if (rel.targetId && rel.targetId.startsWith("entity_")) {
                    graphEntityIds.push(rel.targetId);
                }
            }
        }
    }
    const resolvedEntities = mergeMetadataArrays(object.metadata?.entities, graphEntityIds);
    // Find entity objects matching resolved entity IDs
    const matchingEntities = entities.filter((e) => resolvedEntities.includes(e.id));
    // Determine citation IDs
    const graphCitationIds = [];
    if (graph) {
        const relationships = graph.relationships || [];
        for (const rel of relationships) {
            if (rel.sourceId === object.id && rel.type === "cites") {
                graphCitationIds.push(rel.targetId);
            }
        }
    }
    const directCitationIds = citations.filter((c) => c.sourceId === object.id).map((c) => c.id);
    const resolvedCitations = mergeMetadataArrays(object.metadata?.citations, graphCitationIds, directCitationIds);
    // Resolve collections list
    const collectionIds = mergeMetadataArrays(object.metadata?.collections, matchingCollections.map((c) => c.id));
    // Precedence helper for scalar values
    function resolveScalar(field) {
        // 1. Explicit KO metadata
        if (object.metadata && object.metadata[field] !== undefined) {
            return object.metadata[field];
        }
        // 2. KO core fields
        if (object[field] !== undefined) {
            return object[field];
        }
        if (field === "language" || field === "owner" || field === "author" || field === "reviewer") {
            const col = matchingCollections.find((c) => c[field] !== undefined);
            if (col !== undefined)
                return col[field];
        }
        // 4. Entity metadata
        if (field === "language") {
            const entVal = matchingEntities.find((e) => e.language !== undefined)?.language;
            if (entVal !== undefined)
                return entVal;
        }
        // 5. Global defaults
        if (defaults && defaults[field] !== undefined) {
            return defaults[field];
        }
        // 6. System fallbacks
        if (DEFAULT_METADATA[field] !== undefined) {
            return DEFAULT_METADATA[field];
        }
        return undefined;
    }
    // Resolve arrays with inheritance rules
    let domains = undefined;
    if (object.metadata?.domains) {
        domains = dedupeMetadataArray(object.metadata.domains);
    }
    else {
        const colDomains = matchingCollections.flatMap((c) => c.domain || []);
        const entDomains = matchingEntities.flatMap((e) => e.domain || []);
        const merged = mergeMetadataArrays(colDomains, entDomains);
        if (merged.length > 0) {
            domains = merged;
        }
        else if (defaults?.domains) {
            domains = dedupeMetadataArray(defaults.domains);
        }
    }
    let audiences = undefined;
    if (object.metadata?.audiences) {
        audiences = dedupeMetadataArray(object.metadata.audiences);
    }
    else {
        const colAudiences = matchingCollections.flatMap((c) => c.audience || []);
        const entAudiences = matchingEntities.flatMap((e) => e.audience || []);
        const merged = mergeMetadataArrays(colAudiences, entAudiences);
        if (merged.length > 0) {
            audiences = merged;
        }
        else if (defaults?.audiences) {
            audiences = dedupeMetadataArray(defaults.audiences);
        }
    }
    let topics = undefined;
    if (object.metadata?.topics) {
        topics = dedupeMetadataArray(object.metadata.topics);
    }
    else if (defaults?.topics) {
        topics = dedupeMetadataArray(defaults.topics);
    }
    const seo = {
        ...defaults?.seo,
        ...object.metadata?.seo,
    };
    const ai = {
        ...defaults?.ai,
        ...object.metadata?.ai,
    };
    const technical = {
        ...defaults?.technical,
        ...object.metadata?.technical,
    };
    const resolvedMetadata = {
        id: resolveScalar("id"),
        slug: resolveScalar("slug"),
        title: resolveScalar("title"),
        summary: resolveScalar("summary"),
        language: resolveScalar("language"),
        version: resolveScalar("version"),
        status: resolveScalar("status"),
        author: resolveScalar("author"),
        reviewer: resolveScalar("reviewer"),
        owner: resolveScalar("owner"),
        createdAt: resolveScalar("createdAt"),
        updatedAt: resolveScalar("updatedAt"),
        publishedAt: resolveScalar("publishedAt"),
        reviewedAt: resolveScalar("reviewedAt"),
        archivedAt: resolveScalar("archivedAt"),
        canonicalUrl: resolveScalar("canonicalUrl"),
        entities: resolvedEntities.length > 0 ? resolvedEntities : undefined,
        citations: resolvedCitations.length > 0 ? resolvedCitations : undefined,
        collections: collectionIds.length > 0 ? collectionIds : undefined,
        domains,
        audiences,
        topics,
        trustLevel: resolveScalar("trustLevel"),
        freshness: resolveScalar("freshness"),
        seo: Object.keys(seo).length > 0 ? seo : undefined,
        ai: Object.keys(ai).length > 0 ? ai : undefined,
        technical: Object.keys(technical).length > 0 ? technical : undefined,
        resolvedAt,
        resolvedFrom: {
            object: true,
            defaults: !!defaults || [
                "language", "status", "version", "freshness", "trustLevel"
            ].some(k => resolveScalar(k) === DEFAULT_METADATA[k] || (defaults && defaults[k] !== undefined)),
            graph: !!graph && (graphEntityIds.length > 0 || graphCitationIds.length > 0),
            collections: matchingCollections.length > 0,
            entities: matchingEntities.length > 0 || resolvedEntities.length > 0,
            citations: resolvedCitations.length > 0,
        },
    };
    return resolvedMetadata;
}
