import { KnowledgeObject } from "../types/knowledge-object.js";
import { ResolvedMetadata } from "../types/metadata.js";
import { MediaAsset } from "../types/media.js";
import { SitemapOutputType } from "../types/sitemap.js";
import { SitemapEntry } from "../types/sitemap-entry.js";
/**
 * Creates a deterministic sitemap output ID.
 */
export declare function createSitemapOutputId(type: SitemapOutputType, id: string, language?: string): string;
/**
 * Creates a deterministic sitemap entry ID from a source object ID.
 */
export declare function createSitemapEntryId(sourceId: string, language?: string): string;
/**
 * Checks if a KnowledgeObject is public and published.
 */
export declare function isSitemapPublicObject(object: KnowledgeObject): boolean;
/**
 * Resolves the canonical URL for a KnowledgeObject.
 * Checks explicit URL overrides first, then metadata, then siteUrl + slug fallback.
 */
export declare function resolveSitemapUrl(object: KnowledgeObject, metadata?: ResolvedMetadata, explicitUrls?: Record<string, string>, siteUrl?: string): string | undefined;
/**
 * Extracts image assets from a MediaAsset array filtered to a specific object.
 */
export declare function extractSitemapImages(objectId: string, media?: MediaAsset[]): Array<{
    url: string;
    title?: string;
    caption?: string;
}>;
/**
 * Deduplicates sitemap entries by ID, keeping first occurrence.
 */
export declare function dedupeSitemapEntries(entries: SitemapEntry[]): {
    entries: SitemapEntry[];
    duplicateIds: string[];
};
/**
 * Deduplicates sitemap entries by URL, keeping first occurrence.
 */
export declare function dedupeSitemapUrls(entries: SitemapEntry[]): {
    entries: SitemapEntry[];
    duplicateUrls: string[];
};
