import type { KnowledgeDataset } from "@mormo_mossaab/geocore";
export type NextRouteHandlerOptions = {
    siteUrl?: string;
    siteName?: string;
    cacheControl?: string;
};
/**
 * Returns a Response object containing the llms.txt summary file for AI crawlers.
 */
export declare function handleLlmsTxt(dataset: KnowledgeDataset, options?: NextRouteHandlerOptions): Response;
/**
 * Returns a Response object containing the full llms-full.txt file for deep AI ingestion.
 */
export declare function handleLlmsFullTxt(dataset: KnowledgeDataset, options?: NextRouteHandlerOptions): Response;
/**
 * Returns a Response object containing the sitemap.xml.
 */
export declare function handleSitemapXml(dataset: KnowledgeDataset, options?: NextRouteHandlerOptions): Response;
/**
 * JSON API Route Handler for full-text search.
 */
export declare function handleSearchApi(dataset: KnowledgeDataset, query: string, options?: {
    limit?: number;
    language?: string;
}): Response;
/**
 * JSON API Route Handler for AI context bundle retrieval.
 */
export declare function handleContextApi(dataset: KnowledgeDataset, objectId: string): Response;
