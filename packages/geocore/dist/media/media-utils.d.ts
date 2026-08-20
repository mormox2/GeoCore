import type { MediaAsset } from "../types/media.js";
/**
 * Returns true if the media asset is publicly visible.
 */
export declare function isPublicMedia(asset: MediaAsset): boolean;
/**
 * Returns true if the media asset is active.
 */
export declare function isActiveMedia(asset: MediaAsset): boolean;
/**
 * Returns true if the media asset is a publicly renderable asset.
 * Active + public visibility.
 */
export declare function isRenderableMedia(asset: MediaAsset): boolean;
/**
 * Returns true if the media asset is an image.
 */
export declare function isImageMedia(asset: MediaAsset): boolean;
/**
 * Returns true if the media asset is a video.
 */
export declare function isVideoMedia(asset: MediaAsset): boolean;
/**
 * Returns true if the media asset is an audio file.
 */
export declare function isAudioMedia(asset: MediaAsset): boolean;
/**
 * Returns true if the media asset is a document.
 */
export declare function isDocumentMedia(asset: MediaAsset): boolean;
/**
 * Returns the MIME type for a given media asset based on its type.
 * Returns undefined if no MIME type can be determined automatically.
 */
export declare function inferMimeType(asset: MediaAsset): string | undefined;
/**
 * Returns a display label for a media asset (type + title).
 */
export declare function getMediaLabel(asset: MediaAsset): string;
/**
 * Creates a deterministic media asset ID from type and a raw filename.
 */
export declare function createMediaId(type: string, filename: string): string;
/**
 * Returns the file extension from a source path or filename.
 */
export declare function getMediaExtension(source: string): string | undefined;
