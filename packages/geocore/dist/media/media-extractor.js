import { filterPublicMedia, filterMediaForObject, filterImageMedia, filterVideoMedia } from "./media-filter.js";
/**
 * Extracts all media from a KnowledgeDataset, optionally filtering to public only.
 * Returns pre-grouped maps for efficient lookup.
 */
export function extractMediaFromDataset(dataset, options = {}) {
    const allMedia = dataset.media ?? [];
    const media = options.publicOnly ? filterPublicMedia(allMedia) : allMedia;
    // Index by relatedObjectIds
    const byObjectId = new Map();
    for (const asset of media) {
        for (const objectId of asset.relatedObjectIds ?? []) {
            if (!byObjectId.has(objectId)) {
                byObjectId.set(objectId, []);
            }
            byObjectId.get(objectId).push(asset);
        }
    }
    // Index by relatedEntityIds
    const byEntityId = new Map();
    for (const asset of media) {
        for (const entityId of asset.relatedEntityIds ?? []) {
            if (!byEntityId.has(entityId)) {
                byEntityId.set(entityId, []);
            }
            byEntityId.get(entityId).push(asset);
        }
    }
    const images = filterImageMedia(media);
    const videos = filterVideoMedia(media);
    return { media, byObjectId, byEntityId, images, videos };
}
/**
 * Extracts all media assets linked to a specific Knowledge Object ID.
 */
export function extractMediaForObject(dataset, objectId) {
    return filterMediaForObject(dataset.media ?? [], objectId);
}
/**
 * Returns all public media that should be included in a media sitemap.
 */
export function extractSitemapMedia(dataset) {
    const publicMedia = filterPublicMedia(dataset.media ?? []);
    return {
        images: filterImageMedia(publicMedia),
        videos: filterVideoMedia(publicMedia),
    };
}
