import { GenerateSitemapInput, SitemapOutput } from "../types/sitemap.js";
/**
 * Generates a complete SitemapOutput from a GenerateSitemapInput.
 *
 * - Filters public, published objects
 * - Resolves canonical URLs from metadata, explicit overrides, or siteUrl + slug
 * - Builds SitemapEntry per object
 * - Deduplicates entries by ID and URL
 * - Generates XML urlset
 * - Validates the resulting output
 */
export declare function generateSitemap(input: GenerateSitemapInput): SitemapOutput;
