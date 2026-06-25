export type SitemapDiagnosticSeverity = "info" | "warning" | "error" | "critical";

export type SitemapDiagnostic = {
  id: string;
  severity: SitemapDiagnosticSeverity;
  code: string;
  message: string;
  sourceId?: string;
  entryId?: string;
  field?: string;
  recommendation?: string;
};
