import type { RouteRegistry } from "../types/route.js";
import type { RouteDiagnostic } from "../types/route-diagnostic.js";
import type { ValidationResult, ValidationIssue } from "../validation/validation-result.js";
import { routeRegistrySchema } from "../schemas/route-registry.schema.js";
import * as codes from "../validation/validation-codes.js";
import { validateRouteEntry } from "./validate-route-entry.js";

function diagnosticToIssue(diagnostic: RouteDiagnostic, index: number): ValidationIssue {
  // Map route-diagnostic severities onto the validation severity scale.
  // Critical redirect loops must make the registry non-publishable.
  let severity: ValidationIssue["severity"];
  switch (diagnostic.severity) {
    case "critical":
      severity = "critical";
      break;
    case "error":
      severity = "error";
      break;
    case "warning":
      severity = "warning";
      break;
    default:
      severity = "info";
  }
  return {
    id: diagnostic.id || `route-issue-${index}`,
    severity,
    code: diagnostic.code,
    message: diagnostic.message,
    objectId: diagnostic.sourceId,
    field: diagnostic.field,
    recommendation: diagnostic.recommendation,
  };
}

/**
 * Validate a full route registry: structural shape, per-route validation,
 * and cross-route conflict detection (duplicate ids / paths / canonical URLs,
 * redirect loops and self-redirects).
 *
 * Any error or critical issue makes the registry non-publishable; warnings do not.
 */
export function validateRouteRegistry(registry: RouteRegistry): ValidationResult {
  const checkedAt = new Date().toISOString();
  const issues: ValidationIssue[] = [];

  if (!registry || typeof registry !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [
        {
          id: `${codes.GC_ROUTE_REGISTRY_ID_MISSING}_root`,
          severity: "critical",
          code: codes.GC_ROUTE_REGISTRY_ID_MISSING,
          message: "RouteRegistry must be a non-null object.",
        },
      ],
    };
  }

  // 1. registry id
  if (!registry.id || typeof registry.id !== "string" || registry.id.trim() === "") {
    issues.push({
      id: `${codes.GC_ROUTE_REGISTRY_ID_MISSING}_id`,
      severity: "error",
      code: codes.GC_ROUTE_REGISTRY_ID_MISSING,
      message: "RouteRegistry id is missing.",
      field: "id",
    });
  }

  // 2. routes array
  if (!Array.isArray(registry.routes)) {
    issues.push({
      id: `${codes.GC_ROUTE_REGISTRY_ROUTES_INVALID}_${registry.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_REGISTRY_ROUTES_INVALID,
      message: "RouteRegistry routes must be an array.",
      field: "routes",
    });
  }

  // 3. generatedAt
  if (!registry.generatedAt || typeof registry.generatedAt !== "string" || registry.generatedAt.trim() === "") {
    issues.push({
      id: `${codes.GC_ROUTE_REGISTRY_GENERATED_AT_MISSING}_${registry.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_REGISTRY_GENERATED_AT_MISSING,
      message: "RouteRegistry generatedAt is missing.",
      field: "generatedAt",
    });
  }

  // 4. diagnostics array
  if (!Array.isArray(registry.diagnostics)) {
    issues.push({
      id: `${codes.GC_ROUTE_REGISTRY_DIAGNOSTICS_INVALID}_${registry.id || "unknown"}`,
      severity: "error",
      code: codes.GC_ROUTE_REGISTRY_DIAGNOSTICS_INVALID,
      message: "RouteRegistry diagnostics must be an array.",
      field: "diagnostics",
    });
  }

  // 5. per-route validation
  if (Array.isArray(registry.routes)) {
    for (const route of registry.routes) {
      const routeResult = validateRouteEntry(route);
      issues.push(...routeResult.issues);
    }

    // 6. conflict detection (duplicates + redirect loops/self)
    const idCounts = new Map<string, number>();
    const pathCounts = new Map<string, number>();
    const canonicalCounts = new Map<string, number>();
    for (const route of registry.routes) {
      if (route?.id) idCounts.set(route.id, (idCounts.get(route.id) ?? 0) + 1);
      if (route?.path) pathCounts.set(route.path, (pathCounts.get(route.path) ?? 0) + 1);
      if (route?.canonicalUrl)
        canonicalCounts.set(route.canonicalUrl, (canonicalCounts.get(route.canonicalUrl) ?? 0) + 1);
    }
    for (const [id, count] of idCounts) {
      if (count > 1) {
        issues.push({
          id: `${codes.GC_ROUTE_ID_DUPLICATE}_${id}`,
          severity: "error",
          code: codes.GC_ROUTE_ID_DUPLICATE,
          message: `Duplicate route id "${id}" found ${count} times.`,
          field: "id",
        });
      }
    }
    for (const [path, count] of pathCounts) {
      if (count > 1) {
        issues.push({
          id: `${codes.GC_ROUTE_PATH_DUPLICATE}_${path}`,
          severity: "error",
          code: codes.GC_ROUTE_PATH_DUPLICATE,
          message: `Duplicate route path "${path}" found ${count} times.`,
          field: "path",
        });
      }
    }
    for (const [canonical, count] of canonicalCounts) {
      if (count > 1) {
        issues.push({
          id: `${codes.GC_ROUTE_CANONICAL_URL_DUPLICATE}_${canonical}`,
          severity: "error",
          code: codes.GC_ROUTE_CANONICAL_URL_DUPLICATE,
          message: `Duplicate canonical URL "${canonical}" found ${count} times.`,
          field: "canonicalUrl",
        });
      }
    }

    // 7. redirect loops / self-redirects (from the registry's own diagnostics
    //    if present, otherwise inferred here).
    const fromTo = new Map<string, Set<string>>();
    for (const route of registry.routes) {
      for (const redirect of route.redirects ?? []) {
        if (!fromTo.has(redirect.from)) fromTo.set(redirect.from, new Set());
        fromTo.get(redirect.from)!.add(redirect.to);
        if (redirect.from === redirect.to) {
          issues.push({
            id: `${codes.GC_ROUTE_REDIRECT_SELF}_${route.id}_${redirect.from}`,
            severity: "error",
            code: codes.GC_ROUTE_REDIRECT_SELF,
            message: `Redirect source equals target ("${redirect.from}").`,
            field: "redirects",
          });
        }
      }
    }
    for (const start of fromTo.keys()) {
      if (hasCycleFrom(start, fromTo)) {
        issues.push({
          id: `${codes.GC_ROUTE_REDIRECT_LOOP}_${start}`,
          severity: "critical",
          code: codes.GC_ROUTE_REDIRECT_LOOP,
          message: `Redirect loop detected starting from "${start}".`,
          field: "redirects",
        });
        break; // one loop diagnostic is enough to flag the registry
      }
    }
  }

  // 8. Surface any diagnostics already attached to the registry.
  if (Array.isArray(registry.diagnostics)) {
    registry.diagnostics.forEach((d, i) => {
      // Only surface diagnostics that aren't already represented as issues.
      const exists = issues.some((issue) => issue.code === d.code);
      if (!exists) issues.push(diagnosticToIssue(d, i));
    });
  }

  // 9. Zod schema validation of the registry shape.
  const zodResult = routeRegistrySchema.safeParse(registry);
  if (!zodResult.success) {
    for (const zodIssue of zodResult.error.issues) {
      const field = zodIssue.path.join(".");
      const alreadyExists = issues.some((i) => i.field === field);
      if (!alreadyExists) {
        issues.push({
          id: `GC_ROUTE_REGISTRY_ZOD_${field || "field"}_${issues.length}`,
          severity: "error",
          code: codes.GC_ROUTE_REGISTRY_ROUTES_INVALID,
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

function hasCycleFrom(start: string, fromTo: Map<string, Set<string>>): boolean {
  const visited = new Set<string>();
  const onStack = new Set<string>();

  const dfs = (node: string): boolean => {
    visited.add(node);
    onStack.add(node);
    const neighbors = fromTo.get(node);
    if (neighbors) {
      for (const next of neighbors) {
        if (!visited.has(next)) {
          if (dfs(next)) return true;
        } else if (onStack.has(next)) {
          return true;
        }
      }
    }
    onStack.delete(node);
    return false;
  };

  return dfs(start);
}
