import { z } from "zod";
export declare const staticExportAssetTypeSchema: z.ZodEnum<["markdown", "json", "json-ld", "search-index", "llms", "llms-full", "sitemap", "manifest", "text", "xml"]>;
export declare const staticExportVisibilitySchema: z.ZodEnum<["public", "internal"]>;
/**
 * A valid relative export path:
 * - must be a non-empty string;
 * - must NOT start with "/";
 * - must NOT contain "..";
 * - must NOT include query string or hash;
 * - must NOT contain duplicate slashes.
 */
export declare const exportPathSchema: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>;
export declare const staticExportAssetSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["markdown", "json", "json-ld", "search-index", "llms", "llms-full", "sitemap", "manifest", "text", "xml"]>;
    path: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>;
    content: z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>]>;
    mimeType: z.ZodString;
    encoding: z.ZodLiteral<"utf-8">;
    sourceIds: z.ZodArray<z.ZodString, "many">;
    visibility: z.ZodEnum<["public", "internal"]>;
    generatedAt: z.ZodString;
    diagnostics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
    }, {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    path: string;
    type: "markdown" | "json" | "json-ld" | "xml" | "text" | "llms" | "sitemap" | "search-index" | "llms-full" | "manifest";
    id: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
    }[];
    content: string | Record<string, unknown>;
    generatedAt: string;
    visibility: "public" | "internal";
    mimeType: string;
    encoding: "utf-8";
    sourceIds: string[];
}, {
    path: string;
    type: "markdown" | "json" | "json-ld" | "xml" | "text" | "llms" | "sitemap" | "search-index" | "llms-full" | "manifest";
    id: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
    }[];
    content: string | Record<string, unknown>;
    generatedAt: string;
    visibility: "public" | "internal";
    mimeType: string;
    encoding: "utf-8";
    sourceIds: string[];
}>;
