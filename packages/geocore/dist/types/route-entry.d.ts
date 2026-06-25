import type { RouteType, RouteVisibility, RouteStatus } from "./route.js";
/**
 * A language alternate for a route. Alternates are always explicit.
 */
export type RouteAlternate = {
    language: string;
    path: string;
    canonicalUrl?: string;
};
/**
 * A redirect modeled against a route. Only modeled here —
 * HTTP redirect behavior is not implemented in this sprint.
 */
export type RouteRedirect = {
    from: string;
    to: string;
    statusCode: 301 | 302 | 307 | 308;
    reason?: string;
};
/**
 * A resolved route entry. Routes are output projections derived from
 * validated GeoCore knowledge; they are never the source of truth.
 */
export type RouteEntry = {
    id: string;
    sourceId: string;
    sourceType: string;
    type: RouteType;
    path: string;
    canonicalUrl?: string;
    language?: string;
    slug?: string;
    status: RouteStatus;
    visibility: RouteVisibility;
    isCanonical: boolean;
    alternates: RouteAlternate[];
    redirects: RouteRedirect[];
    generatedAt: string;
};
