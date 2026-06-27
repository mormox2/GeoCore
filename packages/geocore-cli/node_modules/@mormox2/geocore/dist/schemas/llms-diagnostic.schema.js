import { z } from "zod";
export const llmsDiagnosticSeveritySchema = z.enum(["info", "warning", "error", "critical"]);
export const llmsDiagnosticSchema = z.object({
    id: z.string().min(1),
    severity: llmsDiagnosticSeveritySchema,
    code: z.string().min(1),
    message: z.string().min(1),
    objectId: z.string().optional(),
    field: z.string().optional(),
    recommendation: z.string().optional(),
});
