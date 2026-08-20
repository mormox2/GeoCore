import type { MediaAsset } from "../types/media.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import { filterPublicMedia, filterMediaForObject, filterImageMedia, filterVideoMedia } from "./media-filter.js";

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
export function extractMediaFromDataset(
  dataset: KnowledgeDataset,
  options: { publicOnly?: boolean } = {}
): MediaExtractionResult {
  const allMedia = dataset.media ?? [];
  const media = options.publicOnly ? filterPublicMedia(allMedia) : allMedia;

  // Index by relatedObjectIds
  const byObjectId = new Map<string, MediaAsset[]>();
  for (const asset of media) {
    for (const objectId of asset.relatedObjectIds ?? []) {
      if (!byObjectId.has(objectId)) {
        byObjectId.set(objectId, []);
      }
      byObjectId.get(objectId)!.push(asset);
    }
  }

  // Index by relatedEntityIds
  const byEntityId = new Map<string, MediaAsset[]>();
  for (const asset of media) {
    for (const entityId of asset.relatedEntityIds ?? []) {
      if (!byEntityId.has(entityId)) {
        byEntityId.set(entityId, []);
      }
      byEntityId.get(entityId)!.push(asset);
    }
  }

  const images = filterImageMedia(media);
  const videos = filterVideoMedia(media);

  return { media, byObjectId, byEntityId, images, videos };
}

/**
 * Extracts all media assets linked to a specific Knowledge Object ID.
 */
export function extractMediaForObject(
  dataset: KnowledgeDataset,
  objectId: string
): MediaAsset[] {
  return filterMediaForObject(dataset.media ?? [], objectId);
}

/**
 * Returns all public media that should be included in a media sitemap.
 */
export function extractSitemapMedia(dataset: KnowledgeDataset): {
  images: MediaAsset[];
  videos: MediaAsset[];
} {
  const publicMedia = filterPublicMedia(dataset.media ?? []);
  return {
    images: filterImageMedia(publicMedia),
    videos: filterVideoMedia(publicMedia),
  };
}
