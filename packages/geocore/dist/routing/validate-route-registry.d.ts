import type { RouteRegistry } from "../types/route.js";
import type { ValidationResult } from "../validation/validation-result.js";
/**
 * Validate a full route registry: structural shape, per-route validation,
 * and cross-route conflict detection (duplicate ids / paths / canonical URLs,
 * redirect loops and self-redirects).
 *
 * Any error or critical issue makes the registry non-publishable; warnings do not.
 */
export declare function validateRouteRegistry(registry: RouteRegistry): ValidationResult;
