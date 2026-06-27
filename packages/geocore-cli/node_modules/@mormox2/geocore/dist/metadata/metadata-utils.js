export function dedupeMetadataArray(values) {
    if (!values)
        return [];
    return Array.from(new Set(values.filter(Boolean)));
}
export function mergeMetadataArrays(...arrays) {
    const merged = [];
    for (const arr of arrays) {
        if (arr) {
            merged.push(...arr);
        }
    }
    return dedupeMetadataArray(merged);
}
export function hasCanonicalUrl(metadata) {
    return !!metadata.canonicalUrl || !!metadata.seo?.canonicalUrl;
}
export function isPublished(metadata) {
    return metadata.status === "published";
}
