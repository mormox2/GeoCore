import type { RouteEntry, RouteAlternate, RouteRedirect } from "../types/route-entry.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { ResolvedMetadata } from "../types/metadata.js";
import type { RouteDiagnostic } from "../types/route-diagnostic.js";
/**
 * Resolve the canonical URL for a route.
 *
 * Precedence:
 *   1. explicitCanonicalUrl
 *   2. metadataCanonicalUrl
 *   3. siteUrl + path
 *   4. undefined (never invent a domain)
 */
export declare function resolveCanonicalUrl(input: {
    siteUrl?: string;
    path?: string;
    explicitCanonicalUrl?: string;
    metadataCanonicalUrl?: string;
}): string | undefined;
/**
 * Create a single route entry from a knowledge object (and optional metadata).
 *
 * Returns null when the object has neither a slug nor an explicit path —
 * the resolver never invents a slug.
 */
export declare function createRouteEntryFromKnowledgeObject(input: {
    object: KnowledgeObject;
    metadata?: ResolvedMetadata;
    siteUrl?: string;
    pattern?: string;
    explicitPath?: string;
    explicitCanonicalUrl?: string;
    alternates?: RouteAlternate[];
    redirects?: RouteRedirect[];
    generatedAt?: string;
}): RouteEntry | null;
/**
 * Build a slug/language diagnostic when a route could not be created because
 * its source object lacked a slug.
 */
export declare function buildSlugMissingDiagnostic(sourceId: string, generatedAt: string, index: number): RouteDiagnostic;
/**
 * Build a language-missing diagnostic (info-level hint).
 */
export declare function buildLanguageMissingDiagnostic(sourceId: string, index: number): RouteDiagnostic;
