/**
 * Creates a deterministic sitemap output ID.
 */
export function createSitemapOutputId(type, id, language) {
    const cleanId = id.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const langSuffix = language ? `_${language.toLowerCase()}` : "";
    return `sitemap_${type}_${cleanId}${langSuffix}`;
}
/**
 * Creates a deterministic sitemap entry ID from a source object ID.
 */
export function createSitemapEntryId(sourceId, language) {
    const clean = sourceId.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const langSuffix = language ? `_${language.toLowerCase()}` : "";
    return `sitemap_entry_${clean}${langSuffix}`;
}
/**
 * Checks if a KnowledgeObject is public and published.
 */
export function isSitemapPublicObject(object) {
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
 * Resolves the canonical URL for a KnowledgeObject.
 * Checks explicit URL overrides first, then metadata, then siteUrl + slug fallback.
 */
export function resolveSitemapUrl(object, metadata, explicitUrls, siteUrl) {
    if (explicitUrls?.[object.id]) {
        return explicitUrls[object.id];
    }
    if (metadata?.canonicalUrl) {
        return metadata.canonicalUrl;
    }
    if (metadata?.seo?.canonicalUrl) {
        return metadata.seo.canonicalUrl;
    }
    if (object.canonicalUrl) {
        return object.canonicalUrl;
    }
    if (siteUrl && object.slug) {
        return `${siteUrl.replace(/\/$/, "")}/${object.slug}`;
    }
    return undefined;
}
/**
 * Extracts image assets from a MediaAsset array filtered to a specific object.
 */
export function extractSitemapImages(objectId, media) {
    if (!media)
        return [];
    return media
        .filter((m) => m.type === "image" &&
        m.relatedObjectIds?.includes(objectId) &&
        (m.canonicalUrl || m.source))
        .map((m) => ({
        url: m.canonicalUrl ?? m.source,
        title: m.altText || undefined,
        caption: m.caption || undefined,
    }));
}
/**
 * Deduplicates sitemap entries by ID, keeping first occurrence.
 */
export function dedupeSitemapEntries(entries) {
    const seen = new Set();
    const duplicateIds = [];
    const result = [];
    for (const entry of entries) {
        if (seen.has(entry.id)) {
            duplicateIds.push(entry.id);
        }
        else {
            seen.add(entry.id);
            result.push(entry);
        }
    }
    return { entries: result, duplicateIds };
}
/**
 * Deduplicates sitemap entries by URL, keeping first occurrence.
 */
export function dedupeSitemapUrls(entries) {
    const seen = new Set();
    const duplicateUrls = [];
    const result = [];
    for (const entry of entries) {
        if (seen.has(entry.url)) {
            duplicateUrls.push(entry.url);
        }
        else {
            seen.add(entry.url);
            result.push(entry);
        }
    }
    return { entries: result, duplicateUrls };
}
