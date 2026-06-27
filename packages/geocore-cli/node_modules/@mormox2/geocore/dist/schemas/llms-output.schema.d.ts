import { z } from "zod";
export declare const llmsOutputTypeSchema: z.ZodEnum<["llms.txt", "llms-full.txt"]>;
export declare const llmsOutputSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["llms.txt", "llms-full.txt"]>;
    siteName: z.ZodString;
    language: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    sourceObjectIds: z.ZodArray<z.ZodString, "many">;
    generatedAt: z.ZodString;
    diagnostics: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    type: "llms.txt" | "llms-full.txt";
    id: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        objectId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
    }[];
    content: string;
    generatedAt: string;
    siteName: string;
    sourceObjectIds: string[];
    language?: string | undefined;
}, {
    type: "llms.txt" | "llms-full.txt";
    id: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        objectId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
    }[];
    content: string;
    generatedAt: string;
    siteName: string;
    sourceObjectIds: string[];
    language?: string | undefined;
}>;
