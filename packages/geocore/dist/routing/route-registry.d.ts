import type { ResolveRoutesInput, RouteRegistry, RoutePatternConfig } from "../types/route.js";
/**
 * Resolve a full route registry from validated knowledge objects.
 *
 * The resolver:
 *   1. filters objects by visibility and language;
 *   2. resolves one route per routable object;
 *   3. applies explicit path / canonical URL overrides;
 *   4. resolves canonical URLs;
 *   5. attaches explicit alternates and redirects;
 *   6. detects conflicts;
 *   7. returns a registry with diagnostics.
 *
 * It never mutates its input.
 */
export declare function resolveRoutes(input: ResolveRoutesInput): RouteRegistry;
/**
 * Re-export the filtering helper from the registry module so callers have a
 * single import surface for orchestration helpers.
 */
export { filterRouteObjects } from "./route-filter.js";
export type { RoutePatternConfig };
