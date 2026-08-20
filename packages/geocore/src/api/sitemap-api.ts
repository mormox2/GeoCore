import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { SitemapOutput } from "../types/sitemap.js";
import type { ApiResponse } from "./api-types.js";
import { createApiResponse, createErrorResponse } from "./api-response.js";
import { generateSitemap } from "../sitemap/sitemap-generator.js";

/**
 * Generates a complete SitemapOutput from a KnowledgeDataset.
 * Used for build-time static sitemap generation.
 *
 * @param dataset - The loaded knowledge dataset.
 * @param siteUrl - Base URL for the site (e.g. "https://rtimidental.fr").
 */
export function buildSitemap(
  dataset: KnowledgeDataset,
  siteUrl?: string
): ApiResponse<SitemapOutput> {
  try {
    const output = generateSitemap({
      id: `sitemap_${dataset.id}`,
      siteUrl,
      objects: dataset.objects,
      media: dataset.media,
      visibility: "public",
    });

    return createApiResponse(output, { visibility: "public" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sitemap generation failed.";
    return createErrorResponse(message, "public");
  }
}
