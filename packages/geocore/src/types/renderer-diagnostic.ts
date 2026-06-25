export type RendererDiagnosticSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export type RendererDiagnostic = {
  id: string;
  severity: RendererDiagnosticSeverity;
  code: string;
  message: string;
  objectId?: string;
  rendererId?: string;
  field?: string;
  recommendation?: string;
};
