import type { MediaAsset } from "../types/media.js";

/**
 * Returns true if the media asset is publicly visible.
 */
export function isPublicMedia(asset: MediaAsset): boolean {
  return asset.visibility === "public";
}

/**
 * Returns true if the media asset is active.
 */
export function isActiveMedia(asset: MediaAsset): boolean {
  return asset.status === "active";
}

/**
 * Returns true if the media asset is a publicly renderable asset.
 * Active + public visibility.
 */
export function isRenderableMedia(asset: MediaAsset): boolean {
  return asset.status === "active" && asset.visibility === "public";
}

/**
 * Returns true if the media asset is an image.
 */
export function isImageMedia(asset: MediaAsset): boolean {
  return asset.type === "image" || asset.type === "diagram" || asset.type === "infographic" || asset.type === "screenshot";
}

/**
 * Returns true if the media asset is a video.
 */
export function isVideoMedia(asset: MediaAsset): boolean {
  return asset.type === "video";
}

/**
 * Returns true if the media asset is an audio file.
 */
export function isAudioMedia(asset: MediaAsset): boolean {
  return asset.type === "audio";
}

/**
 * Returns true if the media asset is a document.
 */
export function isDocumentMedia(asset: MediaAsset): boolean {
  return asset.type === "pdf" || asset.type === "document" || asset.type === "presentation" || asset.type === "download";
}

/**
 * Returns the MIME type for a given media asset based on its type.
 * Returns undefined if no MIME type can be determined automatically.
 */
export function inferMimeType(asset: MediaAsset): string | undefined {
  if (asset.mimeType) return asset.mimeType;
  switch (asset.type) {
    case "image":
    case "screenshot":
    case "infographic":
      return "image/*";
    case "diagram":
      return "image/svg+xml";
    case "video":
      return "video/*";
    case "audio":
    case "transcript":
      return "audio/*";
    case "pdf":
      return "application/pdf";
    case "document":
      return "application/octet-stream";
    default:
      return undefined;
  }
}

/**
 * Returns a display label for a media asset (type + title).
 */
export function getMediaLabel(asset: MediaAsset): string {
  return `[${asset.type}] ${asset.title}`;
}

/**
 * Creates a deterministic media asset ID from type and a raw filename.
 */
export function createMediaId(type: string, filename: string): string {
  const sanitized = filename.replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
  return `media_${type}_${sanitized}`;
}

/**
 * Returns the file extension from a source path or filename.
 */
export function getMediaExtension(source: string): string | undefined {
  const match = source.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : undefined;
}
