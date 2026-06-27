export type LlmsDiagnosticSeverity = "info" | "warning" | "error" | "critical";
export type LlmsDiagnostic = {
    id: string;
    severity: LlmsDiagnosticSeverity;
    code: string;
    message: string;
    objectId?: string;
    field?: string;
    recommendation?: string;
};
