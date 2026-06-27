export type SchemaDiagnosticSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export type SchemaDiagnostic = {
  id: string;
  severity: SchemaDiagnosticSeverity;
  code: string;
  message: string;
  sourceId?: string;
  schemaType?: string;
  field?: string;
  recommendation?: string;
};
