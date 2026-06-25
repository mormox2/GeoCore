import { rtimidentalFixture, rtimiDentalSiteUrl, rtimiDentalExpectedRoute, } from "./rtimidental.fixture.js";
import { dawajinproFixture, dawajinProSiteUrl, dawajinProExpectedRoute, } from "./dawajinpro.fixture.js";
const GENERATED_AT = "2026-06-25T10:00:00Z";
/**
 * A minimal valid route entry used as a baseline by schema/validation tests.
 */
export const sampleRouteEntry = {
    id: "route_knowledge-object_ko_sample",
    sourceId: "ko_sample",
    sourceType: "knowledge-object",
    type: "knowledge-object",
    path: "/fr/sample-slug",
    canonicalUrl: "https://example.com/fr/sample-slug",
    language: "fr",
    slug: "sample-slug",
    status: "published",
    visibility: "public",
    isCanonical: true,
    alternates: [],
    redirects: [],
    generatedAt: GENERATED_AT,
};
/**
 * A route entry with an alternate and a redirect, for testing the richer shape.
 */
export const sampleRouteEntryWithAlternatesAndRedirects = {
    ...sampleRouteEntry,
    id: "route_knowledge-object_ko_sample_rich",
    alternates: [
        {
            language: "en",
            path: "/en/sample-slug",
            canonicalUrl: "https://example.com/en/sample-slug",
        },
    ],
    redirects: [
        {
            from: "/fr/old-sample",
            to: "/fr/sample-slug",
            statusCode: 301,
            reason: "Slug updated",
        },
    ],
};
/**
 * A clean two-route registry used by registry/conflict tests.
 */
export const sampleRouteRegistry = {
    id: "route-registry-sample",
    siteUrl: "https://example.com",
    routes: [sampleRouteEntry],
    generatedAt: GENERATED_AT,
    diagnostics: [],
};
/**
 * RTimi Dental route registry: one published object -> one public route.
 */
export const rtimiDentalRouteRegistry = {
    id: "route-registry-rtimidental",
    siteUrl: rtimiDentalSiteUrl,
    routes: [
        {
            id: "route_knowledge-object_ko_detartrage_abime_dents",
            sourceId: rtimidentalFixture.id,
            sourceType: "knowledge-object",
            type: "knowledge-object",
            path: rtimiDentalExpectedRoute.path,
            canonicalUrl: rtimiDentalExpectedRoute.canonicalUrl,
            language: rtimiDentalExpectedRoute.language,
            slug: rtimidentalFixture.slug,
            status: rtimiDentalExpectedRoute.status,
            visibility: rtimiDentalExpectedRoute.visibility,
            isCanonical: true,
            alternates: [],
            redirects: [],
            generatedAt: GENERATED_AT,
        },
    ],
    generatedAt: GENERATED_AT,
    diagnostics: [],
};
/**
 * Dawajin Pro route registry: one published object -> one public route.
 */
export const dawajinProRouteRegistry = {
    id: "route-registry-dawajinpro",
    siteUrl: dawajinProSiteUrl,
    routes: [
        {
            id: "route_knowledge-object_ko_customer_balance_management",
            sourceId: dawajinproFixture.id,
            sourceType: "knowledge-object",
            type: "knowledge-object",
            path: dawajinProExpectedRoute.path,
            canonicalUrl: dawajinProExpectedRoute.canonicalUrl,
            language: dawajinProExpectedRoute.language,
            slug: dawajinproFixture.slug,
            status: dawajinProExpectedRoute.status,
            visibility: dawajinProExpectedRoute.visibility,
            isCanonical: true,
            alternates: [],
            redirects: [],
            generatedAt: GENERATED_AT,
        },
    ],
    generatedAt: GENERATED_AT,
    diagnostics: [],
};
/**
 * ResolveRoutesInput for the RTimi Dental fixture.
 */
export const rtimiDentalRouteInput = {
    id: "route-registry-rtimidental",
    siteUrl: rtimiDentalSiteUrl,
    objects: [rtimidentalFixture],
};
/**
 * ResolveRoutesInput for the Dawajin Pro fixture.
 */
export const dawajinProRouteInput = {
    id: "route-registry-dawajinpro",
    siteUrl: dawajinProSiteUrl,
    objects: [dawajinproFixture],
};
/**
 * A registry with duplicate route paths, for conflict tests.
 */
export const duplicatePathRegistry = {
    ...sampleRouteRegistry,
    id: "route-registry-duplicate-path",
    routes: [
        sampleRouteEntry,
        {
            ...sampleRouteEntry,
            id: "route_knowledge-object_ko_sample_2",
            sourceId: "ko_sample_2",
        },
    ],
};
/**
 * A registry with a self-redirect, for conflict tests.
 */
export const selfRedirectRegistry = {
    ...sampleRouteRegistry,
    id: "route-registry-self-redirect",
    routes: [
        {
            ...sampleRouteEntry,
            redirects: [
                {
                    from: "/fr/sample-slug",
                    to: "/fr/sample-slug",
                    statusCode: 301,
                },
            ],
        },
    ],
};
/**
 * A registry with a redirect loop (A -> B -> A), for conflict tests.
 */
export const redirectLoopRegistry = {
    ...sampleRouteRegistry,
    id: "route-registry-redirect-loop",
    routes: [
        {
            ...sampleRouteEntry,
            redirects: [
                { from: "/fr/a", to: "/fr/b", statusCode: 301 },
                { from: "/fr/b", to: "/fr/a", statusCode: 301 },
            ],
        },
    ],
};
/**
 * A registry with a warning-only diagnostic, used to prove warnings do not
 * block publication.
 */
export const warningOnlyRegistry = {
    ...sampleRouteRegistry,
    id: "route-registry-warning-only",
    diagnostics: [
        {
            id: "route-diagnostic-warning",
            severity: "warning",
            code: "GC_ROUTE_SLUG_MISSING",
            message: "A non-blocking warning.",
        },
    ],
};
