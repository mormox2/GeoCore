import type { MediaAsset } from "../types/media.js";
export type MediaSitemapImage = {
    url: string;
    title: string;
    caption?: string;
    license?: string;
};
export type MediaSitemapVideo = {
    contentUrl: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    duration?: number;
};
export type MediaSitemapEntries = {
    images: MediaSitemapImage[];
    videos: MediaSitemapVideo[];
};
/**
 * Converts a public image MediaAsset into a sitemap image entry.
 */
export declare function toSitemapImage(asset: MediaAsset): MediaSitemapImage | undefined;
/**
 * Converts a public video MediaAsset into a sitemap video entry.
 */
export declare function toSitemapVideo(asset: MediaAsset): MediaSitemapVideo | undefined;
/**
 * Generates a complete XML sitemap extension for image and video media.
 * Should be embedded inside a <url> element in an XML sitemap.
 */
export declare function generateMediaSitemapXmlExtension(images: MediaSitemapImage[], videos: MediaSitemapVideo[]): string;
