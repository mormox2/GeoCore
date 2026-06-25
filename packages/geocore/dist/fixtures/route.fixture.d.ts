import type { RouteEntry } from "../types/route-entry.js";
import type { RouteRegistry, ResolveRoutesInput } from "../types/route.js";
/**
 * A minimal valid route entry used as a baseline by schema/validation tests.
 */
export declare const sampleRouteEntry: RouteEntry;
/**
 * A route entry with an alternate and a redirect, for testing the richer shape.
 */
export declare const sampleRouteEntryWithAlternatesAndRedirects: RouteEntry;
/**
 * A clean two-route registry used by registry/conflict tests.
 */
export declare const sampleRouteRegistry: RouteRegistry;
/**
 * RTimi Dental route registry: one published object -> one public route.
 */
export declare const rtimiDentalRouteRegistry: RouteRegistry;
/**
 * Dawajin Pro route registry: one published object -> one public route.
 */
export declare const dawajinProRouteRegistry: RouteRegistry;
/**
 * ResolveRoutesInput for the RTimi Dental fixture.
 */
export declare const rtimiDentalRouteInput: ResolveRoutesInput;
/**
 * ResolveRoutesInput for the Dawajin Pro fixture.
 */
export declare const dawajinProRouteInput: ResolveRoutesInput;
/**
 * A registry with duplicate route paths, for conflict tests.
 */
export declare const duplicatePathRegistry: RouteRegistry;
/**
 * A registry with a self-redirect, for conflict tests.
 */
export declare const selfRedirectRegistry: RouteRegistry;
/**
 * A registry with a redirect loop (A -> B -> A), for conflict tests.
 */
export declare const redirectLoopRegistry: RouteRegistry;
/**
 * A registry with a warning-only diagnostic, used to prove warnings do not
 * block publication.
 */
export declare const warningOnlyRegistry: RouteRegistry;
