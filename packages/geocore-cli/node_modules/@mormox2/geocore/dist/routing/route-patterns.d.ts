import type { RoutePatternConfig } from "../types/route.js";
/**
 * Default route patterns. Patterns support the :language, :slug and :type
 * placeholders. There is intentionally no complex pattern engine — patterns
 * are a thin projection from validated knowledge to predictable paths.
 */
export declare const DEFAULT_ROUTE_PATTERNS: RoutePatternConfig;
/**
 * Merge a caller-provided pattern config over the defaults without mutating
 * either side.
 */
export declare function resolveRoutePatterns(override?: RoutePatternConfig): Required<RoutePatternConfig>;
