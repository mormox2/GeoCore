import { z } from "zod";
export const routeTypeSchema = z.enum([
    "knowledge-object",
    "collection",
    "glossary-entry",
    "documentation",
    "media",
    "api",
    "llms",
    "sitemap",
    "static",
]);
export const routeVisibilitySchema = z.enum(["public", "internal", "private", "hidden"]);
export const routeStatusSchema = z.enum(["draft", "review", "published", "archived"]);
/**
 * Path shape rules encoded in Zod:
 * - must be a non-empty string;
 * - must start with a leading "/";
 * - must not include protocol, domain, query, hash, duplicate slashes, or whitespace.
 * Language scripts (e.g. Arabic) are preserved.
 */
export const routePathSchema = z
    .string({ required_error: "GC_ROUTE_PATH_MISSING" })
    .min(1, "GC_ROUTE_PATH_MISSING")
    .refine((value) => value.startsWith("/"), "GC_ROUTE_PATH_INVALID")
    .refine((value) => !/^[^/]*:\/\//.test(value), "GC_ROUTE_PATH_INVALID")
    .refine((value) => !value.includes("?"), "GC_ROUTE_PATH_INVALID")
    .refine((value) => !value.includes("#"), "GC_ROUTE_PATH_INVALID")
    .refine((value) => !/\s/.test(value), "GC_ROUTE_PATH_INVALID")
    .refine((value) => !value.includes("//"), "GC_ROUTE_PATH_INVALID");
export const routeCanonicalUrlSchema = z
    .string()
    .min(1, "GC_ROUTE_CANONICAL_URL_INVALID")
    .refine((value) => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    }
    catch {
        return false;
    }
}, "GC_ROUTE_CANONICAL_URL_INVALID");
export const routeAlternateSchema = z.object({
    language: z.string().min(1, "GC_ROUTE_LANGUAGE_MISSING"),
    path: routePathSchema,
    canonicalUrl: routeCanonicalUrlSchema.optional(),
});
export const routeRedirectStatusCodeSchema = z.union([
    z.literal(301),
    z.literal(302),
    z.literal(307),
    z.literal(308),
]);
export const routeRedirectSchema = z.object({
    from: z.string().min(1, "GC_ROUTE_REDIRECT_SELF"),
    to: z.string().min(1, "GC_ROUTE_REDIRECT_SELF"),
    statusCode: routeRedirectStatusCodeSchema,
    reason: z.string().optional(),
});
export const routeEntrySchema = z.object({
    id: z.string({ required_error: "GC_ROUTE_ID_MISSING" }).min(1, "GC_ROUTE_ID_MISSING"),
    sourceId: z
        .string({ required_error: "GC_ROUTE_SOURCE_ID_MISSING" })
        .min(1, "GC_ROUTE_SOURCE_ID_MISSING"),
    sourceType: z
        .string({ required_error: "GC_ROUTE_SOURCE_TYPE_MISSING" })
        .min(1, "GC_ROUTE_SOURCE_TYPE_MISSING"),
    type: routeTypeSchema,
    path: routePathSchema,
    canonicalUrl: routeCanonicalUrlSchema.optional(),
    language: z.string().optional(),
    slug: z.string().optional(),
    status: routeStatusSchema,
    visibility: routeVisibilitySchema,
    isCanonical: z.boolean(),
    alternates: z.array(routeAlternateSchema, { invalid_type_error: "GC_ROUTE_ALTERNATES_INVALID" }),
    redirects: z.array(routeRedirectSchema, { invalid_type_error: "GC_ROUTE_REDIRECTS_INVALID" }),
    generatedAt: z
        .string({ required_error: "GC_ROUTE_GENERATED_AT_MISSING" })
        .min(1, "GC_ROUTE_GENERATED_AT_MISSING"),
});
