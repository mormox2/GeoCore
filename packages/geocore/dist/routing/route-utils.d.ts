import type { KnowledgeObject } from "../types/knowledge-object.js";
/**
 * Deterministic route ID: route_{sourceType}_{sourceId}.
 * Never random — routes are output projections that must be reproducible.
 */
export declare function createRouteId(sourceType: string, sourceId: string): string;
/**
 * Apply a route pattern by substituting :language / :slug / :type.
 * Returns undefined when a required token has no value, so callers can
 * fall back to an explicit path instead of producing a malformed route.
 */
export declare function applyRoutePattern(pattern: string, values: {
    language?: string;
    slug?: string;
    type?: string;
}): string | undefined;
/**
 * Normalize a route path: strip protocol/domain if a full URL slipped in,
 * collapse duplicate slashes, and guarantee a leading "/".
 * Whitespace is trimmed but inner whitespace is left to the path validator.
 */
export declare function normalizeRoutePath(path: string): string;
/**
 * A valid route path:
 * - starts with "/";
 * - has no protocol/domain;
 * - has no query string or hash fragment;
 * - has no whitespace;
 * - has no duplicate slashes.
 */
export declare function isValidRoutePath(path: string): boolean;
/**
 * A valid canonical URL is an absolute http(s) URL.
 */
export declare function isValidCanonicalUrl(url: string): boolean;
/**
 * Join a site URL and a path, normalizing the boundary slashes.
 * Preserves the https:// scheme on the site URL.
 */
export declare function joinSiteUrlAndPath(siteUrl: string, path: string): string;
/**
 * A knowledge object is a public route candidate when:
 * - its status is published; and
 * - it has no visibility override that marks it non-public.
 */
export declare function isPublicRouteObject(object: KnowledgeObject): boolean;
/**
 * Deduplicate route entries by id, keeping the first occurrence.
 * Does not mutate the input.
 */
export declare function dedupeRouteEntries<RouteEntry extends {
    id: string;
}>(routes: RouteEntry[]): RouteEntry[];
