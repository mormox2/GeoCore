import { KnowledgeObject } from "../types/knowledge-object.js";
import { ResolvedMetadata } from "../types/metadata.js";
import { MediaAsset } from "../types/media.js";
import { SitemapOutputType } from "../types/sitemap.js";
import { SitemapEntry } from "../types/sitemap-entry.js";

/**
 * Creates a deterministic sitemap output ID.
 */
export function createSitemapOutputId(type: SitemapOutputType, id: string, language?: string): string {
  const cleanId = id.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  const langSuffix = language ? `_${language.toLowerCase()}` : "";
  return `sitemap_${type}_${cleanId}${langSuffix}`;
}

/**
 * Creates a deterministic sitemap entry ID from a source object ID.
 */
export function createSitemapEntryId(sourceId: string, language?: string): string {
  const clean = sourceId.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  const langSuffix = language ? `_${language.toLowerCase()}` : "";
  return `sitemap_entry_${clean}${langSuffix}`;
}

/**
 * Checks if a KnowledgeObject is public and published.
 */
export function isSitemapPublicObject(object: KnowledgeObject): boolean {
  if (object.status !== "published") {
    return false;
  }
  const visibility = (object as any).visibility || (object.metadata as any)?.visibility;
  if (visibility !== undefined && visibility !== "public") {
    return false;
  }
  return true;
}

/**
 * Resolves the canonical URL for a KnowledgeObject.
 * Checks explicit URL overrides first, then metadata, then siteUrl + slug fallback.
 */
export function resolveSitemapUrl(
  object: KnowledgeObject,
  metadata?: ResolvedMetadata,
  explicitUrls?: Record<string, string>,
  siteUrl?: string
): string | undefined {
  if (explicitUrls?.[object.id]) {
    return explicitUrls[object.id];
  }
  if (metadata?.canonicalUrl) {
    return metadata.canonicalUrl;
  }
  if (metadata?.seo?.canonicalUrl) {
    return metadata.seo.canonicalUrl;
  }
  if ((object as any).canonicalUrl) {
    return (object as any).canonicalUrl;
  }
  if (siteUrl && object.slug) {
    return `${siteUrl.replace(/\/$/, "")}/${object.slug}`;
  }
  return undefined;
}

/**
 * Extracts image assets from a MediaAsset array filtered to a specific object.
 */
export function extractSitemapImages(
  objectId: string,
  media?: MediaAsset[]
): Array<{ url: string; title?: string; caption?: string }> {
  if (!media) return [];
  return media
    .filter(
      (m) =>
        m.type === "image" &&
        m.relatedObjectIds?.includes(objectId) &&
        (m.canonicalUrl || m.source)
    )
    .map((m) => ({
      url: m.canonicalUrl ?? m.source,
      title: m.altText || undefined,
      caption: m.caption || undefined,
    }));
}

/**
 * Deduplicates sitemap entries by ID, keeping first occurrence.
 */
export function dedupeSitemapEntries(entries: SitemapEntry[]): { entries: SitemapEntry[]; duplicateIds: string[] } {
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const result: SitemapEntry[] = [];
  for (const entry of entries) {
    if (seen.has(entry.id)) {
      duplicateIds.push(entry.id);
    } else {
      seen.add(entry.id);
      result.push(entry);
    }
  }
  return { entries: result, duplicateIds };
}

/**
 * Deduplicates sitemap entries by URL, keeping first occurrence.
 */
export function dedupeSitemapUrls(entries: SitemapEntry[]): { entries: SitemapEntry[]; duplicateUrls: string[] } {
  const seen = new Set<string>();
  const duplicateUrls: string[] = [];
  const result: SitemapEntry[] = [];
  for (const entry of entries) {
    if (seen.has(entry.url)) {
      duplicateUrls.push(entry.url);
    } else {
      seen.add(entry.url);
      result.push(entry);
    }
  }
  return { entries: result, duplicateUrls };
}
