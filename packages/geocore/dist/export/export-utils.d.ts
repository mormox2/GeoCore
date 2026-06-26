import type { StaticExportAssetType } from "../types/static-export-asset.js";
import type { StaticExportAsset } from "../types/static-export-asset.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
/**
 * Deterministic asset ID: exportasset_{type}_{normalizedPath}.
 * Dots and slashes in the path are replaced with hyphens.
 */
export declare function createStaticExportAssetId(type: StaticExportAssetType, path: string): string;
/**
 * Deterministic bundle ID: bundle_{siteName}_{language?}.
 */
export declare function createStaticExportBundleId(siteName: string, language?: string): string;
/**
 * A valid relative export path:
 * - must not start with "/";
 * - must not contain "..";
 * - must not include query string or hash;
 * - must not have duplicate slashes.
 */
export declare function isValidExportPath(path: string): boolean;
/**
 * Normalize an export path: strip leading slash, collapse double slashes,
 * and remove any query/hash fragments. Always returns a relative path.
 */
export declare function normalizeExportPath(path: string): string;
/**
 * Get the standard MIME type for a given asset type.
 */
export declare function getMimeTypeForExportType(type: StaticExportAssetType): string;
/**
 * Deduplicate export assets by id, keeping the first occurrence.
 * Does not mutate the input.
 */
export declare function dedupeStaticExportAssets(assets: StaticExportAsset[]): StaticExportAsset[];
/**
 * Returns true when the object qualifies as a public export candidate.
 */
export declare function isPublicExportObject(object: KnowledgeObject): boolean;
