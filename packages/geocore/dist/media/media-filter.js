/**
 * Filters an array of MediaAssets based on filter options.
 */
export function filterMedia(assets, options) {
    return assets.filter((asset) => {
        if (options.type !== undefined && asset.type !== options.type) {
            return false;
        }
        if (options.status !== undefined && asset.status !== options.status) {
            return false;
        }
        if (options.visibility !== undefined && asset.visibility !== options.visibility) {
            return false;
        }
        if (options.language !== undefined && asset.language !== options.language) {
            return false;
        }
        if (options.relatedObjectId !== undefined) {
            if (!asset.relatedObjectIds?.includes(options.relatedObjectId)) {
                return false;
            }
        }
        if (options.relatedEntityId !== undefined) {
            if (!asset.relatedEntityIds?.includes(options.relatedEntityId)) {
                return false;
            }
        }
        return true;
    });
}
/**
 * Returns only publicly renderable media assets.
 * Active + public visibility.
 */
export function filterPublicMedia(assets) {
    return assets.filter((a) => a.status === "active" && a.visibility === "public");
}
/**
 * Returns all media assets related to a given object ID.
 */
export function filterMediaForObject(assets, objectId) {
    return assets.filter((a) => a.relatedObjectIds?.includes(objectId));
}
/**
 * Returns all media assets related to a given entity ID.
 */
export function filterMediaForEntity(assets, entityId) {
    return assets.filter((a) => a.relatedEntityIds?.includes(entityId));
}
/**
 * Returns only image-type media (image, diagram, screenshot, infographic).
 */
export function filterImageMedia(assets) {
    const imageTypes = new Set(["image", "diagram", "screenshot", "infographic"]);
    return assets.filter((a) => imageTypes.has(a.type));
}
/**
 * Returns only video-type media.
 */
export function filterVideoMedia(assets) {
    return assets.filter((a) => a.type === "video");
}
