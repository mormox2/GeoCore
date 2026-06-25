import { z } from "zod";
export declare const llmsDiagnosticSeveritySchema: z.ZodEnum<["info", "warning", "error", "critical"]>;
export declare const llmsDiagnosticSchema: z.ZodObject<{
    id: z.ZodString;
    severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
    code: z.ZodString;
    message: z.ZodString;
    objectId: z.ZodOptional<z.ZodString>;
    field: z.ZodOptional<z.ZodString>;
    recommendation: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    severity: "info" | "warning" | "error" | "critical";
    objectId?: string | undefined;
    field?: string | undefined;
    recommendation?: string | undefined;
}, {
    code: string;
    message: string;
    id: string;
    severity: "info" | "warning" | "error" | "critical";
    objectId?: string | undefined;
    field?: string | undefined;
    recommendation?: string | undefined;
}>;
