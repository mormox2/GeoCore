/**
 * Deterministic route ID: route_{sourceType}_{sourceId}.
 * Never random — routes are output projections that must be reproducible.
 */
export function createRouteId(sourceType, sourceId) {
    return `route_${sourceType}_${sourceId}`;
}
const PATTERN_TOKEN = /:([a-zA-Z]+)/g;
/**
 * Apply a route pattern by substituting :language / :slug / :type.
 * Returns undefined when a required token has no value, so callers can
 * fall back to an explicit path instead of producing a malformed route.
 */
export function applyRoutePattern(pattern, values) {
    if (!pattern)
        return undefined;
    let missing = false;
    let result = pattern.replace(PATTERN_TOKEN, (_match, token) => {
        const value = values[token];
        if (value === undefined || value === "") {
            missing = true;
            return "";
        }
        return value;
    });
    if (missing)
        return undefined;
    // Collapse accidental duplicate slashes that come from empty adjacent segments,
    // but always preserve the leading slash.
    result = normalizeRoutePath(result);
    return result.length > 0 ? result : undefined;
}
/**
 * Normalize a route path: strip protocol/domain if a full URL slipped in,
 * collapse duplicate slashes, and guarantee a leading "/".
 * Whitespace is trimmed but inner whitespace is left to the path validator.
 */
export function normalizeRoutePath(path) {
    if (!path)
        return "/";
    let value = path.trim();
    // If a full URL was provided, keep only the pathname.
    try {
        const url = new URL(value);
        value = url.pathname;
    }
    catch {
        // not a URL — keep as-is
    }
    // Collapse runs of "/" into a single slash.
    value = value.replace(/\/+/g, "/");
    if (!value.startsWith("/")) {
        value = "/" + value;
    }
    return value;
}
/**
 * A valid route path:
 * - starts with "/";
 * - has no protocol/domain;
 * - has no query string or hash fragment;
 * - has no whitespace;
 * - has no duplicate slashes.
 */
export function isValidRoutePath(path) {
    if (typeof path !== "string" || path.length === 0)
        return false;
    if (!path.startsWith("/"))
        return false;
    if (/^[^/]*:\/\//.test(path))
        return false;
    if (path.includes("?"))
        return false;
    if (path.includes("#"))
        return false;
    if (/\s/.test(path))
        return false;
    if (path.includes("//"))
        return false;
    return true;
}
/**
 * A valid canonical URL is an absolute http(s) URL.
 */
export function isValidCanonicalUrl(url) {
    if (typeof url !== "string" || url.length === 0)
        return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    }
    catch {
        return false;
    }
}
/**
 * Join a site URL and a path, normalizing the boundary slashes.
 * Preserves the https:// scheme on the site URL.
 */
export function joinSiteUrlAndPath(siteUrl, path) {
    const base = siteUrl.replace(/\/+$/, "");
    const tail = path.startsWith("/") ? path : "/" + path;
    return base + tail;
}
const PUBLIC_STATUSES = new Set(["published"]);
/**
 * A knowledge object is a public route candidate when:
 * - its status is published; and
 * - it has no visibility override that marks it non-public.
 */
export function isPublicRouteObject(object) {
    if (!object)
        return false;
    if (!PUBLIC_STATUSES.has(object.status))
        return false;
    return true;
}
/**
 * Deduplicate route entries by id, keeping the first occurrence.
 * Does not mutate the input.
 */
export function dedupeRouteEntries(routes) {
    const seen = new Set();
    const out = [];
    for (const route of routes) {
        if (!route || typeof route.id !== "string")
            continue;
        if (seen.has(route.id))
            continue;
        seen.add(route.id);
        out.push(route);
    }
    return out;
}
