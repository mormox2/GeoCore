import { applyRoutePattern, joinSiteUrlAndPath, createRouteId } from "./route-utils.js";
import { GC_ROUTE_LANGUAGE_MISSING, GC_ROUTE_SLUG_MISSING, } from "../validation/validation-codes.js";
/**
 * Resolve the canonical URL for a route.
 *
 * Precedence:
 *   1. explicitCanonicalUrl
 *   2. metadataCanonicalUrl
 *   3. siteUrl + path
 *   4. undefined (never invent a domain)
 */
export function resolveCanonicalUrl(input) {
    if (input.explicitCanonicalUrl && input.explicitCanonicalUrl.length > 0) {
        return input.explicitCanonicalUrl;
    }
    if (input.metadataCanonicalUrl && input.metadataCanonicalUrl.length > 0) {
        return input.metadataCanonicalUrl;
    }
    if (input.siteUrl && input.path) {
        return joinSiteUrlAndPath(input.siteUrl, input.path);
    }
    return undefined;
}
/**
 * Create a single route entry from a knowledge object (and optional metadata).
 *
 * Returns null when the object has neither a slug nor an explicit path —
 * the resolver never invents a slug.
 */
export function createRouteEntryFromKnowledgeObject(input) {
    const { object, metadata, siteUrl, pattern, explicitPath, explicitCanonicalUrl, alternates, redirects, generatedAt, } = input;
    const slug = metadata?.slug ?? object.slug;
    const language = metadata?.language ?? object.language;
    const status = (metadata?.status ?? object.status);
    // Resolve path: explicit override first, then pattern, then nothing.
    let path;
    if (explicitPath && explicitPath.length > 0) {
        path = explicitPath;
    }
    else if (slug) {
        path = pattern
            ? applyRoutePattern(pattern, { language, slug })
            : undefined;
    }
    // No slug and no explicit path -> we cannot build a meaningful route.
    if (!path) {
        return null;
    }
    // Visibility: published defaults to public; everything else falls back to
    // internal, since the source object is not yet published.
    let visibility;
    if (status === "published") {
        visibility = "public";
    }
    else {
        visibility = "internal";
    }
    const canonicalUrl = resolveCanonicalUrl({
        siteUrl,
        path,
        explicitCanonicalUrl,
        metadataCanonicalUrl: metadata?.canonicalUrl,
    });
    const routeType = "knowledge-object";
    const id = createRouteId(routeType, object.id);
    return {
        id,
        sourceId: object.id,
        sourceType: routeType,
        type: routeType,
        path,
        canonicalUrl,
        language,
        slug,
        status,
        visibility,
        isCanonical: true,
        alternates: alternates ?? [],
        redirects: redirects ?? [],
        generatedAt: generatedAt ?? new Date().toISOString(),
    };
}
/**
 * Build a slug/language diagnostic when a route could not be created because
 * its source object lacked a slug.
 */
export function buildSlugMissingDiagnostic(sourceId, generatedAt, index) {
    return {
        id: `route-diagnostic-${index}`,
        severity: "warning",
        code: GC_ROUTE_SLUG_MISSING,
        message: `Cannot resolve route for object "${sourceId}": missing slug.`,
        sourceId,
        recommendation: "Provide a slug on the object or its metadata, or pass an explicit path.",
    };
}
/**
 * Build a language-missing diagnostic (info-level hint).
 */
export function buildLanguageMissingDiagnostic(sourceId, index) {
    return {
        id: `route-diagnostic-${index}`,
        severity: "info",
        code: GC_ROUTE_LANGUAGE_MISSING,
        message: `Route for object "${sourceId}" has no language.`,
        sourceId,
    };
}
