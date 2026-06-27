import type { StaticExportAssetType } from "../types/static-export-asset.js";
/**
 * Create a relative export path from asset type and optional route/slug/language.
 *
 * Rules:
 * - output path is always relative (no leading slash);
 * - no "..", no query, no hash;
 * - extensions follow the type conventions.
 */
export declare function createExportPath(input: {
    type: StaticExportAssetType;
    routePath?: string;
    slug?: string;
    language?: string;
    sourceId?: string;
}): string;
