import { SitemapEntry } from "../types/sitemap-entry.js";
/**
 * Escapes XML special characters to prevent injection.
 */
export declare function escapeXml(value: string): string;
/**
 * Generates a complete XML urlset sitemap string from a list of public entries.
 * Only entries with visibility === "public" are included.
 */
export declare function generateSitemapXml(entries: SitemapEntry[]): string;
/**
 * Generates an XML sitemap index string from a set of child sitemap URLs.
 */
export declare function generateSitemapIndexXml(sitemapUrls: Array<{
    loc: string;
    lastmod?: string;
}>): string;
