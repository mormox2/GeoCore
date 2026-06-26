import { z } from "zod";
import { staticExportAssetSchema } from "./static-export-asset.schema.js";
export const staticExportManifestEntrySchema = z.object({
    id: z.string().min(1),
    type: z.string().min(1),
    path: z.string().min(1),
    mimeType: z.string().min(1),
    sourceIds: z.array(z.string()),
});
export const staticExportManifestSchema = z.object({
    id: z.string().min(1),
    bundleId: z.string().min(1),
    siteName: z.string().min(1),
    siteUrl: z.string().optional(),
    language: z.string().optional(),
    assets: z.array(staticExportManifestEntrySchema),
    generatedAt: z.string().min(1),
});
export const staticExportBundleSchema = z.object({
    id: z.string({ required_error: "GC_EXPORT_BUNDLE_ID_MISSING" }).min(1, "GC_EXPORT_BUNDLE_ID_MISSING"),
    siteName: z.string({ required_error: "GC_EXPORT_BUNDLE_SITE_NAME_MISSING" }).min(1, "GC_EXPORT_BUNDLE_SITE_NAME_MISSING"),
    siteUrl: z.string().optional(),
    language: z.string().optional(),
    assets: z.array(staticExportAssetSchema, { invalid_type_error: "GC_EXPORT_BUNDLE_ASSETS_INVALID" }),
    manifest: staticExportManifestSchema,
    generatedAt: z
        .string({ required_error: "GC_EXPORT_BUNDLE_GENERATED_AT_MISSING" })
        .min(1, "GC_EXPORT_BUNDLE_GENERATED_AT_MISSING"),
    diagnostics: z.array(z.object({
        id: z.string(),
        severity: z.enum(["info", "warning", "error", "critical"]),
        code: z.string(),
        message: z.string(),
    }), { invalid_type_error: "GC_EXPORT_BUNDLE_DIAGNOSTICS_INVALID" }),
});
