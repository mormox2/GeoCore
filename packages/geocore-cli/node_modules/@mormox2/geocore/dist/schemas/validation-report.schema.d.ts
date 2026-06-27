import { z } from "zod";
export declare const validationPipelineModeSchema: z.ZodEnum<["public", "internal"]>;
export declare const validationPipelineReportSchema: z.ZodObject<{
    id: z.ZodString;
    mode: z.ZodEnum<["public", "internal"]>;
    valid: z.ZodBoolean;
    publishable: z.ZodBoolean;
    startedAt: z.ZodString;
    finishedAt: z.ZodString;
    stages: z.ZodArray<z.ZodObject<{
        id: z.ZodEnum<["dataset", "knowledge-objects", "relationships", "metadata", "routes", "search", "schema", "llms", "sitemap", "static-export"]>;
        status: z.ZodEnum<["pending", "passed", "warning", "failed", "skipped"]>;
        valid: z.ZodBoolean;
        publishable: z.ZodBoolean;
        startedAt: z.ZodString;
        finishedAt: z.ZodString;
        issues: z.ZodArray<z.ZodObject<{
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
        summary: z.ZodObject<{
            info: z.ZodNumber;
            warnings: z.ZodNumber;
            errors: z.ZodNumber;
            critical: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            info: number;
            critical: number;
            warnings: number;
            errors: number;
        }, {
            info: number;
            critical: number;
            warnings: number;
            errors: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        issues: {
            code: string;
            message: string;
            id: string;
            severity: "info" | "warning" | "error" | "critical";
            objectId?: string | undefined;
            field?: string | undefined;
            recommendation?: string | undefined;
        }[];
        valid: boolean;
        status: "warning" | "pending" | "passed" | "failed" | "skipped";
        id: "dataset" | "search" | "metadata" | "relationships" | "llms" | "sitemap" | "routes" | "knowledge-objects" | "schema" | "static-export";
        summary: {
            info: number;
            critical: number;
            warnings: number;
            errors: number;
        };
        publishable: boolean;
        startedAt: string;
        finishedAt: string;
    }, {
        issues: {
            code: string;
            message: string;
            id: string;
            severity: "info" | "warning" | "error" | "critical";
            objectId?: string | undefined;
            field?: string | undefined;
            recommendation?: string | undefined;
        }[];
        valid: boolean;
        status: "warning" | "pending" | "passed" | "failed" | "skipped";
        id: "dataset" | "search" | "metadata" | "relationships" | "llms" | "sitemap" | "routes" | "knowledge-objects" | "schema" | "static-export";
        summary: {
            info: number;
            critical: number;
            warnings: number;
            errors: number;
        };
        publishable: boolean;
        startedAt: string;
        finishedAt: string;
    }>, "many">;
    issues: z.ZodArray<z.ZodObject<{
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
    summary: z.ZodObject<{
        stagesTotal: z.ZodNumber;
        stagesPassed: z.ZodNumber;
        stagesWarning: z.ZodNumber;
        stagesFailed: z.ZodNumber;
        stagesSkipped: z.ZodNumber;
        info: z.ZodNumber;
        warnings: z.ZodNumber;
        errors: z.ZodNumber;
        critical: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        info: number;
        critical: number;
        warnings: number;
        errors: number;
        stagesTotal: number;
        stagesPassed: number;
        stagesWarning: number;
        stagesFailed: number;
        stagesSkipped: number;
    }, {
        info: number;
        critical: number;
        warnings: number;
        errors: number;
        stagesTotal: number;
        stagesPassed: number;
        stagesWarning: number;
        stagesFailed: number;
        stagesSkipped: number;
    }>;
}, "strip", z.ZodTypeAny, {
    issues: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        objectId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
    }[];
    valid: boolean;
    id: string;
    summary: {
        info: number;
        critical: number;
        warnings: number;
        errors: number;
        stagesTotal: number;
        stagesPassed: number;
        stagesWarning: number;
        stagesFailed: number;
        stagesSkipped: number;
    };
    publishable: boolean;
    startedAt: string;
    finishedAt: string;
    mode: "public" | "internal";
    stages: {
        issues: {
            code: string;
            message: string;
            id: string;
            severity: "info" | "warning" | "error" | "critical";
            objectId?: string | undefined;
            field?: string | undefined;
            recommendation?: string | undefined;
        }[];
        valid: boolean;
        status: "warning" | "pending" | "passed" | "failed" | "skipped";
        id: "dataset" | "search" | "metadata" | "relationships" | "llms" | "sitemap" | "routes" | "knowledge-objects" | "schema" | "static-export";
        summary: {
            info: number;
            critical: number;
            warnings: number;
            errors: number;
        };
        publishable: boolean;
        startedAt: string;
        finishedAt: string;
    }[];
}, {
    issues: {
        code: string;
        message: string;
        id: string;
        severity: "info" | "warning" | "error" | "critical";
        objectId?: string | undefined;
        field?: string | undefined;
        recommendation?: string | undefined;
    }[];
    valid: boolean;
    id: string;
    summary: {
        info: number;
        critical: number;
        warnings: number;
        errors: number;
        stagesTotal: number;
        stagesPassed: number;
        stagesWarning: number;
        stagesFailed: number;
        stagesSkipped: number;
    };
    publishable: boolean;
    startedAt: string;
    finishedAt: string;
    mode: "public" | "internal";
    stages: {
        issues: {
            code: string;
            message: string;
            id: string;
            severity: "info" | "warning" | "error" | "critical";
            objectId?: string | undefined;
            field?: string | undefined;
            recommendation?: string | undefined;
        }[];
        valid: boolean;
        status: "warning" | "pending" | "passed" | "failed" | "skipped";
        id: "dataset" | "search" | "metadata" | "relationships" | "llms" | "sitemap" | "routes" | "knowledge-objects" | "schema" | "static-export";
        summary: {
            info: number;
            critical: number;
            warnings: number;
            errors: number;
        };
        publishable: boolean;
        startedAt: string;
        finishedAt: string;
    }[];
}>;
