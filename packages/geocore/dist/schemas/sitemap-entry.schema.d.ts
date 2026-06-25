import { z } from "zod";
export declare const sitemapChangeFrequencySchema: z.ZodEnum<["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]>;
export declare const sitemapVisibilitySchema: z.ZodEnum<["public", "internal", "private", "hidden"]>;
export declare const sitemapAlternateLinkSchema: z.ZodObject<{
    language: z.ZodString;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    language: string;
    url: string;
}, {
    language: string;
    url: string;
}>;
export declare const sitemapImageSchema: z.ZodObject<{
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
}>;
export declare const sitemapEntrySchema: z.ZodObject<{
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
}>;
