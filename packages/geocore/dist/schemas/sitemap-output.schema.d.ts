import { z } from "zod";
export declare const sitemapDiagnosticSeveritySchema: z.ZodEnum<["info", "warning", "error", "critical"]>;
export declare const sitemapDiagnosticSchema: z.ZodObject<{
    id: z.ZodString;
    severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
    code: z.ZodString;
    message: z.ZodString;
    sourceId: z.ZodOptional<z.ZodString>;
    entryId: z.ZodOptional<z.ZodString>;
    field: z.ZodOptional<z.ZodString>;
    recommendation: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    severity: "info" | "warning" | "error" | "critical";
    sourceId?: string | undefined;
    field?: string | undefined;
    recommendation?: string | undefined;
    entryId?: string | undefined;
}, {
    code: string;
    message: string;
    id: string;
    severity: "info" | "warning" | "error" | "critical";
    sourceId?: string | undefined;
    field?: string | undefined;
    recommendation?: string | undefined;
    entryId?: string | undefined;
}>;
export declare const sitemapOutputTypeSchema: z.ZodEnum<["urlset", "index"]>;
export declare const sitemapOutputSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["urlset", "index"]>;
    siteUrl: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sourceId: z.ZodString;
        sourceType: z.ZodString;
        url: z.ZodString;
        language: z.ZodOptional<z.ZodString>;
        lastModified: z.ZodOptional<z.ZodString>;
        changeFrequency: z.ZodOptional<z.ZodEnum<["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]>>;
        priority: z.ZodOptional<z.ZodNumber>;
        visibility: z.ZodEnum<["public", "internal", "private", "hidden"]>;
        status: z.ZodString;
        alternates: z.ZodArray<z.ZodObject<{
            language: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            language: string;
            url: string;
        }, {
            language: string;
            url: string;
        }>, "many">;
        images: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            caption: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            title?: string | undefined;
            caption?: string | undefined;
        }, {
            url: string;
            title?: string | undefined;
            caption?: string | undefined;
        }>, "many">;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: string;
        id: string;
        url: string;
        sourceId: string;
        generatedAt: string;
        sourceType: string;
        visibility: "public" | "private" | "internal" | "hidden";
        alternates: {
            language: string;
            url: string;
        }[];
        images: {
            url: string;
            title?: string | undefined;
            caption?: string | undefined;
        }[];
        language?: string | undefined;
        lastModified?: string | undefined;
        changeFrequency?: "never" | "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | undefined;
        priority?: number | undefined;
    }, {
        status: string;
        id: string;
        url: string;
        sourceId: string;
        generatedAt: string;
        sourceType: string;
        visibility: "public" | "private" | "internal" | "hidden";
        alternates: {
            language: string;
            url: string;
        }[];
        images: {
            url: string;
            title?: string | undefined;
            caption?: string | undefined;
        }[];
        language?: string | undefined;
        lastModified?: string | undefined;
        changeFrequency?: "never" | "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | undefined;
        priority?: number | undefined;
    }>, "many">;
    xml: z.ZodString;
    generatedAt: z.ZodString;
    diagnostics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
        code: z.ZodString;
        message: z.ZodString;
        sourceId: z.ZodOptional<z.ZodString>;
        entryId: z.ZodOptional<z.ZodString>;
        field: z.ZodOptional<z.ZodString>;
        recommendation: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        entryId?: string | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        entryId?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    xml: string;
    entries: {
        status: string;
        id: string;
        url: string;
        sourceId: string;
        generatedAt: string;
        sourceType: string;
        visibility: "public" | "private" | "internal" | "hidden";
        alternates: {
            language: string;
            url: string;
        }[];
        images: {
            url: string;
            title?: string | undefined;
            caption?: string | undefined;
        }[];
        language?: string | undefined;
        lastModified?: string | undefined;
        changeFrequency?: "never" | "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | undefined;
        priority?: number | undefined;
    }[];
    type: "urlset" | "index";
    id: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        entryId?: string | undefined;
    }[];
    generatedAt: string;
    language?: string | undefined;
    siteUrl?: string | undefined;
}, {
    xml: string;
    entries: {
        status: string;
        id: string;
        url: string;
        sourceId: string;
        generatedAt: string;
        sourceType: string;
        visibility: "public" | "private" | "internal" | "hidden";
        alternates: {
            language: string;
            url: string;
        }[];
        images: {
            url: string;
            title?: string | undefined;
            caption?: string | undefined;
        }[];
        language?: string | undefined;
        lastModified?: string | undefined;
        changeFrequency?: "never" | "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | undefined;
        priority?: number | undefined;
    }[];
    type: "urlset" | "index";
    id: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        entryId?: string | undefined;
    }[];
    generatedAt: string;
    language?: string | undefined;
    siteUrl?: string | undefined;
}>;
