import { createSearchDocumentId, dedupeSearchValues } from "./search-utils.js";
import { extractSearchText } from "./search-text-extractor.js";
/**
 * Creates a SearchDocument from a KnowledgeObject, enriching it with optional metadata,
 * relationships, and assets.
 */
export function createSearchDocumentFromKnowledgeObject(input) {
    const { object, metadata, relationships = [], entities: inputEntities = [], collections: inputCollections = [], citations: inputCitations = [], media: inputMedia = [], visibility: inputVisibility, } = input;
    const sourceId = object.id;
    const sourceType = "knowledge-object";
    const id = createSearchDocumentId(sourceType, sourceId);
    // 1. Determine visibility
    // default visibility to public only when status is published, otherwise internal.
    const visibility = inputVisibility || (object.status === "published" ? "public" : "internal");
    // 2. Gather entities from metadata, input, and graph relationships
    const entityIds = [];
    if (inputEntities) {
        entityIds.push(...inputEntities.map((e) => e.id));
    }
    if (metadata?.entities) {
        entityIds.push(...metadata.entities);
    }
    for (const rel of relationships) {
        if (rel.sourceId === sourceId) {
            if (rel.type === "explains" || rel.type === "mentions" || rel.targetId.startsWith("entity_")) {
                entityIds.push(rel.targetId);
            }
        }
    }
    // 3. Gather collections from metadata, input, and graph relationships
    const collectionIds = [];
    if (inputCollections) {
        collectionIds.push(...inputCollections.map((c) => c.id));
    }
    if (metadata?.collections) {
        collectionIds.push(...metadata.collections);
    }
    for (const rel of relationships) {
        if (rel.sourceId === sourceId) {
            if (rel.type === "part_of" || rel.targetId.startsWith("col_") || rel.targetId.startsWith("collection_")) {
                collectionIds.push(rel.targetId);
            }
        }
    }
    // 4. Gather citations from metadata, input, and graph relationships
    const citationIds = [];
    if (inputCitations) {
        citationIds.push(...inputCitations.map((c) => c.id));
    }
    if (metadata?.citations) {
        citationIds.push(...metadata.citations);
    }
    for (const rel of relationships) {
        if (rel.sourceId === sourceId) {
            if (rel.type === "cites" || rel.targetId.startsWith("source_") || rel.targetId.startsWith("citation_")) {
                citationIds.push(rel.targetId);
            }
        }
    }
    // 5. Gather media from input and graph relationships
    const mediaIds = [];
    if (inputMedia) {
        mediaIds.push(...inputMedia.map((m) => m.id));
    }
    for (const rel of relationships) {
        if (rel.sourceId === sourceId) {
            if (rel.type === "uses_media" || rel.targetId.startsWith("media_")) {
                mediaIds.push(rel.targetId);
            }
        }
    }
    // 6. Gather taxonomy from metadata and object
    const taxonomy = [];
    if (metadata?.topics) {
        taxonomy.push(...metadata.topics);
    }
    if (metadata?.domains) {
        taxonomy.push(...metadata.domains);
    }
    if (object.categories) {
        taxonomy.push(...object.categories);
    }
    // 7. Gather keywords and aliases
    const keywords = [];
    if (metadata?.seo?.keywords) {
        keywords.push(...metadata.seo.keywords);
    }
    if (object.tags) {
        keywords.push(...object.tags);
    }
    const aliases = object.aliases ? [...object.aliases] : [];
    // Deduplicate all arrays preserving order
    const dedupedEntities = dedupeSearchValues(entityIds);
    const dedupedCollections = dedupeSearchValues(collectionIds);
    const dedupedCitations = dedupeSearchValues(citationIds);
    const dedupedMedia = dedupeSearchValues(mediaIds);
    const dedupedTaxonomy = dedupeSearchValues(taxonomy);
    const dedupedKeywords = dedupeSearchValues(keywords);
    const dedupedAliases = dedupeSearchValues(aliases);
    // 8. Generate search text using extractSearchText
    const text = extractSearchText({
        title: object.title,
        summary: object.summary,
        body: object.body,
        entities: dedupedEntities,
        aliases: dedupedAliases,
        keywords: dedupedKeywords,
    });
    // 9. Map metadata fields, without inventing fields
    const documentMetadata = {
        author: metadata?.author || object.author,
        reviewer: metadata?.reviewer,
        owner: metadata?.owner,
        trustLevel: metadata?.trustLevel,
        freshness: metadata?.freshness,
        createdAt: metadata?.createdAt || object.createdAt,
        updatedAt: metadata?.updatedAt || object.updatedAt,
        publishedAt: metadata?.publishedAt,
        reviewedAt: metadata?.reviewedAt,
    };
    const canonicalUrl = metadata?.canonicalUrl || metadata?.seo?.canonicalUrl;
    const doc = {
        id,
        type: sourceType,
        sourceId,
        sourceType,
        sourceVersion: object.version,
        title: object.title,
        summary: object.summary,
        body: object.body,
        language: object.language,
        status: object.status,
        visibility,
        slug: object.slug || metadata?.slug,
        canonicalUrl,
        entities: dedupedEntities,
        collections: dedupedCollections,
        citations: dedupedCitations,
        media: dedupedMedia,
        taxonomy: dedupedTaxonomy,
        keywords: dedupedKeywords,
        aliases: dedupedAliases,
        text,
        metadata: documentMetadata,
        generatedAt: new Date().toISOString(),
    };
    return doc;
}
