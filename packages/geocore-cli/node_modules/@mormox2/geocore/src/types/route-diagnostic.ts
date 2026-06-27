/**
 * Severity for a route diagnostic. Mirrors the broader validation severities
 * so diagnostics stay readable by humans and machines.
 */
export type RouteDiagnosticSeverity = "info" | "warning" | "error" | "critical";

/**
 * A diagnostic emitted while resolving or validating routes.
 */
export type RouteDiagnostic = {
  id: string;
  severity: RouteDiagnosticSeverity;
  code: string;
  message: string;
  sourceId?: string;
  routeId?: string;
  path?: string;
  field?: string;
  recommendation?: string;
};
