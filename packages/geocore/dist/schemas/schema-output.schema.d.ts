import { z } from "zod";
export declare const schemaDiagnosticSeveritySchema: z.ZodEnum<["info", "warning", "error", "critical"]>;
export declare const schemaDiagnosticSchema: z.ZodObject<{
    id: z.ZodString;
    severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
    code: z.ZodString;
    message: z.ZodString;
    sourceId: z.ZodOptional<z.ZodString>;
    schemaType: z.ZodOptional<z.ZodString>;
    field: z.ZodOptional<z.ZodString>;
    recommendation: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    severity: "info" | "warning" | "error" | "critical";
    sourceId?: string | undefined;
    field?: string | undefined;
    recommendation?: string | undefined;
    schemaType?: string | undefined;
}, {
    code: string;
    message: string;
    id: string;
    severity: "info" | "warning" | "error" | "critical";
    sourceId?: string | undefined;
    field?: string | undefined;
    recommendation?: string | undefined;
    schemaType?: string | undefined;
}>;
export declare const schemaOutputSchema: z.ZodObject<{
    id: z.ZodString;
    sourceId: z.ZodString;
    sourceType: z.ZodString;
    schemaType: z.ZodString;
    jsonLd: z.ZodObject<{
        "@context": z.ZodLiteral<"https://schema.org">;
        "@type": z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        "@context": z.ZodLiteral<"https://schema.org">;
        "@type": z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        "@context": z.ZodLiteral<"https://schema.org">;
        "@type": z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
    generatedAt: z.ZodString;
    diagnostics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
        code: z.ZodString;
        message: z.ZodString;
        sourceId: z.ZodOptional<z.ZodString>;
        schemaType: z.ZodOptional<z.ZodString>;
        field: z.ZodOptional<z.ZodString>;
        recommendation: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        schemaType?: string | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        schemaType?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    sourceId: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        schemaType?: string | undefined;
    }[];
    generatedAt: string;
    sourceType: string;
    schemaType: string;
    jsonLd: {
        "@context": "https://schema.org";
        "@type": string;
    } & {
        [k: string]: unknown;
    };
}, {
    id: string;
    sourceId: string;
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        sourceId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
        schemaType?: string | undefined;
    }[];
    generatedAt: string;
    sourceType: string;
    schemaType: string;
    jsonLd: {
        "@context": "https://schema.org";
        "@type": string;
    } & {
        [k: string]: unknown;
    };
}>;
