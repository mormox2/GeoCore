import type { StaticExportAssetType } from "../types/static-export-asset.js";
import type { StaticExportAsset } from "../types/static-export-asset.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { KnowledgeStatus } from "../types/metadata.js";

const MIME_MAP: Record<StaticExportAssetType, string> = {
  markdown: "text/markdown",
  json: "application/json",
  "json-ld": "application/ld+json",
  "search-index": "application/json",
  llms: "text/plain",
  "llms-full": "text/plain",
  sitemap: "application/xml",
  manifest: "application/json",
  text: "text/plain",
  xml: "application/xml",
};

/**
 * Deterministic asset ID: exportasset_{type}_{normalizedPath}.
 * Dots and slashes in the path are replaced with hyphens.
 */
export function createStaticExportAssetId(type: StaticExportAssetType, path: string): string {
  const normalized = path.replace(/[/.]/g, "-");
  return `exportasset_${type}_${normalized}`;
}

/**
 * Deterministic bundle ID: bundle_{siteName}_{language?}.
 */
export function createStaticExportBundleId(siteName: string, language?: string): string {
  const site = siteName.replace(/\s+/g, "-").toLowerCase();
  if (language) return `bundle_${site}_${language}`;
  return `bundle_${site}`;
}

/**
 * A valid relative export path:
 * - must not start with "/";
 * - must not contain "..";
 * - must not include query string or hash;
 * - must not have duplicate slashes.
 */
export function isValidExportPath(path: string): boolean {
  if (typeof path !== "string" || path.length === 0) return false;
  if (path.startsWith("/")) return false;
  if (path.includes("..")) return false;
  if (path.includes("?")) return false;
  if (path.includes("#")) return false;
  if (path.includes("//")) return false;
  return true;
}

/**
 * Normalize an export path: strip leading slash, collapse double slashes,
 * and remove any query/hash fragments. Always returns a relative path.
 */
export function normalizeExportPath(path: string): string {
  if (!path) return "";
  let value = path.trim();
  if (value.startsWith("/")) value = value.slice(1);
  value = value.split("?")[0].split("#")[0];
  value = value.replace(/\/+/g, "/");
  return value;
}

/**
 * Get the standard MIME type for a given asset type.
 */
export function getMimeTypeForExportType(type: StaticExportAssetType): string {
  return MIME_MAP[type];
}

/**
 * Deduplicate export assets by id, keeping the first occurrence.
 * Does not mutate the input.
 */
export function dedupeStaticExportAssets(assets: StaticExportAsset[]): StaticExportAsset[] {
  const seen = new Set<string>();
  const out: StaticExportAsset[] = [];
  for (const asset of assets) {
    if (!asset || typeof asset.id !== "string") continue;
    if (seen.has(asset.id)) continue;
    seen.add(asset.id);
    out.push(asset);
  }
  return out;
}

const PUBLISHED: ReadonlySet<KnowledgeStatus> = new Set<KnowledgeStatus>(["published"]);

/**
 * Returns true when the object qualifies as a public export candidate.
 */
export function isPublicExportObject(object: KnowledgeObject): boolean {
  if (!object) return false;
  if (!PUBLISHED.has(object.status)) return false;
  const vis = (object.metadata as { visibility?: string } | undefined)?.visibility;
  if (vis && vis !== "public") return false;
  return true;
}
