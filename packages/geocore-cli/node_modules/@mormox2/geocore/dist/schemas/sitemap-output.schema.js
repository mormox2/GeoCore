import { z } from "zod";
import { sitemapEntrySchema } from "./sitemap-entry.schema.js";
export const sitemapDiagnosticSeveritySchema = z.enum(["info", "warning", "error", "critical"]);
export const sitemapDiagnosticSchema = z.object({
    id: z.string().min(1),
    severity: sitemapDiagnosticSeveritySchema,
    code: z.string().min(1),
    message: z.string().min(1),
    sourceId: z.string().optional(),
    entryId: z.string().optional(),
    field: z.string().optional(),
    recommendation: z.string().optional(),
});
export const sitemapOutputTypeSchema = z.enum(["urlset", "index"]);
export const sitemapOutputSchema = z.object({
    id: z.string({ required_error: "GC_SITEMAP_OUTPUT_ID_MISSING" }).min(1, "GC_SITEMAP_OUTPUT_ID_MISSING"),
    type: sitemapOutputTypeSchema,
    siteUrl: z.string().url().optional(),
    language: z.string().optional(),
    entries: z.array(sitemapEntrySchema, { invalid_type_error: "GC_SITEMAP_ENTRIES_INVALID" }),
    xml: z.string({ required_error: "GC_SITEMAP_XML_MISSING" }).min(1, "GC_SITEMAP_XML_MISSING"),
    generatedAt: z.string({ required_error: "GC_SITEMAP_GENERATED_AT_MISSING" }).min(1, "GC_SITEMAP_GENERATED_AT_MISSING"),
    diagnostics: z.array(sitemapDiagnosticSchema),
});
