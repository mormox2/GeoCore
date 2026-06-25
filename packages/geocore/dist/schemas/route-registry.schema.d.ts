import { z } from "zod";
export declare const routeDiagnosticSeveritySchema: z.ZodEnum<["info", "warning", "error", "critical"]>;
export declare const routeDiagnosticSchema: z.ZodObject<{
    id: z.ZodString;
    severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
    code: z.ZodString;
    message: z.ZodString;
    sourceId: z.ZodOptional<z.ZodString>;
    routeId: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    field: z.ZodOptional<z.ZodString>;
    recommendation: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    severity: "info" | "warning" | "error" | "critical";
    path?: string | undefined;
    sourceId?: string | undefined;
    field?: string | undefined;
    recommendation?: string | undefined;
    routeId?: string | undefined;
}, {
    code: string;
    message: string;
    id: string;
    severity: "info" | "warning" | "error" | "critical";
    path?: string | undefined;
    sourceId?: string | undefined;
    field?: string | undefined;
    recommendation?: string | undefined;
    routeId?: string | undefined;
}>;
export declare const routeRegistrySchema: z.ZodObject<{
    id: z.ZodString;
    siteUrl: z.ZodOptional<z.ZodString>;
    routes: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    generatedAt: z.ZodString;
    diagnostics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
        code: z.ZodString;
        message: z.ZodString;
        sourceId: z.ZodOptional<z.ZodString>;
        routeId: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        field: z.ZodOptional<z.ZodString>;
        recommendation: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        path?: string | undefined;
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        routeId?: string | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        path?: string | undefined;
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        routeId?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        path?: string | undefined;
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        routeId?: string | undefined;
    }[];
    generatedAt: string;
    routes: {
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
    }[];
    siteUrl?: string | undefined;
}, {
    id: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        path?: string | undefined;
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        routeId?: string | undefined;
    }[];
    generatedAt: string;
    routes: {
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
    }[];
    siteUrl?: string | undefined;
}>;
