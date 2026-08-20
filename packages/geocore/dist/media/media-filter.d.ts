import type { MediaAsset, MediaType, MediaStatus, MediaVisibility } from "../types/media.js";
export type MediaFilterOptions = {
    type?: MediaType;
    status?: MediaStatus;
    visibility?: MediaVisibility;
    language?: string;
    relatedObjectId?: string;
    relatedEntityId?: string;
};
/**
 * Filters an array of MediaAssets based on filter options.
 */
export declare function filterMedia(assets: MediaAsset[], options: MediaFilterOptions): MediaAsset[];
/**
 * Returns only publicly renderable media assets.
 * Active + public visibility.
 */
export declare function filterPublicMedia(assets: MediaAsset[]): MediaAsset[];
/**
 * Returns all media assets related to a given object ID.
 */
export declare function filterMediaForObject(assets: MediaAsset[], objectId: string): MediaAsset[];
/**
 * Returns all media assets related to a given entity ID.
 */
export declare function filterMediaForEntity(assets: MediaAsset[], entityId: string): MediaAsset[];
/**
 * Returns only image-type media (image, diagram, screenshot, infographic).
 */
export declare function filterImageMedia(assets: MediaAsset[]): MediaAsset[];
/**
 * Returns only video-type media.
 */
export declare function filterVideoMedia(assets: MediaAsset[]): MediaAsset[];
