import { z } from "zod";
export const loaderDiagnosticSeveritySchema = z.enum([
    "info",
    "warning",
    "error",
    "critical",
]);
export const loaderDiagnosticSchema = z.object({
    id: z.string().min(1),
    severity: loaderDiagnosticSeveritySchema,
    code: z.string().min(1),
    message: z.string().min(1),
    sourcePath: z.string().optional(),
    inputId: z.string().optional(),
    field: z.string().optional(),
    recommendation: z.string().optional(),
});
