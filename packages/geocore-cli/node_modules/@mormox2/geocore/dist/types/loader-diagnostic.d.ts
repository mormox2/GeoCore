export type LoaderDiagnosticSeverity = "info" | "warning" | "error" | "critical";
export type LoaderDiagnostic = {
    id: string;
    severity: LoaderDiagnosticSeverity;
    code: string;
    message: string;
    sourcePath?: string;
    inputId?: string;
    field?: string;
    recommendation?: string;
};
