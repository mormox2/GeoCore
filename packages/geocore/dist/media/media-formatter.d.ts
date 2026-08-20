import type { MediaAsset } from "../types/media.js";
/**
 * Returns a plain-text alt text string for a media asset.
 * Falls back to the title if no altText is set.
 */
export declare function getMediaAltText(asset: MediaAsset): string;
/**
 * Returns a plain-text caption for a media asset.
 * Falls back to description, then title.
 */
export declare function getMediaCaption(asset: MediaAsset): string;
/**
 * Formats a media asset as an HTML img tag string.
 * Only valid for image-type media.
 */
export declare function formatImageHtml(asset: MediaAsset): string;
/**
 * Formats a media asset as a Markdown image string.
 */
export declare function formatImageMarkdown(asset: MediaAsset): string;
/**
 * Formats a media asset as an HTML video tag.
 * Only valid for video-type media.
 */
export declare function formatVideoHtml(asset: MediaAsset): string;
/**
 * Formats a media asset attribution line.
 * e.g. "Photo by Dr Mossaab Rtimi — © RTimi Dental 2026"
 */
export declare function formatMediaAttribution(asset: MediaAsset): string;
/**
 * Returns the display label for a media asset.
 */
export declare function formatMediaLabel(asset: MediaAsset): string;
/**
 * Returns a compact metadata summary for a media asset (for inspection/CLI).
 */
export declare function formatMediaSummary(asset: MediaAsset): string;
