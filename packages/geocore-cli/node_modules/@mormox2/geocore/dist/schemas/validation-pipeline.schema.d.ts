import { z } from "zod";
export declare const validationPipelineConfigSchema: z.ZodObject<{
    mode: z.ZodOptional<z.ZodEnum<["public", "internal"]>>;
    stages: z.ZodOptional<z.ZodRecord<z.ZodEnum<["dataset", "knowledge-objects", "relationships", "metadata", "routes", "search", "schema", "llms", "sitemap", "static-export"]>, z.ZodBoolean>>;
    requiredStages: z.ZodOptional<z.ZodArray<z.ZodEnum<["dataset", "knowledge-objects", "relationships", "metadata", "routes", "search", "schema", "llms", "sitemap", "static-export"]>, "many">>;
    failFast: z.ZodOptional<z.ZodBoolean>;
    language: z.ZodOptional<z.ZodString>;
    siteName: z.ZodOptional<z.ZodString>;
    siteUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    language?: string | undefined;
    siteName?: string | undefined;
    siteUrl?: string | undefined;
    mode?: "public" | "internal" | undefined;
    stages?: Partial<Record<"dataset" | "search" | "metadata" | "relationships" | "llms" | "sitemap" | "routes" | "knowledge-objects" | "schema" | "static-export", boolean>> | undefined;
    requiredStages?: ("dataset" | "search" | "metadata" | "relationships" | "llms" | "sitemap" | "routes" | "knowledge-objects" | "schema" | "static-export")[] | undefined;
    failFast?: boolean | undefined;
}, {
    language?: string | undefined;
    siteName?: string | undefined;
    siteUrl?: string | undefined;
    mode?: "public" | "internal" | undefined;
    stages?: Partial<Record<"dataset" | "search" | "metadata" | "relationships" | "llms" | "sitemap" | "routes" | "knowledge-objects" | "schema" | "static-export", boolean>> | undefined;
    requiredStages?: ("dataset" | "search" | "metadata" | "relationships" | "llms" | "sitemap" | "routes" | "knowledge-objects" | "schema" | "static-export")[] | undefined;
    failFast?: boolean | undefined;
}>;
