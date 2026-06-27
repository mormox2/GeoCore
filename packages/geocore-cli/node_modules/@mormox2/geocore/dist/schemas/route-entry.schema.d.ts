import { z } from "zod";
export declare const routeTypeSchema: z.ZodEnum<["knowledge-object", "collection", "glossary-entry", "documentation", "media", "api", "llms", "sitemap", "static"]>;
export declare const routeVisibilitySchema: z.ZodEnum<["public", "internal", "private", "hidden"]>;
export declare const routeStatusSchema: z.ZodEnum<["draft", "review", "published", "archived"]>;
/**
 * Path shape rules encoded in Zod:
 * - must be a non-empty string;
 * - must start with a leading "/";
 * - must not include protocol, domain, query, hash, duplicate slashes, or whitespace.
 * Language scripts (e.g. Arabic) are preserved.
 */
export declare const routePathSchema: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, string, string>;
export declare const routeCanonicalUrlSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const routeAlternateSchema: z.ZodObject<{
    language: z.ZodString;
    path: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, string, string>;
    canonicalUrl: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
}, "strip", z.ZodTypeAny, {
    language: string;
    path: string;
    canonicalUrl?: string | undefined;
}, {
    language: string;
    path: string;
    canonicalUrl?: string | undefined;
}>;
export declare const routeRedirectStatusCodeSchema: z.ZodUnion<[z.ZodLiteral<301>, z.ZodLiteral<302>, z.ZodLiteral<307>, z.ZodLiteral<308>]>;
export declare const routeRedirectSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
    statusCode: z.ZodUnion<[z.ZodLiteral<301>, z.ZodLiteral<302>, z.ZodLiteral<307>, z.ZodLiteral<308>]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    statusCode: 301 | 302 | 307 | 308;
    reason?: string | undefined;
}, {
    from: string;
    to: string;
    statusCode: 301 | 302 | 307 | 308;
    reason?: string | undefined;
}>;
export declare const routeEntrySchema: z.ZodObject<{
    id: z.ZodString;
    sourceId: z.ZodString;
    sourceType: z.ZodString;
    type: z.ZodEnum<["knowledge-object", "collection", "glossary-entry", "documentation", "media", "api", "llms", "sitemap", "static"]>;
    path: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, string, string>;
    canonicalUrl: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    language: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "review", "published", "archived"]>;
    visibility: z.ZodEnum<["public", "internal", "private", "hidden"]>;
    isCanonical: z.ZodBoolean;
    alternates: z.ZodArray<z.ZodObject<{
        language: z.ZodString;
        path: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>, string, string>, string, string>;
        canonicalUrl: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    }, "strip", z.ZodTypeAny, {
        language: string;
        path: string;
        canonicalUrl?: string | undefined;
    }, {
        language: string;
        path: string;
        canonicalUrl?: string | undefined;
    }>, "many">;
    redirects: z.ZodArray<z.ZodObject<{
        from: z.ZodString;
        to: z.ZodString;
        statusCode: z.ZodUnion<[z.ZodLiteral<301>, z.ZodLiteral<302>, z.ZodLiteral<307>, z.ZodLiteral<308>]>;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        to: string;
        statusCode: 301 | 302 | 307 | 308;
        reason?: string | undefined;
    }, {
        from: string;
        to: string;
        statusCode: 301 | 302 | 307 | 308;
        reason?: string | undefined;
    }>, "many">;
    generatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    type: "documentation" | "knowledge-object" | "media" | "collection" | "glossary-entry" | "api" | "llms" | "sitemap" | "static";
    status: "draft" | "review" | "published" | "archived";
    id: string;
    sourceId: string;
    generatedAt: string;
    sourceType: string;
    visibility: "public" | "private" | "internal" | "hidden";
    alternates: {
        language: string;
        path: string;
        canonicalUrl?: string | undefined;
    }[];
    isCanonical: boolean;
    redirects: {
        from: string;
        to: string;
        statusCode: 301 | 302 | 307 | 308;
        reason?: string | undefined;
    }[];
    language?: string | undefined;
    canonicalUrl?: string | undefined;
    slug?: string | undefined;
}, {
    path: string;
    type: "documentation" | "knowledge-object" | "media" | "collection" | "glossary-entry" | "api" | "llms" | "sitemap" | "static";
    status: "draft" | "review" | "published" | "archived";
    id: string;
    sourceId: string;
    generatedAt: string;
    sourceType: string;
    visibility: "public" | "private" | "internal" | "hidden";
    alternates: {
        language: string;
        path: string;
        canonicalUrl?: string | undefined;
    }[];
    isCanonical: boolean;
    redirects: {
        from: string;
        to: string;
        statusCode: 301 | 302 | 307 | 308;
        reason?: string | undefined;
    }[];
    language?: string | undefined;
    canonicalUrl?: string | undefined;
    slug?: string | undefined;
}>;
