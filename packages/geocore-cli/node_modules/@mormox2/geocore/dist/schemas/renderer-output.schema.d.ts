import { z } from "zod";
export declare const rendererFormatSchema: z.ZodEnum<["html", "markdown", "json", "json-ld", "xml", "rss", "pdf", "llm", "search", "api", "text"]>;
export declare const rendererOutputSchema: z.ZodObject<{
    rendererId: z.ZodString;
    format: z.ZodEnum<["html", "markdown", "json", "json-ld", "xml", "rss", "pdf", "llm", "search", "api", "text"]>;
    content: z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodAny>]>;
    metadata: z.ZodObject<{
        generatedAt: z.ZodString;
        sourceObjectId: z.ZodString;
        sourceObjectVersion: z.ZodString;
        language: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        language: string;
        generatedAt: string;
        sourceObjectId: string;
        sourceObjectVersion: string;
    }, {
        language: string;
        generatedAt: string;
        sourceObjectId: string;
        sourceObjectVersion: string;
    }>;
    diagnostics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
        code: z.ZodString;
        message: z.ZodString;
        objectId: z.ZodOptional<z.ZodString>;
        rendererId: z.ZodOptional<z.ZodString>;
        field: z.ZodOptional<z.ZodString>;
        recommendation: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        objectId?: string | undefined;
        rendererId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        objectId?: string | undefined;
        rendererId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    metadata: {
        language: string;
        generatedAt: string;
        sourceObjectId: string;
        sourceObjectVersion: string;
    };
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        objectId?: string | undefined;
        rendererId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
    }[];
    content: string | Record<string, any>;
    rendererId: string;
    format: "pdf" | "html" | "markdown" | "json" | "json-ld" | "xml" | "rss" | "llm" | "search" | "api" | "text";
}, {
    metadata: {
        language: string;
        generatedAt: string;
        sourceObjectId: string;
        sourceObjectVersion: string;
    };
    diagnostics: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        objectId?: string | undefined;
        rendererId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
    }[];
    content: string | Record<string, any>;
    rendererId: string;
    format: "pdf" | "html" | "markdown" | "json" | "json-ld" | "xml" | "rss" | "llm" | "search" | "api" | "text";
}>;
