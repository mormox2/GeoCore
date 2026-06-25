import type { RouteEntry } from "../types/route-entry.js";
import type { ValidationResult, ValidationIssue } from "../validation/validation-result.js";
import { routeEntrySchema } from "../schemas/route-entry.schema.js";
import * as codes from "../validation/validation-codes.js";
import { isValidRoutePath, isValidCanonicalUrl } from "./route-utils.js";

const VALID_TYPES = new Set([
  "knowledge-object",
  "collection",
  "glossary-entry",
  "documentation",
  "media",
  "api",
  "llms",
  "sitemap",
  "static",
]);
const VALID_STATUSES = new Set(["draft", "review", "published", "archived"]);
const VALID_VISIBILITIES = new Set(["public", "internal", "private", "hidden"]);

/**
 * Validate a single route entry for structural correctness.
 * Any error or critical issue makes the route non-publishable.
 */
export function validateRouteEntry(route: RouteEntry): ValidationResult {
  const checkedAt = new Date().toISOString();
  const issues: ValidationIssue[] = [];

  if (!route || typeof route !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [
        {
          id: `${codes.GC_ROUTE_ID_MISSING}_root`,
          severity: "critical",
          code: codes.GC_ROUTE_ID_MISSING,
          message: "RouteEntry must be a non-null object.",
        },
      ],
    };
  }

  // 1. id
  if (!route.id || typeof route.id !== "string" || route.id.trim() === "") {
    issues.push({
      id: `${codes.GC_ROUTE_ID_MISSING}_id`,
      severity: "error",
      code: codes.GC_ROUTE_ID_MISSING,
      message: "RouteEntry id is missing.",
      field: "id",
    });
  }

  // 2. sourceId
  if (!route.sourceId || typeof route.sourceId !== "string" || route.sourceId.trim() === "") {
    issues.push({
      id: `${codes.GC_ROUTE_SOURCE_ID_MISSING}_${route.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_SOURCE_ID_MISSING,
      message: "RouteEntry sourceId is missing.",
      field: "sourceId",
    });
  }

  // 3. sourceType
  if (!route.sourceType || typeof route.sourceType !== "string" || route.sourceType.trim() === "") {
    issues.push({
      id: `${codes.GC_ROUTE_SOURCE_TYPE_MISSING}_${route.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_SOURCE_TYPE_MISSING,
      message: "RouteEntry sourceType is missing.",
      field: "sourceType",
    });
  }

  // 4. type
  if (!VALID_TYPES.has(route.type)) {
    issues.push({
      id: `${codes.GC_ROUTE_TYPE_INVALID}_${route.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_TYPE_INVALID,
      message: `RouteEntry type "${route.type}" is not valid.`,
      field: "type",
    });
  }

  // 5. path present
  if (!route.path || typeof route.path !== "string" || route.path.trim() === "") {
    issues.push({
      id: `${codes.GC_ROUTE_PATH_MISSING}_${route.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_PATH_MISSING,
      message: "RouteEntry path is missing.",
      field: "path",
    });
  } else if (!isValidRoutePath(route.path)) {
    // 6. path shape
    issues.push({
      id: `${codes.GC_ROUTE_PATH_INVALID}_${route.id}`,
      severity: "error",
      code: codes.GC_ROUTE_PATH_INVALID,
      message: `RouteEntry path "${route.path}" is not valid.`,
      field: "path",
    });
  }

  // 7. canonicalUrl
  if (route.canonicalUrl !== undefined) {
    if (!isValidCanonicalUrl(route.canonicalUrl)) {
      issues.push({
        id: `${codes.GC_ROUTE_CANONICAL_URL_INVALID}_${route.id}`,
        severity: "error",
        code: codes.GC_ROUTE_CANONICAL_URL_INVALID,
        message: `RouteEntry canonicalUrl "${route.canonicalUrl}" is not a valid absolute URL.`,
        field: "canonicalUrl",
      });
    }
  }

  // 8. status
  if (!VALID_STATUSES.has(route.status)) {
    issues.push({
      id: `${codes.GC_ROUTE_STATUS_INVALID}_${route.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_STATUS_INVALID,
      message: `RouteEntry status "${route.status}" is not valid.`,
      field: "status",
    });
  }

  // 9. visibility
  if (!VALID_VISIBILITIES.has(route.visibility)) {
    issues.push({
      id: `${codes.GC_ROUTE_VISIBILITY_INVALID}_${route.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_VISIBILITY_INVALID,
      message: `RouteEntry visibility "${route.visibility}" is not valid.`,
      field: "visibility",
    });
  }

  // 10. public route must have public visibility
  if (route.status === "published" && route.visibility !== "public") {
    issues.push({
      id: `${codes.GC_ROUTE_PUBLIC_VISIBILITY_INVALID}_${route.id}`,
      severity: "error",
      code: codes.GC_ROUTE_PUBLIC_VISIBILITY_INVALID,
      message: `Published route "${route.id}" must have public visibility.`,
      field: "visibility",
    });
  }

  // 11. alternates
  if (!Array.isArray(route.alternates)) {
    issues.push({
      id: `${codes.GC_ROUTE_ALTERNATES_INVALID}_${route.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_ALTERNATES_INVALID,
      message: "RouteEntry alternates must be an array.",
      field: "alternates",
    });
  }

  // 12. redirects
  if (!Array.isArray(route.redirects)) {
    issues.push({
      id: `${codes.GC_ROUTE_REDIRECTS_INVALID}_${route.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_REDIRECTS_INVALID,
      message: "RouteEntry redirects must be an array.",
      field: "redirects",
    });
  }

  // 13. generatedAt
  if (!route.generatedAt || typeof route.generatedAt !== "string" || route.generatedAt.trim() === "") {
    issues.push({
      id: `${codes.GC_ROUTE_GENERATED_AT_MISSING}_${route.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_GENERATED_AT_MISSING,
      message: "RouteEntry generatedAt is missing.",
      field: "generatedAt",
    });
  }

  // 14. Zod schema validation — catch any remaining shape issues.
  const zodResult = routeEntrySchema.safeParse(route);
  if (!zodResult.success) {
    for (const zodIssue of zodResult.error.issues) {
      const field = zodIssue.path.join(".");
      const alreadyExists = issues.some((i) => i.field === field);
      if (!alreadyExists) {
        issues.push({
          id: `GC_ROUTE_ZOD_${field || "field"}_${issues.length}`,
          severity: "error",
          code: codes.GC_ROUTE_TYPE_INVALID,
          message: zodIssue.message,
          field: field || undefined,
        });
      }
    }
  }

  const hasErrors = issues.some((i) => i.severity === "error" || i.severity === "critical");
  return {
    valid: !hasErrors,
    publishable: !hasErrors,
    issues,
    checkedAt,
  };
}
