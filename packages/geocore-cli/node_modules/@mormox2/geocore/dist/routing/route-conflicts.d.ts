import type { RouteEntry } from "../types/route-entry.js";
import type { RouteDiagnostic } from "../types/route-diagnostic.js";
/**
 * Detect duplicate route ids, duplicate paths, duplicate canonical URLs,
 * redirect loops, and self-redirects across the given routes.
 *
 * Severity rules:
 * - duplicate id / path / canonical URL -> error
 * - redirect loop -> critical
 * - self-redirect -> error
 */
export declare function detectRouteConflicts(routes: RouteEntry[]): RouteDiagnostic[];
