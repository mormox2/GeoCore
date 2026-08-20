import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { SitemapOutput } from "../types/sitemap.js";
import type { ApiResponse } from "./api-types.js";
/**
 * Generates a complete SitemapOutput from a KnowledgeDataset.
 * Used for build-time static sitemap generation.
 *
 * @param dataset - The loaded knowledge dataset.
 * @param siteUrl - Base URL for the site (e.g. "https://rtimidental.fr").
 */
export declare function buildSitemap(dataset: KnowledgeDataset, siteUrl?: string): ApiResponse<SitemapOutput>;
