import { z } from "zod";
export const staticExportAssetTypeSchema = z.enum([
    "markdown",
    "json",
    "json-ld",
    "search-index",
    "llms",
    "llms-full",
    "sitemap",
    "manifest",
    "text",
    "xml",
]);
export const staticExportVisibilitySchema = z.enum(["public", "internal"]);
/**
 * A valid relative export path:
 * - must be a non-empty string;
 * - must NOT start with "/";
 * - must NOT contain "..";
 * - must NOT include query string or hash;
 * - must NOT contain duplicate slashes.
 */
export const exportPathSchema = z
    .string({ required_error: "GC_EXPORT_ASSET_PATH_MISSING" })
    .min(1, "GC_EXPORT_ASSET_PATH_MISSING")
    .refine((v) => !v.startsWith("/"), "GC_EXPORT_ASSET_PATH_INVALID")
    .refine((v) => !v.includes(".."), "GC_EXPORT_ASSET_PATH_INVALID")
    .refine((v) => !v.includes("?"), "GC_EXPORT_ASSET_PATH_INVALID")
    .refine((v) => !v.includes("#"), "GC_EXPORT_ASSET_PATH_INVALID")
    .refine((v) => !v.includes("//"), "GC_EXPORT_ASSET_PATH_INVALID");
export const staticExportAssetSchema = z.object({
    id: z.string({ required_error: "GC_EXPORT_ASSET_ID_MISSING" }).min(1, "GC_EXPORT_ASSET_ID_MISSING"),
    type: staticExportAssetTypeSchema,
    path: exportPathSchema,
    content: z.union([z.string().min(1, "GC_EXPORT_ASSET_CONTENT_MISSING"), z.record(z.unknown())]),
    mimeType: z.string({ required_error: "GC_EXPORT_ASSET_MIME_TYPE_MISSING" }).min(1, "GC_EXPORT_ASSET_MIME_TYPE_MISSING"),
    encoding: z.literal("utf-8"),
    sourceIds: z.array(z.string(), { invalid_type_error: "GC_EXPORT_ASSET_SOURCE_IDS_INVALID" }),
    visibility: staticExportVisibilitySchema,
    generatedAt: z
        .string({ required_error: "GC_EXPORT_ASSET_GENERATED_AT_MISSING" })
        .min(1, "GC_EXPORT_ASSET_GENERATED_AT_MISSING"),
    diagnostics: z.array(z.object({
        id: z.string(),
        severity: z.enum(["info", "warning", "error", "critical"]),
        code: z.string(),
        message: z.string(),
    }), { invalid_type_error: "GC_EXPORT_ASSET_DIAGNOSTICS_INVALID" }),
});
