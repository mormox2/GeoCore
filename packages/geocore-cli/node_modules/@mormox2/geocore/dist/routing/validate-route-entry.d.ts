import type { RouteEntry } from "../types/route-entry.js";
import type { ValidationResult } from "../validation/validation-result.js";
/**
 * Validate a single route entry for structural correctness.
 * Any error or critical issue makes the route non-publishable.
 */
export declare function validateRouteEntry(route: RouteEntry): ValidationResult;
