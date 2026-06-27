/**
 * Severity for a static export diagnostic.
 */
export type StaticExportDiagnosticSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

/**
 * A diagnostic emitted while generating or validating a static export.
 */
export type StaticExportDiagnostic = {
  id: string;
  severity: StaticExportDiagnosticSeverity;
  code: string;
  message: string;
  assetId?: string;
  sourceId?: string;
  path?: string;
  field?: string;
  recommendation?: string;
};
