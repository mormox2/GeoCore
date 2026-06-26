import { z } from "zod";
export declare const staticExportManifestEntrySchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    path: z.ZodString;
    mimeType: z.ZodString;
    sourceIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    path: string;
    type: string;
    id: string;
    mimeType: string;
    sourceIds: string[];
}, {
    path: string;
    type: string;
    id: string;
    mimeType: string;
    sourceIds: string[];
}>;
export declare const staticExportManifestSchema: z.ZodObject<{
    id: z.ZodString;
    bundleId: z.ZodString;
    siteName: z.ZodString;
    siteUrl: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    assets: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        path: z.ZodString;
        mimeType: z.ZodString;
        sourceIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        path: string;
        type: string;
        id: string;
        mimeType: string;
        sourceIds: string[];
    }, {
        path: string;
        type: string;
        id: string;
        mimeType: string;
        sourceIds: string[];
    }>, "many">;
    generatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    generatedAt: string;
    siteName: string;
    bundleId: string;
    assets: {
        path: string;
        type: string;
        id: string;
        mimeType: string;
        sourceIds: string[];
    }[];
    language?: string | undefined;
    siteUrl?: string | undefined;
}, {
    id: string;
    generatedAt: string;
    siteName: string;
    bundleId: string;
    assets: {
        path: string;
        type: string;
        id: string;
        mimeType: string;
        sourceIds: string[];
    }[];
    language?: string | undefined;
    siteUrl?: string | undefined;
}>;
export declare const staticExportBundleSchema: z.ZodObject<{
    id: z.ZodString;
    siteName: z.ZodString;
    siteUrl: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    assets: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    manifest: z.ZodObject<{
        id: z.ZodString;
        bundleId: z.ZodString;
        siteName: z.ZodString;
        siteUrl: z.ZodOptional<z.ZodString>;
        language: z.ZodOptional<z.ZodString>;
        assets: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            type: z.ZodString;
            path: z.ZodString;
            mimeType: z.ZodString;
            sourceIds: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            path: string;
            type: string;
            id: string;
            mimeType: string;
            sourceIds: string[];
        }, {
            path: string;
            type: string;
            id: string;
            mimeType: string;
            sourceIds: string[];
        }>, "many">;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        generatedAt: string;
        siteName: string;
        bundleId: string;
        assets: {
            path: string;
            type: string;
            id: string;
            mimeType: string;
            sourceIds: string[];
        }[];
        language?: string | undefined;
        siteUrl?: string | undefined;
    }, {
        id: string;
        generatedAt: string;
        siteName: string;
        bundleId: string;
        assets: {
            path: string;
            type: string;
            id: string;
            mimeType: string;
            sourceIds: string[];
        }[];
        language?: string | undefined;
        siteUrl?: string | undefined;
    }>;
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
    id: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
    }[];
    generatedAt: string;
    siteName: string;
    manifest: {
        id: string;
        generatedAt: string;
        siteName: string;
        bundleId: string;
        assets: {
            path: string;
            type: string;
            id: string;
            mimeType: string;
            sourceIds: string[];
        }[];
        language?: string | undefined;
        siteUrl?: string | undefined;
    };
    assets: {
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
    }[];
    language?: string | undefined;
    siteUrl?: string | undefined;
}, {
    id: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
    }[];
    generatedAt: string;
    siteName: string;
    manifest: {
        id: string;
        generatedAt: string;
        siteName: string;
        bundleId: string;
        assets: {
            path: string;
            type: string;
            id: string;
            mimeType: string;
            sourceIds: string[];
        }[];
        language?: string | undefined;
        siteUrl?: string | undefined;
    };
    assets: {
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
    }[];
    language?: string | undefined;
    siteUrl?: string | undefined;
}>;
