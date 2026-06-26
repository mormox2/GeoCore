import type { StaticExportDiagnostic } from "./static-export-diagnostic.js";
/**
 * Supported asset types for a static export.
 */
export type StaticExportAssetType = "markdown" | "json" | "json-ld" | "search-index" | "llms" | "llms-full" | "sitemap" | "manifest" | "text" | "xml";
/**
 * Visibility of an exported asset. Only public/internal in this sprint.
 */
export type StaticExportVisibility = "public" | "internal";
/**
 * A single exported asset inside a StaticExportBundle.
 * Assets are in-memory only — no file system writes.
 */
export type StaticExportAsset = {
    id: string;
    type: StaticExportAssetType;
    path: string;
    content: string | Record<string, unknown>;
    mimeType: string;
    encoding: "utf-8";
    sourceIds: string[];
    visibility: StaticExportVisibility;
    generatedAt: string;
    diagnostics: StaticExportDiagnostic[];
};
