import type { MediaAsset } from "../types/media.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
export type MediaExtractionResult = {
    media: MediaAsset[];
    byObjectId: Map<string, MediaAsset[]>;
    byEntityId: Map<string, MediaAsset[]>;
    images: MediaAsset[];
    videos: MediaAsset[];
};
/**
 * Extracts all media from a KnowledgeDataset, optionally filtering to public only.
 * Returns pre-grouped maps for efficient lookup.
 */
export declare function extractMediaFromDataset(dataset: KnowledgeDataset, options?: {
    publicOnly?: boolean;
}): MediaExtractionResult;
/**
 * Extracts all media assets linked to a specific Knowledge Object ID.
 */
export declare function extractMediaForObject(dataset: KnowledgeDataset, objectId: string): MediaAsset[];
/**
 * Returns all public media that should be included in a media sitemap.
 */
export declare function extractSitemapMedia(dataset: KnowledgeDataset): {
    images: MediaAsset[];
    videos: MediaAsset[];
};
